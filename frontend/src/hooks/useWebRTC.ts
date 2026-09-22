'use client';
import { useEffect, useRef, useState } from 'react';

export type TransferState = 'idle' | 'waiting' | 'transferring' | 'completed' | 'error';

export function useWebRTC(roomId: string, role: 'sender' | 'receiver', file?: File | null) {
  const [transferState, setTransferState] = useState<TransferState>('idle');
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState('0 MB/s');
  
  const wsRef = useRef<WebSocket | null>(null);
  const rtcRef = useRef<RTCPeerConnection | null>(null);
  const channelRef = useRef<RTCDataChannel | null>(null);
  const fileRef = useRef<File | null | undefined>(file);
  const iceQueueRef = useRef<RTCIceCandidateInit[]>([]);
  
  const bytesTransferredRef = useRef(0);
  const lastTimeRef = useRef(Date.now());
  const lastBytesRef = useRef(0);

  const receivedBuffersRef = useRef<ArrayBuffer[]>([]);
  const expectedSizeRef = useRef(0);
  const expectedNameRef = useRef('shared_file');

  useEffect(() => {
    fileRef.current = file;
  }, [file]);

  useEffect(() => {
    if (!roomId) return;

    const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080/ws/signaling';
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = async () => {
      ws.send(JSON.stringify({ type: 'join', roomId }));
      await initWebRTC();
      
      if (role === 'sender') {
        setTransferState('waiting');
      } else {
        ws.send(JSON.stringify({ type: 'ready', roomId }));
      }
    };

    ws.onmessage = async (event) => {
      const message = JSON.parse(event.data);
      if (!rtcRef.current) return;

      try {
        if (message.type === 'ready' && role === 'sender') {
          const offer = await rtcRef.current.createOffer();
          await rtcRef.current.setLocalDescription(offer);
          ws.send(JSON.stringify({ type: 'offer', roomId, offer }));
        }
        else if (message.type === 'offer' && role === 'receiver') {
          await rtcRef.current.setRemoteDescription(new RTCSessionDescription(message.offer));
          const answer = await rtcRef.current.createAnswer();
          await rtcRef.current.setLocalDescription(answer);
          ws.send(JSON.stringify({ type: 'answer', roomId, answer }));
          await processIceQueue();
        } 
        else if (message.type === 'answer' && role === 'sender') {
          await rtcRef.current.setRemoteDescription(new RTCSessionDescription(message.answer));
          await processIceQueue();
        } 
        else if (message.type === 'candidate') {
          if (rtcRef.current.remoteDescription && rtcRef.current.remoteDescription.type) {
            await rtcRef.current.addIceCandidate(new RTCIceCandidate(message.candidate));
          } else {
            iceQueueRef.current.push(message.candidate);
          }
        }
      } catch (err) {
        console.error('[CandyShare] Signaling Error:', err);
      }
    };

    return () => {
      ws.close();
      rtcRef.current?.close();
    };
  }, [roomId, role]);

  const processIceQueue = async () => {
    if (!rtcRef.current || !rtcRef.current.remoteDescription) return;
    for (const cand of iceQueueRef.current) {
      try {
        await rtcRef.current.addIceCandidate(new RTCIceCandidate(cand));
      } catch (e) {
        console.error('[CandyShare] Error adding queued ICE candidate', e);
      }
    }
    iceQueueRef.current = [];
  };

  const initWebRTC = async () => {
    let iceServers: RTCIceServer[] = [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ];

    const apiKey = process.env.NEXT_METERED_API_KEY;
    const domain = process.env.NEXT_PUBLIC_METERED_DOMAIN || 'candyshare.metered.live';

    if (apiKey) {
      try {
        const response = await fetch(`https://${domain}/api/v1/turn/credentials?apiKey=${apiKey}`);
        if (response.ok) {
          const meteredIceServers = await response.json();
          iceServers = meteredIceServers;
        }
      } catch (err) {
        console.error('[CandyShare] Failed to fetch Metered TURN servers, falling back to STUN:', err);
      }
    }

    const configuration: RTCConfiguration = { 
      iceServers,
      iceCandidatePoolSize: 10
    };

    const peerConnection = new RTCPeerConnection(configuration);
    rtcRef.current = peerConnection;

    peerConnection.onicecandidate = (event) => {
      if (event.candidate && wsRef.current) {
        wsRef.current.send(JSON.stringify({ type: 'candidate', roomId, candidate: event.candidate }));
      }
    };

    if (role === 'sender') {
      const dataChannel = peerConnection.createDataChannel('candyChannel', { ordered: true });
      setupDataChannel(dataChannel);
    } else {
      peerConnection.ondatachannel = (event) => {
        setupDataChannel(event.channel);
      };
    }
  };

  const setupDataChannel = (channel: RTCDataChannel) => {
    channel.binaryType = 'arraybuffer';
    channelRef.current = channel;

    channel.onopen = () => {
      if (role === 'sender' && fileRef.current) {
        sendFile(fileRef.current);
      }
    };

    channel.onmessage = (event) => {
      if (typeof event.data === 'string') {
        const meta = JSON.parse(event.data);
        expectedNameRef.current = meta.name;
        expectedSizeRef.current = meta.size;
        setTransferState('transferring');
        
        lastTimeRef.current = Date.now();
        lastBytesRef.current = 0;
        bytesTransferredRef.current = 0;
      } else {
        receivedBuffersRef.current.push(event.data);
        bytesTransferredRef.current += event.data.byteLength;
        
        updateProgress(bytesTransferredRef.current, expectedSizeRef.current);

        if (bytesTransferredRef.current >= expectedSizeRef.current && expectedSizeRef.current > 0) {
          assembleAndDownload();
        }
      }
    };
  };

  const updateProgress = (current: number, total: number) => {
    if (total === 0) return;
    setProgress((current / total) * 100);
    
    const now = Date.now();
    const timeDiff = (now - lastTimeRef.current) / 1000;
    if (timeDiff >= 0.5) {
      const bytesDiff = current - lastBytesRef.current;
      const speedMbps = (bytesDiff / 1024 / 1024) / timeDiff;
      setSpeed(`${speedMbps.toFixed(1)} MB/s`);
      lastTimeRef.current = now;
      lastBytesRef.current = current;
    }
  };

  const sendFile = (fileToSend: File) => {
    if (!channelRef.current || channelRef.current.readyState !== 'open') return;
    
    setTransferState('transferring');
    channelRef.current.send(JSON.stringify({ type: 'meta', name: fileToSend.name, size: fileToSend.size }));

    const chunkSize = 64 * 1024;
    const MAX_BUFFER = 1024 * 1024;
    let offset = 0;
    
    bytesTransferredRef.current = 0;
    lastTimeRef.current = Date.now();
    lastBytesRef.current = 0;

    const fileReader = new FileReader();
    channelRef.current.bufferedAmountLowThreshold = chunkSize;

    fileReader.onload = (e) => {
      if (!channelRef.current) return;
      
      try {
        channelRef.current.send(e.target?.result as ArrayBuffer);
        offset += chunkSize;
        bytesTransferredRef.current = offset;
        
        updateProgress(offset > fileToSend.size ? fileToSend.size : offset, fileToSend.size);

        if (offset < fileToSend.size) {
          if (channelRef.current.bufferedAmount > MAX_BUFFER) {
            channelRef.current.onbufferedamountlow = () => {
              channelRef.current!.onbufferedamountlow = null; 
              readSlice(offset); 
            };
          } else {
            readSlice(offset);
          }
        } else {
          setTimeout(() => setTransferState('completed'), 500);
        }
      } catch (err) {
        console.error('[CandyShare] Transfer failed:', err);
      }
    };

    const readSlice = (o: number) => {
      const slice = fileToSend.slice(o, o + chunkSize);
      fileReader.readAsArrayBuffer(slice);
    };

    readSlice(0);
  };

  const assembleAndDownload = () => {
    const blob = new Blob(receivedBuffersRef.current);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = expectedNameRef.current;
    a.click();
    URL.revokeObjectURL(url);
    
    setTransferState('completed');
  };

  const reset = () => {
    setTransferState('idle');
    setProgress(0);
    setSpeed('0 MB/s');
    receivedBuffersRef.current = [];
  };

  return { transferState, progress, speed, reset, downloadFile: assembleAndDownload };
}
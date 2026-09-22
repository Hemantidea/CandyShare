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
    console.log(`[CandyShare] Connecting to signaling: ${WS_URL} for room: ${roomId}`);
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('[CandyShare] WebSocket Connected');
      ws.send(JSON.stringify({ type: 'join', roomId }));
      initWebRTC();
      
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
          console.log('[CandyShare] Receiver is ready. Creating Offer...');
          const offer = await rtcRef.current.createOffer();
          await rtcRef.current.setLocalDescription(offer);
          ws.send(JSON.stringify({ type: 'offer', roomId, offer }));
        }
        else if (message.type === 'offer' && role === 'receiver') {
          console.log('[CandyShare] Received Offer. Creating Answer...');
          await rtcRef.current.setRemoteDescription(new RTCSessionDescription(message.offer));
          const answer = await rtcRef.current.createAnswer();
          await rtcRef.current.setLocalDescription(answer);
          ws.send(JSON.stringify({ type: 'answer', roomId, answer }));
          await processIceQueue();
        } 
        else if (message.type === 'answer' && role === 'sender') {
          console.log('[CandyShare] Received Answer. Establishing P2P Connection...');
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

  const initWebRTC = () => {
    const turnUrl = process.env.NEXT_PUBLIC_TURN_URL || 'turn:global.relay.metered.ca:443';
    const turnUser = process.env.NEXT_PUBLIC_TURN_USERNAME || 'openrelayproject';
    const turnPass = process.env.NEXT_PUBLIC_TURN_CREDENTIAL || 'openrelayproject';

    const configuration: RTCConfiguration = { 
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun.relay.metered.ca:80' },
        { 
          urls: [
            turnUrl,
            `${turnUrl}?transport=tcp`,
            'turn:global.relay.metered.ca:80',
            'turn:global.relay.metered.ca:80?transport=tcp'
          ],
          username: turnUser,
          credential: turnPass
        }
      ],
      iceCandidatePoolSize: 10
    };

    const peerConnection = new RTCPeerConnection(configuration);
    rtcRef.current = peerConnection;

    peerConnection.oniceconnectionstatechange = () => {
      console.log(`[CandyShare] ICE State: ${peerConnection.iceConnectionState}`);
    };

    peerConnection.onconnectionstatechange = () => {
      console.log(`[CandyShare] Peer Connection State: ${peerConnection.connectionState}`);
    };

    peerConnection.onicecandidate = (event) => {
      if (event.candidate && wsRef.current) {
        wsRef.current.send(JSON.stringify({ type: 'candidate', roomId, candidate: event.candidate }));
      }
    };

    if (role === 'sender') {
      const dataChannel = peerConnection.createDataChannel('candyChannel', {
        ordered: true
      });
      setupDataChannel(dataChannel);
    } else {
      peerConnection.ondatachannel = (event) => {
        console.log('[CandyShare] Receiver DataChannel Received!');
        setupDataChannel(event.channel);
      };
    }
  };

  const setupDataChannel = (channel: RTCDataChannel) => {
    channel.binaryType = 'arraybuffer';
    channelRef.current = channel;

    channel.onopen = () => {
      console.log('[CandyShare] DataChannel is OPEN!');
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
    if (!channelRef.current || channelRef.current.readyState !== 'open') {
      console.warn('[CandyShare] Cannot send file, channel not open');
      return;
    }
    
    console.log(`[CandyShare] Starting transfer for: ${fileToSend.name} (${fileToSend.size} bytes)`);
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
          console.log('[CandyShare] File Transfer Complete!');
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
    console.log('[CandyShare] Assembling file and triggering download...');
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
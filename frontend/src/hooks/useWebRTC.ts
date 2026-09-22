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
  
  const bytesTransferredRef = useRef(0);
  const lastTimeRef = useRef(Date.now());
  const lastBytesRef = useRef(0);

  const receivedBuffersRef = useRef<ArrayBuffer[]>([]);
  const expectedSizeRef = useRef(0);
  const expectedNameRef = useRef('shared_file');

  useEffect(() => {
    if (!roomId) return;

    const ws = new WebSocket('ws://localhost:8080/ws/signaling');
    wsRef.current = ws;

    ws.onopen = () => {
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
          const offer = await rtcRef.current.createOffer();
          await rtcRef.current.setLocalDescription(offer);
          ws.send(JSON.stringify({ type: 'offer', roomId, offer }));
        }
        else if (message.type === 'offer' && role === 'receiver') {
          await rtcRef.current.setRemoteDescription(new RTCSessionDescription(message.offer));
          const answer = await rtcRef.current.createAnswer();
          await rtcRef.current.setLocalDescription(answer);
          ws.send(JSON.stringify({ type: 'answer', roomId, answer }));
        } 
        else if (message.type === 'answer' && role === 'sender') {
          await rtcRef.current.setRemoteDescription(new RTCSessionDescription(message.answer));
        } 
        else if (message.type === 'candidate') {
          await rtcRef.current.addIceCandidate(new RTCIceCandidate(message.candidate));
        }
      } catch (err) {
        console.error("WebRTC Error:", err);
      }
    };

    return () => {
      ws.close();
      rtcRef.current?.close();
    };
  }, [roomId, role]);

  const initWebRTC = () => {
    const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
    const peerConnection = new RTCPeerConnection(configuration);
    rtcRef.current = peerConnection;

    peerConnection.onicecandidate = (event) => {
      if (event.candidate && wsRef.current) {
        wsRef.current.send(JSON.stringify({ type: 'candidate', roomId, candidate: event.candidate }));
      }
    };

    if (role === 'sender') {
      const dataChannel = peerConnection.createDataChannel('candyChannel');
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
      if (role === 'sender' && file) {
        sendFile(file);
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

        if (bytesTransferredRef.current === expectedSizeRef.current) {
          assembleAndDownload();
        }
      }
    };
  };

  const updateProgress = (current: number, total: number) => {
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

    const chunkSize = 64 * 1024; // 64KB chunks
    const MAX_BUFFER = 1024 * 1024; // 1MB Buffer limit
    let offset = 0;
    
    bytesTransferredRef.current = 0;
    lastTimeRef.current = Date.now();
    lastBytesRef.current = 0;

    const fileReader = new FileReader();

    // Tell WebRTC to notify us when the buffer drops below 64KB
    channelRef.current.bufferedAmountLowThreshold = chunkSize;

    fileReader.onload = (e) => {
      if (!channelRef.current) return;
      
      try {
        channelRef.current.send(e.target?.result as ArrayBuffer);
        offset += chunkSize;
        bytesTransferredRef.current = offset;
        
        updateProgress(offset > fileToSend.size ? fileToSend.size : offset, fileToSend.size);

        if (offset < fileToSend.size) {
          // --- BACKPRESSURE LOGIC ---
          if (channelRef.current.bufferedAmount > MAX_BUFFER) {
            // The tube is full! Pause and wait for it to drain.
            channelRef.current.onbufferedamountlow = () => {
              channelRef.current!.onbufferedamountlow = null; // unbind event
              readSlice(offset); // Resume reading
            };
          } else {
            // Tube is clear, keep pushing data
            readSlice(offset);
          }
        } else {
          setTimeout(() => setTransferState('completed'), 500);
        }
      } catch (err) {
        console.error("Transfer failed:", err);
      }
    };

    const readSlice = (o: number) => {
      const slice = fileToSend.slice(o, o + chunkSize);
      fileReader.readAsArrayBuffer(slice);
    };

    readSlice(0); // Start the engine
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
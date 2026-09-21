'use client';
import React, { useState, useRef, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useLanguage } from '@/context/LanguageContext';

export default function SenderBox() {
  const { t } = useLanguage();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [roomId, setRoomId] = useState<string>('');
  const [shareLink, setShareLink] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (file) {
      const newRoomId = Math.random().toString(36).substring(2, 8);
      setRoomId(newRoomId);
      setShareLink(`${window.location.origin}/receive/${newRoomId}`);
    }
  }, [file]);

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white p-6 rounded-[2.5rem] shadow-2xl w-full max-w-[360px] aspect-square relative overflow-hidden flex flex-col transition-all duration-500">
      {!file ? (
        <>
          <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileSelect} />
          <div 
            onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`w-full h-full rounded-[2rem] border-4 border-dashed flex flex-col items-center justify-center text-center p-6 transition-all duration-300 cursor-pointer
              ${isDragging ? 'border-brand-500 bg-brand-50 scale-[0.98]' : 'border-gray-200 hover:border-brand-500 hover:bg-brand-50/50'}`}
          >
            <div className="w-16 h-16 rounded-full border-2 border-brand-500 flex items-center justify-center mb-6 text-brand-500 text-3xl font-light">+</div>
            <p className="text-gray-600 font-medium text-lg leading-snug">{t.drop_title}</p>
          </div>
        </>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
          <button onClick={() => setFile(null)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-500 transition-colors" title="Cancel Transfer">✕</button>
          <p className="text-brand-600 font-semibold mb-2 animate-pulse">Waiting for receiver...</p>
          <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 mb-4">
            <QRCodeSVG value={shareLink} size={140} fgColor="#14532d" />
          </div>
          <div className="text-center w-full px-4">
            <p className="text-gray-800 font-medium truncate w-full" title={file.name}>{file.name}</p>
            <p className="text-gray-500 text-sm mb-4">{formatFileSize(file.size)}</p>
          </div>
          <div className="w-full bg-brand-50 border border-brand-100 rounded-lg p-3 flex items-center justify-between cursor-pointer hover:bg-brand-100 transition-colors" onClick={() => { navigator.clipboard.writeText(shareLink); alert("Link copied!"); }}>
            <span className="text-brand-900 text-sm font-medium truncate mr-2">{roomId ? `.../receive/${roomId}` : 'Generating...'}</span>
            <span className="text-brand-600 text-sm font-bold">Copy</span>
          </div>
        </div>
      )}
    </div>
  );
}
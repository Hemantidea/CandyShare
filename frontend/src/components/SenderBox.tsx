'use client';
import React, { useState, useRef, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useLanguage } from '@/context/LanguageContext';
import { useWebRTC } from '@/hooks/useWebRTC';

export default function SenderBox() {
  const { t } = useLanguage();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [roomId, setRoomId] = useState<string>('');
  const [shareLink, setShareLink] = useState<string>('');
  
  const { transferState, progress, speed, reset } = useWebRTC(roomId, 'sender', file);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (file) {
      const newRoomId = Math.random().toString(36).substring(2, 8);
      setRoomId(newRoomId);
      setShareLink(`${window.location.origin}/receive/${newRoomId}`);
    }
  }, [file]);

  const resetBox = () => {
    setFile(null);
    setRoomId('');
    setShareLink('');
    reset();
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) setFile(e.dataTransfer.files[0]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) setFile(e.target.files[0]);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white p-5 sm:p-6 rounded-[2.5rem] shadow-2xl w-full max-w-[420px] aspect-square relative overflow-hidden flex flex-col transition-all duration-500 mx-auto border border-gray-100">
      
      {transferState === 'idle' && (
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
      )}

      {transferState === 'waiting' && file && (
        <div className="w-full h-full flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300 ">
          <button onClick={resetBox} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-500 transition-colors" title={t.btn_cancel || "Cancel"}>✕</button>
          <p className="text-brand-600 font-semibold mb-3 sm:mb-4 animate-pulse text-sm sm:text-base">
            {t.status_waiting || "Waiting for receiver..."}
          </p>
          <div className="bg-white p-2 sm:p-3 rounded-xl shadow-sm border border-gray-100 mb-3 sm:mb-4">
            <QRCodeSVG value={shareLink} size={120} fgColor="#14532d" />
          </div>
          <div className="text-center w-full px-2 sm:px-4">
            <p className="text-gray-800 font-medium truncate w-full text-sm sm:text-base" title={file.name}>{file.name}</p>
            <p className="text-gray-500 text-xs sm:text-sm mb-3 sm:mb-4">{formatFileSize(file.size)}</p>
          </div>
          <div className="w-full bg-brand-50 border border-brand-100 rounded-lg p-2 sm:p-3 flex items-center justify-between cursor-pointer hover:bg-brand-100 transition-colors" onClick={() => { navigator.clipboard.writeText(shareLink); alert("Link copied!"); }}>
            <span className="text-brand-900 text-xs sm:text-sm font-medium truncate mr-2">{roomId ? `.../receive/${roomId}` : 'Generating...'}</span>
            <span className="text-brand-600 text-xs sm:text-sm font-bold bg-white px-2 py-1 rounded shadow-sm">Copy</span>
          </div>
          <p className="text-[11px] text-gray-400 text-center mt-3 leading-tight">
  💡 {t.network_tip}
          </p>
        </div>
      )}

      {transferState === 'transferring' && file && (
        <div className="w-full h-full flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
          <button onClick={resetBox} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-500 transition-colors">✕</button>
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-brand-50 rounded-full flex items-center justify-center mb-4 sm:mb-6 border-4 border-brand-100 relative">
            <div className="absolute inset-0 rounded-full border-4 border-brand-400 animate-ping opacity-20"></div>
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">{t.status_transferring || "Transferring..."}</h3>
          <p className="text-gray-500 font-medium text-xs sm:text-sm mb-6 sm:mb-8 truncate w-full text-center px-4">{file.name}</p>
          <div className="w-full sm:w-[85%] px-2">
            <div className="flex justify-between text-xs sm:text-sm font-semibold mb-2">
              <span className="text-brand-600">{Math.round(progress)}%</span>
              <span className="text-gray-400">{speed}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5 sm:h-3 overflow-hidden shadow-inner">
              <div className="bg-brand-500 h-full rounded-full transition-all duration-200 ease-out relative" style={{ width: `${progress}%` }}>
                <div className="absolute top-0 left-0 w-full h-full bg-white opacity-20 transform -skew-x-12"></div>
              </div>
            </div>
            <p className="text-center text-[10px] sm:text-xs text-gray-400 mt-2 font-medium">
              {formatFileSize((progress/100) * file.size)} / {formatFileSize(file.size)}
            </p>
          </div>
        </div>
      )}

      {/* STATE 4: COMPLETED (Premium Sparkle Checkmark) */}
      {transferState === 'completed' && file && (
        <div className="w-full h-full flex flex-col items-center justify-center animate-in zoom-in-95 duration-500">
          
          {/* Candy Sparkle Animation Container */}
          <div className="relative w-24 h-24 flex items-center justify-center mb-6 mx-auto">
            {/* Outer soft pulsing glow */}
            <div className="absolute inset-0 bg-brand-100 rounded-full animate-[ping_2s_ease-out_infinite] opacity-60"></div>
            
            {/* Floating colorful candy sparkles */}
            <div className="absolute top-1 left-2 w-3 h-3 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="absolute bottom-2 right-0 w-2.5 h-2.5 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="absolute top-6 -left-3 w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            <div className="absolute -bottom-1 left-6 w-3 h-3 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '450ms' }}></div>

            {/* Main Glowing Checkmark */}
            <div className="relative z-10 w-16 h-16 bg-brand-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.5)] transform transition-all duration-500 hover:scale-110 hover:rotate-3">
              <svg className="w-8 h-8 text-white drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{t.status_completed || "Sweet Success!"}</h3>
          <p className="text-gray-500 text-center mb-6 sm:mb-8 px-4 text-xs sm:text-sm font-medium">
            <span className="truncate block w-[200px] sm:w-[250px] mb-1 mx-auto">{file.name}</span>
            was sent successfully!
          </p>

          <button 
            onClick={resetBox}
            className="bg-gray-900 text-white font-semibold py-2.5 sm:py-3 px-6 sm:px-8 rounded-full hover:bg-brand-600 transition-colors duration-300 shadow-[0_10px_20px_-10px_rgba(0,0,0,0.3)] w-full sm:w-[85%] text-sm sm:text-base"
          >
            {t.btn_share_another || "Share another file"}
          </button>
        </div>
      )}
    </div>
  );
}
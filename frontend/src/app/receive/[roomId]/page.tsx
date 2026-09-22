'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import CandySpinner from '@/components/CandySpinner';
import { useWebRTC } from '@/hooks/useWebRTC';

export default function ReceivePage() {
  const { t } = useLanguage();
  const params = useParams();
  const roomId = params.roomId as string;
  const { transferState, progress, speed, downloadFile } = useWebRTC(roomId, 'receiver');

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 mt-12 md:mt-24 px-4">
      <div className="flex-1 flex justify-center w-full">
        <div className="bg-white p-6 rounded-[2.5rem] shadow-2xl w-full max-w-[360px] aspect-square relative overflow-hidden flex flex-col items-center justify-center transition-all duration-500">
          
          {(transferState === 'idle' || transferState === 'waiting') && (
            <div className="w-full h-full flex flex-col items-center justify-center animate-in fade-in duration-300">
              <div className="relative flex items-center justify-center mb-6">
                <CandySpinner className="w-28 h-28 drop-shadow-md" />
              </div>
              <h2 className="text-2xl font-bold text-brand-900 mb-2">Connecting...</h2>
              <p className="text-gray-500 text-center font-medium">
                Room ID: <span className="text-brand-600 bg-brand-50 px-2 py-1 rounded font-mono">{roomId}</span>
              </p>
              <p className="text-sm text-gray-400 mt-4 text-center px-4">
                Waiting for sender to establish a secure peer-to-peer connection.
              </p>
            </div>
          )}

          {transferState === 'transferring' && (
            <div className="w-full h-full flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center mb-6 border-4 border-brand-100 relative">
                <div className="absolute inset-0 rounded-full border-4 border-brand-400 animate-ping opacity-20"></div>
                <svg className="w-8 h-8 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-8">{t.status_transferring || "Receiving..."}</h3>
              <div className="w-full w-[85%]">
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span className="text-brand-600">{Math.round(progress)}%</span>
                  <span className="text-gray-400">{speed}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden shadow-inner">
                  <div className="bg-brand-500 h-full rounded-full transition-all duration-200 ease-out relative" style={{ width: `${progress}%` }}>
                    <div className="absolute top-0 left-0 w-full h-full bg-white opacity-20 transform -skew-x-12"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {transferState === 'completed' && (
            <div className="w-full h-full flex flex-col items-center justify-center animate-in zoom-in-95 duration-500">
              <div className="relative w-24 h-24 flex items-center justify-center mb-6 mx-auto">
                <div className="absolute inset-0 bg-brand-100 rounded-full animate-[ping_2s_ease-out_infinite] opacity-60"></div>
                <div className="absolute top-1 left-2 w-3 h-3 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="absolute bottom-2 right-0 w-2.5 h-2.5 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="absolute top-6 -left-3 w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                <div className="absolute -bottom-1 left-6 w-3 h-3 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '450ms' }}></div>

                <div className="relative z-10 w-16 h-16 bg-brand-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.5)] transform transition-all duration-500 hover:scale-110">
                  <svg className="w-8 h-8 text-white drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-2">{t.status_completed || "Sweet Success!"}</h3>
              <p className="text-gray-500 text-center mb-6 px-4 text-sm font-medium">
                File received successfully!
              </p>

              {/* NEW DOWNLOAD AGAIN BUTTON */}
              <button 
                onClick={downloadFile}
                className="bg-gray-900 text-white font-semibold py-2.5 px-8 rounded-full hover:bg-brand-600 transition-colors duration-300 shadow-md flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
                {t.btn_download_again || "Download Again"}
              </button>
              
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-bold text-brand-900 mb-6 leading-tight">
          Ready to receive
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-md">
          Keep this tab open. The file will transfer directly from the sender's device to yours.
        </p>
        <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-200 text-brand-900 px-5 py-2.5 rounded-full font-medium shadow-sm">
          <span className="text-brand-500 text-xl">🔒</span> {t.drop_subtitle}
        </div>
      </div>
    </div>
  );
}
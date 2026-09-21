'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import CandySpinner from '@/components/CandySpinner';

export default function ReceivePage() {
  const { t } = useLanguage();
  const params = useParams();
  const roomId = params.roomId as string;

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 mt-12 md:mt-24">
      
      {/* LEFT SIDE: Receiver Status Box */}
      <div className="flex-1 flex justify-center w-full">
        <div className="bg-white p-6 rounded-[2.5rem] shadow-2xl w-full max-w-[360px] aspect-square relative overflow-hidden flex flex-col items-center justify-center transition-all duration-500">
          
          {/* Custom Candy Spinner replacing the basic radar */}
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
      </div>

      {/* RIGHT SIDE: The Hero Text (Maintains UI consistency) */}
      <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-bold text-brand-900 mb-6 leading-tight">
          Ready to receive
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-md">
          Keep this tab open. The file will transfer directly from the sender's device to yours.
        </p>
        
        {/* Security badge to build trust */}
        <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-200 text-brand-900 px-5 py-2.5 rounded-full font-medium shadow-sm">
          <span className="text-brand-500 text-xl">🔒</span> {t.drop_subtitle}
        </div>
      </div>

    </div>
  );
}
'use client';
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import SenderBox from '@/components/SenderBox';

export default function Home() {
  const { t } = useLanguage();

  return (
    <>
      {/* VERCEL-STYLE PREMIUM SOFT GLOW */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-brand-100/40 blur-[100px] rounded-full -z-10 pointer-events-none"></div>

      <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 md:gap-20 mt-8 md:mt-16 px-6 md:px-8 mb-12">
        
        {/* LEFT SIDE: The Interactive Box */}
        <div className="flex-1 flex justify-center md:justify-start w-full relative z-10">
          <div className="relative w-full max-w-[400px]">
            <div className="absolute inset-0 bg-brand-200/50 blur-[40px] opacity-30 rounded-full pointer-events-none"></div>
            <SenderBox />
          </div>
        </div>

        {/* RIGHT SIDE: The Hero Text */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left z-10">
          
          {/* Toned down typography: Sleeker, highly professional */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-[1.15] tracking-tight text-balance">
            {t.hero_title}
          </h1>
          
          <p className="text-lg md:text-xl text-gray-500 mb-12 max-w-lg leading-relaxed text-balance">
            {t.hero_subtitle}
          </p>

          {/* More breathable feature grid */}
          {/* Upgraded Feature Grid: Professional SVG Icons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8 w-full mt-4">
            
            {/* 1. Send Any Size (Infinity Icon) */}
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-full bg-brand-50/50 flex items-center justify-center text-brand-500 group-hover:bg-brand-100 transition-colors duration-300">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.33-6 4Z"/>
                </svg>
              </div>
              <span className="text-gray-700 font-semibold">{t.feature_1}</span>
            </div>

            {/* 2. Fast Speed (Lightning Icon) */}
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-full bg-brand-50/50 flex items-center justify-center text-brand-500 group-hover:bg-brand-100 transition-colors duration-300">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
              </div>
              <span className="text-gray-700 font-semibold">{t.feature_2}</span>
            </div>

            {/* 3. Direct P2P (Device Arrows Icon) */}
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-full bg-brand-50/50 flex items-center justify-center text-brand-500 group-hover:bg-brand-100 transition-colors duration-300">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 3l4 4-4 4"/><path d="M3 7h18"/><path d="M7 21l-4-4 4-4"/><path d="M21 17H3"/>
                </svg>
              </div>
              <span className="text-gray-700 font-semibold">{t.feature_3}</span>
            </div>

            {/* 4. Secure (Lock Icon) */}
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-full bg-brand-50/50 flex items-center justify-center text-brand-500 group-hover:bg-brand-100 transition-colors duration-300">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <span className="text-gray-700 font-semibold">{t.drop_subtitle}</span>
            </div>

          </div>
        </div>

      </div>
    </>
  );
}
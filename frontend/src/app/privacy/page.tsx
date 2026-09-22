'use client';
import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

export default function PrivacyPage() {
  const { t } = useLanguage();

  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-6 md:px-8">
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-6">
            {t.privacy_hero_title}
          </h1>
          <div className="h-1.5 w-24 bg-brand-500 mx-auto md:mx-0 rounded-full mb-6"></div>
          <p className="text-lg md:text-xl text-gray-600 max-w-lg mx-auto md:mx-0 leading-relaxed">
            {t.hero_subtitle}
          </p>
        </div>
        
        <div className="flex-1 w-full max-w-md relative aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-100 bg-brand-50 flex items-center justify-center group">
          <div className="absolute inset-0 bg-brand-200 blur-[40px] opacity-30 rounded-full group-hover:opacity-50 transition-opacity duration-500"></div>
          
          <Image 
            src="/privacy-art.png" 
            alt="Privacy Illustration" 
            fill 
            className="object-cover z-20"
          />
        </div>
      </div>

      <div className="space-y-6 max-w-4xl mx-auto">
        
        <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-brand-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col md:flex-row gap-6 md:gap-8 items-start animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 fill-mode-both">
          <div className="w-16 h-16 flex-shrink-0 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-500 border border-brand-100 shadow-sm">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
            </svg>
          </div>
          <div className="flex-1 mt-1 md:mt-0">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              {t.privacy_p1_title}
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              {t.privacy_p1_desc}
            </p>
          </div>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-brand-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col md:flex-row gap-6 md:gap-8 items-start animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 fill-mode-both">
          <div className="w-16 h-16 flex-shrink-0 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-500 border border-brand-100 shadow-sm">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <div className="flex-1 mt-1 md:mt-0">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              {t.privacy_p2_title}
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              {t.privacy_p2_desc}
            </p>
          </div>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-brand-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col md:flex-row gap-6 md:gap-8 items-start animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
          <div className="w-16 h-16 flex-shrink-0 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-500 border border-brand-100 shadow-sm">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>
          <div className="flex-1 mt-1 md:mt-0">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              {t.privacy_p3_title}
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              {t.privacy_p3_desc}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
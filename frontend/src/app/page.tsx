'use client';
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import SenderBox from '@/components/SenderBox';

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 mt-12 md:mt-24">
      
      {/* LEFT SIDE: The Interactive Box Component */}
      <div className="flex-1 flex justify-center w-full">
        <SenderBox />
      </div>

      {/* RIGHT SIDE: The Hero Text */}
      <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-bold text-brand-900 mb-6 leading-tight">
          {t.hero_title}
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-md">
          {t.hero_subtitle}
        </p>

        {/* Feature List in page.tsx */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
          <div className="flex items-center gap-3">
            <span className="text-brand-500 font-bold text-xl">∞</span>
            <span className="text-brand-900 font-medium">{t.feature_1}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-brand-500 font-bold text-xl">⚡</span>
            <span className="text-brand-900 font-medium">{t.feature_2}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-brand-500 font-bold text-xl">⇄</span>
            <span className="text-brand-900 font-medium">{t.feature_3}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-brand-500 font-bold text-xl">🔒</span>
            <span className="text-brand-900 font-medium">{t.drop_subtitle}</span>
          </div>
        </div>
      </div>

    </div>
  );
}
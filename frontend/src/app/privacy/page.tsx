'use client';
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export default function PrivacyPage() {
  const { t } = useLanguage();

  return (
    <div className="w-full max-w-4xl mx-auto py-16 px-6 md:px-8">
      
      {/* Centered, balanced Hero Title */}
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-extrabold text-brand-900 tracking-tight">
          {t.privacy_hero_title}
        </h1>
        <div className="h-1.5 w-24 bg-brand-500 mx-auto mt-6 rounded-full"></div>
      </div>

      <div className="space-y-8">
        
        {/* Point 1 */}
        <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-brand-100 hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          {/* Professional Icon Badge */}
          <div className="w-16 h-16 flex-shrink-0 bg-brand-50 rounded-2xl flex items-center justify-center text-3xl border border-brand-100 shadow-sm">
            ☁️
          </div>
          {/* Content aligned together */}
          <div className="flex-1 mt-1 md:mt-0">
            <h2 className="text-2xl md:text-3xl font-bold text-brand-900 mb-3">
              {t.privacy_p1_title}
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              {t.privacy_p1_desc}
            </p>
          </div>
        </div>

        {/* Point 2 */}
        <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-brand-100 hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          <div className="w-16 h-16 flex-shrink-0 bg-brand-50 rounded-2xl flex items-center justify-center text-3xl border border-brand-100 shadow-sm">
            🔐
          </div>
          <div className="flex-1 mt-1 md:mt-0">
            <h2 className="text-2xl md:text-3xl font-bold text-brand-900 mb-3">
              {t.privacy_p2_title}
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              {t.privacy_p2_desc}
            </p>
          </div>
        </div>

        {/* Point 3 */}
        <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-brand-100 hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          <div className="w-16 h-16 flex-shrink-0 bg-brand-50 rounded-2xl flex items-center justify-center text-3xl border border-brand-100 shadow-sm">
            🛡️
          </div>
          <div className="flex-1 mt-1 md:mt-0">
            <h2 className="text-2xl md:text-3xl font-bold text-brand-900 mb-3">
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
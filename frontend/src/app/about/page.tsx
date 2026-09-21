'use client';
import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="w-full max-w-4xl mx-auto py-16 px-6 md:px-12 flex flex-col items-center md:items-start">
      
      {/* Top Hero Section with Logo */}
      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 mb-16 w-full">
        <div className="w-40 h-40 md:w-56 md:h-56 flex-shrink-0 bg-brand-100 rounded-full flex items-center justify-center shadow-lg p-6">
          <Image src="/logo.png" alt="CandyShare Mascot" width={150} height={150} className="object-contain hover:scale-105 transition-transform" />
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-brand-900 leading-tight text-center md:text-left tracking-tight">
          {t.about_hero_title}
        </h1>
      </div>

      {/* The Story */}
      <div className="w-full space-y-8 text-lg md:text-xl text-gray-600 leading-relaxed font-medium">
        <p>
          {t.about_story_1}
        </p>
        <p>
          {t.about_story_2}
        </p>
      </div>

      {/* The Solution */}
      <div className="w-full mt-16 pt-12 border-t border-gray-200">
        <h2 className="text-3xl md:text-4xl font-bold text-brand-900 mb-8 tracking-tight">
          {t.about_sub_title}
        </h2>
        <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-medium">
          {t.about_solution}
        </p>
      </div>
      
    </div>
  );
}
'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function Navbar() {
  const { t, lang, toggleLang } = useLanguage();

  return (
    <nav className="w-full py-4 px-6 md:px-12 flex items-center justify-between bg-brand-50">
      
      {/* Logo Section - Now Clickable! */}
      <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
        <Image src="/logo.png" alt="CandyShare Logo" width={40} height={40} className="object-contain" />
        <span className="text-2xl font-bold text-brand-900 tracking-tight">
          CandyShare
        </span>
      </Link>

      {/* Right Side Controls */}
      <div className="flex items-center gap-6">
        <Link href="/about" className="hidden md:block text-brand-900 hover:text-brand-600 font-medium transition-colors">
          {t.nav_about}
        </Link>
        <Link href="/privacy" className="hidden md:block text-brand-900 hover:text-brand-600 font-medium transition-colors">
          {t.nav_privacy}
        </Link>
        
        {/* Language Toggle */}
        <button 
          onClick={toggleLang}
          className="flex items-center gap-2 px-3 py-1.5 border-2 border-brand-500 rounded-full text-brand-900 hover:bg-brand-100 transition-all font-semibold"
          title="Toggle Language"
        >
          <span className={lang === 'en' ? 'text-brand-600' : 'text-gray-400'}>A</span>
          <span className="text-gray-300">|</span>
          <span className={lang === 'hi' ? 'text-brand-600' : 'text-gray-400'}>अ</span>
        </button>
      </div>
    </nav>
  );
}
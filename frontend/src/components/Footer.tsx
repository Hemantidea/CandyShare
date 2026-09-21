'use client';
import React from "react";
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    // Changed to bg-white and border-gray-200
    <footer className="w-full border-t border-gray-200 bg-white py-6 px-6 text-center text-xs text-gray-500 relative z-10 print:hidden mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <p className="text-sm text-gray-500 font-medium">
          {t.footer_text}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-gray-500">
          <span className="flex items-center gap-2">
            <span>{t.made_in_india}</span>
            {/* Indian Flag SVG */}
            <svg width="20" height="14" viewBox="0 0 30 20" xmlns="http://www.w3.org/2000/svg" className="rounded-[2px] shadow-sm">
              <rect width="30" height="20" fill="#FF9933" />
              <rect y="6.67" width="30" height="6.66" fill="#FFFFFF" />
              <rect y="13.33" width="30" height="6.67" fill="#138808" />
              <circle cx="15" cy="10" r="2.2" fill="none" stroke="#000080" strokeWidth="0.4" />
              <circle cx="15" cy="10" r="0.35" fill="#000080" />
              {Array.from({ length: 24 }).map((_, i) => {
                const angle = (i * 15 * Math.PI) / 180;
                return (
                  <line key={i} x1="15" y1="10" x2={15 + Math.cos(angle) * 2.2} y2={10 + Math.sin(angle) * 2.2} stroke="#000080" strokeWidth="0.2" />
                );
              })}
            </svg>
          </span>

          <span className="opacity-40">•</span>

          <span>
            {t.developed_by}{" "}
            <a
              href="https://www.linkedin.com/in/hemant-verma-ind/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-brand-900 hover:text-brand-600 transition-colors"
            >
              Hemant Verma
            </a>
          </span>

          <a href="https://www.linkedin.com/in/hemant-verma-ind/" target="_blank" rel="noopener noreferrer" className="ml-1 text-gray-400 hover:text-[#0A66C2] transition-colors">
            {/* LinkedIn SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4.98 3.5A2.48 2.48 0 1 0 5 8.46 2.48 2.48 0 0 0 4.98 3.5ZM3 9h4v12H3zm7 0h3.83v1.64h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.09V21h-4v-5.11c0-1.22-.02-2.79-1.7-2.79-1.71 0-1.97 1.33-1.97 2.7V21h-4z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
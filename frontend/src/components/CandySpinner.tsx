import React from 'react';

export default function CandySpinner({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 200 200" 
      className={`animate-spin ${className}`} 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Top Blue/Teal Candy */}
      <g transform="translate(100, 60)">
        {/* Wrappers */}
        <path d="M -30 0 C -60 -25, -60 25, -30 0" fill="#249BCE" stroke="#0B2060" strokeWidth="8" strokeLinejoin="round"/>
        <path d="M 30 0 C 60 -25, 60 25, 30 0" fill="#249BCE" stroke="#0B2060" strokeWidth="8" strokeLinejoin="round"/>

        {/* Body Base & Mask for Stripes */}
        <clipPath id="topCandyMask">
          <rect x="-45" y="-22" width="90" height="44" rx="22" />
        </clipPath>
        
        <rect x="-45" y="-22" width="90" height="44" rx="22" fill="#CDDEF9" />
        <g clipPath="url(#topCandyMask)">
          <polygon points="-45,-22 -10,-22 -25,22 -45,22" fill="#52BAE2" />
          <polygon points="10,-22 45,-22 45,22 25,22" fill="#6CD8CF" />
        </g>
        
        {/* Body Outline */}
        <rect x="-45" y="-22" width="90" height="44" rx="22" fill="none" stroke="#0B2060" strokeWidth="8" />
      </g>

      {/* Bottom Pink/Orange Candy */}
      <g transform="translate(100, 140) rotate(25)">
        {/* Wrappers */}
        <path d="M -30 0 C -60 -25, -60 25, -30 0" fill="#D32E74" stroke="#0B2060" strokeWidth="8" strokeLinejoin="round"/>
        <path d="M 30 0 C 60 -25, 60 25, 30 0" fill="#D32E74" stroke="#0B2060" strokeWidth="8" strokeLinejoin="round"/>

        {/* Body Base & Mask for Stripes */}
        <clipPath id="botCandyMask">
          <rect x="-45" y="-22" width="90" height="44" rx="22" />
        </clipPath>
        
        <rect x="-45" y="-22" width="90" height="44" rx="22" fill="#CDDEF9" />
        <g clipPath="url(#botCandyMask)">
          <polygon points="-45,-22 -10,-22 -25,22 -45,22" fill="#DA4275" />
          <polygon points="10,-22 45,-22 45,22 25,22" fill="#FE5C4F" />
        </g>
        
        {/* Body Outline */}
        <rect x="-45" y="-22" width="90" height="44" rx="22" fill="none" stroke="#0B2060" strokeWidth="8" />
      </g>
    </svg>
  );
}
import React from 'react';

interface MBPuffLogoProps {
  size?: number;
  showText?: boolean;
}

export default function MBPuffLogo({ size = 48, showText = true }: MBPuffLogoProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      {/* SVG Logo Mark */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="logoGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2A1A3E"/>
            <stop offset="100%" stopColor="#080810"/>
          </radialGradient>
          <filter id="logoGlow">
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <linearGradient id="silverGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E0E0F0"/>
            <stop offset="50%" stopColor="#C0C0D8"/>
            <stop offset="100%" stopColor="#9090B0"/>
          </linearGradient>
        </defs>

        {/* Outer ring */}
        <circle cx="50" cy="50" r="48" fill="url(#logoGrad)"
          stroke="#BF5FFF" strokeWidth="1.5" opacity="0.9"/>

        {/* Inner glow ring */}
        <circle cx="50" cy="50" r="42" fill="none"
          stroke="rgba(191,95,255,0.3)" strokeWidth="0.5"/>

        {/* Smoke puff at top */}
        <ellipse cx="50" cy="16" rx="8" ry="6"
          fill="rgba(191,95,255,0.6)" filter="url(#logoGlow)"/>
        <ellipse cx="44" cy="22" rx="5" ry="4"
          fill="rgba(191,95,255,0.4)"/>
        <ellipse cx="56" cy="21" rx="5" ry="4"
          fill="rgba(191,95,255,0.4)"/>

        {/* MB Text */}
        <text x="50" y="58" textAnchor="middle"
          fontFamily="Arial Black, sans-serif"
          fontSize="26" fontWeight="900"
          fill="url(#silverGrad)"
          stroke="#BF5FFF" strokeWidth="0.5"
          filter="url(#logoGlow)">
          MB
        </text>

        {/* PUFF Text */}
        <text x="50" y="76" textAnchor="middle"
          fontFamily="Arial, sans-serif"
          fontSize="13" fontWeight="700"
          fill="#BF5FFF"
          letterSpacing="3"
          filter="url(#logoGlow)">
          PUFF
        </text>

        {/* Bottom accent line */}
        <line x1="30" y1="80" x2="70" y2="80"
          stroke="rgba(191,95,255,0.5)" strokeWidth="1"
          strokeLinecap="round"/>
      </svg>

      {/* Brand name text next to logo */}
      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
          <span style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: '18px',
            fontWeight: '700',
            color: '#BF5FFF',
            letterSpacing: '2px',
          }}>
            MB PUFF
          </span>
          <span style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: '9px',
            color: '#9090B0',
            letterSpacing: '3px',
            textTransform: 'uppercase',
          }}>
            Vape Store
          </span>
        </div>
      )}
    </div>
  );
}

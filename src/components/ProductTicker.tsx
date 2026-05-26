'use client';

import { useLocale } from 'next-intl';
import ProductCard from './ProductCard';

interface ProductTickerProps {
  products: any[];
  title: string;
}

export default function ProductTicker({ products, title }: ProductTickerProps) {
  const locale = useLocale();
  const isRtl = locale === 'ar';

  if (!products || products.length === 0) return null;

  // Duplicate the products list to make the scroll loop seamlessly
  const tripledProducts = [...products, ...products, ...products];

  return (
    <div style={{ 
      padding: 'var(--space-2xl) 0', 
      overflow: 'hidden', 
      position: 'relative', 
      width: '100%',
      background: 'linear-gradient(180deg, var(--bg-main) 0%, var(--bg-surface) 50%, var(--bg-main) 100%)',
      borderTop: '1px solid rgba(191, 95, 255, 0.05)',
      borderBottom: '1px solid rgba(191, 95, 255, 0.05)'
    }}>
      <div className="container" style={{ marginBottom: 'var(--space-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <span style={{
            display: 'inline-block',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: 'var(--secondary)',
            boxShadow: '0 0 10px var(--secondary)'
          }} />
          <h2 style={{ 
            fontFamily: 'Orbitron, sans-serif', 
            fontSize: '28px', 
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            background: 'linear-gradient(to right, var(--text-main), var(--text-muted))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            {title}
          </h2>
        </div>
      </div>

      {/* Flat Scrolling Wrapper */}
      <div 
        style={{ 
          width: '100%', 
          overflow: 'hidden', 
          position: 'relative',
          padding: '20px 0',
          zIndex: 5
        }}
      >
        {/* Soft edge ambient blur lighting */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: '150px',
          background: 'linear-gradient(to right, var(--bg-main) 30%, transparent)',
          zIndex: 8,
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: '150px',
          background: 'linear-gradient(to left, var(--bg-main) 30%, transparent)',
          zIndex: 8,
          pointerEvents: 'none'
        }} />

        {/* Flat Shelf Track */}
        <div
          className="ticker-track"
          style={{
            display: 'flex',
            gap: '30px',
            width: 'max-content',
            padding: '10px 40px'
          }}
        >
          {tripledProducts.map((p, idx) => (
            <div 
              key={`${p.id}-${idx}`} 
              className="ticker-item"
              style={{ 
                width: '260px', 
                flexShrink: 0,
                transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
                position: 'relative',
                zIndex: 6
              }}
            >
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>

      {/* CSS Animation & Hover Effects Injector */}
      <style dangerouslySetInnerHTML={{ __html: `
        .ticker-track {
          animation: marquee 40s linear infinite;
        }
        
        /* Pause scroll on hover */
        .ticker-track:hover {
          animation-play-state: paused;
        }
        
        /* Dim other cards on ticker hover */
        .ticker-track:hover .ticker-item {
          opacity: 0.6;
          transform: scale(0.97);
          filter: brightness(0.8);
        }
        
        /* Focus & pop up the hovered card */
        .ticker-track .ticker-item:hover {
          opacity: 1 !important;
          transform: translateY(-12px) scale(1.03) !important;
          filter: brightness(1.1) !important;
          z-index: 100 !important;
        }
        
        /* Shadow glow for focused card */
        .ticker-track .ticker-item:hover article {
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.6),
            0 0 25px rgba(191, 95, 255, 0.25),
            0 0 40px rgba(0, 229, 255, 0.15) !important;
          border-color: var(--primary) !important;
        }
        
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-290px * ${products.length})); /* 260px card + 30px gap */
          }
        }
        
        /* Handle right-to-left layout for Arabic */
        [dir="rtl"] .ticker-track {
          animation: marqueeRtl 40s linear infinite;
        }
        
        @keyframes marqueeRtl {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(290px * ${products.length}));
          }
        }
      `}} />
    </div>
  );
}

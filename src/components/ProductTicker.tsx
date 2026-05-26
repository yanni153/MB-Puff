'use client';

import { useLocale } from 'next-intl';
import ProductCard from './ProductCard';

interface ProductTickerProps {
  products: any[];
  title: string;
}

export default function ProductTicker({ products, title }: ProductTickerProps) {
  const locale = useLocale();

  // If there are no products or very few, don't show the ticker
  if (!products || products.length === 0) return null;

  // Duplicate the products list to make the scroll loop seamlessly
  const tripledProducts = [...products, ...products, ...products];

  return (
    <div style={{ padding: 'var(--space-xl) 0', overflow: 'hidden', position: 'relative', width: '100%' }}>
      <div className="container" style={{ marginBottom: 'var(--space-md)' }}>
        <h2 style={{ 
          fontFamily: 'Outfit, sans-serif', 
          fontSize: '28px', 
          fontWeight: 600,
          color: 'var(--text-main)'
        }}>
          {title}
        </h2>
      </div>

      {/* Outer wrapper that clips content */}
      <div 
        style={{ 
          width: '100%', 
          overflow: 'hidden', 
          position: 'relative',
          padding: '10px 0'
        }}
      >
        {/* Soft fade gradients on the edges for a premium depth effect */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: '80px',
          background: 'linear-gradient(to right, var(--bg-main), transparent)',
          zIndex: 2,
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: '80px',
          background: 'linear-gradient(to left, var(--bg-main), transparent)',
          zIndex: 2,
          pointerEvents: 'none'
        }} />

        {/* Ticker Track */}
        <div
          className="ticker-track"
          style={{
            display: 'flex',
            gap: '20px',
            width: 'max-content'
          }}
        >
          {tripledProducts.map((p, idx) => (
            <div 
              key={`${p.id}-${idx}`} 
              style={{ 
                width: '260px', 
                flexShrink: 0 
              }}
            >
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>

      {/* CSS Animation Injector for ultra-smooth 60fps performance */}
      <style dangerouslySetInnerHTML={{ __html: `
        .ticker-track {
          animation: marquee 35s linear infinite;
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-280px * ${products.length})); /* 260px card + 20px gap */
          }
        }
        
        /* Handle right-to-left layout for Arabic */
        [dir="rtl"] .ticker-track {
          animation: marqueeRtl 35s linear infinite;
        }
        [dir="rtl"] .ticker-track:hover {
          animation-play-state: paused;
        }
        @keyframes marqueeRtl {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(280px * ${products.length}));
          }
        }
      `}} />
    </div>
  );
}

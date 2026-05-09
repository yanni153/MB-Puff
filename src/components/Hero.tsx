'use client';

import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Hero() {
  const locale = useLocale();
  const t = useTranslations('Hero');

  return (
    <section style={{
      position: 'relative',
      minHeight: 620,
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
      borderBottom: '1px solid var(--border)',
      backgroundImage: 'linear-gradient(90deg, rgba(8,8,16,0.96), rgba(8,8,16,0.55)), url(/hero-bg.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 72% 38%, rgba(191,95,255,0.28), transparent 34%), radial-gradient(circle at 82% 68%, rgba(0,229,255,0.18), transparent 28%)' }} />

      <div className="container hero-grid" style={{ position: 'relative', zIndex: 1, display: 'grid', alignItems: 'center' }}>
        <div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ color: 'var(--secondary)', fontWeight: 900, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 'var(--space-md)' }}>
            {t('eyebrow')}
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.05 }} style={{ fontSize: 'clamp(42px, 7vw, 82px)', lineHeight: 1, maxWidth: 760, marginBottom: 'var(--space-lg)' }}>
            {t('title')}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.1 }} style={{ color: 'var(--text-muted)', fontSize: 18, lineHeight: 1.7, maxWidth: 620, marginBottom: 'var(--space-xl)' }}>
            {t('description')}
          </motion.p>
          <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
            <Link href={`/${locale}/search`} style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: '#080810', padding: '15px 22px', borderRadius: 'var(--radius-md)', fontWeight: 900 }}>
              {t('shopProducts')}
            </Link>
            <Link href={`/${locale}/track`} style={{ border: '1px solid var(--border-cyan)', color: 'var(--text-main)', padding: '15px 22px', borderRadius: 'var(--radius-md)', fontWeight: 800 }}>
              {t('trackOrder')}
            </Link>
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          {/* Smoke Effects */}
          <SmokeEffect delay={0} x={-20} />
          <SmokeEffect delay={1.5} x={20} />
          <SmokeEffect delay={3} x={0} />

          <motion.div
            className="desktop-only"
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 1, -1, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 6, 
              ease: 'easeInOut' 
            }}
            style={{ 
              position: 'relative', 
              zIndex: 2,
              filter: 'drop-shadow(0 0 30px rgba(191,95,255,0.3))'
            }}
          >
            <motion.div
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ repeat: Infinity, duration: 3 }}
              style={{
                position: 'absolute',
                inset: '-20px',
                background: 'radial-gradient(circle, rgba(191,95,255,0.2) 0%, transparent 70%)',
                filter: 'blur(30px)',
                zIndex: -1
              }}
            />
            <img 
              src="/hero-device.png" 
              alt="MB PUFF Device" 
              style={{ 
                height: 480, 
                width: 'auto', 
                objectFit: 'contain',
                maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)'
              }} 
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function SmokeEffect({ delay, x }: { delay: number; x: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.2, y: 100, x }}
      animate={{ 
        opacity: [0, 0.4, 0], 
        scale: [0.2, 2.5], 
        y: [-100, -400],
        x: [x, x + (Math.random() * 100 - 50)]
      }}
      transition={{ 
        repeat: Infinity, 
        duration: 5, 
        delay, 
        ease: "easeOut" 
      }}
      style={{ 
        position: 'absolute', 
        top: 0, 
        left: '50%', 
        width: 100, 
        height: 100, 
        background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
        filter: 'blur(20px)',
        zIndex: 1,
        pointerEvents: 'none'
      }}
    />
  );
}

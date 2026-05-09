'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NotFound() {
    const locale = useLocale();

    return (
        <main style={{ 
            background: 'var(--bg-main)', 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            textAlign: 'center',
            padding: 'var(--space-xl)'
        }}>
            <div>
                <motion.h1 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ 
                        fontFamily: 'Orbitron, sans-serif', 
                        fontSize: 'clamp(80px, 20vw, 150px)', 
                        fontWeight: 900,
                        margin: 0,
                        lineHeight: 1,
                        background: 'linear-gradient(135deg, #00E5FF, #BF5FFF)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        color: 'transparent'
                    }}
                >
                    404
                </motion.h1>
                <h2 style={{ fontFamily: 'Orbitron', color: 'var(--text-main)', fontSize: '28px', marginBottom: 'var(--space-md)' }}>
                    System Malfunction
                </h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-2xl)', maxWidth: '400px', margin: '0 auto var(--space-3xl) auto' }}>
                    The page you are looking for has been moved to a different dimension or never existed in this timeline.
                </p>
                <Link href={`/${locale}`} style={{ 
                    background: 'var(--primary)', 
                    color: 'var(--bg-main)', 
                    padding: '16px 40px', 
                    borderRadius: '8px', 
                    fontWeight: 800,
                    fontSize: '16px',
                    display: 'inline-block',
                    boxShadow: '0 0 20px var(--primary-glow)'
                }}>
                    Return to Base
                </Link>
            </div>
        </main>
    );
}

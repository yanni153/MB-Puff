'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, LogOut, CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function AgeGate() {
    const t = useTranslations('AgeGate');
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const verified = localStorage.getItem('age-verified');
        if (!verified) {
            setIsVisible(true);
        }
    }, []);

    const handleConfirm = () => {
        localStorage.setItem('age-verified', 'true');
        setIsVisible(false);
    };

    const handleExit = () => {
        window.location.href = 'https://www.google.com';
    };

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 9999,
                    background: 'rgba(10, 10, 10, 0.95)',
                    backdropFilter: 'blur(20px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                    color: 'white'
                }}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                        maxWidth: '480px',
                        width: '100%',
                        background: 'var(--bg-surface)',
                        borderRadius: '0',
                        padding: 'var(--space-2xl)',
                        textAlign: 'center',
                        border: '1px solid var(--border)',
                        boxShadow: 'var(--shadow-lg)'
                    }}
                >
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        margin: '0 auto var(--space-lg) auto',
                        color: 'var(--text-main)',
                    }}>
                        <ShieldAlert size={36} strokeWidth={1.5} />
                    </div>

                    <h1 style={{ 
                        fontFamily: 'Outfit, sans-serif', 
                        fontSize: '24px', 
                        fontWeight: 500, 
                        marginBottom: 'var(--space-md)', 
                        color: 'var(--text-main)',
                        letterSpacing: '1px',
                        textTransform: 'uppercase'
                    }}>
                        {t('title')}
                    </h1>
                    
                    <p style={{ 
                        fontSize: '15px', 
                        color: 'var(--text-muted)', 
                        marginBottom: 'var(--space-xl)', 
                        lineHeight: '1.7',
                        fontWeight: 300
                    }}>
                        {t('subtitle')}
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                        <button
                            onClick={handleConfirm}
                            style={{
                                background: 'var(--text-main)',
                                color: 'var(--bg-main)',
                                padding: '16px',
                                borderRadius: '0',
                                fontWeight: 600,
                                fontSize: '15px',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                        >
                            {t('confirm')}
                        </button>
                        
                        <button
                            onClick={handleExit}
                            style={{
                                background: 'transparent',
                                color: 'var(--text-muted)',
                                padding: '14px',
                                borderRadius: '0',
                                fontWeight: 400,
                                fontSize: '14px',
                                border: '1px solid var(--border)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = 'var(--text-hint)';
                                e.currentTarget.style.color = 'var(--text-main)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'var(--border)';
                                e.currentTarget.style.color = 'var(--text-muted)';
                            }}
                        >
                            {t('exit')}
                        </button>
                    </div>

                    <div style={{ 
                        marginTop: 'var(--space-xl)', 
                        paddingTop: 'var(--space-lg)',
                        borderTop: '1px solid var(--border)' 
                    }}>
                        <p style={{ 
                            fontSize: '11px', 
                            color: 'var(--text-hint)', 
                            lineHeight: '1.6',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}>
                            {t('notice')}
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

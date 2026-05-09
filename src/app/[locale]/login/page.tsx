'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Globe, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

export default function LoginPage() {
    const t = useTranslations('Auth');
    const locale = useLocale();
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || `/${locale}`;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
                callbackUrl
            });

            if (result?.error) {
                setError(t('errorInvalid'));
            } else {
                router.push(callbackUrl);
                router.refresh();
            }
        } catch (err) {
            setError(t('errorGeneric'));
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = () => {
        signIn('google', { callbackUrl });
    };

    return (
        <div style={{ 
            minHeight: '100vh', 
            background: 'var(--bg-main)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: 'var(--space-md)',
            color: 'white'
        }}>
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ 
                    width: '100%', 
                    maxWidth: '420px', 
                    background: 'var(--bg-surface)', 
                    padding: 'var(--space-2xl)', 
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                    border: '1px solid rgba(255,255,255,0.05)'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
                    <h1 style={{ 
                        fontFamily: 'Orbitron, sans-serif', 
                        color: 'var(--primary)', 
                        fontSize: '28px', 
                        fontWeight: 900, 
                        letterSpacing: '2px',
                        marginBottom: 'var(--space-sm)'
                    }}>
                        {t('loginTitle')}
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{t('signIn')}</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            style={{ 
                                background: 'rgba(255, 61, 90, 0.1)', 
                                border: '1px solid var(--error)', 
                                padding: '12px', 
                                borderRadius: 'var(--radius-md)', 
                                color: 'var(--error)',
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}
                        >
                            <AlertCircle size={18} /> {error}
                        </motion.div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>{t('email')}</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="name@example.com"
                                style={{ 
                                    width: '100%', 
                                    padding: '14px 14px 14px 44px', 
                                    background: 'rgba(255,255,255,0.03)', 
                                    border: '1px solid rgba(255,255,255,0.1)', 
                                    borderRadius: 'var(--radius-md)',
                                    color: 'white',
                                    outline: 'none',
                                    transition: 'border-color 0.2s ease'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>{t('password')}</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                            <input 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                style={{ 
                                    width: '100%', 
                                    padding: '14px 14px 14px 44px', 
                                    background: 'rgba(255,255,255,0.03)', 
                                    border: '1px solid rgba(255,255,255,0.1)', 
                                    borderRadius: 'var(--radius-md)',
                                    color: 'white',
                                    outline: 'none',
                                    transition: 'border-color 0.2s ease'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                            />
                        </div>
                    </div>

                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                        style={{ 
                            background: 'var(--primary)', 
                            color: 'var(--bg-main)', 
                            padding: '16px', 
                            borderRadius: 'var(--radius-md)', 
                            fontWeight: 800, 
                            fontSize: '16px',
                            marginTop: 'var(--space-md)',
                            boxShadow: '0 10px 20px rgba(191, 95, 255, 0.2)',
                            opacity: loading ? 0.7 : 1,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px'
                        }}
                    >
                        {loading ? '...' : t('signIn')} <ArrowRight size={20} />
                    </motion.button>
                </form>

                </form>

                <div style={{ textAlign: 'center', marginTop: 'var(--space-xl)', fontSize: '14px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{t('noAccount')} </span>
                    <Link href={`/${locale}/register`} style={{ color: 'var(--primary)', fontWeight: 700 }}>
                        {t('register')}
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}

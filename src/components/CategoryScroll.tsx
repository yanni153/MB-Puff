'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Zap, Cloud, Droplets, Battery, Sparkles, Box } from 'lucide-react';

interface Category {
    id: string;
    name_en: string;
    name_ar: string;
    name_fr: string;
    slug: string;
}

export default function CategoryStrip({ categories }: { categories: Category[] }) {
    const locale = useLocale();

    const getIcon = (slug: string) => {
        const icons: Record<string, any> = {
            'vapes': <Zap size={24} />,
            'pods': <Box size={24} />,
            'e-liquids': <Droplets size={24} />,
            'accessories': <Sparkles size={24} />,
            'batteries': <Battery size={24} />,
            'disposables': <Cloud size={24} />,
        };
        return icons[slug] || <Box size={24} />;
    };

    return (
        <div style={{
            display: 'flex',
            gap: 'var(--space-lg)',
            overflowX: 'auto',
            padding: 'var(--space-md) 0',
            scrollbarWidth: 'none',
        }}>
            {categories.map((cat) => (
                <Link key={cat.id} href={`/${locale}/search?category=${cat.id}`} style={{ flexShrink: 0 }}>
                    <motion.div
                        whileHover={{ y: -4, borderColor: 'var(--border-glow)', boxShadow: 'var(--shadow-cyan)' }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 'var(--space-md)',
                            padding: '20px',
                            minWidth: '120px',
                            background: 'var(--bg-elevated)',
                            borderRadius: '16px',
                            border: '1px solid var(--border)',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer'
                        }}
                    >
                        <div style={{
                            color: 'var(--primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            {getIcon(cat.slug)}
                        </div>
                        <span style={{ 
                            fontSize: '13px', 
                            fontWeight: 700, 
                            textAlign: 'center',
                            color: 'var(--text-main)',
                            fontFamily: 'Outfit, sans-serif'
                        }}>
                            {cat[`name_${locale as 'en' | 'ar' | 'fr'}` as keyof Category] as string}
                        </span>
                    </motion.div>
                </Link>
            ))}
            <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }
            `}</style>
        </div>
    );
}

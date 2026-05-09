'use client';

import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import MBPuffLogo from './MBPuffLogo';

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const locale = useLocale();
    const tCommon = useTranslations('Common');
    const tHome = useTranslations('Home');
    const tFooter = useTranslations('Footer');

    return (
        <footer style={{ 
            background: 'var(--bg-surface)', 
            color: 'var(--text-main)',
            padding: 'var(--space-4xl) 0 0 0', 
            marginTop: 'var(--space-4xl)',
            borderTop: '1px solid var(--border)'
        }}>
            <div className="container" style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: 'var(--space-2xl)',
                paddingBottom: 'var(--space-4xl)'
            }}>
                <div style={{ maxWidth: '300px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--space-lg)' }}>
                        <MBPuffLogo size={44} showText={true} />
                    </div>
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                        {tFooter('description')}
                    </p>
                </div>

                <div>
                    <h4 style={{ fontFamily: 'Orbitron', fontSize: '14px', fontWeight: 800, marginBottom: 'var(--space-xl)', color: 'var(--text-main)', textTransform: 'uppercase' }}>{tFooter('shop')}</h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
                        <li><FooterLink href={`/${locale}/search`}>{tFooter('allProducts')}</FooterLink></li>
                        <li><FooterLink href={`/${locale}/search?sort=newest`}>{tFooter('newArrivals')}</FooterLink></li>
                        <li><FooterLink href={`/${locale}/track`}>{tFooter('trackOrder')}</FooterLink></li>
                    </ul>
                </div>

                <div>
                    <h4 style={{ fontFamily: 'Orbitron', fontSize: '14px', fontWeight: 800, marginBottom: 'var(--space-xl)', color: 'var(--text-main)', textTransform: 'uppercase' }}>{tFooter('support')}</h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
                        <li><FooterLink href={`/${locale}/legal-age`}>{tCommon('legalAge')}</FooterLink></li>
                        <li><FooterLink href={`/${locale}/responsibility`}>{tHome('responsibility')}</FooterLink></li>
                        <li><FooterLink href={`/${locale}/privacy`}>{tCommon('privacy')}</FooterLink></li>
                        <li><FooterLink href={`/${locale}/terms`}>{tCommon('terms')}</FooterLink></li>
                    </ul>
                </div>

                <div>
                    <h4 style={{ fontFamily: 'Orbitron', fontSize: '14px', fontWeight: 800, marginBottom: 'var(--space-xl)', color: 'var(--text-main)', textTransform: 'uppercase' }}>{tFooter('contact')}</h4>
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '12px' }}>Email: support@mbpuff.dz</p>
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{tFooter('location')}</p>
                </div>
            </div>

            <div style={{ 
                background: 'var(--bg-main)', 
                borderTop: '1px solid var(--border)', 
                padding: 'var(--space-xl) 0', 
                textAlign: 'center', 
                fontSize: '13px', 
                color: 'var(--text-hint)',
                fontWeight: 500
            }}>
                <div className="container">
                    © {currentYear} MB PUFF Algeria. {tFooter('copyright')}
                </div>
            </div>
        </footer>
    );
}

function FooterLink({ href, children }: { href: string, children: React.ReactNode }) {
    return (
        <Link href={href} style={{ 
            color: 'var(--text-muted)', 
            textDecoration: 'none',
            transition: 'color 0.2s ease'
        }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
           onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
            {children}
        </Link>
    );
}

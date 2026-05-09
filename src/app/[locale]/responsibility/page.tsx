
import { getTranslations } from 'next-intl/server';
import { ShieldCheck, Info, AlertTriangle } from 'lucide-react';

export default async function ResponsibilityPage() {
    const t = await getTranslations('Responsibility');

    return (
        <main className="container" style={{ padding: 'var(--space-3xl) 0', maxWidth: '800px' }}>
            <header style={{ marginBottom: 'var(--space-3xl)', textAlign: 'center' }}>
                <div style={{ color: 'var(--primary)', marginBottom: 'var(--space-md)' }}>
                    <ShieldCheck size={48} style={{ margin: '0 auto' }} />
                </div>
                <h1 style={{ fontSize: '48px', fontWeight: 900, letterSpacing: 0 }}>{t('title')}</h1>
                <p style={{ fontSize: '20px', color: 'var(--text-muted)', marginTop: 'var(--space-md)' }}>
                    {t('subtitle')}
                </p>
            </header>

            <section style={{ display: 'grid', gap: 'var(--space-2xl)' }}>
                <div style={{ padding: 'var(--space-2xl)', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Info size={24} color="var(--primary)" /> {t('ageTitle')}
                    </h2>
                    <p style={{ lineHeight: '1.7', color: 'var(--text-main)' }}>
                        {t('ageText')}
                    </p>
                </div>

                <div style={{ padding: 'var(--space-2xl)', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <AlertTriangle size={24} color="var(--primary)" /> {t('safetyTitle')}
                    </h2>
                    <p style={{ lineHeight: '1.7', color: 'var(--text-main)' }}>
                        {t('safetyText')}
                    </p>
                </div>

                <div style={{ padding: 'var(--space-2xl)', borderLeft: '4px solid var(--primary)', background: 'var(--bg-soft)' }}>
                    <h3 style={{ fontWeight: 800, marginBottom: 'var(--space-sm)' }}>{t('communityTitle')}</h3>
                    <p style={{ fontSize: '15px' }}>
                        {t('communityText')}
                    </p>
                </div>
            </section>
        </main>
    );
}

import { getTranslations } from 'next-intl/server';
import { MapPin, Phone, MessageCircle } from 'lucide-react';

export default async function StoresPage() {
    const t = await getTranslations('Stores');

    // Placeholder data
    const stores = [
        { id: 1, city: "Algiers", wilaya: "16", address: "Bab Ezzouar Mall, Ground Floor", phone: "+213 555 12 34 56" },
        { id: 2, city: "Oran", wilaya: "31", address: "Centre Ville, Rue de la Paix", phone: "+213 555 98 76 54" },
        { id: 3, city: "Constantine", wilaya: "25", address: "Sidi Mabrouk", phone: "+213 555 11 22 33" },
    ];

    return (
        <div className="container" style={{ padding: 'var(--space-4xl) var(--space-md)' }}>
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-3xl)' }}>
                <h1 style={{ fontSize: '36px', marginBottom: 'var(--space-md)', color: 'var(--text-main)' }}>{t('title')}</h1>
                <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', fontSize: '16px', lineHeight: '1.6' }}>
                    {t('description')}
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-lg)' }}>
                {stores.map(store => (
                    <div key={store.id} style={{ 
                        background: 'var(--bg-surface)', 
                        border: '1px solid var(--border)', 
                        padding: 'var(--space-xl)',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--space-md)' }}>
                            <MapPin size={20} color="var(--accent-gold)" />
                            <h3 style={{ fontSize: '18px', color: 'var(--text-main)' }}>{store.city}</h3>
                            <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--text-hint)', background: 'var(--bg-main)', padding: '2px 8px', border: '1px solid var(--border)' }}>{t('wilaya')} {store.wilaya}</span>
                        </div>
                        
                        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: 'var(--space-lg)', flex: 1 }}>
                            {store.address}
                        </p>
                        
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button style={{ flex: 1, background: 'var(--bg-main)', border: '1px solid var(--border)', padding: '10px', color: 'var(--text-main)', display: 'flex', gap: '8px', fontSize: '13px', fontWeight: 500 }}>
                                <Phone size={16} /> {t('call')}
                            </button>
                            <button style={{ flex: 1, background: 'var(--bg-main)', border: '1px solid var(--border)', padding: '10px', color: 'var(--text-main)', display: 'flex', gap: '8px', fontSize: '13px', fontWeight: 500 }}>
                                <MessageCircle size={16} /> {t('whatsapp')}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

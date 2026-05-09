import { Truck, ShieldCheck, Clock, Headphones } from 'lucide-react';

export default function TrustSection() {
    return (
        <section style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-lg)',
            margin: 'var(--space-2xl) 0',
            padding: 'var(--space-xl)',
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)'
        }}>
            <TrustItem 
                icon={<Truck size={32} color="var(--primary)" />} 
                title="Wilaya Delivery" 
                desc="Fast shipping across all 58 wilayas" 
            />
            <TrustItem 
                icon={<ShieldCheck size={32} color="var(--secondary)" />} 
                title="COD Ready" 
                desc="Pay safely on delivery (Paiement à la livraison)" 
            />
            <TrustItem 
                icon={<Clock size={32} color="var(--accent-pink)" />} 
                title="Fast Support" 
                desc="Response within 24 hours" 
            />
            <TrustItem 
                icon={<Headphones size={32} color="var(--primary)" />} 
                title="Quality Assured" 
                desc="100% genuine premium products" 
            />
        </section>
    );
}

function TrustItem({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 'var(--space-sm)' }}>
            <div style={{ background: 'var(--bg-elevated)', padding: 'var(--space-md)', borderRadius: '50%', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                {icon}
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 700 }}>{title}</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4' }}>{desc}</p>
        </div>
    );
}

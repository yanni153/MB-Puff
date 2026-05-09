import Link from 'next/link';
import { redirect } from 'next/navigation';
import { signOut, auth } from '@/lib/auth';
import prisma from '@/lib/db';
import { serializePrisma } from '@/lib/utils';

function formatPrice(value: number | string) {
  return `${Number(value).toLocaleString('fr-DZ')} DZD`;
}

export default async function AccountPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect(`/${locale}/login`);

  const customer = await prisma.customer.findUnique({
    where: { userId: session.user.id },
    include: { orders: { orderBy: { createdAt: 'desc' }, include: { items: { include: { product: true } } } } },
  });
  const orders = serializePrisma(customer?.orders || []);
  const role = (session.user as any).role;

  return (
    <main className="container" style={{ padding: 'var(--space-2xl) var(--space-md)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-md)', flexWrap: 'wrap', marginBottom: 'var(--space-xl)' }}>
        <div>
          <h1 style={{ fontSize: 34 }}>Account</h1>
          <p style={{ color: 'var(--text-muted)' }}>{session.user.email}</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
          {role === 'ADMIN' && <Link href={`/${locale}/admin`} style={{ background: 'var(--secondary)', color: '#080810', padding: '12px 16px', borderRadius: 'var(--radius-md)', fontWeight: 900 }}>Admin</Link>}
          <form action={async () => {
            'use server';
            await signOut({ redirectTo: `/${locale}/login` });
          }}>
            <button style={{ border: '1px solid var(--border)', color: 'var(--text-main)', borderRadius: 'var(--radius-md)', padding: '0 16px' }}>Logout</button>
          </form>
        </div>
      </div>

      <section style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-xl)' }}>
        <h2 style={{ fontSize: 22, marginBottom: 'var(--space-lg)' }}>Orders</h2>
        {!orders.length && <p style={{ color: 'var(--text-muted)' }}>No orders yet.</p>}
        {orders.map((order: any) => (
          <article key={order.id} style={{ borderTop: '1px solid var(--border)', padding: 'var(--space-md) 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
              <div>
                <Link href={`/${locale}/track?orderId=${order.id}&phone=${encodeURIComponent(order.customerPhone)}`} style={{ color: 'var(--secondary)', fontWeight: 900 }}>#{order.id}</Link>
                <p style={{ color: 'var(--text-muted)' }}>{order.status.replaceAll('_', ' ')}</p>
              </div>
              <strong>{formatPrice(order.totalAmount)}</strong>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

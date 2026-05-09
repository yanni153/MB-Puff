import prisma from '@/lib/db';
import { getLocale } from 'next-intl/server';
import Link from 'next/link';
import { Grid, Package, ShoppingBag, Users } from 'lucide-react';

function formatPrice(value: number) {
  return `${value.toLocaleString('fr-DZ')} DZD`;
}

export default async function AdminDashboard() {
  const locale = await getLocale();

  const [productsCount, categoriesCount, ordersCount, customersCount, salesAggregate, recentOrders] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.order.count(),
    prisma.customer.count(),
    prisma.order.aggregate({ _sum: { totalAmount: true } }),
    prisma.order.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: { customer: true },
    }),
  ]);

  const stats = [
    { title: 'Products', value: productsCount.toString(), icon: <Package color="var(--primary)" /> },
    { title: 'Categories', value: categoriesCount.toString(), icon: <Grid color="var(--secondary)" /> },
    { title: 'Orders', value: ordersCount.toString(), icon: <ShoppingBag color="var(--accent-pink)" /> },
    { title: 'Customers', value: customersCount.toString(), icon: <Users color="var(--success)" /> },
  ];

  return (
    <div style={{ flex: 1 }}>
      <header style={{ marginBottom: 'var(--space-2xl)' }}>
        <h1 style={{ fontSize: 32, color: 'var(--text-main)' }}>Dashboard</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>Total sales: {formatPrice(Number(salesAggregate._sum.totalAmount || 0))}</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-lg)', marginBottom: 'var(--space-2xl)' }}>
        {stats.map((stat) => (
          <div key={stat.title} style={{ padding: 'var(--space-xl)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-md)', alignItems: 'center' }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>{stat.title}</span>
              {stat.icon}
            </div>
            <div style={{ fontSize: 30, fontWeight: 900 }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <section style={{ padding: 'var(--space-xl)', borderRadius: 'var(--radius-lg)', background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
          <h2 style={{ fontSize: 20 }}>Recent Orders</h2>
          <Link href={`/${locale}/admin/orders`} style={{ color: 'var(--secondary)', fontWeight: 800 }}>View All</Link>
        </div>

        {!recentOrders.length && <p style={{ color: 'var(--text-muted)' }}>No recent orders.</p>}
        {recentOrders.map((order) => (
          <div key={order.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 'var(--space-md)', padding: '14px 0', borderTop: '1px solid var(--border)', alignItems: 'center' }}>
            <div>
              <strong>#{order.id}</strong>
              <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>{order.customer.firstName} {order.customer.lastName} - {order.customerPhone}</p>
            </div>
            <span style={{ color: 'var(--text-muted)' }}>{order.status.replaceAll('_', ' ')}</span>
            <strong>{formatPrice(Number(order.totalAmount))}</strong>
          </div>
        ))}
      </section>
    </div>
  );
}

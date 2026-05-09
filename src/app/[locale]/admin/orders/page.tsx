import prisma from '@/lib/db';

function formatPrice(value: unknown) {
  return `${Number(value).toLocaleString('fr-DZ')} DZD`;
}

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { customer: true, items: { include: { product: true } } },
  });

  return (
    <div>
      <h1 style={{ marginBottom: 'var(--space-xl)' }}>Orders</h1>
      <div className="mobile-scroll-table" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
          <thead>
            <tr style={{ textAlign: 'left', color: 'var(--text-muted)' }}>
              <th style={{ padding: 'var(--space-md)' }}>Order</th>
              <th style={{ padding: 'var(--space-md)' }}>Customer</th>
              <th style={{ padding: 'var(--space-md)' }}>Wilaya</th>
              <th style={{ padding: 'var(--space-md)' }}>Items</th>
              <th style={{ padding: 'var(--space-md)' }}>Total</th>
              <th style={{ padding: 'var(--space-md)' }}>Status</th>
              <th style={{ padding: 'var(--space-md)' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} style={{ borderTop: '1px solid var(--border)' }}>
                <td style={{ padding: 'var(--space-md)', fontWeight: 800 }}>#{order.id}</td>
                <td style={{ padding: 'var(--space-md)' }}>
                  {order.customer.firstName} {order.customer.lastName}
                  <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>{order.customerPhone}</div>
                </td>
                <td style={{ padding: 'var(--space-md)' }}>{order.wilaya}</td>
                <td style={{ padding: 'var(--space-md)' }}>{order.items.length}</td>
                <td style={{ padding: 'var(--space-md)', fontWeight: 800 }}>{formatPrice(order.totalAmount)}</td>
                <td style={{ padding: 'var(--space-md)' }}>{order.status.replaceAll('_', ' ')}</td>
                <td style={{ padding: 'var(--space-md)' }}>{order.createdAt.toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!orders.length && <p style={{ color: 'var(--text-muted)', padding: 'var(--space-xl)' }}>No orders yet.</p>}
      </div>
    </div>
  );
}

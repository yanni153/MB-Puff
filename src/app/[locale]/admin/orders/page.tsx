import prisma from '@/lib/db';
import StatusSelect from './StatusSelect';

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
      <h1 style={{ marginBottom: 'var(--space-xl)' }}>Manage Orders</h1>
      <div className="mobile-scroll-table" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1000 }}>
          <thead>
            <tr style={{ textAlign: 'left', color: 'var(--text-muted)' }}>
              <th style={{ padding: 'var(--space-md)' }}>Order ID</th>
              <th style={{ padding: 'var(--space-md)' }}>Customer & Phone</th>
              <th style={{ padding: 'var(--space-md)' }}>Location</th>
              <th style={{ padding: 'var(--space-md)' }}>Items Ordered</th>
              <th style={{ padding: 'var(--space-md)' }}>Total</th>
              <th style={{ padding: 'var(--space-md)' }}>Action / Status</th>
              <th style={{ padding: 'var(--space-md)' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} style={{ borderTop: '1px solid var(--border)' }}>
                <td style={{ padding: 'var(--space-md)', fontWeight: 800, fontSize: 12 }}>#{order.id.slice(-8)}</td>
                <td style={{ padding: 'var(--space-md)' }}>
                  <div style={{ fontWeight: 700 }}>{order.customer.firstName} {order.customer.lastName}</div>
                  <a href={`tel:${order.customerPhone}`} style={{ color: 'var(--primary)', fontSize: 13, fontWeight: 700 }}>{order.customerPhone}</a>
                </td>
                <td style={{ padding: 'var(--space-md)' }}>
                  <div style={{ fontSize: 13 }}>{order.wilaya}, {order.commune}</div>
                  <div style={{ color: 'var(--text-hint)', fontSize: 11 }}>{order.addressDetails}</div>
                </td>
                <td style={{ padding: 'var(--space-md)' }}>
                  {order.items.map(item => (
                    <div key={item.id} style={{ fontSize: 12 }}>
                      {item.quantity}x {item.product.name_en}
                      {item.flavor && <span style={{ color: 'var(--text-hint)' }}> (Flavor: {item.flavor})</span>}
                    </div>
                  ))}
                </td>
                <td style={{ padding: 'var(--space-md)', fontWeight: 800, color: 'var(--accent-silver)' }}>{formatPrice(order.totalAmount)}</td>
                <td style={{ padding: 'var(--space-md)' }}>
                  <StatusSelect orderId={order.id} currentStatus={order.status} />
                </td>
                <td style={{ padding: 'var(--space-md)', fontSize: 12 }}>{order.createdAt.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!orders.length && <p style={{ color: 'var(--text-muted)', padding: 'var(--space-xl)' }}>No orders found.</p>}
      </div>
    </div>
  );
}

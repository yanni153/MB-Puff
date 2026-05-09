import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { serializePrisma } from '@/lib/utils';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('orderId')?.trim();
  const phone = searchParams.get('phone')?.trim();

  if (!orderId || !phone) {
    return NextResponse.json({ error: 'Order ID and phone are required' }, { status: 400 });
  }

  let order = null;
  try {
    order = await prisma.order.findFirst({
      where: { id: orderId, customerPhone: phone },
      include: { items: { include: { product: true } } },
    });
  } catch (error) {
    console.error('Order tracking database error:', error);
    return NextResponse.json({ error: 'Tracking is temporarily unavailable' }, { status: 503 });
  }

  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  return NextResponse.json({ order: serializePrisma(order) });
}

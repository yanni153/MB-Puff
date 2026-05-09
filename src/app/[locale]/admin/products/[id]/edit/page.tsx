import prisma from '@/lib/db';
import { notFound } from 'next/navigation';
import ProductEditForm from '@/components/admin/ProductEditForm';
import { serializePrisma } from '@/lib/utils';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await prisma.product.findUnique({
        where: { id }
    });

    if (!product) notFound();

    const categories = await prisma.category.findMany();
    const serializedProduct = serializePrisma(product);
    const serializedCategories = serializePrisma(categories);

    return (
        <div style={{ padding: 'var(--space-xl)', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: 'var(--space-xl)' }}>Edit Product</h1>
            <ProductEditForm product={serializedProduct} categories={serializedCategories} />
        </div>
    );
}

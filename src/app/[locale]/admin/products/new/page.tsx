import prisma from '@/lib/db';
import ProductCreateForm from '@/components/admin/ProductCreateForm';

export default async function NewProductPage() {
    const categories = await prisma.category.findMany({
        orderBy: { name_en: 'asc' },
        select: { id: true, name_en: true },
    });

    return (
        <div style={{ padding: 'var(--space-xl)', maxWidth: '900px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: 'var(--space-xl)' }}>Add New Product</h1>
            <ProductCreateForm categories={categories} />
        </div>
    );
}

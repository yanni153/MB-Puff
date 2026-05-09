import prisma from '@/lib/db';
import { notFound } from 'next/navigation';
import CategoryEditForm from '@/components/admin/CategoryEditForm';

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const category = await prisma.category.findUnique({
        where: { id }
    });

    if (!category) notFound();

    return (
        <div style={{ padding: 'var(--space-xl)', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: 'var(--space-xl)' }}>Edit Category</h1>
            <CategoryEditForm category={category} />
        </div>
    );
}

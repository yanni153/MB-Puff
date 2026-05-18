import prisma from './src/lib/db';

const slugify = (text) => {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
};

async function main() {
    console.log('Fetching products...');
    const products = await prisma.product.findMany();
    
    for (const product of products) {
        const oldSlug = product.slug;
        const newSlug = slugify(product.name_en);
        
        if (oldSlug !== newSlug) {
            console.log(`Updating slug for "${product.name_en}": ${oldSlug} -> ${newSlug}`);
            
            try {
                await prisma.product.update({
                    where: { id: product.id },
                    data: { slug: newSlug }
                });
                console.log(`Successfully updated ${product.id}`);
            } catch (error) {
                console.error(`Failed to update ${product.id}:`, error.message);
            }
        } else {
            console.log(`Slug for "${product.name_en}" is already correct (${newSlug})`);
        }
    }
    console.log('Done!');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

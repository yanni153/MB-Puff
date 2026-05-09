'use client';

import { motion } from 'framer-motion';
import ProductCard from './ProductCard';

interface Product {
    id: string;
    name_en: string;
    name_ar: string;
    name_fr: string;
    slug: string;
    basePrice: any;
    salePrice: any;
    mainImage: string;
    rating?: number;
    reviewCount?: number;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function ProductGrid({ products }: { products: Product[] }) {
    return (
        <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: 'var(--space-lg)',
                marginTop: 'var(--space-lg)'
            }}
        >
            {products.map((product) => (
                <motion.div key={product.id} variants={item}>
                    <ProductCard product={product as any} />
                </motion.div>
            ))}
        </motion.div>
    );
}

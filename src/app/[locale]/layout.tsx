import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import Header from "@/components/Header";
import AgeGate from "@/components/AgeGate";
import Footer from "@/components/Footer";
import WhatsAppButton from '@/components/WhatsAppButton';
import { CartProvider } from '@/contexts/CartContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import prisma from '@/lib/db';
import "../globals.css";

export async function generateMetadata() {
  const t = await getTranslations('Hero');
  return {
    title: `MB Puff — ${t('title')}`,
    description: t('description'),
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      slug: true,
      name_en: true,
      name_ar: true,
      name_fr: true,
    },
  }).catch(() => []);

  return (
    <html lang={locale} dir={dir}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Outfit:wght@400;600;700&family=IBM+Plex+Sans+Arabic:wght@400;600;700&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <CartProvider>
            <WishlistProvider>
              <AgeGate />
              <Header categories={categories} />
              <div style={{ minHeight: '80vh' }}>
                {children}
              </div>
              <WhatsAppButton />
              <Footer />
            </WishlistProvider>
          </CartProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

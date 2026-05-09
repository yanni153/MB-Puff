# MB Puff — Electronic Cigarette & Vape Store Algeria

MB Puff is a premium e-commerce platform for high-quality electronic cigarettes and vape products in Algeria.

## Features
- **Modern Dark Neon Design**: Inspired by premium vape brands.
- **Multilingual Support**: Arabic, French, and English (using `next-intl`).
- **Interactive Hero**: CSS-based animated device with SVG smoke effects.
- **Dynamic Catalog**: Full search and filtering by category and price.
- **Order Tracking**: Real-time status updates for customers.
- **Admin Dashboard**: Comprehensive product and category management.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Database**: Prisma + PostgreSQL
- **Auth**: NextAuth.js (Beta)
- **Styling**: Vanilla CSS + Framer Motion
- **Icons**: Lucide React

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Setup environment:
   Create a `.env.local` file with your database URL and auth secrets.

3. Run migrations and seed:
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

## Admin Access
- **Email**: admin@mbpuff.dz
- **Password**: Admin1234!

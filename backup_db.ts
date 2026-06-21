import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

// Production database URL
const prodDbUrl = "postgresql://neondb_owner:npg_dUhypCFLY1A7@ep-shy-dawn-al3ltlje.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

// Setup PostgreSQL pool and driver adapter
const pool = new Pool({ 
  connectionString: prodDbUrl,
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 60000,
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on database connection pool:', err);
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("⚡ Connecting to production database...");
  try {
    const backupData: Record<string, any> = {};

    // Fetch Categories
    console.log("📥 Fetching Categories...");
    backupData.categories = await prisma.category.findMany();

    // Fetch Products
    console.log("📥 Fetching Products...");
    backupData.products = await prisma.product.findMany();

    // Fetch Variants
    console.log("📥 Fetching Variants...");
    backupData.variants = await prisma.variant.findMany();

    // Fetch Users
    console.log("📥 Fetching Users...");
    backupData.users = await prisma.user.findMany();

    // Fetch Customers
    console.log("📥 Fetching Customers...");
    backupData.customers = await prisma.customer.findMany();

    // Fetch Addresses
    console.log("📥 Fetching Addresses...");
    backupData.addresses = await prisma.address.findMany();

    // Fetch Orders
    console.log("📥 Fetching Orders...");
    backupData.orders = await prisma.order.findMany();

    // Fetch OrderItems
    console.log("📥 Fetching OrderItems...");
    backupData.orderItems = await prisma.orderItem.findMany();

    // Fetch Wishlists
    console.log("📥 Fetching Wishlists...");
    backupData.wishlists = await prisma.wishlist.findMany();

    // Fetch Reviews
    console.log("📥 Fetching Reviews...");
    backupData.reviews = await prisma.review.findMany();

    // Fetch PromoCodes
    console.log("📥 Fetching PromoCodes...");
    backupData.promoCodes = await prisma.promoCode.findMany();

    // Fetch HomepageSections
    console.log("📥 Fetching HomepageSections...");
    backupData.homepageSections = await prisma.homepageSection.findMany();

    // Write to JSON file
    const outputPath = path.join(process.cwd(), 'live_db_backup.json');
    fs.writeFileSync(outputPath, JSON.stringify(backupData, null, 2), 'utf-8');
    
    console.log(`\n🎉 Backup completed successfully!`);
    console.log(`💾 Saved to: ${outputPath}`);
    
    // Print stats
    console.log(`---------------------------------`);
    console.log(`Categories:        ${backupData.categories.length}`);
    console.log(`Products:          ${backupData.products.length}`);
    console.log(`Variants:          ${backupData.variants.length}`);
    console.log(`Users:             ${backupData.users.length}`);
    console.log(`Orders:            ${backupData.orders.length}`);
    console.log(`---------------------------------`);

  } catch (error) {
    console.error("❌ Backup failed:", error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();

# Mezza E-commerce Database Repair Script
# Run this script to sync your Prisma schema and seed the database

Write-Host "🚀 Starting Mezza Database Repair..." -ForegroundColor Cyan

# 1. Generate Prisma Client
Write-Host "📦 Generating Prisma Client..." -ForegroundColor Yellow
npx prisma generate

# 2. Push Schema to Database
Write-Host "🏗️  Pushing schema to database..." -ForegroundColor Yellow
npx prisma db push

# 3. Seed Database
Write-Host "🌱 Seeding database..." -ForegroundColor Yellow
npm run seed

Write-Host "✅ Database repair completed successfully!" -ForegroundColor Green
Write-Host "Please restart your development server (npm run dev)." -ForegroundColor Green

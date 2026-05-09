import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

function decodePrismaPostgresUrl(connectionString: string) {
  if (!connectionString.startsWith('prisma+postgres://')) {
    return connectionString;
  }

  try {
    const url = new URL(connectionString);
    const apiKey = url.searchParams.get('api_key');
    if (!apiKey) {
      return connectionString;
    }

    let normalized = apiKey.replace(/-/g, '+').replace(/_/g, '/');
    const remainder = normalized.length % 4;
    if (remainder) {
      normalized += '='.repeat(4 - remainder);
    }

    const decoded = JSON.parse(Buffer.from(normalized, 'base64').toString('utf8'));
    return decoded.databaseUrl || connectionString;
  } catch {
    console.warn('Failed to decode prisma+postgres DATABASE_URL; using the original connection string.');
    return connectionString;
  }
}

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    throw new Error('DATABASE_URL is not defined');
  }

  const pool = new Pool({ 
    connectionString: decodePrismaPostgresUrl(connectionString),
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 60000,
  });

  pool.on('error', (err) => {
    console.error('❌ Unexpected error on idle database client', err);
  });

  const adapter = new PrismaPg(pool);
  
  return new PrismaClient({ 
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['warn'] : ['error']
  });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;

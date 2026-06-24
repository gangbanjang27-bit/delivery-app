import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// Suppress 'pg' package SSL warning that triggers Next.js dev overlay
const originalEmitWarning = process.emitWarning;
// @ts-ignore
process.emitWarning = function (warning, type, code, ...args) {
  if (typeof warning === 'string' && warning.includes('SECURITY WARNING: The SSL modes')) return;
  return originalEmitWarning(warning, type as any, code as any, ...args as any[]);
};

const connectionString = `${process.env.DATABASE_URL}`;

const globalForPrisma = global as unknown as { prismaDB3: PrismaClient };

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prismaDB3 ||
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prismaDB3 = prisma;

export default prisma;

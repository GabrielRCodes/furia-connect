import { PrismaClient } from '@prisma/client';

// PrismaClient é vinculado a uma variável global em desenvolvimento para evitar
// múltiplas instâncias durante hot-reloading.
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ['error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') global.prisma = prisma; 
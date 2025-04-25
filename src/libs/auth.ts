import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import ResendProvider from './resend-provider';
import { prisma } from './prisma';

/**
 * Configuração do Auth.js
 */
export const authOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "database" as const,
  },
  pages: {
    signIn: '/login',
    verifyRequest: '/verify-request',
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    ResendProvider({
      apiKey: process.env.RESEND_API_KEY || '',
      from: process.env.EMAIL_FROM || 'noreply@furiaconnect.com',
    }),
  ],
};

/**
 * Exportação no formato solicitado
 */
export const { auth, handlers, signIn, signOut } = NextAuth(authOptions); 
import { PrismaAdapter } from '@auth/prisma-adapter';
import { NextAuthOptions } from 'next-auth';
import { getServerSession } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { prisma } from './prisma';

/**
 * Módulo para configuração do Next-Auth
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    session: ({ session, user }) => {
      if (session.user) {
        session.user.id = user.id;
        session.user.image = user.image;
        session.user.name = user.name;
        session.user.email = user.email;
      }
      return session;
    },
  }
};

/**
 * Função auxiliar para obter a sessão do usuário do lado do servidor
 */
export async function auth() {
  return getServerSession(authOptions);
} 
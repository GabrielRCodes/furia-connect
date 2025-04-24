import { NextIntlClientProvider } from 'next-intl';
import { cookies, headers } from 'next/headers';
import { getMessages } from 'next-intl/server';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from '@/components/Providers';
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FURIA Connect",
  description: "Plataforma de conexão FURIA",
};

// Impedir que esta página seja armazenada em cache para garantir que mudanças de idioma sejam aplicadas
export const revalidate = 0;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Obter locale do cabeçalho ou cookie
  const headersList = await headers();
  const cookieStore = await cookies();
  
  const headerLocale = headersList.has('x-next-intl-locale') 
    ? headersList.get('x-next-intl-locale') 
    : null;
  
  const cookieLocale = cookieStore.has('NEXT_LOCALE') 
    ? cookieStore.get('NEXT_LOCALE')?.value 
    : null;
  
  const locale = (headerLocale || cookieLocale || 'pt-BR') as string;
  // console.log(`Layout - Usando locale: ${locale}`);
  
  // Obter mensagens para componentes cliente
  const messages = await getMessages();
  // console.log(`Layout - Mensagens carregadas para: ${locale}`);

  return (
    <html lang={locale} suppressHydrationWarning className="dark">
      <body className={`${inter.variable} antialiased font-sans`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <div className="relative flex min-h-screen flex-col">
              <div className="flex-1">
                {children}
              </div>
            </div>
            <Toaster />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

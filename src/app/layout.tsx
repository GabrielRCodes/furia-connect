import { NextIntlClientProvider } from 'next-intl';
import { cookies, headers } from 'next/headers';
import { getMessages } from 'next-intl/server';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from '@/components/Providers';
import { AuthProvider } from '@/components/AuthProvider';
import { Toaster } from "@/components/ui/sonner";
import { HeaderWrapper } from '@/components/HeaderWrapper';
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FURIA Connect | Conecte-se com a FURIA",
  description: "Uma plataforma feita para conectar fãs da FURIA. Conecte-se, conheça outros fãs, apoie o projeto e acompanhe todas as novidades da organização.",
  keywords: ["FURIA", "eSports", "comunidade", "jogos", "eventos", "gaming"],
  authors: [{ name: "FURIA eSports" }],
  creator: "FURIA",
  publisher: "FURIA eSports",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://furia-connect.0r1.org",
    title: "FURIA Connect | Conecte-se com a FURIA",
    description: "Uma plataforma feita para conectar fãs da FURIA. Conecte-se, conheça outros fãs, apoie o projeto e acompanhe todas as novidades da organização.",
    siteName: "FURIA Connect",
    images: [
      {
        url: "https://res.cloudinary.com/dnuayiowd/image/upload/v1745531725/LOGO-MAIN_linrk0.png",
        width: 1200,
        height: 630,
        alt: "FURIA Connect - Plataforma Oficial",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FURIA Connect | Conecte-se com a FURIA",
    description: "Uma plataforma feita para conectar fãs da FURIA. Conecte-se, conheça outros fãs, apoie o projeto e acompanhe todas as novidades da organização.",
    images: ["https://res.cloudinary.com/dnuayiowd/image/upload/v1745531725/LOGO-MAIN_linrk0.png"],
    creator: "@furiagg",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  metadataBase: new URL("https://furia-connect.0r1.org"),
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
        <AuthProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Providers>
              <div className="relative flex min-h-screen flex-col">
                <HeaderWrapper />
                <div className="flex-1">
                  {children}
                </div>
              </div>
              <Toaster />
            </Providers>
          </NextIntlClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

import createNextIntlPlugin from 'next-intl/plugin';

// Configuração sem uso de rotas para locales
const withNextIntl = createNextIntlPlugin({
  // Defina explicitamente
  locales: ['en', 'pt-BR'],
  defaultLocale: 'pt-BR',
  localePrefix: 'never', // Importante: nunca usar prefixo de locale na URL
  localeDetection: false, // Desabilitar detecção automática de locale
  requestConfig: './src/i18n/request.ts'
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Outras configurações experimentais, se houver
  },
  serverExternalPackages: [], // Movido da seção experimental
  images: {
    domains: [
      'lh3.googleusercontent.com', // Google OAuth avatars
      'res.cloudinary.com', // Cloudinary images
    ],
    unoptimized: true, // Desabilita a otimização automática de imagens pelo Next.js
  }
};

export default withNextIntl(nextConfig); 
export const locales = ['en', 'pt-BR'] as const;
export type Locale = (typeof locales)[number]; 
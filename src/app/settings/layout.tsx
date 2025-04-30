import { auth } from '@/libs/auth';
import { redirect } from 'next/navigation';

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Verificar sessão do lado do servidor
  const session = await auth();

  // Se não estiver autenticado, redirecionar para a página de login
  if (!session) {
    redirect('/login');
  }

  // Se estiver autenticado, mostrar o conteúdo da página de configurações
  return <>{children}</>;
} 
import { auth } from '@/libs/auth';
import { redirect } from 'next/navigation';

export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Verificar sessão do lado do servidor
  const session = await auth();

  // Se o usuário estiver autenticado, redirecionar para a página inicial
  if (session) {
    redirect('/chat');
  }

  // Se não estiver autenticado, mostrar o conteúdo da página de login
  return (
    <div className="flex min-h-screen w-full items-center justify-center py-8">
      {children}
    </div>
  );
} 
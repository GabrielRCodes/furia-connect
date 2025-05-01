import { auth } from '@/libs/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function VerifyRequestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Verificar se o usuário já está autenticado
  const session = await auth();
  
  // Se estiver logado, redirecionar para a página inicial
  if (session?.user) {
    redirect('/chat');
  }
  
  // Verificar se existe o cookie de verificação
  const cookieStore = await cookies();
  const verificationEmail = cookieStore.get('verification_email');
  
  // Se não existir o cookie, redirecionar para a página inicial
  if (!verificationEmail) {
    redirect('/login');
  }
  
  // Se passou pelas verificações, mostrar a página
  return (
    <div>
      {children}
    </div>
  );
} 
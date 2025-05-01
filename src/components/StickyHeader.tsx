"use client"

import { HeaderActions } from '@/components/HeaderActions';
import { usePathname } from 'next/navigation';

export function StickyHeader() {
  const pathname = usePathname();
  
  // Não renderizar o header na página de login
  if (pathname === '/login' || pathname === '/verify-request') {
    return null;
  }

  return (
    <div className={`sticky top-0 w-full bg-background z-50 border-b border-border`}>
      <div className="w-full max-w-7xl mx-auto flex justify-between items-center p-3">
        {/* Logo - lado esquerdo */}
        <div className="font-medium text-xl">
          Furia Connect
        </div>
        
        {/* Ações do header - lado direito */}
        <HeaderActions />
      </div>
    </div>
  );
} 
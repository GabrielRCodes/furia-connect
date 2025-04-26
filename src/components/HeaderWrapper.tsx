"use server"

import { Header } from '@/components/Header';
import { StickyHeader } from '@/components/StickyHeader';

export async function HeaderWrapper() {
  return (
    <>
      <header className="w-full">
        <Header />
      </header>
      <StickyHeader />
    </>
  );
}
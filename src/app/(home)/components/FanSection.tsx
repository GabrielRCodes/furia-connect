'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FiArrowRight, FiUsers, FiHeadphones, FiMessageSquare } from 'react-icons/fi';
import { useTranslations } from 'next-intl';

export default function FanSection() {
  const t = useTranslations('Home.fan');
  
  return (
    <section className="container mx-auto px-4 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl md:text-4xl font-bold">{t('title')}</h2>
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <FiUsers className="h-5 w-5 text-primary" />
        </div>
      </div>
      
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="flex flex-col lg:flex-row p-8 md:p-10 gap-10 items-center">
          {/* Conteúdo textual à esquerda */}
          <div className="lg:w-1/2 space-y-5">
            <h3 className="text-2xl md:text-3xl font-semibold leading-tight">{t('subtitle')}</h3>
            
            <p className="text-muted-foreground text-lg">
              {t('description')}
            </p>
            
            <div className="space-y-4 py-2">
              <div className="flex items-start gap-3">
                <div className="mt-1 h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FiHeadphones className="h-4 w-4 text-primary" />
                </div>
                <p className="text-md">
                  <span className="font-medium">{t('support.title')}</span> - {t('support.description')}
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="mt-1 h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FiMessageSquare className="h-4 w-4 text-primary" />
                </div>
                <p className="text-md">
                  <span className="font-medium">{t('community.title')}</span> - {t('community.description')}
                </p>
              </div>
            </div>
            
            <p className="text-muted-foreground text-lg">
              {t('conclusion')}
            </p>
            
            <div className="pt-4">
              <Button size="lg" className="group w-full md:w-auto" asChild>
                <Link href="/chat">
                  {t('button')}
                  <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Imagem à direita */}
          <div className="lg:w-1/2 h-80 lg:h-[450px] relative rounded-lg overflow-hidden w-full">
            <Image 
              src="https://res.cloudinary.com/dnuayiowd/image/upload/v1745707971/torcida-furia_jwizwm.jpg"
              alt={t('imageAlt')}
              fill
              className="object-cover select-none"
              draggable={false}
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}

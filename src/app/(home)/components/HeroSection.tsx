'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FiHelpCircle, FiUsers, FiMessageCircle, FiCalendar, FiVideo, FiChevronRight } from 'react-icons/fi';
import { useTranslations } from 'next-intl';

export default function HeroSection() {
  const t = useTranslations('Home.hero');
  
  return (
    <section id="about" className="container mx-auto px-4 max-w-7xl">
      <div className="flex flex-col lg:flex-row gap-5">
        {/* Imagem vertical da esquerda (clicável) */}
        <Link href="/login" className="lg:w-1/3 relative min-h-[480px] rounded-xl overflow-hidden bg-accent/20 block group">
          <Image 
            src="https://res.cloudinary.com/dnuayiowd/image/upload/v1745690690/Torcida-FURIA-IEM-Rio-Major-2022_xkft48.jpg" 
            alt="FURIA Connect"
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority
          />
          {/* Overlay com gradiente (adaptado para tema claro e escuro) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent dark:from-black/80 dark:via-black/40 flex items-end p-6">
            <div className="text-white">
              <h1 className="text-3xl md:text-4xl font-bold drop-shadow-md">FURIA Connect</h1>
              <p className="text-lg mt-2 max-w-md text-white/90 drop-shadow-md">{t('slogan')}</p>
              
              {/* Indicador de clique para mobile (com fundo opaco em vez de blur) */}
              <div className="flex items-center gap-2 mt-4 text-primary bg-black/40 dark:bg-black/60 w-fit px-3 py-1.5 rounded-full border border-white/20">
                <span className="animate-pulse text-white">•</span>
                <span className="text-sm text-white drop-shadow-md">{t('tapToExplore')}</span>
              </div>
            </div>
          </div>
        </Link>
        
        {/* Bento grid à direita */}
        <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Item 1: Tire suas dúvidas */}
          <Link href="/login" className="bg-card hover:bg-accent/10 transition-colors rounded-xl p-5 flex flex-col h-[170px] border border-border group relative">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <FiHelpCircle className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-xl font-medium">{t('askQuestions.title')}</h3>
            <p className="mt-1 text-muted-foreground text-sm flex-1">{t('askQuestions.description')}</p>
            <div className="absolute top-5 right-5 text-primary flex items-center text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              <FiChevronRight className="h-4 w-4" />
            </div>
          </Link>
          
          {/* Item 2: Entre em contato com a FURIA */}
          <Link href="/login" className="bg-card hover:bg-accent/10 transition-colors rounded-xl p-5 flex flex-col h-[170px] border border-border group relative">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <FiMessageCircle className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-xl font-medium">{t('contactFuria.title')}</h3>
            <p className="mt-1 text-muted-foreground text-sm flex-1">{t('contactFuria.description')}</p>
            <div className="absolute top-5 right-5 text-primary flex items-center text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              <FiChevronRight className="h-4 w-4" />
            </div>
          </Link>
          
          {/* Item 3: Calendário de jogos */}
          <Link href="/login" className="bg-card hover:bg-accent/10 transition-colors rounded-xl p-5 flex flex-col h-[170px] border border-border group relative">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <FiCalendar className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-xl font-medium">{t('matchSchedule.title')}</h3>
            <p className="mt-1 text-muted-foreground text-sm flex-1">{t('matchSchedule.description')}</p>
            <div className="absolute top-5 right-5 text-primary flex items-center text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              <FiChevronRight className="h-4 w-4" />
            </div>
          </Link>
          
          {/* Item 4: Criadores de conteúdo */}
          <Link href="/login" className="bg-card hover:bg-accent/10 transition-colors rounded-xl p-5 flex flex-col h-[170px] border border-border group relative">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <FiVideo className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-xl font-medium">{t('contentCreators.title')}</h3>
            <p className="mt-1 text-muted-foreground text-sm flex-1">{t('contentCreators.description')}</p>
            <div className="absolute top-5 right-5 text-primary flex items-center text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              <FiChevronRight className="h-4 w-4" />
            </div>
          </Link>
          
          {/* Item 5: Comunidade */}
          <Link href="/login" className="md:col-span-2 bg-card hover:bg-accent/10 transition-colors rounded-xl p-5 flex flex-col h-[170px] border border-border group relative">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <FiUsers className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-xl font-medium">{t('community.title')}</h3>
            <p className="mt-1 text-muted-foreground text-sm flex-1">{t('community.description')}</p>
            <div className="absolute top-5 right-5 text-primary flex items-center text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              <FiChevronRight className="h-4 w-4" />
            </div>
          </Link>
        </div>
    </div>
    </section>
  );
}

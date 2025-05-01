'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { 
  FiArrowRight, 
  FiUsers, 
  FiHelpCircle} from 'react-icons/fi';
import { MessageSquare, Clock } from 'lucide-react';

export default function ContactSection() {
  const t = useTranslations('Home.contact');
  
  return (
    <section id="contact" className="container mx-auto px-4 max-w-7xl">
      <div className="flex items-center justify-center mb-10">
        <div className="text-center max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">{t('title')}</h2>
          <p className="text-xl text-muted-foreground">{t('subtitle')}</p>
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-card to-background border border-border rounded-xl overflow-hidden shadow-lg">
        <div className="p-8 md:p-12 flex flex-col items-center text-center">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-8">
            <MessageSquare className="h-8 w-8 text-primary" />
          </div>
          
          <h3 className="text-2xl md:text-3xl font-semibold mb-6">{t('heading')}</h3>
          
          <p className="text-lg text-muted-foreground max-w-3xl mb-8">
            {t('description')}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl mb-10">
            <div className="bg-card/60 backdrop-blur-sm p-6 rounded-lg border border-border flex flex-col items-center">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <FiUsers className="h-5 w-5 text-primary" />
              </div>
              <h4 className="font-medium mb-2">{t('cards.community.title')}</h4>
              <p className="text-sm text-muted-foreground text-center">
                {t('cards.community.description')}
              </p>
            </div>
            
            <div className="bg-card/60 backdrop-blur-sm p-6 rounded-lg border border-border flex flex-col items-center">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <h4 className="font-medium mb-2">{t('cards.support.title')}</h4>
              <p className="text-sm text-muted-foreground text-center">
                {t('cards.support.description')}
              </p>
            </div>
            
            <div className="bg-card/60 backdrop-blur-sm p-6 rounded-lg border border-border flex flex-col items-center">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <FiHelpCircle className="h-5 w-5 text-primary" />
              </div>
              <h4 className="font-medium mb-2">{t('cards.questions.title')}</h4>
              <p className="text-sm text-muted-foreground text-center">
                {t('cards.questions.description')}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-center justify-center w-full max-w-md">
            <p className="text-lg font-medium mb-6">{t('cta.prompt')}</p>
            <Button size="lg" className="group w-full md:w-auto px-8" asChild>
              <Link href="/login">
                {t('cta.button')}
                <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

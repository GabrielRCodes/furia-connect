"use client"

import { User } from "@prisma/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslations } from "next-intl"

interface EmailFormProps {
  user: User | null
}

export function EmailForm({ user }: EmailFormProps) {
  const t = useTranslations('Settings.email')
  
  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-primary">
            <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
            <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
          </svg>
          <CardTitle>{t('title')}</CardTitle>
        </div>
        <CardDescription>
          {t('description')}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="bg-muted/40 px-3 py-2 rounded-md font-medium w-full">
          {user?.email || t('noEmail')}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {t('emailNotEditable')}
        </p>
      </CardContent>
    </Card>
  )
} 
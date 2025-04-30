"use client"

import { User } from "@prisma/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslations } from "next-intl"
import { FiMail } from "react-icons/fi"

interface EmailFormProps {
  user: User | null
}

export function EmailForm({ user }: EmailFormProps) {
  const t = useTranslations('Settings.email')
  
  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <FiMail className="w-5 h-5 text-primary" />
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
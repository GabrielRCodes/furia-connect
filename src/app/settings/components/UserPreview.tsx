"use client"

import { User } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useTranslations } from "next-intl"
import { useLocale } from "@/components/Providers"

interface UserPreviewProps {
  user: User | null
}

export function UserPreview({ user }: UserPreviewProps) {
  const t = useTranslations('Settings.userPreview')
  const { locale } = useLocale()
  
  if (!user) {
    return null
  }

  const formattedJoinDate = user.createdAt ? 
    format(
      new Date(user.createdAt), 
      locale === 'pt-BR' ? "dd 'de' MMMM 'de' yyyy" : "MMMM d, yyyy", 
      { locale: locale === 'pt-BR' ? ptBR : undefined }
    ) : 
    t('unknownDate')

  return (
    <Card className="sticky top-22 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{t('title')}</CardTitle>
        <CardDescription>
          {t('description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <Avatar className="h-24 w-24 border-2 border-primary/10 shadow-sm">
          {user.image ? (
            <AvatarImage src={user.image} alt={user.name || "Avatar"} />
          ) : (
            <AvatarFallback className="text-4xl bg-muted/50 text-primary">
              {user.name ? user.name[0].toUpperCase() : '?'}
            </AvatarFallback>
          )}
        </Avatar>
        
        <div className="mt-4 text-center w-full">
          <h3 className="text-lg font-semibold mb-1 text-primary">
            {user.name || t('noName')}
          </h3>
          <p className="text-muted-foreground text-sm mb-3">{user.email}</p>
          
          <div className="bg-muted/50 rounded-md py-2 px-3 text-xs text-muted-foreground flex items-center justify-center gap-1">
            <span>{t('memberSince')} {formattedJoinDate}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 
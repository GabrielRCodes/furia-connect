"use client"

import { User } from "@prisma/client"
import { useState, useEffect } from "react"
import { useFormStatus } from "react-dom"
import { updateUserName } from "../actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"
import { Loader2 } from "lucide-react"
import { FiUser, FiEdit, FiClock, FiSave } from "react-icons/fi"

// Componente para o botão de salvar com estado de loading interno
function SaveButton() {
  const { pending } = useFormStatus()
  const t = useTranslations('Settings.name')

  return (
    <Button 
      type="submit" 
      disabled={pending}
      className="gap-1"
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {t('saving')}
        </>
      ) : (
        <>
          <FiSave className="w-4 h-4" />
          {t('save')}
        </>
      )}
    </Button>
  )
}

interface NameFormProps {
  user: User | null
}

export function NameForm({ user }: NameFormProps) {
  const t = useTranslations('Settings.name')

  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(user?.name || "")
  const [message, setMessage] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)
  const [isCooldown, setIsCooldown] = useState(false)
  const [isEditButtonLoading, setIsEditButtonLoading] = useState(false)

  // Efeito para limpar a mensagem de sucesso após 5 segundos
  useEffect(() => {
    if (message && isSuccess) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [message, isSuccess]);

  const handleSubmit = async (formData: FormData) => {
    setMessage("")
    setIsCooldown(false)
    
    try {
      const result = await updateUserName(formData)
      setIsSuccess(result.success)
      setMessage(result.message)
      
      if (result.cooldown) {
        setIsCooldown(true)
      }
      
      if (result.success) {
        setIsEditing(false)
      }
    } catch {
      setIsSuccess(false)
      setMessage(t('error'))
    }
  }

  const handleEditClick = () => {
    setIsEditButtonLoading(true);
    // Simular pequeno atraso para mostrar o loading
    setTimeout(() => {
      setIsEditing(true);
      setIsEditButtonLoading(false);
    }, 300);
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <FiUser className="w-5 h-5 text-primary" />
          <CardTitle>{t('title')}</CardTitle>
        </div>
        <CardDescription>
          {t('description')}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {message && (
          <div className={cn(
            "p-3 rounded mb-4 transition-opacity",
            isSuccess ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : 
                       "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
          )}>
            {message}
          </div>
        )}
        
        {isEditing ? (
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('newName')}</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('placeholder')}
                required
                className="max-w-md"
              />
              <p className="text-xs text-muted-foreground">
                {t('hint')}
              </p>
            </div>
            
            <div className="flex gap-2 mt-5">
              <SaveButton />
              
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditing(false)
                  setName(user?.name || "")
                  setMessage("")
                }}
              >
                {t('cancel')}
              </Button>
            </div>
            {isCooldown && (
              <div className="flex items-center mt-2 text-sm text-amber-600 dark:text-amber-400">
                <FiClock className="w-4 h-4 mr-1" />
                {t('cooldown')}
              </div>
            )}
          </form>
        ) : (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="bg-muted/40 px-3 py-2 rounded-md font-medium w-full sm:flex-1">
              {user?.name || t('noName')}
            </div>
            <Button 
              onClick={handleEditClick}
              variant="outline"
              size="sm"
              disabled={isEditButtonLoading}
              className="gap-1 whitespace-nowrap"
            >
              {isEditButtonLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <FiEdit className="w-4 h-4" />
                  {t('edit')}
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 
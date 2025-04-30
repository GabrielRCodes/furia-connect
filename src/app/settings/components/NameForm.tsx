"use client"

import { User } from "@prisma/client"
import { useState } from "react"
import { updateUserName } from "../actions"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useTranslations } from "next-intl"

interface NameFormProps {
  user: User | null
}

export function NameForm({ user }: NameFormProps) {
  const t = useTranslations('Settings.name')

  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(user?.name || "")
  const [message, setMessage] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isCooldown, setIsCooldown] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
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
    } catch (error) {
      setIsSuccess(false)
      setMessage(t('error'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-primary">
            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
          </svg>
          <CardTitle>{t('title')}</CardTitle>
        </div>
        <CardDescription>
          {t('description')}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {message && (
          <div className={cn(
            "p-3 rounded mb-4",
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
              <Button 
                type="submit" 
                disabled={isLoading || isCooldown}
              >
                {isLoading ? t('saving') : t('save')}
              </Button>
              
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
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1">
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
                </svg>
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
              onClick={() => setIsEditing(true)}
              variant="outline"
              size="sm"
              className="gap-1 whitespace-nowrap"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
                <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
              </svg>
              {t('edit')}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 
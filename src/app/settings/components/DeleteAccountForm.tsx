"use client"

import { useState } from "react"
import { deleteUserAccount } from "../actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTranslations } from "next-intl"

export function DeleteAccountForm() {
  const t = useTranslations('Settings.delete')
  
  const [isConfirming, setIsConfirming] = useState(false)
  const [confirmation, setConfirmation] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isCooldown, setIsCooldown] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    setMessage("")
    setIsCooldown(false)
    
    try {
      const result = await deleteUserAccount(formData)
      
      // Se retornou um resultado, é porque houve um erro (senão teria redirecionado)
      if (result) {
        setMessage(result.message)
        
        if (result.cooldown) {
          setIsCooldown(true)
        }
      }
    } catch {
      setMessage(t('error'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="shadow-md border border-red-100 dark:border-red-900/30">
      <CardHeader>
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-destructive">
            <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clipRule="evenodd" />
          </svg>
          <CardTitle className="text-destructive">{t('title')}</CardTitle>
        </div>
        <CardDescription>
          {t('description')}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {message && (
          <div className="p-3 rounded mb-4 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            {message}
          </div>
        )}
        
        {isConfirming ? (
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-3 max-w-md">
              <div className="bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-400 p-3 rounded-md flex gap-2 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0 mt-0.5">
                  <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-medium">{t('warning')}</p>
                  <p className="text-sm">{t('warningMessage')}</p>
                </div>
              </div>
              
              <Label htmlFor="confirmation" className="text-destructive font-medium">
                {t('instruction')}
              </Label>
              <Input
                type="text"
                id="confirmation"
                name="confirmation"
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                placeholder={t('placeholder')}
                className="border-red-200 dark:border-red-900/50"
                required
              />
            </div>
            
            <div className="flex gap-2 mt-5">
              <Button 
                type="submit" 
                disabled={isLoading || confirmation !== "DELETE" || isCooldown}
                variant="destructive"
                className="gap-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clipRule="evenodd" />
                </svg>
                {isLoading ? t('deleting') : t('confirm')}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsConfirming(false)
                  setConfirmation("")
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
          <div className="space-y-4">
            <div className="bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-500 p-3 rounded-md">
              {t('explanation')}
            </div>
            
            <Button 
              onClick={() => setIsConfirming(true)}
              variant="destructive"
              className="gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clipRule="evenodd" />
              </svg>
              {t('button')}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 
"use client"

import { useState, useEffect } from "react"
import { useFormStatus } from "react-dom"
import { deleteUserAccount } from "../actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTranslations } from "next-intl"
import { Loader2 } from "lucide-react"
import { FiTrash2, FiAlertTriangle, FiClock } from "react-icons/fi"

// Componente para o botão de exclusão com estado de loading interno
function DeleteButton({ isDisabled }: { isDisabled: boolean }) {
  const { pending } = useFormStatus()
  const t = useTranslations('Settings.delete')

  return (
    <Button 
      type="submit" 
      disabled={pending || isDisabled}
      variant="destructive"
      className="gap-1"
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {t('deleting')}
        </>
      ) : (
        <>
          <FiTrash2 className="w-4 h-4" />
          {t('confirm')}
        </>
      )}
    </Button>
  )
}

export function DeleteAccountForm() {
  const t = useTranslations('Settings.delete')
  
  const [isConfirming, setIsConfirming] = useState(false)
  const [confirmation, setConfirmation] = useState("")
  const [message, setMessage] = useState("")
  const [isCooldown, setIsCooldown] = useState(false)
  const [isDeleteButtonLoading, setIsDeleteButtonLoading] = useState(false)

  // Efeito para limpar a mensagem de erro após 5 segundos
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSubmit = async (formData: FormData) => {
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
    }
  }

  const handleDeleteClick = () => {
    setIsDeleteButtonLoading(true);
    // Simular pequeno atraso para mostrar o loading
    setTimeout(() => {
      setIsConfirming(true);
      setIsDeleteButtonLoading(false);
    }, 300);
  };

  return (
    <Card className="shadow-md border border-red-100 dark:border-red-900/30">
      <CardHeader>
        <div className="flex items-center gap-2">
          <FiTrash2 className="w-5 h-5 text-destructive" />
          <CardTitle className="text-destructive">{t('title')}</CardTitle>
        </div>
        <CardDescription>
          {t('description')}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {message && (
          <div className="p-3 rounded mb-4 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 transition-opacity">
            {message}
          </div>
        )}
        
        {isConfirming ? (
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-3 max-w-md">
              <div className="bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-400 p-3 rounded-md flex gap-2 mb-2">
                <FiAlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
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
              <DeleteButton isDisabled={confirmation !== "DELETE" || isCooldown} />
              
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
                <FiClock className="w-4 h-4 mr-1" />
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
              onClick={handleDeleteClick}
              variant="destructive"
              disabled={isDeleteButtonLoading}
              className="gap-1"
            >
              {isDeleteButtonLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <FiTrash2 className="w-4 h-4" />
                  {t('button')}
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 
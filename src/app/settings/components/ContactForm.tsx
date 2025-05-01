"use client"

import { useState, useEffect } from "react"
import { z } from "zod"
import { User } from "@prisma/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { useTranslations } from "next-intl"
import { FiUser, FiSave, FiEdit, FiCheck, FiLoader } from "react-icons/fi"
import { updateContactInfo } from "../actions"
import { toast } from "sonner"

// Media types
type MediaType = "whatsapp" | "telegram" | "discord" | "email";

// Schema de validação
const contactSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  cpf: z.string().regex(/^\d{11}$/, { message: "CPF deve ter 11 dígitos numéricos" }),
  mediaName: z.enum(["whatsapp", "telegram", "discord", "email"] as const, {
    message: "Selecione uma rede social válida"
  }).optional(),
  mediaContact: z.string().min(3, { message: "Contato deve ter pelo menos 3 caracteres" }).optional()
})

type ContactFormData = z.infer<typeof contactSchema>

interface ContactFormProps {
  user: User | null;
  contactInfo?: {
    id: string;
    name: string | null;
    email: string | null;
    cpf: string | null;
    mediaName: string | null;
    mediaContact: string | null;
    createdAt: Date;
    userId: string;
  } | null;
  exists: boolean;
}

export function ContactForm({ user, contactInfo, exists }: ContactFormProps) {
  const t = useTranslations('Settings.contact')
  
  // Estado para valor da mídia social
  const [currentMediaName, setCurrentMediaName] = useState<MediaType>("whatsapp");
  
  // Estado para controlar o popover
  const [popoverOpen, setPopoverOpen] = useState(false);
  
  // Estado para o loading do botão de salvar
  const [isSaving, setIsSaving] = useState(false);
  
  // Estado para mensagem de erro ou sucesso
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);
  
  // Estado de cooldown
  const [isCooldown, setIsCooldown] = useState(false);
  
  // Estado inicial do formulário
  const [formData, setFormData] = useState<ContactFormData>({
    name: contactInfo?.name || user?.name || "",
    email: contactInfo?.email || user?.email || "",
    cpf: contactInfo?.cpf || "",
    mediaName: currentMediaName,
    mediaContact: contactInfo?.mediaContact || ""
  });
  
  // Estado para erros de validação
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Limpar mensagem após 5 segundos
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [message]);
  
  // Atualiza o mediaName quando o contactInfo mudar
  useEffect(() => {
    if (!exists) return; // Não executar o efeito se o componente não deve ser renderizado
    
    if (contactInfo?.mediaName) {
      const typedMediaName = contactInfo.mediaName.toLowerCase() as MediaType;
      
      setCurrentMediaName(typedMediaName);
      
      // Atualiza também no formData
      setFormData(prev => ({
        ...prev,
        mediaName: typedMediaName
      }));
    }
  }, [contactInfo, exists]);
  
  // Manipulador de mudança de campo
  const handleChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Atualiza o estado currentMediaName se o campo for mediaName
    if (field === "mediaName") {
      setCurrentMediaName(value as MediaType);
    }
    
    // Limpa o erro do campo quando o usuário altera o valor
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }
  
  // Validação e envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Limpa mensagens
    setMessage(null);
    setIsCooldown(false);
    
    try {
      // Valida os dados do formulário
      contactSchema.parse(formData)
      
      // Prepara os dados para envio
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('cpf', formData.cpf);
      if (formData.mediaName) formDataToSend.append('mediaName', formData.mediaName);
      if (formData.mediaContact) formDataToSend.append('mediaContact', formData.mediaContact);
      
      // Inicia o estado de salvando
      setIsSaving(true);
      
      // Envia os dados para o servidor
      const result = await updateContactInfo(formDataToSend);
      
      // Processa o resultado
      if (result.success) {
        setMessage({ type: "success", text: t('success') });
        toast.success(t('success'));
        // Limpar erros de validação
        setErrors({});
      } else {
        if (result.cooldown) {
          setIsCooldown(true);
          setMessage({ type: "error", text: t('cooldown') });
          toast.error(t('cooldown'));
        } else if (result.errors) {
          // Processa erros de validação do servidor
          const serverErrors: Record<string, string> = {};
          result.errors.forEach((err: { path: string; message: string }) => {
            serverErrors[err.path] = err.message;
          });
          setErrors(serverErrors);
          setMessage({ type: "error", text: t('validation_error') });
          toast.error(t('validation_error'));
        } else {
          setMessage({ type: "error", text: result.message || t('error') });
          toast.error(result.message || t('error'));
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Formatar erros do Zod
        const formattedErrors: Record<string, string> = {}
        error.errors.forEach(err => {
          if (err.path[0]) {
            formattedErrors[err.path[0] as string] = err.message
          }
        })
        setErrors(formattedErrors)
        
        // Mostrar mensagem genérica de erro
        setMessage({ type: "error", text: t('validation_error') });
        toast.error(t('validation_error'));
      } else {
        // Lidar com outros tipos de erro
        setMessage({ type: "error", text: t('error') });
        toast.error(t('error'));
      }
    } finally {
      setIsSaving(false);
    }
  }

  // Função para obter o nome formatado da rede social
  const getMediaNameDisplayText = () => {
    switch (formData.mediaName) {
      case "whatsapp": return "WhatsApp";
      case "telegram": return "Telegram";
      case "discord": return "Discord";
      case "email": return "E-mail";
      default: return t('socialMediaPlaceholder');
    }
  };
  
  // Função para mudar a rede social
  const handleMediaChange = (mediaType: MediaType) => {
    handleChange("mediaName", mediaType);
    setPopoverOpen(false);
  };

  // Se não existir contato, não renderiza o componente
  if (!exists) {
    return null;
  }

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
          <div className={`p-3 rounded mb-4 ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
          } transition-opacity`}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('name')}</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder={t('namePlaceholder')}
              className={errors.name ? "border-red-500" : ""}
              disabled={isSaving || isCooldown}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">{t('email')}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder={t('emailPlaceholder')}
              className={errors.email ? "border-red-500" : ""}
              disabled={isSaving || isCooldown}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cpf">{t('cpf')}</Label>
            <Input
              id="cpf"
              name="cpf"
              value={formData.cpf}
              onChange={(e) => handleChange("cpf", e.target.value.replace(/\D/g, '').slice(0, 11))}
              placeholder={t('cpfPlaceholder')}
              className={errors.cpf ? "border-red-500" : ""}
              disabled={isSaving || isCooldown}
            />
            {errors.cpf && (
              <p className="text-xs text-red-500">{errors.cpf}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="mediaName">{t('socialMedia')}</Label>
            <div className="flex gap-2">
              <Input
                id="mediaName"
                name="mediaName"
                value={getMediaNameDisplayText()}
                readOnly
                className={`flex-1 bg-muted/30 ${errors.mediaName ? "border-red-500" : ""}`}
                disabled={isSaving || isCooldown}
              />
              <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon"
                    className="h-10 w-10"
                    disabled={isSaving || isCooldown}
                  >
                    <FiEdit className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-0">
                  <div className="flex flex-col">
                    <button
                      type="button"
                      className="flex items-center px-3 py-2 hover:bg-muted/80 transition-colors"
                      onClick={() => handleMediaChange("whatsapp")}
                    >
                      <FiCheck className={`mr-2 h-4 w-4 ${formData.mediaName === "whatsapp" ? "opacity-100" : "opacity-0"}`} />
                      WhatsApp
                    </button>
                    <button
                      type="button"
                      className="flex items-center px-3 py-2 hover:bg-muted/80 transition-colors"
                      onClick={() => handleMediaChange("telegram")}
                    >
                      <FiCheck className={`mr-2 h-4 w-4 ${formData.mediaName === "telegram" ? "opacity-100" : "opacity-0"}`} />
                      Telegram
                    </button>
                    <button
                      type="button"
                      className="flex items-center px-3 py-2 hover:bg-muted/80 transition-colors"
                      onClick={() => handleMediaChange("discord")}
                    >
                      <FiCheck className={`mr-2 h-4 w-4 ${formData.mediaName === "discord" ? "opacity-100" : "opacity-0"}`} />
                      Discord
                    </button>
                    <button
                      type="button"
                      className="flex items-center px-3 py-2 hover:bg-muted/80 transition-colors"
                      onClick={() => handleMediaChange("email")}
                    >
                      <FiCheck className={`mr-2 h-4 w-4 ${formData.mediaName === "email" ? "opacity-100" : "opacity-0"}`} />
                      E-mail
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            {errors.mediaName && (
              <p className="text-xs text-red-500">{errors.mediaName}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="mediaContact">{t('socialContact')}</Label>
            <Input
              id="mediaContact"
              name="mediaContact"
              value={formData.mediaContact}
              onChange={(e) => handleChange("mediaContact", e.target.value)}
              placeholder={
                formData.mediaName === "whatsapp" ? t('whatsappPlaceholder') :
                formData.mediaName === "telegram" ? t('telegramPlaceholder') :
                formData.mediaName === "discord" ? t('discordPlaceholder') :
                t('emailContactPlaceholder')
              }
              className={errors.mediaContact ? "border-red-500" : ""}
              disabled={isSaving || isCooldown}
            />
            {errors.mediaContact && (
              <p className="text-xs text-red-500">{errors.mediaContact}</p>
            )}
          </div>
          
          <div className="pt-2">
            <Button 
              type="submit" 
              className="w-full gap-1"
              disabled={isSaving || isCooldown}
            >
              {isSaving ? (
                <>
                  <FiLoader className="h-4 w-4 animate-spin" />
                  {t('saving')}
                </>
              ) : (
                <>
                  <FiSave className="w-4 h-4" />
                  {t('save')}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 
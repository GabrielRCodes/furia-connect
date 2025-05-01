"use server"

import { auth } from "@/libs/auth"
import { prisma } from "@/libs/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { CacheIDManager } from "@/utils/CacheIDManager"
import { z } from "zod"

// Schema para validação das informações de contato
const contactSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }).max(100, { message: "Nome deve ter no máximo 100 caracteres" }).trim(),
  email: z.string().email({ message: "Email inválido" }).trim(),
  cpf: z.string().regex(/^\d{11}$/, { message: "CPF deve ter 11 dígitos numéricos" }),
  mediaName: z.enum(["whatsapp", "telegram", "discord", "email"], {
    message: "Selecione uma rede social válida"
  }).optional(),
  mediaContact: z.string().min(3, { message: "Contato deve ter pelo menos 3 caracteres" })
    .max(100, { message: "Contato deve ter no máximo 100 caracteres" })
    .refine((val) => val !== undefined && val.length > 0, { message: "Contato não pode estar vazio" })
    .optional()
});

// Schemas de validação com Zod
const nameSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(50, "Nome deve ter no máximo 50 caracteres").trim()
})

const deleteAccountSchema = z.object({
  confirmation: z.literal("DELETE", { 
    errorMap: () => ({ message: 'Digite exatamente "DELETE" para confirmar' }) 
  })
})

// Função para obter os dados do usuário atual
export async function getUserData() {
  try {
    const session = await auth()
    
    if (!session || !session.user) {
      return null
    }
    
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id
      }
    })
    
    return user
  } catch (error) {
    console.error("Erro ao buscar dados do usuário:", error)
    return null
  }
}

// Obtém as informações de contato do usuário logado
export async function getContactData() {
  try {
    const session = await auth()
    
    if (!session || !session.user || !session.user.id) {
      return {
        status: 401,
        message: "Usuário não autenticado",
        exists: false,
        data: null
      }
    }

    // Verificar se existe registro para este usuário
    const contactInfo = await prisma.contactInfos.findUnique({
      where: {
        userId: session.user.id
      }
    })

    if (contactInfo) {
      return {
        status: 200,
        message: "Informações de contato encontradas",
        exists: true,
        data: contactInfo
      }
    } else {
      return {
        status: 200,
        message: "Informações de contato não encontradas",
        exists: false,
        data: null
      }
    }
  } catch (error) {
    console.error("Erro ao buscar informações de contato:", error)
    return {
      status: 500,
      message: "Erro ao buscar informações de contato",
      exists: false,
      data: null
    }
  }
}

// Função para atualizar o nome do usuário
export async function updateUserName(formData: FormData) {
  const session = await auth()
  
  if (!session?.user?.email) {
    return { success: false, message: "Usuário não autenticado" }
  }
  
  const newName = formData.get("name") as string
  
  // Validação com Zod
  const validationResult = nameSchema.safeParse({ name: newName })
  
  if (!validationResult.success) {
    const errorMessage = validationResult.error.errors[0]?.message || "Nome inválido"
    return { success: false, message: errorMessage }
  }

  const { name } = validationResult.data

  // Verificar se o usuário pode realizar esta ação (usando cacheIdManager)
  const cacheResult = await CacheIDManager({
    type: "update_user_name",
    waitTime: 600 // 600 segundos (10 minutos) de delay
  })

  if (cacheResult.status !== 200) {
    return { 
      success: false, 
      message: cacheResult.message,
      cooldown: true
    }
  }
  
  try {
    await prisma.user.update({
      where: {
        email: session.user.email
      },
      data: {
        name
      }
    })
    
    revalidatePath("/settings", "page")
    return { success: true, message: "Nome atualizado com sucesso" }
  } catch (error) {
    console.error("Erro ao atualizar nome:", error)
    return { success: false, message: "Erro ao atualizar nome" }
  }
}

// Função para deletar a conta do usuário
export async function deleteUserAccount(formData: FormData) {
  const session = await auth()
  
  if (!session?.user?.email) {
    return { success: false, message: "Usuário não autenticado" }
  }
  
  const confirmation = formData.get("confirmation") as string
  
  // Validação com Zod
  const validationResult = deleteAccountSchema.safeParse({ confirmation })
  
  if (!validationResult.success) {
    const errorMessage = validationResult.error.errors[0]?.message || "Confirmação inválida"
    return { success: false, message: errorMessage }
  }

  // Verificar se o usuário pode realizar esta ação (usando cacheIdManager)
  const cacheResult = await CacheIDManager({
    type: "delete_user_account",
    waitTime: 600 // 600 segundos (10 minutos) de delay
  })

  if (cacheResult.status !== 200) {
    return { 
      success: false, 
      message: cacheResult.message,
      cooldown: true
    }
  }
  
  try {
    await prisma.user.delete({
      where: {
        email: session.user.email
      }
    })
    
    redirect("/api/auth/signout")
  } catch (error) {
    console.error("Erro ao deletar conta:", error)
    return { success: false, message: "Erro ao deletar conta" }
  }
}

// Função para atualizar/criar informações de contato
export async function updateContactInfo(formData: FormData) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return { success: false, message: "Usuário não autenticado" };
  }
  
  // Extrair dados do formulário
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const cpf = formData.get("cpf") as string;
  const mediaName = formData.get("mediaName") as string;
  const mediaContact = formData.get("mediaContact") as string;
  
  // Validação com Zod
  const validationResult = contactSchema.safeParse({ 
    name, 
    email, 
    cpf, 
    mediaName, 
    mediaContact 
  });
  
  if (!validationResult.success) {
    // Retorna todos os erros de validação em um objeto
    const errorMessages = validationResult.error.errors.map(error => ({
      path: error.path.join('.'),
      message: error.message
    }));
    
    return { 
      success: false, 
      message: "Erro na validação dos dados", 
      errors: errorMessages 
    };
  }
  
  // Dados validados
  const validatedData = validationResult.data;
  
  // Verificar se o usuário pode realizar esta ação (usando CacheIDManager)
  const cacheResult = await CacheIDManager({
    type: "update_contact_info",
    waitTime: 86400 // 1 dia em segundos (24 * 60 * 60)
  });

  if (cacheResult.status !== 200) {
    return { 
      success: false, 
      message: cacheResult.message,
      cooldown: true
    };
  }
  
  try {
    // Verificar se já existe um registro para este usuário
    const existingContact = await prisma.contactInfos.findUnique({
      where: {
        userId: session.user.id
      }
    });
    
    if (existingContact) {
      // Atualizar registro existente
      await prisma.contactInfos.update({
        where: {
          userId: session.user.id
        },
        data: {
          name: validatedData.name,
          email: validatedData.email,
          cpf: validatedData.cpf,
          mediaName: validatedData.mediaName,
          mediaContact: validatedData.mediaContact
        }
      });
    } else {
      // Criar novo registro
      await prisma.contactInfos.create({
        data: {
          name: validatedData.name,
          email: validatedData.email,
          cpf: validatedData.cpf,
          mediaName: validatedData.mediaName,
          mediaContact: validatedData.mediaContact,
          userId: session.user.id
        }
      });
    }
    
    revalidatePath("/settings", "page");
    return { success: true, message: "Informações de contato atualizadas com sucesso" };
  } catch (error) {
    console.error("Erro ao atualizar informações de contato:", error);
    return { success: false, message: "Erro ao atualizar informações de contato" };
  }
} 
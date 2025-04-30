"use server"

import { auth } from "@/libs/auth"
import { prisma } from "@/libs/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { CacheIDManager } from "@/utils/CacheIDManager"
import { z } from "zod"

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
  const session = await auth()
  
  if (!session?.user?.email) {
    return null
  }
  
  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email
    }
  })
  
  return user
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
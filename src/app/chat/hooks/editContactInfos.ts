"use server"

import { auth } from '@/libs/auth'
import { prisma } from '@/libs/prisma'
import { z } from 'zod'
import { CacheIDManager } from '@/utils/CacheIDManager'

// Schema para validação dos dados de mídia
const mediaInfoSchema = z.object({
    mediaName: z.string().min(1, "Nome do canal é obrigatório"),
    mediaContact: z.string().min(1, "Contato é obrigatório")
})

export async function editContactInfos(mediaName: string, mediaContact: string) {
    try {
        // Validar os dados com Zod
        const validationResult = mediaInfoSchema.safeParse({ mediaName, mediaContact })
        
        if (!validationResult.success) {
            return {
                status: 400,
                message: "Dados inválidos",
                errors: validationResult.error.format(),
                cooldown: false
            }
        }
        
        const session = await auth()
        
        if (!session || !session.user || !session.user.id) {
            return {
                status: 401,
                message: "Usuário não autenticado",
                cooldown: false
            }
        }

        // Verificar o cooldown usando CacheIDManager
        const cacheResult = await CacheIDManager({
            type: "edit_contact_info",
            waitTime: 60 // 60 segundos de cooldown
        })

        if (cacheResult.status !== 200) {
            return {
                status: cacheResult.status,
                message: cacheResult.message,
                cooldown: true
            }
        }

        // Verificar se já existe registro para este usuário
        const existingContact = await prisma.contactInfos.findUnique({
            where: {
                userId: session.user.id
            }
        })

        if (existingContact) {
            // Atualizar o registro existente com as informações de mídia social
            await prisma.contactInfos.update({
                where: {
                    userId: session.user.id
                },
                data: {
                    mediaName,
                    mediaContact
                }
            })

            return {
                status: 200,
                message: "Informações de contato de mídia atualizadas com sucesso",
                cooldown: false
            }
        } else {
            // Se não existir um registro de contato, retornar erro
            return {
                status: 404,
                message: "Informações de contato não encontradas para este usuário",
                cooldown: false
            }
        }
    } catch (error) {
        console.error("Erro ao atualizar informações de contato:", error)
        return {
            status: 500,
            message: "Erro ao atualizar informações de contato",
            cooldown: false
        }
    }
} 
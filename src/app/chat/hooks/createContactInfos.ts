"use server"

import { auth } from '@/libs/auth'
import { prisma } from '@/libs/prisma'
import { z } from 'zod'
import { CacheIDManager } from '@/utils/CacheIDManager'

// Schema para validação dos dados
const contactInfoSchema = z.object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    email: z.string().email("E-mail inválido"),
    cpf: z.string()
})

export async function createContactInfos(name: string, email: string, cpf: string) {
    try {
        // Validar os dados com Zod
        const validationResult = contactInfoSchema.safeParse({ name, email, cpf })
        
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
            type: "create_contact_info",
            waitTime: 10 // 10 segundos de cooldown
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
            // Atualizar o registro existente
            await prisma.contactInfos.update({
                where: {
                    userId: session.user.id
                },
                data: {
                    name,
                    email,
                    cpf: cpf !== 'Não informado' ? cpf : ""
                }
            })
        } else {
            // Criar novo registro
            await prisma.contactInfos.create({
                data: {
                    userId: session.user.id,
                    name,
                    email,
                    cpf: cpf !== 'Não informado' ? cpf : ""
                }
            })
        }

        return {
            status: 200,
            message: "Informações de contato salvas com sucesso",
            cooldown: false
        }
    } catch (error) {
        console.error("Erro ao salvar informações de contato:", error)
        return {
            status: 500,
            message: "Erro ao criar informações de contato",
            cooldown: false
        }
    }
}
"use server"

import { auth } from '@/libs/auth'
import { prisma } from '@/libs/prisma'

export async function getContactInfos() {
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
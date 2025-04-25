"use server"


import { auth } from "@/libs/auth";
import { prisma } from "@/libs/prisma";
import { sub } from "date-fns";

interface CacheIDManagerProps {
  type: string,
  waitTime: number
}

export const CacheIDManager = async ({ type, waitTime }: CacheIDManagerProps) => {
  try {

    const now = new Date()

    const session = await auth()

    if ( !session ) {
      return { 
        status: 404, 
        message: "Acesso não autorizado." 
      }
    }

    const cache = await prisma.cacheIdManager.findUnique({
      where: {
        type_userId: {
          userId: String(session?.user?.id),
          type: String(type)
        }
      },
      select: {
        userId: true,
        counter: true,
        lastActivity: true,
        type: true
      }
    })

    if ( !cache ) {
      await prisma.cacheIdManager.create({
        data: {
          userId: String(session?.user?.id),
          type: String(type)
        }
      })

      return { 
        status: 200, 
        message: "Cache criado" 
      }
    }

    const diffS = cache?.lastActivity! >= sub(now, { seconds: waitTime })

    if ( diffS ) {
      return { status: 429, message: `Você precisa aguardar para fazer isso novamente.` }
    }

    await prisma?.cacheIdManager.update({
      where: {
        type_userId: {
          userId: String(session?.user?.id),
          type: String(type)
        }
      },
      data: {
        userId: String(session?.user?.id),
        lastActivity: now,
        counter: {
          increment: 1
        },
      }
    })

    return { 
      status: 200, 
      message: "Cache atualizado com sucesso!" 
    }

  } catch(error) {
    return { 
      status: 404, 
      message: "Ocorreu um erro ao gerenciar o cache!" 
    }
  }
}
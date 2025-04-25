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

    if ( !session || !session.user?.id ) {
      return { 
        status: 404, 
        message: "Acesso não autorizado." 
      }
    }

    const userId = String(session.user.id);

    const cache = await prisma.cacheIdManager.findUnique({
      where: {
        type_userId: {
          userId,
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
          userId,
          type: String(type)
        }
      })

      return { 
        status: 200, 
        message: "Cache criado" 
      }
    }

    const lastActivity = cache.lastActivity || new Date(0);
    const diffS = lastActivity >= sub(now, { seconds: waitTime });

    if ( diffS ) {
      return { status: 429, message: `Você precisa aguardar para fazer isso novamente.` }
    }

    await prisma.cacheIdManager.update({
      where: {
        type_userId: {
          userId,
          type: String(type)
        }
      },
      data: {
        userId,
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

  } catch {
    return { 
      status: 404, 
      message: "Ocorreu um erro ao gerenciar o cache!" 
    }
  }
}
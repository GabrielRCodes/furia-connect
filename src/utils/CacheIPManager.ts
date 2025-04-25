"use server"

import { prisma } from "@/libs/prisma";
import { sub } from "date-fns";

/**
 * Gerencia o cache de IP para controle de taxa de requisições
 * Esta função é usada pela Server Action em /app/actions.ts para limitar a frequência
 * de tentativas de login e outras ações sensíveis baseadas no IP do cliente.
 * 
 * @param ip - Endereço IP do cliente (obtido via headers na Server Action)
 * @param type - Tipo de ação sendo monitorada (ex: 'email_login', 'google_login')
 * @param waitTime - Tempo de espera em segundos entre requisições permitidas
 * @returns Objeto contendo status e mensagem
 */
interface CacheIPManagerProps {
  ip: string,
  type: string,
  waitTime: number
}

export const CacheIPManager = async ({ ip, type, waitTime }: CacheIPManagerProps) => {
  try {

    const now = new Date()

    const cache = await prisma.cacheIPManager.findUnique({
      where: {
        type_userIP: {
          userIP: String(ip),
          type: String(type)
        }
      },
      select: {
        userIP: true,
        counter: true,
        lastActivity: true,
        type: true
      }
    })

    if ( !cache ) {
      await prisma.cacheIPManager.create({
        data: {
          userIP: String(ip),
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

    await prisma.cacheIPManager.update({
      where: {
        type_userIP: {
          userIP: String(ip),
          type: String(type)
        }
      },
      data: {
        userIP: String(ip),
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
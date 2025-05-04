"use server"

import { auth } from "@/libs/auth";
import { prisma } from "@/libs/prisma";
import { CacheIDManager } from "@/utils/CacheIDManager";

interface CreateClipResult {
  success: boolean;
  message: string;
  cooldown?: boolean;
}

export const createClip = async (clipUrl: string): Promise<CreateClipResult> => {
  try {
    const session = await auth();

    if (!session || !session.user?.id) {
      return {
        success: false,
        message: "Usuário não autenticado"
      };
    }

    const userId = String(session.user.id);

    // Verificar cooldown - esperar 10 minutos (600 segundos) entre envios
    const cacheResult = await CacheIDManager({
      type: "clip_submission",
      waitTime: 600 // 10 minutos
    });

    if (cacheResult.status === 429) {
      return {
        success: false,
        message: "Você precisa aguardar 10 minutos entre cada envio de clipe",
        cooldown: true
      };
    }

    // Criar o clipe no banco de dados
    await prisma.clip.create({
      data: {
        userId,
        clipUrl
      }
    });

    return {
      success: true,
      message: "Clipe registrado com sucesso!"
    };
  } catch (error) {
    console.error("Erro ao criar clipe:", error);
    return {
      success: false,
      message: "Ocorreu um erro ao registrar seu clipe. Tente novamente mais tarde."
    };
  }
}; 
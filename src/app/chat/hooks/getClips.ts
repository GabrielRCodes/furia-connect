"use server"

import { auth } from "@/libs/auth";
import { prisma } from "@/libs/prisma";

interface Clip {
  id: string;
  clipUrl: string;
  createdAt: Date;
}

interface GetClipsResult {
  success: boolean;
  message: string;
  clips?: Clip[];
  empty?: boolean;
}

export const getClips = async (): Promise<GetClipsResult> => {
  try {
    const session = await auth();

    if (!session || !session.user?.id) {
      return {
        success: false,
        message: "Usuário não autenticado"
      };
    }

    const userId = String(session.user.id);

    // Buscar os clipes do usuário
    const userClips = await prisma.clip.findMany({
      where: {
        userId
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        clipUrl: true,
        createdAt: true
      }
    });

    if (userClips.length === 0) {
      return {
        success: true,
        message: "Nenhum clipe encontrado",
        clips: [],
        empty: true
      };
    }

    return {
      success: true,
      message: `${userClips.length} clipes encontrados`,
      clips: userClips
    };
  } catch (error) {
    console.error("Erro ao buscar clipes:", error);
    return {
      success: false,
      message: "Ocorreu um erro ao buscar seus clipes. Tente novamente mais tarde."
    };
  }
}; 
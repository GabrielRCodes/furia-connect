"use server"

import { CacheIPManager } from "@/utils/CacheIPManager";
import { headers } from "next/headers";

// Função para obter o IP do cliente a partir dos headers da requisição
export const getClientIP = async (): Promise<string> => {
  const headersList = await headers();
  
  // Verificar diferentes headers que podem conter o IP
  const ip = 
    headersList.get('x-real-ip') || 
    headersList.get('x-forwarded-for')?.split(',')[0] || 
    headersList.get('cf-connecting-ip') || 
    '127.0.0.1';
  
  return ip;
};

// Verificar se o usuário pode fazer login
export const checkLoginRate = async (type: string = 'login', waitTime: number = 60) => {
  try {
    const ip = await getClientIP();
    
    // Utilizar o CacheIPManager para verificar se o IP pode fazer login
    const result = await CacheIPManager({
      ip,
      type,
      waitTime
    });
    
    return result;
  } catch (error) {
    console.error('Erro ao verificar taxa de login:', error);
    return { 
      status: 500, 
      message: "Erro interno ao verificar a taxa de login" 
    };
  }
}; 
import { Resend } from "resend";
import { cookies } from "next/headers";

export interface ResendEmailConfig {
  /**
   * Resend API key.
   */
  apiKey: string;
  /**
   * Email address the email is sent from.
   */
  from: string;
  /**
   * URL to the site used for formatting links in the email.
   * By default it uses the NEXTAUTH_URL environment variable.
   */
  server?: string;
}

export default function ResendProvider(options: ResendEmailConfig) {
  return {
    id: "resend",
    type: "email" as const,
    name: "Resend",
    sendVerificationRequest,
    options,
  };
}

export async function sendVerificationRequest(params: {
  identifier: string;
  url: string;
  provider: {
    apiKey: string;
    from: string;
  };
  token?: string;
}) {
  const { identifier, url, provider } = params;
  const { apiKey, from } = provider;

  if (!apiKey) {
    console.error("[ResendProvider] API key não definida");
    throw new Error("No API key provided for Resend provider");
  }
  
  if (!from) {
    console.error("[ResendProvider] Email remetente não definido");
    throw new Error("No from email address provided for Resend provider");
  }

  // Verificar o idioma do usuário
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get('NEXT_LOCALE');
  const userLocale = localeCookie?.value || 'pt-BR';
  const isEnglish = userLocale !== 'pt-BR';

  // Estilos compartilhados para melhor centralização
  const sharedStyles = {
    container: 'max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; text-align: center;',
    header: 'margin-bottom: 30px;',
    logo: 'color: #333; font-size: 28px; margin: 0;',
    card: 'background-color: #f9f9f9; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);',
    title: 'color: #333; margin-bottom: 20px; font-size: 22px;',
    text: 'margin-bottom: 25px; font-size: 16px; line-height: 1.5; color: #555;',
    buttonContainer: 'margin: 30px 0;',
    button: 'background-color: #000; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;',
    footer: 'margin-top: 30px; font-size: 14px; color: #777;',
    smallText: 'font-size: 14px; color: #777; margin-top: 20px;'
  };

  // Template de email em português (padrão)
  let emailSubject = 'FURIA Connect - Verificação de e-mail';
  let emailHtml = `
    <div style="${sharedStyles.container}">
      <div style="${sharedStyles.header}">
        <h1 style="${sharedStyles.logo}">FURIA Connect</h1>
      </div>
      <div style="${sharedStyles.card}">
        <h2 style="${sharedStyles.title}">Verificação de e-mail</h2>
        <p style="${sharedStyles.text}">
          Clique no botão abaixo para verificar seu e-mail e acessar sua conta:
        </p>
        <div style="${sharedStyles.buttonContainer}">
          <a href="${url}" style="${sharedStyles.button}">
            Verificar meu e-mail
          </a>
        </div>
        <p style="${sharedStyles.smallText}">
          Se você não solicitou esta verificação, ignore este e-mail.
        </p>
        <p style="${sharedStyles.smallText}">
          Este link de verificação expirará em 1 hora.
        </p>
      </div>
      <div style="${sharedStyles.footer}">
        <p>FURIA Connect - Conectando a comunidade FURIA</p>
      </div>
    </div>
  `;

  // Template de email em inglês
  if (isEnglish) {
    emailSubject = 'FURIA Connect - Email Verification';
    emailHtml = `
      <div style="${sharedStyles.container}">
        <div style="${sharedStyles.header}">
          <h1 style="${sharedStyles.logo}">FURIA Connect</h1>
        </div>
        <div style="${sharedStyles.card}">
          <h2 style="${sharedStyles.title}">Email Verification</h2>
          <p style="${sharedStyles.text}">
            Click the button below to verify your email and access your account:
          </p>
          <div style="${sharedStyles.buttonContainer}">
            <a href="${url}" style="${sharedStyles.button}">
              Verify my email
            </a>
          </div>
          <p style="${sharedStyles.smallText}">
            If you didn't request this verification, please ignore this email.
          </p>
          <p style="${sharedStyles.smallText}">
            This verification link will expire in 1 hour.
          </p>
        </div>
        <div style="${sharedStyles.footer}">
          <p>FURIA Connect - Connecting the FURIA community</p>
        </div>
      </div>
    `;
  }

  const resend = new Resend(apiKey);

  try {
    // Enviar o email com o template adequado ao idioma
    const { data, error } = await resend.emails.send({
      from: from,
      to: identifier,
      subject: emailSubject,
      html: emailHtml,
    });

    if (error) {
      console.error("[ResendProvider] Erro ao enviar e-mail com Resend:", error);
      throw new Error(`Erro ao enviar e-mail: ${error.message}`);
    }

    // Adicionar cookie com o email (válido por 10 minutos)
    try {
      const cookieStore = await cookies();
      cookieStore.set('verification_email', identifier, {
        httpOnly: false, // Permitir acesso via JavaScript
        secure: process.env.NODE_ENV === 'production',
        maxAge: 10 * 60, // 10 minutos em segundos
        path: '/',
        sameSite: 'lax',
      });
    } catch (cookieError) {
      console.error("[ResendProvider] Erro ao definir cookie:", cookieError);
      // Não interrompe o fluxo se houver erro ao definir o cookie
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error("[ResendProvider] Erro ao enviar e-mail com Resend:", error);
    throw new Error(`Erro ao enviar e-mail: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
} 
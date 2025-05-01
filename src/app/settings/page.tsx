"use server"

import { NameForm } from "./components/NameForm";
import { EmailForm } from "./components/EmailForm";
import { ContactForm } from "./components/ContactForm";
import { DeleteAccountForm } from "./components/DeleteAccountForm";
import { UserPreview } from "./components/UserPreview";
import { getUserData, getContactData } from "./actions";
import { getTranslations } from "next-intl/server";

export default async function SettingsPage() {
  // Obter dados do usuário logado
  const userData = await getUserData();
  // Obter traduções
  const t = await getTranslations('Settings');
  // Obter informações de contato
  const contactData = await getContactData();

  // Determina se o componente ContactForm deve ser exibido
  // Ele será exibido somente se já existirem informações de contato para o usuário
  const showContactForm = contactData.exists;

  return (
    <div className="w-full max-w-7xl mx-auto py-6 px-4 xl:px-0">
      <div className="mb-8">
        <h1 className="text-2xl font-medium tracking-tight mb-2">{t('title')}</h1>
        <p className="text-muted-foreground">
          {t('description')}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Lado esquerdo - Cards de configurações */}
        <div className="md:col-span-2 space-y-8">
          {/* Card de Nome */}
          <NameForm user={userData} />
          
          {/* Card de Email */}
          <EmailForm user={userData} />
          
          {/* Card de Contato - mostrado apenas se existirem informações de contato */}
          {showContactForm && (
            <ContactForm 
              user={userData} 
              contactInfo={contactData.data}
              exists={showContactForm}
            />
          )}
          
          {/* Card de Deletar Conta */}
          <DeleteAccountForm />
        </div>
        
        {/* Lado direito - Preview */}
        <div className="md:col-span-1">
          <UserPreview user={userData} />
        </div>
      </div>
    </div>
  );
}

# FURIA CONNECT

Um protótipo de plataforma de assistência virtual desenvolvido como parte de um desafio técnico para a equipe FURIA.

## 🚀 Deploy

Acesse a versão em produção: [https://furia-connect.0r1.org](https://furia-connect.0r1.org)

## 📋 Sobre

FURIA CONNECT é uma plataforma que permite aos usuários tirar dúvidas através de um assistente virtual inteligente. Desenvolvido com tecnologias modernas como Next.js, React e Tailwind CSS.

### ✨ Funcionalidades principais

- Assistente virtual para responder dúvidas
- Autenticação social com Google
- Autenticação por email com link mágico (Resend)
- Sistema de cooldown para limitar requisições
- Suporte a múltiplos idiomas (Português e Inglês)
- Tema claro/escuro
- Interface moderna e responsiva com design mobile-first
- SEO otimizado para mecanismos de busca

## 🛠️ Tecnologias

- **[Next.js](https://nextjs.org/)** - Framework React com App Router para roteamento eficiente e renderização híbrida
- **[React](https://reactjs.org/)** - Biblioteca JavaScript para construção de interfaces
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utilitário para estilização rápida e consistente
- **[shadcn/ui](https://ui.shadcn.com/)** - Componentes de UI acessíveis e reutilizáveis
- **[next-intl](https://next-intl-docs.vercel.app/)** - Solução de internacionalização robusta com suporte a rotas
- **[next-themes](https://github.com/pacocoursey/next-themes)** - Gerenciamento de temas adaptativo (claro/escuro)
- **[Sonner](https://sonner.emilkowal.ski/)** - Sistema de toasts para notificações não-intrusivas
- **[Prisma](https://www.prisma.io/)** - ORM para acesso ao banco de dados com tipagem segura
- **[NextAuth.js](https://next-auth.js.org/)** - Sistema de autenticação flexível e seguro
- **[Zod](https://zod.dev/)** - Validação de esquemas com TypeScript para garantir integridade de dados
- **[React Email](https://react.email/)** - Criação de emails responsivos em React
- **[Resend](https://resend.com/)** - API para envio de emails transacionais

## 🔒 Sistema de Cooldown

Um aspecto importante da segurança da aplicação é o sistema de cooldown implementado para prevenir abusos. Este sistema funciona através de:

**Cache de IPs e IDs**:
   - Para cada requisição, o sistema armazena temporariamente o IP do solicitante e o ID do usuário (caso esteja autenticado)
   - Utilizamos uma combinação de Redis para ambientes de produção e cache em memória para desenvolvimento

**Lógica de Cooldown**:
   - Usuários não autenticados têm um cooldown maior (limitando requisições por IP)
   - Usuários autenticados têm limites mais generosos (baseados no ID)
   - A verificação ocorre em middleware para interromper requisições antes mesmo de chegarem ao handler

## 🚀 Instalação

### Pré-requisitos

- Node.js 18.x ou superior
- npm ou yarn
- MySQL (local ou remoto via Railway)

### Passos para instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/furia-connect.git
cd furia-connect
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
```

4. Configure e inicialize o Prisma:
```bash
# Gerar os clientes do Prisma baseado no schema
npx prisma generate

# Enviar o schema para o banco de dados (criar/atualizar tabelas)
npx prisma db push
```

## 💻 Executando o projeto

### Ambiente de desenvolvimento

```bash
npm run dev
# ou
yarn dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador para ver a aplicação.

### Build para produção

```bash
npm run build
npm start
# ou
yarn build
yarn start
```

## 🔐 Variáveis de Ambiente

Para executar este projeto, você precisará adicionar as seguintes variáveis de ambiente ao seu arquivo `.env.local`:

```
# Database
DATABASE_URL="mysql://user:password@localhost:3306/furia_connect"

# Next-Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="sua-chave-secreta"

# Google Provider
GOOGLE_CLIENT_ID="seu-client-id-do-google"
GOOGLE_CLIENT_SECRET="seu-client-secret-do-google"

# Resend API
RESEND_API_KEY="re_123456789" # Sua chave API do Resend
EMAIL_FROM="noreply@seudominio.com" # Domínio verificado no Resend
```

### Como obter as credenciais necessárias:

1. **Google OAuth (GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET)**:
   - Acesse o [Google Cloud Console](https://console.cloud.google.com/)
   - Crie um novo projeto ou selecione um existente
   - Vá para "APIs e Serviços" > "Credenciais"
   - Clique em "Criar Credenciais" > "ID do Cliente OAuth"
   - Configure o tipo de aplicativo como "Aplicativo da Web"
   - Adicione URLs de redirecionamento autorizados: `http://localhost:3000/api/auth/callback/google` (para desenvolvimento) e a URL do seu site em produção com o mesmo caminho
   - Após criar, você receberá o Client ID e Client Secret

2. **NEXTAUTH_SECRET**:
   - Gere uma string aleatória segura para uso como chave secreta
   - No terminal, você pode executar: `openssl rand -base64 32` ou usar um gerador de senha segura online

3. **DATABASE_URL (usando Railway)**:
   - Crie uma conta no [Railway](https://railway.app/)
   - Inicie um novo projeto com um banco de dados MySQL
   - Após a criação, vá para a seção de variáveis de ambiente do projeto
   - Copie a URL de conexão completa (formato: `mysql://user:password@host:port/database`)

4. **RESEND_API_KEY**:
   - Crie uma conta em [Resend](https://resend.com)
   - Navegue até a seção de API Keys no painel
   - Crie uma nova API Key e copie o valor (formato: `re_123456789...`)
   - Configure também um domínio verificado para EMAIL_FROM ou use um domínio temporário fornecido pelo Resend

## 🔐 Autenticação

### Provedores suportados

- **Google**: Login social com contas Google
- **Email (Resend)**: Login via link mágico enviado por email

O sistema de autenticação foi implementado com NextAuth.js, proporcionando alta segurança e flexibilidade. A implementação inclui:

- Sessões protegidas com JWT
- Páginas de autenticação personalizadas
- Template de email responsivo para links mágicos traduzidos

## 🌐 Internacionalização

O projeto suporta múltiplos idiomas utilizando next-intl:

- As traduções são carregadas dinamicamente com base na seleção do usuário
- A preferência de idioma é armazenada em um cookie persistente
- Mensagens de tradução são organizadas por namespaces para melhor manutenção

Os arquivos de tradução estão localizados em:

```
src/i18n/messages/
```

## 🎨 Temas

O sistema de temas utiliza next-themes para:

- Detectar automaticamente a preferência do sistema
- Permitir alternância manual entre temas claro e escuro
- Persistir a preferência do usuário entre sessões
- Evitar flash de tema incorreto durante o carregamento

## 🔍 SEO

O projeto implementa práticas avançadas de SEO:

- Open Graph e tags Twitter Card para compartilhamento em redes sociais
- Sitemap XML gerado automaticamente
- Estrutura de dados semântica
- Cabeçalhos HTTP adequados para indexação
- Rotas amigáveis para mecanismos de busca

## 🚧 Futuras Atualizações

### Funcionalidades planejadas

- **Implementação de sistema de disparos de anúncios usando contatos no banco de dados**
  
  Este módulo não foi completamente finalizado pois exigiria integração e verificação com diversas plataformas de redes sociais, o que demandaria um tempo considerável para pesquisa, implementação e testes. A estrutura base foi preparada no banco de dados para futura implementação.

- **Expansão do assistente virtual**
  
  Adicionar mais capacidades de resposta ao assistente e integração com uma base de conhecimento mais ampla.

- **Análise de métricas de atendimento**
  
  Implementação de dashboard para visualização de métricas de utilização e eficácia do assistente.

- **Criptografia de dados sensíveis**
  
  Implementar sistema de criptografia para armazenamento seguro de dados pessoais sensíveis como CPF, e-mail e números de telefone. Os dados seriam armazenados de forma criptografada no banco de dados e descriptografados apenas no momento do envio de notificações ou quando necessário, garantindo maior segurança e conformidade com regulamentações de proteção de dados.

**Observação importante:** Todas estas funcionalidades planejadas, incluindo a criptografia de dados sensíveis, seriam implementadas caso o projeto avançasse para uma fase de produção completa. Como este é um protótipo desenvolvido para demonstração de conceito, estas características não foram implementadas, priorizando-se a entrega rápida das funcionalidades principais para avaliação. Em um ambiente de produção real, a implementação dessas medidas de segurança e expansões seria considerada essencial e prioritária.

## 📝 Licença

Este projeto está sob a licença [MIT](LICENSE).

---

Desenvolvido com ❤️ para a comunidade FURIA.


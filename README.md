# FURIA CONNECT

Uma aplicação web moderna de chat em tempo real desenvolvida para a comunidade FURIA.

## 📋 Sobre

FURIA CONNECT é uma plataforma que permite comunicação em tempo real entre usuários, criada utilizando tecnologias modernas como Next.js, React e Tailwind CSS, integrada com os componentes shadcn/ui para uma interface elegante e responsiva.

### ✨ Funcionalidades principais

- Chat em tempo real
- Autenticação social com Google
- Suporte a múltiplos idiomas (Português e Inglês)
- Tema claro/escuro
- Interface moderna e responsiva
- Sistema de notificações via toasts

## 🛠️ Tecnologias

- [Next.js](https://nextjs.org/) - Framework React com renderização híbrida
- [React](https://reactjs.org/) - Biblioteca JavaScript para construção de interfaces
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS utilitário
- [shadcn/ui](https://ui.shadcn.com/) - Componentes de UI reutilizáveis
- [next-intl](https://next-intl-docs.vercel.app/) - Internacionalização
- [next-themes](https://github.com/pacocoursey/next-themes) - Suporte a temas
- [Sonner](https://sonner.emilkowal.ski/) - Sistema de toasts
- [Prisma](https://www.prisma.io/) - ORM para acesso ao banco de dados
- [NextAuth.js](https://next-auth.js.org/) - Sistema de autenticação

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
   - A Railway fornece automaticamente todas as informações necessárias para a conexão, incluindo usuário, senha, host e porta na variável `DATABASE_URL`

## 🌐 Internacionalização

O projeto suporta múltiplos idiomas. Os arquivos de tradução estão localizados em:

```
src/i18n/messages/
```

## 📝 Licença

Este projeto está sob a licença [MIT](LICENSE).

---

Desenvolvido com ❤️ para a comunidade FURIA.

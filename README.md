# Vencedores da Ponte Metálica — Plataforma Web

Site e sistema de gestão do **Vencedores da Ponte Metálica**, projeto social de bodyboard na Praia de Iracema, Fortaleza/CE.

- Site público: https://vencedores-ponte-metalica.vercel.app
- Instagram: [@vencedorespontemetalica](https://www.instagram.com/vencedorespontemetalica/)

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Supabase: Postgres, Auth e Storage
- React Hook Form + Zod
- IMask, ViaCEP
- TanStack Table
- Fontes Anton + Inter
- Vercel para os dois deployments

## Dois sistemas, um banco

O projeto usa dois deployments do mesmo repositório, separados por `NEXT_PUBLIC_APP_MODE`:

| Sistema | Modo | Escopo |
|---|---|---|
| Site + portal do atleta | `site` | Landing, notícias, cadastro, login e painel do atleta, doações |
| Painel administrativo | `admin` | Login da coordenação, atletas, notícias, agenda e chamada |

Os dois compartilham o mesmo projeto Supabase. O `middleware.ts` impede que o admin seja acessado pelo domínio público e impede que o site seja acessado pelo domínio administrativo.

### Rotas do site

- `/` — landing page
- `/noticias` — mural público de notícias
- `/cadastro` — inscrição de atleta
- `/atletas` — login do atleta
- `/atletas/painel` — painel do atleta
- `/doacoes` — doações de materiais e Pix
- `/creditos` — créditos das imagens

### Rotas do admin

- `/admin/login` — login da coordenação
- `/admin` — visão geral
- `/admin/atletas` — gestão de atletas
- `/admin/noticias` — gestão de notícias
- `/admin/agenda` — eventos, chamada e presenças

## Acesso administrativo

O painel administrativo é restrito à coordenação do projeto. Atletas criam a própria conta pela página de cadastro. Nenhuma senha é divulgada na interface.

## Como rodar

```bash
npm install
cp .env.example .env.local
# preencha as credenciais do Supabase em .env.local
npm run dev
```

O site fica em `http://localhost:3000`. Se a porta estiver ocupada:

```bash
npm run dev -- -p 3100
```

Para simular o admin localmente:

```bash
NEXT_PUBLIC_APP_MODE=admin NEXT_PUBLIC_SITE_URL=http://localhost:3100 NEXT_PUBLIC_ADMIN_URL=http://localhost:3200 npm run dev -- -p 3200
```

## Arquitetura

```
app/
  (site público, portal do atleta, doações e admin)
  api/
    cadastro/route.ts
    admin/atletas/route.ts
components/
  site/           Header, Footer
  landing/        Seções da landing
  atletas/        Login, painel e perfil
  admin/          Painel administrativo
  noticias/       Listagem pública
  doacoes/        Cópia da chave Pix
  ui/             Componentes compartilhados
lib/
  supabase/       Clients browser/server, mappers
  auth.tsx        Supabase Auth + perfil
  store.tsx       Fachada de dados para os componentes
  categorias.ts   14 categorias de atleta
  app-urls.ts     Modos e URLs dos dois deployments
  types.ts        Tipos do domínio
supabase/
  schema.sql      Tabelas, RLS, funções, triggers e bucket
scripts/
  migrate.mjs     Aplica o schema no Postgres
  seed.ts         Cria usuários e dados iniciais
middleware.ts     Separação site/admin por host
```

## Banco e autenticação

### Supabase

O banco é Postgres gerenciado no Supabase, com:

- `profiles` — papel (`admin` ou `atleta`) vinculado a `auth.users`
- `atletas` — ficha do atleta e vínculo com o usuário Auth
- `noticias` — notícias publicadas e rascunhos
- `eventos` — agenda e categorias elegíveis
- `presencas` — chamada por evento
- bucket `atletas` — fotos de perfil

O schema aplica RLS: o atleta vê apenas o próprio cadastro/presenças; o admin gerencia tudo; notícias publicadas são públicas; eventos ativos são filtrados pela categoria do atleta.

### Migração e seed

```bash
node scripts/migrate.mjs
npx tsx scripts/seed.ts
```

O `migrate.mjs` aplica `supabase/schema.sql` usando `SUPABASE_DB_URL` via pooler. O `seed.ts` cria os usuários Auth, perfis, atletas, notícias e eventos de demonstração via service role.

O seed atual contém 12 atletas, 6 notícias e 4 eventos. O banco não é mais localStorage: os dados são compartilhados entre navegadores e entre os dois sistemas.

### Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` — somente server-side, nunca no cliente
- `SUPABASE_DB_URL` — usada apenas pelos scripts de migração
- `NEXT_PUBLIC_APP_MODE` — `site` ou `admin`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_ADMIN_URL`

O `.env.local` está no `.gitignore` e nunca deve ser commitado.

## Categorias e eventos

São 14 categorias: Profissional, Sub14, Sub16, Sub18, Open, 40+ e Sub12, cada uma nas versões masculino e feminino.

Ao criar um evento, o admin pode marcar **Todas as categorias** ou escolher categorias específicas. O evento só aparece no painel do atleta se a categoria dele estiver incluída. A chamada também lista apenas atletas elegíveis para aquele evento.

## Doações

A página `/doacoes` aceita:

- **Materiais:** pranchas, coletes, lycras e equipamentos, com contato por WhatsApp.
- **Dinheiro:** chave Pix e QR Code.

Os dados atuais são **fictícios de demonstração**:

- WhatsApp: `(85) 99999-0000`
- Pix: `doacoes@exemplo.com`

Substitua número, mensagem, chave e QR pelos dados oficiais antes de divulgar. O QR fica em `public/img/pix-qr.png` e pode ser gerado com:

```bash
npx --yes qrcode "SUA_CHAVE_PIX" -o public/img/pix-qr.png -w 512
```

## Segurança e LGPD

- Senhas ficam no Supabase Auth, não no banco público.
- `service_role` só é usada em route handlers/server, nunca no bundle do cliente.
- RLS ativa em todas as tabelas; o atleta só lê/escreve o que é seu.
- Papéis de admin ficam em `profiles.role`.
- O middleware separa fisicamente os dois domínios.
- Fotos de perfil são comprimidas no cliente e armazenadas em `foto_url`.
- Menores exigem dados e CPF dos responsáveis no cadastro.
- Recuperação de senha, verificação de e-mail e política de privacidade definitiva ainda devem ser configuradas para produção.

## Qualidade

- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`
- Lighthouse/axe nas telas públicas e administrativas
- Testes manuais de login, cadastro, CRUD, chamada, eventos por categoria, doações e responsividade mobile

A última verificação local passou com 19 páginas estáticas, API routes dinâmicas, modos `site` e `admin` validados e login real do admin no Supabase.

## Imagens

As fotos de pódios, treinos, celebrações e comunidade vêm do acervo do projeto e de publicações de atletas/parceiros no Instagram. A foto de bodyboard na onda tem crédito de **Thelipe Lima / Paulo Sucesso**. As fotos da Ponte dos Ingleses usam Wikimedia Commons (Claudney Neves e Governo Federal Brasileiro).

Os arquivos ficam em `public/img/`. Para trocar por fotos oficiais em alta resolução, mantenha os mesmos nomes ou atualize os caminhos nos componentes.

## Deploy na Vercel

### Projeto do site

- Root directory: raiz do repositório
- Variáveis: Supabase + `NEXT_PUBLIC_APP_MODE=site`
- `NEXT_PUBLIC_SITE_URL=https://vencedores-ponte-metalica.vercel.app`
- `NEXT_PUBLIC_ADMIN_URL=https://vencedores-ponte-metalica-admin.vercel.app`

### Projeto do admin

- Criar um segundo projeto Vercel a partir do mesmo repositório
- Variáveis: Supabase + `NEXT_PUBLIC_APP_MODE=admin`
- `NEXT_PUBLIC_SITE_URL` e `NEXT_PUBLIC_ADMIN_URL` iguais aos do site

Depois do deploy, valide:

1. `/admin` no domínio público redireciona para o admin.
2. `/` no domínio do admin redireciona para `/admin`.
3. Login de coordenação e atleta funcionam.
4. Atletas veem apenas eventos da própria categoria.
5. Doações e QR Code carregam no celular.

## Próximos passos

- Configurar domínio próprio (por exemplo, `www` e `admin`).
- Ativar recuperação de senha e verificação de e-mail no Supabase Auth.
- Mover o upload de fotos para o bucket `atletas` do Storage.
- Criar página individual de notícia por slug.
- Adicionar notificações de novos treinos e notícias.
- Substituir os dados fictícios de doação pelos oficiais.

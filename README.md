# Vencedores da Ponte Metálica — Plataforma Web

Site e painel do projeto social de bodyboard da **Praia de Iracema,
Fortaleza (CE)**. Identidade visual inspirada no perfil
[@vencedorespontemetalica](https://www.instagram.com/vencedorespontemetalica/)
e no selo oficial do projeto: preto profundo, laranja pôr do sol e fotografia
documental.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** com design system próprio (`ink`, `sun`, `cream`)
- **React Hook Form + Zod** na inscrição
- **React IMask** para CPF, CEP e telefone
- **ViaCEP** para autopreenchimento de endereço
- **TanStack Table** (disponível para evoluções do painel)
- Tipografia: **Anton** (display) + **Inter** (texto)

## Rotas

| Rota | Descrição |
| --- | --- |
| `/` | Landing page: hero, quem somos, pilares, treinos, conquistas, galeria, notícias, idealizador e CTA |
| `/noticias` | Mural público de notícias com busca, filtros por categoria e leitura em modal |
| `/cadastro` | Inscrição completa do atleta, com responsáveis para menores de 18 e consentimento LGPD |
| `/atletas` | Login do portal do atleta |
| `/atletas/painel` | Painel do atleta: status, agenda completa, notícias e perfil editável com foto e história |
| `/admin/login` | Login da coordenação |
| `/admin` | Visão geral: KPIs, inscrições por mês, distribuição por categoria e últimos cadastros |
| `/admin/atletas` | CRUD de atletas, aprovação rápida, busca, filtro por categoria e exportação CSV |
| `/admin/noticias` | CRUD de notícias, rascunhos, destaque e publicação |
| `/admin/agenda` | CRUD da agenda, chamada de presença e atalho de treino de sábado |
| `/doacoes` | Doação de materiais via WhatsApp e doação em dinheiro via Pix de exemplo |
| `/creditos` | Créditos e licenças das imagens |

## Acessos de demonstração

- **Atleta:** `atleta@demo.com` / `123456`
- **Administrador:** `admin@vencedorespontemetalica.com` / `admin123`

As credenciais de admin estão fixas em `lib/auth.tsx` apenas para demonstração.
Não use esse modelo em produção.

## Como rodar

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`.

Build de produção:

```bash
npm run build
npm start
```

## Arquitetura

```
app/                    rotas (App Router)
components/
  site/                 header e footer institucionais
  landing/              seções da landing page
  cadastro/             formulário completo de inscrição
  atletas/              login e painel do atleta
  admin/                shell, CRUDs e modais do dashboard
  doacoes/              copiar chave Pix
  noticias/             mural público
  ui/                   ícones, logo, modal e animação de entrada
lib/
  types.ts              modelos de Atleta, Notícia e Evento
  seed.ts               dados iniciais de demonstração
  store.tsx             "banco" local com Context API + localStorage
  auth.tsx              sessão de atleta/admin
  schemas/atleta.ts     validação Zod (condicional para menores)
  categorias.ts         14 categorias de atleta, rótulos e agrupamentos
  migracao.ts           migração do banco local v2 para v3
  format.ts             datas, status, categorias e iniciais
```

### Persistência atual

Os dados são persistidos em **localStorage** (`vpm:db:v3`), com migração
automática do banco anterior (`vpm:db:v2`). Isso permite demonstrar o fluxo
completo — o admin publica uma notícia ou registra uma chamada e o atleta vê a
atualização — sem backend. Para produção, basta substituir as funções de
`lib/store.tsx` por chamadas a uma API.

Sugestões de backend, em ordem de esforço:

1. **Supabase/Firebase** — Auth + banco + storage de fotos com pouco código.
2. **API Routes + Prisma/Postgres** — mantém tudo no ecossistema Next.js.
3. **Backend Laravel existente** — expor endpoints REST e trocar o store.

## Categorias e chamada

O cadastro usa 14 categorias: Profissional, Sub12, Sub14, Sub16, Sub18, Open e
40+, nas versões masculino e feminino. O admin pode filtrar atletas por
categoria e registrar a chamada de cada evento; o atalho **Treino de sábado**
cria o próximo encontro já com a data preenchida. A chamada fica salva no
evento e é reaberta com as presenças anteriores.

Ao criar ou editar um evento, a coordenação escolhe **todas as categorias** ou
uma combinação delas. O evento só aparece na agenda dos atletas daquelas
categorias, e a chamada também lista apenas os atletas elegíveis. Eventos antigos
sem categorias continuam visíveis para todos.

## Doações

A página `/doacoes` tem dois caminhos: doação de materiais com link para
WhatsApp e doação em dinheiro com chave Pix e QR Code. Os dados atuais são
fictícios (`(85) 99999-0000` e `doacoes@exemplo.com`) e estão sinalizados na
própria página. Antes de publicar, substitua o número, a mensagem do WhatsApp e
a chave Pix pelos dados oficiais em `app/doacoes/page.tsx` e gere um novo QR em
`public/img/pix-qr.png`.

## Segurança e LGPD

O cadastro coleta CPF, CadÚnico, telefone e, para menores, nome/telefone/CPF
dos responsáveis. O perfil do atleta também pode guardar foto e história. Antes
de ir para produção é obrigatório:

- autenticação real com hash de senha (bcrypt/Argon2), nunca senha em texto puro;
- proteção das rotas `/admin` no servidor (middleware), não só no cliente;
- política de retenção, consentimento do responsável e trilha de auditoria;
- criptografia em repouso e restrição de acesso aos documentos.

Os dados atuais são fictícios e servem apenas para demonstração. Para voltar ao
conteúdo original, use o botão **Restaurar dados de exemplo** no rodapé da
Visão geral do admin.

## Qualidade

- Build de produção (`npm run build`) sem erros de TypeScript.
- ESLint (`next/core-web-vitals`) sem avisos.
- Lighthouse: **100** em acessibilidade, boas práticas e SEO nas páginas
  públicas auditadas.
- `axe-core` (WCAG A/AA): **0 violações** na landing, portal do atleta e admin.
- Fluxos validados: login de atleta e admin, cadastro completo com ViaCEP e
  máscaras, aprovação de atleta, publicação de notícia e leitura pelo atleta.
- Layout responsivo, menu mobile, galeria com lightbox e modais acessíveis.

## Imagens

As fotos da Ponte dos Ingleses vêm do Wikimedia Commons. As imagens de pódios,
treinos, celebrações e comunidade fazem parte do acervo do projeto e de
publicações de atletas e parceiros no Instagram (@vencedorespontemetalica).
Todos os créditos estão em `/creditos`.

Para trocar as fotos, substitua os arquivos de `public/img/` mantendo os mesmos
nomes — ou ajuste os caminhos nos componentes.

- Logotipo: `public/img/logo.png`
- Hero / Ponte dos Ingleses ao anoitecer: `public/img/hero.jpg` — Claudney Neves, CC BY-SA 4.0
- Ponte dos Ingleses de dia: `public/img/ponte.jpg` — Governo Federal Brasileiro, CC BY-SA 3.0
- Pódio do projeto: `public/img/podio-treino.jpg` — acervo do projeto no Instagram
- Pódio do circuito: `public/img/podio-conquistas.jpg` — acervo do projeto no Instagram
- Atleta celebrando: `public/img/vencedores.jpg` — acervo do projeto no Instagram
- Bodyboard na onda: `public/img/treino-onda.jpg` — Thelipe Lima / Paulo Sucesso
- Celebração da equipe: `public/img/galeria-competicao.jpg` — acervo do projeto no Instagram
- Atleta ao pôr do sol: `public/img/galeria-atleta.jpg` — acervo do projeto no Instagram
- Comunidade do projeto: `public/img/comunidade.jpg` — acervo do projeto no Instagram
- Iracema / atleta sob a Ponte: `public/img/iracema.jpg` — acervo do projeto no Instagram
- Treino na areia: `public/img/treino.jpg` — acervo do projeto no Instagram
- A caminho do mar: `public/img/acao.jpg` — acervo do projeto no Instagram

## Deploy

Antes de publicar:

1. ajuste `metadataBase` em `app/layout.tsx` e a constante `BASE` em
   `app/sitemap.ts` / `app/robots.ts` para o domínio real;
2. troque o armazenamento local por banco/API (ver acima);
3. remova as credenciais de demonstração da interface e do código;
4. cadastre as variáveis de ambiente do backend escolhido.

## Próximos passos sugeridos

1. Backend real + upload de foto do atleta (S3/Supabase Storage).
2. Middleware de autenticação e papéis (admin, coordenação, atleta).
3. Recuperação de senha e verificação de e-mail.
4. Notificações por WhatsApp/e-mail para novos treinos e aprovações.
5. Página individual de notícia com Open Graph dinâmico.
6. Painel de frequência nos treinos e evolução do atleta.
7. Edição dos textos da landing e da galeria pelo próprio dashboard.

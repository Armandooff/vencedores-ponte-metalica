# Páginas públicas, agenda e newsletter — Plano de implementação

**Data:** 27/11/2026
**Design aprovado:** conversa de 27/11/2026 (briefing do subagente)
**Modo:** inline
**Objetivo:** publicar as páginas de agenda, voluntariado, parceiros, histórias, ajuda e responsáveis, integrar a newsletter em `/noticias`, a doação recorrente em `/doacoes` e os novos links de navegação, sem alterar o admin nem as seções da home.

## Decisões
- `/agenda` lê eventos ativos via cliente admin no servidor (`lib/agenda-publica.ts`), expondo apenas id, título, descrição, data, hora, local e categorias. A API `GET /api/agenda` reutiliza a mesma função e nunca retorna presenças ou atletas.
- A página separa próximos e encerrados no cliente, com busca local para o estado vazio; datas passadas aparecem como “Encerrado”.
- Newsletter: tabela aditiva `public.newsletter_inscritos`, RLS ligada sem políticas públicas, API `POST /api/newsletter` com service role e Zod, falha fechada e duplicado idempotente.
- O formulário da newsletter não promete envio automático; o link “Falar no WhatsApp” aponta para `/#contato`.
- Doação recorrente é uma conversa com a coordenação; sem gateway, valores ou cobrança automática.
- Conteúdo editorial sem nomes, falas, logos, valores ou números de impacto inventados. Canais oficiais de WhatsApp/Pix continuam pendentes de confirmação.
- Header recebe apenas “Agenda”; Footer recebe uma coluna “Comunidade” com os demais links.

## Arquivos
| Arquivo | Ação |
|---|---|
| `supabase/schema.sql` | tabela aditiva `newsletter_inscritos` com RLS |
| `lib/agenda-publica.ts` | consulta e mapeamento dos campos públicos de eventos |
| `lib/types.ts` | tipo `EventoPublico` |
| `app/api/agenda/route.ts` | endpoint público somente leitura, sem cache |
| `app/api/newsletter/route.ts` | cadastro server-side com Zod e service role |
| `components/agenda/AgendaLista.tsx` | listagem, abas, busca, estados e CTA |
| `components/noticias/NewsletterSecao.tsx` | formulário com estados, consentimento e aria-live |
| `components/site/PageHero.tsx` | hero compartilhado das novas páginas |
| `app/agenda/page.tsx` | página pública da agenda |
| `app/voluntariado/page.tsx` | funções, requisitos e contato |
| `app/parceiros/page.tsx` | apoio, tipos, contrapartidas e convite |
| `app/historias/page.tsx` | três narrativas com fotos existentes |
| `app/ajuda/page.tsx` | FAQ com `<details>` acessível |
| `app/responsaveis/page.tsx` | portal, dados de menores, LGPD e imagem |
| `components/noticias/NoticiasLista.tsx` | renderizar a newsletter ao final |
| `components/site/Header.tsx` | link “Agenda” no desktop e mobile |
| `components/site/Footer.tsx` | coluna Comunidade e ajuste de alvos de toque |
| `app/doacoes/page.tsx` | bloco “Quero doar todo mês” |
| `app/noticias/page.tsx` | descrição de metadata atualizada |
| `app/sitemap.ts` | novas rotas públicas |

## Tarefas e verificação
1. Aplicar a tabela da newsletter com `node scripts/migrate.mjs` e conferir `to_regclass`.
2. Criar agenda server-side, API e página; testar `/api/agenda` com os 4 eventos do Supabase, campos públicos e ausência de presenças.
3. Criar newsletter (API + formulário) e testar e-mail válido, inválido, consentimento ausente, duplicado e leitura bloqueada para anon.
4. Criar as cinco páginas editoriais e integrar Header, Footer, `/doacoes` e sitemap.
5. Rodar `npx tsc --noEmit`, `npm run lint` e `npm run build`.
6. Abrir as rotas em 1440 e 390, conferir console limpo, overflow horizontal, teclado e axe WCAG A/AA 0.
7. Remover dados de teste da newsletter e não deixar arquivos temporários.

## Critérios de aceite
- Nenhuma presença, atleta ou dado sensível exposto em `/agenda` ou `/api/agenda`.
- Agenda ordena próximos primeiro, marca passados como encerrados e tem estado vazio amigável.
- Newsletter grava apenas e-mail + consentimento, trata duplicado e falha sem simular sucesso.
- Nenhuma promessa de envio automático, broadcast, gateway ou área de responsáveis separada.
- Header só ganha “Agenda”; Footer concentra os novos links sem repetir Instagram/localização.
- Build, lint, tipos e axe passam; `/admin` continua noindex.

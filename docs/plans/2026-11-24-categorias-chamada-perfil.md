# Categorias, chamada e perfil do atleta — Plano de implementação

**Data:** 24/11/2026
**Design aprovado:** conversa de 24/11/2026
**Modo:** inline
**Objetivo:** remover RG/modalidade/nível, adotar 14 categorias, criar chamada por evento, permitir edição de perfil com foto/história e exibir todos os eventos ativos no painel do atleta.

## Decisões
- Categorias: Profissional, Sub12, Sub14, Sub16, Sub18, Open e 40+, masculino e feminino (14 no total).
- Atleta edita apenas telefone, foto e história. Nome, e-mail, CPF, nascimento, categoria e responsáveis continuam sob a coordenação.
- Chamada por evento, com atletas aprovados; presenças salvas em `evento.presencas`.
- “Treino de sábado” pré-preenche o próximo sábado, sem gerar eventos automaticamente.
- Painel do atleta lista todos os eventos ativos; passados aparecem como “Encerrado”.
- Migração automática de `vpm:db:v2` para `vpm:db:v3`; dados antigos sem categoria ficam “A definir”.
- Sem novas dependências.

## Arquivos
| Arquivo | Ação |
|---|---|
| `lib/categorias.ts` | criar constantes, rótulos, opções e grupos |
| `lib/types.ts` | `CategoriaAtleta`, `Presenca`, campos novos, remover antigos |
| `lib/schemas/atleta.ts` | categoria obrigatória, CPF dos pais, remover RG/modalidade/nível |
| `lib/format.ts` | remover rótulos antigos, adicionar `proximoSabadoISO` |
| `lib/migracao.ts` | criar migração v2 → v3 e sanitização |
| `lib/store.tsx` | chave v3, migração, `registrarChamada` |
| `lib/seed.ts` | categorias/CPF/eventos sem turma |
| `components/cadastro/FormularioAtleta.tsx` | remover RG/modalidade/nível, categoria e CPF dos pais |
| `components/ui/AvatarAtleta.tsx` | criar avatar reutilizável com foto/fallback |
| `components/atletas/PainelAtleta.tsx` | categoria, agenda completa, perfil e foto |
| `components/atletas/ModalPerfilAtleta.tsx` | criar edição de telefone/foto/história |
| `components/admin/GerenciarAgenda.tsx` | treino de sábado, chamada, remover turma |
| `components/admin/ModalEvento.tsx` | remover turma, aceitar data/título inicial |
| `components/admin/ChamadaEvento.tsx` | criar modal de chamada |
| `components/admin/GerenciarAtletas.tsx` | filtro/coluna/CSV por categoria, avatar |
| `components/admin/VisaoGeral.tsx` | distribuição por grupo de categoria e avatar |
| `components/admin/ModalAtleta.tsx` | categoria, CPF dos pais, avatar/história |
| `README.md` | atualizar categorias, chamada, perfil e migração |

## Tarefas e verificação
1. Criar helpers/tipos/schema/migração/store/seed; conferir com `npx tsc --noEmit`.
2. Atualizar cadastro; testar 14 categorias, ausência de RG/modalidade/nível e CPF dos pais.
3. Atualizar admin de atletas e visão geral; testar filtro por categoria e distribuição.
4. Atualizar agenda e criar chamada; testar treino de sábado, evento sem turma e presenças salvas.
5. Atualizar painel do atleta; testar lista completa de eventos ativos, “Encerrado”, edição de telefone/foto/história.
6. Testar migração de v2 com banco antigo e evento sem `turma`.
7. Rodar `npx tsc --noEmit`, `npm run lint`, `npm run build`, Puppeteer e axe na porta 3100.

## Critérios de aceite
- Nenhuma referência a RG, modalidade, nível ou turma na interface e nos dados novos.
- Categoria obrigatória no cadastro; 14 opções.
- CPF da mãe/pai obrigatório e válido para menores.
- Chamada salva por evento e reaparece ao reabrir.
- Painel do atleta mostra todos os eventos ativos.
- Perfil permite telefone, foto e história, persistindo no navegador.
- Admin filtra atletas por categoria.
- Migração preserva dados antigos e marca categoria ausente como “A definir”.

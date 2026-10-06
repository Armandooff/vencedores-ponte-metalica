# Vencedores da Ponte Metálica — Plataforma Web

Projeto Next.js (App Router) + TypeScript + Tailwind CSS para o projeto social
de bodyboard/surf na Praia de Iracema (Fortaleza-CE).

## Estrutura

- `app/page.tsx` — Landing page institucional (Quem Somos, Objetivo, Como
  Nasceu, Como Funcionamos, Conquistas, Idealizador, CTA).
- `app/cadastro/page.tsx` — Portal de inscrição do atleta.
- `app/admin/page.tsx` — Painel administrativo (Data Grid com CRUD).
- `components/landing/` — Seções da landing page (um componente por seção).
- `components/cadastro/FormularioAtleta.tsx` — Formulário com cálculo de
  idade e exibição condicional dos dados dos responsáveis para menores de 18.
- `components/admin/` — Tabela de gestão (`@tanstack/react-table`) + modal de
  edição que reaproveita o próprio `FormularioAtleta`.
- `lib/idade.ts` — Funções puras de cálculo de idade (fáceis de testar).
- `lib/schemas/atleta.ts` — Schema Zod com validação condicional (campos dos
  pais só são obrigatórios se o atleta for menor de idade).
- `lib/mock/atletas.json` — Dados simulados (substituir por API real /
  Firebase / backend Laravel).

## Como rodar

```bash
npm install
npm run dev
```

Acesse:
- `/` — landing page
- `/cadastro` — formulário de inscrição
- `/admin` — painel administrativo

## Próximos passos sugeridos

1. **Persistência real**: trocar `lib/mock/atletas.json` por chamadas a uma
   API (pode ser o próprio backend Laravel já existente do projeto, exposto
   como API REST, ou Firebase/Firestore).
2. **Autenticação**: proteger `/admin` com login (NextAuth.js, por exemplo) e
   diferenciar papéis (admin vs operador) — importante porque a tabela lida
   com CPF/RG de menores de idade.
3. **Upload de foto**: hoje o campo de foto de perfil é apenas visual;
   conectar a um serviço de storage (S3, Firebase Storage, etc.).
4. **Máscaras de input**: adicionar `react-imask` (já incluso no
   `package.json`) para máscaras de CPF, CEP e telefone em tempo de digitação.
5. **Autopreenchimento de endereço**: integrar a API pública do ViaCEP a
   partir do campo CEP.
6. **LGPD**: como o formulário coleta CPF, RG e CadÚnico de crianças e
   adolescentes, vale revisar consentimento dos responsáveis e política de
   retenção/anonimização de dados antes de ir para produção.

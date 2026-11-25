-- Vencedores da Ponte Metálica — schema base
-- Execute com: node scripts/migrate.mjs
-- Requer a extensão pgcrypto (disponível no Supabase).

create extension if not exists pgcrypto;

-- ============================================================
-- Perfis e papéis
-- ============================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'atleta' check (role in ('admin', 'atleta')),
  nome text not null default '',
  email text not null,
  criado_em timestamptz not null default now()
);

-- ============================================================
-- Atletas
-- ============================================================

create table if not exists public.atletas (
  id text primary key default gen_random_uuid()::text,
  user_id uuid unique references auth.users(id) on delete set null,
  nome_completo text not null,
  email text not null unique,
  data_nascimento date not null,
  telefone text not null default '',
  cpf text not null unique,
  cep text not null default '',
  bairro text not null default '',
  endereco text not null default '',
  numero text not null default '',
  cod_juv text,
  cad_unico text,
  nome_mae text,
  nome_pai text,
  telefone_mae text,
  telefone_pai text,
  cpf_mae text,
  cpf_pai text,
  categoria text,
  status text not null default 'pendente' check (status in ('pendente', 'aprovado', 'reprovado')),
  foto_url text,
  historia text,
  consentimento boolean not null default false,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create index if not exists atletas_status_idx on public.atletas (status);
create index if not exists atletas_categoria_idx on public.atletas (categoria);
create index if not exists atletas_user_id_idx on public.atletas (user_id);

-- ============================================================
-- Notícias
-- ============================================================

create table if not exists public.noticias (
  id text primary key default gen_random_uuid()::text,
  titulo text not null,
  resumo text not null,
  conteudo text not null,
  categoria text not null default 'Notícia',
  imagem text not null default '/img/noticia-trofeu.jpg',
  autor text not null default 'Coordenação',
  publicada boolean not null default false,
  destaque boolean not null default false,
  publicado_em timestamptz not null default now(),
  criado_em timestamptz not null default now()
);

create index if not exists noticias_publicada_idx on public.noticias (publicada, publicado_em desc);

-- ============================================================
-- Eventos e presenças
-- ============================================================

create table if not exists public.eventos (
  id text primary key default gen_random_uuid()::text,
  titulo text not null,
  descricao text not null default '',
  data date not null,
  hora time not null,
  local text not null,
  ativo boolean not null default true,
  categorias text[] not null default '{}',
  criado_em timestamptz not null default now()
);

create index if not exists eventos_data_idx on public.eventos (data, hora);
create index if not exists eventos_ativo_idx on public.eventos (ativo);

create table if not exists public.presencas (
  evento_id text not null references public.eventos(id) on delete cascade,
  atleta_id text not null references public.atletas(id) on delete cascade,
  status text not null check (status in ('presente', 'ausente')),
  registrado_em timestamptz not null default now(),
  primary key (evento_id, atleta_id)
);

create index if not exists presencas_atleta_idx on public.presencas (atleta_id);

-- ============================================================
-- Helpers e triggers
-- ============================================================

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.set_atualizado_em()
returns trigger
language plpgsql
as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$;

drop trigger if exists atletas_set_atualizado_em on public.atletas;
create trigger atletas_set_atualizado_em
before update on public.atletas
for each row execute function public.set_atualizado_em();

-- Cria o perfil básico quando um usuário do Auth é criado.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, nome, role)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'nome', split_part(coalesce(new.email, 'atleta'), '@', 1)),
    'atleta'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Atualização de perfil pelo próprio atleta, sem liberar alteração de
-- categoria, status, dados pessoais ou responsáveis.
create or replace function public.atualizar_meu_perfil(
  p_telefone text default null,
  p_historia text default null,
  p_foto_url text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Não autenticado';
  end if;

  update public.atletas
  set
    telefone = coalesce(p_telefone, telefone),
    historia = p_historia,
    foto_url = p_foto_url
  where user_id = auth.uid();
end;
$$;

revoke all on function public.atualizar_meu_perfil(text, text, text) from public;
grant execute on function public.atualizar_meu_perfil(text, text, text) to authenticated;

-- ============================================================
-- Row Level Security
-- ============================================================

alter table public.profiles enable row level security;
alter table public.atletas enable row level security;
alter table public.noticias enable row level security;
alter table public.eventos enable row level security;
alter table public.presencas enable row level security;

-- profiles
drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
on public.profiles for select
to authenticated
using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_admin_all" on public.profiles;
create policy "profiles_admin_all"
on public.profiles for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- atletas
drop policy if exists "atletas_select_own_or_admin" on public.atletas;
create policy "atletas_select_own_or_admin"
on public.atletas for select
to authenticated
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "atletas_insert_admin" on public.atletas;
create policy "atletas_insert_admin"
on public.atletas for insert
to authenticated
with check (public.is_admin());

-- Cadastro público: o próprio usuário pode criar seu registro pendente.
drop policy if exists "atletas_insert_own" on public.atletas;
create policy "atletas_insert_own"
on public.atletas for insert
to authenticated
with check (user_id = auth.uid() and status = 'pendente');

drop policy if exists "atletas_update_admin" on public.atletas;
create policy "atletas_update_admin"
on public.atletas for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "atletas_delete_admin" on public.atletas;
create policy "atletas_delete_admin"
on public.atletas for delete
to authenticated
using (public.is_admin());

-- noticias: publicadas são públicas; admin vê e gerencia todas.
drop policy if exists "noticias_select_public_or_admin" on public.noticias;
create policy "noticias_select_public_or_admin"
on public.noticias for select
to anon, authenticated
using (publicada or public.is_admin());

drop policy if exists "noticias_admin_write" on public.noticias;
create policy "noticias_admin_write"
on public.noticias for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- eventos: admin vê todos; atleta vê ativos da sua categoria ou sem restrição.
drop policy if exists "eventos_select_admin" on public.eventos;
create policy "eventos_select_admin"
on public.eventos for select
to authenticated
using (public.is_admin());

drop policy if exists "eventos_select_atleta" on public.eventos;
create policy "eventos_select_atleta"
on public.eventos for select
to authenticated
using (
  ativo
  and not public.is_admin()
  and exists (
    select 1
    from public.atletas a
    where a.user_id = auth.uid()
      and (
        coalesce(array_length(eventos.categorias, 1), 0) = 0
        or a.categoria = any(eventos.categorias)
      )
  )
);

drop policy if exists "eventos_admin_write" on public.eventos;
create policy "eventos_admin_write"
on public.eventos for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- presencas: atleta vê as próprias; admin gerencia todas.
drop policy if exists "presencas_select_own_or_admin" on public.presencas;
create policy "presencas_select_own_or_admin"
on public.presencas for select
to authenticated
using (
  public.is_admin()
  or exists (
    select 1 from public.atletas a
    where a.id = presencas.atleta_id and a.user_id = auth.uid()
  )
);

drop policy if exists "presencas_admin_write" on public.presencas;
create policy "presencas_admin_write"
on public.presencas for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- ============================================================
-- Storage para fotos de atletas
-- ============================================================

insert into storage.buckets (id, name, public)
values ('atletas', 'atletas', true)
on conflict (id) do nothing;

drop policy if exists "atletas_photos_public_read" on storage.objects;
create policy "atletas_photos_public_read"
on storage.objects for select
using (bucket_id = 'atletas');

drop policy if exists "atletas_photos_insert_own" on storage.objects;
create policy "atletas_photos_insert_own"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'atletas'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "atletas_photos_update_own" on storage.objects;
create policy "atletas_photos_update_own"
on storage.objects for update
to authenticated
using (
  bucket_id = 'atletas'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'atletas'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "atletas_photos_delete_own" on storage.objects;
create policy "atletas_photos_delete_own"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'atletas'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================================
-- FinanCRM - Esquema Supabase (PostgreSQL)
-- ============================================================

-- 1. TABLAS
-- Los usuarios se manejan con auth.users de Supabase.
-- Creamos un trigger para sincronizar el perfil automaticamente.

create table if not exists public.perfiles (
  id uuid references auth.users on delete cascade primary key,
  nombre text not null default '',
  created_at timestamptz default now()
);

create table if not exists public.ingresos (
  id uuid default gen_random_uuid() primary key,
  usuario_id uuid references auth.users on delete cascade not null,
  fecha date not null,
  categoria text not null default 'Otros',
  descripcion text not null default '',
  metodo_pago text not null default '',
  monto numeric(12,2) not null default 0,
  created_at timestamptz default now()
);

create table if not exists public.gastos (
  id uuid default gen_random_uuid() primary key,
  usuario_id uuid references auth.users on delete cascade not null,
  fecha date not null,
  categoria text not null default 'Otros',
  descripcion text not null default '',
  metodo_pago text not null default '',
  monto numeric(12,2) not null default 0,
  created_at timestamptz default now()
);

create table if not exists public.presupuestos (
  id uuid default gen_random_uuid() primary key,
  usuario_id uuid references auth.users on delete cascade not null,
  categoria text not null,
  limite numeric(12,2) not null default 0,
  mes text not null,
  created_at timestamptz default now()
);

create table if not exists public.metas (
  id uuid default gen_random_uuid() primary key,
  usuario_id uuid references auth.users on delete cascade not null,
  nombre text not null,
  objetivo numeric(12,2) not null default 0,
  actual numeric(12,2) not null default 0,
  fecha_objetivo date not null,
  created_at timestamptz default now()
);

create table if not exists public.deudas (
  id uuid default gen_random_uuid() primary key,
  usuario_id uuid references auth.users on delete cascade not null,
  nombre text not null,
  saldo numeric(12,2) not null default 0,
  interes numeric(5,2) not null default 0,
  fecha_limite date not null,
  estado text not null default 'Activo',
  created_at timestamptz default now()
);

create table if not exists public.configuracion (
  id uuid default gen_random_uuid() primary key,
  usuario_id uuid references auth.users on delete cascade not null,
  clave text not null,
  valor text not null default '',
  created_at timestamptz default now(),
  unique (usuario_id, clave)
);

-- 2. ROW LEVEL SECURITY

alter table public.perfiles enable row level security;
alter table public.ingresos enable row level security;
alter table public.gastos enable row level security;
alter table public.presupuestos enable row level security;
alter table public.metas enable row level security;
alter table public.deudas enable row level security;
alter table public.configuracion enable row level security;

-- Perfiles: cada usuario solo ve/edita su propio perfil
create policy "Usuarios ven su propio perfil"
  on public.perfiles for select
  using (auth.uid() = id);

create policy "Usuarios insertan su propio perfil"
  on public.perfiles for insert
  with check (auth.uid() = id);

create policy "Usuarios actualizan su propio perfil"
  on public.perfiles for update
  using (auth.uid() = id);

-- Ingresos: cada usuario solo ve/edita sus propios ingresos
create policy "Usuarios ven sus ingresos"
  on public.ingresos for select
  using (auth.uid() = usuario_id);

create policy "Usuarios insertan sus ingresos"
  on public.ingresos for insert
  with check (auth.uid() = usuario_id);

-- Gastos
create policy "Usuarios ven sus gastos"
  on public.gastos for select
  using (auth.uid() = usuario_id);

create policy "Usuarios insertan sus gastos"
  on public.gastos for insert
  with check (auth.uid() = usuario_id);

-- Presupuestos
create policy "Usuarios ven sus presupuestos"
  on public.presupuestos for select
  using (auth.uid() = usuario_id);

create policy "Usuarios insertan sus presupuestos"
  on public.presupuestos for insert
  with check (auth.uid() = usuario_id);

-- Metas
create policy "Usuarios ven sus metas"
  on public.metas for select
  using (auth.uid() = usuario_id);

create policy "Usuarios insertan sus metas"
  on public.metas for insert
  with check (auth.uid() = usuario_id);

-- Deudas
create policy "Usuarios ven sus deudas"
  on public.deudas for select
  using (auth.uid() = usuario_id);

create policy "Usuarios insertan sus deudas"
  on public.deudas for insert
  with check (auth.uid() = usuario_id);

-- Configuracion
create policy "Usuarios ven su configuracion"
  on public.configuracion for select
  using (auth.uid() = usuario_id);

create policy "Usuarios insertan su configuracion"
  on public.configuracion for insert
  with check (auth.uid() = usuario_id);

-- 3. TRIGGER: crear perfil automaticamente al registrarse

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.perfiles (id, nombre)
  values (new.id, coalesce(new.raw_user_meta_data->>'nombre', ''));
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

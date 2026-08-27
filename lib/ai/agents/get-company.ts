/* =========================================================
   AI SALESOS — AI WORKFORCE DATABASE
   ========================================================= */

create table if not exists public.ai_agents (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  name text not null,
  description text,
  role text not null default 'AI Assistant',
  status text not null default 'active'
    check (status in ('active','paused','offline')),
  instructions text,
  capabilities jsonb not null default '[]'::jsonb,
  tasks_completed integer not null default 0,
  tasks_pending integer not null default 0,
  last_active_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_tasks (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  agent_id uuid references public.ai_agents(id) on delete set null,
  assigned_to uuid references auth.users(id) on delete set null,
  title text not null,
  description text,
  task_type text default 'general',
  priority text not null default 'medium'
    check (priority in ('low','medium','high','urgent')),
  status text not null default 'pending'
    check (status in ('pending','running','completed','failed','cancelled')),
  source text default 'manual',
  result text,
  due_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_activity (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  agent_id uuid references public.ai_agents(id) on delete set null,
  task_id uuid references public.ai_tasks(id) on delete set null,
  user_id uuid references auth.users(id) on delete set null,
  action text not null,
  description text,
  status text default 'success',
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_insights (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  title text not null,
  description text not null,
  insight_type text default 'general',
  severity text default 'info'
    check (severity in ('info','success','warning','critical')),
  source text default 'AI',
  resolved boolean not null default false,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_training (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  agent_id uuid references public.ai_agents(id) on delete cascade,
  title text not null,
  category text default 'general',
  content text not null,
  source text default 'manual',
  status text default 'active'
    check (status in ('active','draft','archived')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

/* =========================================================
   INDEXES
   ========================================================= */

create index if not exists ai_agents_company_idx
on public.ai_agents(company_id);

create index if not exists ai_tasks_company_idx
on public.ai_tasks(company_id);

create index if not exists ai_tasks_agent_idx
on public.ai_tasks(agent_id);

create index if not exists ai_tasks_status_idx
on public.ai_tasks(status);

create index if not exists ai_activity_company_idx
on public.ai_activity(company_id);

create index if not exists ai_activity_created_idx
on public.ai_activity(created_at desc);

create index if not exists ai_insights_company_idx
on public.ai_insights(company_id);

create index if not exists ai_training_company_idx
on public.ai_training(company_id);

create index if not exists ai_training_agent_idx
on public.ai_training(agent_id);

/* =========================================================
   RLS
   ========================================================= */

alter table public.ai_agents enable row level security;
alter table public.ai_tasks enable row level security;
alter table public.ai_activity enable row level security;
alter table public.ai_insights enable row level security;
alter table public.ai_training enable row level security;

/* =========================================================
   COMPANY ACCESS HELPER
   ========================================================= */

create or replace function public.user_company_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select company_id
  from public.profiles
  where id = auth.uid()
  limit 1;
$$;

/* =========================================================
   POLICIES
   ========================================================= */

drop policy if exists "AI agents company access"
on public.ai_agents;

create policy "AI agents company access"
on public.ai_agents
for all
to authenticated
using (company_id = public.user_company_id())
with check (company_id = public.user_company_id());


drop policy if exists "AI tasks company access"
on public.ai_tasks;

create policy "AI tasks company access"
on public.ai_tasks
for all
to authenticated
using (company_id = public.user_company_id())
with check (company_id = public.user_company_id());


drop policy if exists "AI activity company access"
on public.ai_activity;

create policy "AI activity company access"
on public.ai_activity
for all
to authenticated
using (company_id = public.user_company_id())
with check (company_id = public.user_company_id());


drop policy if exists "AI insights company access"
on public.ai_insights;

create policy "AI insights company access"
on public.ai_insights
for all
to authenticated
using (company_id = public.user_company_id())
with check (company_id = public.user_company_id());


drop policy if exists "AI training company access"
on public.ai_training;

create policy "AI training company access"
on public.ai_training
for all
to authenticated
using (company_id = public.user_company_id())
with check (company_id = public.user_company_id());

/* =========================================================
   UPDATED AT
   ========================================================= */

drop trigger if exists ai_agents_updated_at
on public.ai_agents;

create trigger ai_agents_updated_at
before update on public.ai_agents
for each row
execute function public.set_updated_at();


drop trigger if exists ai_tasks_updated_at
on public.ai_tasks;

create trigger ai_tasks_updated_at
before update on public.ai_tasks
for each row
execute function public.set_updated_at();


drop trigger if exists ai_training_updated_at
on public.ai_training;

create trigger ai_training_updated_at
before update on public.ai_training
for each row
execute function public.set_updated_at();
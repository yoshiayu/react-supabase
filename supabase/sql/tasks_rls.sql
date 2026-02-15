-- 追記メモ（元テキストとの差分）
-- 1) 再実行可能にするため、policy作成前に `drop policy if exists` を追加しています。
-- 2) 元テキストには policy 定義が重複掲載されていますが、本ファイルでは1セットに整理しています。
-- 3) 上記2点は実行安定性のための整理であり、RLSの仕様自体は元テキストと同一です。

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  status text not null check (status in ('todo', 'doing', 'done')),
  priority text not null check (priority in ('low', 'mid', 'high')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_tasks_user_id on public.tasks(user_id);
create index if not exists idx_tasks_created_at on public.tasks(created_at desc);

alter table public.tasks enable row level security;

drop policy if exists "tasks_select_own" on public.tasks;
drop policy if exists "tasks_insert_own" on public.tasks;
drop policy if exists "tasks_update_own" on public.tasks;
drop policy if exists "tasks_delete_own" on public.tasks;

create policy "tasks_select_own"
on public.tasks
for select
using (auth.uid() = user_id);

create policy "tasks_insert_own"
on public.tasks
for insert
with check (auth.uid() = user_id);

create policy "tasks_update_own"
on public.tasks
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "tasks_delete_own"
on public.tasks
for delete
using (auth.uid() = user_id);

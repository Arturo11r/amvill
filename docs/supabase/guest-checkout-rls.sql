-- Guest checkout RLS policies for orders and order_items.
-- Run in Supabase SQL Editor as a privileged role.

alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "orders_insert_authenticated_owner" on public.orders;
drop policy if exists "orders_insert_guest_pending" on public.orders;
drop policy if exists "order_items_insert_authenticated_owner" on public.order_items;
drop policy if exists "order_items_insert_guest_pending_order" on public.order_items;

create policy "orders_insert_authenticated_owner"
on public.orders
for insert
to authenticated
with check (
  user_id = auth.uid()
  and status = 'pending'
  and length(trim(customer_name)) > 0
  and length(trim(customer_phone)) > 0
);

create policy "orders_insert_guest_pending"
on public.orders
for insert
to anon
with check (
  user_id is null
  and status = 'pending'
  and length(trim(customer_name)) > 0
  and length(trim(customer_phone)) > 0
);

create policy "order_items_insert_authenticated_owner"
on public.order_items
for insert
to authenticated
with check (
  quantity > 0
  and unit_price > 0
  and exists (
    select 1
    from public.orders o
    where o.id = order_items.order_id
      and o.user_id = auth.uid()
      and o.status = 'pending'
  )
);

create policy "order_items_insert_guest_pending_order"
on public.order_items
for insert
to anon
with check (
  quantity > 0
  and unit_price > 0
  and exists (
    select 1
    from public.orders o
    where o.id = order_items.order_id
      and o.user_id is null
      and o.status = 'pending'
  )
);

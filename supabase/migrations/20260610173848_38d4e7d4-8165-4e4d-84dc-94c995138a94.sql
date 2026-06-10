ALTER TABLE public.shipments
  ADD COLUMN IF NOT EXISTS origin_lat numeric,
  ADD COLUMN IF NOT EXISTS origin_lng numeric,
  ADD COLUMN IF NOT EXISTS destination_lat numeric,
  ADD COLUMN IF NOT EXISTS destination_lng numeric;
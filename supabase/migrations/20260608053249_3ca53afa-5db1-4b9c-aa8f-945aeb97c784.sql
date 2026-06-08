CREATE TABLE public.shipment_email_drafts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shipment_id UUID NOT NULL,
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  message_id TEXT,
  error_message TEXT,
  approved_by UUID,
  approved_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.shipment_email_drafts TO authenticated;
GRANT ALL ON public.shipment_email_drafts TO service_role;

ALTER TABLE public.shipment_email_drafts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "drafts admin all"
ON public.shipment_email_drafts
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER shipment_email_drafts_updated_at
BEFORE UPDATE ON public.shipment_email_drafts
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX shipment_email_drafts_status_idx ON public.shipment_email_drafts(status, created_at DESC);
CREATE INDEX shipment_email_drafts_shipment_idx ON public.shipment_email_drafts(shipment_id);
DROP POLICY IF EXISTS "user_roles self select" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles admin all" ON public.user_roles;
DROP POLICY IF EXISTS "profiles self read" ON public.profiles;
DROP POLICY IF EXISTS "shipments admin insert" ON public.shipments;
DROP POLICY IF EXISTS "shipments admin update" ON public.shipments;
DROP POLICY IF EXISTS "shipments admin delete" ON public.shipments;
DROP POLICY IF EXISTS "events admin write" ON public.shipment_events;
DROP POLICY IF EXISTS "quotes admin manage" ON public.quote_requests;
DROP POLICY IF EXISTS "contact admin manage" ON public.contact_messages;
DROP POLICY IF EXISTS "newsletter admin read" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "newsletter admin delete" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "invoices admin all" ON public.invoices;

REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO service_role;

CREATE POLICY "user_roles self select" ON public.user_roles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "profiles self read" ON public.profiles
  FOR SELECT TO authenticated
  USING (
    auth.uid() = id
    OR EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role
    )
  );

CREATE POLICY "shipments admin insert" ON public.shipments
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role
    )
  );

CREATE POLICY "shipments admin update" ON public.shipments
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role
    )
  );

CREATE POLICY "shipments admin delete" ON public.shipments
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role
    )
  );

CREATE POLICY "events admin write" ON public.shipment_events
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role
    )
  );

CREATE POLICY "quotes admin manage" ON public.quote_requests
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role
    )
  );

CREATE POLICY "contact admin manage" ON public.contact_messages
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role
    )
  );

CREATE POLICY "newsletter admin read" ON public.newsletter_subscribers
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role
    )
  );

CREATE POLICY "newsletter admin delete" ON public.newsletter_subscribers
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role
    )
  );

CREATE POLICY "invoices admin all" ON public.invoices
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role
    )
  );
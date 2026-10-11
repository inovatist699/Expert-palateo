-- Keep the public catalog readable while enforcing the underlying RLS policy.
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON public.restaurant_catalog FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.restaurant_catalog TO anon, authenticated;
GRANT SELECT (id, external_provider, external_place_id, name, address, area, city, latitude, longitude, cuisines, price, price_display, rating, review_count, tags, dietary_options, ambience_tags, occasion_tags, spice_profile, photo_url, maps_url) ON public.restaurants TO anon, authenticated;
ALTER VIEW public.restaurant_catalog SET (security_invoker = true);
ALTER FUNCTION public.touch_connection_updated_at() SET search_path = '';

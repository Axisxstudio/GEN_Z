-- Roles enum + user_roles table
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins view all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Categories
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active categories" ON public.categories FOR SELECT USING (is_active = true);
CREATE POLICY "Admins read all categories" ON public.categories FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage categories" ON public.categories FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Products
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  discount_price NUMERIC(10,2),
  images TEXT[] NOT NULL DEFAULT '{}',
  sizes TEXT[] NOT NULL DEFAULT '{}',
  colors TEXT[] NOT NULL DEFAULT '{}',
  material TEXT,
  fit_type TEXT,
  stock_status TEXT NOT NULL DEFAULT 'in_stock',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_new_arrival BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active products" ON public.products FOR SELECT USING (is_active = true);
CREATE POLICY "Admins read all products" ON public.products FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage products" ON public.products FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_products_featured ON public.products(is_featured) WHERE is_featured = true;
CREATE INDEX idx_products_new ON public.products(is_new_arrival) WHERE is_new_arrival = true;

-- Storage bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

CREATE POLICY "Public read product images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Admins upload product images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update product images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete product images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

-- Seed categories
INSERT INTO public.categories (name, slug, is_active) VALUES
  ('Mens Wear', 'mens-wear', true),
  ('Kids Wear', 'kids-wear', true),
  ('Perfumes', 'perfumes', true),
  ('Belts', 'belts', true);

-- Seed sample products
INSERT INTO public.products (category_id, name, slug, description, price, discount_price, images, sizes, colors, material, fit_type, stock_status, is_featured, is_new_arrival)
SELECT id, 'Oversized Street Tee', 'oversized-street-tee', 'Heavyweight cotton oversized tee with dropped shoulders. The drop your wardrobe was waiting for.', 4500, 3900, ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900'], ARRAY['S','M','L','XL'], ARRAY['Black','White'], '100% Cotton', 'Oversized', 'in_stock', true, true FROM public.categories WHERE slug='mens-wear';

INSERT INTO public.products (category_id, name, slug, description, price, images, sizes, colors, material, fit_type, stock_status, is_featured, is_new_arrival)
SELECT id, 'Slim Fit Denim', 'slim-fit-denim', 'Premium stretch denim with a tapered slim fit.', 8900, ARRAY['https://images.unsplash.com/photo-1542272604-787c3835535d?w=900'], ARRAY['28','30','32','34','36'], ARRAY['Indigo','Black'], 'Denim', 'Slim', 'in_stock', true, false FROM public.categories WHERE slug='mens-wear';

INSERT INTO public.products (category_id, name, slug, description, price, images, sizes, colors, material, fit_type, stock_status, is_featured, is_new_arrival)
SELECT id, 'Graphic Print Shirt', 'graphic-print-shirt', 'Statement graphic shirt for the bold ones.', 5200, ARRAY['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=900'], ARRAY['S','M','L','XL'], ARRAY['Red','Black'], 'Cotton Blend', 'Regular', 'in_stock', false, true FROM public.categories WHERE slug='mens-wear';

INSERT INTO public.products (category_id, name, slug, description, price, images, sizes, colors, material, fit_type, stock_status, is_featured, is_new_arrival)
SELECT id, 'Kids Hoodie', 'kids-hoodie', 'Soft fleece hoodie kids will live in.', 3800, ARRAY['https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=900'], ARRAY['4Y','6Y','8Y','10Y'], ARRAY['Black','Grey'], 'Fleece', 'Regular', 'in_stock', true, true FROM public.categories WHERE slug='kids-wear';

INSERT INTO public.products (category_id, name, slug, description, price, images, stock_status, is_featured, is_new_arrival)
SELECT id, 'Noir Eau de Parfum', 'noir-edp', 'Smoky oud, leather and amber. 100ml.', 12500, ARRAY['https://images.unsplash.com/photo-1541643600914-78b084683601?w=900'], 'in_stock', true, true FROM public.categories WHERE slug='perfumes';

INSERT INTO public.products (category_id, name, slug, description, price, images, sizes, colors, material, stock_status, is_featured)
SELECT id, 'Classic Leather Belt', 'classic-leather-belt', 'Genuine leather belt with brushed metal buckle.', 3200, ARRAY['https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=900'], ARRAY['32','34','36','38','40'], ARRAY['Black','Brown'], 'Genuine Leather', 'in_stock', true FROM public.categories WHERE slug='belts';
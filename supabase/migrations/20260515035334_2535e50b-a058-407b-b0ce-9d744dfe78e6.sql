
-- Roles enum & helper
CREATE TYPE public.app_role AS ENUM ('admin', 'kader', 'ortu');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nama TEXT NOT NULL DEFAULT '',
  telepon TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

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
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('admin','kader'));
$$;

-- Bayi
CREATE TABLE public.bayi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama TEXT NOT NULL,
  tanggal_lahir DATE NOT NULL,
  jenis_kelamin TEXT NOT NULL CHECK (jenis_kelamin IN ('L','P')),
  alamat TEXT,
  ortu_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  nama_ortu TEXT,
  telepon_ortu TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.bayi ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_bayi_ortu ON public.bayi(ortu_user_id);

-- Penimbangan
CREATE TABLE public.penimbangan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bayi_id UUID NOT NULL REFERENCES public.bayi(id) ON DELETE CASCADE,
  tanggal DATE NOT NULL,
  berat_kg NUMERIC(5,2) NOT NULL,
  tinggi_cm NUMERIC(5,2) NOT NULL,
  catatan TEXT,
  dicatat_oleh UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.penimbangan ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_penimbangan_bayi ON public.penimbangan(bayi_id);

-- Imunisasi
CREATE TABLE public.imunisasi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bayi_id UUID NOT NULL REFERENCES public.bayi(id) ON DELETE CASCADE,
  jenis TEXT NOT NULL,
  tanggal DATE NOT NULL,
  dicatat_oleh UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.imunisasi ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_imunisasi_bayi ON public.imunisasi(bayi_id);

-- Kader
CREATE TABLE public.kader (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  nama TEXT NOT NULL,
  telepon TEXT,
  aktif BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.kader ENABLE ROW LEVEL SECURITY;

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_bayi_updated BEFORE UPDATE ON public.bayi
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, nama, telepon)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nama', split_part(NEW.email,'@',1)),
    NEW.raw_user_meta_data->>'telepon'
  );
  -- Default role: ortu (admin/kader di-assign manual)
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'ortu');
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ RLS POLICIES ============

-- profiles
CREATE POLICY "profiles_self_select" ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_staff(auth.uid()));
CREATE POLICY "profiles_self_update" ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- user_roles
CREATE POLICY "user_roles_self_select" ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "user_roles_admin_all" ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

-- bayi
CREATE POLICY "bayi_staff_all" ON public.bayi FOR ALL
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "bayi_ortu_select" ON public.bayi FOR SELECT
  USING (auth.uid() = ortu_user_id);

-- penimbangan
CREATE POLICY "penimbangan_staff_all" ON public.penimbangan FOR ALL
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "penimbangan_ortu_select" ON public.penimbangan FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.bayi b WHERE b.id = penimbangan.bayi_id AND b.ortu_user_id = auth.uid()));

-- imunisasi
CREATE POLICY "imunisasi_staff_all" ON public.imunisasi FOR ALL
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "imunisasi_ortu_select" ON public.imunisasi FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.bayi b WHERE b.id = imunisasi.bayi_id AND b.ortu_user_id = auth.uid()));

-- kader
CREATE POLICY "kader_staff_select" ON public.kader FOR SELECT
  USING (public.is_staff(auth.uid()));
CREATE POLICY "kader_admin_all" ON public.kader FOR ALL
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

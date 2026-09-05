-- ==============================================================================
-- NFCABDO SUPABASE MIGRATION
-- Table: profiles
-- Storage: profiles bucket
-- Row Level Security (RLS) & Policies
-- ==============================================================================

-- 1. Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('person', 'company')),
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'inactive')),
    profile_data JSONB NOT NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Performance indexes
CREATE INDEX IF NOT EXISTS idx_profiles_slug ON public.profiles(slug);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_type ON public.profiles(type);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at DESC);

-- 3. Automatic updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 5. Policies
-- Public (anonymous & authenticated) can only view active public profiles
DROP POLICY IF EXISTS "Public profiles read access" ON public.profiles;
CREATE POLICY "Public profiles read access"
    ON public.profiles
    FOR SELECT
    USING (status = 'active');

-- Authenticated admins have full CRUD access
DROP POLICY IF EXISTS "Authenticated admin full access" ON public.profiles;
CREATE POLICY "Authenticated admin full access"
    ON public.profiles
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 6. Storage bucket setup for images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'profiles',
    'profiles',
    true,
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];

-- Storage Policies
DROP POLICY IF EXISTS "Public can view profile images" ON storage.objects;
CREATE POLICY "Public can view profile images"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'profiles');

DROP POLICY IF EXISTS "Authenticated admin can upload profile images" ON storage.objects;
CREATE POLICY "Authenticated admin can upload profile images"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'profiles');

DROP POLICY IF EXISTS "Authenticated admin can update profile images" ON storage.objects;
CREATE POLICY "Authenticated admin can update profile images"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (bucket_id = 'profiles');

DROP POLICY IF EXISTS "Authenticated admin can delete profile images" ON storage.objects;
CREATE POLICY "Authenticated admin can delete profile images"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (bucket_id = 'profiles');

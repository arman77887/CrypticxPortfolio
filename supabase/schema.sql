-- =========================================================
-- CRYPTICX PORTFOLIO DATABASE + ADMIN SECURITY
-- =========================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================
-- 1. TABLES
-- =========================================================

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_en TEXT NOT NULL DEFAULT 'Arian Islam Nirob',
    name_bn TEXT NOT NULL DEFAULT 'আরিয়ান ইসলাম নিরব',
    bio_en TEXT,
    bio_bn TEXT,
    interests_en TEXT[],
    interests_bn TEXT[],
    profile_image TEXT,
    creative_name TEXT DEFAULT 'CrypticX',
    current_focus_en TEXT,
    current_focus_bn TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.memories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title_en TEXT NOT NULL,
    title_bn TEXT NOT NULL,
    description_en TEXT,
    description_bn TEXT,
    image_url TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Life',
    memory_date DATE,
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.albums (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title_en TEXT NOT NULL,
    title_bn TEXT NOT NULL,
    description_en TEXT,
    description_bn TEXT,
    cover_image TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.album_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    album_id UUID REFERENCES public.albums(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption_en TEXT,
    caption_bn TEXT,
    photo_date DATE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.experiences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title_en TEXT NOT NULL,
    title_bn TEXT NOT NULL,
    organization TEXT NOT NULL,
    description_en TEXT,
    description_bn TEXT,
    skills TEXT[],
    start_date DATE NOT NULL,
    end_date DATE,
    image_url TEXT,
    link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.journey (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    year TEXT NOT NULL,
    title_en TEXT NOT NULL,
    title_bn TEXT NOT NULL,
    description_en TEXT NOT NULL,
    description_bn TEXT NOT NULL,
    image_url TEXT,
    location TEXT,
    link TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description_en TEXT NOT NULL,
    description_bn TEXT NOT NULL,
    technology TEXT[] NOT NULL,
    image_url TEXT NOT NULL,
    project_url TEXT,
    project_date DATE,
    is_crypticx BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.social_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform TEXT NOT NULL UNIQUE,
    url TEXT NOT NULL,
    sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL
);

-- =========================================================
-- 2. ENABLE RLS
-- =========================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.album_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journey ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- =========================================================
-- 3. REMOVE OLD POLICIES
-- =========================================================

DROP POLICY IF EXISTS "Public Read Profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public Read Memories" ON public.memories;
DROP POLICY IF EXISTS "Public Read Albums" ON public.albums;
DROP POLICY IF EXISTS "Public Read Album Photos" ON public.album_photos;
DROP POLICY IF EXISTS "Public Read Experiences" ON public.experiences;
DROP POLICY IF EXISTS "Public Read Journey" ON public.journey;
DROP POLICY IF EXISTS "Public Read Projects" ON public.projects;
DROP POLICY IF EXISTS "Public Read Social Links" ON public.social_links;
DROP POLICY IF EXISTS "Public Read Site Settings" ON public.site_settings;
DROP POLICY IF EXISTS "Public Insert Contact Messages" ON public.contact_messages;

DROP POLICY IF EXISTS "Admin All Profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admin All Memories" ON public.memories;
DROP POLICY IF EXISTS "Admin All Albums" ON public.albums;
DROP POLICY IF EXISTS "Admin All Album Photos" ON public.album_photos;
DROP POLICY IF EXISTS "Admin All Experiences" ON public.experiences;
DROP POLICY IF EXISTS "Admin All Journey" ON public.journey;
DROP POLICY IF EXISTS "Admin All Projects" ON public.projects;
DROP POLICY IF EXISTS "Admin All Social Links" ON public.social_links;
DROP POLICY IF EXISTS "Admin All Messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admin All Site Settings" ON public.site_settings;

DROP POLICY IF EXISTS "Admin Only Profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admin Only Memories" ON public.memories;
DROP POLICY IF EXISTS "Admin Only Albums" ON public.albums;
DROP POLICY IF EXISTS "Admin Only Album Photos" ON public.album_photos;
DROP POLICY IF EXISTS "Admin Only Experiences" ON public.experiences;
DROP POLICY IF EXISTS "Admin Only Journey" ON public.journey;
DROP POLICY IF EXISTS "Admin Only Projects" ON public.projects;
DROP POLICY IF EXISTS "Admin Only Social Links" ON public.social_links;
DROP POLICY IF EXISTS "Admin Only Messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Admin Only Site Settings" ON public.site_settings;

-- =========================================================
-- 4. PUBLIC READ
-- =========================================================

CREATE POLICY "Public Read Profiles"
ON public.profiles
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Public Read Memories"
ON public.memories
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Public Read Albums"
ON public.albums
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Public Read Album Photos"
ON public.album_photos
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Public Read Experiences"
ON public.experiences
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Public Read Journey"
ON public.journey
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Public Read Projects"
ON public.projects
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Public Read Social Links"
ON public.social_links
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Public Read Site Settings"
ON public.site_settings
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Public Insert Contact Messages"
ON public.contact_messages
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- =========================================================
-- 5. ADMIN WRITE ACCESS
-- =========================================================

CREATE POLICY "Admin Only Profiles"
ON public.profiles
FOR ALL
TO authenticated
USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
)
WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

CREATE POLICY "Admin Only Memories"
ON public.memories
FOR ALL
TO authenticated
USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
)
WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

CREATE POLICY "Admin Only Albums"
ON public.albums
FOR ALL
TO authenticated
USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
)
WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

CREATE POLICY "Admin Only Album Photos"
ON public.album_photos
FOR ALL
TO authenticated
USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
)
WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

CREATE POLICY "Admin Only Experiences"
ON public.experiences
FOR ALL
TO authenticated
USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
)
WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

CREATE POLICY "Admin Only Journey"
ON public.journey
FOR ALL
TO authenticated
USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
)
WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

CREATE POLICY "Admin Only Projects"
ON public.projects
FOR ALL
TO authenticated
USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
)
WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

CREATE POLICY "Admin Only Social Links"
ON public.social_links
FOR ALL
TO authenticated
USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
)
WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

CREATE POLICY "Admin Only Messages"
ON public.contact_messages
FOR ALL
TO authenticated
USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
)
WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

CREATE POLICY "Admin Only Site Settings"
ON public.site_settings
FOR ALL
TO authenticated
USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
)
WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

-- =========================================================
-- 6. STORAGE BUCKETS
-- =========================================================

INSERT INTO storage.buckets (id, name, public)
VALUES
    ('portfolio-images', 'portfolio-images', true),
    ('portfolio-albums', 'portfolio-albums', true),
    ('portfolio-memories', 'portfolio-memories', true),
    ('portfolio-projects', 'portfolio-projects', true)
ON CONFLICT (id)
DO UPDATE SET public = true;

-- =========================================================
-- 7. STORAGE POLICIES
-- =========================================================

DROP POLICY IF EXISTS "Public can view portfolio storage"
ON storage.objects;

DROP POLICY IF EXISTS "Admin can upload portfolio storage"
ON storage.objects;

DROP POLICY IF EXISTS "Admin can update portfolio storage"
ON storage.objects;

DROP POLICY IF EXISTS "Admin can delete portfolio storage"
ON storage.objects;

CREATE POLICY "Public can view portfolio storage"
ON storage.objects
FOR SELECT
TO public
USING (
    bucket_id IN (
        'portfolio-images',
        'portfolio-albums',
        'portfolio-memories',
        'portfolio-projects'
    )
);

CREATE POLICY "Admin can upload portfolio storage"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id IN (
        'portfolio-images',
        'portfolio-albums',
        'portfolio-memories',
        'portfolio-projects'
    )
    AND
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

CREATE POLICY "Admin can update portfolio storage"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
    bucket_id IN (
        'portfolio-images',
        'portfolio-albums',
        'portfolio-memories',
        'portfolio-projects'
    )
    AND
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
)
WITH CHECK (
    bucket_id IN (
        'portfolio-images',
        'portfolio-albums',
        'portfolio-memories',
        'portfolio-projects'
    )
    AND
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

CREATE POLICY "Admin can delete portfolio storage"
ON storage.objects
FOR DELETE
TO authenticated
USING (
    bucket_id IN (
        'portfolio-images',
        'portfolio-albums',
        'portfolio-memories',
        'portfolio-projects'
    )
    AND
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

-- =========================================================
-- DONE
-- =========================================================

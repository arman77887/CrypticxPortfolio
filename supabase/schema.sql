-- ENABLE EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
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

-- 2. MEMORIES TABLE
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

-- 3. ALBUMS TABLE
CREATE TABLE IF NOT EXISTS public.albums (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title_en TEXT NOT NULL,
    title_bn TEXT NOT NULL,
    description_en TEXT,
    description_bn TEXT,
    cover_image TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. ALBUM PHOTOS TABLE
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

-- 5. EXPERIENCES TABLE
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

-- 6. JOURNEY TIMELINE TABLE
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

-- 7. PROJECTS (CRYPTICX) TABLE
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

-- 8. SOCIAL LINKS TABLE
CREATE TABLE IF NOT EXISTS public.social_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform TEXT NOT NULL UNIQUE,
    url TEXT NOT NULL,
    sort_order INT DEFAULT 0
);

-- 9. CONTACT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL
);

-- ROW LEVEL SECURITY (RLS) POLICIES
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

-- Public Read Policies
CREATE POLICY "Public Read Profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public Read Memories" ON public.memories FOR SELECT USING (true);
CREATE POLICY "Public Read Albums" ON public.albums FOR SELECT USING (true);
CREATE POLICY "Public Read Album Photos" ON public.album_photos FOR SELECT USING (true);
CREATE POLICY "Public Read Experiences" ON public.experiences FOR SELECT USING (true);
CREATE POLICY "Public Read Journey" ON public.journey FOR SELECT USING (true);
CREATE POLICY "Public Read Projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public Read Social Links" ON public.social_links FOR SELECT USING (true);
CREATE POLICY "Public Read Site Settings" ON public.site_settings FOR SELECT USING (true);

-- Contact Form Insert Policy for Public
CREATE POLICY "Public Insert Contact Messages" ON public.contact_messages FOR INSERT WITH CHECK (true);

-- Authenticated Admin Policies (Full Access)
CREATE POLICY "Admin All Profiles" ON public.profiles FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin All Memories" ON public.memories FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin All Albums" ON public.albums FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin All Album Photos" ON public.album_photos FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin All Experiences" ON public.experiences FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin All Journey" ON public.journey FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin All Projects" ON public.projects FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin All Social Links" ON public.social_links FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin All Messages" ON public.contact_messages FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin All Site Settings" ON public.site_settings FOR ALL TO authenticated USING (true);

-- STORAGE BUCKET SETUP INSTRUCTIONS (Execute in Supabase Storage UI or SQL if supported):
-- 1. Create buckets: 'portfolio-images', 'portfolio-albums', 'portfolio-memories', 'portfolio-projects'
-- 2. Make buckets public for read access.

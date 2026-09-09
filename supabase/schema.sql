-- ST. BERCHMANS COLLEGE — DEPARTMENT OF AI & DATA SCIENCE
-- PostgreSQL Schema & Row Level Security (RLS) for Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'faculty', 'admin')),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Students Table
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  roll_no VARCHAR(50) UNIQUE NOT NULL,
  batch VARCHAR(100) NOT NULL,
  blood_group VARCHAR(10),
  linkedin_url TEXT,
  portfolio_url TEXT,
  skills TEXT[] DEFAULT '{}',
  wings TEXT[] DEFAULT '{}', -- nss, ncc, tech_team, media_team, sports
  bio TEXT,
  approval_status VARCHAR(20) DEFAULT 'approved' CHECK (approval_status IN ('approved', 'pending', 'rejected')),
  pending_changes JSONB, -- stores edits awaiting admin approval
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Faculty Table
CREATE TABLE IF NOT EXISTS public.faculty (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  designation TEXT NOT NULL,
  qualification TEXT NOT NULL,
  specialization TEXT NOT NULL,
  experience TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  photo TEXT,
  research_interests TEXT[] DEFAULT '{}',
  portfolio_url TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'completed')),
  team_members TEXT[] DEFAULT '{}',
  tech_stack TEXT[] DEFAULT '{}',
  image_url TEXT,
  demo_url TEXT,
  github_url TEXT,
  documentation_url TEXT,
  submitted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  is_approved BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Project Ratings & Comments Table
CREATE TABLE IF NOT EXISTS public.project_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  user_name TEXT NOT NULL,
  user_role VARCHAR(20) DEFAULT 'student',
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Events Table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  venue TEXT NOT NULL,
  organizer TEXT NOT NULL,
  registration_url TEXT,
  poster_url TEXT,
  guest_speaker TEXT,
  status VARCHAR(20) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Achievements Table
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  achievement_date DATE NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  tagged_student_ids UUID[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Syllabus Table
CREATE TABLE IF NOT EXISTS public.syllabus (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  programme TEXT NOT NULL,
  academic_year VARCHAR(50) NOT NULL,
  semester INT,
  file_url TEXT NOT NULL,
  file_size VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Lecture Notes Table
CREATE TABLE IF NOT EXISTS public.lecture_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  semester INT NOT NULL,
  academic_year VARCHAR(50) NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_size VARCHAR(20),
  uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  download_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. Announcements Table
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  title_ml TEXT,
  category VARCHAR(50) DEFAULT 'general',
  content TEXT NOT NULL,
  link TEXT,
  is_urgent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lecture_notes ENABLE ROW LEVEL SECURITY;

-- Public can read approved records
CREATE POLICY "Public can view approved projects" ON public.projects FOR SELECT USING (is_approved = true);
CREATE POLICY "Public can view approved students" ON public.students FOR SELECT USING (approval_status = 'approved');
CREATE POLICY "Public can view approved comments" ON public.project_comments FOR SELECT USING (is_approved = true);

-- Students can edit their own profiles
CREATE POLICY "Students can update own profile" ON public.students FOR UPDATE USING (auth.uid() = profile_id);

-- Admins full access
CREATE POLICY "Admins full access profiles" ON public.profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins full access projects" ON public.projects FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

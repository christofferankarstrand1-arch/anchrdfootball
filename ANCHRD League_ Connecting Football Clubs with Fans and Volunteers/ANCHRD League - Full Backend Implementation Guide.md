# ANCHRD League - Full Backend Implementation Guide

**Version:** 1.0  
**Date:** October 2, 2025  
**Estimated Time:** 80-120 hours (2-3 months part-time)  
**Stack:** Supabase + React + Stripe + Resend

---

## TABLE OF CONTENTS

1. [Overview](#overview)
2. [Phase 1: Supabase Setup](#phase-1-supabase-setup)
3. [Phase 2: Authentication System](#phase-2-authentication-system)
4. [Phase 3: Database & Storage](#phase-3-database--storage)
5. [Phase 4: Job Posting System](#phase-4-job-posting-system)
6. [Phase 5: Application System](#phase-5-application-system)
7. [Phase 6: User Profiles](#phase-6-user-profiles)
8. [Phase 7: Stripe Integration](#phase-7-stripe-integration)
9. [Phase 8: Email System](#phase-8-email-system)
10. [Phase 9: Real-time Features](#phase-9-real-time-features)
11. [Phase 10: Testing & Deployment](#phase-10-testing--deployment)

---

## OVERVIEW

This guide provides complete, step-by-step instructions for implementing a production-ready backend for ANCHRD League.

### Technology Stack

- **Frontend:** React 18 + Vite + Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth + Storage + Realtime)
- **Payments:** Stripe
- **Email:** Resend
- **Hosting:** Vercel / Netlify / Manus Deploy

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Stripe account
- Resend account
- Git

---

## PHASE 1: SUPABASE SETUP

**Time:** 2-3 hours

### Step 1.1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create new organization: "ANCHRD League"
4. Create new project:
   - **Name:** anchrd-league-prod
   - **Database Password:** (generate strong password, save securely)
   - **Region:** North Europe (Stockholm)
   - **Pricing Plan:** Free (upgrade to Pro when needed)

5. Wait for project to be provisioned (~2 minutes)

### Step 1.2: Get API Keys

1. Go to Project Settings → API
2. Copy and save:
   - **Project URL:** `https://xxxxx.supabase.co`
   - **anon/public key:** `eyJhbGc...`
   - **service_role key:** `eyJhbGc...` (keep secret!)

### Step 1.3: Install Supabase Client

```bash
cd /home/ubuntu/anchrd-league
npm install @supabase/supabase-js
```

### Step 1.4: Create Supabase Client

Create `/src/lib/supabase.js`:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})
```

### Step 1.5: Configure Environment Variables

Create `.env.local`:

```bash
# Supabase
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...

# App
VITE_APP_URL=http://localhost:5173
```

Add to `.gitignore`:

```
.env.local
.env.production
```

---

## PHASE 2: AUTHENTICATION SYSTEM

**Time:** 8-10 hours

### Step 2.1: Create Database Schema

In Supabase Dashboard → SQL Editor, run:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('job_seeker', 'club')),
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Common fields
  full_name VARCHAR(255),
  phone VARCHAR(50),
  avatar_url TEXT,
  
  -- Job seeker specific
  bio TEXT,
  location VARCHAR(255),
  skills TEXT[],
  experience_years INTEGER,
  linkedin_url TEXT,
  portfolio_url TEXT,
  cv_url TEXT,
  
  -- Club specific
  club_name VARCHAR(255),
  club_description TEXT,
  club_logo_url TEXT,
  club_location VARCHAR(255),
  club_division VARCHAR(100),
  club_website TEXT,
  contact_person VARCHAR(255),
  subscription_tier VARCHAR(20) DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
  subscription_status VARCHAR(20) DEFAULT 'active',
  subscription_ends_at TIMESTAMP WITH TIME ZONE,
  stripe_customer_id VARCHAR(255),
  
  -- Metadata
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  last_login_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes
CREATE INDEX idx_profiles_user_type ON profiles(user_type);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_club_name ON profiles(club_name);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Profiles are viewable by everyone" 
  ON profiles FOR SELECT 
  USING (true);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, user_type, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'job_seeker'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Step 2.2: Create Auth Context

Create `/src/contexts/AuthContext.jsx`:

```javascript
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const signUp = async ({ email, password, userType, fullName }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          user_type: userType,
          full_name: fullName
        }
      }
    })
    return { data, error }
  }

  const signIn = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const updateProfile = async (updates) => {
    if (!user) return { error: new Error('No user logged in') }

    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', user.id)
      .select()
      .single()

    if (!error) {
      setProfile(data)
    }

    return { data, error }
  }

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    isClub: profile?.user_type === 'club',
    isJobSeeker: profile?.user_type === 'job_seeker'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
```

### Step 2.3: Create Auth Components

Create `/src/components/auth/SignUpForm.jsx`:

```javascript
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SignUpForm() {
  const { signUp } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    userType: 'job_seeker'
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await signUp(formData)

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      // Success - redirect or show success message
      alert('Registrering lyckades! Kolla din email för att verifiera ditt konto.')
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Skapa konto</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <Label>Jag är en...</Label>
            <div className="flex gap-4 mt-2">
              <Button
                type="button"
                variant={formData.userType === 'job_seeker' ? 'default' : 'outline'}
                onClick={() => setFormData({ ...formData, userType: 'job_seeker' })}
              >
                Jobbsökande
              </Button>
              <Button
                type="button"
                variant={formData.userType === 'club' ? 'default' : 'outline'}
                onClick={() => setFormData({ ...formData, userType: 'club' })}
              >
                Klubb
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="fullName">
              {formData.userType === 'club' ? 'Klubbnamn' : 'Fullständigt namn'}
            </Label>
            <Input
              id="fullName"
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="password">Lösenord</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <p className="text-xs text-gray-500 mt-1">Minst 6 tecken</p>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Skapar konto...' : 'Skapa konto'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
```

Create `/src/components/auth/SignInForm.jsx`:

```javascript
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SignInForm() {
  const { signIn } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await signIn(formData)

    if (error) {
      setError(error.message)
      setLoading(false)
    }
    // Success handled by AuthContext
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Logga in</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="password">Lösenord</Label>
            <Input
              id="password"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Loggar in...' : 'Logga in'}
          </Button>

          <div className="text-center">
            <a href="/reset-password" className="text-sm text-blue-600 hover:underline">
              Glömt lösenord?
            </a>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
```

### Step 2.4: Add Protected Routes

Create `/src/components/ProtectedRoute.jsx`:

```javascript
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export default function ProtectedRoute({ children, requireClub = false }) {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B4332] mx-auto"></div>
          <p className="mt-4 text-gray-600">Laddar...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (requireClub && profile?.user_type !== 'club') {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
```

---

## PHASE 3: DATABASE & STORAGE

**Time:** 6-8 hours

### Step 3.1: Create Jobs Table

In Supabase SQL Editor:

```sql
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Job details
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('matchday', 'volunteer', 'professional', 'strategic')),
  employment_type VARCHAR(50) NOT NULL CHECK (employment_type IN ('full_time', 'part_time', 'hourly', 'volunteer', 'consultant')),
  
  -- Location
  location VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  remote_possible BOOLEAN DEFAULT FALSE,
  
  -- Compensation
  salary_min INTEGER,
  salary_max INTEGER,
  salary_currency VARCHAR(10) DEFAULT 'SEK',
  hourly_rate INTEGER,
  
  -- Requirements
  requirements TEXT[],
  skills_required TEXT[],
  experience_required VARCHAR(100),
  
  -- Timing
  start_date DATE,
  end_date DATE,
  application_deadline DATE,
  hours_per_week INTEGER,
  
  -- Status
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('draft', 'active', 'paused', 'closed', 'filled')),
  is_featured BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  views_count INTEGER DEFAULT 0,
  applications_count INTEGER DEFAULT 0
);

-- Indexes
CREATE INDEX idx_jobs_club_id ON jobs(club_id);
CREATE INDEX idx_jobs_category ON jobs(category);
CREATE INDEX idx_jobs_city ON jobs(city);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_created_at ON jobs(created_at DESC);

-- Full-text search
CREATE INDEX idx_jobs_search ON jobs USING GIN (
  to_tsvector('swedish', title || ' ' || description)
);

-- RLS
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active jobs are viewable by everyone" 
  ON jobs FOR SELECT 
  USING (status = 'active' OR club_id = auth.uid());

CREATE POLICY "Clubs can insert own jobs" 
  ON jobs FOR INSERT 
  WITH CHECK (club_id = auth.uid());

CREATE POLICY "Clubs can update own jobs" 
  ON jobs FOR UPDATE 
  USING (club_id = auth.uid());

CREATE POLICY "Clubs can delete own jobs" 
  ON jobs FOR DELETE 
  USING (club_id = auth.uid());
```

### Step 3.2: Create Applications Table

```sql
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  applicant_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Application details
  cover_letter TEXT,
  cv_url TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'shortlisted', 'interview', 'offer', 'accepted', 'rejected', 'withdrawn')),
  
  -- Club response
  club_notes TEXT,
  club_rating INTEGER CHECK (club_rating >= 1 AND club_rating <= 5),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES profiles(id),
  
  -- Metadata
  is_read BOOLEAN DEFAULT FALSE,
  
  UNIQUE(job_id, applicant_id)
);

-- Indexes
CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_applicant_id ON applications(applicant_id);
CREATE INDEX idx_applications_status ON applications(status);

-- RLS
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own applications" 
  ON applications FOR SELECT 
  USING (
    applicant_id = auth.uid() OR 
    job_id IN (SELECT id FROM jobs WHERE club_id = auth.uid())
  );

CREATE POLICY "Job seekers can apply" 
  ON applications FOR INSERT 
  WITH CHECK (applicant_id = auth.uid());

CREATE POLICY "Users can update own applications" 
  ON applications FOR UPDATE 
  USING (applicant_id = auth.uid());

CREATE POLICY "Clubs can update applications for their jobs" 
  ON applications FOR UPDATE 
  USING (job_id IN (SELECT id FROM jobs WHERE club_id = auth.uid()));

-- Trigger to update application count
CREATE OR REPLACE FUNCTION update_application_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE jobs 
    SET applications_count = applications_count + 1 
    WHERE id = NEW.job_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE jobs 
    SET applications_count = applications_count - 1 
    WHERE id = OLD.job_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_application_count_trigger
AFTER INSERT OR DELETE ON applications
FOR EACH ROW EXECUTE FUNCTION update_application_count();
```

### Step 3.3: Setup Storage Buckets

In Supabase Dashboard → Storage:

1. **Create bucket: `avatars`**
   - Public: Yes
   - File size limit: 2MB
   - Allowed MIME types: image/jpeg, image/png, image/webp

2. **Create bucket: `club-logos`**
   - Public: Yes
   - File size limit: 5MB
   - Allowed MIME types: image/jpeg, image/png, image/svg+xml, image/webp

3. **Create bucket: `cvs`**
   - Public: No
   - File size limit: 10MB
   - Allowed MIME types: application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document

### Step 3.4: Create Storage Policies

For each bucket, add RLS policies in SQL Editor:

```sql
-- Avatars bucket policies
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Club logos bucket policies
CREATE POLICY "Club logos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'club-logos');

CREATE POLICY "Clubs can upload their own logo"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'club-logos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- CVs bucket policies (private)
CREATE POLICY "Users can access their own CVs"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'cvs' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can upload their own CV"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'cvs' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

---

## PHASE 4: JOB POSTING SYSTEM

**Time:** 10-12 hours

### Step 4.1: Create Job Service

Create `/src/services/jobService.js`:

```javascript
import { supabase } from '@/lib/supabase'

export const jobService = {
  // Get all active jobs with filters
  async getJobs({ category, city, search, limit = 50, offset = 0 }) {
    let query = supabase
      .from('jobs')
      .select(`
        *,
        club:profiles!club_id(
          club_name,
          club_logo_url,
          club_location
        )
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    if (city && city !== 'all') {
      query = query.eq('city', city)
    }

    if (search) {
      query = query.textSearch('title', search, {
        type: 'websearch',
        config: 'swedish'
      })
    }

    const { data, error, count } = await query

    return { data, error, count }
  },

  // Get single job
  async getJob(id) {
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        club:profiles!club_id(
          id,
          club_name,
          club_logo_url,
          club_location,
          club_description,
          club_website
        )
      `)
      .eq('id', id)
      .single()

    // Increment view count
    if (data) {
      await supabase.rpc('increment_job_views', { job_id: id })
    }

    return { data, error }
  },

  // Create job (clubs only)
  async createJob(jobData) {
    const { data, error } = await supabase
      .from('jobs')
      .insert([jobData])
      .select()
      .single()

    return { data, error }
  },

  // Update job
  async updateJob(id, updates) {
    const { data, error } = await supabase
      .from('jobs')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    return { data, error }
  },

  // Delete job
  async deleteJob(id) {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id)

    return { error }
  },

  // Get jobs by club
  async getClubJobs(clubId) {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('club_id', clubId)
      .order('created_at', { ascending: false })

    return { data, error }
  }
}
```

### Step 4.2: Create Job Form Component

Create `/src/components/jobs/JobForm.jsx`:

```javascript
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { jobService } from '@/services/jobService'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function JobForm({ job = null, onSuccess }) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    title: job?.title || '',
    description: job?.description || '',
    category: job?.category || 'professional',
    employment_type: job?.employment_type || 'full_time',
    location: job?.location || '',
    city: job?.city || '',
    remote_possible: job?.remote_possible || false,
    salary_min: job?.salary_min || '',
    salary_max: job?.salary_max || '',
    hourly_rate: job?.hourly_rate || '',
    requirements: job?.requirements?.join('\n') || '',
    skills_required: job?.skills_required?.join(', ') || '',
    experience_required: job?.experience_required || '',
    start_date: job?.start_date || '',
    application_deadline: job?.application_deadline || '',
    hours_per_week: job?.hours_per_week || '',
    status: job?.status || 'active'
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Prepare data
    const jobData = {
      ...formData,
      club_id: user.id,
      requirements: formData.requirements.split('\n').filter(r => r.trim()),
      skills_required: formData.skills_required.split(',').map(s => s.trim()).filter(s => s),
      salary_min: formData.salary_min ? parseInt(formData.salary_min) : null,
      salary_max: formData.salary_max ? parseInt(formData.salary_max) : null,
      hourly_rate: formData.hourly_rate ? parseInt(formData.hourly_rate) : null,
      hours_per_week: formData.hours_per_week ? parseInt(formData.hours_per_week) : null
    }

    let result
    if (job) {
      result = await jobService.updateJob(job.id, jobData)
    } else {
      result = await jobService.createJob(jobData)
    }

    if (result.error) {
      setError(result.error.message)
      setLoading(false)
    } else {
      onSuccess?.(result.data)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{job ? 'Redigera annons' : 'Skapa ny annons'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <Label htmlFor="title">Jobbtitel *</Label>
            <Input
              id="title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="t.ex. Social Media Manager"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Beskrivning *</Label>
            <Textarea
              id="description"
              required
              rows={6}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Beskriv rollen, ansvar och vad ni söker..."
            />
          </div>

          {/* Category */}
          <div>
            <Label htmlFor="category">Kategori *</Label>
            <select
              id="category"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="matchday">Matchdag</option>
              <option value="volunteer">Volontär</option>
              <option value="professional">Professionell</option>
              <option value="strategic">Strategisk</option>
            </select>
          </div>

          {/* Employment Type */}
          <div>
            <Label htmlFor="employment_type">Anställningsform *</Label>
            <select
              id="employment_type"
              required
              value={formData.employment_type}
              onChange={(e) => setFormData({ ...formData, employment_type: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="full_time">Heltid</option>
              <option value="part_time">Deltid</option>
              <option value="hourly">Timanställning</option>
              <option value="volunteer">Volontär</option>
              <option value="consultant">Konsult</option>
            </select>
          </div>

          {/* Location */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Plats *</Label>
              <Input
                id="location"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="t.ex. Tele2 Arena, Stockholm"
              />
            </div>
            <div>
              <Label htmlFor="city">Stad *</Label>
              <Input
                id="city"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="t.ex. Stockholm"
              />
            </div>
          </div>

          {/* Compensation */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="salary_min">Lön från (SEK/mån)</Label>
              <Input
                id="salary_min"
                type="number"
                value={formData.salary_min}
                onChange={(e) => setFormData({ ...formData, salary_min: e.target.value })}
                placeholder="25000"
              />
            </div>
            <div>
              <Label htmlFor="salary_max">Lön till (SEK/mån)</Label>
              <Input
                id="salary_max"
                type="number"
                value={formData.salary_max}
                onChange={(e) => setFormData({ ...formData, salary_max: e.target.value })}
                placeholder="35000"
              />
            </div>
            <div>
              <Label htmlFor="hourly_rate">Timlön (SEK)</Label>
              <Input
                id="hourly_rate"
                type="number"
                value={formData.hourly_rate}
                onChange={(e) => setFormData({ ...formData, hourly_rate: e.target.value })}
                placeholder="180"
              />
            </div>
          </div>

          {/* Requirements */}
          <div>
            <Label htmlFor="requirements">Krav (en per rad)</Label>
            <Textarea
              id="requirements"
              rows={4}
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
              placeholder="Erfarenhet av sociala medier&#10;Goda kunskaper i svenska och engelska&#10;Körkort B"
            />
          </div>

          {/* Skills */}
          <div>
            <Label htmlFor="skills_required">Kompetenser (kommaseparerade)</Label>
            <Input
              id="skills_required"
              value={formData.skills_required}
              onChange={(e) => setFormData({ ...formData, skills_required: e.target.value })}
              placeholder="Photoshop, Premiere Pro, Instagram, TikTok"
            />
          </div>

          {/* Dates */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="start_date">Startdatum</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="application_deadline">Sista ansökningsdag</Label>
              <Input
                id="application_deadline"
                type="date"
                value={formData.application_deadline}
                onChange={(e) => setFormData({ ...formData, application_deadline: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="hours_per_week">Timmar/vecka</Label>
              <Input
                id="hours_per_week"
                type="number"
                value={formData.hours_per_week}
                onChange={(e) => setFormData({ ...formData, hours_per_week: e.target.value })}
                placeholder="40"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="draft">Utkast</option>
              <option value="active">Aktiv</option>
              <option value="paused">Pausad</option>
              <option value="closed">Stängd</option>
            </select>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Sparar...' : (job ? 'Uppdatera annons' : 'Publicera annons')}
            </Button>
            {job && (
              <Button type="button" variant="outline" onClick={() => onSuccess?.(null)}>
                Avbryt
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
```

---

## PHASE 5: APPLICATION SYSTEM

**Time:** 8-10 hours

### Step 5.1: Create Application Service

Create `/src/services/applicationService.js`:

```javascript
import { supabase } from '@/lib/supabase'

export const applicationService = {
  // Create application
  async createApplication({ jobId, coverLetter, cvUrl }) {
    const { data: { user } } = await supabase.auth.getUser()
    
    const { data, error } = await supabase
      .from('applications')
      .insert([{
        job_id: jobId,
        applicant_id: user.id,
        cover_letter: coverLetter,
        cv_url: cvUrl
      }])
      .select(`
        *,
        job:jobs(*),
        applicant:profiles!applicant_id(*)
      `)
      .single()

    return { data, error }
  },

  // Get user's applications
  async getMyApplications() {
    const { data: { user } } = await supabase.auth.getUser()
    
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        job:jobs(
          *,
          club:profiles!club_id(club_name, club_logo_url)
        )
      `)
      .eq('applicant_id', user.id)
      .order('created_at', { ascending: false })

    return { data, error }
  },

  // Get applications for a job (clubs only)
  async getJobApplications(jobId) {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        applicant:profiles!applicant_id(
          full_name,
          email,
          phone,
          avatar_url,
          bio,
          location,
          skills,
          experience_years,
          linkedin_url,
          portfolio_url
        )
      `)
      .eq('job_id', jobId)
      .order('created_at', { ascending: false })

    return { data, error }
  },

  // Update application status (clubs only)
  async updateApplicationStatus(applicationId, status, notes = null) {
    const { data: { user } } = await supabase.auth.getUser()
    
    const updates = {
      status,
      reviewed_at: new Date().toISOString(),
      reviewed_by: user.id,
      is_read: true
    }

    if (notes) {
      updates.club_notes = notes
    }

    const { data, error } = await supabase
      .from('applications')
      .update(updates)
      .eq('id', applicationId)
      .select()
      .single()

    return { data, error }
  },

  // Withdraw application
  async withdrawApplication(applicationId) {
    const { data, error } = await supabase
      .from('applications')
      .update({ status: 'withdrawn' })
      .eq('id', applicationId)
      .select()
      .single()

    return { data, error }
  },

  // Check if user has applied
  async hasApplied(jobId) {
    const { data: { user } } = await supabase.auth.getUser()
    
    const { data, error } = await supabase
      .from('applications')
      .select('id')
      .eq('job_id', jobId)
      .eq('applicant_id', user.id)
      .single()

    return { hasApplied: !!data, error }
  }
}
```

### Step 5.2: Create Application Form Component

Create `/src/components/applications/ApplicationForm.jsx`:

```javascript
import { useState } from 'react'
import { applicationService } from '@/services/applicationService'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ApplicationForm({ job, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [coverLetter, setCoverLetter] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data, error: submitError } = await applicationService.createApplication({
      jobId: job.id,
      coverLetter
    })

    if (submitError) {
      setError(submitError.message)
      setLoading(false)
    } else {
      onSuccess?.(data)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ansök på {job.title}</CardTitle>
        <p className="text-sm text-gray-600">{job.club.club_name}</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <Label htmlFor="coverLetter">Personligt brev *</Label>
            <Textarea
              id="coverLetter"
              required
              rows={8}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Berätta varför du är rätt person för detta jobb..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Tips: Beskriv din erfarenhet, motivation och vad du kan bidra med
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>OBS:</strong> Din profil och CV kommer att delas med klubben när du ansöker.
            </p>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Skickar ansökan...' : 'Skicka ansökan'}
            </Button>
            <Button type="button" variant="outline" onClick={() => onSuccess?.(null)}>
              Avbryt
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
```

---

## PHASE 6: USER PROFILES

**Time:** 6-8 hours

### Step 6.1: Create Profile Components

Create `/src/components/profile/ProfileForm.jsx`:

```javascript
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ProfileForm() {
  const { profile, updateProfile, isClub } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    bio: profile?.bio || '',
    location: profile?.location || '',
    skills: profile?.skills?.join(', ') || '',
    experience_years: profile?.experience_years || '',
    linkedin_url: profile?.linkedin_url || '',
    portfolio_url: profile?.portfolio_url || '',
    club_name: profile?.club_name || '',
    club_description: profile?.club_description || '',
    club_location: profile?.club_location || '',
    club_division: profile?.club_division || '',
    club_website: profile?.club_website || '',
    contact_person: profile?.contact_person || ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    const updates = { ...formData }
    
    if (!isClub && formData.skills) {
      updates.skills = formData.skills.split(',').map(s => s.trim()).filter(s => s)
    }

    if (formData.experience_years) {
      updates.experience_years = parseInt(formData.experience_years)
    }

    const { error: updateError } = await updateProfile(updates)

    if (updateError) {
      setError(updateError.message)
    } else {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }

    setLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Min profil</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm">
              Profilen har uppdaterats!
            </div>
          )}

          {isClub ? (
            <>
              <div>
                <Label htmlFor="club_name">Klubbnamn *</Label>
                <Input
                  id="club_name"
                  required
                  value={formData.club_name}
                  onChange={(e) => setFormData({ ...formData, club_name: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="club_description">Beskrivning</Label>
                <Textarea
                  id="club_description"
                  rows={4}
                  value={formData.club_description}
                  onChange={(e) => setFormData({ ...formData, club_description: e.target.value })}
                  placeholder="Berätta om er klubb..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="club_location">Plats</Label>
                  <Input
                    id="club_location"
                    value={formData.club_location}
                    onChange={(e) => setFormData({ ...formData, club_location: e.target.value })}
                    placeholder="Stockholm"
                  />
                </div>
                <div>
                  <Label htmlFor="club_division">Division</Label>
                  <Input
                    id="club_division"
                    value={formData.club_division}
                    onChange={(e) => setFormData({ ...formData, club_division: e.target.value })}
                    placeholder="Allsvenskan"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="club_website">Hemsida</Label>
                <Input
                  id="club_website"
                  type="url"
                  value={formData.club_website}
                  onChange={(e) => setFormData({ ...formData, club_website: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact_person">Kontaktperson</Label>
                  <Input
                    id="contact_person"
                    value={formData.contact_person}
                    onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <Label htmlFor="full_name">Fullständigt namn *</Label>
                <Input
                  id="full_name"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="bio">Om mig</Label>
                <Textarea
                  id="bio"
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Berätta lite om dig själv..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Plats</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Stockholm"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="skills">Kompetenser (kommaseparerade)</Label>
                <Input
                  id="skills"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  placeholder="Photoshop, Premiere Pro, Instagram"
                />
              </div>

              <div>
                <Label htmlFor="experience_years">År av erfarenhet</Label>
                <Input
                  id="experience_years"
                  type="number"
                  value={formData.experience_years}
                  onChange={(e) => setFormData({ ...formData, experience_years: e.target.value })}
                  placeholder="5"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="linkedin_url">LinkedIn</Label>
                  <Input
                    id="linkedin_url"
                    type="url"
                    value={formData.linkedin_url}
                    onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
                <div>
                  <Label htmlFor="portfolio_url">Portfolio</Label>
                  <Input
                    id="portfolio_url"
                    type="url"
                    value={formData.portfolio_url}
                    onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>
            </>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Sparar...' : 'Spara ändringar'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
```

---

## PHASE 7: STRIPE INTEGRATION

**Time:** 10-12 hours

### Step 7.1: Setup Stripe

1. Create Stripe account at [stripe.com](https://stripe.com)
2. Get API keys from Dashboard → Developers → API keys
3. Install Stripe:

```bash
npm install @stripe/stripe-js
```

### Step 7.2: Create Stripe Products & Prices

In Stripe Dashboard → Products:

**Product 1: ANCHRD Pro**
- Price: 1495 SEK/month
- Recurring: Monthly
- Copy Price ID: `price_xxx`

**Product 2: ANCHRD Enterprise**
- Price: 4995 SEK/month
- Recurring: Monthly
- Copy Price ID: `price_yyy`

### Step 7.3: Create Checkout Function

Create Supabase Edge Function for Stripe checkout:

```bash
# In Supabase Dashboard → Edge Functions → New Function
# Name: create-checkout-session
```

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@12.0.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
  apiVersion: '2023-10-16',
})

serve(async (req) => {
  try {
    const { priceId, clubId } = await req.json()

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${Deno.env.get('APP_URL')}/dashboard?success=true`,
      cancel_url: `${Deno.env.get('APP_URL')}/pricing?canceled=true`,
      client_reference_id: clubId,
      metadata: {
        club_id: clubId,
      },
    })

    return new Response(
      JSON.stringify({ sessionId: session.id }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
```

### Step 7.4: Create Subscription Component

Create `/src/components/subscription/PricingCard.jsx`:

```javascript
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { loadStripe } from '@stripe/stripe-js'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Check } from 'lucide-react'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

export default function PricingCard({ tier, price, priceId, features }) {
  const { user, profile } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async () => {
    if (!user) {
      // Redirect to signup
      window.location.href = '/signup?type=club'
      return
    }

    setLoading(true)

    try {
      // Call Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { priceId, clubId: user.id }
      })

      if (error) throw error

      // Redirect to Stripe Checkout
      const stripe = await stripePromise
      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId: data.sessionId
      })

      if (stripeError) throw stripeError
    } catch (error) {
      console.error('Error:', error)
      alert('Något gick fel. Försök igen.')
    } finally {
      setLoading(false)
    }
  }

  const isCurrentPlan = profile?.subscription_tier === tier.toLowerCase()

  return (
    <Card className={isCurrentPlan ? 'border-2 border-[#1B4332]' : ''}>
      <CardHeader>
        <CardTitle className="text-2xl">{tier}</CardTitle>
        <div className="text-4xl font-bold">
          {price} <span className="text-lg font-normal text-gray-600">SEK/mån</span>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <Button
          onClick={handleSubscribe}
          disabled={loading || isCurrentPlan}
          className="w-full"
          variant={isCurrentPlan ? 'outline' : 'default'}
        >
          {loading ? 'Laddar...' : isCurrentPlan ? 'Nuvarande plan' : 'Välj plan'}
        </Button>
      </CardContent>
    </Card>
  )
}
```

### Step 7.5: Setup Stripe Webhooks

1. In Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-project.supabase.co/functions/v1/stripe-webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

4. Create webhook handler (Supabase Edge Function):

```typescript
// stripe-webhook edge function
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@12.0.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
  apiVersion: '2023-10-16',
})

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') as string,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string
)

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  const body = await req.text()

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature!,
      Deno.env.get('STRIPE_WEBHOOK_SECRET') as string
    )

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const clubId = session.metadata.club_id

        // Update club subscription
        await supabase
          .from('profiles')
          .update({
            subscription_tier: 'pro', // or determine from price_id
            subscription_status: 'active',
            stripe_customer_id: session.customer
          })
          .eq('id', clubId)

        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object
        
        // Update subscription status
        await supabase
          .from('profiles')
          .update({
            subscription_status: subscription.status,
            subscription_ends_at: new Date(subscription.current_period_end * 1000).toISOString()
          })
          .eq('stripe_customer_id', subscription.customer)

        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        
        // Downgrade to free
        await supabase
          .from('profiles')
          .update({
            subscription_tier: 'free',
            subscription_status: 'cancelled'
          })
          .eq('stripe_customer_id', subscription.customer)

        break
      }
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400 }
    )
  }
})
```

---

## PHASE 8: EMAIL SYSTEM

**Time:** 6-8 hours

### Step 8.1: Setup Resend

1. Create account at [resend.com](https://resend.com)
2. Get API key from Dashboard
3. Verify domain (or use resend.dev for testing)

### Step 8.2: Create Email Templates

Create `/src/lib/emailTemplates.js`:

```javascript
export const emailTemplates = {
  welcome: ({ name, userType }) => ({
    subject: 'Välkommen till ANCHRD League! 🎉',
    html: `
      <h1>Hej ${name}!</h1>
      <p>Välkommen till ANCHRD League - Sveriges största marknadsplats för fotbollsjobb!</p>
      ${userType === 'club' ? `
        <h2>Kom igång:</h2>
        <ol>
          <li>Komplettera din klubbprofil</li>
          <li>Publicera din första annons</li>
          <li>Börja ta emot ansökningar</li>
        </ol>
      ` : `
        <h2>Kom igång:</h2>
        <ol>
          <li>Komplettera din profil</li>
          <li>Bläddra bland jobb</li>
          <li>Ansök på ditt drömjobb</li>
        </ol>
      `}
      <p><a href="https://anchrdleague.se/dashboard">Logga in nu</a></p>
    `
  }),

  newApplication: ({ clubName, jobTitle, applicantName, applicationUrl }) => ({
    subject: `Ny ansökan på ${jobTitle}`,
    html: `
      <h1>Ny ansökan mottagen!</h1>
      <p><strong>${applicantName}</strong> har ansökt på <strong>${jobTitle}</strong>.</p>
      <p><a href="${applicationUrl}">Granska ansökan</a></p>
    `
  }),

  applicationStatusUpdate: ({ applicantName, jobTitle, clubName, status }) => ({
    subject: 'Din ansökan har uppdaterats',
    html: `
      <h1>Hej ${applicantName}!</h1>
      <p>Din ansökan på <strong>${jobTitle}</strong> hos ${clubName} har uppdaterats.</p>
      <p>Ny status: <strong>${status}</strong></p>
      <p><a href="https://anchrdleague.se/applications">Se dina ansökningar</a></p>
    `
  })
}
```

### Step 8.3: Create Email Service

Create Supabase Edge Function for sending emails:

```typescript
// send-email edge function
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  try {
    const { to, subject, html } = await req.json()

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
      },
      body: JSON.stringify({
        from: 'ANCHRD League <noreply@anchrdleague.se>',
        to: [to],
        subject,
        html,
      }),
    })

    const data = await res.json()

    return new Response(
      JSON.stringify(data),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
```

---

## PHASE 9: REAL-TIME FEATURES

**Time:** 4-6 hours

### Step 9.1: Setup Real-time Subscriptions

Create `/src/hooks/useRealtimeApplications.js`:

```javascript
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function useRealtimeApplications(jobId) {
  const [applications, setApplications] = useState([])

  useEffect(() => {
    // Initial fetch
    fetchApplications()

    // Subscribe to changes
    const subscription = supabase
      .channel(`job-${jobId}-applications`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'applications',
          filter: `job_id=eq.${jobId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setApplications(prev => [payload.new, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setApplications(prev =>
              prev.map(app => app.id === payload.new.id ? payload.new : app)
            )
          } else if (payload.eventType === 'DELETE') {
            setApplications(prev =>
              prev.filter(app => app.id !== payload.old.id)
            )
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [jobId])

  async function fetchApplications() {
    const { data } = await supabase
      .from('applications')
      .select('*')
      .eq('job_id', jobId)
      .order('created_at', { ascending: false })

    if (data) {
      setApplications(data)
    }
  }

  return applications
}
```

---

## PHASE 10: TESTING & DEPLOYMENT

**Time:** 8-10 hours

### Step 10.1: Environment Variables

Update `.env.production`:

```bash
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...

# App
VITE_APP_URL=https://anchrdleague.se
```

### Step 10.2: Build & Deploy

```bash
# Build
npm run build

# Deploy to Vercel
vercel --prod

# Or deploy to Netlify
netlify deploy --prod

# Or use Manus Deploy
# Click "Publish" button in Manus interface
```

### Step 10.3: Post-Deployment Checklist

- [ ] Test user registration (both club and job seeker)
- [ ] Test login/logout
- [ ] Test job posting (create, edit, delete)
- [ ] Test job application
- [ ] Test profile updates
- [ ] Test file uploads (avatar, CV)
- [ ] Test Stripe checkout
- [ ] Test webhook handling
- [ ] Test email sending
- [ ] Test real-time updates
- [ ] Test mobile responsiveness
- [ ] Test accessibility (keyboard navigation, screen readers)
- [ ] Run Lighthouse audit (aim for 90+ scores)
- [ ] Setup monitoring (Sentry, LogRocket)
- [ ] Setup analytics (Google Analytics, Plausible)

---

## ESTIMATED TIMELINE

| Phase | Task | Hours |
|-------|------|-------|
| 1 | Supabase Setup | 2-3 |
| 2 | Authentication System | 8-10 |
| 3 | Database & Storage | 6-8 |
| 4 | Job Posting System | 10-12 |
| 5 | Application System | 8-10 |
| 6 | User Profiles | 6-8 |
| 7 | Stripe Integration | 10-12 |
| 8 | Email System | 6-8 |
| 9 | Real-time Features | 4-6 |
| 10 | Testing & Deployment | 8-10 |
| **TOTAL** | **Full Backend** | **80-120 hours** |

**Part-time (10 hrs/week):** 8-12 weeks  
**Full-time (40 hrs/week):** 2-3 weeks

---

## COST BREAKDOWN

### Development Costs
- **DIY (your time):** Free (but 80-120 hours)
- **Freelance developer:** 50,000-150,000 SEK
- **Agency:** 200,000-500,000 SEK

### Monthly Operating Costs
- **Supabase:** Free tier (upgrade to Pro at 25 USD/month when needed)
- **Stripe:** 1.4% + 1.80 SEK per transaction
- **Resend:** Free tier (upgrade to 20 USD/month for 50k emails)
- **Hosting:** Free (Vercel/Netlify) or 20 USD/month
- **Domain:** 100-200 SEK/year
- **Total:** ~500-1,000 SEK/month initially

---

## NEXT STEPS

1. **Decide on approach:**
   - DIY implementation (follow this guide)
   - Hire freelance developer
   - Use agency

2. **If DIY:**
   - Start with Phase 1 (Supabase Setup)
   - Work through phases sequentially
   - Test thoroughly after each phase
   - Deploy incrementally

3. **If hiring:**
   - Share this document with developer
   - Request timeline and quote
   - Set up weekly check-ins
   - Review code regularly

---

**End of Implementation Guide**

This guide provides everything needed to build a production-ready backend for ANCHRD League. Follow the phases in order, test thoroughly, and you'll have a fully functional platform!

Good luck! 🚀

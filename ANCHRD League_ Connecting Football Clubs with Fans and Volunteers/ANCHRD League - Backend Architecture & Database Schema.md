# ANCHRD League - Backend Architecture & Database Schema

**Date:** October 2, 2025  
**Version:** 1.0  
**Stack:** Supabase (PostgreSQL) + React + Stripe

---

## EXECUTIVE SUMMARY

This document outlines the complete backend architecture for ANCHRD League, including database schema, API endpoints, authentication flows, and integration points.

**Key Technologies:**
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Storage:** Supabase Storage
- **Payments:** Stripe
- **Email:** Resend
- **Frontend:** React + Vite

---

## DATABASE SCHEMA

### 1. USERS TABLE (profiles)

Stores all user profiles (both job seekers and clubs).

```sql
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
  skills TEXT[], -- Array of skills
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

-- Indexes
CREATE INDEX idx_profiles_user_type ON profiles(user_type);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_club_name ON profiles(club_name);
CREATE INDEX idx_profiles_subscription_tier ON profiles(subscription_tier);
```

---

### 2. JOBS TABLE

Stores all job postings from clubs.

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
CREATE INDEX idx_jobs_is_featured ON jobs(is_featured);

-- Full-text search
CREATE INDEX idx_jobs_search ON jobs USING GIN (
  to_tsvector('swedish', title || ' ' || description)
);
```

---

### 3. APPLICATIONS TABLE

Stores all job applications.

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
  
  -- Unique constraint: one application per job per applicant
  UNIQUE(job_id, applicant_id)
);

-- Indexes
CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_applicant_id ON applications(applicant_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_created_at ON applications(created_at DESC);
```

---

### 4. SAVED_JOBS TABLE

Stores jobs saved/bookmarked by job seekers.

```sql
CREATE TABLE saved_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Unique constraint
  UNIQUE(user_id, job_id)
);

-- Indexes
CREATE INDEX idx_saved_jobs_user_id ON saved_jobs(user_id);
CREATE INDEX idx_saved_jobs_job_id ON saved_jobs(job_id);
```

---

### 5. NOTIFICATIONS TABLE

Stores user notifications.

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Notification details
  type VARCHAR(50) NOT NULL CHECK (type IN ('new_application', 'application_status', 'new_job', 'job_expiring', 'subscription', 'message')),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  
  -- Status
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
```

---

### 6. MESSAGES TABLE

Stores direct messages between clubs and applicants.

```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Message content
  message TEXT NOT NULL,
  attachments TEXT[],
  
  -- Status
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_messages_application_id ON messages(application_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
```

---

### 7. SUBSCRIPTIONS TABLE

Stores subscription history and payments.

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Subscription details
  tier VARCHAR(20) NOT NULL CHECK (tier IN ('free', 'pro', 'enterprise')),
  status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'cancelled', 'expired', 'trialing')),
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ends_at TIMESTAMP WITH TIME ZONE,
  
  -- Stripe
  stripe_subscription_id VARCHAR(255),
  stripe_price_id VARCHAR(255),
  
  -- Pricing
  amount INTEGER NOT NULL,
  currency VARCHAR(10) DEFAULT 'SEK',
  interval VARCHAR(20) CHECK (interval IN ('month', 'year'))
);

-- Indexes
CREATE INDEX idx_subscriptions_club_id ON subscriptions(club_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);
```

---

### 8. PAYMENTS TABLE

Stores all payment transactions.

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Payment details
  amount INTEGER NOT NULL,
  currency VARCHAR(10) DEFAULT 'SEK',
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')),
  
  -- Stripe
  stripe_payment_intent_id VARCHAR(255),
  stripe_charge_id VARCHAR(255),
  
  -- Metadata
  description TEXT,
  receipt_url TEXT
);

-- Indexes
CREATE INDEX idx_payments_club_id ON payments(club_id);
CREATE INDEX idx_payments_subscription_id ON payments(subscription_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created_at ON payments(created_at DESC);
```

---

### 9. EMAIL_QUEUE TABLE

Stores emails to be sent.

```sql
CREATE TABLE email_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Email details
  to_email VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  body TEXT NOT NULL,
  template VARCHAR(100),
  
  -- Status
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  sent_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  attempts INTEGER DEFAULT 0
);

-- Indexes
CREATE INDEX idx_email_queue_status ON email_queue(status);
CREATE INDEX idx_email_queue_created_at ON email_queue(created_at);
```

---

### 10. ANALYTICS TABLE

Stores analytics events.

```sql
CREATE TABLE analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Event details
  event_type VARCHAR(100) NOT NULL,
  user_id UUID REFERENCES profiles(id),
  job_id UUID REFERENCES jobs(id),
  
  -- Metadata
  metadata JSONB,
  ip_address VARCHAR(50),
  user_agent TEXT
);

-- Indexes
CREATE INDEX idx_analytics_event_type ON analytics(event_type);
CREATE INDEX idx_analytics_user_id ON analytics(user_id);
CREATE INDEX idx_analytics_job_id ON analytics(job_id);
CREATE INDEX idx_analytics_created_at ON analytics(created_at DESC);
```

---

## ROW LEVEL SECURITY (RLS) POLICIES

### Profiles Table

```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can read all profiles
CREATE POLICY "Profiles are viewable by everyone" 
  ON profiles FOR SELECT 
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);
```

### Jobs Table

```sql
-- Enable RLS
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Everyone can read active jobs
CREATE POLICY "Active jobs are viewable by everyone" 
  ON jobs FOR SELECT 
  USING (status = 'active' OR club_id = auth.uid());

-- Clubs can insert their own jobs
CREATE POLICY "Clubs can insert own jobs" 
  ON jobs FOR INSERT 
  WITH CHECK (club_id = auth.uid());

-- Clubs can update their own jobs
CREATE POLICY "Clubs can update own jobs" 
  ON jobs FOR UPDATE 
  USING (club_id = auth.uid());

-- Clubs can delete their own jobs
CREATE POLICY "Clubs can delete own jobs" 
  ON jobs FOR DELETE 
  USING (club_id = auth.uid());
```

### Applications Table

```sql
-- Enable RLS
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Applicants can read their own applications
CREATE POLICY "Users can read own applications" 
  ON applications FOR SELECT 
  USING (applicant_id = auth.uid() OR 
         job_id IN (SELECT id FROM jobs WHERE club_id = auth.uid()));

-- Job seekers can insert applications
CREATE POLICY "Job seekers can apply" 
  ON applications FOR INSERT 
  WITH CHECK (applicant_id = auth.uid());

-- Applicants can update their own applications
CREATE POLICY "Users can update own applications" 
  ON applications FOR UPDATE 
  USING (applicant_id = auth.uid());

-- Clubs can update applications for their jobs
CREATE POLICY "Clubs can update applications for their jobs" 
  ON applications FOR UPDATE 
  USING (job_id IN (SELECT id FROM jobs WHERE club_id = auth.uid()));
```

---

## API ENDPOINTS

### Authentication

```
POST   /auth/signup           - Register new user
POST   /auth/login            - Login user
POST   /auth/logout           - Logout user
POST   /auth/reset-password   - Request password reset
POST   /auth/update-password  - Update password
GET    /auth/me               - Get current user
```

### Profiles

```
GET    /profiles/:id          - Get profile by ID
PUT    /profiles/:id          - Update profile
DELETE /profiles/:id          - Delete profile
GET    /profiles/me           - Get current user profile
POST   /profiles/upload-avatar - Upload avatar
POST   /profiles/upload-cv    - Upload CV
```

### Jobs

```
GET    /jobs                  - List all jobs (with filters)
GET    /jobs/:id              - Get job by ID
POST   /jobs                  - Create new job (clubs only)
PUT    /jobs/:id              - Update job (clubs only)
DELETE /jobs/:id              - Delete job (clubs only)
POST   /jobs/:id/view         - Increment view count
GET    /jobs/search           - Search jobs
GET    /clubs/:clubId/jobs    - Get jobs by club
```

### Applications

```
GET    /applications          - List applications (filtered by user)
GET    /applications/:id      - Get application by ID
POST   /applications          - Create new application
PUT    /applications/:id      - Update application status
DELETE /applications/:id      - Withdraw application
GET    /jobs/:jobId/applications - Get applications for a job (clubs only)
```

### Saved Jobs

```
GET    /saved-jobs            - List saved jobs
POST   /saved-jobs            - Save a job
DELETE /saved-jobs/:jobId     - Unsave a job
```

### Notifications

```
GET    /notifications         - List notifications
PUT    /notifications/:id/read - Mark as read
PUT    /notifications/read-all - Mark all as read
DELETE /notifications/:id     - Delete notification
```

### Messages

```
GET    /messages/:applicationId - Get messages for an application
POST   /messages              - Send a message
PUT    /messages/:id/read     - Mark message as read
```

### Subscriptions

```
GET    /subscriptions         - Get subscription info
POST   /subscriptions/checkout - Create Stripe checkout session
POST   /subscriptions/cancel  - Cancel subscription
POST   /subscriptions/upgrade - Upgrade subscription
GET    /subscriptions/portal  - Get Stripe customer portal URL
```

### Payments

```
GET    /payments              - List payment history
GET    /payments/:id          - Get payment by ID
POST   /webhooks/stripe       - Stripe webhook handler
```

### Analytics

```
POST   /analytics/track       - Track an event
GET    /analytics/dashboard   - Get dashboard analytics (clubs only)
```

---

## SUPABASE FUNCTIONS

### 1. Increment Job Views

```sql
CREATE OR REPLACE FUNCTION increment_job_views(job_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE jobs 
  SET views_count = views_count + 1 
  WHERE id = job_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 2. Update Application Count

```sql
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

### 3. Create Notification

```sql
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_type VARCHAR,
  p_title VARCHAR,
  p_message TEXT,
  p_link TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO notifications (user_id, type, title, message, link)
  VALUES (p_user_id, p_type, p_title, p_message, p_link)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 4. Notify Club of New Application

```sql
CREATE OR REPLACE FUNCTION notify_club_new_application()
RETURNS TRIGGER AS $$
DECLARE
  club_id UUID;
  job_title VARCHAR;
  applicant_name VARCHAR;
BEGIN
  -- Get club_id and job title
  SELECT j.club_id, j.title INTO club_id, job_title
  FROM jobs j
  WHERE j.id = NEW.job_id;
  
  -- Get applicant name
  SELECT full_name INTO applicant_name
  FROM profiles
  WHERE id = NEW.applicant_id;
  
  -- Create notification
  PERFORM create_notification(
    club_id,
    'new_application',
    'Ny ansökan mottagen',
    applicant_name || ' har ansökt på ' || job_title,
    '/applications/' || NEW.id
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER notify_club_new_application_trigger
AFTER INSERT ON applications
FOR EACH ROW EXECUTE FUNCTION notify_club_new_application();
```

---

## STORAGE BUCKETS

### 1. Avatars

```javascript
// Public bucket for profile avatars
{
  name: 'avatars',
  public: true,
  fileSizeLimit: 2MB,
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
}
```

### 2. Club Logos

```javascript
// Public bucket for club logos
{
  name: 'club-logos',
  public: true,
  fileSizeLimit: 5MB,
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp']
}
```

### 3. CVs

```javascript
// Private bucket for CVs
{
  name: 'cvs',
  public: false,
  fileSizeLimit: 10MB,
  allowedMimeTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
}
```

### 4. Attachments

```javascript
// Private bucket for message attachments
{
  name: 'attachments',
  public: false,
  fileSizeLimit: 10MB,
  allowedMimeTypes: ['image/*', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.*']
}
```

---

## STRIPE INTEGRATION

### Products & Prices

```javascript
// FREE Tier
{
  product: 'ANCHRD Free',
  price: 0 SEK,
  features: [
    '2 aktiva annonser',
    'Grundläggande sök',
    'Email-support'
  ]
}

// PRO Tier
{
  product: 'ANCHRD Pro',
  price: 1495 SEK/månad,
  features: [
    'Obegränsade annonser',
    'Prioriterad visning',
    'Avancerad analytics',
    'Kandidatsök',
    'Prioriterad support'
  ]
}

// ENTERPRISE Tier
{
  product: 'ANCHRD Enterprise',
  price: 4995 SEK/månad,
  features: [
    'Allt i Pro',
    'Dedikerad account manager',
    'API-access',
    'Custom branding',
    'SLA-garanti'
  ]
}
```

### Webhook Events

```javascript
// Handle Stripe webhooks
[
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'invoice.payment_succeeded',
  'invoice.payment_failed',
  'checkout.session.completed'
]
```

---

## EMAIL TEMPLATES (Resend)

### 1. Welcome Email

```
Subject: Välkommen till ANCHRD League! 🎉
Template: welcome-{user_type}.html
Variables: {name, user_type, login_url}
```

### 2. New Application (Club)

```
Subject: Ny ansökan på {job_title}
Template: new-application-club.html
Variables: {club_name, job_title, applicant_name, application_url}
```

### 3. Application Status Update (Job Seeker)

```
Subject: Din ansökan har uppdaterats
Template: application-status-update.html
Variables: {applicant_name, job_title, club_name, status, message}
```

### 4. New Job Alert (Job Seeker)

```
Subject: Nya jobb som matchar din profil
Template: new-job-alert.html
Variables: {name, jobs_list, unsubscribe_url}
```

### 5. Subscription Confirmation

```
Subject: Tack för ditt köp! 🎉
Template: subscription-confirmation.html
Variables: {club_name, tier, amount, billing_url}
```

---

## ENVIRONMENT VARIABLES

```bash
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend
RESEND_API_KEY=re_...

# App
VITE_APP_URL=https://anchrdleague.se
VITE_API_URL=https://api.anchrdleague.se
```

---

## NEXT STEPS

1. **Set up Supabase project**
2. **Run database migrations**
3. **Configure RLS policies**
4. **Set up Storage buckets**
5. **Integrate Supabase client in React**
6. **Build authentication flows**
7. **Implement job posting & application features**
8. **Integrate Stripe**
9. **Set up email automation**
10. **Deploy and test**

---

**End of Architecture Document**

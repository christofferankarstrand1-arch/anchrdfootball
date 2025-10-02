# ANCHRD League - Onboarding & Profile System Design

## System Overview

A complete two-sided marketplace system with separate flows for clubs and talents, including onboarding, profiles, job posting, and application management.

---

## User Types

### 1. Talents (Talanger)
Individuals seeking opportunities in football clubs:
- Volunteers
- Professionals
- Match-day workers
- Strategic advisors

### 2. Clubs (Klubbar)
Football clubs posting opportunities:
- All levels (Allsvenskan to Division 7)
- Post jobs, gigs, and sponsorship opportunities
- Review applications and hire talents

---

## Onboarding Flows

### Talent Onboarding (5 Steps)

**Step 1: Account Type Selection**
- "Är du en talang eller klubb?"
- Two large cards: "Jag är en talang" / "Jag är en klubb"

**Step 2: Basic Information**
- Namn (First & Last)
- Email
- Telefon
- Stad
- Lösenord

**Step 3: Profile Details**
- Profilbild (optional)
- Bio/Presentation (200 chars)
- Erfarenhet (Dropdown: Ingen, 1-3 år, 3-5 år, 5+ år)
- Tillgänglighet (Heltid, Deltid, Volontär, Matchdag)

**Step 4: Skills & Interests**
- Välj kompetenser (multi-select):
  - Social Media
  - Event Management
  - Coaching
  - Data Analysis
  - Marketing
  - Administration
  - Sponsorship
  - Other
- Intresseområden (Matchdag, Professionell, Volontär, Strategisk)

**Step 5: Confirmation**
- Sammanfattning av profil
- "Skapa mitt konto" button

### Club Onboarding (5 Steps)

**Step 1: Account Type Selection**
- Same as talent flow

**Step 2: Club Information**
- Klubbnamn
- Email
- Telefon
- Stad
- Division/Liga
- Lösenord

**Step 3: Club Profile**
- Klubblogotyp (upload)
- Om klubben (500 chars)
- Grundad år
- Antal medlemmar
- Hemsida (optional)

**Step 4: Contact Person**
- Kontaktperson namn
- Roll/Position
- Email
- Telefon

**Step 5: Confirmation**
- Sammanfattning av klubbprofil
- "Skapa klubbkonto" button

---

## Data Structures

### Talent Profile
```javascript
{
  id: string,
  type: 'talent',
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  city: string,
  profileImage: string | null,
  bio: string,
  experience: 'none' | '1-3' | '3-5' | '5+',
  availability: ['fulltime', 'parttime', 'volunteer', 'matchday'],
  skills: string[],
  interests: string[],
  applications: Application[],
  savedJobs: string[],
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Club Profile
```javascript
{
  id: string,
  type: 'club',
  clubName: string,
  email: string,
  phone: string,
  city: string,
  division: string,
  logo: string | null,
  about: string,
  founded: number,
  members: number,
  website: string | null,
  contactPerson: {
    name: string,
    role: string,
    email: string,
    phone: string
  },
  opportunities: Opportunity[],
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Opportunity (Job/Gig)
```javascript
{
  id: string,
  clubId: string,
  clubName: string,
  clubLogo: string,
  title: string,
  category: 'matchday' | 'professional' | 'volunteer' | 'strategic',
  type: string, // "Matchdagsuppdrag", "Professionell roll", etc.
  description: string,
  requirements: string[],
  location: string,
  city: string,
  timeCommitment: string,
  startDate: string,
  endDate: string | null,
  compensation: string | null,
  spots: number,
  applications: Application[],
  status: 'active' | 'closed' | 'draft',
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Application
```javascript
{
  id: string,
  opportunityId: string,
  talentId: string,
  talentName: string,
  talentEmail: string,
  talentPhone: string,
  coverLetter: string,
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected',
  appliedAt: timestamp,
  reviewedAt: timestamp | null
}
```

---

## Profile Pages

### Talent Profile Page

**Header Section:**
- Profile image (circular)
- Name
- City
- Availability badges
- "Redigera profil" button (if own profile)

**About Section:**
- Bio text
- Experience level
- Contact button (for clubs)

**Skills Section:**
- Skill badges in grid layout
- Color-coded by category

**Interests Section:**
- Interest badges (Matchdag, Professionell, etc.)

**Applications Section:**
- List of applied opportunities
- Status badges (Pending, Reviewed, Accepted, Rejected)
- Quick links to opportunities

**Saved Jobs Section:**
- Bookmarked opportunities
- Quick apply buttons

### Club Profile Page

**Header Section:**
- Club logo (large)
- Club name
- Division/Liga
- City
- "Redigera profil" button (if own profile)
- "Skapa uppdrag" button (if own profile)

**About Section:**
- About text
- Founded year
- Number of members
- Website link

**Contact Section:**
- Contact person details
- Email and phone
- "Kontakta oss" button

**Active Opportunities Section:**
- Grid of current job postings
- Application count on each
- "Hantera" button for club owner

**Past Opportunities Section:**
- Archive of closed positions
- Success metrics

---

## Job Posting System

### Create Opportunity Form (Clubs Only)

**Step 1: Basic Information**
- Titel
- Kategori (Dropdown: Matchdag, Professionell, Volontär, Strategisk)
- Beskrivning (Rich text, 500 chars)

**Step 2: Details**
- Plats
- Stad (Dropdown)
- Tidsåtagande (e.g., "4 timmar", "Heltid")
- Startdatum
- Slutdatum (optional)
- Antal platser

**Step 3: Requirements**
- Krav (Multi-line input, each line = requirement)
- Kompensation (optional)
- Erfarenhet krävs (Dropdown)

**Step 4: Preview & Publish**
- Preview of opportunity card
- "Publicera" or "Spara som utkast"

### Edit Opportunity
- Same form pre-filled with existing data
- "Uppdatera" or "Stäng uppdrag" buttons

---

## Application System

### Apply Flow (Talents)

**Step 1: Review Opportunity**
- Full opportunity details
- Club profile link
- "Ansök nu" button

**Step 2: Application Form**
- Pre-filled contact info from profile
- Cover letter / Personligt brev (500 chars)
- Attach CV (optional, future feature)
- "Skicka ansökan" button

**Step 3: Confirmation**
- Success message
- "Visa mina ansökningar" link
- "Fortsätt söka" button

### Manage Applications (Clubs)

**Applications Dashboard:**
- List view of all applications for an opportunity
- Filter by status (Alla, Pending, Reviewed, Accepted, Rejected)
- Sort by date

**Application Card:**
- Talent name and profile image
- Applied date
- Cover letter preview
- Action buttons:
  - "Visa profil"
  - "Markera som granskad"
  - "Acceptera"
  - "Avslå"

**Application Detail View:**
- Full talent profile
- Complete cover letter
- Application history
- Contact information
- Action buttons

---

## Navigation Structure

### Main Navigation (Logged Out)
- Hem
- Sök uppdrag
- För klubbar
- Om oss
- Logga in
- Registrera

### Talent Navigation (Logged In)
- Hem
- Sök uppdrag
- Mina ansökningar
- Sparade jobb
- Min profil
- Logga ut

### Club Navigation (Logged In)
- Hem
- Mina uppdrag
- Skapa uppdrag
- Sök talanger (future)
- Klubbprofil
- Logga ut

---

## UI Components Needed

### New Components:
1. **OnboardingWizard** - Multi-step form component
2. **ProfileCard** - User/Club profile display
3. **OpportunityForm** - Create/edit opportunity
4. **ApplicationCard** - Display application
5. **ApplicationForm** - Apply to opportunity
6. **StatusBadge** - Application status indicator
7. **SkillBadge** - Skill/interest display
8. **ImageUpload** - Profile/logo upload
9. **RichTextEditor** - For descriptions
10. **ProgressBar** - Onboarding progress

### Enhanced Components:
- **Button** - Add loading states
- **Input** - Add validation states
- **Select** - Add multi-select variant
- **Modal** - For forms and confirmations

---

## User Flows

### Talent User Flow:
1. Land on homepage
2. Click "Kom igång" or "Registrera"
3. Select "Jag är en talang"
4. Complete 5-step onboarding
5. Arrive at personalized dashboard
6. Browse opportunities
7. Apply to opportunities
8. Track applications
9. Get accepted
10. Connect with club

### Club User Flow:
1. Land on homepage
2. Click "För klubbar" or "Registrera"
3. Select "Jag är en klubb"
4. Complete 5-step onboarding
5. Arrive at club dashboard
6. Create first opportunity
7. Publish opportunity
8. Receive applications
9. Review talent profiles
10. Accept talent and connect

---

## Implementation Strategy

### Phase 1: Core Structure
- Create mock data store (localStorage)
- Build authentication flow (simplified)
- Create routing structure

### Phase 2: Onboarding
- Build OnboardingWizard component
- Implement talent onboarding
- Implement club onboarding
- Add form validation

### Phase 3: Profiles
- Build talent profile page
- Build club profile page
- Add edit profile functionality
- Implement image upload (mock)

### Phase 4: Job Posting
- Build opportunity creation form
- Add opportunity management
- Implement draft/publish functionality

### Phase 5: Applications
- Build application form
- Create application dashboard
- Implement application status management
- Add notifications (visual only)

### Phase 6: Polish
- Add loading states
- Improve error handling
- Add success messages
- Optimize responsive design

---

## Technical Considerations

### State Management:
- Use React Context for user authentication
- localStorage for mock data persistence
- useState for component-level state

### Routing:
- React Router for navigation
- Protected routes for authenticated pages
- Redirect logic based on user type

### Form Validation:
- Client-side validation
- Error messages in Swedish
- Disabled submit until valid

### Data Persistence:
- Mock backend with localStorage
- JSON structure for easy migration to real backend
- Simulate API delays for realistic UX

---

## Success Metrics

### Onboarding:
- Completion rate
- Time to complete
- Drop-off points

### Engagement:
- Applications per talent
- Opportunities per club
- Response time

### Conversion:
- Application acceptance rate
- Profile completion rate
- Return visits

---

**Document Version**: 1.0  
**Date**: October 2025  
**Status**: Design Complete - Ready for Implementation

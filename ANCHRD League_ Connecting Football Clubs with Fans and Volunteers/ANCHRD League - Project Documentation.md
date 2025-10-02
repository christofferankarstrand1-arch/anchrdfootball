# ANCHRD League - Project Documentation

## Overview

ANCHRD League is a bold, modern two-sided platform website that connects football clubs with fans, volunteers, and professionals. The platform enables clubs to post everything from quick matchday tasks to strategic roles, while talent can easily browse and apply for opportunities.

## Website Features

### Design Highlights

The website features a **bold and dynamic design** inspired by modern football aesthetics with the following characteristics:

- **Dark Theme**: Deep navy/black background (#0A1128) creating a professional, premium feel
- **Vibrant Accent Colors**: 
  - Primary green (#00FF87) representing the football pitch
  - Secondary orange/red (#FF4D00) conveying energy and passion
- **Gradient Text Effects**: Eye-catching gradient headlines
- **Hover Animations**: Cards lift and glow on hover with smooth transitions
- **Pitch Pattern Background**: Subtle grid pattern reminiscent of football field lines

### Key Sections

#### 1. Hero Section
- Compelling headline: "Där klubbar och talanger möts" (Where clubs and talents meet)
- Launch badge showing "🚀 Lansering 2025"
- Two prominent call-to-action buttons for both user types
- Gradient background with pitch pattern overlay

#### 2. Statistics Bar
- 150+ Clubs
- 2,500+ Active talents
- 800+ Opportunities
- 95% Satisfaction rate

#### 3. How It Works
Two-column layout explaining the process for both sides:

**For Clubs:**
1. Create opportunities (Skapa uppdrag)
2. Receive applications (Ta emot ansökningar)
3. Hire and collaborate (Anställ och samarbeta)

**For Talents:**
1. Create profile (Skapa profil)
2. Search opportunities (Sök uppdrag)
3. Get the job (Få jobbet)

#### 4. Current Opportunities
Interactive job board featuring:
- Category filters (All, Matchday, Volunteer, Professional, Strategic)
- 6 sample opportunities from real Swedish clubs:
  - Hammarby IF - Matchday hosts
  - Malmö FF - Social Media Manager
  - AIK - Youth coach
  - IFK Göteborg - Strategic advisor
  - Djurgårdens IF - Event coordinator
  - BK Häcken - Data analyst

Each opportunity card displays:
- Club name and shield icon
- Role title
- Category badge with color coding
- Description
- Location, time commitment, and date
- "Ansök nu" (Apply now) button

#### 5. Benefits Section
Three value propositions:
- **Enkelt & Snabbt** (Simple & Fast)
- **Bygg din karriär** (Build your career)
- **För fotbollens skull** (For football's sake)

#### 6. Call-to-Action Section
- Gradient background with primary and secondary colors
- "Redo att komma igång?" (Ready to get started?)
- Two buttons: "Skapa konto gratis" and "Läs mer"

#### 7. Footer
Comprehensive footer with:
- Brand identity
- Links for talents (Sök uppdrag, Skapa profil, Hur det fungerar)
- Links for clubs (Publicera uppdrag, Hitta talanger, Priser)
- About section (Om ANCHRD, Kontakt, Villkor)
- Copyright notice

### Navigation
Fixed top navigation bar with:
- ANCHRD League logo with shield icon
- Links to main sections
- Login button

## Technical Implementation

### Technology Stack
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS with custom theme
- **UI Components**: shadcn/ui component library
- **Icons**: Lucide React icons
- **Language**: Swedish (primary), English support planned

### Custom Styling
The `App.css` file includes custom classes:
- `.hero-gradient` - Gradient background for hero section
- `.card-hover` - Smooth hover animations for cards
- `.text-gradient` - Gradient text effect
- `.btn-primary` - Primary button with gradient and hover effects
- `.btn-secondary` - Secondary button styling
- `.pitch-pattern` - Football pitch grid pattern

### Color System
Custom OKLCH color palette optimized for dark mode:
- Background: `oklch(0.08 0 0)` - Deep black
- Foreground: `oklch(0.98 0 0)` - Near white
- Primary: `oklch(0.75 0.20 145)` - Vibrant green
- Secondary: `oklch(0.68 0.25 35)` - Bold orange
- Muted: `oklch(0.18 0 0)` - Dark gray
- Border: `oklch(0.25 0 0)` - Subtle border

### Interactive Features
- Category filtering for opportunities
- Smooth scroll animations
- Hover effects on all interactive elements
- Responsive design for mobile, tablet, and desktop
- Card lift animations with glowing shadows

## Project Structure

```
/home/ubuntu/anchrd-league/
├── dist/                    # Production build (deployed)
├── src/
│   ├── App.jsx             # Main application component
│   ├── App.css             # Custom styles and theme
│   ├── components/ui/      # shadcn/ui components
│   └── assets/             # Static assets
├── index.html              # HTML entry point
└── package.json            # Dependencies and scripts
```

## Deployment

The website has been built and packaged for deployment using:
- Build command: `npm run build`
- Output directory: `/home/ubuntu/anchrd-league/dist`
- Deployment type: Static website

The production build is optimized with:
- Minified CSS (91.53 kB → 14.77 kB gzipped)
- Minified JavaScript (241.23 kB → 73.54 kB gzipped)
- Optimized assets and code splitting

## Future Enhancements

Based on the initial requirements, future additions could include:
- English language support (currently Swedish only)
- User authentication and profiles
- Application submission system
- Club dashboard for managing opportunities
- Search and advanced filtering
- Email notifications
- Payment integration for premium listings
- Analytics dashboard

## Design Philosophy

The ANCHRD League website embodies several key design principles:

1. **Bold Visual Identity**: Strong use of color, gradients, and contrast to create a memorable brand presence
2. **Two-Sided Platform Clarity**: Clear distinction and pathways for both clubs and talents
3. **Football-Inspired Aesthetics**: Dark backgrounds, vibrant colors, and pitch patterns evoke the sport
4. **Modern Web Standards**: Smooth animations, responsive design, and accessibility considerations
5. **Conversion-Focused**: Strategic placement of CTAs and clear value propositions

## Swedish Language Content

All content is in Swedish, including:
- Navigation labels
- Section headings
- Opportunity descriptions
- Button text
- Footer links

Key terminology:
- **Uppdrag** - Opportunities/Tasks
- **Klubbar** - Clubs
- **Talanger** - Talents
- **Matchdagsuppdrag** - Matchday tasks
- **Volontärroller** - Volunteer roles
- **Professionella roller** - Professional roles
- **Strategiska uppdrag** - Strategic assignments
- **Ansök nu** - Apply now

---

**Created**: October 2025  
**Status**: Ready for deployment  
**Language**: Swedish (primary)

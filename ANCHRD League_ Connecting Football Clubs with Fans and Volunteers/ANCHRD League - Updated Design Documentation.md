# ANCHRD League - Updated Design Documentation

## Design Update Summary

The ANCHRD League website has been completely redesigned based on the brand guidelines provided. The new design features a professional, clean, and modern aesthetic that aligns with the brand values of **Stabilitet** (Stability), **Dynamik** (Dynamism), and **Tillgänglighet** (Accessibility).

## New Color Palette

### Primary Colors
The color scheme has shifted from a dark theme to a light, professional palette:

**Green Tones (Primary):**
- **Forest Green**: `#1B4332` - Primary brand color representing stability and reliability
- **Sea Green**: `#2E8B57` - Secondary green for accents and highlights
- **Sage Green**: `#52796F` - Soft green for balance and harmony
- **Stone Grey**: `#84A98C` - Light neutral green for subtle elements

**Orange Tones (Accent):**
- **Energy Orange**: `#FF6B35` - Primary accent color representing passion and energy
- **Warm Orange**: `#FF8F65` - Softer accent for friendliness
- **Sunset Orange**: `#FFB085` - Subtle accent for warmth

**Neutral Colors:**
- **Charcoal**: `#2F3E46` - Primary text color
- **Slate Grey**: `#354F52` - Secondary text
- **Off White**: `#F8F9FA` - Background color
- **White**: `#FFFFFF` - Card backgrounds

## Typography

**System Font Stack:**
```css
font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
```

This ensures optimal readability across all devices and operating systems without requiring custom font loading.

**Type Scale:**
- H1 (Hero): 3.5rem (56px) on desktop, 3rem (48px) on mobile
- H2 (Section): 2.5rem (40px) on desktop, 2rem (32px) on mobile
- H3 (Card Title): 1.5rem (24px)
- Body: 1rem (16px)
- Small: 0.875rem (14px)

## Design Elements

### Navigation Bar
- Fixed position with white background and subtle backdrop blur
- Clean, minimal design with rounded logo badge
- "Registrera" button in Energy Orange
- Smooth shadow for depth

### Hero Section
- Gradient background from Forest Green to Sea Green
- Subtle radial pattern overlay
- Large, bold white typography
- Single prominent CTA button
- Launch badge with icon

### Statistics Section
- Clean white background with subtle gradient
- Large, bold numbers in Forest Green
- Four key metrics displayed prominently

### Brand Values Cards
Three cards showcasing core values:
1. **Stabilitet** (Stability) - Anchor icon, Forest Green accent
2. **Dynamik** (Dynamism) - Zap icon, Energy Orange accent
3. **Tillgänglighet** (Accessibility) - Network icon, Sea Green accent

Each card features:
- Rounded corners (16px)
- 4px colored left border
- Rounded icon badge (48x48px)
- White background with subtle shadow
- Hover effect with increased shadow

### How It Works Section
Two-column layout with cards for clubs and talents:
- Rounded icon badges (48x48px) with colored backgrounds
- Numbered steps with circular badges
- Clean hierarchy and spacing
- White card backgrounds

### Opportunities Section
Interactive job board with:
- Category filter buttons with rounded corners
- Card-based grid layout (3 columns on desktop)
- Each card features:
  - 4px colored left border indicating category
  - Category badge with soft background colors
  - Club initial in rounded badge
  - Location, time, and date icons
  - Orange "Ansök nu" button

**Category Colors:**
- **Matchday**: Sea Green tones
- **Professional**: Energy Orange tones
- **Volunteer**: Sage Green tones
- **Strategic**: Stone Grey tones

### Call-to-Action Section
- Full-width gradient background (Forest Green to Sea Green)
- White text for contrast
- Two buttons: Orange primary and white outline

### Footer
- White background with border top
- Four-column layout on desktop
- Logo with rounded badge
- Organized link sections
- Copyright notice

## Interactive Elements

### Buttons
**Primary Button (Orange):**
- Background: `#FF6B35`
- Rounded corners: 8px
- Font weight: 600
- Hover: Darker orange with lift effect and shadow

**Secondary Button (Green):**
- Background: `#1B4332`
- Rounded corners: 8px
- Font weight: 600
- Hover: Darker green with lift effect and shadow

**Outline Button:**
- White background with border
- Hover: Maintains white background

### Cards
- Rounded corners: 16px
- Subtle shadow: `0 1px 3px rgba(0,0,0,0.1)`
- Hover effect: Lift up 4px with increased shadow
- Smooth transition: 300ms cubic-bezier

### Icon Badges
- Size: 48x48px
- Rounded corners: 12px
- Colored backgrounds matching brand palette
- White icons

## Responsive Design

The website is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

**Mobile Optimizations:**
- Single column layouts
- Reduced section padding (3rem vs 5rem)
- Smaller typography scale
- Stacked buttons
- Touch-friendly button sizes (minimum 44x44px)

## Accessibility Features

- Semantic HTML structure
- Proper heading hierarchy
- Sufficient color contrast ratios
- Focus states on interactive elements
- Alt text for icons (via Lucide React)
- Keyboard navigation support

## Brand Values Integration

The design embodies the three core brand values:

**Stabilitet (Stability):**
- Represented by Forest Green (#1B4332)
- Anchor icon
- Solid, professional layout
- Consistent spacing and alignment

**Dynamik (Dynamism):**
- Represented by Energy Orange (#FF6B35)
- Zap icon
- Smooth animations and transitions
- Vibrant accent colors

**Tillgänglighet (Accessibility):**
- Represented by Sea Green (#2E8B57)
- Network icon
- Clean, readable typography
- Clear information hierarchy
- Welcoming, open design

## Technical Implementation

**Framework:** React 18 with Vite  
**Styling:** Tailwind CSS with custom theme  
**Components:** shadcn/ui component library  
**Icons:** Lucide React  
**Language:** Swedish

**Build Output:**
- CSS: 105.50 kB (16.49 kB gzipped)
- JavaScript: 241.74 kB (73.68 kB gzipped)
- Optimized for production with code splitting

## Key Improvements from Previous Version

1. **Color Palette**: Shifted from dark theme to light, professional palette
2. **Typography**: System fonts for better performance and readability
3. **Spacing**: More generous whitespace and breathing room
4. **Cards**: Colored left borders for better categorization
5. **Icons**: Rounded badges with colored backgrounds
6. **Buttons**: Clearer hierarchy with orange primary and green secondary
7. **Navigation**: Cleaner, more professional header
8. **Brand Values**: New section highlighting core values with icons
9. **Overall Feel**: More welcoming, accessible, and professional

## Deployment

The updated website is ready for deployment with a permanent public URL. The production build is optimized and includes:
- Minified CSS and JavaScript
- Optimized assets
- Code splitting for faster loading
- Responsive images

---

**Updated**: October 2025  
**Version**: 2.0  
**Status**: Ready for publication

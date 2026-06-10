# T3-Project

## Project Overview

### Product

"Hoop" the event planner guide

### Purpose

the project aims to solve the following challenges:
- Centralize Event Management: To eliminate the stress and fragmentation of juggling multiple disjointed tools (like spreadsheets, chat apps, and physical notes) by providing a unified interface to define event details like date, time, type, and budget.  

- Simplify Guest Coordination: To streamline how hosts manage attendees by implementing a real-time tracking module for digital guest lists and RSVP statuses (Yes, No, Maybe).  

- Reduce Decision Fatigue: To save users from extensive manual research by providing curated, static recommendations for venues and activities tailored to the specific type of event.  

- Visualize Schedules: To help hosts easily see and manage the flow of the event day through an automated vertical timeline visualization.

### Target Users

- Non-professional organizers: Individual hosts planning personal events (such as small birthday parties or local gatherings) who find professional event management software too complex or expensive.  

- Hosts seeking simplicity: People currently suffering from "decision fatigue" or feeling overwhelmed by using a fragmented mix of spreadsheets, chat apps, and handwritten notes to manage their events.  
---

## Design Goals
- Centralization: Merging logistical precision with an intuitive user experience into a single, cohesive management hub to eliminate the need for switching between disjointed applications.  

- Reducing Cognitive Load: Lowering the organizer's stress and decision fatigue by replacing chaotic manual methods with a structured workflow and curated, static suggestions.  

- Accessibility and Simplicity: Building a straightforward, easy-to-use interface that allows casual users to navigate the platform and visualize event timelines without needing professional design or event management experience.  

- Modular Architecture: Organizing the application into three clear operational layers (user onboarding, event configuration, and guest logistics) driven by functional Input, Processing, and Tracking modules.  

- Responsive Web Layout: Structuring a clean, responsive interface focused strictly on the "Happy Path" of creating and viewing events across key screens: a Landing Page, Event Creation Form, Guest List View, and Timeline View.

### Primary Goals

* Fast to use
* Minimalist design  
* Mobile responsive
* Accessibility compliant

### Design Style

* Modern SaaS
* Apple-inspired
* Material Design
* Enterprise dashboard
* 

### Visual Tone

* Professional
* Friendly
* Premium
* Technical
* Mordern

---

## Page Navigation Flow

### Authentication Pages
1. **Account Creation Page** → Password Creation Page
2. **Password Creation Page** → Login Page
3. **Login Page** → Home Page (Dashboard)

### Main Navigation Structure

#### Home Page (Dashboard)
- Main entry point after login
- Event overview cards
- "Create Event" CTA button
- Sub-pages accessible: Contact, About Us

#### Inventory Section
- Event List Page (view all events)
- Event Overview Page (detailed event view)

### Event Creation Flow
1. **Set Up Event Page** - Event basics (name, type, description)
2. **Venue Selection Page** - Choose venue from recommendations
3. **Time and Task Page** - Set event timeline and activities
4. Confirmation/Preview Page +

---

## Layout Structure

### Page Layouts

**Landing/Home Page:**
```
Header (Logo, User Menu, Notifications)
↓
Hero/Welcome Section
↓
Event Cards / Quick Stats
↓
Create Event Button (Primary CTA)
↓
Footer (Contact, About Us links)
```

**Authenticated App Layout (Dashboard, Inventory, Event Overview):**
```
Header (Logo, User Menu, Notifications)
↓
Sidebar Navigation (Home, Inventory, Settings)
↓
Main Content Area (Dynamic based on page)
↓
Footer
```

**Event Creation Flow Layout:**
```
Header (Progress indicator: Step 1/3, 2/3, 3/3)
↓
Form Section (Grouped inputs with labels)
↓
Action Buttons (Next, Save, Cancel)
```

**Event Overview Page Layout:**
```
Header: ← Back | "Event" Title | ≡ Menu
↓
Event Title Card (Blue border - editable)
↓
Date & Time Fields (Side by side)
↓
Event Overview Description (Large text area)
↓
Two-Column Section:
  ├─ Left: Attendance List (with Add more, Edit options)
  └─ Right: Statistics (Pie chart with RSVP breakdown)
↓
Budget Analyzer Section (NEW)
```

---

## Screen Inventory & Components

### Screen 1: Account Creation Page

#### Purpose
Allow new users to create an account with email and basic information.

#### Components
* Email input field
* Password input field
* Confirm password field
* Terms & conditions checkbox
* Create Account button (Primary)
* Login link (Secondary)

#### User Actions
* Enter email
* Create password
* Agree to terms
* Submit to create account

#### States
* Default
* Loading
* Error (Invalid email, password mismatch)
* Success

---

### Screen 2: Login Page

#### Purpose
Allow users to access their account with credentials.

#### Components
* Email input field
* Password input field
* "Remember me" checkbox
* Login button (Primary)
* "Forgot password?" link
* Sign up link

#### User Actions
* Enter credentials
* Login
* Reset password
* Navigate to signup

#### States
* Default
* Loading
* Error (Invalid credentials)
* Success

---

### Screen 3: Home Page (Dashboard)

#### Purpose
Main landing page after login where users can see event overview and start creating events.

#### Components
* Header with user profile dropdown
* Welcome message
* "Create Event" button (Primary CTA)
* Event cards/list showing upcoming and past events
* Filter tabs (Upcoming, Past, All)
* Search bar
* Quick stats (Total events, Upcoming, Attending)
* Navigation links to Contact & About Us
* Empty state message when no events

#### User Actions
* Click "Create Event" → Set Up Event Page
* View event details
* Search/filter events
* Access Contact page
* Access About Us page
* Logout

#### States
* Loading
* Empty (No events)
* Error
* Success

---

### Screen 4: Set Up Event Page

#### Purpose
First step of event creation - define basic event details.

#### Components
* Progress indicator (1/3)
* Event name input
* Event type dropdown (Birthday, Wedding, Meeting, Gathering, etc.)
* Event description textarea
* Event visibility toggle (Private/Public)
* Next button
* Cancel button

#### User Actions
* Fill in event details
* Select event type
* Proceed to Venue Selection

#### States
* Form validation states
* Required field errors

---

### Screen 5: Venue Selection Page

#### Purpose
Second step of event creation - choose a venue from curated recommendations.

#### Components
* Progress indicator (2/3)
* Venue cards showing:
  - Venue name
  - Location/address
  - Capacity
  - Price range
  - Rating/reviews
  - Image
* Filter by location, capacity, price
* Search venue
* Back button
* Next button

#### User Actions
* Browse venues
* Filter/search
* Select venue
* Go back
* Proceed to Time and Task

---

### Screen 6: Time and Task Page

#### Purpose
Third step - set event timeline and schedule activities.

#### Components
* Progress indicator (3/3)
* Event date picker
* Event start time
* Event end time
* Activities list (Add more button)
  - Activity name input
  - Activity time
  - Activity description
  - Delete activity option
* Timeline preview
* Back button
* Create Event button (Final action)

#### User Actions
* Set date and time
* Add/edit activities
* Remove activities
* View timeline preview
* Go back
* Finish event creation

---

### Screen 7: Event Overview Page

#### Purpose
Comprehensive view of a created event with all details, guest management, and budget tracking.

#### Top Section
* Back button | "Event" title | Menu (Edit, Delete, Share)

#### Event Header Card
* Event Title (Blue border box - editable)
* Date field | Time field

#### Event Overview Section
* Description/Notes area (large text box)

#### Attendance List Section (Left Column)
* "Attendance list" header with icon
* "+ Add more" button | Edit icon
* Guest table with columns:
  - Guest Name
  - RSVP Status (Attending, Not attending, Unverified)
  - Status badge (color-coded: 🟢 Attending | 🟠 Not attending | 🔴 Unverified)

#### Statistics Section (Right Column)
* "Statistic" header with N/M (current/total)
* Pie chart showing:
  - Attending count
  - Not attending count
  - Unverified count
* Legend with color codes

#### Budget Analyzer Section (NEW)
* Total Budget display card
* Budget breakdown by categories:
  - Venue Cost
  - Catering Cost
  - Decorations
  - Activities
  - Other/Miscellaneous
* Spent vs. Remaining progress bar
* Budget chart (Bar or Donut chart)
* Add Expense button
* Expense history (recent transactions)

#### Additional Components (Recommended)
* Event Status badge (Upcoming, In Progress, Completed, Cancelled)
* Action Buttons bar:
  - Edit Event
  - View Timeline
  - Share Event
  - Delete Event
* Timeline preview (vertical timeline snippet)
* Vendor/Venue info card
* Notes/Comments section (for co-hosts)
* Task checklist (Pre-event checklist)

#### User Actions
* View event details
* Manage guest list (add, edit, remove guests)
* Track RSVP responses
* View attendance statistics
* Manage budget and expenses
* Edit event information
* Share event
* View timeline
* Delete event

#### States
* Loading
* Empty guest list
* Error
* Success

---

### Screen 8: Event List/Inventory Page

#### Purpose
View all events in a list format with filtering and search capabilities.

#### Components
* Header (Inventory or Events title)
* Search bar
* Filter options (Date range, event type, status)
* Event list with columns:
  - Event name
  - Date
  - Venue
  - Guest count
  - Status
  - Action icons (Edit, View, Delete)
* Pagination or infinite scroll
* "Create Event" button

#### User Actions
* Search events
* Filter by various criteria
* View event details
* Edit/delete events
* Create new event

---

### Screen 9: Contact Page

#### Purpose
Allow users to get in touch with support or leave feedback.

#### Components
* Contact form:
  - Name input
  - Email input
  - Subject dropdown
  - Message textarea
  - Send button
* Contact information section:
  - Email address
  - Phone number
  - Social media links
  - Business address
* FAQ section

#### User Actions
* Fill out contact form
* Send message
* View contact info
* Access support resources

---

### Screen 10: About Us Page

#### Purpose
Provide information about Hoop and the team.

#### Components
* About section (Project mission and vision)
* Team member cards
* Features overview
* Technology stack
* Links to social media
* Call to action (Try Hoop / Get Started)

#### User Actions
* Learn about Hoop
* Discover team members
* Start creating account

---

## Component Specifications

### Button

#### Variants

* Primary (Main actions - Create Event, Login, Submit)
* Secondary (Alternative actions - Cancel, Back)
* Ghost (Tertiary actions - Links, optional actions)
* Danger (Destructive actions - Delete)
* Success (Confirmation - Save, Create)

#### States

* Default
* Hover
* Active
* Disabled
* Loading

---

### Modal

#### Behavior

* Opens centered on screen
* Background blur effect
* ESC key closes modal
* Click outside closes modal
* Smooth fade-in animation

---

### Form Inputs

#### Types

* Text input (Email, name, text fields)
* Password input
* Textarea (Descriptions, notes)
* Select/Dropdown
* Date picker
* Time picker
* Checkbox
* Radio buttons
* Toggle switch

#### Validation

* Required fields (marked with *)
* Email format validation
* Password strength indicator
* Character limits with counter
* Real-time validation feedback

#### Error Messages

* "This field is required"
* "Invalid email format"
* "Password must be at least 8 characters"
* "Passwords do not match"
* "Email already exists"

---

### Cards

#### Types

* Event card (Image, title, date, guest count, CTA)
* Venue card (Image, name, capacity, price, rating)
* Guest card (Name, RSVP status, contact info)
* Stat card (Icon, label, value)
* Budget card (Category, amount, percentage)

#### States

* Default
* Hover (Slight elevation, shadow)
* Selected/Active
* Loading skeleton

---

### Data Table

#### Components

* Column headers
* Row data
* Action buttons (Edit, Delete, View)
* Sorting (click header to sort)
* Pagination controls
* Search within table

---

### Timeline Component

#### Features

* Vertical line with time markers
* Activity items with time
* Color-coded by category/type
* Add activity button
* Edit/delete capabilities on hover

---

## Responsive Design

### Mobile (<768px)

* Collapse sidebar into hamburger menu
* Stack all cards/content vertically
* Full-width forms and inputs
* Single column layout
* Larger touch targets (44px minimum)
* Bottom navigation bar
* Modal full-screen on mobile
* Pie charts responsive sizing

### Tablet (768px - 1024px)

* Two-column layout for event overview
* Sidebar visible but narrower
* Cards in 2-column grid
* Optimized spacing

### Desktop (>1024px)

* Full sidebar navigation always visible
* Multi-column layouts (3+ columns)
* Full dashboard with all features
* Hover states visible
* Pie charts normal sizing

---

## Design System

### Colors

**Primary Colors:**
* Primary Blue: #0066CC
* Primary Light: #E6F2FF

**Secondary Colors:**
* Secondary Gray: #666666
* Light Gray: #F5F5F5

**Status Colors:**
* Success Green: #22C55E (Attending)
* Warning Orange: #F59E0B (Not attending)
* Error Red: #EF4444 (Unverified)

**Neutral Colors:**
* Text: #1F2937
* Border: #D1D5DB
* Background: #FFFFFF
* Hover: #F9FAFB

### Selected Color Palette

**Palette: Muted Green Theme** ✓
A professional and calm color scheme with nature-inspired tones, perfect for a modern event planning application.

**Color Breakdown:**
* **Deep Teal-Green**: #1F4D3F (Primary accent - headers, CTAs)
* **Muted Sage Green**: #5A7A6B (Secondary accent - navigation, highlights)
* **Soft Mint Green**: #8FA893 (Tertiary - backgrounds, subtle elements)
* **Light Cream**: #F5F5F0 (Base background - sections, cards)

**Usage Guidelines:**
* Use Deep Teal-Green for primary buttons and key interactive elements
* Sage Green for secondary actions and hover states
* Mint Green for supporting UI elements and accents
* Cream for card backgrounds and light sections

### Typography

* **Heading H1**: 32px, Bold, Line-height 1.2
* **Heading H2**: 24px, Bold, Line-height 1.3
* **Heading H3**: 18px, Semi-bold, Line-height 1.4
* **Body**: 14px, Regular, Line-height 1.5
* **Small**: 12px, Regular, Line-height 1.4
* **Font Family**: Inter, -apple-system, BlinkMacSystemFont, Segoe UI

### Spacing

* **4px scale**: 4px, 8px, 12px, 16px, 20px, 24px, 28px, 32px
* **Common spacing**:
  - Padding: 16px (standard)
  - Margin: 24px (between sections)
  - Gap (flex): 12px (items), 24px (sections)

### Border Radius

* **Small**: 4px (buttons, inputs)
* **Medium**: 8px (cards, modals)
* **Large**: 12px (hero sections, major containers)
* **Extra Large**: 16px (event cards, important elements)

---

## Animations

### Page Transitions

* Fade-in: 300ms ease-in-out
* Slide-up: 300ms ease-in-out
* Smooth page loading (skeleton loader)

### Microinteractions

* **Button hover**: Slight background color change, subtle elevation
* **Card hover**: Elevation shadow increase, slight scale up (1.02x)
* **Modal open**: Fade-in background blur + scale-in content
* **Form validation**: Shake animation on error
* **Loading state**: Pulsing animation or spinner

### Duration

* **Fast**: 150ms (simple interactions)
* **Medium**: 300ms (page transitions, card hover)
* **Slow**: 500ms (modal open, loading complete)

---

## Accessibility

* **Keyboard Navigation**: All interactive elements accessible via Tab/Shift+Tab
* **Focus States**: Visible 2px outline on all focusable elements
* **Screen Reader Labels**: ARIA labels on all icons, form fields have associated labels
* **Color Contrast**: Minimum 4.5:1 for text, 3:1 for graphics
* **Alt Text**: All images have descriptive alt text
* **Semantic HTML**: Proper heading hierarchy, landmark regions
* **Form Accessibility**: Error messages linked to inputs with aria-describedby

---

## Empty States

* **No Events**: 
  - Icon representation
  - Message: "No events yet. Create your first event!"
  - "Create Event" button CTA

* **No Guests**:
  - Message: "No guests added yet. Invite people to your event."
  - "+ Add Guest" button

* **No Expenses**:
  - Message: "No expenses tracked yet. Start adding them to your budget."
  - "+ Add Expense" button

---

## Error States

* **Network Error**:
  - Icon: Error warning symbol
  - Message: "Unable to connect. Please check your internet."
  - "Retry" button

* **Form Error**:
  - Red outline on invalid field
  - Error message below field: "Invalid format" or specific error
  - "Fix errors to continue" button disabled

* **Server Error (500)**:
  - Message: "Something went wrong. Our team is working on it."
  - "Try again" button

* **Not Found (404)**:
  - Message: "Event not found or has been deleted."
  - "Go back" button

Generate:

* Complete responsive UI
* Reusable components
* Modern design system
* Light and dark mode support
* Accessibility-friendly components
* Production-ready frontend structure



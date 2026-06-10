# Venue Selection Page - Implementation Guide

## Overview

The **Venue Selection Page** (Screen 5) is the second step of the event creation flow. It allows users to browse, filter, and select a venue from curated recommendations.

## Component Location
```
src/components/EventCreation/VenueSelection.jsx
```

## Design System Implementation

### Color Palette (Muted Green Theme)
- **Primary**: `#1F4D3F` (Deep Teal-Green) - Main buttons, headers
- **Secondary**: `#5A7A6B` (Muted Sage Green) - Text, secondary elements
- **Tertiary**: `#8FA893` (Soft Mint Green) - Backgrounds, accents
- **Background**: `#F5F5F0` (Light Cream) - Page background
- **Status Colors**: Success (#22C55E), Warning (#F59E0B), Error (#EF4444)

### Typography
- **H1**: 32px Bold - Page title
- **H2**: 24px Bold - Section headers
- **H3**: 18px Semi-bold - Card titles
- **Body**: 14px Regular - General text
- **Small**: 12px Regular - Helper text
- **Font**: Inter (or system fonts: -apple-system, BlinkMacSystemFont, Segoe UI)

### Spacing
- Uses 4px scale: 4, 8, 12, 16, 20, 24, 28, 32px
- Card padding: 16px
- Section margins: 24px
- Component gap: 12px (items), 24px (sections)

### Border Radius
- Small: 4px (inputs, buttons)
- Medium: 8px (cards)
- Large: 12px (major containers)
- X-Large: 16px (event cards)

## Features Implemented

### ✅ Core Features
1. **Progress Indicator** - Shows "Step 2 of 3" with visual progress bar
2. **Venue Cards** - Display with:
   - High-quality images with hover effect
   - Venue name, location, capacity, price range
   - Rating stars and review count
   - Favorite/wishlist button
3. **Search Functionality** - Search by venue name or location (real-time)
4. **Advanced Filters**:
   - Price Range (Budget, Mid-range, Luxury)
   - Capacity (Small, Medium, Large)
5. **Selection Mechanism** - Click card to select, visual feedback with border highlight
6. **Responsive Design** - 1 column (mobile), 2 columns (tablet), 3 columns (desktop)

### ✅ User Experience
- "Add to Favorites" heart icon (interactive)
- Results count display
- Empty state handling with helpful message
- Disabled Next button until venue is selected
- Smooth animations and transitions
- Accessibility-compliant focus states

## Props

### Callback Functions
```jsx
<VenueSelection 
  onNext={(venue) => { /* Handle venue selection */ }}
  onBack={() => { /* Navigate back to Set Up Event */ }}
/>
```

- **`onNext`** - Called when user clicks Next with selected venue object
- **`onBack`** - Called when user clicks Back button

## Usage Example

### Integration into Event Creation Flow

```jsx
import { useState } from 'react';
import VenueSelection from './components/EventCreation/VenueSelection';
import TimeAndTask from './components/EventCreation/TimeAndTask';

export function EventCreationFlow() {
  const [step, setStep] = useState(2); // 1: SetUpEvent, 2: VenueSelection, 3: TimeAndTask
  const [eventData, setEventData] = useState({});

  const handleVenueSelect = (venue) => {
    setEventData({ ...eventData, venue });
    setStep(3); // Go to TimeAndTask
  };

  const handleBackFromVenue = () => {
    setStep(1); // Go back to SetUpEvent
  };

  if (step === 2) {
    return (
      <VenueSelection 
        onNext={handleVenueSelect}
        onBack={handleBackFromVenue}
      />
    );
  }

  // ... other steps
}
```

## Component Data Structure

### Venue Object (Mock Data)
```javascript
{
  id: 1,
  name: "Modern Rooftop Garden",
  location: "Downtown - 5 min walk",
  capacity: "50-200",
  priceRange: "$$$",
  rating: 4.8,
  reviews: 324,
  image: "https://...",
  category: "Venue"
}
```

### State Management
- **`searchQuery`** - Current search input
- **`selectedVenue`** - ID of selected venue
- **`favorites`** - Set of favorited venue IDs
- **`showFilters`** - Toggle filter visibility
- **`filters`** - Object containing priceRange and capacity filters

## Customization Guide

### Adding More Venues
Replace mock data in the component:
```jsx
const mockVenues = [
  // Add more venue objects here
];
```

### Connecting to Backend API
Replace mock data fetch with API call:
```jsx
const [venues, setVenues] = useState([]);

useEffect(() => {
  // fetch('/api/venues').then(data => setVenues(data));
}, []);
```

### Customizing Colors
Modify the `colors` object at the top of the component:
```jsx
const colors = {
  primary: "#YOUR_PRIMARY_COLOR",
  // ... other colors
};
```

## Accessibility Features

✅ **Implemented:**
- Semantic HTML structure
- Keyboard navigation (Tab/Shift+Tab)
- Focus indicators on interactive elements
- ARIA labels on icon buttons
- Color contrast meets WCAG AA standards
- Form inputs with proper labels
- Search input with placeholder text
- Radio buttons for filter options

## Performance Optimization

- **Memoized Filtering**: `useMemo` prevents unnecessary re-renders
- **Lazy Image Loading**: Images load on demand
- **Smooth Animations**: CSS transitions (300ms duration)
- **Efficient Search**: Real-time filter without debouncing (suitable for small dataset)

## Mobile Responsive Design

| Breakpoint | Layout | Grid |
|-----------|--------|------|
| < 768px (Mobile) | Single column | 1 card per row |
| 768-1024px (Tablet) | Optimized | 2 cards per row |
| > 1024px (Desktop) | Full layout | 3 cards per row |

## Next Steps

### 1. Connect to Backend
- Replace mock venue data with API calls to `/api/venues`
- Implement server-side filtering for better performance

### 2. Create Related Components
- `SetUpEvent.jsx` - Screen 4 (event basics)
- `TimeAndTask.jsx` - Screen 6 (timeline)
- `EventCreationFlow.jsx` - Navigation wrapper

### 3. State Management
- Consider using Context API or Redux for event data persistence
- Pass selected venue data through the flow

### 4. Enhanced Features (Future)
- Virtual scrolling for 100+ venues
- Map view of venues
- User reviews and photos
- Pricing comparison
- Availability calendar integration

## Design Goals Alignment

✅ **Centralization** - Single interface for venue selection  
✅ **Reducing Cognitive Load** - Curated recommendations, clear filtering  
✅ **Accessibility & Simplicity** - Clean layout, easy-to-use filters  
✅ **Modular Architecture** - Standalone, reusable component  
✅ **Responsive Layout** - Works seamlessly on mobile, tablet, desktop  
✅ **Modern SaaS Design** - Professional, premium appearance  
✅ **Professional & Friendly Tone** - Clear messaging, intuitive UI  

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Dependencies

- **React** 16.8+ (for Hooks)
- **lucide-react** (for icons)
- **Tailwind CSS** (for responsive utilities)

## Notes

- Component uses inline styles for color values to ensure consistency with design system
- Tailwind CSS handles responsive grid layout
- Mock data includes 6 diverse venue options covering different price ranges and sizes
- Search and filters work in combination (AND logic)
- Venue selection is mandatory before proceeding to next step

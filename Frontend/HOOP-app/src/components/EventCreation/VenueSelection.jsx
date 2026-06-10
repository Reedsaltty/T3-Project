import { useState, useMemo } from "react";
import { 
  MapPin, 
  Users, 
  DollarSign, 
  Star, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  Heart
} from "lucide-react";

// Design System Colors - Muted Green Theme
const colors = {
  primary: "#1F4D3F",        // Deep Teal-Green
  secondary: "#5A7A6B",      // Muted Sage Green
  tertiary: "#8FA893",       // Soft Mint Green
  background: "#F5F5F0",     // Light Cream
  text: "#1F2937",           // Dark text
  border: "#D1D5DB",         // Border color
  success: "#22C55E",        // Success Green
  warning: "#F59E0B",        // Warning Orange
  error: "#EF4444",          // Error Red
  white: "#FFFFFF"
};

// Mock venue data
const mockVenues = [
  {
    id: 1,
    name: "Modern Rooftop Garden",
    location: "Downtown - 5 min walk",
    capacity: "50-200",
    priceRange: "$$$",
    rating: 4.8,
    reviews: 324,
    image: "https://images.unsplash.com/photo-1519167758481-83f19106c0b7?w=400&h=300&fit=crop",
    category: "Venue"
  },
  {
    id: 2,
    name: "Elegant Ballroom",
    location: "City Center - 10 min drive",
    capacity: "100-500",
    priceRange: "$$$$",
    rating: 4.9,
    reviews: 512,
    image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=400&h=300&fit=crop",
    category: "Venue"
  },
  {
    id: 3,
    name: "Cozy Garden Pavilion",
    location: "Suburb - 15 min drive",
    capacity: "20-100",
    priceRange: "$$",
    rating: 4.6,
    reviews: 189,
    image: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=300&fit=crop",
    category: "Venue"
  },
  {
    id: 4,
    name: "Beachfront Resort",
    location: "Coastal Area - 30 min drive",
    capacity: "75-300",
    priceRange: "$$$",
    rating: 4.7,
    reviews: 456,
    image: "https://images.unsplash.com/photo-1510578773477-5347f22b9f20?w=400&h=300&fit=crop",
    category: "Venue"
  },
  {
    id: 5,
    name: "Historic Manor House",
    location: "Countryside - 45 min drive",
    capacity: "40-250",
    priceRange: "$$$",
    rating: 4.9,
    reviews: 378,
    image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400&h=300&fit=crop",
    category: "Venue"
  },
  {
    id: 6,
    name: "Urban Loft Space",
    location: "Arts District - 8 min walk",
    capacity: "30-150",
    priceRange: "$$",
    rating: 4.5,
    reviews: 267,
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
    category: "Venue"
  }
];

export default function VenueSelection({ onNext, onBack }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: "all",
    capacity: "all"
  });

  // Filter venues based on search and filters
  const filteredVenues = useMemo(() => {
    return mockVenues.filter((venue) => {
      const matchesSearch = 
        venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        venue.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesPrice = 
        filters.priceRange === "all" || 
        (filters.priceRange === "budget" && venue.priceRange.length <= 2) ||
        (filters.priceRange === "mid" && venue.priceRange.length === 3) ||
        (filters.priceRange === "luxury" && venue.priceRange.length >= 4);
      
      const matchesCapacity = 
        filters.capacity === "all" ||
        (filters.capacity === "small" && parseInt(venue.capacity.split("-")[1]) <= 100) ||
        (filters.capacity === "medium" && parseInt(venue.capacity.split("-")[1]) > 100 && parseInt(venue.capacity.split("-")[1]) <= 250) ||
        (filters.capacity === "large" && parseInt(venue.capacity.split("-")[1]) > 250);

      return matchesSearch && matchesPrice && matchesCapacity;
    });
  }, [searchQuery, filters]);

  const toggleFavorite = (venueId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(venueId)) {
      newFavorites.delete(venueId);
    } else {
      newFavorites.add(venueId);
    }
    setFavorites(newFavorites);
  };

  const handleSelectVenue = (venue) => {
    setSelectedVenue(venue.id);
  };

  const handleNext = () => {
    if (selectedVenue) {
      const venue = mockVenues.find(v => v.id === selectedVenue);
      onNext(venue);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <div className="sticky top-0 z-40 border-b" style={{ borderColor: colors.border, backgroundColor: colors.white }}>
        <div className="max-w-6xl mx-auto px-6 py-6">
          {/* Progress Indicator */}
          <div className="flex items-center gap-3 mb-6">
            <span 
              className="text-sm font-semibold"
              style={{ color: colors.primary }}
            >
              Step 2 of 3
            </span>
            <div className="flex gap-2">
              <div 
                className="h-1 w-12 rounded-full"
                style={{ backgroundColor: colors.primary }}
              />
              <div 
                className="h-1 w-12 rounded-full"
                style={{ backgroundColor: colors.primary }}
              />
              <div 
                className="h-1 w-12 rounded-full"
                style={{ backgroundColor: colors.border }}
              />
            </div>
          </div>

          <h1 
            className="text-3xl font-bold mb-2"
            style={{ color: colors.text }}
          >
            Select a Venue
          </h1>
          <p 
            className="text-sm"
            style={{ color: colors.secondary }}
          >
            Choose from our curated recommendations to find the perfect venue for your event
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Search and Filter Bar */}
        <div className="mb-8">
          {/* Search Input */}
          <div className="relative mb-4">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: colors.secondary }} />
            <input
              type="text"
              placeholder="Search venues by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-lg border outline-none transition-all"
              style={{
                borderColor: colors.border,
                backgroundColor: colors.white,
                color: colors.text,
                fontSize: "14px"
              }}
              onFocus={(e) => e.target.style.borderColor = colors.primary}
              onBlur={(e) => e.target.style.borderColor = colors.border}
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors"
            style={{
              backgroundColor: showFilters ? colors.primary : colors.background,
              color: showFilters ? colors.white : colors.text,
              border: `1px solid ${colors.border}`
            }}
          >
            <Filter size={18} />
            Filters
          </button>

          {/* Filter Dropdown */}
          {showFilters && (
            <div 
              className="mt-4 p-6 rounded-lg border grid md:grid-cols-2 gap-6"
              style={{ borderColor: colors.border, backgroundColor: colors.white }}
            >
              {/* Price Range Filter */}
              <div>
                <label 
                  className="block text-sm font-semibold mb-3"
                  style={{ color: colors.text }}
                >
                  Price Range
                </label>
                <div className="space-y-2">
                  {[
                    { value: "all", label: "All Prices" },
                    { value: "budget", label: "$ - Budget Friendly" },
                    { value: "mid", label: "$$ - Mid-Range" },
                    { value: "luxury", label: "$$$ & $$$$ - Luxury" }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="price"
                        value={option.value}
                        checked={filters.priceRange === option.value}
                        onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                        className="w-4 h-4"
                      />
                      <span style={{ color: colors.text }}>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Capacity Filter */}
              <div>
                <label 
                  className="block text-sm font-semibold mb-3"
                  style={{ color: colors.text }}
                >
                  Capacity
                </label>
                <div className="space-y-2">
                  {[
                    { value: "all", label: "Any Size" },
                    { value: "small", label: "Small (up to 100)" },
                    { value: "medium", label: "Medium (100-250)" },
                    { value: "large", label: "Large (250+)" }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="capacity"
                        value={option.value}
                        checked={filters.capacity === option.value}
                        onChange={(e) => setFilters({ ...filters, capacity: e.target.value })}
                        className="w-4 h-4"
                      />
                      <span style={{ color: colors.text }}>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <p 
          className="text-sm mb-6"
          style={{ color: colors.secondary }}
        >
          Showing {filteredVenues.length} venue{filteredVenues.length !== 1 ? "s" : ""}
        </p>

        {/* Venue Cards Grid */}
        {filteredVenues.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredVenues.map((venue) => (
              <div
                key={venue.id}
                onClick={() => handleSelectVenue(venue)}
                className="rounded-2xl overflow-hidden transition-all cursor-pointer group"
                style={{
                  backgroundColor: colors.white,
                  border: `2px solid ${selectedVenue === venue.id ? colors.primary : colors.border}`,
                  boxShadow: selectedVenue === venue.id 
                    ? `0 4px 12px rgba(31, 77, 63, 0.15)` 
                    : `0 2px 8px rgba(0, 0, 0, 0.05)`
                }}
              >
                {/* Image Container */}
                <div className="relative overflow-hidden h-40 bg-gray-200">
                  <img
                    src={venue.image}
                    alt={venue.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(venue.id);
                    }}
                    className="absolute top-3 right-3 p-2 rounded-full transition-all"
                    style={{
                      backgroundColor: colors.white,
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
                    }}
                  >
                    <Heart
                      size={18}
                      fill={favorites.has(venue.id) ? colors.error : "none"}
                      style={{ color: favorites.has(venue.id) ? colors.error : colors.secondary }}
                    />
                  </button>

                  {/* Rating Badge */}
                  <div
                    className="absolute top-3 left-3 px-3 py-1 rounded-full flex items-center gap-1 text-xs font-semibold"
                    style={{
                      backgroundColor: colors.white,
                      color: colors.text
                    }}
                  >
                    <Star size={14} fill={colors.warning} style={{ color: colors.warning }} />
                    {venue.rating}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 
                    className="text-lg font-bold mb-2"
                    style={{ color: colors.text }}
                  >
                    {venue.name}
                  </h3>

                  {/* Location */}
                  <div className="flex items-start gap-2 mb-3">
                    <MapPin 
                      size={16} 
                      className="flex-shrink-0 mt-0.5"
                      style={{ color: colors.secondary }}
                    />
                    <span 
                      className="text-sm"
                      style={{ color: colors.secondary }}
                    >
                      {venue.location}
                    </span>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-3 gap-3 mb-4 py-4 border-t border-b" style={{ borderColor: colors.border }}>
                    {/* Capacity */}
                    <div className="text-center">
                      <Users size={18} style={{ color: colors.primary }} className="mx-auto mb-1" />
                      <p 
                        className="text-xs font-semibold"
                        style={{ color: colors.text }}
                      >
                        {venue.capacity}
                      </p>
                      <p 
                        className="text-xs"
                        style={{ color: colors.secondary }}
                      >
                        Guests
                      </p>
                    </div>

                    {/* Price */}
                    <div className="text-center">
                      <DollarSign size={18} style={{ color: colors.primary }} className="mx-auto mb-1" />
                      <p 
                        className="text-xs font-semibold"
                        style={{ color: colors.text }}
                      >
                        {venue.priceRange}
                      </p>
                      <p 
                        className="text-xs"
                        style={{ color: colors.secondary }}
                      >
                        Price
                      </p>
                    </div>

                    {/* Rating */}
                    <div className="text-center">
                      <Star size={18} style={{ color: colors.warning }} className="mx-auto mb-1" fill={colors.warning} />
                      <p 
                        className="text-xs font-semibold"
                        style={{ color: colors.text }}
                      >
                        {venue.reviews}
                      </p>
                      <p 
                        className="text-xs"
                        style={{ color: colors.secondary }}
                      >
                        Reviews
                      </p>
                    </div>
                  </div>

                  {/* Selection Indicator */}
                  {selectedVenue === venue.id && (
                    <div
                      className="text-xs font-semibold text-center py-2 rounded-lg"
                      style={{ backgroundColor: colors.background, color: colors.primary }}
                    >
                      ✓ Selected
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p 
              className="text-lg font-semibold mb-2"
              style={{ color: colors.text }}
            >
              No venues found
            </p>
            <p 
              className="text-sm"
              style={{ color: colors.secondary }}
            >
              Try adjusting your search or filters to find the perfect venue
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 pt-8 border-t" style={{ borderColor: colors.border }}>
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors"
            style={{
              backgroundColor: colors.background,
              color: colors.primary,
              border: `2px solid ${colors.primary}`
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = "#E6F2FF"}
            onMouseLeave={(e) => e.target.style.backgroundColor = colors.background}
          >
            <ChevronLeft size={20} />
            Back
          </button>

          <button
            onClick={handleNext}
            disabled={!selectedVenue}
            className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: selectedVenue ? colors.primary : colors.border,
              color: colors.white
            }}
            onMouseEnter={(e) => selectedVenue && (e.target.style.opacity = "0.9")}
            onMouseLeave={(e) => selectedVenue && (e.target.style.opacity = "1")}
          >
            Next
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

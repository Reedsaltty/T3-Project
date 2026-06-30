import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../Homepage/Navbar";
import { useEventContext } from "./EventContext";
import { ArrowLeft, ArrowRight, MapPin, Users, DollarSign, Star, Search, CheckCircle2, Filter, PlusCircle, X, Loader2 } from "lucide-react";
import { VENUES } from "./venuesData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getVenues, submitVenueApplication } from "../../api/venue.api";
import LocationPicker from "./LocationPicker";

const slideIn = {
  hidden: { opacity: 0, x: 20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemAnim = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0 }
};

export default function VenueSelectionNew() {
  const navigate = useNavigate();
  const { form, location, setLocation, selectedVenueId, setSelectedVenueId } = useEventContext();
  const selected = selectedVenueId;
  const setSelected = setSelectedVenueId;

  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  
  // Real venues & Application state
  const [venuesList, setVenuesList] = useState(VENUES);
  const [loadingVenues, setLoadingVenues] = useState(false);
  const [showAppModal, setShowAppModal] = useState(false);
  const [appForm, setAppForm] = useState({
    venueName: "",
    venueLocation: "",
    venueCapacity: "",
    contactEmail: "",
    description: ""
  });
  const [appStatus, setAppStatus] = useState({ loading: false, error: null, success: null });

  useEffect(() => {
    // Only fetch venues if it's a big event
    if (form.eventSize === "small") return;

    const fetchBackendVenues = async () => {
      setLoadingVenues(true);
      try {
        const data = await getVenues();
        if (data && Array.isArray(data) && data.length > 0) {
          const mapped = data.map(v => ({
            id: v.venueId || v.id,
            name: v.name,
            address: v.location || v.address || "No address provided",
            capacity: v.capacity || 100,
            price: v.priceRange || "$$",
            rating: 4.8,
            tags: v.amenities || []
          }));
          const existingIds = new Set(VENUES.map(mv => mv.id));
          const uniqueBackend = mapped.filter(b => !existingIds.has(b.id));
          setVenuesList([...uniqueBackend, ...VENUES]);
        }
      } catch (err) {
        console.warn("Could not fetch backend venues, falling back to mock data:", err);
      } finally {
        setLoadingVenues(false);
      }
    };
    fetchBackendVenues();
  }, [form.eventSize]);

  const handleAppSubmit = async (e) => {
    e.preventDefault();
    setAppStatus({ loading: true, error: null, success: null });
    try {
      await submitVenueApplication(appForm);
      setAppStatus({ loading: false, error: null, success: "Application submitted successfully! An admin will review it soon." });
      setAppForm({ venueName: "", venueLocation: "", venueCapacity: "", contactEmail: "", description: "" });
      setTimeout(() => {
        setShowAppModal(false);
        setAppStatus({ loading: false, error: null, success: null });
      }, 2000);
    } catch (err) {
      setAppStatus({
        loading: false,
        error: err.response?.data?.message || err.message || "Failed to submit application",
        success: null
      });
    }
  };

  // Filters
  const [priceFilter, setPriceFilter] = useState("All");
  const [capFilter, setCapFilter] = useState("All");

  const filtered = venuesList.filter(v => {
    const matchSearch = (v.name || "").toLowerCase().includes(search.toLowerCase()) || (v.address || "").toLowerCase().includes(search.toLowerCase());
    let matchPrice = true;
    if (priceFilter === "Budget") matchPrice = v.price === "$";
    if (priceFilter === "Mid-range") matchPrice = v.price === "$$";
    if (priceFilter === "Luxury") matchPrice = v.price === "$$$";

    let matchCap = true;
    if (capFilter === "Small (<100)") matchCap = v.capacity < 100;
    if (capFilter === "Medium (100-300)") matchCap = v.capacity >= 100 && v.capacity <= 300;
    if (capFilter === "Large (>300)") matchCap = v.capacity > 300;

    return matchSearch && matchPrice && matchCap;
  });

  const handleNext = () => {
    navigate("/event-creation/time-task");
  };

  const isNextDisabled = form.eventSize === "small" ? (!location.lat || !location.lng) : false;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      <Navbar />
      <main className="flex-1 py-10 pb-20">
        <div className="container mx-auto px-6 max-w-5xl">

          {/* Stepper */}
          <div className="flex items-center bg-white border border-gray-100 rounded-2xl p-5 px-8 shadow-sm mb-10">
            {[
              { n: 1, label: "Set Up Event",    active: false, done: true },
              { n: 2, label: form.eventSize === "small" ? "Location" : "Venue Selection", active: true,  done: false },
              { n: 3, label: "Time & Task",     active: false, done: false },
            ].map((s, i, arr) => (
              <div key={s.n} className="flex items-center flex-1">
                <div 
                  className={`flex items-center gap-3 ${s.done ? "cursor-pointer hover:opacity-80" : ""}`}
                  onClick={() => {
                    if (s.n === 1) navigate("/event-creation/setup");
                  }}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 transition-all ${
                    s.active ? "bg-blue-600 text-white shadow-[0_0_0_4px_rgba(37,99,235,0.15)]" :
                    s.done ? "bg-emerald-500 text-white" :
                    "bg-gray-100 text-gray-400"
                  }`}>
                    {s.done ? <CheckCircle2 size={16} /> : s.n}
                  </div>
                  <span className={`hidden sm:block text-sm whitespace-nowrap ${s.active ? "font-semibold text-blue-600" : "font-medium text-gray-400"}`}>
                    {s.label}
                  </span>
                </div>
                {i < arr.length - 1 && <div className={`flex-1 h-0.5 mx-4 ${s.done ? "bg-emerald-500" : "bg-gray-100"}`} />}
              </div>
            ))}
          </div>

          <motion.div variants={slideIn} initial="hidden" animate="show" className="flex flex-col gap-6">
            
            {/* Conditional Rendering based on Event Size */}
            {form.eventSize === "small" ? (
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm max-w-3xl mx-auto w-full">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Pin Your Location</h3>
                  <p className="text-gray-500">Where is this event taking place? Click the map to drop a pin.</p>
                </div>
                <LocationPicker 
                  initialPin={location.lat ? [location.lat, location.lng] : null}
                  onLocationSelect={(loc) => setLocation({ ...location, lat: loc.lat, lng: loc.lng, address: loc.address })}
                />
                <div className="mt-6 space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase">Location Label (Optional)</label>
                  <Input 
                    placeholder="e.g. My Apartment, Central Park" 
                    value={location.label} 
                    onChange={(e) => setLocation({ ...location, label: e.target.value })}
                    className="h-11"
                  />
                  <p className="text-xs text-gray-400">Give this location a recognizable name for your guests.</p>
                </div>
              </div>
            ) : (
              <>
                {/* Header */}
                <div>
                  <h2 className="text-3xl font-heading font-bold text-gray-900 mb-2">Discover the perfect setting</h2>
                  <p className="text-gray-500">Browse curated venues and pick the one that fits your event. (Optional - you can book a venue later!)</p>
                </div>

                {/* Search and Filters Bar */}
                <div className="flex flex-col gap-4">
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Search by venue name or location…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="pl-12 h-12 text-base rounded-xl border-gray-200 shadow-sm bg-white"
                      />
                    </div>
                    <Button 
                      variant={showFilters ? "default" : "outline"}
                      onClick={() => setShowFilters(!showFilters)} 
                      className={`h-12 px-6 gap-2 rounded-xl transition-colors ${showFilters ? "bg-blue-600 hover:bg-blue-700" : "bg-white"}`}
                    >
                      <Filter size={16} /> Filters
                    </Button>
                    <Button
                      onClick={() => setShowAppModal(true)}
                      className="h-12 px-6 gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-sm transition-all whitespace-nowrap"
                    >
                      <PlusCircle size={16} /> List Your Venue
                    </Button>
                  </div>

                  {/* Expandable Filters Area */}
                  <AnimatePresence>
                    {showFilters && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-xl grid grid-cols-1 md:grid-cols-2 gap-6">
                          
                          {/* Price Filter */}
                          <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-900 uppercase tracking-widest">Price Range</label>
                            <div className="flex flex-wrap gap-2">
                              {["All", "Budget", "Mid-range", "Luxury"].map(p => (
                                <button
                                  key={p}
                                  onClick={() => setPriceFilter(p)}
                                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                    priceFilter === p 
                                      ? "bg-blue-50 text-blue-700 border border-blue-200" 
                                      : "bg-gray-50 text-gray-600 border border-gray-100 hover:bg-gray-100"
                                  }`}
                                >
                                  {p}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Capacity Filter */}
                          <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-900 uppercase tracking-widest">Capacity</label>
                            <div className="flex flex-wrap gap-2">
                              {["All", "Small (<100)", "Medium (100-300)", "Large (>300)"].map(c => (
                                <button
                                  key={c}
                                  onClick={() => setCapFilter(c)}
                                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                    capFilter === c 
                                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                                      : "bg-gray-50 text-gray-600 border border-gray-100 hover:bg-gray-100"
                                  }`}
                                >
                                  {c}
                                </button>
                              ))}
                            </div>
                          </div>
                          
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Venue Grid */}
                {loadingVenues ? (
                  <div className="py-20 text-center text-gray-500 bg-white border border-gray-100 rounded-2xl flex flex-col items-center justify-center gap-3 shadow-sm">
                    <Loader2 size={36} className="animate-spin text-blue-600" />
                    <p className="text-base font-medium text-gray-600">Fetching curated venues...</p>
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="py-20 text-center text-gray-500 bg-white border border-dashed border-gray-200 rounded-2xl">
                    <MapPin size={40} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-lg">No venues match your current filters.</p>
                    <Button variant="link" onClick={() => { setPriceFilter("All"); setCapFilter("All"); setSearch(""); }}>Clear Filters</Button>
                  </div>
                ) : (
                  <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
                    {filtered.map(v => (
                      <motion.div key={v.id} variants={itemAnim}>
                        <div
                          className={`relative bg-white rounded-2xl overflow-hidden border-2 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg ${
                            selected === v.id 
                              ? "border-blue-600 shadow-[0_0_0_4px_rgba(37,99,235,0.1)]" 
                              : "border-gray-100 shadow-sm"
                          }`}
                          onClick={() => setSelected(selected === v.id ? null : v.id)}
                        >
                          <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-300">
                            <MapPin size={32} className="opacity-40" />
                          </div>
                          {selected === v.id && (
                            <div className="absolute top-3 right-3 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-md">
                              <CheckCircle2 size={16} />
                            </div>
                          )}
                          <div className="p-5 flex flex-col gap-3">
                            <h3 className="font-semibold text-gray-900 leading-tight">{v.name}</h3>
                            <div className="flex flex-col gap-1.5">
                              <div className="flex items-center gap-2 text-sm text-gray-500"><MapPin size={14} className="text-gray-400 shrink-0" /><span className="truncate">{v.address}</span></div>
                              <div className="flex items-center gap-2 text-sm text-gray-500"><Users size={14} className="text-gray-400 shrink-0" /><span>Up to {v.capacity} guests</span></div>
                              <div className="flex items-center gap-2 text-sm text-gray-500"><DollarSign size={14} className="text-gray-400 shrink-0" /><span>{v.price} {v.price === "$" ? "(Budget)" : v.price === "$$" ? "(Mid-range)" : "(Luxury)"}</span></div>
                            </div>
                            <div className="flex items-center gap-1.5 mt-2 text-sm font-semibold text-amber-600">
                              <Star size={14} fill="currentColor" />
                              {v.rating.toFixed(1)}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <Button variant="outline" onClick={() => navigate("/event-creation/setup")} className="gap-2">
                <ArrowLeft size={16} /> Back
              </Button>
              <Button disabled={isNextDisabled} onClick={handleNext} className="gap-2 px-6">
                Next: Time & Task <ArrowRight size={16} />
              </Button>
            </div>
          </motion.div>

        </div>
      </main>

      {/* Venue Application Modal */}
      <AnimatePresence>
        {showAppModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border border-gray-100 relative max-h-[90vh] overflow-y-auto text-left"
            >
              <button
                onClick={() => setShowAppModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Submit Venue Application</h3>
              <p className="text-sm text-gray-500 mb-4">List your venue on Hoop. An admin will review and approve your submission.</p>

              {appStatus.error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
                  {appStatus.error}
                </div>
              )}
              {appStatus.success && (
                <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 text-sm rounded-xl border border-emerald-100 font-medium">
                  {appStatus.success}
                </div>
              )}

              <form onSubmit={handleAppSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Venue Name *</label>
                  <Input
                    required
                    placeholder="e.g. Grand Sunset Lounge"
                    value={appForm.venueName}
                    onChange={e => setAppForm({ ...appForm, venueName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Location / Address *</label>
                  <Input
                    required
                    placeholder="e.g. 123 Sukhumvit Rd, Bangkok"
                    value={appForm.venueLocation}
                    onChange={e => setAppForm({ ...appForm, venueLocation: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Capacity *</label>
                    <Input
                      required
                      type="number"
                      min="1"
                      placeholder="e.g. 150"
                      value={appForm.venueCapacity}
                      onChange={e => setAppForm({ ...appForm, venueCapacity: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Contact Email *</label>
                    <Input
                      required
                      type="email"
                      placeholder="e.g. contact@venue.com"
                      value={appForm.contactEmail}
                      onChange={e => setAppForm({ ...appForm, contactEmail: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Description</label>
                  <textarea
                    rows="3"
                    placeholder="Describe the venue features, vibe, and why it's great for events..."
                    className="w-full p-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                    value={appForm.description}
                    onChange={e => setAppForm({ ...appForm, description: e.target.value })}
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAppModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={appStatus.loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {appStatus.loading ? <><Loader2 size={16} className="animate-spin mr-2 inline" /> Submitting...</> : "Submit Application"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

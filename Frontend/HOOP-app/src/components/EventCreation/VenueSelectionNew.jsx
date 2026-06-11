import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../Homepage/Navbar";
import { ArrowLeft, ArrowRight, MapPin, Users, DollarSign, Star, Search, CheckCircle2, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const VENUES = [
  { id: 1, name: "The Grand Ballroom",     address: "123 Main St, Bangkok",    capacity: 400, price: "$$$",  rating: 4.7, tags: ["wedding","birthday","conference"] },
  { id: 2, name: "Rooftop Garden Hub",     address: "456 Sky Rd, Bangkok",     capacity: 100, price: "$$",   rating: 4.4, tags: ["birthday","gathering","meeting"] },
  { id: 3, name: "City Conference Hall",   address: "789 Central Ave, Bangkok",capacity: 250, price: "$$",   rating: 4.2, tags: ["meeting","conference"] },
  { id: 4, name: "Beachside Pavilion",     address: "001 Seaside Ln, Phuket",  capacity: 150, price: "$$$",  rating: 4.8, tags: ["wedding","gathering","birthday"] },
  { id: 5, name: "Cozy Event Loft",        address: "22 Alley 5, Chiang Mai",  capacity:  60, price: "$",    rating: 4.1, tags: ["birthday","gathering","meeting"] },
  { id: 6, name: "Riverside Terrace",      address: "8 River Rd, Bangkok",     capacity: 200, price: "$$$",  rating: 4.6, tags: ["wedding","gathering","conference"] },
];

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
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filters
  const [priceFilter, setPriceFilter] = useState("All");
  const [capFilter, setCapFilter] = useState("All");

  const filtered = VENUES.filter(v => {
    // Search
    const matchSearch = v.name.toLowerCase().includes(search.toLowerCase()) || v.address.toLowerCase().includes(search.toLowerCase());
    
    // Price
    let matchPrice = true;
    if (priceFilter === "Budget") matchPrice = v.price === "$";
    if (priceFilter === "Mid-range") matchPrice = v.price === "$$";
    if (priceFilter === "Luxury") matchPrice = v.price === "$$$";

    // Capacity
    let matchCap = true;
    if (capFilter === "Small (<100)") matchCap = v.capacity < 100;
    if (capFilter === "Medium (100-300)") matchCap = v.capacity >= 100 && v.capacity <= 300;
    if (capFilter === "Large (>300)") matchCap = v.capacity > 300;

    return matchSearch && matchPrice && matchCap;
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      <Navbar />
      <main className="flex-1 py-10 pb-20">
        <div className="container mx-auto px-6 max-w-5xl">

          {/* Stepper */}
          <div className="flex items-center bg-white border border-gray-100 rounded-2xl p-5 px-8 shadow-sm mb-10">
            {[
              { n: 1, label: "Set Up Event",    active: false, done: true },
              { n: 2, label: "Venue Selection", active: true,  done: false },
              { n: 3, label: "Time & Task",     active: false, done: false },
            ].map((s, i, arr) => (
              <div key={s.n} className="flex items-center flex-1">
                <div className="flex items-center gap-3">
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
            {/* Header */}
            <div>
              <h2 className="text-3xl font-heading font-bold text-gray-900 mb-2">Discover the perfect setting</h2>
              <p className="text-gray-500">Browse curated venues and pick the one that fits your event.</p>
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
            {filtered.length === 0 ? (
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
                      onClick={() => setSelected(v.id)}
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

            {/* Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <Button variant="outline" onClick={() => navigate("/event-creation/setup")} className="gap-2">
                <ArrowLeft size={16} /> Back
              </Button>
              <Button disabled={!selected} onClick={() => navigate("/event-creation/time-task")} className="gap-2 px-6">
                Next: Time & Task <ArrowRight size={16} />
              </Button>
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  );
}

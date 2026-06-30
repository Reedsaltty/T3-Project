import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../Homepage/Navbar";
import Footer from "../Homepage/Footer";
import {
  Plus, Search, Calendar, Users, MapPin, 
  TrendingUp, CheckCircle2, AlertCircle, Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getEvents } from "../../api/event.api";
import { useEventContext } from "../EventCreation/EventContext";

const statusConfig = {
  upcoming:    { label: "Upcoming",   color: "bg-blue-50 text-blue-600 border-blue-200" },
  in_progress: { label: "In Progress",color: "bg-amber-50 text-amber-600 border-amber-200" },
  completed:   { label: "Completed",  color: "bg-emerald-50 text-emerald-600 border-emerald-200" },
  cancelled:   { label: "Cancelled",  color: "bg-red-50 text-red-600 border-red-200" },
};

const filters = ["All", "Upcoming", "Completed", "Cancelled"];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { resetEventData } = useEventContext();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        const mappedEvents = data.map(e => ({
          id: e.eventId,
          name: e.eventTitle,
          date: new Date(e.eventDate).toLocaleDateString(),
          budget: 50, // mock budget percentage for UI
          guests: e.expectedGuests || e.attendees?.length || 0,
          venue: e.locationLabel || "TBD",
          type: e.eventType?.typeName || "Event",
          status: "upcoming" // mocked for now until backend provides status
        }));
        setEvents(mappedEvents);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleCreateEvent = () => {
    resetEventData();
    navigate("/event-creation/setup");
  };
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("date-asc");


  const filteredAndSorted = events
    .filter(e => {
      const matchSearch = e.name.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === "All" || e.status === filter.toLowerCase().replace(" ", "_");
      return matchSearch && matchFilter;
    })
    .sort((a, b) => {
      if (sortBy === "date-asc") return new Date(a.date) - new Date(b.date);
      if (sortBy === "date-desc") return new Date(b.date) - new Date(a.date);
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "budget") return b.budget - a.budget;
      return 0;
    });

  const stats = [
    { label: "Total Events", value: events.length, icon: <Calendar size={20} />, colorClass: "text-blue-600", bgClass: "bg-blue-50 border-blue-100" },
    { label: "Upcoming", value: events.filter(e => e.status === "upcoming").length, icon: <TrendingUp size={20} />, colorClass: "text-amber-600", bgClass: "bg-amber-50 border-amber-100" },
    { label: "Total Guests", value: events.reduce((a, e) => a + e.guests, 0), icon: <Users size={20} />, colorClass: "text-purple-600", bgClass: "bg-purple-50 border-purple-100" },
    { label: "Completed", value: events.filter(e => e.status === "completed").length, icon: <CheckCircle2 size={20} />, colorClass: "text-emerald-600", bgClass: "bg-emerald-50 border-emerald-100" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-500/30 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[50%] bg-blue-100 rounded-full blur-[100px] opacity-60 pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[40%] bg-blue-50 rounded-full blur-[80px] opacity-60 pointer-events-none" />
      </div>

      <div className="relative z-10">
        <Navbar />
      </div>
      
      <main className="flex-1 py-12 relative z-10">
        <div className="container mx-auto px-6 max-w-7xl">

          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12"
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 tracking-tight mb-2">My Events</h1>
              <p className="text-gray-500 text-lg">Manage and track all your events in one place.</p>
            </div>
            <Button 
              onClick={handleCreateEvent} 
              className="gap-2 bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] border border-blue-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] h-12 px-6 rounded-xl"
            >
              <Plus size={18} /> Create Event
            </Button>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
            {stats.map((s, i) => (
              <motion.div 
                key={s.label} 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                <div className="bg-white border border-gray-200 rounded-2xl p-6 relative overflow-hidden group hover:border-gray-300 shadow-sm transition-all duration-300">
                  <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-40 rounded-full ${s.bgClass.split(' ')[0]} -mr-10 -mt-10 transition-opacity group-hover:opacity-60`} />
                  <div className="relative z-10 flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${s.bgClass} ${s.colorClass}`}>
                      {s.icon}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{s.label}</p>
                      <p className="text-3xl font-heading font-bold text-gray-900 mt-1 leading-none">{s.value}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Toolbar */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 bg-gray-50/50 backdrop-blur-md border border-gray-200 p-2 rounded-2xl md:rounded-full shadow-sm">
            <div className="flex flex-wrap gap-2 px-2 py-2 md:py-0">
              {filters.map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                    filter === f 
                      ? "bg-white text-blue-600 shadow-sm border border-gray-200 scale-105" 
                      : "bg-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto px-2 pb-2 md:p-0 md:pr-2">
              <div className="relative w-full md:w-64">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search events…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-11 h-12 w-full rounded-full bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus-visible:ring-blue-500/50 shadow-sm"
                />
              </div>
              <select 
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="h-12 px-4 rounded-full bg-white border border-gray-200 text-gray-700 text-sm font-semibold focus:ring-2 focus:ring-blue-500/50 outline-none shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <option value="date-asc">Date: Closest</option>
                <option value="date-desc">Date: Furthest</option>
                <option value="name">Name: A-Z</option>
                <option value="budget">Budget: Highest</option>
              </select>
            </div>
          </div>

          {/* Event Cards Grid */}
          <AnimatePresence mode="wait">
            {filteredAndSorted.length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center justify-center gap-4 py-24 bg-gray-50 backdrop-blur-md border border-gray-200 border-dashed rounded-3xl text-center shadow-sm"
              >
                <AlertCircle size={48} className="text-gray-400 mb-2" />
                <h3 className="text-xl font-bold text-gray-900">No events found</h3>
                <p className="text-gray-500 font-medium max-w-md">We couldn't find any events matching your current filters. Try adjusting them or create a new event.</p>
                <Button onClick={handleCreateEvent} className="gap-2 mt-4 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 shadow-sm rounded-xl h-12 px-6">
                  <Plus size={16} /> Create Event
                </Button>
              </motion.div>
            ) : (
              <motion.div 
                key="grid"
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredAndSorted.map(ev => {
                  const sc = statusConfig[ev.status];
                  return (
                    <motion.div key={ev.id} variants={itemVariants} className="h-full">
                      <div 
                        className="group cursor-pointer bg-white border border-gray-200 hover:border-blue-300 rounded-3xl overflow-hidden flex flex-col h-full transition-all duration-500 hover:-translate-y-2 shadow-sm hover:shadow-md"
                        onClick={() => navigate(`/event/${ev.id}`)}
                      >
                        {/* Card Header & Image Area Placeholder */}
                        <div className="h-32 bg-gray-50 relative p-6 flex flex-col justify-between border-b border-gray-100 rounded-t-3xl">
                          <div className="absolute inset-0 overflow-hidden rounded-t-3xl pointer-events-none">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          </div>
                          <div className="flex items-center justify-between relative z-10">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${sc.color}`}>
                              {sc.label}
                            </span>
                          </div>
                          <div className="relative z-10">
                            <span className="text-xs font-bold tracking-wider text-gray-500 uppercase">{ev.type}</span>
                          </div>
                        </div>
                        
                        {/* Card Body */}
                        <div className="p-6 flex flex-col flex-1 gap-4">
                          <h3 className="text-xl font-heading font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">{ev.name}</h3>

                          <div className="flex flex-col gap-3 mt-auto pt-4">
                            <div className="flex items-center gap-3 text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                              <Calendar size={16} className="text-blue-600" />
                              {ev.date}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                              <MapPin size={16} className="text-blue-600" />
                              <span className="truncate max-w-[200px]">{ev.venue}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                              <Users size={16} className="text-blue-600" />
                              {ev.guests} guests
                            </div>
                          </div>

                          {/* Budget Visualizer inside Card */}
                          <div className="mt-4 pt-4 border-t border-gray-100">
                             <div className="flex justify-between items-center mb-2">
                               <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Budget Used</span>
                               <span className="text-xs text-gray-900 font-bold">{ev.budget}%</span>
                             </div>
                             <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                               <motion.div 
                                 initial={{ width: 0 }}
                                 animate={{ width: `${ev.budget}%` }}
                                 transition={{ duration: 1, ease: "easeOut" }}
                                 className={`h-full rounded-full ${ev.budget > 80 ? 'bg-amber-500' : 'bg-blue-600'}`} 
                               />
                             </div>
                          </div>
                        </div>
                        
                        {/* Card Footer */}
                        <div className="p-6 pt-0 mt-auto">
                          <div className="w-full flex items-center justify-center gap-2 py-3 bg-gray-50 hover:bg-blue-50 text-blue-600 rounded-xl text-sm font-semibold transition-colors border border-gray-100 group-hover:border-blue-100">
                            View Event <Play size={14} className="opacity-70" fill="currentColor" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>
      <div className="relative z-10 mt-auto">
        <Footer />
      </div>
    </div>
  );
}

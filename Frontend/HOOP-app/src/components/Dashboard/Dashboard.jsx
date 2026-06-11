import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../Homepage/Navbar";
import Footer from "../Homepage/Footer";
import {
  Plus, Search, Calendar, Users, MapPin, 
  MoreHorizontal, TrendingUp, CheckCircle2, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const mockEvents = [
  { id: 1, name: "Alice's Birthday Bash",   type: "Birthday",    date: "Aug 15, 2026", venue: "Rooftop Garden Hub",   guests: 24, status: "upcoming" },
  { id: 2, name: "Team Q3 Planning",        type: "Meeting",     date: "Jul 10, 2026", venue: "City Conference Hall",  guests: 12, status: "upcoming" },
  { id: 3, name: "Bob & Jane Wedding",      type: "Wedding",     date: "Sep 20, 2026", venue: "Beachside Pavilion",    guests: 85, status: "upcoming" },
  { id: 4, name: "Marketing Kick-off",      type: "Meeting",     date: "May 20, 2026", venue: "Cozy Event Loft",      guests: 8,  status: "completed" },
];

const statusConfig = {
  upcoming:    { label: "Upcoming",   variant: "default",   color: "bg-blue-100 text-blue-700 hover:bg-blue-100" },
  in_progress: { label: "In Progress",variant: "secondary", color: "bg-amber-100 text-amber-700 hover:bg-amber-100" },
  completed:   { label: "Completed",  variant: "outline",   color: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none" },
  cancelled:   { label: "Cancelled",  variant: "destructive", color: "" },
};

const filters = ["All", "Upcoming", "Completed", "Cancelled"];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = mockEvents.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || e.status === filter.toLowerCase().replace(" ", "_");
    return matchSearch && matchFilter;
  });

  const stats = [
    { label: "Total Events", value: mockEvents.length, icon: <Calendar size={18} />, colorClass: "text-blue-600", bgClass: "bg-blue-50" },
    { label: "Upcoming", value: mockEvents.filter(e => e.status === "upcoming").length, icon: <TrendingUp size={18} />, colorClass: "text-amber-600", bgClass: "bg-amber-50" },
    { label: "Total Guests", value: mockEvents.reduce((a, e) => a + e.guests, 0), icon: <Users size={18} />, colorClass: "text-emerald-600", bgClass: "bg-emerald-50" },
    { label: "Completed", value: mockEvents.filter(e => e.status === "completed").length, icon: <CheckCircle2 size={18} />, colorClass: "text-blue-600", bgClass: "bg-blue-50" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      <Navbar />
      <main className="flex-1 py-10">
        <div className="container mx-auto px-6 max-w-6xl">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-heading font-bold text-gray-900 tracking-tight">My Events</h1>
              <p className="text-sm text-gray-500 mt-1">Manage and track all your events in one place.</p>
            </div>
            <Button onClick={() => navigate("/event-creation/setup")} className="gap-2">
              <Plus size={16} /> Create Event
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className="shadow-sm border-gray-100">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${s.bgClass} ${s.colorClass}`}>
                      {s.icon}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{s.label}</p>
                      <p className="text-2xl font-heading font-bold text-gray-900 mt-0.5 leading-none">{s.value}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Toolbar */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div className="flex flex-wrap gap-2">
              {filters.map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    filter === f 
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/20" 
                      : "bg-white text-gray-600 border border-gray-200 hover:border-blue-600 hover:text-blue-600"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search events…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 rounded-full bg-white border-gray-200"
              />
            </div>
          </div>

          {/* Event Cards */}
          {filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center gap-4 py-20 bg-white border-2 border-dashed border-gray-200 rounded-2xl text-center">
              <AlertCircle size={40} className="text-gray-300" />
              <p className="text-gray-500 font-medium">No events found matching your criteria.</p>
              <Button variant="outline" onClick={() => navigate("/event-creation/setup")} className="gap-2 mt-2">
                <Plus size={16} /> Create your first event
              </Button>
            </motion.div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {filtered.map(ev => {
                const sc = statusConfig[ev.status];
                return (
                  <motion.div key={ev.id} variants={itemVariants}>
                    <Card 
                      className="group cursor-pointer hover:shadow-md hover:border-blue-200 transition-all overflow-hidden flex flex-col h-full"
                      onClick={() => navigate(`/event/${ev.id}`)}
                    >
                      <div className="p-5 flex flex-col flex-1 gap-4">
                        <div className="flex items-center justify-between">
                          <Badge className={sc.color} variant={sc.variant}>{sc.label}</Badge>
                          <button className="p-1 text-gray-400 hover:text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                            <MoreHorizontal size={18} />
                          </button>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 leading-tight mb-1">{ev.name}</h3>
                          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{ev.type}</span>
                        </div>

                        <div className="flex flex-col gap-2.5 pt-4 border-t border-gray-100 mt-auto">
                          <div className="flex items-center gap-2 text-sm text-gray-600"><Calendar size={14} className="text-gray-400" />{ev.date}</div>
                          <div className="flex items-center gap-2 text-sm text-gray-600"><MapPin size={14} className="text-gray-400" />{ev.venue}</div>
                          <div className="flex items-center gap-2 text-sm text-gray-600"><Users size={14} className="text-gray-400" />{ev.guests} guests</div>
                        </div>
                      </div>
                      
                      <div className="p-4 pt-0">
                        <Button className="w-full bg-blue-50 text-blue-700 hover:bg-blue-100" variant="secondary" onClick={e => { e.stopPropagation(); navigate(`/event/${ev.id}`); }}>
                          View Details
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
}

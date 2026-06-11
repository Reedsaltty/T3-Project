import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../Homepage/Navbar";
import { ArrowLeft, Edit3, Settings, Share2, Download, Search, Check, X, HelpCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const mockEvent = {
  id: "1",
  name: "Alice's 30th Birthday Bash",
  status: "Upcoming",
  date: "August 15, 2026",
  time: "18:00 - 23:30",
  venue: "Rooftop Garden Hub",
  budget: 50000,
  spent: 32500,
};

const defaultGuests = [
  { id: 1, name: "Charlie Davis",   email: "charlie.d@example.com", rsvp: "attending", table: "A1" },
  { id: 2, name: "Diana Prince",    email: "diana.p@example.com",   rsvp: "not_attending", table: "-" },
  { id: 3, name: "Eve Smith",       email: "eve.s@example.com",     rsvp: "unverified", table: "A2" },
  { id: 4, name: "Frank Johnson",   email: "frank.j@example.com",   rsvp: "attending", table: "B1" },
  { id: 5, name: "Grace Lee",       email: "grace.l@example.com",   rsvp: "unverified", table: "-" },
];

const rsvpStyles = {
  attending:     { label: "Attending",     color: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none", icon: <Check size={12}/>, svgColor: "#10B981" },
  not_attending: { label: "Not Attending", color: "bg-red-100 text-red-700 hover:bg-red-100 border-none",     icon: <X size={12}/>,     svgColor: "#EF4444" },
  unverified:    { label: "Unverified",    color: "bg-gray-100 text-gray-500 hover:bg-gray-100 border-none",  icon: <HelpCircle size={12}/>, svgColor: "#94A3B8" }
};

export default function EventOverview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [guests, setGuests] = useState(defaultGuests);
  const [search, setSearch] = useState("");

  const filteredGuests = guests.filter(g => 
    g.name.toLowerCase().includes(search.toLowerCase()) || 
    g.email.toLowerCase().includes(search.toLowerCase())
  );

  const stats = useMemo(() => {
    const total = guests.length;
    const attending = guests.filter(g => g.rsvp === "attending").length;
    const notAttending = guests.filter(g => g.rsvp === "not_attending").length;
    const unverified = guests.filter(g => g.rsvp === "unverified").length;
    return { total, attending, notAttending, unverified };
  }, [guests]);

  // Toggle RSVP on row click
  function toggleRsvp(id) {
    const cycle = { attending: "not_attending", not_attending: "unverified", unverified: "attending" };
    setGuests(prev => prev.map(g => g.id === id ? { ...g, rsvp: cycle[g.rsvp] } : g));
  }

  // Budget calculations
  const budgetPct = Math.min(100, Math.round((mockEvent.spent / mockEvent.budget) * 100));
  const isOverBudget = budgetPct >= 100;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50 pb-20">
      <Navbar />
      
      {/* Top Action Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-[64px] z-40">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/dashboard")} className="gap-2 -ml-3 text-gray-500">
            <ArrowLeft size={16} /> Dashboard
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" title="Settings"><Settings size={16} /></Button>
            <Button variant="outline" size="icon" title="Share"><Share2 size={16} /></Button>
            <Button className="gap-2"><Edit3 size={16} /> Edit Event</Button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-6 max-w-6xl mt-8 flex flex-col gap-8">
        
        {/* Header Summary */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-end">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 rounded-md">Upcoming</Badge>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">ID: {id}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 tracking-tight leading-tight">{mockEvent.name}</h1>
            <p className="text-gray-500 mt-2 text-lg">{mockEvent.date} • {mockEvent.time} • {mockEvent.venue}</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Column */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            
            {/* Guest Management */}
            <Card className="shadow-sm border-gray-100">
              <CardHeader className="pb-4 border-b border-gray-50 bg-gray-50/30">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <CardTitle>Guest List</CardTitle>
                    <CardDescription>Manage invites and track RSVPs</CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <Input placeholder="Search guests…" value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-9 text-sm rounded-md border-gray-200" />
                    </div>
                    <Button size="sm" variant="outline" className="gap-1.5 h-9"><Download size={14} /> Export</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/50">
                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Guest Name</th>
                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status (Click to toggle)</th>
                        <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Table</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {filteredGuests.map((g) => {
                        const style = rsvpStyles[g.rsvp];
                        return (
                          <motion.tr 
                            key={g.id} 
                            layout
                            className="border-b border-gray-50 hover:bg-gray-50/50 cursor-pointer group transition-colors"
                            onClick={() => toggleRsvp(g.id)}
                          >
                            <td className="px-5 py-3.5 font-medium text-gray-900">{g.name}</td>
                            <td className="px-5 py-3.5 text-gray-500">{g.email}</td>
                            <td className="px-5 py-3.5">
                              <Badge className={`gap-1.5 px-2 py-0.5 rounded-full ${style.color}`}>
                                {style.icon} {style.label}
                              </Badge>
                            </td>
                            <td className="px-5 py-3.5 text-gray-400 font-medium text-right group-hover:text-gray-900 transition-colors">{g.table}</td>
                          </motion.tr>
                        );
                      })}
                      {filteredGuests.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-5 py-12 text-center text-gray-400">No guests found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-sm border-gray-100 border-dashed bg-blue-50/30">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">Need more guests?</h3>
                  <p className="text-sm text-gray-500 mt-1">Import from CSV or add manually.</p>
                </div>
                <Button className="gap-2"><Plus size={16} /> Add Guests</Button>
              </CardContent>
            </Card>

          </div>

          {/* Right Column (Widgets) */}
          <div className="flex flex-col gap-8">
            
            {/* RSVP Overview */}
            <Card className="shadow-sm border-gray-100">
              <CardHeader className="pb-0">
                <CardTitle>RSVP Overview</CardTitle>
                <CardDescription>Real-time attendance ratio</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex justify-center mb-6 relative">
                  <svg viewBox="0 0 36 36" className="w-40 h-40 transform -rotate-90">
                    <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#F1F5F9" strokeWidth="4" />
                    {/* Attending segment */}
                    <circle 
                      cx="18" cy="18" r="15.91549430918954" fill="transparent" 
                      stroke={rsvpStyles.attending.svgColor} strokeWidth="4" 
                      strokeDasharray={`${(stats.attending/stats.total)*100} ${100 - (stats.attending/stats.total)*100}`} 
                      strokeDashoffset="0" 
                      className="transition-all duration-500 ease-out"
                    />
                    {/* Not Attending segment */}
                    <circle 
                      cx="18" cy="18" r="15.91549430918954" fill="transparent" 
                      stroke={rsvpStyles.not_attending.svgColor} strokeWidth="4" 
                      strokeDasharray={`${(stats.notAttending/stats.total)*100} ${100 - (stats.notAttending/stats.total)*100}`} 
                      strokeDashoffset={`-${(stats.attending/stats.total)*100}`} 
                      className="transition-all duration-500 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-heading font-extrabold text-gray-900 leading-none">{stats.total}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Total</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {[
                    { label: "Attending", count: stats.attending, style: rsvpStyles.attending },
                    { label: "Not Attending", count: stats.notAttending, style: rsvpStyles.not_attending },
                    { label: "Unverified", count: stats.unverified, style: rsvpStyles.unverified },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.style.svgColor }} />
                        <span className="text-gray-600">{item.label}</span>
                      </div>
                      <span className="font-semibold text-gray-900">{item.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Budget Analyzer */}
            <Card className="shadow-sm border-gray-100">
              <CardHeader className="pb-4">
                <CardTitle>Budget Analyzer</CardTitle>
                <CardDescription>Track your spending limits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Spent</p>
                      <p className={`text-2xl font-heading font-bold ${isOverBudget ? "text-red-500" : "text-gray-900"}`}>
                        ฿{mockEvent.spent.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Budget</p>
                      <p className="text-lg font-heading font-semibold text-gray-500">
                        ฿{mockEvent.budget.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden flex">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${budgetPct}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full ${isOverBudget ? "bg-red-500" : "bg-blue-600"}`}
                    />
                  </div>

                  <div className="flex justify-between text-xs font-medium mt-1">
                    <span className={isOverBudget ? "text-red-500" : "text-gray-500"}>
                      {budgetPct}% used
                    </span>
                    <span className="text-gray-400">
                      ฿{(mockEvent.budget - mockEvent.spent).toLocaleString()} left
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </main>
    </div>
  );
}

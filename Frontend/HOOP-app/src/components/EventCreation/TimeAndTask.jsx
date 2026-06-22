import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../Homepage/Navbar";
import { ArrowLeft, Plus, Trash2, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const CATEGORIES = ["Ceremony", "Reception", "Entertainment", "Catering", "Logistics", "Other"];

const defaultActivities = [
  { id: 1, name: "Guest Arrival",  time: "18:00", duration: 30, category: "Logistics",      desc: "Welcome guests at the entrance." },
  { id: 2, name: "Dinner Service", time: "18:30", duration: 90, category: "Catering",       desc: "Catered 3-course meal." },
  { id: 3, name: "Cake Cutting",   time: "20:00", duration: 30, category: "Ceremony",       desc: "Birthday cake and desserts." },
  { id: 4, name: "DJ & Dancing",   time: "20:30", duration: 150,category: "Entertainment", desc: "Live DJ set to close the night." },
];

let nextId = 5;

const slideIn = {
  hidden: { opacity: 0, x: 20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

export default function TimeAndTask() {
  const navigate = useNavigate();
  const [eventDate, setEventDate] = useState("");
  const [activities, setActivities] = useState(defaultActivities);
  const [adding, setAdding] = useState(false);
  const [newAct, setNewAct] = useState({ name: "", time: "", duration: 30, category: "Other", desc: "" });

  function addActivity() {
    if (!newAct.name || !newAct.time) return;
    setActivities(a => [...a, { ...newAct, id: nextId++ }].sort((a, b) => a.time.localeCompare(b.time)));
    setNewAct({ name: "", time: "", duration: 30, category: "Other", desc: "" });
    setAdding(false);
  }

  function removeActivity(id) {
    setActivities(a => a.filter(x => x.id !== id));
  }

  const CATEGORY_COLORS = {
    Ceremony: "bg-blue-600 border-blue-600", 
    Reception: "bg-purple-600 border-purple-600", 
    Entertainment: "bg-pink-600 border-pink-600",
    Catering: "bg-amber-600 border-amber-600", 
    Logistics: "bg-emerald-600 border-emerald-600", 
    Other: "bg-gray-500 border-gray-500"
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      <Navbar />
      <main className="flex-1 py-10 pb-20">
        <div className="container mx-auto px-6 max-w-6xl">

          {/* Stepper */}
          <div className="flex items-center bg-white border border-gray-100 rounded-2xl p-5 px-8 shadow-sm mb-10">
            {[
              { n: 1, label: "Set Up Event",    done: true,  active: false },
              { n: 2, label: "Venue Selection", done: true,  active: false },
              { n: 3, label: "Time & Task",     done: false, active: true  },
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

          <motion.div variants={slideIn} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            
            {/* Left — Inputs */}
            <div className="flex flex-col gap-6">
              <Card className="shadow-sm border-gray-100">
                <CardHeader className="pb-4">
                  <CardTitle>Event Date & Time</CardTitle>
                  <CardDescription>Set when your event will take place.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label>Event Date <span className="text-red-500">*</span></Label>
                    <Input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm border-gray-100 overflow-hidden">
                <CardHeader className="pb-4 flex flex-row items-start justify-between bg-white z-10 relative">
                  <div>
                    <CardTitle>Activities</CardTitle>
                    <CardDescription>Add and schedule activities for your timeline.</CardDescription>
                  </div>
                  <Button size="sm" onClick={() => setAdding(true)} className="gap-2 shrink-0">
                    <Plus size={14} /> Add Activity
                  </Button>
                </CardHeader>

                <AnimatePresence>
                  {adding && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: "auto" }} 
                      exit={{ opacity: 0, height: 0 }}
                      className="border-y border-blue-100 bg-blue-50/50 p-6 flex flex-col gap-4 overflow-hidden"
                    >
                      <div className="space-y-2">
                        <Label>Activity Name <span className="text-red-500">*</span></Label>
                        <Input placeholder="e.g. Welcome Speech" value={newAct.name} onChange={e => setNewAct(a => ({ ...a, name: e.target.value }))} className="bg-white" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Time <span className="text-red-500">*</span></Label>
                          <Input type="time" value={newAct.time} onChange={e => setNewAct(a => ({ ...a, time: e.target.value }))} className="bg-white" />
                        </div>
                        <div className="space-y-2">
                          <Label>Duration (min)</Label>
                          <Input type="number" min={5} max={480} step={5} value={newAct.duration} onChange={e => setNewAct(a => ({ ...a, duration: +e.target.value }))} className="bg-white" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <select 
                          className="flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2" 
                          value={newAct.category} 
                          onChange={e => setNewAct(a => ({ ...a, category: e.target.value }))}
                        >
                          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Input placeholder="Short description" value={newAct.desc} onChange={e => setNewAct(a => ({ ...a, desc: e.target.value }))} className="bg-white" />
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Button onClick={addActivity} size="sm">Confirm</Button>
                        <Button variant="outline" onClick={() => setAdding(false)} size="sm" className="bg-white">Cancel</Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex flex-col py-2">
                  <AnimatePresence>
                    {activities.map(act => (
                      <motion.div 
                        key={act.id} 
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        exit={{ opacity: 0, x: 10 }}
                        className="flex items-center justify-between p-4 px-6 border-b border-gray-50 last:border-0 hover:bg-gray-50/80 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${CATEGORY_COLORS[act.category] || CATEGORY_COLORS.Other}`} />
                          <div>
                            <p className="text-sm font-semibold text-gray-900 leading-none mb-1.5">{act.name}</p>
                            <p className="text-xs font-medium text-gray-500">{act.category} · {act.duration} min</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-semibold">
                            <Clock size={12} />{act.time}
                          </div>
                          <button className="text-gray-400 hover:text-red-500 transition-colors p-1" onClick={() => removeActivity(act.id)}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </Card>
            </div>

            {/* Right — Timeline Preview */}
            <div className="lg:sticky lg:top-24 h-fit">
              <Card className="shadow-sm border-gray-100 h-full min-h-[500px]">
                <CardHeader className="border-b border-gray-50 bg-gray-50/50">
                  <CardTitle>Timeline Preview</CardTitle>
                  <CardDescription>Visual schedule of your event day.</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {activities.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-3 text-sm">
                      <Clock size={32} className="opacity-20" />
                      Add activities to see the timeline.
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      {activities.map((act) => (
                        <div key={act.id} className="relative grid grid-cols-[60px_1px_1fr] gap-x-6 gap-y-0">
                          <div className="text-right text-xs font-bold text-blue-600 pt-[18px]">
                            {act.time}
                          </div>
                          <div className="relative bg-gray-200">
                            <div className={`absolute top-[18px] left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-[2px] border-white shadow-[0_0_0_2px_currentColor] z-10 ${CATEGORY_COLORS[act.category]?.split(' ')[0] || "bg-blue-600"} text-${CATEGORY_COLORS[act.category]?.split('-')[1]}-600`} />
                          </div>
                          <div className="py-2 pb-6">
                            <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-4">
                              <p className="text-sm font-semibold text-gray-900">{act.name}</p>
                              {act.desc && <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{act.desc}</p>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-8 mt-6">
            <Button variant="outline" onClick={() => navigate("/event-creation/venue")} className="gap-2">
              <ArrowLeft size={16} /> Back
            </Button>
            <Button onClick={() => navigate("/")} className="gap-2 px-6">
              <CheckCircle2 size={16} /> Create Event
            </Button>
          </div>

        </div>
      </main>
    </div>
  );
}

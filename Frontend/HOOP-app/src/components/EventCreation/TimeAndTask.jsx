import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../Homepage/Navbar";
import { useEventContext } from "./EventContext";
import { ArrowLeft, ArrowRight, Plus, Trash2, CheckCircle2, Clock, Users, MapPin, Calendar, ListTodo, Zap, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";

// API imports
import { createEvent } from "../../api/event.api";
import { bookVenue } from "../../api/venue.api";
import { createAgendaItem } from "../../api/agenda.api";
import { addChecklistItem } from "../../api/checklist.api";
import { addGuest } from "../../api/guest.api";

const CATEGORY_COLORS = {};

let nextId = 5;

const slideIn = {
  hidden: { opacity: 0, x: 20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

export default function TimeAndTask() {
  const navigate = useNavigate();
  const { 
    agenda: activities, setAgenda: setActivities, 
    checklist, setChecklist,
    eventDate, setEventDate,
    form, guests, location, selectedVenueId, resetEventData 
  } = useEventContext();
  const [adding, setAdding] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [newAct, setNewAct] = useState({ name: "", time: "", desc: "" });
  const [newChecklistDesc, setNewChecklistDesc] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function addActivity() {
    if (!newAct.name || !newAct.time) return;
    setActivities(a => [...a, { ...newAct, id: nextId++ }].sort((a, b) => a.time.localeCompare(b.time)));
    setNewAct({ name: "", time: "", desc: "" });
    setAdding(false);
  }

  function removeActivity(id) {
    setActivities(a => a.filter(x => x.id !== id));
  }

  function addChecklistTask() {
    if (!newChecklistDesc.trim()) return;
    setChecklist(c => [...c, { id: nextId++, description: newChecklistDesc.trim() }]);
    setNewChecklistDesc("");
  }

  function removeChecklistTask(id) {
    setChecklist(c => c.filter(x => x.id !== id));
  }

  const handleCreateEvent = async () => {
    setIsSubmitting(true);
    try {
      // === Client-side pre-validation ===
      if (!form.title) return alert("Event title is required.");
      if (!form.eventTypeId) return alert("Please select an event type.");
      if (!eventDate) return alert("Please set the event date.");
      if (!form.startTime) return alert("Please set the event start time.");
      if (!form.endTime) return alert("Please set the event end time.");
      if (form.eventSize === "small" && (!location.lat || !location.lng)) {
        return alert("Please pin a location on the map before submitting.");
      }

      // 1. Create Event
      const eventPayload = {
        eventTitle: form.title,
        eventTypeId: Number(form.eventTypeId),
        eventDate: eventDate,
        eventTime: form.startTime,
        eventEndTime: form.endTime,
        eventSize: form.eventSize,
        description: form.description,
        budget: form.budget ? Number(form.budget) : undefined,
        expectedGuests: form.attendance ? Number(form.attendance) : undefined,
        dressCode: form.dressCode || undefined,
        specialNotes: form.specialNotes || undefined,
      };

      if (form.eventSize === "small") {
        eventPayload.locationLat = location.lat;
        eventPayload.locationLng = location.lng;
        eventPayload.locationAddress = location.address;
        eventPayload.locationLabel = location.label;
      }

      // Fix: backend returns the event object directly (not wrapped in { event })
      const createdEvent = await createEvent(eventPayload);
      const eventId = createdEvent.eventId;

      // 2. Book Venue (if big and selected)
      if (form.eventSize === "big" && selectedVenueId) {
        await bookVenue(selectedVenueId, eventId);
      }

      // 3. Create Agenda Items
      for (const act of activities) {
        const [hours, minutes] = act.time.split(':');
        const start = new Date(eventDate);
        start.setHours(Number(hours), Number(minutes), 0, 0);
        
        await createAgendaItem(eventId, {
          title: act.name,
          description: act.desc || undefined,
          startTime: start.toISOString(),
        });
      }

      // 4. Create Checklist Items
      for (const task of checklist) {
        await addChecklistItem(eventId, { description: task.description });
      }

      // 5. Add Guests
      for (const g of guests) {
        await addGuest(eventId, { name: g.name, email: g.email });
      }

      setShowReview(false);
      resetEventData();
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create event. See console for details.");
    } finally {
      setIsSubmitting(false);
    }
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
              { n: 2, label: form.eventSize === "small" ? "Location" : "Venue Selection", done: true,  active: false },
              { n: 3, label: "Agenda & Task",   done: false, active: true  },
            ].map((s, i, arr) => (
              <div key={s.n} className="flex items-center flex-1">
                <div 
                  className={`flex items-center gap-3 ${s.done ? "cursor-pointer hover:opacity-80" : ""}`}
                  onClick={() => {
                    if (s.n === 1) navigate("/event-creation/setup");
                    if (s.n === 2) navigate("/event-creation/venue");
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

          <motion.div variants={slideIn} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            
            {/* Left — Inputs */}
            <div className="flex flex-col gap-6">


              <Card className="shadow-sm border-gray-100 overflow-hidden">
                <CardHeader className="pb-4 flex flex-row items-start justify-between bg-white z-10 relative">
                  <div>
                    <CardTitle>Agenda</CardTitle>
                    <CardDescription>Add and schedule activities for your timeline.</CardDescription>
                  </div>
                  <Button size="sm" onClick={() => setAdding(true)} className="gap-2 shrink-0">
                    <Plus size={14} /> Add Item
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
                      <div className="space-y-2">
                        <Label>Time <span className="text-red-500">*</span></Label>
                        <Input type="time" value={newAct.time} onChange={e => setNewAct(a => ({ ...a, time: e.target.value }))} className="bg-white" />
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
                          <div>
                            <p className="text-sm font-semibold text-gray-900 leading-none mb-1.5">{act.name}</p>
                            {act.desc && <p className="text-xs font-medium text-gray-500">{act.desc}</p>}
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

              {/* Task Checklist */}
              <Card className="shadow-sm border-gray-100 overflow-hidden">
                <CardHeader className="pb-4">
                  <CardTitle>Task Checklist</CardTitle>
                  <CardDescription>Keep track of things you need to do before the event.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 mb-4">
                    <Input 
                      placeholder="e.g. Confirm headcount" 
                      value={newChecklistDesc}
                      onChange={(e) => setNewChecklistDesc(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addChecklistTask()}
                      className="bg-gray-50/50"
                    />
                    <Button onClick={addChecklistTask} className="shrink-0 gap-1 px-4"><Plus size={16} /> Add</Button>
                  </div>

                  <div className="flex flex-col gap-2">
                    <AnimatePresence>
                      {checklist.map((task) => (
                        <motion.div 
                          key={task.id}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="flex items-center justify-between p-3 px-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-blue-200 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-md border border-gray-300 flex items-center justify-center shrink-0">
                              {/* Empty checkbox since tasks aren't done yet during setup */}
                            </div>
                            <span className="text-sm text-gray-700 font-medium">{task.description}</span>
                          </div>
                          <button onClick={() => removeChecklistTask(task.id)} className="text-gray-400 hover:text-red-500 p-1">
                            <Trash2 size={16} />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {checklist.length === 0 && (
                      <p className="text-center text-sm text-gray-400 py-4">No tasks added yet.</p>
                    )}
                  </div>
                </CardContent>
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
                      Add agenda items to see the timeline.
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      {activities.map((act) => (
                        <div key={act.id} className="relative grid grid-cols-[60px_1px_1fr] gap-x-6 gap-y-0">
                          <div className="text-right text-xs font-bold text-blue-600 pt-[18px]">
                            {act.time}
                          </div>
                          <div className="relative bg-gray-200">
                            <div className="absolute top-[18px] left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-[2px] border-white shadow-[0_0_0_2px_#2563eb] z-10 bg-blue-600" />
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
            <Button onClick={() => setShowReview(true)} className="gap-2 px-6">
              Review Details <ArrowRight size={16} />
            </Button>
          </div>

          <Dialog open={showReview} onOpenChange={setShowReview}>
            <DialogContent className="sm:max-w-[550px] bg-white p-0 overflow-hidden border-0 shadow-2xl rounded-3xl">
              
              {/* Decorative Header Background */}
              <div className="bg-blue-600 h-32 relative flex items-center justify-center overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4"></div>
                <div className="relative z-10 text-center px-6 mt-4">
                  <h2 className="text-3xl font-heading font-bold text-white tracking-tight">Review Event</h2>
                  <p className="text-blue-100 mt-1 font-medium">Almost there! Confirm your details.</p>
                </div>
              </div>

              <div className="px-8 pb-8 pt-6 flex flex-col gap-6">
                
                {/* Highlighted Event Title Card */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 border border-blue-100 rounded-2xl p-5 flex items-start gap-4 shadow-sm">
                  <div className="w-14 h-14 bg-blue-600 rounded-xl shadow-md flex items-center justify-center shrink-0 text-white">
                    <Zap size={28} strokeWidth={2.5} fill="currentColor" />
                  </div>
                  <div className="pt-0.5 flex flex-col justify-center h-14">
                    <h3 className="text-xl font-bold text-gray-900 leading-tight mb-1">{form?.title || "Untitled Event"}</h3>
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-600/10 text-blue-700 uppercase tracking-widest w-fit">
                      {form?.eventSize === "small" ? "Small Event" : "Big Event"}
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 flex flex-col gap-1 hover:border-blue-200 transition-colors group">
                    <div className="flex items-center gap-2 text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">
                      <Users size={16} className="text-purple-500 group-hover:scale-110 transition-transform" /> Guests
                    </div>
                    <span className="text-2xl font-bold text-gray-900 leading-none">{guests?.length || 0}</span>
                    <span className="text-xs font-medium text-gray-400 mt-1">people invited</span>
                  </div>

                  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 flex flex-col gap-1 hover:border-blue-200 transition-colors group">
                    <div className="flex items-center gap-2 text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">
                      <MapPin size={16} className="text-emerald-500 group-hover:scale-110 transition-transform" /> Location
                    </div>
                    <span className="text-xl font-bold text-gray-900 leading-tight truncate">
                      {form.eventSize === "small" 
                        ? (location.label || "Map Pin Location")
                        : (selectedVenueId ? "Venue Selected" : "TBD")}
                    </span>
                    <span className="text-xs font-medium text-gray-400 mt-1">{form.eventSize === "small" ? "address" : "selected venue"}</span>
                  </div>

                  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 flex flex-col gap-1 hover:border-blue-200 transition-colors group">
                    <div className="flex items-center gap-2 text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">
                      <Calendar size={16} className="text-amber-500 group-hover:scale-110 transition-transform" /> Date
                    </div>
                    <span className="text-lg font-bold text-gray-900 leading-tight">{eventDate ? new Date(eventDate).toLocaleDateString() : "Not set"}</span>
                    <span className="text-xs font-medium text-gray-400 mt-1">scheduled for</span>
                  </div>

                  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 flex flex-col gap-1 hover:border-blue-200 transition-colors group">
                    <div className="flex items-center gap-2 text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">
                      <ListTodo size={16} className="text-blue-500 group-hover:scale-110 transition-transform" /> Agenda
                    </div>
                    <span className="text-2xl font-bold text-gray-900 leading-none">{activities?.length || 0}</span>
                    <span className="text-xs font-medium text-gray-400 mt-1">planned in timeline</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
                  <Button variant="outline" className="h-12 px-6 rounded-xl font-semibold" onClick={() => setShowReview(false)} disabled={isSubmitting}>Cancel</Button>
                  <Button 
                    disabled={isSubmitting}
                    className="h-12 px-8 rounded-xl font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all hover:shadow-[0_0_25px_rgba(37,99,235,0.5)]" 
                    onClick={handleCreateEvent}
                  >
                    {isSubmitting ? <><Loader2 size={18} className="animate-spin mr-2" /> Creating...</> : <><CheckCircle2 size={18} className="mr-2" /> Confirm & Create</>}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

        </div>
      </main>
    </div>
  );
}

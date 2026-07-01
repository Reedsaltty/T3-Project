import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../Homepage/Navbar";
import { useEventContext } from "./EventContext";
import { ArrowLeft, ArrowRight, CheckCircle2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { getEventTypes } from "../../api/event.api";

const slideIn = {
  hidden: { opacity: 0, x: 20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

export default function SetUpEvent() {
  const navigate = useNavigate();
  const { form, setForm, guests, setGuests, eventDate, setEventDate } = useEventContext();
  const [errors, setErrors] = useState({});
  const [eventTypes, setEventTypes] = useState([]);
  const [guestInput, setGuestInput] = useState({ email: "", name: "" });

  useEffect(() => {
    getEventTypes()
      .then(data => setEventTypes(data))
      .catch(() => {
        // Fallback to spec-defined types if API fails
        setEventTypes([
          { eventTypeId: 1, typeName: "Birthday" },
          { eventTypeId: 2, typeName: "Wedding" },
          { eventTypeId: 3, typeName: "Corporate" },
          { eventTypeId: 4, typeName: "Gathering" },
          { eventTypeId: 5, typeName: "Party" },
          { eventTypeId: 6, typeName: "Other" },
        ]);
      });
  }, []);

  function setField(field, val) {
    setForm(f => ({ ...f, [field]: val }));
    setErrors(e => ({ ...e, [field]: undefined }));
  }

  function handleInvite(e) {
    e.preventDefault();
    if (!guestInput.email || !guestInput.name) return;
    setGuests([...guests, { id: Date.now(), ...guestInput }]);
    setGuestInput({ email: "", name: "" });
  }

  function removeGuest(id) {
    setGuests(guests.filter(g => g.id !== id));
  }

  function validate() {
    const e = {};
    if (!form.title.trim() || form.title.trim().length < 3) e.title = "Required (min 3 chars)";
    if (!form.eventTypeId) e.eventTypeId = "Required";
    if (!eventDate) e.eventDate = "Required";
    if (!form.startTime) e.startTime = "Required";
    if (!form.endTime) e.endTime = "Required";
    if (form.startTime && form.endTime && form.endTime <= form.startTime) {
      e.endTime = "Must be after start time";
    }
    return e;
  }

  function handleNext(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    navigate("/event-creation/venue");
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      <Navbar />
      <main className="flex-1 py-10 pb-20">
        <div className="container mx-auto px-6 max-w-4xl">

          {/* Stepper */}
          <div className="flex items-center bg-white border border-gray-100 rounded-2xl p-5 px-8 shadow-sm mb-10">
            {[
              { n: 1, label: "Set Up Event",    active: true,  done: false },
              { n: 2, label: form.eventSize === "small" ? "Location" : "Venue", active: false, done: false },
              { n: 3, label: "Timeline & Tasks", active: false, done: false },
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
                {i < arr.length - 1 && <div className="flex-1 h-0.5 mx-4 bg-gray-100" />}
              </div>
            ))}
          </div>

          <motion.div variants={slideIn} initial="hidden" animate="show" className="flex flex-col gap-10">

            {/* 1. Event Details */}
            <div>
              <div className="mb-6">
                <h2 className="text-3xl font-heading font-bold text-gray-900 tracking-tight">Create new event</h2>
                <p className="text-gray-500 mt-1">Set up the core details of your event.</p>
              </div>

              <Card className="shadow-sm border-gray-100 bg-gray-200/50">
                <CardContent className="p-8 pb-10">
                  <form className="flex flex-col gap-6">
                    {/* Row 1: Title + Type */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-gray-700">Event title <span className="text-red-500">*</span></Label>
                        <Input id="title" value={form.title} onChange={e => setField("title", e.target.value)} placeholder="e.g. Jake's Birthday Party" className="bg-white border-0 h-11" />
                        {errors.title && <span className="text-xs text-red-500">{errors.title}</span>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="eventTypeId" className="text-gray-700">Event type <span className="text-red-500">*</span></Label>
                        <select
                          id="eventTypeId"
                          value={form.eventTypeId}
                          onChange={e => setField("eventTypeId", e.target.value)}
                          className="w-full h-11 rounded-md border-0 bg-white px-3 text-gray-900 text-sm ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                          <option value="">Select a type...</option>
                          {eventTypes.map(t => (
                            <option key={t.eventTypeId} value={t.eventTypeId}>{t.typeName}</option>
                          ))}
                        </select>
                        {errors.eventTypeId && <span className="text-xs text-red-500">{errors.eventTypeId}</span>}
                      </div>
                    </div>

                    {/* Row 2: Date */}
                    <div className="space-y-2">
                      <Label htmlFor="eventDate" className="text-gray-700">Event date <span className="text-red-500">*</span></Label>
                      <Input
                        id="eventDate"
                        type="date"
                        min={today}
                        value={eventDate}
                        onChange={e => {
                          setEventDate(e.target.value);
                          setErrors(er => ({ ...er, eventDate: undefined }));
                        }}
                        className="bg-white border-0 h-11"
                      />
                      {errors.eventDate && <span className="text-xs text-red-500">{errors.eventDate}</span>}
                    </div>

                    {/* Row 3: Start/End Time */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="startTime" className="text-gray-700">Start time <span className="text-red-500">*</span></Label>
                        <Input id="startTime" type="time" value={form.startTime} onChange={e => setField("startTime", e.target.value)} onBlur={e => setField("startTime", e.target.value)} className="bg-white border-0 h-11" />
                        {errors.startTime && <span className="text-xs text-red-500">{errors.startTime}</span>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endTime" className="text-gray-700">End time <span className="text-red-500">*</span></Label>
                        <Input id="endTime" type="time" value={form.endTime} onChange={e => setField("endTime", e.target.value)} onBlur={e => setField("endTime", e.target.value)} className="bg-white border-0 h-11" />
                        {errors.endTime && <span className="text-xs text-red-500">{errors.endTime}</span>}
                      </div>
                    </div>

                    {/* Row 4: Expected Guests + Budget (Big Events Only) */}
                    {form.eventSize === "big" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="attendance" className="text-gray-700">Expected attendance</Label>
                          <Input id="attendance" type="number" min="1" placeholder="e.g. 50" value={form.attendance} onChange={e => setField("attendance", e.target.value)} className="bg-white border-0 h-11" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="budget" className="text-gray-700">Budget</Label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">฿</span>
                            <Input id="budget" type="number" min="0" placeholder="e.g. 5,000" value={form.budget} onChange={e => setField("budget", e.target.value)} className="bg-white border-0 h-11 pl-10" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Row 5: Description */}
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-gray-700">Description</Label>
                      <textarea
                        id="description"
                        rows={3}
                        maxLength={1000}
                        placeholder="What's this event about?"
                        value={form.description}
                        onChange={e => setField("description", e.target.value)}
                        className="w-full rounded-md border-0 bg-white px-3 py-2.5 text-sm text-gray-900 ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                      />
                    </div>

                    {/* Row 6: Special Notes */}
                    <div className="space-y-2">
                      <Label htmlFor="specialNotes" className="text-gray-700">Special notes</Label>
                      <Input id="specialNotes" maxLength={500} placeholder="e.g. BYOB, parking behind building" value={form.specialNotes} onChange={e => setField("specialNotes", e.target.value)} className="bg-white border-0 h-11" />
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* 3. Invite Guests */}
            <div>
              <div className="mb-6">
                <h2 className="text-3xl font-heading font-bold text-gray-900 tracking-tight">Invite your guests</h2>
                <p className="text-gray-500 mt-1">Add guests now — they'll be sent invitations after the event is created.</p>
              </div>

              <Card className="shadow-sm border-gray-100 bg-gray-200/50">
                <CardContent className="p-8">
                  <form onSubmit={handleInvite} className="flex flex-col md:flex-row items-end gap-6 mb-8">
                    <div className="space-y-2 flex-1">
                      <Label htmlFor="gEmail" className="font-bold text-gray-900">Email</Label>
                      <Input id="gEmail" type="email" placeholder="johnDoe@email.com" value={guestInput.email} onChange={e => setGuestInput({ ...guestInput, email: e.target.value })} className="bg-white border-0 h-11" />
                    </div>
                    <div className="space-y-2 flex-1">
                      <Label htmlFor="gName" className="font-bold text-gray-900">Name</Label>
                      <Input id="gName" placeholder="John Doe" value={guestInput.name} onChange={e => setGuestInput({ ...guestInput, name: e.target.value })} className="bg-white border-0 h-11" />
                    </div>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-bold h-11 px-8">Add Guest</Button>
                  </form>

                  <div className="bg-gray-300/50 rounded-lg overflow-hidden border border-gray-300">
                    <div className="bg-gray-400/50 py-3 text-center">
                      <span className="text-xs font-bold text-gray-900 uppercase tracking-widest">Attendance list ({guests.length})</span>
                    </div>
                    {guests.length === 0 ? (
                      <div className="py-12 text-center"><p className="text-gray-500">No guests added yet.</p></div>
                    ) : (
                      <div className="max-h-[280px] overflow-y-auto">
                        <table className="w-full text-left bg-white/50">
                          <tbody>
                            {guests.map((g) => (
                              <tr key={g.id} className="border-b border-gray-300 last:border-0 hover:bg-white/80 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900 w-1/2">{g.name}</td>
                                <td className="px-6 py-4 text-gray-600">{g.email}</td>
                                <td className="px-6 py-4 text-right">
                                  <button onClick={() => removeGuest(g.id)} className="text-red-400 hover:text-red-600 p-1.5 rounded-md hover:bg-red-50 transition-colors">
                                    <Trash2 size={15} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6">
              <Button variant="outline" type="button" onClick={() => navigate("/dashboard")} className="gap-2">
                <ArrowLeft size={16} /> Cancel
              </Button>
              <Button type="button" onClick={handleNext} className="gap-2 px-6">
                Next: {form.eventSize === "small" ? "Pin Location" : "Choose Venue"} <ArrowRight size={16} />
              </Button>
            </div>

          </motion.div>
        </div>
      </main>
    </div>
  );
}

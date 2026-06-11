import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../Homepage/Navbar";
import { ArrowLeft, ArrowRight, CheckCircle2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

const slideIn = {
  hidden: { opacity: 0, x: 20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

export default function SetUpEvent() {
  const navigate = useNavigate();
  
  // Event Form State
  const [form, setForm] = useState({
    title: "", 
    type: "", 
    startTime: "", 
    endTime: "", 
    attendance: "", 
    budget: ""
  });
  const [errors, setErrors] = useState({});

  // Guest List State
  const [guests, setGuests] = useState([]);
  const [guestInput, setGuestInput] = useState({ email: "", name: "" });

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
    if (!form.title.trim()) e.title = "Required";
    if (!form.type.trim()) e.type = "Required";
    return e;
  }

  function handleNext(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    navigate("/event-creation/venue");
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      <Navbar />
      <main className="flex-1 py-10 pb-20">
        <div className="container mx-auto px-6 max-w-4xl">

          {/* Stepper */}
          <div className="flex items-center bg-white border border-gray-100 rounded-2xl p-5 px-8 shadow-sm mb-10">
            {[
              { n: 1, label: "Set Up Event",    active: true,  done: false },
              { n: 2, label: "Venue Selection", active: false, done: false },
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
                {i < arr.length - 1 && <div className="flex-1 h-0.5 mx-4 bg-gray-100" />}
              </div>
            ))}
          </div>

          <motion.div variants={slideIn} initial="hidden" animate="show" className="flex flex-col gap-10">
            
            {/* 1. Create New Event Section */}
            <div>
              <div className="mb-6">
                <h2 className="text-3xl font-heading font-bold text-gray-900 tracking-tight">Create new event</h2>
                <p className="text-gray-500 mt-1">Set up your event and manage every detail.</p>
              </div>

              <Card className="shadow-sm border-gray-100 bg-gray-200/50">
                <CardContent className="p-8 pb-10">
                  <form className="flex flex-col gap-6">
                    {/* Row 1 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-gray-700">Event title <span className="text-red-500">*</span></Label>
                        <Input id="title" value={form.title} onChange={e => setField("title", e.target.value)} className="bg-white border-0 h-11" />
                        {errors.title && <span className="text-xs text-red-500">{errors.title}</span>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="type" className="text-gray-700">Event type <span className="text-red-500">*</span></Label>
                        <Input id="type" value={form.type} onChange={e => setField("type", e.target.value)} className="bg-white border-0 h-11" />
                        {errors.type && <span className="text-xs text-red-500">{errors.type}</span>}
                      </div>
                    </div>

                    {/* Row 2 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="startTime" className="text-gray-700">Time (Start)</Label>
                        <Input id="startTime" type="time" value={form.startTime} onChange={e => setField("startTime", e.target.value)} className="bg-white border-0 h-11" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endTime" className="text-gray-700">Time (End)</Label>
                        <Input id="endTime" type="time" value={form.endTime} onChange={e => setField("endTime", e.target.value)} className="bg-white border-0 h-11" />
                      </div>
                    </div>

                    {/* Row 3 */}
                    <div className="space-y-2">
                      <Label htmlFor="attendance" className="text-gray-700">Expected Attendance</Label>
                      <Input id="attendance" type="number" placeholder="e.g. 50" value={form.attendance} onChange={e => setField("attendance", e.target.value)} className="bg-white border-0 h-11" />
                    </div>

                    {/* Row 4 */}
                    <div className="space-y-2">
                      <Label htmlFor="budget" className="text-gray-700">Budget</Label>
                      <Input id="budget" type="number" placeholder="฿" value={form.budget} onChange={e => setField("budget", e.target.value)} className="bg-white border-0 h-11" />
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* 2. Invite Guest Section */}
            <div>
              <div className="mb-6">
                <h2 className="text-3xl font-heading font-bold text-gray-900 tracking-tight">Invite your guest</h2>
              </div>

              <Card className="shadow-sm border-gray-100 bg-gray-200/50">
                <CardContent className="p-8">
                  {/* Add Guest Form */}
                  <form onSubmit={handleInvite} className="flex flex-col md:flex-row items-end gap-6 mb-8">
                    <div className="space-y-2 flex-1">
                      <Label htmlFor="email" className="font-bold text-gray-900">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="Example: johnDoe@email.com" 
                        value={guestInput.email}
                        onChange={e => setGuestInput({ ...guestInput, email: e.target.value })}
                        className="bg-gray-400/30 border-0 h-11 text-gray-900 placeholder:text-gray-600" 
                      />
                    </div>
                    <div className="space-y-2 flex-1">
                      <Label htmlFor="guestName" className="font-bold text-gray-900">Enter guest name</Label>
                      <Input 
                        id="guestName" 
                        placeholder="Example : John Doe" 
                        value={guestInput.name}
                        onChange={e => setGuestInput({ ...guestInput, name: e.target.value })}
                        className="bg-gray-400/30 border-0 h-11 text-gray-900 placeholder:text-gray-600" 
                      />
                    </div>
                    <Button type="submit" className="bg-gray-400 text-gray-900 hover:bg-gray-500 font-bold h-11 px-8">
                      Invite+
                    </Button>
                  </form>

                  {/* Guest List Table */}
                  <div className="bg-gray-300/50 rounded-lg overflow-hidden border border-gray-300">
                    <div className="bg-gray-400/50 py-3 text-center">
                      <span className="text-xs font-bold text-gray-900 uppercase tracking-widest">Attendance list</span>
                    </div>
                    
                    {guests.length === 0 ? (
                      <div className="py-16 text-center">
                        <p className="text-gray-600 text-lg">There 's seem to be no guest Yet</p>
                      </div>
                    ) : (
                      <div className="max-h-[300px] overflow-y-auto">
                        <table className="w-full text-left bg-white/50">
                          <tbody>
                            {guests.map((g) => (
                              <tr key={g.id} className="border-b border-gray-300 last:border-0 hover:bg-white/80 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900 w-1/2">{g.name}</td>
                                <td className="px-6 py-4 text-gray-600">{g.email}</td>
                                <td className="px-6 py-4 text-right">
                                  <button onClick={() => removeGuest(g.id)} className="text-red-500 hover:text-red-700 p-2">
                                    <Trash2 size={16} />
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

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6">
              <Button variant="outline" type="button" onClick={() => navigate("/home")} className="gap-2">
                <ArrowLeft size={16} /> Cancel
              </Button>
              <Button type="button" onClick={handleNext} className="gap-2 px-6">
                Next: Choose Venue <ArrowRight size={16} />
              </Button>
            </div>

          </motion.div>

        </div>
      </main>
    </div>
  );
}

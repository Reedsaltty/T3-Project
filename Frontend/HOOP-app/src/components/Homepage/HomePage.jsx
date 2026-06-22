import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Marquee from "./Marquee";
import { CalendarCheck, Users, BarChart3, MapPin, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: <CalendarCheck size={22} />,
    title: "Event Planning",
    desc: "Set up events in minutes — define your event name, type, date, and description all in one place.",
  },
  {
    icon: <MapPin size={22} />,
    title: "Venue Discovery",
    desc: "Browse curated venue recommendations filtered by capacity, price range, and event type.",
  },
  {
    icon: <Users size={22} />,
    title: "Guest Management",
    desc: "Track RSVPs in real time with a clear, color-coded attendance table and statistics pie chart.",
  },
  {
    icon: <BarChart3 size={22} />,
    title: "Budget Analyzer",
    desc: "Set a total budget, log expenses by category, and visualize your spending at a glance.",
  },
];

const stats = [
  { value: "1,200+", label: "Events Created" },
  { value: "98%",    label: "User Satisfaction" },
  { value: "4x",     label: "Faster Planning" },
  { value: "Free",   label: "To Get Started" },
];

const steps = [
  { num: "01", title: "Set Up Your Event",    desc: "Name it, describe it, and choose the event type in seconds." },
  { num: "02", title: "Choose a Venue",       desc: "Pick from curated recommendations matched to your event." },
  { num: "03", title: "Build Your Timeline",  desc: "Schedule activities and create a visual event timeline." },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

export default function HomePage() {
  const navigate = useNavigate();

  // Mock logged in state
  const isLoggedIn = false;

  const handleStartPlanning = () => {
    if (isLoggedIn) {
      navigate("/event-creation/setup");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="py-20 md:py-28 overflow-hidden relative">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[50%] bg-blue-100 rounded-full blur-[100px] opacity-60 pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[40%] bg-blue-50 rounded-full blur-[80px] opacity-60 pointer-events-none" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <motion.div 
              className="flex flex-col gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1.5 rounded-full text-xs font-semibold w-fit tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                All-in-one Event Platform
              </motion.div>
              
              <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold text-gray-900 tracking-tight leading-[1.1]">
                Plan your event<br />
                <span className="text-blue-600">without the chaos</span>
              </motion.h1>
              
              <motion.p variants={fadeInUp} className="text-lg text-gray-500 leading-relaxed max-w-lg">
                Hoop brings together everything you need — venue browsing, guest tracking, timelines, and budget management — in a single, intuitive platform.
              </motion.p>
              
              <motion.div variants={fadeInUp} className="flex flex-wrap gap-3 mt-2">
                <Button size="lg" onClick={handleStartPlanning} className="gap-2">
                  Start Planning <ArrowRight size={18} />
                </Button>
              </motion.div>

              <motion.ul variants={fadeInUp} className="flex flex-col gap-2 mt-4">
                {["No sign-up fee", "No design experience needed", "Works on any device"].map(t => (
                  <li key={t} className="flex items-center gap-2 text-sm text-gray-500">
                    <CheckCircle2 size={16} className="text-blue-600" />
                    <span>{t}</span>
                  </li>
                ))}
              </motion.ul>
            </motion.div>

            {/* Visual Dashboard Preview */}
            <motion.div 
              className="hidden lg:flex justify-center"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="w-full max-w-sm bg-white border border-gray-200 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden">
                <div className="flex items-center gap-1.5 px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="ml-auto text-[10px] font-medium text-gray-400 uppercase tracking-widest">hoop.app</span>
                </div>
                <div className="p-5 flex flex-col gap-3">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">My Events</p>
                  {[
                    { name: "Alice's Birthday", status: "Upcoming", color: "bg-blue-600" },
                    { name: "Team Q3 Meeting",  status: "Completed", color: "bg-emerald-500" },
                    { name: "Bob & Jane Wedding", status: "Upcoming", color: "bg-blue-600" },
                  ].map(ev => (
                    <div key={ev.name} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                      <div className={`w-2 h-2 rounded-full ${ev.color} shrink-0`} />
                      <span className="text-sm font-semibold text-gray-700 flex-1">{ev.name}</span>
                      <span className="text-[10px] font-medium text-gray-400 uppercase">{ev.status}</span>
                    </div>
                  ))}
                  <div className="flex gap-2 mt-2">
                    {[["3", "Events"], ["12", "Guests"], ["฿45k", "Budget"]].map(([v, l]) => (
                      <div key={l} className="flex-1 bg-blue-50/50 border border-blue-100/50 rounded-lg p-3 flex flex-col items-center gap-1">
                        <span className="font-heading text-lg font-bold text-blue-600 leading-none">{v}</span>
                        <span className="text-[10px] font-medium text-gray-500 uppercase">{l}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Marquee with Competitor Logos */}
      <Marquee />

      {/* ── Stats ───────────────────────────────────────────── */}
      <section className="bg-gray-950 py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(s => (
              <motion.div 
                key={s.label} 
                className="flex flex-col items-center text-center gap-1"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <span className="font-heading text-4xl md:text-5xl font-extrabold text-white tracking-tight">{s.value}</span>
                <span className="text-sm font-medium text-white/50">{s.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="inline-block bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full text-xs font-semibold mb-4 tracking-wider uppercase">Features</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">Everything you need,<br />nothing you don't</h2>
            <p className="text-gray-500 text-lg">Built for non-professional organizers who want power without complexity.</p>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {features.map(f => (
              <motion.div key={f.title} variants={fadeInUp} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-5">
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── How it Works ─────────────────────────────────────── */}
      <section className="py-24 bg-gray-50 border-y border-gray-200">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="inline-block bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold mb-4 tracking-wider uppercase">How it works</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900">Three steps to your<br />perfect event</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 relative">
            {steps.map((s, i) => (
              <motion.div 
                key={s.num} 
                className="flex flex-col gap-3 relative z-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.5 }}
              >
                <span className="font-heading text-5xl font-extrabold text-blue-600 tracking-tighter leading-none">{s.num}</span>
                <h3 className="text-lg font-semibold text-gray-900 mt-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────── */}
      <section className="py-24 bg-blue-600 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500 rounded-full blur-[120px] opacity-50 translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center gap-6 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-white leading-tight">Ready to plan your next event?</h2>
            <p className="text-blue-100 text-lg">Join hundreds of hosts who simplified their event planning with Hoop.</p>
            <Button size="lg" variant="secondary" onClick={handleStartPlanning} className="mt-4 gap-2 text-blue-600">
              Get Started — It's Free <ArrowRight size={18} />
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
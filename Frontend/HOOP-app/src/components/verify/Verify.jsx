import { useState, useEffect } from "react";
import { ArrowRight, CalendarCheck, Users, BarChart3, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Login from "./LogIn";
import Register from "./Register";

const slides = [
  {
    icon: <CalendarCheck size={36} strokeWidth={1.5} className="text-white" />,
    title: "Plan Every Detail",
    subtitle: "Bring your event to life",
    body: "From intimate gatherings to large celebrations — Hoop gives you the tools to plan every detail in one place.",
  },
  {
    icon: <Users size={36} strokeWidth={1.5} className="text-white" />,
    title: "Manage Your Guests",
    subtitle: "Real-time RSVP tracking",
    body: "Keep your guest list organized. Track RSVPs, manage attendance, and stay on top of who's coming.",
  },
  {
    icon: <BarChart3 size={36} strokeWidth={1.5} className="text-white" />,
    title: "Stay on Budget",
    subtitle: "Smart expense tracking",
    body: "Set a budget, log expenses by category, and always know exactly where your money is going.",
  },
];

export default function Verify() {
  const [slide, setSlide] = useState(0);
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    const t = setInterval(() => {
      setSlide(s => (s + 1) % slides.length);
    }, 4500);
    return () => clearInterval(t);
  }, []);

  const current = slides[slide];

  return (
    <div className="flex min-h-screen w-full bg-white font-sans">
      {/* ── Left Panel (Brand / Carousel) ── */}
      <div className="hidden lg:flex w-[45%] min-h-screen bg-gray-950 relative overflow-hidden items-center justify-center p-14">
        {/* Decorative Gradients */}
        <div className="absolute top-[-80px] right-[-80px] w-80 h-80 rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.25)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute bottom-[-60px] left-[-60px] w-60 h-60 rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.15)_0%,transparent_70%)] pointer-events-none" />

        <div className="relative z-10 flex flex-col justify-between w-full max-w-md h-full py-10">
          
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap size={18} fill="white" strokeWidth={0} />
            </div>
            <span className="font-heading font-bold text-2xl text-white tracking-tight">Hoop</span>
          </div>

          {/* Slide Content */}
          <div className="flex flex-col gap-6 mt-16 mb-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="flex flex-col gap-4"
              >
                <div className="w-16 h-16 bg-white/10 border border-white/5 rounded-2xl flex items-center justify-center mb-2">
                  {current.icon}
                </div>
                <p className="text-xs font-bold tracking-widest uppercase text-blue-400">
                  {current.subtitle}
                </p>
                <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-white leading-[1.1] tracking-tight">
                  {current.title}
                </h1>
                <p className="text-base text-white/60 leading-relaxed max-w-sm mt-2">
                  {current.body}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots + Next */}
          <div className="flex items-center gap-6 mt-12">
            <div className="flex gap-2.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlide(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === slide ? "w-6 bg-blue-600" : "w-1.5 bg-white/20 hover:bg-white/40"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
            <button 
              className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
              onClick={() => setSlide(s => (s + 1) % slides.length)}
              aria-label="Next slide"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Right Panel (Form) ── */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white overflow-hidden relative">
        <div className="w-full max-w-[400px] relative">
          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <Login onSwitchView={() => setIsLogin(false)} />
              </motion.div>
            ) : (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Register onSwitchView={() => setIsLogin(true)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

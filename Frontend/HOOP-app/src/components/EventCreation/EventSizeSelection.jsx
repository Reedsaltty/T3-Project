import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../Homepage/Navbar";
import { useEventContext } from "./EventContext";
import { Home, Building2, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const slideIn = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

export default function EventSizeSelection() {
  const navigate = useNavigate();
  const { form, setForm } = useEventContext();

  const handleNext = () => {
    navigate("/event-creation/setup");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      <Navbar />
      <main className="flex-1 py-12 md:py-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div variants={slideIn} initial="hidden" animate="show" className="flex flex-col gap-10">
            
            <div className="text-center">
              <span className="inline-block bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full text-xs font-semibold mb-4 tracking-wider uppercase">Step 1 of 4</span>
              <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-gray-900 tracking-tight">What kind of event?</h1>
              <p className="text-gray-500 text-lg mt-3 max-w-xl mx-auto">This determines how you set the location and which features you need. This cannot be changed later.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto w-full">
              {[
                {
                  size: "small",
                  icon: Home,
                  title: "Small Event",
                  subtitle: "House party, dinner, study group",
                  desc: "Keep it simple. You'll just pin your exact location on a map. No venue booking required.",
                  color: "blue",
                },
                {
                  size: "big",
                  icon: Building2,
                  title: "Big Event",
                  subtitle: "Wedding, gala, conference",
                  desc: "Go all out. You'll browse curated professional venues, track budgets, and manage formal RSVPs.",
                  color: "purple",
                },
              ].map(({ size, icon: Icon, title, subtitle, desc, color }) => {
                const isSelected = form.eventSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setForm({ ...form, eventSize: size })}
                    className={`text-left p-8 rounded-3xl border-2 transition-all duration-300 relative group overflow-hidden ${
                      isSelected
                        ? `border-${color}-500 bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] scale-[1.02]`
                        : "border-gray-200 bg-white/50 hover:bg-white hover:border-gray-300 hover:shadow-md"
                    }`}
                  >
                    {isSelected && (
                      <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-20 rounded-full bg-${color}-500 -mr-10 -mt-10`} />
                    )}
                    
                    <div className="relative z-10">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors ${isSelected ? `bg-${color}-100` : "bg-gray-100 group-hover:bg-gray-200"}`}>
                        <Icon size={28} className={isSelected ? `text-${color}-600` : "text-gray-400"} />
                      </div>
                      <h3 className="font-heading font-bold text-gray-900 text-2xl mb-1">{title}</h3>
                      <p className={`font-semibold mb-3 ${isSelected ? `text-${color}-600` : "text-gray-500"}`}>{subtitle}</p>
                      <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                      
                      <div className={`mt-6 inline-flex items-center gap-2 text-sm font-bold px-3 py-1.5 rounded-full transition-all ${
                        isSelected 
                          ? `text-${color}-700 bg-${color}-50 opacity-100 transform translate-y-0` 
                          : "opacity-0 transform translate-y-2"
                      }`}>
                        <CheckCircle2 size={16} /> Selected
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-center mt-6">
              <Button onClick={handleNext} size="lg" className="h-14 px-10 text-lg gap-2 bg-blue-600 hover:bg-blue-500 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]">
                Continue Setup <ArrowRight size={20} />
              </Button>
            </div>

          </motion.div>
        </div>
      </main>
    </div>
  );
}

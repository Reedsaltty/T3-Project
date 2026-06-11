import { motion } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Users, Zap, Calendar, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const values = [
  { icon: <Zap size={24} />, title: "Simplicity First", desc: "Event planning shouldn't require a degree in project management. We build tools that are intuitive and straightforward." },
  { icon: <Users size={24} />, title: "Built for Everyone", desc: "Whether you're organizing a small birthday or a corporate retreat, Hoop adapts to your specific needs." },
  { icon: <Heart size={24} />, title: "Stress-Free", desc: "We handle the logistics—tracking RSVPs, budgets, and timelines—so you can focus on making memories." },
  { icon: <Calendar size={24} />, title: "Reliability", desc: "We ensure your data is always safe, your invites go out on time, and your planning process never stops." }
];

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-20 pb-16 md:pt-32 md:pb-24 bg-gray-50/50 border-b border-gray-100 overflow-hidden relative">
          <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[80%] bg-blue-100 rounded-full blur-[120px] opacity-60 pointer-events-none" />
          <div className="container mx-auto px-6 relative z-10 text-center max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
                We believe event planning should be a <span className="text-blue-600">joy</span>, not a chore.
              </h1>
              <p className="text-lg md:text-xl text-gray-500 leading-relaxed">
                Hoop was founded in 2024 to bridge the gap between complex enterprise event software and messy spreadsheets. We provide a single, beautiful platform for everyday organizers.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -30 }} 
                whileInView={{ opacity: 1, x: 0 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.6 }}
                className="flex flex-col gap-6"
              >
                <h2 className="text-3xl font-heading font-bold text-gray-900">Our Story</h2>
                <div className="flex flex-col gap-4 text-gray-600 leading-relaxed">
                  <p>
                    It started with a wedding. Our founders struggled to keep track of RSVPs scattered across text messages, emails, and phone calls. Budgets were constantly exceeded, and timeline planning was a nightmare of overlapping schedules.
                  </p>
                  <p>
                    We realized that while professional event planners had robust tools, everyday people were left to figure it out on their own. That's why we built Hoop.
                  </p>
                  <p>
                    Today, Hoop helps thousands of people organize everything from intimate dinners to large-scale conferences, all within a sleek, easy-to-use interface.
                  </p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 30 }} 
                whileInView={{ opacity: 1, x: 0 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.6 }}
                className="relative rounded-3xl overflow-hidden bg-gray-100 aspect-square md:aspect-[4/5] flex items-center justify-center border border-gray-200"
              >
                {/* Abstract placeholder for team/office image */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100/50" />
                <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200 rounded-full blur-[60px]" />
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-emerald-200 rounded-full blur-[60px]" />
                <div className="relative z-10 w-24 h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center -rotate-6">
                  <Zap size={40} className="text-blue-600" />
                </div>
                <div className="absolute inset-0 ring-1 ring-inset ring-gray-900/10 rounded-3xl" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 md:py-28 bg-gray-950 text-white">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Our Core Values</h2>
              <p className="text-gray-400 text-lg">These principles guide everything we design and build.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((v, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 20 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }} 
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex flex-col gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="w-12 h-12 bg-blue-600/20 text-blue-400 rounded-xl flex items-center justify-center mb-2">
                    {v.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{v.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-white text-center">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-heading font-bold text-gray-900 mb-6">Ready to plan your next event?</h2>
            <Button size="lg" onClick={() => navigate("/event-creation/setup")} className="px-8 h-12 text-base">
              Get Started for Free
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

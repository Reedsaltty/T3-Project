import { Zap } from "lucide-react";
import { Link } from "react-router-dom";

const cols = [
  { heading: "Product",      links: [{ name: "Dashboard", to: "/dashboard" }, { name: "Event Creation", to: "/event-creation/setup" }, { name: "Venue Selection", to: "/event-creation/venue" }, { name: "Timeline Builder", to: "/event-creation/time-task" }] },
  { heading: "Resources",    links: [{ name: "Documentation", to: "#" }, { name: "FAQs", to: "#" }, { name: "Support", to: "/contact" }, { name: "Changelog", to: "#" }] },
  { heading: "Company",      links: [{ name: "About Us", to: "/about" }, { name: "Contact", to: "/contact" }, { name: "Privacy Policy", to: "#" }, { name: "Terms of Service", to: "#" }] },
];

export default function Footer() {
  return (
    <footer className="bg-gray-950 pt-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-2 w-fit group">
              <img src="/favicon.svg" alt="Hoop Logo" className="w-8 h-8 transition-transform group-hover:scale-105" />
              <span className="font-heading text-xl font-bold text-white tracking-tight">Hoop</span>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed max-w-xs">
              The all-in-one event planning platform built for everyone — from birthday parties to corporate gatherings.
            </p>
            <div className="flex gap-2 mt-2">
              {["X", "IG", "TK", "LI"].map(s => (
                <a 
                  key={s} 
                  href="#" 
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-white/50 hover:bg-blue-600 hover:text-white hover:border-transparent transition-all"
                  aria-label={s}
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-8">
            {cols.map(col => (
              <div key={col.heading}>
                <p className="text-xs font-bold text-white/70 uppercase tracking-widest mb-4">{col.heading}</p>
                <ul className="flex flex-col gap-3">
                  {col.links.map(link => (
                    <li key={link.name}>
                      <Link to={link.to} className="text-sm text-white/40 hover:text-white transition-colors">{link.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="h-px bg-white/10" />

        <div className="py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/30">
          <p>© 2026 Hoop. All rights reserved.</p>
          <div className="flex gap-6">
            {["Terms of Service", "Privacy Policy", "Cookies"].map(t => (
              <a key={t} href="#" className="hover:text-white/70 transition-colors">{t}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
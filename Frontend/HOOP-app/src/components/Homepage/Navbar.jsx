import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { Menu, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Home",      to: "/home" },
  { label: "Inventory", to: "/inventory" },
  { label: "About",     to: "/about" },
  { label: "Contact",   to: "/contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <button className="flex items-center gap-2 group" onClick={() => navigate("/home")}>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white transition-transform group-hover:scale-105">
            <Zap size={16} fill="white" strokeWidth={0} />
          </div>
          <span className="text-xl font-heading font-bold text-gray-900 tracking-tight">Hoop</span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => 
                `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive 
                    ? "text-blue-600 bg-blue-50" 
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <Button 
            className="hidden md:flex" 
            onClick={() => navigate("/event-creation/setup")}
          >
            Create Event
          </Button>
          <button
            className="md:hidden p-2 text-gray-600 hover:bg-gray-50 rounded-md"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white p-4 flex flex-col gap-2 shadow-lg absolute w-full left-0">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className="px-4 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <Button 
            className="w-full mt-2"
            onClick={() => { setMenuOpen(false); navigate("/event-creation/setup"); }}
          >
            Create Event
          </Button>
        </div>
      )}
    </header>
  );
}
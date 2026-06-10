import { LogOut, Menu } from "lucide-react";
import { useState } from "react";

const navLinks = ["HOME", "CONTACT", "ABOUT US", "INVENTORY"];

export default function Navbar({ onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full px-8 py-5 flex items-center justify-between border-b border-black/10" style={{ backgroundColor: "#f2f0f0" }}>
      <span className="font-extrabold text-xl text-black tracking-tight">LOGO</span>
      
      {/* Desktop Menu */}
      <ul className="hidden md:flex items-center gap-10">
        {navLinks.map((link) => (
          <li key={link}>
            <a href="#" className="text-sm font-medium text-black hover:opacity-60 transition-opacity tracking-wide">{link}</a>
          </li>
        ))}
      </ul>

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        <button onClick={onLogout} className="hidden md:flex items-center gap-2 text-sm font-medium text-black hover:opacity-60 transition-opacity">
          <LogOut size={16} /> Log out
        </button>
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="absolute top-16 left-0 right-0 z-50 px-8 py-6 flex flex-col gap-4 border-b border-black/10" style={{ backgroundColor: "#f2f0f0" }}>
          {navLinks.map((link) => (
            <a key={link} href="#" className="text-sm font-medium text-black">{link}</a>
          ))}
          <button onClick={onLogout} className="flex items-center gap-2 text-sm font-medium text-black">
            <LogOut size={16} /> Log out
          </button>
        </div>
      )}
    </nav>
  );
}
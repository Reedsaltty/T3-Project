import { useState } from "react";
import { X, Instagram, LogOut, Menu } from "lucide-react";
import { motion as Motion } from "motion/react";


function HeroDiagram() {
  return (
    <div className="relative w-full max-w-2xl mx-auto h-64 flex items-center justify-center">
      {/* Center box — devices */}
      <div className="absolute flex flex-col items-center" style={{ left: "50%", top: "50%", transform: "translate(-50%,-50%)" }}>
        <div className="w-20 h-20 rounded-2xl border-2 border-black flex items-center justify-center" style={{ backgroundColor: "#d9d9d9" }}>
          <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="black" strokeWidth="1.5">
            <rect x="2" y="3" width="15" height="11" rx="2" />
            <path d="M17 8h3a2 2 0 012 2v7a2 2 0 01-2 2H8a2 2 0 01-2-2v-1" />
          </svg>
        </div>
        {/* lines outward */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ left: "-160px", top: "-60px", width: "400px", height: "180px" }} viewBox="0 0 400 180" fill="none">
          <line x1="200" y1="90" x2="60" y2="90" stroke="black" strokeWidth="2" />
          <line x1="200" y1="90" x2="340" y2="90" stroke="black" strokeWidth="2" />
          <line x1="200" y1="90" x2="120" y2="30" stroke="black" strokeWidth="2" />
          <line x1="200" y1="90" x2="280" y2="30" stroke="black" strokeWidth="2" />
          <line x1="200" y1="90" x2="120" y2="150" stroke="black" strokeWidth="2" />
          <line x1="200" y1="90" x2="280" y2="150" stroke="black" strokeWidth="2" />
        </svg>
      </div>

      {/* Left box — person */}
      <div className="absolute flex flex-col items-center" style={{ left: "2%", top: "50%", transform: "translateY(-50%)" }}>
        <div className="w-16 h-16 rounded-xl border-2 border-black flex items-center justify-center" style={{ backgroundColor: "#d9d9d9" }}>
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="black" strokeWidth="1.5">
            <circle cx="12" cy="7" r="4" /><path d="M4 21v-1a8 8 0 0116 0v1" />
          </svg>
        </div>
      </div>

      {/* Right box — groups */}
      <div className="absolute flex flex-col items-center" style={{ right: "2%", top: "50%", transform: "translateY(-50%)" }}>
        <div className="w-16 h-16 rounded-xl border-2 border-black flex items-center justify-center" style={{ backgroundColor: "#d9d9d9" }}>
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="black" strokeWidth="1.5">
            <circle cx="9" cy="7" r="3" /><circle cx="17" cy="7" r="3" />
            <path d="M1 21v-1a7 7 0 0112-4.9M13 21v-1a7 7 0 00-1.9-4.8" />
          </svg>
        </div>
      </div>

      {/* Small accent boxes */}
      <div className="absolute w-10 h-10 rounded-lg border-2 border-black" style={{ backgroundColor: "#d9d9d9", left: "28%", top: "5%" }} />
      <div className="absolute w-10 h-10 rounded-lg border-2 border-black" style={{ backgroundColor: "#d9d9d9", right: "28%", top: "5%" }} />
      <div className="absolute w-10 h-10 rounded-lg border-2 border-black" style={{ backgroundColor: "#d9d9d9", left: "28%", bottom: "5%" }} />
      <div className="absolute w-10 h-10 rounded-lg border-2 border-black" style={{ backgroundColor: "#d9d9d9", right: "28%", bottom: "5%" }} />
    </div>
  );
}

function Marquee() {
  const items = ["LOREM", "LOREM", "LOREM", "LOREM", "LOREM", "LOREM"];
  const allItems = [...items, ...items];
  return (
    <div className="w-full py-5 overflow-hidden border-y border-black/5" style={{ backgroundColor: "#d9d9d9" }}>
      <Motion.div 
        className="flex gap-16 w-max"
        animate={{ x: ["-50%", "0%"] }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {allItems.map((item, i) => (
          <span key={i} className="text-black font-light text-lg whitespace-nowrap shrink-0">{item}</span>
        ))}
      </Motion.div>
    </div>
  );
}

function ContentSection({ title, body, imageLeft }) {
  const image = (
    <div className="w-full md:w-[45%] rounded-2xl border border-black/20 aspect-[4/3]" style={{ backgroundColor: "#d9d9d9" }} />
  );
  const text = (
    <div className="w-full md:w-[50%]">
      <h3 className="font-extrabold text-2xl text-black mb-4">{title}</h3>
      <p className="text-sm text-black leading-relaxed" style={{ opacity: 0.7 }}>{body}</p>
    </div>
  );
  return (
    <div className={`flex flex-col md:flex-row items-center gap-10 py-16 px-8 max-w-5xl mx-auto ${imageLeft ? "" : "md:flex-row-reverse"}`}>
      {imageLeft ? <>{image}{text}</> : <>{text}{image}</>}
    </div>
  );
}

function Footer() {
  const cols = [
    { heading: "PRODUCT", links: ["Lorem Ipsum", "Lorem Ipsum", "Lorem Ipsum", "Lorem Ipsum"] },
    { heading: "RESOURCES", links: ["Lorem Ipsum", "Lorem Ipsum", "Lorem Ipsum", "Lorem Ipsum"] },
    { heading: "ORGANIZATION", links: ["Lorem Ipsum", "Lorem Ipsum", "Lorem Ipsum", "Lorem Ipsum"] },
  ];

  return (
    <footer className="w-full border-t border-black/10 px-8 py-12" style={{ backgroundColor: "#d9d9d9" }}>
      <div className="max-w-6xl mx-auto">
        {/* Top row */}
        <div className="flex flex-col md:flex-row gap-12 mb-10">
          {/* Brand */}
          <div className="md:w-1/3">
            <p className="font-extrabold text-4xl text-black mb-3">Logo</p>
            <p className="text-xs text-black leading-relaxed mb-5" style={{ opacity: 0.7 }}>
              Lorem ipsum dolor sit amet consectetur adipiscing elit. Sit amet consectetur adipiscing elit quisque faucibus ex sapien vitae pellentesque.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-4">
              <a href="#" className="w-8 h-8 rounded-full border border-black/30 flex items-center justify-center hover:opacity-60 transition-opacity" style={{ backgroundColor: "#f2f0f0" }}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M2.175 3l7.588 10.126L2 21h1.719l6.688-7.655L16.25 21H22l-7.944-10.605L20.586 3h-1.719l-6.012 6.882L7.925 3H2.175z"/></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-black/30 flex items-center justify-center hover:opacity-60 transition-opacity" style={{ backgroundColor: "#f2f0f0" }}>
                <Instagram size={14} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-black/30 flex items-center justify-center hover:opacity-60 transition-opacity" style={{ backgroundColor: "#f2f0f0" }}>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.26 8.26 0 004.83 1.55V6.79a4.85 4.85 0 01-1.06-.1z"/></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-black/30 flex items-center justify-center hover:opacity-60 transition-opacity" style={{ backgroundColor: "#f2f0f0" }}>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
            </div>
          </div>

          {/* Link columns */}
          <div className="md:w-2/3 flex flex-wrap gap-10 md:justify-end">
            {cols.map((col) => (
              <div key={col.heading}>
                <p className="font-extrabold text-sm text-black mb-3">{col.heading}</p>
                <ul className="space-y-2">
                  {col.links.map((link, i) => (
                    <li key={i}>
                      <a href="#" className="text-xs text-black hover:opacity-60 transition-opacity">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-black mb-6" />

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-black" style={{ opacity: 0.7 }}>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v2h-2zm0 4h2v6h-2z"/></svg>
            Present HOOP. All right reserved
          </div>
          <div className="flex items-center gap-6">
            {["Terms of service", "Privacy Policy", "Cookies Setting"].map((t) => (
              <a key={t} href="#" className="text-xs text-black underline hover:opacity-60 transition-opacity">{t}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

const loremBody = "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.";

export default function HomePage({ onLogout }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#f2f0f0", fontFamily: "Inter, sans-serif" }}>
      <Navbar onLogout={onLogout} />

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-8 pt-12 pb-6">
        <HeroDiagram />
        <h1 className="font-extrabold text-5xl md:text-6xl text-black leading-tight mb-4">
          ALL IN ONE<br />PLATEFORM
        </h1>
        <p className="text-sm text-black mb-8 max-w-sm leading-relaxed" style={{ opacity: 0.6 }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
        </p>
        <button className="px-8 py-3 rounded-xl text-sm font-medium text-black transition-opacity hover:opacity-70" style={{ backgroundColor: "#d9d9d9" }}>
          Create Your Event
        </button>
      </section>

      {/* Marquee */}
      <Marquee />

      {/* Content sections */}
      <div className="w-full border-b border-black/10">
        <ContentSection title="LOREM IPSUM" body={loremBody} imageLeft={true} />
      </div>
      <div className="w-full border-b border-black/10">
        <ContentSection title="LOREM IPSUM" body={loremBody} imageLeft={false} />
      </div>

      <Footer />
    </div>
  );
}
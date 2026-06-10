export default function HeroDiagram() {
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
        {/* Lines outward */}
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

      {/* Accent mini boxes */}
      <div className="absolute w-10 h-10 rounded-lg border-2 border-black" style={{ backgroundColor: "#d9d9d9", left: "28%", top: "5%" }} />
      <div className="absolute w-10 h-10 rounded-lg border-2 border-black" style={{ backgroundColor: "#d9d9d9", right: "28%", top: "5%" }} />
      <div className="absolute w-10 h-10 rounded-lg border-2 border-black" style={{ backgroundColor: "#d9d9d9", left: "28%", bottom: "5%" }} />
      <div className="absolute w-10 h-10 rounded-lg border-2 border-black" style={{ backgroundColor: "#d9d9d9", right: "28%", bottom: "5%" }} />
    </div>
  );
}
import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import LogIn from "./LogIn";
import { Register } from "./Register";

export default function Verify() {
  const [slide, setSlide] = useState(0);
  const [animating, setAnimating] = useState(false);
  // 1. Added state to track whether to show Login or Register view
  const [isLogin, setIsLogin] = useState(false); 

  function nextSlide() {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setSlide((s) => (s + 1) % slides.length);
      setAnimating(false);
    }, 300);
  }

  function goToSlide(i) {
    if (animating || i === slide) return;
    setAnimating(true);
    setTimeout(() => {
      setSlide(i);
      setAnimating(false);
    }, 300);
  }

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [slide, animating]);

  const slides = [
    {
      title: '"App Title"',
      subtitle: "Bring Your Event to Life",
      body: "Plan, manage, and celebrate every moment with ease. Your events deserve the best.",
    },
    {
      title: "User Experience",
      subtitle: "Designed for Everyone",
      body: "Intuitive tools that make event planning effortless — whether it's an intimate gathering or a large-scale production.",
    },
    {
      title: "Stay Connected",
      subtitle: "Real-Time Updates",
      body: "Keep your guests informed and engaged with live notifications, schedules, and seamless communication.",
    },
  ];
  
  const current = slides[slide];

  return (
    // 2. Added "flex min-h-screen w-full overflow-hidden" to keep left & right panels split 50/50
    <div className="flex min-h-screen w-full overflow-hidden" style={{ backgroundColor: "#f2f0f0", fontFamily: "Inter, sans-serif" }}>
      
      {/* Left panel — 50% */}
      <div className="w-1/2 min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-16 relative overflow-hidden">
        <div
          style={{
            transition: "opacity 0.3s ease, transform 0.3s ease",
            opacity: animating ? 0 : 1,
            transform: animating ? "translateY(16px)" : "translateY(0)",
          }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-black leading-tight mb-4 break-words">
            {current.title}
          </h1>
          <p className="text-2xl text-black font-normal mb-3">
            {current.subtitle}
          </p>
          <p className="text-base text-black opacity-60 max-w-sm leading-relaxed">
            {current.body}
          </p>
        </div>

        {/* Dots + arrow */}
        <div className="absolute bottom-12 md:bottom-16 left-6 md:left-12 lg:left-16 flex items-center gap-4">
          <div className="flex gap-2 mr-4">
            {slides.map((_, i) => (
              <div
                key={i}
                onClick={() => goToSlide(i)}
                className="rounded-full cursor-pointer transition-all"
                style={{
                  width: i === slide ? 20 : 8,
                  height: 8,
                  backgroundColor: i === slide ? "#1c1b1f" : "#d9d9d9",
                }}
              />
            ))}
          </div>
          <button
            onClick={nextSlide}
            className="w-14 h-14 rounded-full flex items-center justify-center transition-opacity hover:opacity-70 active:scale-95"
            style={{ backgroundColor: "#d9d9d9" }}
          >
            <ChevronRight size={28} color="#1c1b1f" />
          </button>
        </div>
      </div>

      {/* Right panel — 50% (Conditionally rendering form with dynamic screen swap) */}
      <div className="w-1/2 min-h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-md overflow-hidden py-4">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              width: "200%",
              transform: isLogin ? "translateX(0%)" : "translateX(-50%)",
            }}
          >
            <div className="w-1/2 flex-shrink-0 flex justify-center px-2">
              <LogIn onSwitchView={() => setIsLogin(false)} />
            </div>
            <div className="w-1/2 flex-shrink-0 flex justify-center px-2">
              <Register onSwitchView={() => setIsLogin(true)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


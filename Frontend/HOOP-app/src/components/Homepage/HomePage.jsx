import Navbar from "./Navbar";
import HeroDiagram from "./Herodiagram";
import Marquee from "./Marquee";
import ContentSection from "./ContentSection";
import Footer from "./Footer";

const loremBody = "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.";

export default function HomePage({ onLogout }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#f2f0f0", fontFamily: "Inter, sans-serif" }}>
      <Navbar onLogout={onLogout} />

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center px-8 pt-12 pb-6">
        <HeroDiagram />
        <h1 className="font-extrabold text-5xl md:text-6xl text-black leading-tight mb-4">
          ALL IN ONE<br />PLATFORM
        </h1>
        <p className="text-sm text-black mb-8 max-w-sm leading-relaxed" style={{ opacity: 0.6 }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
        </p>
        <button className="px-8 py-3 rounded-xl text-sm font-medium text-black transition-opacity hover:opacity-70" style={{ backgroundColor: "#d9d9d9" }}>
          Create Your Event
        </button>
      </section>

      {/* Marquee Loop Animation */}
      <Marquee />

      {/* Alternating Content Layouts */}
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
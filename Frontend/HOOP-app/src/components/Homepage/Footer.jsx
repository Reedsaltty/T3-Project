import { FiInstagram as Instagram} from 'react-icons/fi' ;
export default function Footer() {
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
                    <li key={i}><a href="#" className="text-xs text-black hover:opacity-60 transition-opacity">{link}</a></li>
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
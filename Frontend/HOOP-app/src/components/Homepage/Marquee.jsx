import InfiniteMarquee from "../OtherSources/infiniteMarquee";

const companies = [
  "EVENTYAY", "ZOLA", "THEBASH", "EVENTBRITE", "CVENT", "BIZZABO", "HOPIN"
];

export default function Marquee() {
  return (
    <div className="w-full py-8 overflow-hidden bg-white border-y border-gray-100 flex items-center justify-center relative">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
      
      <p className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] uppercase font-bold tracking-widest text-gray-400 z-20">
        Trusted by alternatives to
      </p>

      <div className="w-full mt-4 text-2xl font-black text-gray-300 tracking-tighter overflow-hidden relative">
        <InfiniteMarquee 
          className="im-1"
          dataArray={companies}
          speed={50000}
          direction="left"
        />
      </div>
    </div> 
  );
}
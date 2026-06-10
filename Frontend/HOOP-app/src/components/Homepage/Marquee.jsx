
import  InfiniteMarquee  from 'vanilla-infinite-marquee'

export default function Marquee() {
  const items = ["LOREM", "LOREM", "LOREM"];
  // Perfectly doubles the track array length
  const allItems = [...items, ...items];
  const marquee = new InfiniteMarquee({
    elements: '.marquee-track',
    speed:1000,
    direction : 'right' ,
    pauseOnHover:true, 
    mobileSettings : {
      direction : 'right' ,
      speed : 2000
    } 
    
    });

  return (
    // Outer wrapper hides the trailing layout clones
    <>
   
    <div className="w-full py-5 overflow-hidden border-y border-black/5" style={{ backgroundColor: "#d9d9d9" }}>
      
    </div> 
    
    </>
  );
}
{allItems.map((item, i) => (
          <span key={i} className="text-black font-light text-lg whitespace-nowrap shrink-0">
            {item}
          </span>
        ))}
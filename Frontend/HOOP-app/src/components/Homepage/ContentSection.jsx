export default function ContentSection({ title, body, imageLeft }) {
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
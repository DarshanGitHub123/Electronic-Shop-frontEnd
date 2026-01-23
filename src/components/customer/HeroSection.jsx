import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const banners = [
  {
    id: 1,
    title: "Latest Electronics",
    subtitle: "Up to 50% Off on Premium Gadgets",
    gradient: "from-purple-600 via-pink-600 to-red-600",
  },
  {
    id: 2,
    title: "Smart Devices",
    subtitle: "Experience the Future Today",
    gradient: "from-blue-600 via-cyan-600 to-teal-600",
  },
  {
    id: 3,
    title: "Audio Excellence",
    subtitle: "Premium Sound, Unbeatable Prices",
    gradient: "from-orange-600 via-amber-600 to-yellow-600",
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % banners.length);
  const prev = () => setCurrent((c) => (c - 1 + banners.length) % banners.length);

  return (
    <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden group">
      {/* Banner */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${banners[current].gradient} transition-all duration-700 flex items-center justify-center`}
      >
        <div className="text-center px-6">
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 animate-fade-in">
            {banners[current].title}
          </h1>
          <p className="text-sm md:text-lg text-white/90">
            {banners[current].subtitle}
          </p>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/30"
      >
        <ChevronLeft className="w-5 h-5 text-white" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/30"
      >
        <ChevronRight className="w-5 h-5 text-white" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === current ? "bg-white w-6" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

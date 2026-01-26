import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { getBanners } from "../../api/banner.api";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const [banners, setBanners] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        const res = await getBanners();
        setBanners(res.data);
      } catch (err) {
        console.error("Failed to fetch banners", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length > 0) {
      const timer = setInterval(() => {
        setCurrent((prev) => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [banners]);

  const next = (e) => {
    e.stopPropagation();
    setCurrent((prev) => (prev + 1) % banners.length);
  };

  const prev = (e) => {
    e.stopPropagation();
    setCurrent((c) => (c - 1 + banners.length) % banners.length);
  };

  const handleBannerClick = () => {
    const currentBanner = banners[current];
    if (currentBanner.collectionId) {
      const collectionId = typeof currentBanner.collectionId === 'string'
        ? currentBanner.collectionId
        : currentBanner.collectionId._id;
      navigate(`/collections/${collectionId}`);
    }
  };

  if (loading) {
    return (
      <div className="h-48 md:h-80 rounded-2xl animate-pulse bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (banners.length === 0) return null;

  return (
    <div
      className="relative h-48 md:h-80 rounded-3xl overflow-hidden group shadow-2xl cursor-pointer"
      onClick={handleBannerClick}
    >
      {/* Banner Items */}
      {banners.map((banner, idx) => (
        <div
          key={banner._id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === current ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover transform scale-105 group-hover:scale-110 transition-transform duration-10000"
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 max-w-2xl">
            <h1 className="text-2xl md:text-5xl font-bold text-white mb-3 md:mb-4 tracking-tight leading-tight">
              {banner.title}
            </h1>
            <p className="text-sm md:text-xl text-white/80 line-clamp-2 md:line-clamp-none font-medium">
              {banner.subtitle}
            </p>
            {banner.collectionId && (
              <button className="mt-6 md:mt-8 px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-sm md:text-base font-bold rounded-xl w-fit transition-all shadow-lg shadow-orange-600/20 active:scale-95">
                Explore Collection
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <div className="absolute inset-y-0 left-0 flex items-center p-4">
        <button
          onClick={prev}
          className="bg-white/10 backdrop-blur-xl p-2 md:p-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-all border border-white/10 hover:bg-white/20"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </button>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center p-4">
        <button
          onClick={next}
          className="bg-white/10 backdrop-blur-xl p-2 md:p-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-all border border-white/10 hover:bg-white/20"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-8 md:left-16 flex gap-2">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={(e) => { e.stopPropagation(); setCurrent(idx); }}
            className={`h-1.5 rounded-full transition-all duration-300 ${idx === current ? "bg-orange-600 w-10 shadow-lg shadow-orange-600/30" : "bg-white/30 w-4 hover:bg-white/50"
              }`}
          />
        ))}
      </div>
    </div>
  );
}

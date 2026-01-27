import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../../api/category.api";
import { Smartphone, Headphones, Laptop, Watch, Camera, Tv, Monitor, Package } from "lucide-react";

const getIcon = (name) => {
    const lower = name.toLowerCase();
    if (lower.includes("phone")) return Smartphone;
    if (lower.includes("audio") || lower.includes("headphone")) return Headphones;
    if (lower.includes("laptop")) return Laptop;
    if (lower.includes("watch")) return Watch;
    if (lower.includes("camera")) return Camera;
    if (lower.includes("tv")) return Tv;
    if (lower.includes("monitor")) return Monitor;
    return Package; // Default icon
};

const colors = [
    "from-blue-500 to-blue-600",
    "from-purple-500 to-purple-600",
    "from-green-500 to-green-600",
    "from-orange-500 to-orange-600",
    "from-pink-500 to-pink-600",
    "from-red-500 to-red-600",
    "from-cyan-500 to-cyan-600",
    "from-indigo-500 to-indigo-600",
];

export default function CategorySection() {
    const [categories, setCategories] = useState([]);
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        getCategories().then(res => setCategories(res.data));
    }, []);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const handleWheel = (e) => {
            if (e.deltaY === 0) return;
            e.preventDefault();
            container.scrollLeft += e.deltaY;
        };

        // Passive: false is crucial for e.preventDefault() to work
        container.addEventListener("wheel", handleWheel, { passive: false });
        // Also add mouseenter/leave to help focus? No, reliable wheel should be enough.
        // Let's also ensure style overflow is visible to events.

        return () => container.removeEventListener("wheel", handleWheel);
    }, [categories]); // Re-bind if categories change, though ref persists. Empty dep is fine mostly but let's be safe if ref updates? no ref doesn't trigger effect.

    return (
        <div className="py-6 scroll-smooth">
            <style>
                {`
                    .no-scrollbar::-webkit-scrollbar { display: none; }
                    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                    .custom-scrollbar::-webkit-scrollbar { height: 4px; }
                    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.2); border-radius: 10px; }
                    .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.4); }
                `}
            </style>

            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white">
                    Shop by Category
                </h2>
                <div className="text-xs text-blue-500 md:hidden animate-pulse">
                    Scroll →
                </div>
            </div>

            {/* 
              Mobile First: 
              - Use grid with auto-flow-col for easy scrolling row.
              - 'auto-cols-fr' or fixed width? "Listed at even distance" -> gap is uniform.
              - "justify-between" works if items < screen width, but here we scroll. 
              - Let's stick to flex but add 'justify-between' wrapper logic or just gap.
              - USER REQUEST: "categories listed at even distance" 
            */}
            <div
                ref={scrollContainerRef}
                className="flex items-start gap-6 md:gap-10 overflow-x-auto pb-6 px-2 custom-scrollbar snap-x scroll-smooth w-full"
            >
                {categories.map((cat, index) => {
                    const Icon = getIcon(cat.categoryName);
                    const color = colors[index % colors.length];
                    return (
                        <Link
                            key={cat._id}
                            to={`/category/${cat._id}`}
                            className="flex-shrink-0 flex flex-col items-center gap-3 group snap-center w-20 md:w-28 text-center"
                        >
                            <div
                                className={`w-16 h-16 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg group-hover:shadow-blue-500/20 group-hover:scale-110 transition-all duration-300 transform rotate-3 group-hover:rotate-0`}
                            >
                                <Icon className="w-8 h-8 md:w-12 md:h-12 text-white drop-shadow-md" />
                            </div>
                            <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 group-hover:text-blue-500 transition-colors">
                                {cat.categoryName}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

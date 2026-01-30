import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../../api/product.api";
import {
    Smartphone,
    Headphones,
    Laptop,
    Watch,
    Camera,
    Tv,
    Monitor,
    Package,
} from "lucide-react";

const getIcon = (name = "") => {
    const lower = name.toLowerCase();
    if (lower.includes("phone")) return Smartphone;
    if (lower.includes("audio") || lower.includes("headphone")) return Headphones;
    if (lower.includes("laptop")) return Laptop;
    if (lower.includes("watch")) return Watch;
    if (lower.includes("camera")) return Camera;
    if (lower.includes("tv")) return Tv;
    if (lower.includes("monitor")) return Monitor;
    return Package;
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

import { useLocation } from "../../context/LocationContext";

export default function CategorySection() {
    const [categories, setCategories] = useState([]);
    const scrollContainerRef = useRef(null);
    const { pincode } = useLocation();

    useEffect(() => {
        getProducts("", pincode)
            .then((res) => {
                const products = res.data || [];
                // Extract unique categories from products
                const categoryMap = new Map();
                products.forEach(product => {
                    const cat = product.category;
                    if (cat && cat._id && !categoryMap.has(cat._id)) {
                        // Apply showCustomer logic
                        if (cat.showCustomer !== false) {
                            categoryMap.set(cat._id, cat);
                        }
                    }
                });

                // Convert map back to array and sort if needed (optional, keeping original order if possible)
                const visibleCategories = Array.from(categoryMap.values());
                setCategories(visibleCategories);
            })
            .catch(console.error);
    }, [pincode]);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const handleWheel = (e) => {
            if (e.deltaY === 0) return;
            e.preventDefault();
            container.scrollLeft += e.deltaY;
        };

        container.addEventListener("wheel", handleWheel, { passive: false });

        return () =>
            container.removeEventListener("wheel", handleWheel);
    }, []);

    return (
        <div className="py-6 scroll-smooth">
            <style>
                {`
          .custom-scrollbar::-webkit-scrollbar { height: 4px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(59,130,246,0.25);
            border-radius: 10px;
          }
          .custom-scrollbar:hover::-webkit-scrollbar-thumb {
            background: rgba(59,130,246,0.45);
          }
        `}
            </style>

            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white">
                    Shop by Category
                </h2>
                <span className="text-xs text-blue-500 md:hidden animate-pulse">
                    Scroll →
                </span>
            </div>

            <div
                ref={scrollContainerRef}
                className="flex gap-6 md:gap-10 overflow-x-auto pb-6 px-2 custom-scrollbar snap-x w-full"
            >
                {categories.map((cat, index) => {
                    const Icon = getIcon(cat.categoryName);
                    const color = colors[index % colors.length];

                    return (
                        <Link
                            key={cat._id}
                            to={`/category/${cat._id}`}
                            className="flex-shrink-0 flex flex-col items-center gap-3 snap-center w-20 md:w-28 text-center group"
                        >
                            <div
                                className={`w-16 h-16 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br ${color}
                flex items-center justify-center shadow-lg
                group-hover:scale-110 transition-all duration-300`}
                            >
                                {cat.image ? (
                                    <img
                                        src={cat.image}
                                        alt={cat.categoryName}
                                        className="w-full h-full object-cover rounded-2xl"
                                    />
                                ) : (
                                    <Icon className="w-8 h-8 md:w-12 md:h-12 text-white" />
                                )}
                            </div>

                            <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider
                text-gray-500 dark:text-gray-400 group-hover:text-blue-500 transition-colors">
                                {cat.categoryName}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

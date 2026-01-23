import { Smartphone, Headphones, Laptop, Watch, Camera, Tv } from "lucide-react";

const categories = [
    { id: 1, name: "Phones", icon: Smartphone, color: "from-blue-500 to-blue-600" },
    { id: 2, name: "Audio", icon: Headphones, color: "from-purple-500 to-purple-600" },
    { id: 3, name: "Laptops", icon: Laptop, color: "from-green-500 to-green-600" },
    { id: 4, name: "Watches", icon: Watch, color: "from-orange-500 to-orange-600" },
    { id: 5, name: "Cameras", icon: Camera, color: "from-pink-500 to-pink-600" },
    { id: 6, name: "TVs", icon: Tv, color: "from-red-500 to-red-600" },
];

export default function CategorySection() {
    return (
        <div className="py-6">
            <h2 className="text-lg md:text-xl font-bold mb-4 text-gray-800 dark:text-white">
                Shop by Category
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                        <button
                            key={cat.id}
                            className="flex-shrink-0 flex flex-col items-center gap-2 group"
                        >
                            <div
                                className={`w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                            >
                                <Icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                            </div>
                            <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
                                {cat.name}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

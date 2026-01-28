import { useEffect, useState } from "react";
import { getCollections } from "../../api/collection.api";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export default function CollectionsSection() {
    const [collections, setCollections] = useState([]);

    useEffect(() => {
        getCollections().then(res => {
            const sorted = res.data.sort((a, b) => (a.rank || 999) - (b.rank || 999));
            setCollections(sorted);
        });
    }, []);

    if (collections.length === 0) return null;

    return (
        <div className="py-6">
            <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-purple-600" />
                <h2 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white">
                    Featured Collections
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {collections.map((collection) => (
                    <Link
                        key={collection._id}
                        to={`/collections/${collection._id}`}
                        className="group relative h-48 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                    >
                        {/* Background Image or Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-red-600">
                            {collection.image ? (
                                <img
                                    src={collection.image}
                                    alt={collection.title}
                                    className="w-full h-full object-cover opacity-80"
                                />
                            ) : null}
                        </div>

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                        {/* Content */}
                        <div className="absolute inset-0 p-6 flex flex-col justify-end">
                            <h3 className="text-2xl font-bold text-white mb-2 group-hover:scale-105 transition-transform">
                                {collection.title || ""}
                            </h3>
                            {collection.description && (
                                <p className="text-sm text-white/90 line-clamp-2">
                                    {collection.description || ""}
                                </p>
                            )}
                            <div className="mt-3 inline-flex items-center text-white font-medium text-sm">
                                Explore Collection
                                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>

                        {/* Shine Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    </Link>
                ))}
            </div>
        </div>
    );
}

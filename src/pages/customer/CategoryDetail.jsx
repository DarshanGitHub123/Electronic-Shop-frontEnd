import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCategoryById } from "../../api/category.api";
import { getProducts } from "../../api/product.api";
import { useLocation } from "../../context/LocationContext";
import ProductCard from "../../components/product/ProductCard";
import { ChevronLeft, LayoutGrid, Package } from "lucide-react";

export default function CategoryDetail() {
    const { id } = useParams();
    const [category, setCategory] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { pincode } = useLocation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [catRes, prodRes] = await Promise.all([
                    getCategoryById(id),
                    getProducts("", pincode),
                ]);
                setCategory(catRes.data);

                // Filter products by category ID
                const filtered = prodRes.data.filter(
                    (p) => (p.category?._id || p.category) === id
                );
                setProducts(filtered);
            } catch (error) {
                console.error("Error fetching category details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, pincode]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!category) {
        return (
            <div className="text-center py-20">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Category not found</h2>
                <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">Go back home</Link>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* HEADER SECTION */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-8 md:p-12 text-white shadow-2xl">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <LayoutGrid size={120} />
                </div>

                <Link
                    to="/"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-md transition-all text-sm mb-6 border border-white/10"
                >
                    <ChevronLeft size={16} />
                    Back to Shop
                </Link>

                <div className="relative z-10 max-w-2xl">
                    <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight uppercase">
                        {category.categoryName}
                    </h1>
                    <p className="text-blue-100 text-lg md:text-xl leading-relaxed opacity-90 font-medium">
                        {category.description || `Explore our exclusive range of ${category.categoryName}`}
                    </p>
                </div>

                <div className="mt-8 flex items-center gap-4">
                    <div className="px-4 py-2 bg-white text-blue-600 rounded-full font-bold shadow-lg">
                        {products.length} Products
                    </div>
                    <div className="text-white/80 text-sm font-medium">
                        Free Delivery on all items
                    </div>
                </div>
            </div>

            {/* PRODUCTS GRID */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-8 bg-blue-600 rounded-full"></div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        {category.categoryName} Products
                    </h2>
                </div>

                {products.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-slate-700">
                        <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 font-medium">No products found in this category.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

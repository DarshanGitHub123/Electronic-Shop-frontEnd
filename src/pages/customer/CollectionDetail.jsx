import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCollections } from "../../api/collection.api";
import { getProducts } from "../../api/product.api";
import ProductCard from "../../components/product/ProductCard";
import { Sparkles, Package } from "lucide-react";
import { useLocation } from "../../context/LocationContext";

export default function CollectionDetail() {
    const { id } = useParams();
    const [collection, setCollection] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { pincode } = useLocation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch all collections and find the current one
                const collectionsRes = await getCollections();
                const currentCollection = collectionsRes.data.find(c => c._id === id);

                if (!currentCollection) {
                    setCollection(null);
                    setProducts([]);
                    setLoading(false);
                    return;
                }

                setCollection(currentCollection);

                // Fetch products filtered by pincode
                const productsRes = await getProducts("", pincode);

                // Filter products that are in this collection's products array
                const collectionProductIds = currentCollection.products.map(p =>
                    typeof p === 'string' ? p : p._id
                );

                const collectionProducts = productsRes.data.filter(product =>
                    collectionProductIds.includes(product._id)
                );

                setProducts(collectionProducts);
            } catch (error) {
                console.error("Error fetching collection data:", error);
                setCollection(null);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id, pincode]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!collection) {
        return (
            <div className="text-center py-12">
                <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                    Collection not found
                </h2>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Collection Header */}
            <div className="relative h-64 rounded-2xl overflow-hidden mb-8 shadow-xl">
                {/* Background */}
                {/* <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-red-600"> */}
                {/* removed gradient overlay */}
                <div className="absolute inset-0 ">
                    {collection.image && (
                        <img
                            src={collection.image}
                            alt={collection.title}
                            className="w-full h-full object-cover opacity-60"
                        />
                    )}
                </div>

                {/* Overlay */}
                {/* <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" /> */}

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                    <div className="flex items-center gap-3 mb-3">
                        <Sparkles className="w-8 h-8 text-yellow-400" />
                        <h1 className="text-4xl md:text-5xl font-bold text-white">
                            {collection.title}
                        </h1>
                    </div>
                    {collection.description && (
                        <p className="text-lg text-white/90 max-w-2xl">
                            {collection.description}
                        </p>
                    )}
                    <p className="text-sm text-white/80 mt-2">
                        {products.length} {products.length === 1 ? 'product' : 'products'} in this collection
                    </p>
                </div>
            </div>

            {/* Products Grid */}
            {products.length === 0 ? (
                <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center border border-gray-200 dark:border-slate-700">
                    <Package className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        No Products Yet
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        This collection doesn't have any products yet. Check back soon!
                    </p>
                </div>
            ) : (
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                        Products
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {products.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

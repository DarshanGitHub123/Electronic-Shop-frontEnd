import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../../api/category.api";
import { getProducts } from "../../api/product.api";
import { useLocation } from "../../context/LocationContext";
import ProductCard from "../product/ProductCard";
import { ChevronRight } from "lucide-react";

export default function CategoryWiseProducts() {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const { pincode } = useLocation();

    useEffect(() => {
        const fetchData = async () => {
            const [categoriesRes, productsRes] = await Promise.all([
                getCategories(),
                getProducts("", pincode)
            ]);
            setCategories(categoriesRes.data);
            setProducts(productsRes.data);
        };
        fetchData();
    }, [pincode]);

    // Group products by category
    const getProductsByCategory = (categoryId) => {
        return products.filter(product =>
            product.category?._id === categoryId || product.category === categoryId
        ).slice(0, 4); // Show only 4 products per category
    };

    if (categories.length === 0) return null;

    return (
        <div className="space-y-8">
            {categories.map(category => {
                const categoryProducts = getProductsByCategory(category._id);

                // Skip categories with no products
                if (categoryProducts.length === 0) return null;

                return (
                    <div key={category._id} className="space-y-4">
                        {/* Category Header */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
                                <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
                                    {category.categoryName}
                                </h2>
                            </div>
                            <Link
                                to={`/category/${category._id}`}
                                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                            >
                                View All
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {/* Products Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {categoryProducts.map(product => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

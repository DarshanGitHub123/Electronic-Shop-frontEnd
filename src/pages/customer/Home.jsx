import ProductGrid from "../../components/product/ProductGrid";
import HeroSection from "../../components/customer/HeroSection";
import CategorySection from "../../components/customer/CategorySection";
import CollectionsSection from "../../components/customer/CollectionsSection";
import CategoryWiseProducts from "../../components/customer/CategoryWiseProducts";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Hero Banner */}
      <HeroSection />

      {/* Categories */}
      <CategorySection />

      {/* Collections */}
      <CollectionsSection />

      {/* Category-Wise Products */}
      <CategoryWiseProducts />

      {/* All Products Section */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-8 bg-gradient-to-b from-green-600 to-emerald-600 rounded-full"></div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
            All Products
          </h2>
        </div>
        <ProductGrid />
      </div>
    </div>
  );
}

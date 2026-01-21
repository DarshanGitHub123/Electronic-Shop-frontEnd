import ProductGrid from "../../components/product/ProductGrid";

export default function Home() {
  return (
    <div className="space-y-6">
      <div className="h-40 bg-gray-200 flex items-center justify-center rounded">
        <h1 className="text-lg font-semibold">Electronics Store</h1>
      </div>

      <h2 className="font-semibold text-base">Featured Products</h2>
      <ProductGrid />
    </div>
  );
}

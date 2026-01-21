import { useEffect, useState } from "react";
import { getProducts } from "../../api/product.api";
import ProductCard from "./ProductCard";

export default function ProductGrid() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then(res => setProducts(res.data));
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {products.map(p => <ProductCard key={p._id} product={p} />)}
    </div>
  );
}

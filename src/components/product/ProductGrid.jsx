import { useEffect, useState, useMemo } from "react";
import { getProducts } from "../../api/product.api";
import { useLocation } from "../../context/LocationContext";
import ProductCard from "./ProductCard";

export default function ProductGrid() {
  const [products, setProducts] = useState([]);
  const { pincode } = useLocation();

  useEffect(() => {
    getProducts("", pincode).then(res => setProducts(res.data));
  }, [pincode]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {products.map(p => <ProductCard key={p._id} product={p} />)}
    </div>
  );
}

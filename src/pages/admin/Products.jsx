import { useEffect, useState, useMemo } from "react";
import {
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
} from "../../api/product.api";
import { getCategories } from "../../api/category.api";
import { PackagePlus, Search, Loader2 } from "lucide-react";

export default function AdminProducts() {
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [images, setImages] = useState([]);
  const [oldImages, setOldImages] = useState([]); // ✅ NEW: PREVIEW OLD IMAGES
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ NEW: LOADING STATE

  const [recommended, setRecommended] = useState([]);
  const [showRecommendedDropdown, setShowRecommendedDropdown] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    discount: "",      // ✅ NEW
    stock: "",
    tax: "",
    category: "",
  });

  const [specs, setSpecs] = useState([{ key: "", value: "" }]);

  /* ===============================
     LOAD INITIAL DATA
     =============================== */
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const productsRes = await getProducts();
        const categoriesRes = await getCategories();
        setAllProducts(productsRes.data);
        setCategories(categoriesRes.data);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  /* ===============================
     FRONTEND SEARCH
     =============================== */
  const filteredProducts = useMemo(() => {
    if (!search.trim()) return allProducts;
    return allProducts.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, allProducts]);

  const refreshProducts = async () => {
    const res = await getProducts();
    setAllProducts(res.data);
  };

  /* ===============================
     SPEC HANDLERS
     =============================== */
  const updateSpec = (index, field, value) => {
    const updated = [...specs];
    updated[index][field] = value;
    setSpecs(updated);
  };

  const addSpecRow = () => {
    setSpecs([...specs, { key: "", value: "" }]);
  };

  const removeSpecRow = (index) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  /* ===============================
     RECOMMENDED HANDLER
     =============================== */
  const toggleRecommended = (productId) => {
    setRecommended((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  /* ===============================
     SUBMIT PRODUCT
     =============================== */
  const submitProduct = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const specifications = {};
      specs.forEach((s) => {
        if (s.key && s.value) specifications[s.key] = s.value;
      });

      const formData = new FormData();

      Object.entries({
        ...form,
        price: Number(form.price),
        discount: Number(form.discount || 0), // ✅ SEND DISCOUNT
        stock: Number(form.stock),
        tax: Number(form.tax),
        specifications: JSON.stringify(specifications),
      }).forEach(([k, v]) => formData.append(k, v));

      formData.append(
        "recommendedProducts",
        JSON.stringify(recommended)
      );

      images.forEach((img) => formData.append("images", img));

      editId
        ? await updateProduct(editId, formData)
        : await createProduct(formData);

      resetForm();
      refreshProducts();
    } catch (error) {
      console.error("SUBMIT ERROR:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ===============================
     RESET FORM
     =============================== */
  const resetForm = () => {
    setEditId(null);
    setForm({
      name: "",
      description: "",
      price: "",
      discount: "",      // ✅ RESET DISCOUNT
      stock: "",
      tax: "",
      category: "",
    });
    setImages([]);
    setOldImages([]);    // ✅ RESET OLD IMAGES
    setSpecs([{ key: "", value: "" }]);
    setRecommended([]);
  };

  /* ===============================
     EDIT PRODUCT
     =============================== */
  const editProduct = (p) => {
    setEditId(p._id);

    setForm({
      name: p.name,
      description: p.description || "",
      price: p.price,
      discount: p.discount || "",       // ✅ PREFILL DISCOUNT
      stock: p.stock,
      tax: p.tax ?? "",
      category: p.category?._id || p.category,
    });

    setOldImages(p.images || []);       // ✅ PREVIEW OLD IMAGES

    setRecommended(
      (p.recommendedProducts || []).map((rp) =>
        typeof rp === "string" ? rp : rp._id
      )
    );

    const specArray = Object.entries(p.specifications || {}).map(
      ([key, value]) => ({ key, value })
    );
    setSpecs(specArray.length ? specArray : [{ key: "", value: "" }]);
  };

  return (
    <div className="space-y-10">

      {/* HEADER */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
          <PackagePlus size={20} />
        </div>
        <h1 className="text-xl font-semibold tracking-wide">
          Products
        </h1>
      </div>

      {/* ADD / EDIT PRODUCT FORM */}
      <form
        onSubmit={submitProduct}
        className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl p-6 space-y-6 shadow-glass"
      >
        <h2 className="text-base font-semibold text-white">
          {editId ? "Edit Product" : "Add New Product"}
        </h2>

        {/* BASIC INFO */}
        <input
          className="glass-input"
          placeholder="Product Name *"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          required
        />

        <textarea
          className="glass-input resize-none"
          placeholder="Description"
          rows="3"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        {/* PRICE / STOCK / TAX / DISCOUNT */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input
            type="number"
            className="glass-input"
            placeholder="Price (₹)"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: e.target.value })
            }
            required
          />
          <input
            type="number"
            className="glass-input"
            placeholder="Stock"
            value={form.stock}
            onChange={(e) =>
              setForm({ ...form, stock: e.target.value })
            }
            required
          />
          <input
            type="number"
            className="glass-input"
            placeholder="Tax (%)"
            value={form.tax}
            onChange={(e) =>
              setForm({ ...form, tax: e.target.value })
            }
            required
          />
          <input
            type="number"
            className="glass-input"
            placeholder="Discount (%)"
            value={form.discount}
            onChange={(e) =>
              setForm({ ...form, discount: e.target.value })
            }
          />
        </div>

        {/* CATEGORY */}
        <select
          className="glass-input bg-white/15 text-white border border-white/30"
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
          required
        >
          <option value="" className="bg-gray-900 text-white">
            Select Category
          </option>
          {categories.map((c) => (
            <option
              key={c._id}
              value={c._id}
              className="bg-gray-900 text-white"
            >
              {c.categoryName}
            </option>
          ))}
        </select>

        {/* IMAGES */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-white/80">Product Images</h3>

          {/* ✅ PREVIEW OLD IMAGES */}
          {oldImages.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs text-white/60">Existing Images:</label>
              <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                {oldImages.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`Preview ${i}`}
                    className="w-20 h-20 object-cover rounded-lg border border-white/20 flex-shrink-0"
                  />
                ))}
              </div>
              <p className="text-[10px] text-white/40 italic">
                * Uploading new images will replace these.
              </p>
            </div>
          )}

          <input
            type="file"
            multiple
            accept="image/*"
            className="glass-input"
            onChange={(e) => setImages([...e.target.files])}
          />
        </div>

        {/* RECOMMENDED PRODUCTS */}
        <div className="space-y-2 relative">
          <h3 className="text-sm font-medium text-white/80">
            Recommended Products
          </h3>

          <button
            type="button"
            onClick={() =>
              setShowRecommendedDropdown((p) => !p)
            }
            className="glass-input flex justify-between text-white"
          >
            {recommended.length
              ? `${recommended.length} selected`
              : "Select recommended products"}
            ▼
          </button>

          {showRecommendedDropdown && (
            <div className="absolute z-20 w-full bg-[#0B1C2D] border border-white/10 rounded-2xl shadow-xl mt-1 max-h-64 overflow-y-auto">
              <ul className="p-2 text-sm">
                {allProducts
                  .filter((p) => p._id !== editId)
                  .map((p) => (
                    <li key={p._id}>
                      <div
                        onClick={() => toggleRecommended(p._id)}
                        className="flex items-center gap-2 p-2 rounded hover:bg-white/10 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={recommended.includes(p._id)}
                          readOnly
                        />
                        <span className="text-white">
                          {p.name}
                        </span>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>

        {/* SUBMIT */}
        <button
          className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {editId ? "Updating..." : "Saving..."}
            </>
          ) : (
            editId ? "Update Product" : "Save Product"
          )}
        </button>
      </form>

      {/* SEARCH */}
      <div className="flex items-center gap-2 w-full md:w-[420px]">
        <input
          className="flex-1 bg-white/15 border border-white/30 rounded-xl px-4 py-2 text-sm text-white"
          placeholder="Search loaded products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Search size={18} className="text-white/70" />
      </div>

      {/* PRODUCT LIST */}
      <div className="bg-white/10 border border-white/30 rounded-2xl overflow-x-auto shadow-glass">
        {loading ? (
          <p className="p-6 text-center text-white/60">
            Loading products...
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-white/70">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th>Price</th>
                <th>Discount</th>
                <th>Stock</th>
                <th>Tax</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => (
                <tr key={p._id} className="border-t border-white/10 text-center">
                  <td className="p-4 font-medium text-left">{p.name}</td>
                  <td>₹{p.price}</td>
                  <td className="text-green-400">{p.discount || 0}%</td>
                  <td>{p.stock}</td>
                  <td>{p.tax}%</td>
                  <td className="flex gap-2 p-2">
                    <button
                      onClick={() => editProduct(p)}
                      className="text-indigo-300 text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        deleteProduct(p._id).then(refreshProducts)
                      }
                      className="text-red-400 text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-white/60">
                    No matching products
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

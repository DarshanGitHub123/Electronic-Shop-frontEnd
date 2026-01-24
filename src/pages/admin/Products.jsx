import { useEffect, useState, useMemo } from "react";
import {
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
} from "../../api/product.api";
import { getCategories } from "../../api/category.api";
import { PackagePlus, Search, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

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
      toast.success(editId ? "Product updated successfully!" : "Product created successfully!");
    } catch (error) {
      console.error("SUBMIT ERROR:", error);
      toast.error(error.response?.data?.message || "Failed to save product");
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

        {/* SPECIFICATIONS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-white/80">Technical Specifications</h3>
            <button
              type="button"
              onClick={addSpecRow}
              className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              + Add Row
            </button>
          </div>

          <div className="space-y-3">
            {specs.map((s, i) => (
              <div key={i} className="flex gap-2">
                <input
                  className="glass-input !py-1 text-xs"
                  placeholder="Key (e.g. RAM)"
                  value={s.key}
                  onChange={(e) => updateSpec(i, "key", e.target.value)}
                />
                <input
                  className="glass-input !py-1 text-xs"
                  placeholder="Value (e.g. 16GB)"
                  value={s.value}
                  onChange={(e) => updateSpec(i, "value", e.target.value)}
                />
                {specs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSpecRow(i)}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
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
      <div className="space-y-4">
        {loading ? (
          <p className="p-6 text-center text-white/60 bg-white/10 rounded-2xl border border-white/30">
            Loading products...
          </p>
        ) : (
          <>
            {/* MOBILE VIEW: CARDS */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {filteredProducts.map((p) => (
                <div
                  key={p._id}
                  className="bg-white/10 backdrop-blur-xl border border-white/30 rounded-2xl p-5 space-y-3 shadow-glass"
                >
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="font-semibold text-white leading-tight flex-1">{p.name}</h3>
                    <span className="text-orange-400 font-bold">₹{p.price}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[10px] text-white/60 uppercase tracking-widest font-bold">
                    <div className="flex flex-col gap-1">
                      <span>Stock</span>
                      <span className="text-white text-xs">{p.stock}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span>Tax</span>
                      <span className="text-white text-xs">{p.tax}%</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span>Discount</span>
                      <span className="text-green-400 text-xs">{p.discount || 0}%</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-white/10">
                    <button
                      onClick={() => editProduct(p)}
                      className="flex-1 py-2 text-xs font-bold bg-indigo-500 text-white rounded-xl shadow-lg active:scale-95 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        deleteProduct(p._id).then(() => {
                          refreshProducts();
                          toast.info("Product deleted");
                        }).catch(() => toast.error("Delete failed"))
                      }
                      className="flex-1 py-2 text-xs font-bold bg-red-500 text-white rounded-xl shadow-lg active:scale-95 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* DESKTOP VIEW: TABLE */}
            <div className="hidden md:block bg-white/10 border border-white/30 rounded-2xl overflow-hidden shadow-glass">
              <table className="w-full text-sm">
                <thead className="text-white/70 bg-white/5">
                  <tr>
                    <th className="p-4 text-left">Name</th>
                    <th className="p-4 text-center">Price</th>
                    <th className="p-4 text-center">Discount</th>
                    <th className="p-4 text-center">Stock</th>
                    <th className="p-4 text-center">Tax</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p) => (
                    <tr key={p._id} className="border-t border-white/10 hover:bg-white/5 transition">
                      <td className="p-4 font-medium text-white">{p.name}</td>
                      <td className="p-4 text-center text-white">₹{p.price}</td>
                      <td className="p-4 text-center text-green-400 font-bold">{p.discount || 0}%</td>
                      <td className="p-4 text-center text-white">{p.stock}</td>
                      <td className="p-4 text-center text-white">{p.tax}%</td>
                      <td className="p-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => editProduct(p)}
                            className="p-2 bg-indigo-500/20 hover:bg-indigo-500 text-indigo-300 hover:text-white rounded-xl transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              deleteProduct(p._id).then(() => {
                                refreshProducts();
                                toast.info("Product deleted");
                              }).catch(() => toast.error("Delete failed"))
                            }
                            className="p-2 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white rounded-xl transition"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredProducts.length === 0 && (
              <div className="p-10 text-center text-white/40 bg-white/5 rounded-2xl border border-dashed border-white/20">
                No matching products found
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

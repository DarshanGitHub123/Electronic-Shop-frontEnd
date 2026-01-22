import { useEffect, useState, useMemo } from "react";
import {
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
} from "../../api/product.api";
import { getCategories } from "../../api/category.api";
import { PackagePlus, Search } from "lucide-react";

export default function AdminProducts() {
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [images, setImages] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [recommended, setRecommended] = useState([]);
  const [showRecommendedDropdown, setShowRecommendedDropdown] =
    useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
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

  /* ===============================
     REFRESH PRODUCTS
     =============================== */
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

    const specifications = {};
    specs.forEach((s) => {
      if (s.key && s.value) specifications[s.key] = s.value;
    });

    const formData = new FormData();

    Object.entries({
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
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
      stock: "",
      category: "",
    });
    setImages([]);
    setSpecs([{ key: "", value: "" }]);
    setRecommended([]);
    setShowRecommendedDropdown(false);
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
      stock: p.stock,
      category: p.category?._id || p.category,
    });

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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
        <input
          type="file"
          multiple
          accept="image/*"
          className="glass-input"
          onChange={(e) => setImages([...e.target.files])}
        />

        {/* SPECIFICATIONS */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-white/80">
            Specifications
          </h3>

          {specs.map((s, i) => (
            <div key={i} className="flex gap-2">
              <input
                className="glass-input"
                placeholder="Key"
                value={s.key}
                onChange={(e) =>
                  updateSpec(i, "key", e.target.value)
                }
              />
              <input
                className="glass-input"
                placeholder="Value"
                value={s.value}
                onChange={(e) =>
                  updateSpec(i, "value", e.target.value)
                }
              />
              <button
                type="button"
                onClick={() => removeSpecRow(i)}
                className="text-red-400"
              >
                ✕
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addSpecRow}
            className="text-xs text-indigo-300"
          >
            + Add Specification
          </button>
        </div>

        {/* RECOMMENDED PRODUCTS – NEW STYLE */}
        <div className="space-y-2 relative">
          <h3 className="text-sm font-medium text-white/80">
            Recommended Products
          </h3>

          <button
            type="button"
            onClick={() =>
              setShowRecommendedDropdown((prev) => !prev)
            }
            className="glass-input flex justify-between items-center text-white"
          >
            {recommended.length > 0
              ? `${recommended.length} product(s) selected`
              : "Select recommended products"}
            <span className="text-xs">▼</span>
          </button>

          {showRecommendedDropdown && (
            <div className="absolute z-20 w-full bg-[#0B1C2D] border border-white/10 rounded-2xl shadow-xl mt-1 max-h-64 overflow-y-auto">
              <ul className="p-2 text-sm font-medium text-body">
                {allProducts
                  .filter((p) => p._id !== editId)
                  .map((p) => (
                    <li key={p._id}>
                      <div
                        className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium rounded cursor-pointer"
                        onClick={() => toggleRecommended(p._id)}
                      >
                        <input
                          type="checkbox"
                          checked={recommended.includes(p._id)}
                          readOnly
                          className="w-4 h-4 border border-default-strong rounded-xs bg-neutral-secondary-strong focus:ring-2 focus:ring-brand-soft"
                        />
                        <label className="ms-2 text-sm font-medium text-heading">
                          {p.name}
                        </label>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>

        <button className="btn-primary w-full">
          {editId ? "Update Product" : "Save Product"}
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
                <th>Stock</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => (
                <tr key={p._id} className="border-t border-white/10">
                  <td className="p-4 font-medium">{p.name}</td>
                  <td>₹{p.price}</td>
                  <td>{p.stock}</td>
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
                  <td colSpan="4" className="p-6 text-center text-white/60">
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

import { useEffect, useState } from "react";
import {
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
} from "../../api/product.api";
import { getCategories } from "../../api/category.api";
import { PackagePlus } from "lucide-react";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [images, setImages] = useState([]);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
  });

  const [specs, setSpecs] = useState([{ key: "", value: "" }]);

  const loadData = async () => {
    setProducts((await getProducts(search)).data);
    setCategories((await getCategories()).data);
  };

  useEffect(() => {
    loadData();
  }, [search]);

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

    images.forEach((img) => formData.append("images", img));

    editId
      ? await updateProduct(editId, formData)
      : await createProduct(formData);

    resetForm();
    loadData();
  };

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
  };

  const editProduct = (p) => {
    setEditId(p._id);
    setForm({
      name: p.name,
      description: p.description || "",
      price: p.price,
      stock: p.stock,
      category: p.category?._id || p.category,
    });

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

      {/* SEARCH */}
      <input
        className="
          bg-white/15
          border border-white/30
          backdrop-blur-xl
          rounded-xl
          px-4 py-2
          text-sm
          w-full md:w-64
          text-white
          placeholder-white/70
          focus:ring-2 focus:ring-orange-400
          outline-none
        "
        placeholder="Search products…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* ADD / EDIT PRODUCT FORM */}
      <form
        onSubmit={submitProduct}
        className="
          bg-white/15
          backdrop-blur-xl
          border border-white/30
          rounded-2xl
          p-6
          space-y-6
          shadow-glass
        "
      >
        <h2 className="text-base font-semibold text-white">
          {editId ? "Edit Product" : "Add New Product"}
        </h2>

        {/* BASIC INFO */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-white/80">
            Basic Information
          </h3>

          <div className="space-y-1">
            <label className="text-xs text-white/70">
              Product Name <span className="text-red-400">*</span>
            </label>
            <input
              className="glass-input"
              placeholder="HP Pavilion Laptop"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-white/70">
              Description
            </label>
            <textarea
              className="glass-input resize-none"
              placeholder="Short description of the product"
              value={form.description}
              rows="3"
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>
        </div>

        {/* PRICING & CATEGORY */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-white/80">
            Pricing & Category
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-white/70">
                Price (₹) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                className="glass-input"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-white/70">
                Stock <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                className="glass-input"
                value={form.stock}
                onChange={(e) =>
                  setForm({ ...form, stock: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-white/70">
              Category <span className="text-red-400">*</span>
            </label>
            <select
              className="glass-input"
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
              required
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.categoryName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* IMAGES */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-white/80">
            Product Images
          </h3>
          <input
            type="file"
            multiple
            accept="image/*"
            className="glass-input"
            onChange={(e) =>
              setImages([...e.target.files])
            }
          />
          <p className="text-xs text-white/60">
            You can upload multiple images
          </p>
        </div>

        {/* SPECIFICATIONS */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-white/80">
            Specifications
          </h3>

          {specs.map((s, i) => (
            <div key={i} className="flex gap-2">
              <input
                className="glass-input"
                placeholder="Key (e.g. RAM)"
                value={s.key}
                onChange={(e) =>
                  updateSpec(i, "key", e.target.value)
                }
              />
              <input
                className="glass-input"
                placeholder="Value (e.g. 16 GB)"
                value={s.value}
                onChange={(e) =>
                  updateSpec(i, "value", e.target.value)
                }
              />
              <button
                type="button"
                onClick={() => removeSpecRow(i)}
                className="text-red-400 text-sm"
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

        {/* ACTIONS */}
        <div className="flex gap-3">
          <button className="btn-primary w-full">
            {editId ? "Update Product" : "Save Product"}
          </button>

          {editId && (
            <button
              type="button"
              onClick={resetForm}
              className="
                px-4 py-2
                rounded-xl
                text-sm
                bg-white/15
                hover:bg-white/25
                transition
              "
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* PRODUCT LIST (unchanged UI kept glass) */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/30 rounded-2xl overflow-x-auto shadow-glass">
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
            {products.map((p) => (
              <tr
                key={p._id}
                className="border-t border-white/10 hover:bg-white/5 transition"
              >
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
                      deleteProduct(p._id).then(loadData)
                    }
                    className="text-red-400 text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="p-6 text-center text-white/60"
                >
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}

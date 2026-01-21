import { useEffect, useState } from "react";
import {
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
} from "../../api/product.api";
import { getCategories } from "../../api/category.api";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // 🔍 SEARCH
  const [search, setSearch] = useState("");

  const [images, setImages] = useState([]);


  // ✏️ EDIT MODE
  const [editId, setEditId] = useState(null);

  // Product form
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    images: "",
  });

  // Specifications
  const [specs, setSpecs] = useState([{ key: "", value: "" }]);

  const loadData = async () => {
    setProducts((await getProducts(search)).data);
    setCategories((await getCategories()).data);
  };

  useEffect(() => {
    loadData();
  }, [search]);

  // ---- SPEC HANDLERS ----
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

  // ---- SUBMIT (CREATE / UPDATE) ----
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
  
    if (editId) {
      await updateProduct(editId, formData);
    } else {
      await createProduct(formData);
    }
  
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
      images: "",
    });
    setSpecs([{ key: "", value: "" }]);
  };

  // ---- EDIT HANDLER ----
  const editProduct = (p) => {
    setEditId(p._id);
    setForm({
      name: p.name,
      description: p.description || "",
      price: p.price,
      stock: p.stock,
      category: p.category?._id || p.category,
      images: (p.images || []).join(", "),
    });

    const specArray = Object.entries(p.specifications || {}).map(
      ([key, value]) => ({ key, value })
    );

    setSpecs(specArray.length ? specArray : [{ key: "", value: "" }]);
  };

  return (
    <div className="space-y-6">

      {/* 🔍 SEARCH BAR */}
      <input
        className="border px-3 py-2 rounded text-sm w-full md:w-64"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* ADD / EDIT PRODUCT FORM */}
      <form
        onSubmit={submitProduct}
        className="bg-white border rounded-lg p-5 space-y-4"
      >
        <h2 className="font-semibold text-lg">
          {editId ? "Edit Product" : "Add Product"}
        </h2>

        <input
          className="input"
          placeholder="Product Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <textarea
          className="input"
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />


        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            className="input"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />
          <input
            type="number"
            className="input"
            placeholder="Stock"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            required
          />
        </div>

        <select
          className="input"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          required
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.categoryName}
            </option>
          ))}
        </select>

        <input
          type="file"
          multiple
          accept="image/*"
          className="input"
          onChange={(e) => setImages([...e.target.files])}
        />


        {/* SPECIFICATIONS */}
        <div>
          <h3 className="font-medium mb-2">Specifications</h3>

          {specs.map((s, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                className="input"
                placeholder="Key"
                value={s.key}
                onChange={(e) =>
                  updateSpec(i, "key", e.target.value)
                }
              />
              <input
                className="input"
                placeholder="Value"
                value={s.value}
                onChange={(e) =>
                  updateSpec(i, "value", e.target.value)
                }
              />
              <button
                type="button"
                onClick={() => removeSpecRow(i)}
                className="text-red-500"
              >
                ✕
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addSpecRow}
            className="text-sm text-indigo-600"
          >
            + Add Specification
          </button>
        </div>

        <div className="flex gap-2">
          <button className="btn-primary w-full">
            {editId ? "Update Product" : "Save Product"}
          </button>

          {editId && (
            <button
              type="button"
              onClick={resetForm}
              className="border px-4 py-2 rounded text-sm"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* PRODUCT LIST */}
      <div className="bg-white border rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Price</th>
              <th className="p-2 text-left">Stock</th>
              <th className="p-2 text-left">Action</th>
              
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-t">
                <td className="p-2">{p.name}</td>
                <td>₹{p.price}</td>
                <td>{p.stock}</td>
                <td className="flex gap-2">
                  <button
                    onClick={() => editProduct(p)}
                    className="text-indigo-600 text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      deleteProduct(p._id).then(loadData)
                    }
                    className="text-red-500 text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

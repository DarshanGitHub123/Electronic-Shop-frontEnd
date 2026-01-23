import { useEffect, useState } from "react";
import {
  getCollections,
  createCollection,
  updateCollection,
  deleteCollection,
} from "../../api/collection.api";
import { getProducts } from "../../api/product.api";
import { LayoutGrid } from "lucide-react";

export default function Collections() {
  const [collections, setCollections] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [image, setImage] = useState(null);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  const loadData = async () => {
    const [cRes, pRes] = await Promise.all([
      getCollections(),
      getProducts(),
    ]);
    setCollections(cRes.data);
    setProducts(pRes.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("description", form.description);
    fd.append("products", JSON.stringify(selectedProducts));
    if (image) fd.append("image", image);

    editId
      ? await updateCollection(editId, fd)
      : await createCollection(fd);

    reset();
    loadData();
  };

  const reset = () => {
    setEditId(null);
    setForm({ title: "", description: "" });
    setSelectedProducts([]);
    setImage(null);
  };

  const editCollection = (c) => {
    setEditId(c._id);
    setForm({ title: c.title, description: c.description });
    setSelectedProducts(c.products.map((p) => p._id));
  };

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center">
          <LayoutGrid size={20} />
        </div>
        <h1 className="text-xl font-semibold">Collections</h1>
      </div>

      {/* FORM */}
      <form onSubmit={submit} className="glass p-6 rounded-2xl max-w-xl space-y-4">
        <input
          className="glass-input"
          placeholder="Collection Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />

        <textarea
          className="glass-input resize-none"
          placeholder="Description"
          rows="3"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />

        <input
          type="file"
          accept="image/*"
          className="glass-input"
          onChange={(e) => setImage(e.target.files[0])}
        />

        {/* PRODUCT MULTI SELECT */}
        <div className="glass-input h-40 overflow-y-auto space-y-1">
          {products.map((p) => (
            <label key={p._id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selectedProducts.includes(p._id)}
                onChange={(e) =>
                  e.target.checked
                    ? setSelectedProducts([...selectedProducts, p._id])
                    : setSelectedProducts(
                        selectedProducts.filter((id) => id !== p._id)
                      )
                }
              />
              {p.name}
            </label>
          ))}
        </div>

        <button className="btn-primary w-full">
          {editId ? "Update Collection" : "Create Collection"}
        </button>
      </form>

      {/* LIST */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {collections.map((c) => (
          <div key={c._id} className="glass p-4 rounded-xl">
            <img
              src={c.image}
              className="h-36 w-full object-cover rounded-lg"
            />
            <h3 className="mt-2 font-semibold">{c.title}</h3>
            <p className="text-sm text-white/70">{c.description}</p>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => editCollection(c)}
                className="text-xs text-indigo-300"
              >
                Edit
              </button>
              <button
                onClick={() => deleteCollection(c._id).then(loadData)}
                className="text-xs text-red-400"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

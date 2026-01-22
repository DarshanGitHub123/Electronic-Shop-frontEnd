import { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../api/category.api";
import { Layers, CheckCircle, Pencil, Trash2, X } from "lucide-react";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    categoryName: "",
    description: "",
  });

  const [editId, setEditId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  /* ===============================
     LOAD CATEGORIES
     =============================== */
  const loadCategories = async () => {
    const res = await getCategories();
    setCategories(res.data);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  /* ===============================
     CREATE / UPDATE CATEGORY
     =============================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const name = form.categoryName.trim();
    const description = form.description.trim();

    if (!name || !description) {
      setError("All fields are required");
      return;
    }

    // ✅ DUPLICATE CHECK (IGNORE SELF IN EDIT MODE)
    const alreadyExists = categories.some(
      (c) =>
        c.categoryName.toLowerCase() === name.toLowerCase() &&
        c._id !== editId
    );

    if (alreadyExists) {
      setError("Category already exists");
      return;
    }

    setLoading(true);

    try {
      if (editId) {
        await updateCategory(editId, { categoryName: name, description });
        setSuccess("Category updated successfully");
      } else {
        await createCategory({ categoryName: name, description });
        setSuccess("Category created successfully");
      }

      resetForm();
      loadCategories();
    } catch (err) {
      setError(
        err.response?.data?.message || "Operation failed"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     EDIT CATEGORY
     =============================== */
  const editCategory = (category) => {
    setEditId(category._id);
    setForm({
      categoryName: category.categoryName,
      description: category.description,
    });
    setError("");
    setSuccess("");
  };

  /* ===============================
     DELETE CATEGORY
     =============================== */
  const removeCategory = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    await deleteCategory(id);
    loadCategories();
  };

  /* ===============================
     RESET FORM
     =============================== */
  const resetForm = () => {
    setEditId(null);
    setForm({ categoryName: "", description: "" });
  };

  return (
    <div className="space-y-8">

      {/* PAGE HEADER */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
          <Layers size={20} />
        </div>
        <h1 className="text-xl font-semibold tracking-wide">
          Categories
        </h1>
      </div>

      {/* CREATE / EDIT FORM */}
      <form
        onSubmit={handleSubmit}
        className="glass p-6 rounded-2xl max-w-xl space-y-4 border border-white/30"
      >
        <h2 className="text-sm font-medium text-white/80">
          {editId ? "Edit Category" : "Add New Category"}
        </h2>

        {/* ERROR */}
        {error && (
          <div className="text-xs bg-red-500/20 text-red-300 border border-red-500/30 px-4 py-2 rounded-xl">
            {error}
          </div>
        )}

        {/* SUCCESS */}
        {success && (
          <div className="flex items-center gap-2 text-xs bg-green-500/20 text-green-300 border border-green-500/30 px-4 py-2 rounded-xl">
            <CheckCircle size={14} />
            {success}
          </div>
        )}

        {/* NAME */}
        <input
          className="glass-input"
          placeholder="Category Name *"
          value={form.categoryName}
          disabled={loading}
          onChange={(e) =>
            setForm({ ...form, categoryName: e.target.value })
          }
        />

        {/* DESCRIPTION */}
        <textarea
          className="glass-input resize-none"
          placeholder="Category Description *"
          rows="3"
          value={form.description}
          disabled={loading}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        {/* ACTIONS */}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50"
          >
            {editId ? "Update Category" : "Create Category"}
          </button>

          {editId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-white/15 px-4 py-2 rounded-xl"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </form>

      {/* CATEGORY LIST */}
      <div className="glass rounded-2xl overflow-x-auto border border-white/30">
        <table className="w-full text-sm">
          <thead className="text-white/70">
            <tr>
              <th className="p-4 text-left">Category</th>
              <th>Description</th>
              <th className="text-right pr-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((c) => (
              <tr
                key={c._id}
                className="border-t border-white/10 hover:bg-white/5 transition"
              >
                <td className="p-4 font-medium">
                  {c.categoryName}
                </td>
                <td className="text-white/80">
                  {c.description}
                </td>
                <td className="text-right pr-4">
                  <div className="inline-flex gap-3">
                    <button
                      onClick={() => editCategory(c)}
                      className="text-indigo-300 text-xs"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => removeCategory(c._id)}
                      className="text-red-400 text-xs"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {categories.length === 0 && (
              <tr>
                <td colSpan="3" className="p-6 text-center text-white/60">
                  No categories available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}

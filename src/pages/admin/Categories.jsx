import { useEffect, useState } from "react";
import { getCategories, createCategory } from "../../api/category.api";
import { Layers, CheckCircle } from "lucide-react";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    categoryName: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const loadCategories = async () => {
    const res = await getCategories();
    setCategories(res.data);
  };

  useEffect(() => {
    loadCategories();
  }, []);

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

    const alreadyExists = categories.some(
      (c) => c.categoryName.toLowerCase() === name.toLowerCase()
    );

    if (alreadyExists) {
      setError("Category already exists");
      return;
    }

    setLoading(true);

    try {
      await createCategory({ categoryName: name, description });
      setForm({ categoryName: "", description: "" });
      setSuccess("Category created successfully");
      loadCategories();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create category"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">

      {/* PAGE HEADER */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
          <Layers size={20} />
        </div>
        <h1 className="text-xl font-semibold tracking-wide text-white">
          Categories
        </h1>
      </div>

      {/* CREATE CATEGORY FORM */}
      <form
        onSubmit={handleSubmit}
        className="
          glass
          p-6
          rounded-2xl
          max-w-xl
          space-y-4
          border border-white/30
        "
      >
        <h2 className="text-sm font-medium text-white/80">
          Add New Category
        </h2>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="
            text-xs
            bg-red-500/20
            text-red-300
            border border-red-500/30
            px-4 py-2
            rounded-xl
          ">
            {error}
          </div>
        )}

        {/* SUCCESS MESSAGE */}
        {success && (
          <div className="
            flex items-center gap-2
            text-xs
            bg-green-500/20
            text-green-300
            border border-green-500/30
            px-4 py-2
            rounded-xl
          ">
            <CheckCircle size={14} />
            {success}
          </div>
        )}

        {/* CATEGORY NAME */}
        <div className="space-y-1">
          <label className="text-xs text-white/70">
            Category Name <span className="text-red-400">*</span>
          </label>
          <input
            className="glass-input"
            placeholder="e.g. Laptops & Computers"
            value={form.categoryName}
            disabled={loading}
            onChange={(e) =>
              setForm({ ...form, categoryName: e.target.value })
            }
          />
        </div>

        {/* DESCRIPTION */}
        <div className="space-y-1">
          <label className="text-xs text-white/70">
            Description <span className="text-red-400">*</span>
          </label>
          <textarea
            className="glass-input resize-none"
            placeholder="Brief description of the category"
            rows="3"
            value={form.description}
            disabled={loading}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="
            btn-primary
            w-full
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >
          {loading ? "Creating..." : "Create Category"}
        </button>
      </form>

      {/* CATEGORY LIST */}
      <div className="glass rounded-2xl overflow-x-auto border border-white/30">
        <table className="w-full text-sm">
          <thead className="text-white/70">
            <tr>
              <th className="p-4 text-left">Category</th>
              <th className="text-left">Description</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((c) => (
              <tr
                key={c._id}
                className="border-t border-white/10 hover:bg-white/5 transition"
              >
                <td className="p-4 font-medium text-white">
                  {c.categoryName}
                </td>
                <td className="text-white/80">
                  {c.description}
                </td>
              </tr>
            ))}

            {categories.length === 0 && (
              <tr>
                <td
                  colSpan="2"
                  className="p-6 text-center text-white/60"
                >
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

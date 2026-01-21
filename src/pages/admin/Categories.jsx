import { useEffect, useState } from "react";
import { getCategories, createCategory } from "../../api/category.api";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    categoryName: "",
    description: "",
  });
  const [error, setError] = useState("");
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

    const name = form.categoryName.trim();

    if (!name || !form.description.trim()) {
      setError("All fields are required");
      return;
    }

    // ✅ FRONTEND DUPLICATE CHECK
    const alreadyExists = categories.some(
      (c) => c.categoryName.toLowerCase() === name.toLowerCase()
    );

    if (alreadyExists) {
      setError("Category already exists");
      return;
    }

    setLoading(true);

    try {
      await createCategory({
        categoryName: name,
        description: form.description.trim(),
      });

      setForm({ categoryName: "", description: "" });
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
    <div className="space-y-6">

      <h2 className="text-lg font-semibold">Categories</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded-lg p-4 space-y-4 max-w-lg"
      >
        {error && (
          <div className="text-xs bg-red-100 text-red-600 p-2 rounded">
            {error}
          </div>
        )}

        <input
          className="input"
          placeholder="Category Name"
          value={form.categoryName}
          onChange={(e) =>
            setForm({ ...form, categoryName: e.target.value })
          }
        />

        <textarea
          className="input"
          placeholder="Description"
          rows="3"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <button
          type="submit"
          disabled={loading}
          className="btn-primary disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Category"}
        </button>
      </form>

      {/* LIST */}
      <div className="bg-white border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Category</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c._id} className="border-t">
                <td className="p-3 font-medium">{c.categoryName}</td>
                <td>{c.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

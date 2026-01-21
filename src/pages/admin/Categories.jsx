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

    // ✅ FRONTEND VALIDATION
    if (!form.categoryName.trim()) {
      setError("Category name is required");
      return;
    }

    if (!form.description.trim()) {
      setError("Category description is required");
      return;
    }

    setLoading(true);

    try {
      await createCategory({
        categoryName: form.categoryName.trim(),
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

      {/* HEADER */}
      <div>
        <h2 className="text-lg font-semibold">Categories</h2>
        <p className="text-xs text-gray-500">
          Manage product categories
        </p>
      </div>

      {/* CREATE CATEGORY FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded-lg p-4 space-y-4 max-w-lg"
      >
        <h3 className="font-medium">Add New Category</h3>

        {/* ERROR */}
        {error && (
          <div className="text-xs bg-red-100 text-red-600 p-2 rounded">
            {error}
          </div>
        )}

        <input
          type="text"
          placeholder="Category Name"
          className="input"
          value={form.categoryName}
          onChange={(e) =>
            setForm({ ...form, categoryName: e.target.value })
          }
        />

        <textarea
          placeholder="Description"
          className="input"
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
          {loading ? "Saving..." : "Create Category"}
        </button>
      </form>

      {/* CATEGORY LIST */}
      <div className="bg-white border rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Category Name</th>
              <th className="p-3 text-left">Description</th>
            </tr>
          </thead>

          <tbody>
            {categories.length === 0 && (
              <tr>
                <td
                  colSpan="2"
                  className="text-center text-sm text-gray-500 p-4"
                >
                  No categories found
                </td>
              </tr>
            )}

            {categories.map((cat) => (
              <tr
                key={cat._id}
                className="border-t hover:bg-gray-50"
              >
                <td className="p-3 font-medium">
                  {cat.categoryName}
                </td>
                <td>{cat.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

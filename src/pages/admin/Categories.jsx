import { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../api/category.api";
import { Layers, Pencil, Trash2, X, Loader2, Search, ArrowDownUp } from "lucide-react";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");

  // 
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  // 


  const [form, setForm] = useState({
    categoryName: "",
    description: "",
    showCustomer: true,
    mandatory: [{ name: "", units: [""] }],
    optional: [{ name: "", units: [""] }],
  });

  const [editId, setEditId] = useState(null);
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
     SEARCH FILTER
     =============================== */
  const filteredCategories = useMemo(() => {
    if (!search.trim()) return categories;
    return categories.filter((c) =>
      c.categoryName.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, categories]);

  /* ===============================
     SPECIFICATION HANDLERS
     =============================== */
  const addSpec = (type) => {
    setForm({
      ...form,
      [type]: [...form[type], { name: "", units: [""] }],
    });
  };

  const removeSpec = (type, index) => {
    setForm({
      ...form,
      [type]: form[type].filter((_, i) => i !== index),
    });
  };

  const updateSpecName = (type, index, value) => {
    const updated = [...form[type]];
    updated[index].name = value;
    setForm({ ...form, [type]: updated });
  };

  const addUnit = (type, specIndex) => {
    const updated = [...form[type]];
    updated[specIndex].units = [...updated[specIndex].units, ""];
    setForm({ ...form, [type]: updated });
  };

  const removeUnit = (type, specIndex, unitIndex) => {
    const updated = [...form[type]];
    updated[specIndex].units = updated[specIndex].units.filter((_, i) => i !== unitIndex);
    setForm({ ...form, [type]: updated });
  };

  const updateUnitValue = (type, specIndex, unitIndex, value) => {
    const updated = [...form[type]];
    updated[specIndex].units[unitIndex] = value;
    setForm({ ...form, [type]: updated });
  };

  const toggleSpecType = (sourceType, index) => {
    const targetType = sourceType === 'mandatory' ? 'optional' : 'mandatory';
    const specToMove = form[sourceType][index];

    setForm({
      ...form,
      [sourceType]: form[sourceType].filter((_, i) => i !== index),
      [targetType]: [...form[targetType], specToMove]
    });
  };

  /* ===============================
     CREATE / UPDATE CATEGORY
     =============================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = (form.categoryName || "").trim();
    const description = (form.description || "").trim();

    // /////////////////

    // /////////////////

    if (!name || !description) {
      toast.warn("All fields are required");
      return;
    }

    // ✅ DUPLICATE CHECK (IGNORE SELF IN EDIT MODE)
    const alreadyExists = categories.some(
      (c) =>
        c.categoryName.toLowerCase() === name.toLowerCase() &&
        c._id !== editId
    );

    if (alreadyExists) {
      toast.error("Category already exists");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("categoryName", name);
      formData.append("description", description);
      formData.append("showCustomer", form.showCustomer);

      const filteredMandatory = (form.mandatory || []).filter(s => (s.name || "").trim() !== "");
      const filteredOptional = (form.optional || []).filter(s => (s.name || "").trim() !== "");

      formData.append("mandatory", JSON.stringify(filteredMandatory));
      formData.append("optional", JSON.stringify(filteredOptional));

      if (image) {
        formData.append("image", image);
      }

      if (editId) {
        await updateCategory(editId, formData);
        toast.success("Category updated!");
      } else {
        await createCategory(formData);
        toast.success("Category created!");
      }

      resetForm();
      loadCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     EDIT CATEGORY
     =============================== */
  const editCategory = (category) => {
    setEditId(category._id);
    setImage(null);
    setCurrentImage(category.image);
    setForm({
      categoryName: category.categoryName,
      description: category.description,
      showCustomer: category.showCustomer ?? true,
      mandatory: (category.requirements?.mandatory?.length > 0)
        ? category.requirements.mandatory.map(s => ({
          _id: s._id,
          name: s.name,
          units: s.units
        }))
        : [{ name: "", units: [""] }],
      optional: (category.requirements?.optional?.length > 0)
        ? category.requirements.optional.map(s => ({
          _id: s._id,
          name: s.name,
          units: s.units
        }))
        : [{ name: "", units: [""] }],
    });
  };

  /* ===============================
     DELETE CATEGORY
     =============================== */
  const removeCategory = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      await deleteCategory(id);
      loadCategories();
      toast.info("Category removed");
    } catch {
      toast.error("Failed to delete category");
    }
  };

  /* ===============================
     RESET FORM
     =============================== */
  const resetForm = () => {
    setEditId(null);
    setImage(null);
    setCurrentImage(null);
    setForm({
      categoryName: "",
      description: "",
      showCustomer: true,
      mandatory: [{ name: "", units: [""] }],
      optional: [{ name: "", units: [""] }]
    });
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

      {/* CREATE / EDIT FORM */}
      <form
        onSubmit={handleSubmit}
        className="glass p-6 rounded-2xl max-w-2xl space-y-6 border border-white/30"
      >
        <h2 className="text-base font-semibold text-white">
          {editId ? "Edit Category" : "Add New Category"}
        </h2>

        <div className="space-y-4">
          <input
            className="glass-input"
            placeholder="Category Name *"
            value={form.categoryName}
            disabled={loading}
            onChange={(e) =>
              setForm({ ...form, categoryName: e.target.value })
            }
          />

          <textarea
            className="glass-input resize-none"
            placeholder="Category Description *"
            rows="2"
            value={form.description}
            disabled={loading}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <div className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/10 transition-all hover:bg-white/10 group">
            <div className={`p-2 rounded-lg ${form.showCustomer ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              <Layers size={18} />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-white">Show to Customers</h4>
              <p className="text-[10px] text-white/50">If enabled, this category will be visible on the home page.</p>
            </div>
            <button
              type="button"
              onClick={() => setForm({ ...form, showCustomer: !form.showCustomer })}
              className={`w-12 h-6 rounded-full relative transition-all duration-300 ${form.showCustomer ? 'bg-green-500' : 'bg-red-500/30'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${form.showCustomer ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        </div>

        {currentImage && (
          <div className="space-y-2">
            <label className="text-sm text-white/70">Current Image:</label>
            <div className="relative">
              <img
                src={currentImage}
                alt="Current collection"
                className="w-full h-48 object-cover rounded-lg border-2 border-white/20"
              />
              <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                Current
              </div>
            </div>
            <p className="text-xs text-white/60">
              Upload a new image below to replace this one
            </p>
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          className="glass-input"
          onChange={(e) => setImage(e.target.files[0])}
        />
        {/* ///////////////////////////////////////////////// */}
        {/* SPECIFICATIONS SECTION */}
        <div className="space-y-6 border-t border-white/10 pt-4">

          {/* MANDATORY SPECIFICATIONS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-red-400 uppercase tracking-widest">
                ⚠️ Mandatory Specifications
              </h3>
              <button
                type="button"
                onClick={() => addSpec('mandatory')}
                className="text-[10px] bg-red-500/20 text-red-300 px-3 py-1 rounded-full font-bold hover:bg-red-500 hover:text-white transition-all uppercase"
              >
                + Add Mandatory
              </button>
            </div>

            <div className="space-y-4">
              {form.mandatory.map((spec, specIdx) => (
                <div key={specIdx} className="bg-red-500/5 p-4 rounded-2xl border border-red-500/20 space-y-4 relative group">
                  <button
                    type="button"
                    onClick={() => removeSpec('mandatory', specIdx)}
                    className="absolute top-4 right-4 text-white/20 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>

                  <div className="flex gap-2 items-end">
                    <div className="flex-1">
                      <label className="text-[10px] font-bold text-white/40 uppercase mb-1 block tracking-wider">Spec Name (e.g. Storage, RAM)</label>
                      <input
                        className="glass-input !py-1.5 text-sm"
                        placeholder="Specification Name"
                        value={spec.name}
                        onChange={(e) => updateSpecName('mandatory', specIdx, e.target.value)}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleSpecType('mandatory', specIdx)}
                      className="p-2 bg-white/5 border border-white/20 rounded-xl text-white/40 hover:text-blue-400 hover:border-blue-500/50 transition-all mb-0.5"
                      title="Move to Optional"
                    >
                      <ArrowDownUp size={16} />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase block tracking-wider">Available Units (e.g. GB, TB)</label>
                    <div className="flex flex-wrap gap-2">
                      {spec.units.map((unit, unitIdx) => (
                        <div key={unitIdx} className="flex items-center gap-1 group/unit">
                          <input
                            className="w-20 bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                            placeholder="Unit"
                            value={unit}
                            onChange={(e) => updateUnitValue('mandatory', specIdx, unitIdx, e.target.value)}
                          />
                          {spec.units.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeUnit('mandatory', specIdx, unitIdx)}
                              className="text-white/20 hover:text-red-400"
                            >
                              <X size={14} />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addUnit('mandatory', specIdx)}
                        className="w-8 h-8 flex items-center justify-center bg-white/5 border border-dashed border-white/20 rounded-lg text-white/40 hover:text-white hover:border-white/40 transition-all"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* OPTIONAL SPECIFICATIONS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-blue-400 uppercase tracking-widest">
                ✨ Optional Specifications
              </h3>
              <button
                type="button"
                onClick={() => addSpec('optional')}
                className="text-[10px] bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full font-bold hover:bg-blue-500 hover:text-white transition-all uppercase"
              >
                + Add Optional
              </button>
            </div>

            <div className="space-y-4">
              {form.optional.map((spec, specIdx) => (
                <div key={specIdx} className="bg-blue-500/5 p-4 rounded-2xl border border-blue-500/20 space-y-4 relative group">
                  <button
                    type="button"
                    onClick={() => removeSpec('optional', specIdx)}
                    className="absolute top-4 right-4 text-white/20 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>

                  <div className="flex gap-2 items-end">
                    <div className="flex-1">
                      <label className="text-[10px] font-bold text-white/40 uppercase mb-1 block tracking-wider">Spec Name (e.g. Camera, Battery)</label>
                      <input
                        className="glass-input !py-1.5 text-sm"
                        placeholder="Specification Name"
                        value={spec.name}
                        onChange={(e) => updateSpecName('optional', specIdx, e.target.value)}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleSpecType('optional', specIdx)}
                      className="p-2 bg-white/5 border border-white/20 rounded-xl text-white/40 hover:text-red-400 hover:border-red-500/50 transition-all mb-0.5"
                      title="Move to Mandatory"
                    >
                      <ArrowDownUp size={16} />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase block tracking-wider">Available Units (e.g. MP, mAh)</label>
                    <div className="flex flex-wrap gap-2">
                      {spec.units.map((unit, unitIdx) => (
                        <div key={unitIdx} className="flex items-center gap-1 group/unit">
                          <input
                            className="w-20 bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Unit"
                            value={unit}
                            onChange={(e) => updateUnitValue('optional', specIdx, unitIdx, e.target.value)}
                          />
                          {spec.units.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeUnit('optional', specIdx, unitIdx)}
                              className="text-white/20 hover:text-red-400"
                            >
                              <X size={14} />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addUnit('optional', specIdx)}
                        className="w-8 h-8 flex items-center justify-center bg-white/5 border border-dashed border-white/20 rounded-lg text-white/40 hover:text-white hover:border-white/40 transition-all"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ACTIONS */}
        <div className="flex gap-2 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {editId ? "Update Category" : "Create Category"}
          </button>

          {editId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-white/15 px-4 py-2 rounded-xl text-white hover:bg-white/20 transition"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </form>

      {/* SEARCH BAR (SYNCED WITH PRODUCT UI) */}
      <div className="flex items-center gap-3 w-full md:w-[420px] bg-white/10 border border-white/30 rounded-2xl px-4 py-3 shadow-sm">
        <Search size={18} className="text-white/40" />
        <input
          className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder:text-white/20"
          placeholder="Search loaded categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* CATEGORY LIST */}
      <div className="space-y-4">
        {/* MOBILE VIEW cards */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {filteredCategories.map((c) => (
            <div
              key={c._id}
              className="bg-white/10 backdrop-blur-xl border border-white/30 rounded-2xl p-5 space-y-4 shadow-glass"
            >
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <h3 className="font-bold text-white tracking-wide">{c.categoryName}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => editCategory(c)}
                    className="p-2 bg-indigo-500/20 text-indigo-300 rounded-xl"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => removeCategory(c._id)}
                    className="p-2 bg-red-500/20 text-red-400 rounded-xl"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${c.showCustomer !== false ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {c.showCustomer !== false ? '● Visible' : '○ Hidden'}
                </span>
              </div>

              <p className="text-sm text-white/70 italic leading-relaxed">
                {c.description}
              </p>
            </div>
          ))}
        </div>

        {/* DESKTOP VIEW table */}
        <div className="hidden md:block glass rounded-2xl overflow-hidden border border-white/30 shadow-glass">
          <table className="w-full text-sm">
            <thead className="text-white/70 bg-white/5">
              <tr>
                <th className="p-4 text-left">Category</th>
                <th className="p-4 text-left">Description</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredCategories.map((c) => (
                <tr
                  key={c._id}
                  className="border-t border-white/10 hover:bg-white/5 transition"
                >
                  <td className="p-4 font-bold text-white">
                    {c.categoryName}
                  </td>
                  <td className="p-4 text-white/80">
                    {c.description}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider inline-block ${c.showCustomer !== false ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {c.showCustomer !== false ? '● Visible' : '○ Hidden'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="inline-flex gap-3">
                      <button
                        onClick={() => editCategory(c)}
                        className="p-2 bg-indigo-500/20 hover:bg-indigo-500 text-indigo-300 hover:text-white rounded-xl transition"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => removeCategory(c._id)}
                        className="p-2 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white rounded-xl transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCategories.length === 0 && (
          <div className="p-10 text-center text-white/40 bg-white/5 rounded-2xl border border-dashed border-white/20">
            {search ? `No results for "${search}"` : "No categories available"}
          </div>
        )}
      </div>

    </div>
  );
}

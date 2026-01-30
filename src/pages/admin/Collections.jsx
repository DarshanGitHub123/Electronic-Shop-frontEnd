import { useEffect, useState } from "react";
import {
  getCollections,
  createCollection,
  updateCollection,
  updateCollectionRank,
  deleteCollection,
} from "../../api/collection.api";
import { getProducts } from "../../api/product.api";
import { LayoutGrid, GripVertical, Loader2, X, Info } from "lucide-react";
import { toast } from "react-toastify";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Sortable Collection Card Component
function SortableCollectionCard({ collection, index, onEdit, onDelete, onViewDetails }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: collection._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="glass p-4 rounded-xl relative"
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 right-2 cursor-grab active:cursor-grabbing p-2 hover:bg-white/10 rounded-lg transition-colors"
      >
        <GripVertical className="w-5 h-5 text-white/60" />
      </div>

      {/* Rank Badge - using index for immediate update */}
      <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-lg">
        #{index + 1}
      </div>

      <img
        src={collection.image}
        className="h-36 w-full object-cover rounded-lg mt-6"
        alt={collection.title}
      />
      <h3 className="mt-2 font-semibold">{collection.title || "Untitled Collection"}</h3>
      <p className="text-sm text-white/70 line-clamp-2">{collection.description || "No description"}</p>

      <div className="flex flex-wrap items-center gap-2 mt-4">
        <button
          onClick={() => onEdit(collection)}
          className="px-3 py-1 bg-indigo-500 text-white hover:bg-indigo-500/30 text-xs rounded-lg transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(collection._id)}
          className="px-3 py-1 bg-red-400 text-white hover:bg-red-500/30 text-xs rounded-lg transition-colors"
        >
          Delete
        </button>
        <button
          onClick={() => onViewDetails(collection)}
          className="ml-auto px-3 py-1 bg-white/10 text-white hover:bg-white/20 text-xs rounded-lg transition-all flex items-center gap-1.5"
        >
          <Info size={12} />
          View Details
        </button>
      </div>
    </div>
  );
}

export default function Collections() {
  const [collections, setCollections] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState(null); // For displaying existing image
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewDetails, setViewDetails] = useState(null); // For viewing product names

  const [form, setForm] = useState({
    title: "",
    description: "",
    showText: true,
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const loadData = async () => {
    const [cRes, pRes] = await Promise.all([
      getCollections("", true),
      getProducts("", "", true),
    ]);
    // Sort collections by rank
    const sortedCollections = cRes.data.sort((a, b) => (a.rank || 1) - (b.rank || 1));
    setCollections(sortedCollections);
    setProducts(pRes.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("title", form.title || "");
      fd.append("description", form.description || "");
      fd.append("showText", form.showText);
      fd.append("products", JSON.stringify(selectedProducts || []));
      if (image) fd.append("image", image);

      editId
        ? await updateCollection(editId, fd)
        : await createCollection(fd);

      reset();
      await loadData();
      toast.success(editId ? "Collection updated!" : "Collection created!");
    } catch (error) {
      console.error("Error submitting collection:", error);
      toast.error("Failed to save collection");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setEditId(null);
    setForm({ title: "", description: "", showText: true });
    setSelectedProducts([]);
    setImage(null);
    setCurrentImage(null);
  };

  const editCollection = (c) => {
    setEditId(c._id);
    setForm({
      title: c.title || "",
      description: c.description || "",
      showText: c.showText ?? true,
    });
    // Ensure we handle both populated and unpopulated products
    setSelectedProducts((c.products || []).map((p) => (typeof p === "string" ? p : p._id)).filter(id => id));
    setCurrentImage(c.image);
    setImage(null);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this collection?")) {
      try {
        await deleteCollection(id);
        loadData();
        toast.info("Collection deleted");
      } catch {
        toast.error("Delete failed");
      }
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = collections.findIndex((c) => c._id === active.id);
      const newIndex = collections.findIndex((c) => c._id === over.id);

      const newCollections = arrayMove(collections, oldIndex, newIndex);
      setCollections(newCollections);

      // Update ranks in backend
      try {
        await Promise.all(
          newCollections.map((collection, index) =>
            updateCollectionRank(collection._id, index + 1)
          )
        );
      } catch (error) {
        console.error("Error updating ranks:", error);
        // Reload data if update fails
        loadData();
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center">
          <LayoutGrid size={20} />
        </div>
        <div>
          <h1 className="text-xl font-semibold">Collections</h1>
          <p className="text-xs text-white/60">Drag to reorder collections</p>
        </div>
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

        {/* CURRENT IMAGE PREVIEW */}
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

        <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl">
          <label className="flex-1 text-sm font-medium text-white/80">Show Title & Description to Customers</label>
          <button
            type="button"
            onClick={() => setForm({ ...form, showText: !form.showText })}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none ${form.showText ? 'bg-blue-600' : 'bg-gray-600'
              }`}
          >
            <div
              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${form.showText ? 'translate-x-6' : 'translate-x-0'
                }`}
            />
          </button>
        </div>

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

        <button className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {editId ? "Updating..." : "Creating..."}
            </>
          ) : (
            editId ? "Update Collection" : "Create Collection"
          )}
        </button>
      </form>

      {/* DRAGGABLE LIST */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={collections.map((c) => c._id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {collections.map((c, index) => (
              <SortableCollectionCard
                key={c._id}
                collection={c}
                index={index}
                onEdit={editCollection}
                onDelete={handleDelete}
                onViewDetails={setViewDetails}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      {/* PRODUCT DETAILS MODAL */}
      {viewDetails && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass max-w-lg w-full p-6 rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">{viewDetails.title}</h2>
              <button
                onClick={() => setViewDetails(null)}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-white/60 block mb-1">Description</label>
                <p className="text-sm">{viewDetails.description}</p>
              </div>

              <div>
                <label className="text-sm text-white/60 block mb-2">
                  Products ({viewDetails.products?.length || 0})
                </label>
                <div className="max-h-60 overflow-y-auto pr-2 space-y-2">
                  <style>
                    {`
                      .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                      .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                      .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
                    `}
                  </style>
                  <div className="custom-scrollbar space-y-2">
                    {viewDetails.products && viewDetails.products.length > 0 ? (
                      viewDetails.products.map((p) => (
                        <div
                          key={p._id}
                          className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3"
                        >
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                          <span className="text-sm font-medium">{p.name || p.title || "Product"}</span>
                          {p.price && <span className="ml-auto text-xs text-white/50">₹{p.price}</span>}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-white/40 italic">No products in this collection</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setViewDetails(null)}
              className="w-full mt-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

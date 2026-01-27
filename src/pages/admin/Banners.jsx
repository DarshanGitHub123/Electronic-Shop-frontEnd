import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
    getBanners,
    createBanner,
    updateBanner,
    updateBannerRanks,
    deleteBanner,
} from "../../api/banner.api";
import { getCollections } from "../../api/collection.api";
import { Image as ImageIcon, Trash2, Pencil, X, Loader2, GripVertical, Plus } from "lucide-react";

// DND Kit
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
    rectSortingStrategy, // Changed to rect for grid
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/* ===============================
   SORTABLE ITEM COMPONENT
   =============================== */
function SortableBannerItem({ banner, index, onEdit, onDelete }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: banner._id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 100 : "auto",
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="glass p-5 rounded-3xl relative group w-full shadow-lg border border-white/5 hover:border-white/20 transition-all"
        >
            {/* Drag Handle */}
            <div
                {...attributes}
                {...listeners}
                className="absolute top-3 right-3 cursor-grab active:cursor-grabbing p-2 hover:bg-white/10 rounded-xl transition-colors z-10"
            >
                <GripVertical className="w-5 h-5 text-white/40 group-hover:text-white/80" />
            </div>

            {/* Rank Badge */}
            <div className="absolute top-3 left-3 bg-orange-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg z-10 shadow-lg">
                #{index + 1}
            </div>

            {/* Image Container (Taller) */}
            <div className="w-full h-48 rounded-2xl overflow-hidden bg-slate-900 border border-white/10 mt-8 shadow-inner">
                <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
            </div>

            {/* Content Below Image */}
            <div className="mt-4 px-1">
                <h4 className="text-sm font-bold text-white truncate group-hover:text-orange-400 transition-colors uppercase tracking-tight">{banner.title}</h4>
                <p className="text-[10px] text-white/50 line-clamp-2 italic leading-relaxed mt-1">{banner.subtitle || "No subtitle provided"}</p>
            </div>

            <div className="mt-5 space-y-3">
                {banner.collectionId && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-500/10 text-orange-400 text-[9px] font-bold uppercase tracking-wider w-fit border border-orange-500/20 shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                        {banner.collectionId.title}
                    </div>
                )}

                <div className="flex gap-3 mt-1">
                    <button
                        onClick={() => onEdit(banner)}
                        className="flex-1 py-2 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white text-xs font-bold rounded-xl transition-all border border-indigo-500/20 shadow-sm"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => onDelete(banner._id)}
                        className="flex-1 py-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white text-xs font-bold rounded-xl transition-all border border-red-500/20 shadow-sm"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ===============================
   MAIN PAGE COMPONENT
   =============================== */
export default function AdminBanners() {
    const [banners, setBanners] = useState([]);
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editId, setEditId] = useState(null);

    const [form, setForm] = useState({
        title: "",
        subtitle: "",
        collectionId: "",
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");

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

    const fetchData = async () => {
        try {
            setLoading(true);
            const [bannerRes, collectionRes] = await Promise.all([
                getBanners(),
                getCollections(),
            ]);
            setBanners(bannerRes.data);
            setCollections(collectionRes.data);
        } catch (err) {
            toast.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const resetForm = () => {
        setEditId(null);
        setForm({ title: "", subtitle: "", collectionId: "" });
        setImageFile(null);
        setImagePreview("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title || (!imageFile && !editId)) {
            return toast.warn("Title and Image are required");
        }

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("subtitle", form.subtitle);
        formData.append("collectionId", form.collectionId);
        if (imageFile) formData.append("image", imageFile);

        // Set default rank for new banners as the last one
        if (!editId) {
            formData.append("rank", banners.length);
        }

        try {
            if (editId) {
                await updateBanner(editId, formData);
                toast.success("Banner updated");
            } else {
                await createBanner(formData);
                toast.success("Banner created");
            }
            resetForm();
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to save banner");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (banner) => {
        setEditId(banner._id);
        setForm({
            title: banner.title,
            subtitle: banner.subtitle || "",
            collectionId: banner.collectionId?._id || "",
        });
        setImagePreview(banner.image);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure?")) return;
        try {
            await deleteBanner(id);
            toast.info("Banner removed");
            fetchData();
        } catch {
            toast.error("Failed to delete");
        }
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setBanners((items) => {
                const oldIndex = items.findIndex((item) => item._id === active.id);
                const newIndex = items.findIndex((item) => item._id === over.id);
                const newItems = arrayMove(items, oldIndex, newIndex);

                // Persist ranks to backend
                const bannerRanks = newItems.map((item, index) => ({
                    _id: item._id,
                    rank: index,
                }));
                updateBannerRanks(bannerRanks).catch(() => toast.error("Failed to update ranks"));

                return newItems;
            });
        }
    };

    return (
        <div className="w-full space-y-12 pb-20">
            {/* HEADER */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                    <ImageIcon size={20} className="text-white" />
                </div>
                <div>
                    <h1 className="text-xl font-semibold tracking-wide text-white">Banner Management</h1>
                    <p className="text-xs text-white/40">Design and rank your store's homepage banners</p>
                </div>
            </div>

            {/* FORM SECTION (NOW FULL WIDTH & CENTERED) */}
            <div className="flex justify-center w-full">
                <form
                    onSubmit={handleSubmit}
                    className="glass p-8 rounded-3xl border border-white/20 space-y-6 shadow-2xl relative max-w-2xl w-full"
                >
                    <h2 className="text-base font-bold text-white flex items-center gap-2 mb-2">
                        <Plus size={18} className="text-orange-400" />
                        {editId ? "Edit Banner" : "Create New Banner"}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Title</label>
                                <input
                                    className="glass-input !bg-white/5"
                                    placeholder="e.g. New Arrivals"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Subtitle</label>
                                <input
                                    className="glass-input !bg-white/5"
                                    placeholder="e.g. Up to 50% Off"
                                    value={form.subtitle}
                                    onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Linked Collection</label>
                                <select
                                    className="glass-input !bg-white/5 text-white"
                                    value={form.collectionId}
                                    onChange={(e) => setForm({ ...form, collectionId: e.target.value })}
                                >
                                    <option value="" className="bg-slate-900">None</option>
                                    {collections.map(c => (
                                        <option key={c._id} value={c._id} className="bg-slate-900">{c.title}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest ml-1">Banner Image</label>

                            {/* Visual Preview Area */}
                            <div className="relative group/upload h-[200px] rounded-3xl border border-white/10 bg-white/5 overflow-hidden shadow-inner flex items-center justify-center">
                                {imagePreview ? (
                                    <img src={imagePreview} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex flex-col items-center gap-2 opacity-20">
                                        <ImageIcon size={48} />
                                        <p className="text-[10px] font-medium">No Image Selected</p>
                                    </div>
                                )}
                            </div>

                            {/* Explicit Input Control */}
                            <div className="flex flex-col gap-2">
                                <label className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl cursor-pointer transition-all group/btn">
                                    <Plus size={16} className="text-orange-400 group-hover/btn:scale-110 transition-transform" />
                                    <span className="text-xs font-bold text-white/80">
                                        {imageFile ? "Change Image" : "Choose Banner Image"}
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                </label>
                                {imageFile && (
                                    <p className="text-[10px] text-orange-400/80 font-medium px-2 truncate text-center">
                                        Selected: {imageFile.name}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn-primary flex-1 flex items-center justify-center gap-2 h-12 rounded-2xl"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin w-4 h-4" /> : editId ? "Update Banner" : "Create Banner"}
                        </button>
                        {editId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-6 bg-white/10 text-white rounded-2xl hover:bg-white/20 transition-all border border-white/10"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* LIST SECTION (BELOW FORM) */}
            <div className="w-full space-y-6 pt-10 border-t border-white/5">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-white tracking-wide">Live Banners</h3>
                        <p className="text-xs text-white/40 italic">Drag cards to reorder homepage rankings</p>
                    </div>
                </div>

                {loading ? (
                    <div className="p-20 glass rounded-3xl flex flex-col items-center justify-center text-white/40 gap-4">
                        <Loader2 size={32} className="animate-spin text-orange-500" />
                        <p className="text-xs font-bold uppercase tracking-widest">Refreshing...</p>
                    </div>
                ) : banners.length === 0 ? (
                    <div className="p-20 glass rounded-3xl flex flex-col items-center justify-center text-white/20 border-2 border-dashed border-white/5 gap-3">
                        <ImageIcon size={48} className="opacity-10" />
                        <p className="text-sm font-medium">No banners found. Use the form above to add one!</p>
                    </div>
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={banners.map(b => b._id)}
                            strategy={rectSortingStrategy}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {banners.map((banner, index) => (
                                    <SortableBannerItem
                                        key={banner._id}
                                        banner={banner}
                                        index={index}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                )}
            </div>
        </div>
    );
}

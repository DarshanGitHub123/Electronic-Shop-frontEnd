import { useState } from "react";
import { X, MapPin, CreditCard, Edit3, Tag } from "lucide-react";

export default function CheckoutModal({ isOpen, onClose, onSubmit, itemTotal, deliveryFee, discount, total }) {
    const [formData, setFormData] = useState({
        addressLine1: "",
        addressLine2: "",
        addressLine3: "",
        street: "",
        city: "",
        state: "",
        country: "India",
        postalCode: "",
        paymentMethod: "Online",
        customizationDescription: "",
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.addressLine1.trim()) newErrors.addressLine1 = "Address is required";
        if (!formData.street.trim()) newErrors.street = "Street is required";
        if (!formData.city.trim()) newErrors.city = "City is required";
        if (!formData.state.trim()) newErrors.state = "State is required";
        if (!formData.country.trim()) newErrors.country = "Country is required";
        if (!formData.postalCode.trim()) newErrors.postalCode = "Postal code is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 p-6 flex items-center justify-between z-10">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        Complete Order
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-8">
                    {/* Delivery Address Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-slate-700">
                            <MapPin className="w-5 h-5 text-blue-600" />
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white uppercase tracking-tight">
                                Shipping Address
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                                    Address Line 1 *
                                </label>
                                <input
                                    type="text"
                                    name="addressLine1"
                                    value={formData.addressLine1}
                                    onChange={handleChange}
                                    placeholder="House/Flat No., Building Name"
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white transition-all ${errors.addressLine1 ? "border-red-500" : "border-gray-200"}`}
                                />
                                {errors.addressLine1 && (
                                    <p className="text-red-500 text-[10px] font-bold mt-1 uppercase">{errors.addressLine1}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                                    Street *
                                </label>
                                <input
                                    type="text"
                                    name="street"
                                    value={formData.street}
                                    onChange={handleChange}
                                    placeholder="Street Name"
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white transition-all ${errors.street ? "border-red-500" : "border-gray-200"}`}
                                />
                                {errors.street && (
                                    <p className="text-red-500 text-[10px] font-bold mt-1 uppercase">{errors.street}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                                    City *
                                </label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    placeholder="City"
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white transition-all ${errors.city ? "border-red-500" : "border-gray-200"}`}
                                />
                                {errors.city && (
                                    <p className="text-red-500 text-[10px] font-bold mt-1 uppercase">{errors.city}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                                    State *
                                </label>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    placeholder="State"
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white transition-all ${errors.state ? "border-red-500" : "border-gray-200"}`}
                                />
                                {errors.state && (
                                    <p className="text-red-500 text-[10px] font-bold mt-1 uppercase">{errors.state}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                                    PIN Code *
                                </label>
                                <input
                                    type="text"
                                    name="postalCode"
                                    value={formData.postalCode}
                                    onChange={handleChange}
                                    placeholder="Postal Code"
                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white transition-all ${errors.postalCode ? "border-red-500" : "border-gray-200"}`}
                                />
                                {errors.postalCode && (
                                    <p className="text-red-500 text-[10px] font-bold mt-1 uppercase">{errors.postalCode}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Customization Details Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-slate-700">
                            <Edit3 className="w-5 h-5 text-purple-600" />
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white uppercase tracking-tight">
                                Order Customization
                            </h3>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                                Customization Notes (Optional)
                            </label>
                            <textarea
                                name="customizationDescription"
                                value={formData.customizationDescription}
                                onChange={handleChange}
                                rows="3"
                                placeholder="Any specific requirements for your order?"
                                className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-slate-900 dark:text-white transition-all resize-none"
                            ></textarea>
                        </div>
                    </div>

                    {/* Payment Method Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-slate-700">
                            <CreditCard className="w-5 h-5 text-blue-600" />
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white uppercase tracking-tight">
                                Payment Method
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className={`flex items-center gap-4 p-4 border-2 rounded-2xl cursor-pointer transition-all ${formData.paymentMethod === "Online" ? "border-blue-600 bg-blue-50 dark:bg-blue-900/10" : "border-gray-100 dark:border-slate-700 hover:border-gray-200"}`}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="Online"
                                    checked={formData.paymentMethod === "Online"}
                                    onChange={handleChange}
                                    className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                                />
                                <div className="flex flex-col">
                                    <span className="font-bold text-sm dark:text-white">Online Payment</span>
                                    <span className="font-medium text-[10px] text-gray-500 uppercase tracking-wider">UPI, Cards, Net Banking</span>
                                </div>
                            </label>

                            <label className={`flex items-center gap-4 p-4 border-2 rounded-2xl cursor-pointer transition-all ${formData.paymentMethod === "COD" ? "border-blue-600 bg-blue-50 dark:bg-blue-900/10" : "border-gray-100 dark:border-slate-700 hover:border-gray-200"}`}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="COD"
                                    checked={formData.paymentMethod === "COD"}
                                    onChange={handleChange}
                                    className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                                />
                                <div className="flex flex-col">
                                    <span className="font-bold text-sm dark:text-white">Cash on Delivery</span>
                                    <span className="font-medium text-[10px] text-gray-500 uppercase tracking-wider">Pay at your doorstep</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Detailed Order Summary */}
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-3xl border border-gray-100 dark:border-slate-700 space-y-4">
                        <h3 className="font-bold text-sm uppercase tracking-widest text-gray-400">Detailed Billing</h3>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 font-medium">Items Total</span>
                                <span className="font-bold">₹{itemTotal}</span>
                            </div>

                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 font-medium">Delivery Fee</span>
                                <span className={`font-bold ${deliveryFee === 0 ? 'text-green-600' : ''}`}>
                                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                                </span>
                            </div>

                            <div className="flex justify-between items-center text-sm">
                                <span className="text-green-600 font-bold flex items-center gap-2">
                                    <Tag className="w-4 h-4" />
                                    Extra Discount
                                </span>
                                <span className="font-bold text-green-600">-₹{discount}</span>
                            </div>

                            <div className="pt-3 mt-3 border-t border-gray-200 dark:border-slate-700 flex justify-between items-center">
                                <span className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Total Payable</span>
                                <span className="text-2xl font-black text-blue-600">₹{total}</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-4 border border-gray-200 dark:border-slate-700 text-gray-500 font-bold rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-all uppercase tracking-widest text-xs"
                        >
                            Back
                        </button>
                        <button
                            type="submit"
                            className="flex-[2] px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:shadow-2xl transition-all font-black uppercase tracking-widest text-sm"
                        >
                            {formData.paymentMethod === "Online" ? "Pay and Place Order" : "Place Order Now"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

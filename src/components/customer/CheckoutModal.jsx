import { useState } from "react";
import { X, MapPin, CreditCard } from "lucide-react";

export default function CheckoutModal({ isOpen, onClose, onSubmit, total }) {
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
                <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 p-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        Checkout
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Delivery Address Section */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <MapPin className="w-5 h-5 text-blue-600" />
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                                Delivery Address
                            </h3>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Address Line 1 *
                                </label>
                                <input
                                    type="text"
                                    name="addressLine1"
                                    value={formData.addressLine1}
                                    onChange={handleChange}
                                    placeholder="House/Flat No., Building Name"
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white ${errors.addressLine1 ? "border-red-500" : "border-gray-300"
                                        }`}
                                />
                                {errors.addressLine1 && (
                                    <p className="text-red-500 text-xs mt-1">{errors.addressLine1}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Address Line 2
                                </label>
                                <input
                                    type="text"
                                    name="addressLine2"
                                    value={formData.addressLine2}
                                    onChange={handleChange}
                                    placeholder="Area, Locality"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Address Line 3
                                </label>
                                <input
                                    type="text"
                                    name="addressLine3"
                                    value={formData.addressLine3}
                                    onChange={handleChange}
                                    placeholder="Landmark"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Street *
                                    </label>
                                    <input
                                        type="text"
                                        name="street"
                                        value={formData.street}
                                        onChange={handleChange}
                                        placeholder="Street Name"
                                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white ${errors.street ? "border-red-500" : "border-gray-300"
                                            }`}
                                    />
                                    {errors.street && (
                                        <p className="text-red-500 text-xs mt-1">{errors.street}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        City *
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        placeholder="City"
                                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white ${errors.city ? "border-red-500" : "border-gray-300"
                                            }`}
                                    />
                                    {errors.city && (
                                        <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        State *
                                    </label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        placeholder="State"
                                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white ${errors.state ? "border-red-500" : "border-gray-300"
                                            }`}
                                    />
                                    {errors.state && (
                                        <p className="text-red-500 text-xs mt-1">{errors.state}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Postal Code *
                                    </label>
                                    <input
                                        type="text"
                                        name="postalCode"
                                        value={formData.postalCode}
                                        onChange={handleChange}
                                        placeholder="PIN Code"
                                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white ${errors.postalCode ? "border-red-500" : "border-gray-300"
                                            }`}
                                    />
                                    {errors.postalCode && (
                                        <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Country *
                                </label>
                                <input
                                    type="text"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    placeholder="Country"
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white ${errors.country ? "border-red-500" : "border-gray-300"
                                        }`}
                                />
                                {errors.country && (
                                    <p className="text-red-500 text-xs mt-1">{errors.country}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Payment Method Section */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <CreditCard className="w-5 h-5 text-blue-600" />
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                                Payment Method
                            </h3>
                        </div>

                        <div className="space-y-3">
                            <label className="flex items-center gap-3 p-4 border-2 border-gray-200 dark:border-slate-600 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="Online"
                                    checked={formData.paymentMethod === "Online"}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-blue-600"
                                />
                                <div>
                                    <p className="font-medium text-gray-800 dark:text-white">Online Payment</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Pay using UPI, Card, or Net Banking</p>
                                </div>
                            </label>

                            <label className="flex items-center gap-3 p-4 border-2 border-gray-200 dark:border-slate-600 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="COD"
                                    checked={formData.paymentMethod === "COD"}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-blue-600"
                                />
                                <div>
                                    <p className="font-medium text-gray-800 dark:text-white">Cash on Delivery</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Pay when you receive the order</p>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold text-gray-800 dark:text-white">
                                Total Amount
                            </span>
                            <span className="text-2xl font-bold text-blue-600">
                                ₹{total}
                            </span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-bold"
                        >
                            Place Order
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

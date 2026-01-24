import React from 'react';

export default function ShippingInfo() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Shipping Information</h1>

            <div className="space-y-8 text-gray-600 dark:text-gray-400">
                <section>
                    <h2 className="text-xl font-semibold mb-3 text-blue-600">Delivery Areas</h2>
                    <p>
                        We ship to over 20,000+ pin codes across India. For metropolitan cities, we offer express 24-48 hour delivery.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-blue-600">Shipping Costs</h2>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Free Shipping</strong> on orders above ₹499.</li>
                        <li>Standard Shipping: ₹40 for orders below ₹499.</li>
                        <li>Cash on Delivery (COD) available for most locations.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-blue-600">Order Tracking</h2>
                    <p>
                        You will receive an SMS and email with the tracking ID once your order is dispatched. We partner with top logistics like Delhivery, BlueDart, and Ecom Express to ensure safety.
                    </p>
                </section>
            </div>
        </div>
    );
}

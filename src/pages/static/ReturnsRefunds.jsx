import React from 'react';

export default function ReturnsRefunds() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Returns & Refunds</h1>

            <div className="space-y-8 text-gray-600 dark:text-gray-400">
                <section>
                    <h2 className="text-xl font-semibold mb-3 text-blue-600">Return Policy</h2>
                    <p>
                        We offer a 7-day hassle-free return policy for most electronics. Items must be in their original packaging with all accessories included and the warranty seal intact.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-blue-600">How to Start a Return</h2>
                    <ol className="list-decimal pl-5 space-y-2">
                        <li>Go to "My Orders" in your profile.</li>
                        <li>Select the items you wish to return.</li>
                        <li>Choose a reason for return and upload photos if the item is damaged.</li>
                        <li>Pack the item securely and wait for our courier partner to pick it up.</li>
                    </ol>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-blue-600">Refund Process</h2>
                    <p>
                        Once the item is received and inspected at our warehouse, the refund will be processed within 5-7 business days to your original payment method or UPI.
                    </p>
                </section>
            </div>
        </div>
    );
}

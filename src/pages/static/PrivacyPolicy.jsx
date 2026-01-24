import React from 'react';

export default function PrivacyPolicy() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Privacy Policy</h1>

            <div className="space-y-8 text-gray-600 dark:text-gray-400">
                <section>
                    <h2 className="text-xl font-semibold mb-3 text-blue-600">Information We Collect</h2>
                    <p>
                        We collect personal information such as your name, email, phone number, and delivery address to process your orders and provide a personalized experience.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-blue-600">How We Use Your Data</h2>
                    <p>
                        Your data is used for order fulfillment, customer support, and occasionally for marketing communications (which you can opt-out of at any time).
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-blue-600">Security</h2>
                    <p>
                        We use SSL encryption and secure payment gateways (like Razorpay/PayPal) to ensure your financial data is never stored on our servers.
                    </p>
                </section>
            </div>
        </div>
    );
}

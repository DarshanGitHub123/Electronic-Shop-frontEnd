import React from 'react';

export default function HelpCenter() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Help Center</h1>

            <div className="space-y-8">
                <section>
                    <h2 className="text-xl font-semibold mb-3 text-blue-600">Frequently Asked Questions</h2>
                    <div className="space-y-4 text-gray-600 dark:text-gray-400">
                        <div>
                            <p className="font-medium text-gray-800 dark:text-gray-200">How do I track my order?</p>
                            <p>You can track your order by clicking the "Track Order" link in the footer or through your account dashboard.</p>
                        </div>
                        <div>
                            <p className="font-medium text-gray-800 dark:text-gray-200">What are the delivery times?</p>
                            <p>Usually, products are delivered within 3-5 business days depending on your location.</p>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-blue-600">Contact Support</h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        If you can't find what you're looking for, our support team is available 24/7.
                        <br />
                        Email: support@electroshop.com
                        <br />
                        Toll-Free: 1800-123-4567
                    </p>
                </section>
            </div>
        </div>
    );
}

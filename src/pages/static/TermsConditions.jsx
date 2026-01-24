import React from 'react';

export default function TermsConditions() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Terms & Conditions</h1>

            <div className="space-y-8 text-gray-600 dark:text-gray-400">
                <section>
                    <h2 className="text-xl font-semibold mb-3 text-blue-600">Usage Agreement</h2>
                    <p>
                        By using ElectroShop, you agree to comply with all local laws and regulations. You are responsible for maintaining the confidentiality of your account credentials.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-blue-600">Product Authenticity</h2>
                    <p>
                        All products sold on our platform are 100% genuine and sourced directly from authorized brand distributors. Manufacturer warranty applies to all eligible products.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3 text-blue-600">Payments & Pricing</h2>
                    <p>
                        We reserve the right to change prices without prior notice. In case of a pricing error on an order, we will notify you before cancellation or adjustment.
                    </p>
                </section>
            </div>
        </div>
    );
}

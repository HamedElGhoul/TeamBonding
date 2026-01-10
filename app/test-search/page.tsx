"use client";

import { useState } from "react";

export default function TestSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-8">🔍 Product Search Test</h1>
      
      <div className="max-w-2xl">
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search for products..."
            className="flex-1 px-4 py-2 border rounded-lg"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {results && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">
              Found {results.products?.length || 0} products
            </h2>
            
            {results.products?.map((product: any, index: number) => (
              <div key={index} className="mb-4 p-4 border rounded">
                <h3 className="font-semibold">{product.title}</h3>
                <p className="text-lg text-green-600 font-bold">
                  ${product.price.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">{product.retailer}</p>
                {product.discountPercentage && (
                  <span className="text-red-500">
                    {product.discountPercentage}% OFF
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

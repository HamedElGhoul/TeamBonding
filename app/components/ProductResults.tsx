"use client";

interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  retailer: string;
  url: string;
  imageUrl?: string;
}

interface ProductResultsProps {
  products: Product[];
  query: string;
}

export default function ProductResults({ products, query }: ProductResultsProps) {
  if (products.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">No products found for &quot;{query}&quot;</p>
        <p className="text-sm text-gray-500 mt-2">Try a different search term</p>
      </div>
    );
  }

  const cheapest = products[0];

  return (
    <div className="p-6 bg-white">
      <h2 className="text-2xl font-bold mb-4">
        🔍 Results for &quot;{query}&quot;
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Found {products.length} products • Sorted by price
      </p>

      <div className="space-y-4">
        {products.slice(0, 10).map((product, index) => (
          <div
            key={product.id}
            className={`border rounded-lg p-4 hover:shadow-lg transition-shadow ${
              index === 0 ? "ring-2 ring-green-500 bg-green-50" : ""
            }`}
          >
            <div className="flex gap-4">
              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-24 h-24 object-cover rounded"
                />
              )}
              
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-lg line-clamp-2">
                    {index === 0 && <span className="text-green-600">🏆 CHEAPEST! </span>}
                    {product.title}
                  </h3>
                </div>
                
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-green-600">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-gray-500 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                  {product.discountPercentage && (
                    <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                      {product.discountPercentage}% OFF
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-gray-600 mt-1">
                  from {product.retailer}
                </p>
                
                <a
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium"
                >
                  View Product →
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length > 10 && (
        <p className="text-center text-gray-500 mt-6">
          Showing top 10 of {products.length} results
        </p>
      )}
    </div>
  );
}

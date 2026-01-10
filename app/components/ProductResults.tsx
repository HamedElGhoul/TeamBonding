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
      <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-4xl animate-bounce">
          🔍
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-3">No products found</h2>
        <p className="text-lg text-gray-500 max-w-md mx-auto">
          We couldn&apos;t find any matches for &quot;{query}&quot;. Try generic terms like &quot;laptop&quot; or &quot;coffee&quot;.
        </p>
      </div>
    );
  }

  const cheapest = products[0];

  return (
    <div className="py-8 animate-in slide-in-from-bottom-4 duration-700 fade-in">
      <div className="max-w-7xl mx-auto">
        {/* Header Stats */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 pb-6 border-b border-gray-200/60">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              Results for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">&quot;{query}&quot;</span>
            </h2>
            <p className="text-gray-500 mt-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Found {products.length} active listings
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100 flex items-center gap-2">
            <span className="text-gray-400 text-sm">Sort:</span>
            <span className="font-semibold text-gray-700 bg-gray-50 px-3 py-1 rounded-md">Price: Low to High</span>
          </div>
        </div>

        {/* Featured Best Deal */}
        <div className="mb-10 relative overflow-hidden rounded-3xl shadow-2xl bg-white border border-green-100 group">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500"></div>
          <div className="md:flex">
            {/* Image Side */}
            <div className="md:w-1/3 bg-gray-50 p-8 flex items-center justify-center relative">
              <div className="absolute top-4 left-4 bg-green-500 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg z-10 flex items-center gap-1">
                🏆 BEST PRICE
              </div>
              {cheapest.imageUrl ? (
                <img
                  src={cheapest.imageUrl}
                  alt={cheapest.title}
                  className="w-48 h-48 md:w-64 md:h-64 object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="text-6xl text-gray-300">📦</div>
              )}
            </div>

            {/* Content Side */}
            <div className="md:w-2/3 p-8 flex flex-col justify-center">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 leading-tight mb-2">
                    {cheapest.title}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-500 font-medium">
                    <span>Sold by</span>
                    <span className="text-gray-900 flex items-center gap-1">
                      🛍️ {cheapest.retailer}
                    </span>
                  </div>
                </div>
                {cheapest.discountPercentage && (
                  <div className="hidden md:block bg-red-50 text-red-600 px-4 py-2 rounded-xl font-bold text-xl border border-red-100">
                    -{cheapest.discountPercentage}%
                  </div>
                )}
              </div>

              <div className="flex items-end gap-4 mb-8 mt-auto">
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-1">Total Price</p>
                  <span className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600">
                    ${cheapest.price.toFixed(2)}
                  </span>
                </div>
                {cheapest.originalPrice && (
                  <div className="mb-2">
                    <p className="text-xs text-gray-400 font-medium mb-1">Was</p>
                    <span className="text-xl text-gray-400 line-through font-medium">
                      ${cheapest.originalPrice.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              <a
                href={cheapest.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full md:w-auto bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-center flex items-center justify-center gap-2"
              >
                Buy Now at {cheapest.retailer} ↗
              </a>
            </div>
          </div>
        </div>

        {/* Regular Grid */}
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          Other Options <span className="text-gray-400 font-normal text-sm">({products.length - 1} more)</span>
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.slice(1, 13).map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 flex flex-col overflow-hidden"
            >
              {/* Card Image */}
              <div className="relative pt-[100%] bg-gray-50 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center p-6">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="text-4xl text-gray-300">📦</div>
                  )}
                </div>
                {product.discountPercentage && (
                  <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                    -{product.discountPercentage}%
                  </div>
                )}
              </div>

              {/* Card Content */}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex-1">
                  <p className="text-xs text-blue-600 font-bold tracking-wider uppercase mb-1 truncate">
                    {product.retailer}
                  </p>
                  <h3 className="font-semibold text-gray-900 line-clamp-2 leading-relaxed mb-3 group-hover:text-blue-600 transition-colors">
                    {product.title}
                  </h3>
                </div>

                <div className="pt-4 border-t border-gray-50 mt-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-gray-900">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  
                  <a
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center py-2.5 rounded-lg font-semibold bg-gray-50 text-gray-700 hover:bg-blue-600 hover:text-white transition-all duration-200 border border-gray-200 hover:border-transparent"
                  >
                    Buy at {product.retailer}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length > 13 && (
          <div className="mt-12 text-center pb-8">
            <button className="px-8 py-3 bg-white border border-gray-200 rounded-full font-semibold text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-colors shadow-sm">
              Show Next 20 Results ({products.length - 13} remaining)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

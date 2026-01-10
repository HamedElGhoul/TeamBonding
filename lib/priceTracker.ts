import axios from "axios";

export interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  retailer: string;
  url: string;
  imageUrl?: string;
}

export async function searchProducts(query: string): Promise<Product[]> {
  const apiKey = process.env.SERPAPI_KEY;
  
  if (!apiKey) {
    console.error("SERPAPI_KEY not found");
    return [];
  }

  try {
    const response = await axios.get("https://serpapi.com/search.json", {
      params: {
        engine: "google_shopping",
        q: query,
        location: "Canada",
        gl: "ca",
        api_key: apiKey,
      },
    });

    const results = response.data.shopping_results || [];
    
    const products: Product[] = results.map((item: any, index: number) => ({
      id: item.position?.toString() || index.toString(),
      title: item.title || "Unknown Product",
      price: parseFloat(item.extracted_price || item.price || "0"),
      originalPrice: item.extracted_original_price 
        ? parseFloat(item.extracted_original_price)
        : undefined,
      discountPercentage: item.extracted_original_price
        ? Math.round(
            ((parseFloat(item.extracted_original_price) - parseFloat(item.extracted_price)) /
              parseFloat(item.extracted_original_price)) *
              100
          )
        : undefined,
      retailer: item.source || "Unknown",
      url: item.link || "#",
      imageUrl: item.thumbnail || undefined,
    }));

    // Sort by price (cheapest first)
    return products.sort((a, b) => a.price - b.price);
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

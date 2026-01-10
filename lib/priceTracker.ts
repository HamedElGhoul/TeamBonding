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
  
  console.log("🔍 Searching for:", query);
  console.log("🔑 API Key exists:", !!apiKey);
  
  if (!apiKey) {
    console.error("❌ SERPAPI_KEY not found");
    return [];
  }

  try {
    const url = "https://serpapi.com/search.json";
    const params = {
      engine: "google_shopping",
      q: query,
      location: "Canada",
      gl: "ca",
      api_key: apiKey,
    };
    
    console.log("📡 Making request to SerpAPI...");
    const response = await axios.get(url, { params });
    
    console.log("✅ Response status:", response.status);
    console.log("📦 Shopping results count:", response.data.shopping_results?.length || 0);

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
      url: item.link || item.product_link || item.shopping_link || "#",
      imageUrl: item.thumbnail || undefined,
    }));

    if (results.length > 0) {
      console.log("🔍 First product raw data sample:", JSON.stringify(results[0], null, 2));
    }

    console.log("✅ Processed products:", products.length);
    // Sort by price (cheapest first)
    return products.sort((a, b) => a.price - b.price);
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    if (axios.isAxiosError(error)) {
      console.error("Response data:", error.response?.data);
      console.error("Response status:", error.response?.status);
    }
    return [];
  }
}

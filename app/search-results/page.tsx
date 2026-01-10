"use client";

import ProductResults from "@/app/components/ProductResults";
import { useStructuredContent } from "@openai/chatgpt-apps-sdk/client";

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

export default function SearchResultsPage() {
  const structuredContent = useStructuredContent<{
    query: string;
    products: Product[];
    totalResults: number;
  }>();

  const products = structuredContent?.products || [];
  const query = structuredContent?.query || "";

  return <ProductResults products={products} query={query} />;
}

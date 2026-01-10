"use client";

import ProductResults from "@/app/components/ProductResults";
import { useWidgetProps } from "@/app/hooks";

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
  const toolOutput = useWidgetProps<{
    query?: string;
    products?: Product[];
    totalResults?: number;
  }>();

  const products = toolOutput?.products || [];
  const query = toolOutput?.query || "";

  return <ProductResults products={products} query={query} />;
}

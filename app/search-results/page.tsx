import ProductResults from "@/app/components/ProductResults";

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

interface SearchParams {
  products?: Product[];
  query?: string;
}

export default async function SearchResultsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const products = params.products || [];
  const query = params.query || "";

  return <ProductResults products={products} query={query} />;
}

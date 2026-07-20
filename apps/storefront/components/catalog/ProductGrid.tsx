import type { PublicProductCard as PublicProductCardData } from "@fardad/types";
import ProductCard from "./ProductCard";

type ProductGridProps = {
  products: readonly PublicProductCardData[];
};

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="list">
      {products.map((product) => (
        <div key={product.slug} role="listitem">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}

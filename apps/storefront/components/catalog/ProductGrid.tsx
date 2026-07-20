import type {
  LocalizedContentProfile,
  ProductCardVariantId,
  PublicProductCard as PublicProductCardData,
} from "@fardad/types";
import ProductCard from "./ProductCard";

type ProductGridProps = {
  products: readonly PublicProductCardData[];
  content: LocalizedContentProfile["catalog"];
  variant: ProductCardVariantId;
};

export default function ProductGrid({ content, products, variant }: ProductGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="list">
      {products.map((product) => (
        <div key={product.slug} role="listitem">
          <ProductCard content={content} product={product} variant={variant} />
        </div>
      ))}
    </div>
  );
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  order: number;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
}

export interface ProductPrice {
  price: number;
  discount?: number;
  finalPrice: number;
  currency: "IRT";
}

export interface ProductSeo {
  title: string;
  description: string;
  keywords: string[];
}

export interface Product {
  id: string;
  title: string;
  slug: string;

  shortDescription: string;
  description: string;

  sku: string;

  category: ProductCategory;

  images: ProductImage[];

  price: ProductPrice;

  tags: string[];

  featured: boolean;

  published: boolean;

  stock: number;

  createdAt: Date;

  updatedAt: Date;

  seo: ProductSeo;
}
import { BaseEntity } from "./api";
import { FileEntity } from "./FileEntity";

export interface ProductVariant extends BaseEntity {
  productId: number;
  title: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  costPerItem?: number;
  quantity: number;
  trackQuantity: boolean;
  continueSellingWhenOutOfStock: boolean;
  requiresShipping: boolean;
  isTaxable: boolean;
  weight: number;
  weightUnit?: string;
  barcode?: string;
  position: number;
  isDefault: boolean;
  customFields: Record<string, any>;
  option1?: string;
  option2?: string;
  option3?: string;
  images: ProductVariantImage[];
  featuredImageUrl?: string;
  // Computed properties
  isAvailable: boolean;
  discountPercentage?: number;
  displayTitle: string;
}

export interface CreateProductVariant {
  title: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  costPerItem?: number;
  quantity: number;
  trackQuantity: boolean;
  continueSellingWhenOutOfStock: boolean;
  requiresShipping: boolean;
  isTaxable: boolean;
  weight: number;
  weightUnit?: string;
  barcode?: string;
  position: number;
  isDefault: boolean;
  customFields: Record<string, any>;
  option1?: string;
  option2?: string;
  option3?: string;
  images: CreateProductVariantImage[];
}

export interface UpdateProductVariant {
  id: number;
  title: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  costPerItem?: number;
  quantity: number;
  trackQuantity: boolean;
  continueSellingWhenOutOfStock: boolean;
  requiresShipping: boolean;
  isTaxable: boolean;
  weight: number;
  weightUnit?: string;
  barcode?: string;
  position: number;
  isDefault: boolean;
  customFields: Record<string, any>;
  option1?: string;
  option2?: string;
  option3?: string;
  images: UpdateProductVariantImage[];
}
export interface UpdateProductVariantImage {
  id: number;
  fileId: number;
  alt?: string;
  caption?: string;
  position: number;
  isFeatured: boolean;
}
export interface ProductVariantImage extends BaseEntity {
  productVariantId: number;
  fileId: number;
  file?: FileEntity;
  alt?: string;
  caption?: string;
  position: number;
  isFeatured: boolean;
  imageUrl: string;
  thumbnailUrl?: string;
}
export interface CreateProductVariantImage {
  fileId: number;
  alt?: string;
  caption?: string;
  position: number;
  isFeatured: boolean;
}

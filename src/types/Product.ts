import { BaseEntity } from "./api";
import { Category } from "./Category";
import { ProductStatus, ProductType } from "./enums";
import { FileEntity } from "./FileEntity";
import {
  CreateProductVariant,
  ProductVariant,
  UpdateProductVariant,
} from "./ProductVariant";

export interface ProductImage extends BaseEntity {
  productId: number;
  fileId: number;
  file?: FileEntity;
  alt?: string;
  caption?: string;
  position: number;
  isFeatured: boolean;
  imageUrl: string;
  thumbnailUrl?: string;
}

export interface CreateProductImage {
  fileId: number;
  alt?: string;
  caption?: string;
  position: number;
  isFeatured: boolean;
}

export interface UpdateProductImage {
  id: number;
  fileId: number;
  alt?: string;
  caption?: string;
  position: number;
  isFeatured: boolean;
}

export interface ProductOption extends BaseEntity {
  productId: number;
  name: string;
  position: number;
  values: ProductOptionValue[];
}

export interface CreateProductOption {
  name: string;
  position: number;
  values: CreateProductOptionValue[];
}

export interface UpdateProductOption {
  id: number;
  name: string;
  position: number;
  values: UpdateProductOptionValue[];
}

export interface ProductOptionValue extends BaseEntity {
  productOptionId: number;
  value: string;
  position: number;
}

export interface CreateProductOptionValue {
  value: string;
  position: number;
}

export interface UpdateProductOptionValue {
  id: number;
  value: string;
  position: number;
}

export interface Product extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  costPerItem?: number;
  trackQuantity: boolean;
  quantity: number;
  continueSellingWhenOutOfStock: boolean;
  requiresShipping: boolean;
  isPhysicalProduct: boolean;
  weight: number;
  weightUnit?: string;
  isTaxable: boolean;
  status: ProductStatus;
  type: ProductType;
  vendor?: string;
  barcode?: string;
  hasVariants: boolean;
  tags?: string;
  publishedAt?: string;
  template?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  searchKeywords?: string;
  customFields: Record<string, any>;
  seoSettings: Record<string, any>;
  categories: Category[];
  variants: ProductVariant[];
  images: ProductImage[];
  options: ProductOption[];
  featuredImageUrl?: string;
  // Computed properties
  statusName: string;
  typeName: string;
  isAvailable: boolean;
  discountPercentage?: number;
}

export interface CreateProduct {
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  costPerItem?: number;
  trackQuantity: boolean;
  quantity: number;
  continueSellingWhenOutOfStock: boolean;
  requiresShipping: boolean;
  isPhysicalProduct: boolean;
  weight: number;
  weightUnit?: string;
  isTaxable: boolean;
  status: ProductStatus;
  type: ProductType;
  vendor?: string;
  barcode?: string;
  hasVariants: boolean;
  tags?: string;
  template?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  searchKeywords?: string;
  customFields: Record<string, any>;
  seoSettings: Record<string, any>;
  categoryIds: number[];
  images: CreateProductImage[];
  options: CreateProductOption[];
  variants: CreateProductVariant[];
}

export interface UpdateProduct {
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  costPerItem?: number;
  trackQuantity: boolean;
  quantity: number;
  continueSellingWhenOutOfStock: boolean;
  requiresShipping: boolean;
  isPhysicalProduct: boolean;
  weight: number;
  weightUnit?: string;
  isTaxable: boolean;
  status: ProductStatus;
  type: ProductType;
  vendor?: string;
  barcode?: string;
  hasVariants: boolean;
  tags?: string;
  template?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  searchKeywords?: string;
  customFields: Record<string, any>;
  seoSettings: Record<string, any>;
  categoryIds: number[];
  images: UpdateProductImage[];
  options: UpdateProductOption[];
  variants: UpdateProductVariant[];
}

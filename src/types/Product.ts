import { BaseEntity } from "./api";
import { ProductStatus, ProductType } from "./enums";

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

  // Computed properties
  statusName: string;
  typeName: string;
  isAvailable: boolean;
  discountPercentage?: number;
  featuredImage?: string;
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

export interface UpdateProduct extends CreateProduct {}

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
  image?: string;
  position: number;
  isDefault: boolean;
  customFields: Record<string, any>;
  option1?: string;
  option2?: string;
  option3?: string;

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
  image?: string;
  position: number;
  isDefault: boolean;
  customFields: Record<string, any>;
  option1?: string;
  option2?: string;
  option3?: string;
}

export interface UpdateProductVariant extends CreateProductVariant {
  id: number;
}

export interface Category extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  image?: string;
  parentCategoryId?: number;
  parentCategoryName?: string;
  subCategories: Category[];
  isActive: boolean;
  isVisible: boolean;
  sortOrder: number;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  customFields: Record<string, any>;
  productCount: number;
}

export interface CreateCategory {
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  image?: string;
  parentCategoryId?: number;
  isActive: boolean;
  isVisible: boolean;
  sortOrder: number;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  customFields: Record<string, any>;
}

export interface UpdateCategory extends CreateCategory {}

export interface ProductImage extends BaseEntity {
  productId: number;
  productVariantId?: number;
  url: string;
  alt?: string;
  position: number;
  width?: number;
  height?: number;
  originalSource?: string;
}

export interface CreateProductImage {
  productVariantId?: number;
  url: string;
  alt?: string;
  position: number;
  width?: number;
  height?: number;
  originalSource?: string;
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

export interface ProductOptionValue extends BaseEntity {
  productOptionId: number;
  value: string;
  position: number;
}

export interface CreateProductOptionValue {
  value: string;
  position: number;
}

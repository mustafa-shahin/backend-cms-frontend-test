import { BaseEntity } from "./api";
import { ProductStatus, ProductType } from "./enums";
import { FileEntity } from "./FileEntity";

export interface ProductImage extends BaseEntity {
  productId: number;
  fileId: number;
  file: FileEntity;
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

export interface ProductVariantImage extends BaseEntity {
  productVariantId: number;
  fileId: number;
  file: FileEntity;
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
  position: number;
  isDefault: boolean;
  customFields: Record<string, any>;
  option1?: string;
  option2?: string;
  option3?: string;
  images: ProductVariantImage[];
  isAvailable: boolean;
  discountPercentage?: number;
  displayTitle: string;
  featuredImageUrl?: string;
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

export interface UpdateProductVariant extends CreateProductVariant {
  id: number;
}

export interface CategoryImage extends BaseEntity {
  categoryId: number;
  fileId: number;
  file: FileEntity;
  alt?: string;
  caption?: string;
  position: number;
  isFeatured: boolean;
  imageUrl: string;
  thumbnailUrl?: string;
}

export interface CreateCategoryImage {
  fileId: number;
  alt?: string;
  caption?: string;
  position: number;
  isFeatured: boolean;
}

export interface Category extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
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
  images: CategoryImage[];
  featuredImageUrl?: string;
}

export interface CreateCategory {
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  parentCategoryId?: number;
  isActive: boolean;
  isVisible: boolean;
  sortOrder: number;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  customFields: Record<string, any>;
  images: CreateCategoryImage[];
}

export interface UpdateCategory extends CreateCategory {}

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

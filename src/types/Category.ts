import { BaseEntity } from "./api";
import { FileEntity } from "./FileEntity";

export interface CategoryImage extends BaseEntity {
  categoryId: number;
  fileId: number;
  file?: FileEntity;
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

export interface UpdateCategoryImage {
  id: number;
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

export interface UpdateCategory {
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
  images: UpdateCategoryImage[];
}

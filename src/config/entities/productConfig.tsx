// src/config/entities/productConfig.tsx
import React, { useState } from "react";
import { EntityManagerConfig } from "../../components/entities/EntityManager";
import { FormField, Product, Category } from "../../types";
import {
  createCheckboxField,
  createNumberField,
  createSelectField,
  createTextAreaField,
  createTextField,
} from "../../utils/formFieldHelpers";
import { ProductStatus, ProductType } from "../../types/enums";
import { format } from "date-fns";
import ImageSelector from "../../components/ui/ImageSelector";
import ProductVariantManager, {
  ProductVariantManagerProps,
} from "../../components/ui/ProductVariantManager";
import CategorySelector from "../../components/ui/CategorySelector";
import { apiService } from "../../Services/ApiServices";
import { Button, Icon, Modal, Form } from "../../components/common";
import { categoryEntityConfig } from "./categoryConfig";
import { productVariantEntityConfig } from "./productVariantConfig";
import toast from "react-hot-toast";

export const productEntityConfig: EntityManagerConfig<Product> = {
  entityName: "Product",
  apiEndpoint: "/product",
  columns: [
    {
      key: "name",
      label: "Name",
      render: (name, product) => {
        const featuredImageUrl = apiService.getFeaturedImageUrl(
          product.images || []
        );
        return (
          <div className="flex items-center">
            {featuredImageUrl && (
              <div className="flex-shrink-0 h-10 w-10 mr-3">
                <img
                  src={featuredImageUrl}
                  alt={name}
                  className="h-10 w-10 object-cover rounded"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              </div>
            )}
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {name}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                SKU: {product.sku}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      key: "price",
      label: "Price",
      render: (price, product) => (
        <div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            ${price.toFixed(2)}
          </div>
          {product.compareAtPrice && product.compareAtPrice > price && (
            <div className="text-sm text-gray-500 dark:text-gray-400 line-through">
              ${product.compareAtPrice.toFixed(2)}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (status) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            status === ProductStatus.Active
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : status === ProductStatus.Draft
              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
              : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
          }`}
        >
          {ProductStatus[status]}
        </span>
      ),
    },
    {
      key: "type",
      label: "Type",
      render: (type, product) => (
        <span className="text-sm text-gray-900 dark:text-white">
          {product.typeName || ProductType[type] || "Unknown"}
        </span>
      ),
    },
    {
      key: "quantity",
      label: "Stock",
      render: (quantity, product) => (
        <div>
          <span
            className={`text-sm font-medium ${
              quantity === 0
                ? "text-red-600 dark:text-red-400"
                : quantity < 10
                ? "text-yellow-600 dark:text-yellow-400"
                : "text-green-600 dark:text-green-400"
            }`}
          >
            {product.hasVariants ? "Variants" : quantity}
          </span>
        </div>
      ),
    },
    {
      key: "categories",
      label: "Categories",
      render: (categories) => (
        <div className="flex flex-wrap gap-1">
          {categories?.slice(0, 2).map((cat: Category, index: number) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            >
              {cat.name}
            </span>
          ))}
          {categories?.length > 2 && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              +{categories.length - 2} more
            </span>
          )}
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      render: (date) => format(new Date(date), "MMM dd, yyyy"),
    },
  ],
  formFields: [
    // Basic Product Information
    createTextField("name", "Product Name", {
      required: true,
      validation: { required: "Product name is required" },
    }),
    createTextField("slug", "URL Slug", {
      required: true,
      validation: { required: "URL slug is required" },
      description: "URL-friendly version of the product name",
    }),
    createTextField("sku", "SKU", {
      required: true,
      validation: { required: "SKU is required" },
      description: "Stock Keeping Unit - unique product identifier",
    }),
    createTextAreaField("description", "Description", 4),
    createTextAreaField("shortDescription", "Short Description", 2),

    // Product Images
    {
      name: "imageIds",
      label: "Product Images",
      type: "text", // We'll override this with custom render
      description: "Select images for this product",
    } as FormField,

    // Categories
    {
      name: "categoryIds",
      label: "Product Categories",
      type: "text", // We'll override this with custom render
      description: "Select categories for this product",
    } as FormField,

    // Categories Display
    {
      name: "categoriesDisplay",
      label: "Selected Categories",
      type: "text", // We'll override this with custom render
      description: "Currently selected categories",
    } as FormField,

    // Pricing
    createNumberField("price", "Price", {
      required: true,
      min: 0,
      step: 0.01,
      validation: { required: "Price is required" },
    }),
    createNumberField("compareAtPrice", "Compare at Price", {
      min: 0,
      step: 0.01,
      description: "Original price for showing discounts",
    }),
    createNumberField("costPerItem", "Cost per Item", {
      min: 0,
      step: 0.01,
      description: "Cost to acquire or produce this item",
    }),

    // Inventory
    createCheckboxField("trackQuantity", "Track Quantity"),
    createNumberField("quantity", "Quantity", {
      min: 0,
      validation: { min: { value: 0, message: "Quantity cannot be negative" } },
    }),
    createCheckboxField(
      "continueSellingWhenOutOfStock",
      "Continue selling when out of stock"
    ),

    // Shipping
    createCheckboxField("requiresShipping", "Requires Shipping"),
    createCheckboxField("isPhysicalProduct", "Physical Product"),
    createNumberField("weight", "Weight", { min: 0, step: 0.01 }),
    createSelectField("weightUnit", "Weight Unit", [
      { value: "kg", label: "Kilograms" },
      { value: "g", label: "Grams" },
      { value: "lb", label: "Pounds" },
      { value: "oz", label: "Ounces" },
    ]),

    // Product Details
    createSelectField(
      "status",
      "Status",
      [
        { value: 0, label: "Draft" },
        { value: 1, label: "Active" },
        { value: 2, label: "Archived" },
      ],
      {
        required: true,
        validation: { required: "Status is required" },
      }
    ),
    createSelectField(
      "type",
      "Product Type",
      [
        { value: 0, label: "Physical" },
        { value: 1, label: "Digital" },
        { value: 2, label: "Service" },
        { value: 3, label: "Gift Card" },
      ],
      {
        required: true,
        validation: { required: "Product type is required" },
      }
    ),
    createTextField("vendor", "Vendor"),
    createTextField("barcode", "Barcode"),
    createTextField("tags", "Tags", { description: "Comma-separated tags" }),
    createCheckboxField("isTaxable", "Taxable"),

    // Variants Section
    {
      name: "variants",
      label: "Product Variants",
      type: "text", // We'll override this with custom render
      description: "Manage different variations of this product",
    } as FormField,

    // Variants Display
    {
      name: "variantsDisplay",
      label: "Current Variants",
      type: "text", // We'll override this with custom render
      description: "Currently configured variants",
    } as FormField,

    // SEO
    createTextField("metaTitle", "Meta Title", {
      description: "SEO title for search engines",
    }),
    createTextAreaField("metaDescription", "Meta Description", 2, {
      description: "SEO description for search engines",
    }),
    createTextField("metaKeywords", "Meta Keywords", {
      description: "Comma-separated keywords for SEO",
    }),
    createTextField("searchKeywords", "Search Keywords", {
      description: "Additional keywords for internal search",
    }),
  ] as FormField[],
  customFormRender: (field, value, onChange, errors, formData) => {
    if (field.name === "imageIds") {
      return (
        <div key={field.name}>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <ImageSelector
            value={value || []}
            onChange={onChange}
            multiple={true}
            maxImages={15}
          />
          {field.description && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {field.description}
            </p>
          )}
          {errors[field.name] && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {(errors[field.name] as any)?.message || "This field is required"}
            </p>
          )}
        </div>
      );
    }

    if (field.name === "categoryIds") {
      return (
        <CategorySelectorWithManagement
          key={field.name}
          field={field}
          value={value}
          onChange={onChange}
          errors={errors}
          formData={formData}
        />
      );
    }

    if (field.name === "categoriesDisplay") {
      return (
        <CategoriesDisplaySection
          key={field.name}
          field={field}
          categories={formData?.categories || []}
          categoryIds={formData?.categoryIds || []}
        />
      );
    }

    if (field.name === "variants") {
      return (
        <VariantManagerWithEdit
          key={field.name}
          field={field}
          value={value}
          onChange={onChange}
          errors={errors}
          formData={formData}
        />
      );
    }

    if (field.name === "variantsDisplay") {
      return (
        <VariantsDisplaySection
          key={field.name}
          field={field}
          variants={value || []}
          formData={formData}
        />
      );
    }

    return null;
  },
  onBeforeCreate: (data) => {
    console.log("[ProductConfig] onBeforeCreate called with data:", data);

    // Clean and validate numeric fields
    const cleanNumericField = (value: any): number | undefined => {
      if (value === "" || value === null || value === undefined) {
        return undefined;
      }
      const parsed = parseFloat(value);
      return isNaN(parsed) ? undefined : parsed;
    };

    // Clean up price fields
    data.price = cleanNumericField(data.price) || 0;
    data.compareAtPrice = cleanNumericField(data.compareAtPrice);
    data.costPerItem = cleanNumericField(data.costPerItem);
    data.weight = cleanNumericField(data.weight) || 0;
    data.quantity = parseInt(String(data.quantity)) || 0;

    // Transform imageIds to images array
    if (data.imageIds && Array.isArray(data.imageIds)) {
      data.images = data.imageIds.map((fileId: number, index: number) => ({
        fileId,
        position: index,
        isFeatured: index === 0,
        alt: "",
        caption: "",
      }));
      delete data.imageIds;
    } else {
      data.images = [];
    }

    // Handle categoryIds
    if (data.categoryIds && Array.isArray(data.categoryIds)) {
      // Keep categoryIds as is for the API
      data.categoryIds = data.categoryIds.filter((id: number) => id > 0);
    } else {
      data.categoryIds = [];
    }

    // Transform variants from ProductVariantManager format to API format
    if (
      data.variants &&
      Array.isArray(data.variants) &&
      data.variants.length > 0
    ) {
      data.variants = data.variants.map((variant: any, index: number) => ({
        title: variant.title || `Variant ${index + 1}`,
        sku: variant.sku || `${data.sku}-${index + 1}`,
        price: cleanNumericField(variant.price) || data.price || 0,
        compareAtPrice: cleanNumericField(variant.compareAtPrice),
        costPerItem: cleanNumericField(variant.costPerItem),
        quantity: parseInt(String(variant.quantity)) || 0,
        trackQuantity: Boolean(variant.trackQuantity ?? true),
        continueSellingWhenOutOfStock: Boolean(
          variant.continueSellingWhenOutOfStock ?? false
        ),
        requiresShipping: Boolean(variant.requiresShipping ?? true),
        isTaxable: Boolean(variant.isTaxable ?? true),
        weight: cleanNumericField(variant.weight) || 0,
        weightUnit: variant.weightUnit || "kg",
        barcode: variant.barcode || "",
        position: parseInt(String(variant.position)) || index,
        isDefault: Boolean(variant.isDefault ?? index === 0),
        customFields: variant.customFields || {},
        option1: variant.option1 || "",
        option2: variant.option2 || "",
        option3: variant.option3 || "",
        images: Array.isArray(variant.images)
          ? variant.images.map((img: any, imgIndex: number) => ({
              fileId: typeof img === "number" ? img : img.fileId,
              position: imgIndex,
              isFeatured: imgIndex === 0,
              alt: img.alt || "",
              caption: img.caption || "",
            }))
          : Array.isArray(variant.imageIds)
          ? variant.imageIds.map((fileId: number, imgIndex: number) => ({
              fileId,
              position: imgIndex,
              isFeatured: imgIndex === 0,
              alt: "",
              caption: "",
            }))
          : [],
      }));
      data.hasVariants = true;
    } else {
      data.variants = [];
      data.hasVariants = false;
    }

    // Ensure boolean fields are properly set
    data.trackQuantity = Boolean(data.trackQuantity ?? true);
    data.continueSellingWhenOutOfStock = Boolean(
      data.continueSellingWhenOutOfStock ?? false
    );
    data.requiresShipping = Boolean(data.requiresShipping ?? true);
    data.isPhysicalProduct = Boolean(data.isPhysicalProduct ?? true);
    data.isTaxable = Boolean(data.isTaxable ?? true);

    // Set default values for objects
    data.customFields = data.customFields || {};
    data.seoSettings = data.seoSettings || {};

    // Ensure string fields are not null
    data.name = data.name || "";
    data.slug = data.slug || "";
    data.sku = data.sku || "";
    data.description = data.description || "";
    data.shortDescription = data.shortDescription || "";
    data.vendor = data.vendor || "";
    data.barcode = data.barcode || "";
    data.tags = data.tags || "";
    data.metaTitle = data.metaTitle || "";
    data.metaDescription = data.metaDescription || "";
    data.metaKeywords = data.metaKeywords || "";
    data.searchKeywords = data.searchKeywords || "";
    data.template = data.template || "";
    data.weightUnit = data.weightUnit || "kg";

    // Handle enum fields - ensure they are integers
    data.status =
      data.status !== undefined && data.status !== null && data.status !== ""
        ? parseInt(String(data.status))
        : 0; // Default to Draft

    data.type =
      data.type !== undefined && data.type !== null && data.type !== ""
        ? parseInt(String(data.type))
        : 0; // Default to Physical

    console.log("[ProductConfig] onBeforeCreate returning cleaned data:", data);
    return data;
  },
  onBeforeUpdate: (data, entity) => {
    console.log(
      "[ProductConfig] onBeforeUpdate called with data:",
      data,
      "entity:",
      entity
    );
    return productEntityConfig.onBeforeCreate!(data);
  },
  transformDataForForm: (product) => {
    console.log(
      "[ProductConfig] transformDataForForm called with product:",
      product
    );

    const transformed = {
      ...product,
      imageIds: product.images?.map((img) => img.fileId) || [],
      variants: product.variants || [],
      categoryIds: product.categories?.map((cat) => cat.id) || [],
      // Ensure numeric fields are properly formatted for form inputs
      compareAtPrice: product.compareAtPrice || "",
      costPerItem: product.costPerItem || "",
      weight: product.weight || 0,
      quantity: product.quantity || 0,
      // Ensure enum fields are proper integers for select fields
      status: product.status !== undefined ? product.status : 0,
      type: product.type !== undefined ? product.type : 0,
      // Ensure boolean fields
      trackQuantity: Boolean(product.trackQuantity),
      continueSellingWhenOutOfStock: Boolean(
        product.continueSellingWhenOutOfStock
      ),
      requiresShipping: Boolean(product.requiresShipping),
      isPhysicalProduct: Boolean(product.isPhysicalProduct),
      isTaxable: Boolean(product.isTaxable),
      hasVariants: Boolean(product.hasVariants),
    };

    console.log("[ProductConfig] transformDataForForm returning:", transformed);
    return transformed;
  },
};

// Helper component for Category Management
const CategorySelectorWithManagement: React.FC<{
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  errors: any;
  formData?: any;
}> = ({ field, value, onChange, errors, formData }) => {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const handleCategoryEdit = (category: Category) => {
    setEditingCategory(category);
    setIsCategoryModalOpen(true);
  };

  const handleCategoryUpdate = async (categoryData: any) => {
    if (!editingCategory) return;

    try {
      const cleanedData = categoryEntityConfig.onBeforeUpdate!(
        categoryData,
        editingCategory
      );
      await apiService.put(`/category/${editingCategory.id}`, cleanedData);
      toast.success("Category updated successfully");
      setIsCategoryModalOpen(false);
      setEditingCategory(null);
    } catch (error: any) {
      console.error("Error updating category:", error);
      toast.error(error.response?.data?.message || "Failed to update category");
    }
  };

  const categoryFormData = editingCategory
    ? categoryEntityConfig.transformDataForForm!(editingCategory)
    : {};

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <CategorySelector
        value={value || []}
        onChange={onChange}
        multiple={true}
        maxCategories={10}
        onCategoryEdit={handleCategoryEdit}
      />

      {field.description && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {field.description}
        </p>
      )}

      {errors[field.name] && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {(errors[field.name] as any)?.message || "This field is required"}
        </p>
      )}

      {/* Category Edit Modal */}
      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title="Edit Category"
        size="xl"
      >
        {editingCategory && (
          <Form
            fields={categoryEntityConfig.formFields}
            onSubmit={handleCategoryUpdate}
            defaultValues={categoryFormData}
            submitLabel="Update Category"
            onCancel={() => setIsCategoryModalOpen(false)}
            customFieldRenderer={categoryEntityConfig.customFormRender}
          />
        )}
      </Modal>
    </div>
  );
};

// Helper component for displaying selected categories
const CategoriesDisplaySection: React.FC<{
  field: FormField;
  categories: Category[];
  categoryIds: number[];
}> = ({ field, categories, categoryIds }) => {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const handleCategoryEdit = (category: Category) => {
    setEditingCategory(category);
    setIsCategoryModalOpen(true);
  };

  const handleCategoryUpdate = async (categoryData: any) => {
    if (!editingCategory) return;

    try {
      const cleanedData = categoryEntityConfig.onBeforeUpdate!(
        categoryData,
        editingCategory
      );
      await apiService.put(`/category/${editingCategory.id}`, cleanedData);
      toast.success("Category updated successfully");
      setIsCategoryModalOpen(false);
      setEditingCategory(null);
    } catch (error: any) {
      console.error("Error updating category:", error);
      toast.error(error.response?.data?.message || "Failed to update category");
    }
  };

  const categoryFormData = editingCategory
    ? categoryEntityConfig.transformDataForForm!(editingCategory)
    : {};

  // Only render if there are categories to display
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {field.label}
      </label>

      <div className="space-y-2">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            onClick={() => handleCategoryEdit(category)}
          >
            <div className="flex items-center space-x-3">
              <Icon name="tag" size="sm" className="text-blue-500" />
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {category.name}
                </div>
                {category.parentCategoryName && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Parent: {category.parentCategoryName}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {category.productCount} products
              </span>
              <Icon name="chevron-right" size="xs" className="text-gray-400" />
            </div>
          </div>
        ))}
      </div>

      {field.description && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {field.description}
        </p>
      )}

      {/* Category Edit Modal */}
      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title="Edit Category"
        size="xl"
      >
        {editingCategory && (
          <Form
            fields={categoryEntityConfig.formFields}
            onSubmit={handleCategoryUpdate}
            defaultValues={categoryFormData}
            submitLabel="Update Category"
            onCancel={() => setIsCategoryModalOpen(false)}
            customFieldRenderer={categoryEntityConfig.customFormRender}
          />
        )}
      </Modal>
    </div>
  );
};

// Helper component for Variant Management
const VariantManagerWithEdit: React.FC<{
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  errors: any;
  formData?: any;
}> = ({ field, value, onChange, errors, formData }) => {
  const [editingVariant, setEditingVariant] = useState<any>(null);
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);

  // Debug logging for variant changes
  React.useEffect(() => {
    console.log("[VariantManagerWithEdit] Variants value changed:", value);
    console.log("[VariantManagerWithEdit] FormData:", formData);
  }, [value, formData]);

  const handleVariantEdit = (variant: any) => {
    console.log("[VariantManagerWithEdit] Editing variant:", variant);
    setEditingVariant(variant);
    setIsVariantModalOpen(true);
  };

  const handleVariantsChange = (newVariants: any[]) => {
    console.log("[VariantManagerWithEdit] Variants changed from:", value);
    console.log("[VariantManagerWithEdit] Variants changed to:", newVariants);
    onChange(newVariants);
  };

  const handleVariantUpdate = async (variantData: any) => {
    if (!editingVariant) return;

    try {
      if (editingVariant.id > 0) {
        // Update via API if it's an existing variant
        const cleanedData = productVariantEntityConfig.onBeforeUpdate!(
          variantData,
          editingVariant
        );
        await apiService.put(
          `/productvariant/${editingVariant.id}`,
          cleanedData
        );
        toast.success("Variant updated successfully");

        // Update the variants in the parent form
        const updatedVariants = (value || []).map((v: any) =>
          v.id === editingVariant.id ? { ...v, ...variantData } : v
        );
        onChange(updatedVariants);
      } else {
        // Update locally for new variants
        const updatedVariants = (value || []).map((v: any) =>
          v.id === editingVariant.id ? { ...v, ...variantData } : v
        );
        onChange(updatedVariants);
        toast.success("Variant updated");
      }

      setIsVariantModalOpen(false);
      setEditingVariant(null);
    } catch (error: any) {
      console.error("Error updating variant:", error);
      toast.error(error.response?.data?.message || "Failed to update variant");
    }
  };

  const variantFormData = editingVariant
    ? productVariantEntityConfig.transformDataForForm!(editingVariant)
    : {};

  // Enhanced variant manager with click-to-edit functionality
  return (
    <div>
      <ProductVariantManager
        variants={value || []}
        onVariantsChange={handleVariantsChange}
        productId={formData?.id}
        isReadonly={false}
        showStandaloneSelector={true}
        onVariantClick={handleVariantEdit}
      />

      {errors[field.name] && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {(errors[field.name] as any)?.message || "This field is required"}
        </p>
      )}

      {/* Variant Edit Modal */}
      <Modal
        isOpen={isVariantModalOpen}
        onClose={() => setIsVariantModalOpen(false)}
        title="Edit Variant"
        size="xl"
      >
        {editingVariant && (
          <Form
            fields={productVariantEntityConfig.formFields.filter(
              (f) => f.name !== "productId"
            )} // Remove productId field
            onSubmit={handleVariantUpdate}
            defaultValues={variantFormData}
            submitLabel="Update Variant"
            onCancel={() => setIsVariantModalOpen(false)}
            customFieldRenderer={productVariantEntityConfig.customFormRender}
          />
        )}
      </Modal>
    </div>
  );
};

// Helper component for displaying current variants
const VariantsDisplaySection: React.FC<{
  field: FormField;
  variants: any[];
  formData?: any;
}> = ({ field, variants, formData }) => {
  const [editingVariant, setEditingVariant] = useState<any>(null);
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);

  const handleVariantEdit = (variant: any) => {
    setEditingVariant(variant);
    setIsVariantModalOpen(true);
  };

  const handleVariantUpdate = async (variantData: any) => {
    if (!editingVariant) return;

    try {
      if (editingVariant.id > 0) {
        // Update via API if it's an existing variant
        const cleanedData = productVariantEntityConfig.onBeforeUpdate!(
          variantData,
          editingVariant
        );
        await apiService.put(
          `/productvariant/${editingVariant.id}`,
          cleanedData
        );
        toast.success("Variant updated successfully");
      } else {
        toast.success("Variant updated");
      }

      setIsVariantModalOpen(false);
      setEditingVariant(null);
    } catch (error: any) {
      console.error("Error updating variant:", error);
      toast.error(error.response?.data?.message || "Failed to update variant");
    }
  };

  const variantFormData = editingVariant
    ? productVariantEntityConfig.transformDataForForm!(editingVariant)
    : {};

  // Only render if there are variants to display
  if (!variants || variants.length === 0) {
    return null;
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {field.label}
      </label>

      <div className="space-y-2">
        {variants.map((variant, index) => (
          <div
            key={variant.id || index}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            onClick={() => handleVariantEdit(variant)}
          >
            <div className="flex items-center space-x-3">
              <Icon name="briefcase" size="sm" className="text-green-500" />
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {variant.title ||
                    variant.displayTitle ||
                    `Variant ${index + 1}`}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  SKU: {variant.sku} • Price: ${variant.price.toFixed(2)} •
                  Stock: {variant.quantity}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {variant.isDefault && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  Default
                </span>
              )}
              <Icon name="chevron-right" size="xs" className="text-gray-400" />
            </div>
          </div>
        ))}
      </div>

      {field.description && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {field.description}
        </p>
      )}

      {/* Variant Edit Modal */}
      <Modal
        isOpen={isVariantModalOpen}
        onClose={() => setIsVariantModalOpen(false)}
        title="Edit Variant"
        size="xl"
      >
        {editingVariant && (
          <Form
            fields={productVariantEntityConfig.formFields.filter(
              (f) => f.name !== "productId"
            )} // Remove productId field
            onSubmit={handleVariantUpdate}
            defaultValues={variantFormData}
            submitLabel="Update Variant"
            onCancel={() => setIsVariantModalOpen(false)}
            customFieldRenderer={productVariantEntityConfig.customFormRender}
          />
        )}
      </Modal>
    </div>
  );
};

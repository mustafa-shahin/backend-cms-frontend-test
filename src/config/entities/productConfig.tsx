// src/config/entities/productConfig.tsx
import React from "react";
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
import ProductVariantManager from "../../components/ui/ProductVariantManager";
import { apiService } from "../../Services/ApiServices";

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
      render: (type) => (
        <span className="text-sm text-gray-900 dark:text-white">
          {ProductType[type]}
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

    if (field.name === "variants") {
      return (
        <div key={field.name}>
          <ProductVariantManager
            variants={value || []}
            onVariantsChange={onChange}
            productId={formData?.id}
          />
          {errors[field.name] && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {(errors[field.name] as any)?.message || "This field is required"}
            </p>
          )}
        </div>
      );
    }

    return null;
  },
  onBeforeCreate: (data) => {
    console.log("[ProductConfig] onBeforeCreate called with data:", data);

    // Clean and validate numeric fields
    const cleanNumericField = (value: any): number | null => {
      if (value === "" || value === null || value === undefined) {
        return null;
      }
      const parsed = parseFloat(value);
      return isNaN(parsed) ? null : parsed;
    };

    // Clean up price fields
    data.price = cleanNumericField(data.price) || 0;
    data.compareAtPrice = cleanNumericField(data.compareAtPrice);
    data.costPerItem = cleanNumericField(data.costPerItem);
    data.weight = cleanNumericField(data.weight) || 0;
    data.quantity = parseInt(data.quantity) || 0;

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

    // Transform variants from ProductVariantManager format to API format
    if (data.variants && Array.isArray(data.variants)) {
      data.variants = data.variants.map((variant: any) => ({
        title: variant.title || "",
        sku: variant.sku || "",
        price: cleanNumericField(variant.price) || 0,
        compareAtPrice: cleanNumericField(variant.compareAtPrice),
        costPerItem: cleanNumericField(variant.costPerItem),
        quantity: parseInt(variant.quantity) || 0,
        trackQuantity: Boolean(variant.trackQuantity),
        continueSellingWhenOutOfStock: Boolean(
          variant.continueSellingWhenOutOfStock
        ),
        requiresShipping: Boolean(variant.requiresShipping),
        isTaxable: Boolean(variant.isTaxable),
        weight: cleanNumericField(variant.weight) || 0,
        weightUnit: variant.weightUnit || "kg",
        barcode: variant.barcode || "",
        position: parseInt(variant.position) || 0,
        isDefault: Boolean(variant.isDefault),
        customFields: variant.customFields || {},
        option1: variant.option1 || "",
        option2: variant.option2 || "",
        option3: variant.option3 || "",
        images: Array.isArray(variant.images)
          ? variant.images.map((img: any, index: number) => ({
              fileId: img.fileId,
              position: index,
              isFeatured: index === 0,
              alt: img.alt || "",
              caption: img.caption || "",
            }))
          : [],
      }));
    } else {
      data.variants = [];
    }

    // Set hasVariants based on variants array
    data.hasVariants = data.variants && data.variants.length > 0;

    // Ensure boolean fields are properly set
    data.trackQuantity = Boolean(data.trackQuantity);
    data.continueSellingWhenOutOfStock = Boolean(
      data.continueSellingWhenOutOfStock
    );
    data.requiresShipping = Boolean(data.requiresShipping);
    data.isPhysicalProduct = Boolean(data.isPhysicalProduct);
    data.isTaxable = Boolean(data.isTaxable);

    // Set default values for objects
    data.customFields = data.customFields || {};
    data.seoSettings = data.seoSettings || {};
    data.categoryIds = data.categoryIds || [];

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

    // Use the same cleaning logic as create
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
      // Ensure enum fields are proper integers for select fields
      status: product.status !== undefined ? product.status : 0,
      type: product.type !== undefined ? product.type : 0,
    };

    console.log("[ProductConfig] transformDataForForm returning:", transformed);
    return transformed;
  },
};

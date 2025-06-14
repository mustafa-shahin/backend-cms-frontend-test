import { EntityManagerConfig } from "../../components/entities/EntityManager";
import { Category, FormField, Product } from "../../types";
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
import React from "react";

export const productEntityConfig: EntityManagerConfig<Product> = {
  entityName: "Product",
  apiEndpoint: "/product",
  columns: [
    {
      key: "name",
      label: "Name",
      render: (name, product) => (
        <div className="flex items-center">
          {product.featuredImage && (
            <div className="flex-shrink-0 h-10 w-10 mr-3">
              <img
                src={product.featuredImage}
                alt={name}
                className="h-10 w-10 object-cover rounded"
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
      ),
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
        { value: ProductStatus.Draft, label: "Draft" },
        { value: ProductStatus.Active, label: "Active" },
        { value: ProductStatus.Archived, label: "Archived" },
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
        { value: ProductType.Physical, label: "Physical" },
        { value: ProductType.Digital, label: "Digital" },
        { value: ProductType.Service, label: "Service" },
        { value: ProductType.GiftCard, label: "Gift Card" },
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
    }

    // Set hasVariants based on variants array
    data.hasVariants = data.variants && data.variants.length > 0;

    // Set default values
    data.customFields = data.customFields || {};
    data.seoSettings = data.seoSettings || {};

    return data;
  },
  onBeforeUpdate: (data, entity) => {
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
    }

    // Set hasVariants based on variants array
    data.hasVariants = data.variants && data.variants.length > 0;

    return data;
  },
  transformDataForForm: (product) => {
    const transformed = {
      ...product,
      imageIds: product.images?.map((img) => img.fileId) || [],
      variants: product.variants || [],
    };
    return transformed;
  },
};

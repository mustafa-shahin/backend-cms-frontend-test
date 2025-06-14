// src/config/entities/productVariantConfig.tsx
import { EntityManagerConfig } from "../../components/entities/EntityManager";
import { FormField, ProductVariant } from "../../types";
import {
  createCheckboxField,
  createNumberField,
  createSelectField,
  createTextField,
} from "../../utils/formFieldHelpers";
import ImageSelector from "../../components/ui/ImageSelector";
import { apiService } from "../../Services/ApiServices";
import React from "react";

export const productVariantEntityConfig: EntityManagerConfig<ProductVariant> = {
  entityName: "Product Variant",
  apiEndpoint: "/productvariant",
  columns: [
    {
      key: "title",
      label: "Title",
      render: (title, variant) => {
        const featuredImageUrl = apiService.getFeaturedImageUrl(
          variant.images || []
        );
        return (
          <div className="flex items-center">
            {featuredImageUrl && (
              <div className="flex-shrink-0 h-8 w-8 mr-3">
                <img
                  src={featuredImageUrl}
                  alt={title}
                  className="h-8 w-8 object-cover rounded"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              </div>
            )}
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {title || variant.displayTitle}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                SKU: {variant.sku}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      key: "price",
      label: "Price",
      render: (price, variant) => (
        <div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            ${price.toFixed(2)}
          </div>
          {variant.compareAtPrice && variant.compareAtPrice > price && (
            <div className="text-sm text-gray-500 dark:text-gray-400 line-through">
              ${variant.compareAtPrice.toFixed(2)}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "quantity",
      label: "Stock",
      render: (quantity) => (
        <span
          className={`text-sm font-medium ${
            quantity === 0
              ? "text-red-600 dark:text-red-400"
              : quantity < 10
              ? "text-yellow-600 dark:text-yellow-400"
              : "text-green-600 dark:text-green-400"
          }`}
        >
          {quantity}
        </span>
      ),
    },
    {
      key: "isDefault",
      label: "Default",
      render: (isDefault) =>
        isDefault ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            Default
          </span>
        ) : null,
    },
    {
      key: "isAvailable",
      label: "Available",
      render: (isAvailable) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            isAvailable
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
          }`}
        >
          {isAvailable ? "Available" : "Out of Stock"}
        </span>
      ),
    },
    {
      key: "position",
      label: "Position",
    },
  ],
  formFields: [
    createTextField("title", "Variant Title", {
      required: true,
      validation: { required: "Variant title is required" },
    }),
    createTextField("sku", "SKU", {
      required: true,
      validation: { required: "SKU is required" },
    }),

    // Variant Images
    {
      name: "imageIds",
      label: "Variant Images",
      type: "text", // We'll override this with custom render
      description: "Select images for this variant",
    } as FormField,

    createNumberField("price", "Price", {
      required: true,
      min: 0,
      step: 0.01,
      validation: { required: "Price is required" },
    }),
    createNumberField("compareAtPrice", "Compare at Price", {
      min: 0,
      step: 0.01,
    }),
    createNumberField("costPerItem", "Cost per Item", {
      min: 0,
      step: 0.01,
    }),
    createNumberField("quantity", "Quantity", { min: 0 }),
    createCheckboxField("trackQuantity", "Track Quantity"),
    createCheckboxField(
      "continueSellingWhenOutOfStock",
      "Continue selling when out of stock"
    ),
    createCheckboxField("requiresShipping", "Requires Shipping"),
    createCheckboxField("isTaxable", "Taxable"),
    createNumberField("weight", "Weight", { min: 0, step: 0.01 }),
    createSelectField("weightUnit", "Weight Unit", [
      { value: "kg", label: "Kilograms" },
      { value: "g", label: "Grams" },
      { value: "lb", label: "Pounds" },
      { value: "oz", label: "Ounces" },
    ]),
    createTextField("barcode", "Barcode"),
    createNumberField("position", "Position", { min: 0 }),
    createCheckboxField("isDefault", "Default Variant"),
    createTextField("option1", "Option 1", {
      description: "e.g., Size, Color, Material",
    }),
    createTextField("option2", "Option 2"),
    createTextField("option3", "Option 3"),
  ] as FormField[],
  customFormRender: (field, value, onChange, errors) => {
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
            maxImages={5}
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

    // Set default values
    data.customFields = data.customFields || {};

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

    return data;
  },
  transformDataForForm: (variant) => {
    const transformed = {
      ...variant,
      imageIds: variant.images?.map((img) => img.fileId) || [],
    };
    return transformed;
  },
};

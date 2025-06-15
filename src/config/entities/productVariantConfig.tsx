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
    // Basic variant information
    createTextField("title", "Variant Title", {
      required: true,
      validation: { required: "Variant title is required" },
      description: "Descriptive name for this variant",
    }),
    createTextField("sku", "SKU", {
      required: true,
      validation: { required: "SKU is required" },
      description: "Unique identifier for this variant",
    }),

    // Product ID field for standalone variant creation
    createNumberField("productId", "Product ID", {
      required: true,
      validation: { required: "Product ID is required" },
      description: "ID of the product this variant belongs to",
    }),

    // Variant Images
    {
      name: "imageIds",
      label: "Variant Images",
      type: "text", // We'll override this with custom render
      description: "Select images for this variant",
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
      description: "Cost to acquire or produce this variant",
    }),

    // Inventory
    createNumberField("quantity", "Quantity", {
      min: 0,
      description: "Available stock for this variant",
    }),
    createCheckboxField("trackQuantity", "Track Quantity"),
    createCheckboxField(
      "continueSellingWhenOutOfStock",
      "Continue selling when out of stock"
    ),

    // Shipping
    createCheckboxField("requiresShipping", "Requires Shipping"),
    createCheckboxField("isTaxable", "Taxable"),
    createNumberField("weight", "Weight", { min: 0, step: 0.01 }),
    createSelectField("weightUnit", "Weight Unit", [
      { value: "kg", label: "Kilograms" },
      { value: "g", label: "Grams" },
      { value: "lb", label: "Pounds" },
      { value: "oz", label: "Ounces" },
    ]),

    // Additional details
    createTextField("barcode", "Barcode"),
    createNumberField("position", "Position", {
      min: 0,
      description: "Display order for this variant",
    }),
    createCheckboxField("isDefault", "Default Variant", {
      description: "Make this the default variant for the product",
    }),

    // Variant options
    createTextField("option1", "Option 1", {
      description: "e.g., Size, Color, Material",
      placeholder: "e.g., Size",
    }),
    createTextField("option2", "Option 2", {
      placeholder: "e.g., Color",
    }),
    createTextField("option3", "Option 3", {
      placeholder: "e.g., Material",
    }),
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
    console.log("[VariantConfig] onBeforeCreate called with data:", data);

    // Clean and validate numeric fields
    const cleanNumericField = (value: any): number | undefined => {
      if (value === "" || value === null || value === undefined) {
        return undefined;
      }
      const parsed = parseFloat(value);
      return isNaN(parsed) ? undefined : parsed;
    };

    // Clean up string fields
    data.title = data.title || "";
    data.sku = data.sku || "";
    data.barcode = data.barcode || "";
    data.option1 = data.option1 || "";
    data.option2 = data.option2 || "";
    data.option3 = data.option3 || "";
    data.weightUnit = data.weightUnit || "kg";

    // Handle numeric fields
    data.productId = parseInt(String(data.productId)) || undefined;
    data.price = cleanNumericField(data.price) || 0;
    data.compareAtPrice = cleanNumericField(data.compareAtPrice);
    data.costPerItem = cleanNumericField(data.costPerItem);
    data.weight = cleanNumericField(data.weight) || 0;
    data.quantity = parseInt(String(data.quantity)) || 0;
    data.position = parseInt(String(data.position)) || 0;

    // Handle boolean fields
    data.trackQuantity = Boolean(data.trackQuantity ?? true);
    data.continueSellingWhenOutOfStock = Boolean(
      data.continueSellingWhenOutOfStock ?? false
    );
    data.requiresShipping = Boolean(data.requiresShipping ?? true);
    data.isTaxable = Boolean(data.isTaxable ?? true);
    data.isDefault = Boolean(data.isDefault ?? false);

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

    // Set default values
    data.customFields = data.customFields || {};

    console.log("[VariantConfig] onBeforeCreate returning cleaned data:", data);
    return data;
  },
  onBeforeUpdate: (data, entity) => {
    console.log(
      "[VariantConfig] onBeforeUpdate called with data:",
      data,
      "entity:",
      entity
    );

    // Preserve the productId from the entity
    if (entity && entity.productId) {
      data.productId = entity.productId;
    }

    return productVariantEntityConfig.onBeforeCreate!(data);
  },
  transformDataForForm: (variant) => {
    console.log(
      "[VariantConfig] transformDataForForm called with variant:",
      variant
    );

    const transformed = {
      ...variant,
      productId: variant.productId || undefined,
      imageIds: variant.images?.map((img) => img.fileId) || [],
      // Ensure proper form values
      compareAtPrice: variant.compareAtPrice || "",
      costPerItem: variant.costPerItem || "",
      weight: variant.weight || 0,
      quantity: variant.quantity || 0,
      position: variant.position || 0,
      trackQuantity: Boolean(variant.trackQuantity),
      continueSellingWhenOutOfStock: Boolean(
        variant.continueSellingWhenOutOfStock
      ),
      requiresShipping: Boolean(variant.requiresShipping),
      isTaxable: Boolean(variant.isTaxable),
      isDefault: Boolean(variant.isDefault),
      barcode: variant.barcode || "",
      option1: variant.option1 || "",
      option2: variant.option2 || "",
      option3: variant.option3 || "",
      weightUnit: variant.weightUnit || "kg",
    };

    console.log("[VariantConfig] transformDataForForm returning:", transformed);
    return transformed;
  },
};

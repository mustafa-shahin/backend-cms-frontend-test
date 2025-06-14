// src/components/ui/ProductVariantManager.tsx
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import clsx from "clsx";
import {
  CreateProductVariant,
  UpdateProductVariant,
  ProductVariant,
  CreateProductVariantImage,
} from "../../types/Product";
import { Button, Icon, Modal } from "../common";
import ImageSelector from "./ImageSelector";
import { apiService } from "../../Services/ApiServices";
import toast from "react-hot-toast";

interface ProductVariantManagerProps {
  variants: ProductVariant[];
  onVariantsChange: (variants: ProductVariant[]) => void;
  productId?: number;
  isReadonly?: boolean;
}

const ProductVariantManager: React.FC<ProductVariantManagerProps> = ({
  variants,
  onVariantsChange,
  productId,
  isReadonly = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateProductVariant | UpdateProductVariant>({
    defaultValues: {
      title: "",
      sku: "",
      price: 0,
      compareAtPrice: undefined,
      costPerItem: undefined,
      quantity: 0,
      trackQuantity: true,
      continueSellingWhenOutOfStock: false,
      requiresShipping: true,
      isTaxable: true,
      weight: 0,
      weightUnit: "kg",
      barcode: "",
      position: variants.length,
      isDefault: variants.length === 0,
      customFields: {},
      option1: "",
      option2: "",
      option3: "",
      images: [],
    },
  });

  const handleCreateVariant = () => {
    setEditingVariant(null);
    reset({
      title: "",
      sku: "",
      price: 0,
      compareAtPrice: undefined,
      costPerItem: undefined,
      quantity: 0,
      trackQuantity: true,
      continueSellingWhenOutOfStock: false,
      requiresShipping: true,
      isTaxable: true,
      weight: 0,
      weightUnit: "kg",
      barcode: "",
      position: variants.length,
      isDefault: variants.length === 0,
      customFields: {},
      option1: "",
      option2: "",
      option3: "",
      images: [],
    });
    setIsModalOpen(true);
  };

  const handleEditVariant = (variant: ProductVariant) => {
    setEditingVariant(variant);
    reset({
      ...variant,
      images: variant.images.map((img) => ({
        fileId: img.fileId,
        alt: img.alt || "",
        caption: img.caption || "",
        position: img.position,
        isFeatured: img.isFeatured,
      })),
    });
    setIsModalOpen(true);
  };

  const handleDeleteVariant = (variantId: number) => {
    if (window.confirm("Are you sure you want to delete this variant?")) {
      const updatedVariants = variants.filter((v) => v.id !== variantId);
      onVariantsChange(updatedVariants);
      toast.success("Variant deleted successfully");
    }
  };

  const handleFormSubmit = async (
    formData: CreateProductVariant | UpdateProductVariant
  ) => {
    try {
      setLoading(true);

      // Convert image IDs to image objects
      const images: CreateProductVariantImage[] = formData.images.map(
        (img, index) => ({
          fileId: img.fileId,
          position: index,
          isFeatured: index === 0,
          alt: img.alt || "",
          caption: img.caption || "",
        })
      );

      const variantData = {
        ...formData,
        images,
        customFields: formData.customFields || {},
      };

      if (editingVariant) {
        // Update existing variant
        const updatedVariants = variants.map((v) =>
          v.id === editingVariant.id
            ? {
                ...editingVariant,
                ...variantData,
                id: editingVariant.id,
                productId: editingVariant.productId,
                createdAt: editingVariant.createdAt,
                updatedAt: new Date().toISOString(),
                isAvailable:
                  variantData.quantity > 0 ||
                  variantData.continueSellingWhenOutOfStock,
                discountPercentage: variantData.compareAtPrice
                  ? Math.round(
                      ((variantData.compareAtPrice - variantData.price) /
                        variantData.compareAtPrice) *
                        100
                    )
                  : undefined,
                displayTitle:
                  variantData.title || generateDisplayTitle(variantData),
                featuredImageUrl:
                  apiService.getFeaturedImageUrl(
                    images.map((img) => ({
                      fileId: img.fileId,
                      isFeatured: img.isFeatured,
                      position: img.position,
                    }))
                  ) || undefined,
                images: images.map((img, idx) => ({
                  id: editingVariant.images[idx]?.id || Date.now() + idx,
                  productVariantId: editingVariant.id,
                  fileId: img.fileId,
                  alt: img.alt,
                  caption: img.caption,
                  position: img.position,
                  isFeatured: img.isFeatured,
                  imageUrl:
                    apiService.getImageUrl(img.fileId, "download") || "",
                  thumbnailUrl:
                    apiService.getImageUrl(img.fileId, "thumbnail") || "",
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                })),
              }
            : v
        );
        onVariantsChange(updatedVariants);
        toast.success("Variant updated successfully");
      } else {
        // Create new variant
        const newVariant: ProductVariant = {
          id: Date.now(), // Temporary ID for local state
          productId: productId || 0,
          ...variantData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isAvailable:
            variantData.quantity > 0 ||
            variantData.continueSellingWhenOutOfStock,
          discountPercentage: variantData.compareAtPrice
            ? Math.round(
                ((variantData.compareAtPrice - variantData.price) /
                  variantData.compareAtPrice) *
                  100
              )
            : undefined,
          displayTitle: variantData.title || generateDisplayTitle(variantData),
          featuredImageUrl:
            apiService.getFeaturedImageUrl(
              images.map((img) => ({
                fileId: img.fileId,
                isFeatured: img.isFeatured,
                position: img.position,
              }))
            ) || undefined,
          images: images.map((img, idx) => ({
            id: Date.now() + idx,
            productVariantId: Date.now(),
            fileId: img.fileId,
            alt: img.alt,
            caption: img.caption,
            position: img.position,
            isFeatured: img.isFeatured,
            imageUrl: apiService.getImageUrl(img.fileId, "download") || "",
            thumbnailUrl: apiService.getImageUrl(img.fileId, "thumbnail") || "",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })),
        };

        // If this is the first variant or marked as default, make it default
        let updatedVariants = [...variants];
        if (variants.length === 0 || variantData.isDefault) {
          // Remove default from other variants
          updatedVariants = updatedVariants.map((v) => ({
            ...v,
            isDefault: false,
          }));
          newVariant.isDefault = true;
        }
        updatedVariants.push(newVariant);
        onVariantsChange(updatedVariants);
        toast.success("Variant created successfully");
      }

      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving variant:", error);
      toast.error("Failed to save variant");
    } finally {
      setLoading(false);
    }
  };

  const generateDisplayTitle = (
    variant: CreateProductVariant | UpdateProductVariant
  ) => {
    const options = [variant.option1, variant.option2, variant.option3].filter(
      Boolean
    );
    return options.length > 0
      ? options.join(" / ")
      : variant.title || "Default";
  };

  const setDefaultVariant = (variantId: number) => {
    const updatedVariants = variants.map((v) => ({
      ...v,
      isDefault: v.id === variantId,
    }));
    onVariantsChange(updatedVariants);
    toast.success("Default variant updated");
  };

  const renderVariantCard = (variant: ProductVariant) => {
    const featuredImageUrl = apiService.getFeaturedImageUrl(
      variant.images || []
    );

    return (
      <div
        key={variant.id}
        className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 border-2 transition-colors ${
          variant.isDefault
            ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
            : "border-gray-200 dark:border-gray-700"
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                {variant.displayTitle}
              </h4>
              {variant.isDefault && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                  Default
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              SKU: {variant.sku}
            </p>
          </div>

          {!isReadonly && (
            <div className="flex items-center space-x-1">
              <Button
                size="xs"
                variant="ghost"
                leftIcon="edit"
                onClick={() => handleEditVariant(variant)}
              >
                Edit
              </Button>
              <Button
                size="xs"
                variant="ghost"
                leftIcon="trash"
                onClick={() => handleDeleteVariant(variant.id)}
                className="text-red-600 hover:text-red-700"
              >
                Delete
              </Button>
            </div>
          )}
        </div>

        {/* Variant Image */}
        {featuredImageUrl && (
          <div className="mb-3">
            <img
              src={featuredImageUrl}
              alt={variant.displayTitle}
              className="w-full h-20 object-cover rounded"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          </div>
        )}

        {/* Variant Details */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Price:
            </span>
            <div className="flex items-center space-x-1">
              <span className="text-gray-900 dark:text-white">
                ${variant.price.toFixed(2)}
              </span>
              {variant.compareAtPrice &&
                variant.compareAtPrice > variant.price && (
                  <span className="text-gray-500 line-through">
                    ${variant.compareAtPrice.toFixed(2)}
                  </span>
                )}
            </div>
          </div>
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Stock:
            </span>
            <span
              className={`ml-1 ${
                variant.quantity === 0
                  ? "text-red-600 dark:text-red-400"
                  : variant.quantity < 10
                  ? "text-yellow-600 dark:text-yellow-400"
                  : "text-green-600 dark:text-green-400"
              }`}
            >
              {variant.quantity}
            </span>
          </div>
          {(variant.option1 || variant.option2 || variant.option3) && (
            <div className="col-span-2">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Options:
              </span>
              <span className="ml-1 text-gray-900 dark:text-white">
                {[variant.option1, variant.option2, variant.option3]
                  .filter(Boolean)
                  .join(" / ")}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        {!isReadonly && !variant.isDefault && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <Button
              size="xs"
              variant="outline"
              onClick={() => setDefaultVariant(variant.id)}
              className="w-full"
            >
              Set as Default
            </Button>
          </div>
        )}
      </div>
    );
  };

  // Define a type for your form fields to ensure type safety
  type FormField = {
    name: keyof (CreateProductVariant | UpdateProductVariant);
    label: string;
    required?: boolean;
    validation?: Record<string, any>;
    description?: string;
  } & (
    | { type: "text"; placeholder?: string }
    | {
        type: "number";
        min?: number;
        max?: number;
        step?: number;
        placeholder?: string;
      }
    | { type: "checkbox" }
    | { type: "select"; options: { value: string; label: string }[] }
    | { type: "textarea"; placeholder?: string }
  );

  const variantFormFields: FormField[] = [
    {
      name: "title",
      label: "Variant Title",
      type: "text",
      required: true,
      validation: { required: "Variant title is required" },
      placeholder: "e.g., Small, Red, Cotton",
    },
    {
      name: "sku",
      label: "SKU",
      type: "text",
      required: true,
      validation: { required: "SKU is required" },
      placeholder: "e.g., PRODUCT-SMALL-RED",
    },
    {
      name: "price",
      label: "Price",
      type: "number",
      required: true,
      min: 0,
      step: 0.01,
      validation: { required: "Price is required" },
      placeholder: "0.00",
    },
    {
      name: "compareAtPrice",
      label: "Compare at Price",
      type: "number",
      min: 0,
      step: 0.01,
      placeholder: "0.00",
    },
    {
      name: "costPerItem",
      label: "Cost per Item",
      type: "number",
      min: 0,
      step: 0.01,
      placeholder: "0.00",
    },
    {
      name: "quantity",
      label: "Quantity",
      type: "number",
      min: 0,
      placeholder: "0",
    },
    {
      name: "trackQuantity",
      label: "Track Quantity",
      type: "checkbox",
    },
    {
      name: "continueSellingWhenOutOfStock",
      label: "Continue selling when out of stock",
      type: "checkbox",
    },
    {
      name: "requiresShipping",
      label: "Requires Shipping",
      type: "checkbox",
    },
    {
      name: "isTaxable",
      label: "Taxable",
      type: "checkbox",
    },
    {
      name: "weight",
      label: "Weight",
      type: "number",
      min: 0,
      step: 0.01,
      placeholder: "0.00",
    },
    {
      name: "weightUnit",
      label: "Weight Unit",
      type: "select",
      options: [
        { value: "kg", label: "Kilograms" },
        { value: "g", label: "Grams" },
        { value: "lb", label: "Pounds" },
        { value: "oz", label: "Ounces" },
      ],
    },
    {
      name: "barcode",
      label: "Barcode",
      type: "text",
      placeholder: "e.g., 123456789012",
    },
    {
      name: "position",
      label: "Position",
      type: "number",
      min: 0,
      placeholder: "0",
    },
    {
      name: "isDefault",
      label: "Default Variant",
      type: "checkbox",
    },
    {
      name: "option1",
      label: "Option 1",
      type: "text",
      description: "e.g., Size, Color, Material",
      placeholder: "e.g., Size",
    },
    {
      name: "option2",
      label: "Option 2",
      type: "text",
      placeholder: "e.g., Color",
    },
    {
      name: "option3",
      label: "Option 3",
      type: "text",
      placeholder: "e.g., Material",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Product Variants ({variants.length})
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage different variations of this product (size, color, etc.)
          </p>
        </div>

        {!isReadonly && (
          <Button leftIcon="plus" onClick={handleCreateVariant} size="sm">
            Add Variant
          </Button>
        )}
      </div>

      {/* Variants Grid */}
      {variants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {variants.map(renderVariantCard)}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Icon
            name="briefcase"
            size="2xl"
            className="mx-auto text-gray-400 mb-4"
          />
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No variants created
          </h4>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Create variants to offer different options for this product.
          </p>
          {!isReadonly && (
            <Button leftIcon="plus" onClick={handleCreateVariant}>
              Create Your First Variant
            </Button>
          )}
        </div>
      )}

      {/* Create/Edit Variant Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingVariant ? "Edit Variant" : "Create New Variant"}
        size="xl"
      >
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Variant Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Variant Images
            </label>
            <Controller
              name="images"
              control={control}
              render={({ field: { onChange, value } }) => (
                <ImageSelector
                  value={
                    Array.isArray(value) ? value.map((img) => img.fileId) : []
                  }
                  onChange={(fileIds) => {
                    const images: CreateProductVariantImage[] = Array.isArray(
                      fileIds
                    )
                      ? fileIds.map((fileId, index) => ({
                          fileId,
                          alt: "",
                          caption: "",
                          position: index,
                          isFeatured: index === 0,
                        }))
                      : [];
                    onChange(images);
                  }}
                  multiple={true}
                  maxImages={5}
                />
              )}
            />
          </div>

          {/* Other form fields */}
          {variantFormFields.map((field) => (
            <div key={field.name}>
              {field.type !== "checkbox" && (
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  {field.label}
                  {field.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>
              )}

              <Controller
                name={field.name}
                control={control}
                rules={field.validation}
                render={({ field: { onChange, value, ...fieldProps } }) => {
                  const hasError = errors[field.name];
                  const baseInputClasses = clsx(
                    "block py-2 px-2 w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm",
                    hasError &&
                      "border-red-300 focus:border-red-500 focus:ring-red-500"
                  );

                  switch (field.type) {
                    case "textarea":
                      return (
                        <textarea
                          id={field.name}
                          {...fieldProps}
                          value={(value as string) || ""}
                          onChange={onChange}
                          placeholder={field.placeholder}
                          rows={3}
                          className={baseInputClasses}
                        />
                      );

                    case "select":
                      return (
                        <select
                          id={field.name}
                          {...fieldProps}
                          value={(value as string) || ""}
                          onChange={onChange}
                          className={baseInputClasses}
                        >
                          <option value="">Select {field.label}</option>
                          {field.options?.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      );

                    case "checkbox":
                      return (
                        <div className="flex items-center">
                          <input
                            id={field.name}
                            {...fieldProps}
                            type="checkbox"
                            checked={value as boolean}
                            onChange={(e) => onChange(e.target.checked)}
                            className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                          />
                          <label
                            htmlFor={field.name}
                            className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                          >
                            {field.label}
                          </label>
                        </div>
                      );

                    case "number":
                      return (
                        <input
                          id={field.name}
                          {...fieldProps}
                          type="number"
                          value={
                            (value as number | string) === 0
                              ? 0
                              : (value as number | string) || ""
                          }
                          onChange={(e) =>
                            onChange(e.target.valueAsNumber || e.target.value)
                          }
                          placeholder={field.placeholder}
                          min={field.min}
                          max={field.max}
                          step={field.step}
                          className={baseInputClasses}
                        />
                      );

                    case "text":
                      return (
                        <input
                          id={field.name}
                          {...fieldProps}
                          type={field.type}
                          value={(value as string) || ""}
                          onChange={onChange}
                          placeholder={field.placeholder}
                          className={baseInputClasses}
                        />
                      );
                  }
                }}
              />

              {field.description && (
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {field.description}
                </p>
              )}

              {errors[field.name] && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <Icon
                    name="exclamation-triangle"
                    size="xs"
                    className="mr-1"
                  />
                  {(errors[field.name] as any)?.message ||
                    "This field is required"}
                </p>
              )}
            </div>
          ))}

          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>

            <Button type="submit" loading={loading} leftIcon="save">
              {editingVariant ? "Update Variant" : "Create Variant"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProductVariantManager;

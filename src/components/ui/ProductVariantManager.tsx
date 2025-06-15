// src/components/ui/ProductVariantManager.tsx
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import clsx from "clsx";
import { Button, Icon, Modal } from "../common";
import ImageSelector from "./ImageSelector";
import { apiService } from "../../Services/ApiServices";
import toast from "react-hot-toast";

// Define the types locally since they might not be imported correctly
interface ProductVariantImage {
  id: number;
  productVariantId: number;
  fileId: number;
  alt?: string;
  caption?: string;
  position: number;
  isFeatured: boolean;
  imageUrl: string;
  thumbnailUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface ProductVariant {
  id: number;
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
  featuredImageUrl?: string;
  createdAt: string;
  updatedAt: string;
  isAvailable: boolean;
  discountPercentage?: number;
  displayTitle: string;
  imageIds?: number[]; // For form handling
}

interface CreateProductVariant {
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
  imageIds: number[];
  images?: any[];
}

// API payload type with optional imageIds for delete operation
interface ApiVariantPayload {
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
  imageIds?: number[]; // Optional for delete operation
  images: Array<{
    fileId: number;
    position: number;
    isFeatured: boolean;
    alt: string;
    caption: string;
  }>;
}

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
  } = useForm<CreateProductVariant>({
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
      imageIds: [],
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
      imageIds: [],
    });
    setIsModalOpen(true);
  };

  const handleEditVariant = (variant: ProductVariant) => {
    setEditingVariant(variant);
    reset({
      title: variant.title,
      sku: variant.sku,
      price: variant.price,
      compareAtPrice: variant.compareAtPrice,
      costPerItem: variant.costPerItem,
      quantity: variant.quantity,
      trackQuantity: variant.trackQuantity,
      continueSellingWhenOutOfStock: variant.continueSellingWhenOutOfStock,
      requiresShipping: variant.requiresShipping,
      isTaxable: variant.isTaxable,
      weight: variant.weight,
      weightUnit: variant.weightUnit || "kg",
      barcode: variant.barcode || "",
      position: variant.position,
      isDefault: variant.isDefault,
      customFields: variant.customFields || {},
      option1: variant.option1 || "",
      option2: variant.option2 || "",
      option3: variant.option3 || "",
      imageIds:
        variant.imageIds || variant.images?.map((img) => img.fileId) || [],
    });
    setIsModalOpen(true);
  };

  const handleDeleteVariant = async (variantId: number) => {
    if (!window.confirm("Are you sure you want to delete this variant?")) {
      return;
    }

    try {
      // Always try to delete from API if it's a real variant ID (positive number)
      if (variantId > 0) {
        await apiService.delete(`/productvariant/${variantId}`);
        toast.success("Variant deleted successfully");
      }

      // Update local state regardless
      const updatedVariants = variants.filter((v) => v.id !== variantId);

      // If we deleted the default variant, make the first remaining one default
      if (
        updatedVariants.length > 0 &&
        !updatedVariants.some((v) => v.isDefault)
      ) {
        updatedVariants[0].isDefault = true;
      }

      onVariantsChange(updatedVariants);
    } catch (error) {
      console.error("Error deleting variant:", error);
      toast.error("Failed to delete variant");
    }
  };

  const handleFormSubmit = async (formData: CreateProductVariant) => {
    try {
      setLoading(true);

      // Clean and validate numeric fields
      const cleanNumericField = (value: any): number | undefined => {
        if (value === "" || value === null || value === undefined) {
          return undefined;
        }
        const parsed = parseFloat(value);
        return isNaN(parsed) ? undefined : parsed;
      };

      // Prepare the variant data
      const variantData = {
        title: formData.title || "",
        sku: formData.sku || "",
        price: cleanNumericField(formData.price) || 0,
        compareAtPrice: cleanNumericField(formData.compareAtPrice),
        costPerItem: cleanNumericField(formData.costPerItem),
        weight: cleanNumericField(formData.weight) || 0,
        quantity: parseInt(String(formData.quantity)) || 0,
        trackQuantity: Boolean(formData.trackQuantity),
        continueSellingWhenOutOfStock: Boolean(
          formData.continueSellingWhenOutOfStock
        ),
        requiresShipping: Boolean(formData.requiresShipping),
        isTaxable: Boolean(formData.isTaxable),
        weightUnit: formData.weightUnit || "kg",
        barcode: formData.barcode || "",
        position: parseInt(String(formData.position)) || variants.length,
        isDefault: Boolean(formData.isDefault),
        customFields: formData.customFields || {},
        option1: formData.option1 || "",
        option2: formData.option2 || "",
        option3: formData.option3 || "",
        imageIds: formData.imageIds || [],
      };

      let updatedVariant: ProductVariant;

      // For existing variants with positive IDs, update via API
      if (editingVariant && editingVariant.id > 0) {
        const apiPayload: ApiVariantPayload = {
          ...variantData,
          images: variantData.imageIds.map((fileId, index) => ({
            fileId,
            position: index,
            isFeatured: index === 0,
            alt: "",
            caption: "",
          })),
        };
        delete apiPayload.imageIds;

        updatedVariant = await apiService.put<ProductVariant>(
          `/productvariant/${editingVariant.id}`,
          apiPayload
        );
        toast.success("Variant updated successfully");
      }
      // For new variants, create via API if productId is available
      else if (!editingVariant && productId && productId > 0) {
        const apiPayload: ApiVariantPayload = {
          ...variantData,
          images: variantData.imageIds.map((fileId, index) => ({
            fileId,
            position: index,
            isFeatured: index === 0,
            alt: "",
            caption: "",
          })),
        };
        delete apiPayload.imageIds;

        updatedVariant = await apiService.post<ProductVariant>(
          `/product/${productId}/variant`,
          apiPayload
        );
        toast.success("Variant created successfully");
      }
      // For new products without productId, create using standalone variant API
      else {
        // Generate a temporary SKU if none provided
        const tempSku = variantData.sku || `TEMP-${Date.now()}`;

        const apiPayload: ApiVariantPayload = {
          ...variantData,
          sku: tempSku,
          images: variantData.imageIds.map((fileId, index) => ({
            fileId,
            position: index,
            isFeatured: index === 0,
            alt: "",
            caption: "",
          })),
        };
        delete apiPayload.imageIds;

        // Use standalone variant creation endpoint
        updatedVariant = await apiService.post<ProductVariant>(
          "/productvariant",
          {
            ...apiPayload,
            productId: productId || null, // Allow null productId for standalone creation
          }
        );
        toast.success("Variant created successfully");
      }

      // Update local state
      let updatedVariants = [...variants];

      if (editingVariant) {
        // Update existing variant
        updatedVariants = updatedVariants.map((v) =>
          v.id === editingVariant.id ? updatedVariant : v
        );
      } else {
        // Add new variant
        updatedVariants.push(updatedVariant);
      }

      // Handle default variant logic
      if (formData.isDefault || updatedVariants.length === 1) {
        updatedVariants = updatedVariants.map((v) => ({
          ...v,
          isDefault: v.id === updatedVariant.id,
        }));
      }

      onVariantsChange(updatedVariants);
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Error saving variant:", error);
      toast.error(error.response?.data?.message || "Failed to save variant");
    } finally {
      setLoading(false);
    }
  };

  const generateDisplayTitle = (variant: CreateProductVariant) => {
    const options = [variant.option1, variant.option2, variant.option3].filter(
      Boolean
    );
    return options.length > 0
      ? options.join(" / ")
      : variant.title || "Default";
  };

  const setDefaultVariant = async (variantId: number) => {
    try {
      // Only call API if we have a positive variant ID
      if (variantId > 0) {
        await apiService.put(`/productvariant/${variantId}/set-default`, {});
      }

      // Update local state regardless
      const updatedVariants = variants.map((v) => ({
        ...v,
        isDefault: v.id === variantId,
      }));
      onVariantsChange(updatedVariants);
      toast.success("Default variant updated");
    } catch (error) {
      console.error("Error setting default variant:", error);
      toast.error("Failed to update default variant");
    }
  };

  const renderVariantCard = (variant: ProductVariant) => {
    const featuredImageUrl =
      apiService.getFeaturedImageUrl(variant.images || []) ||
      (variant.imageIds && variant.imageIds.length > 0
        ? apiService.getImageUrl(variant.imageIds[0], "download")
        : undefined); // Changed from null to undefined to fix TypeScript error

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
                {variant.displayTitle ||
                  variant.title ||
                  generateDisplayTitle({
                    title: variant.title,
                    option1: variant.option1,
                    option2: variant.option2,
                    option3: variant.option3,
                  } as CreateProductVariant)}
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
              alt={variant.displayTitle || variant.title}
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

  const variantFormFields = [
    {
      name: "title" as const,
      label: "Variant Title",
      type: "text" as const,
      required: true,
      validation: { required: "Variant title is required" },
      placeholder: "e.g., Small, Red, Cotton",
    },
    {
      name: "sku" as const,
      label: "SKU",
      type: "text" as const,
      required: true,
      validation: { required: "SKU is required" },
      placeholder: "e.g., PRODUCT-SMALL-RED",
    },
    {
      name: "price" as const,
      label: "Price",
      type: "number" as const,
      required: true,
      min: 0,
      step: 0.01,
      validation: { required: "Price is required" },
      placeholder: "0.00",
    },
    {
      name: "compareAtPrice" as const,
      label: "Compare at Price",
      type: "number" as const,
      min: 0,
      step: 0.01,
      placeholder: "0.00",
    },
    {
      name: "costPerItem" as const,
      label: "Cost per Item",
      type: "number" as const,
      min: 0,
      step: 0.01,
      placeholder: "0.00",
    },
    {
      name: "quantity" as const,
      label: "Quantity",
      type: "number" as const,
      min: 0,
      placeholder: "0",
    },
    {
      name: "trackQuantity" as const,
      label: "Track Quantity",
      type: "checkbox" as const,
    },
    {
      name: "continueSellingWhenOutOfStock" as const,
      label: "Continue selling when out of stock",
      type: "checkbox" as const,
    },
    {
      name: "requiresShipping" as const,
      label: "Requires Shipping",
      type: "checkbox" as const,
    },
    {
      name: "isTaxable" as const,
      label: "Taxable",
      type: "checkbox" as const,
    },
    {
      name: "weight" as const,
      label: "Weight",
      type: "number" as const,
      min: 0,
      step: 0.01,
      placeholder: "0.00",
    },
    {
      name: "weightUnit" as const,
      label: "Weight Unit",
      type: "select" as const,
      options: [
        { value: "kg", label: "Kilograms" },
        { value: "g", label: "Grams" },
        { value: "lb", label: "Pounds" },
        { value: "oz", label: "Ounces" },
      ],
    },
    {
      name: "barcode" as const,
      label: "Barcode",
      type: "text" as const,
      placeholder: "e.g., 123456789012",
    },
    {
      name: "position" as const,
      label: "Position",
      type: "number" as const,
      min: 0,
      placeholder: "0",
    },
    {
      name: "isDefault" as const,
      label: "Default Variant",
      type: "checkbox" as const,
    },
    {
      name: "option1" as const,
      label: "Option 1",
      type: "text" as const,
      description: "e.g., Size, Color, Material",
      placeholder: "e.g., Size",
    },
    {
      name: "option2" as const,
      label: "Option 2",
      type: "text" as const,
      placeholder: "e.g., Color",
    },
    {
      name: "option3" as const,
      label: "Option 3",
      type: "text" as const,
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
              name="imageIds"
              control={control}
              render={({ field: { onChange, value } }) => (
                <ImageSelector
                  value={value || []}
                  onChange={onChange}
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

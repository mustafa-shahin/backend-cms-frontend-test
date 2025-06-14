// src/components/ui/ProductVariantManager.tsx
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import clsx from "clsx";
import {
  CreateProductVariant,
  UpdateProductVariant,
  ProductVariant,
} from "../../types/Product";
import { Button, Icon, Modal } from "../common";
import ImageSelector from "./ImageSelector";
import { FormField } from "../../types";
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

  const handleCreateVariant = () => {
    setEditingVariant(null);
    setIsModalOpen(true);
  };

  const handleEditVariant = (variant: ProductVariant) => {
    setEditingVariant(variant);
    setIsModalOpen(true);
  };

  const handleDeleteVariant = (variantId: number) => {
    if (window.confirm("Are you sure you want to delete this variant?")) {
      const updatedVariants = variants.filter((v) => v.id !== variantId);
      onVariantsChange(updatedVariants);
      toast.success("Variant deleted successfully");
    }
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      setLoading(true);

      // Convert image IDs to image objects
      const imageIds = formData.imageIds || [];
      const images = imageIds.map((fileId: number, index: number) => ({
        fileId,
        position: index,
        isFeatured: index === 0,
        alt: "",
        caption: "",
      }));

      const variantData = {
        ...formData,
        images,
        customFields: {},
      };

      if (editingVariant) {
        // Update existing variant
        const updatedVariants = variants.map((v) =>
          v.id === editingVariant.id ? { ...editingVariant, ...variantData } : v
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
            : 0,
          displayTitle: variantData.title,
          featuredImageUrl:
            images.length > 0
              ? `/api/files/${images[0].fileId}/download`
              : undefined,
        };

        // If this is the first variant or marked as default, make it default
        if (variants.length === 0 || variantData.isDefault) {
          // Remove default from other variants
          const updatedVariants = variants.map((v) => ({
            ...v,
            isDefault: false,
          }));
          newVariant.isDefault = true;
          onVariantsChange([...updatedVariants, newVariant]);
        } else {
          onVariantsChange([...variants, newVariant]);
        }

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

  const setDefaultVariant = (variantId: number) => {
    const updatedVariants = variants.map((v) => ({
      ...v,
      isDefault: v.id === variantId,
    }));
    onVariantsChange(updatedVariants);
    toast.success("Default variant updated");
  };

  const renderVariantCard = (variant: ProductVariant) => (
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
              {variant.title}
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
      {variant.featuredImageUrl && (
        <div className="mb-3">
          <img
            src={variant.featuredImageUrl}
            alt={variant.title}
            className="w-full h-20 object-cover rounded"
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
        {variant.option1 && (
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
        size="lg"
      >
        <div className="space-y-6">
          return (
          <form onSubmit={handleSubmit(onSubmit)} className={className}>
            <div className="space-y-6">
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                          "border-red-300 focus:border-red-500 focus:ring-red-500",
                        field.disabled &&
                          "bg-gray-100 dark:bg-gray-600 cursor-not-allowed"
                      );

                      switch (field.type) {
                        case "textarea":
                          return (
                            <textarea
                              {...fieldProps}
                              value={value || ""}
                              onChange={onChange}
                              placeholder={field.placeholder}
                              rows={field.rows || 3}
                              disabled={field.disabled}
                              className={baseInputClasses}
                            />
                          );

                        case "select":
                          return (
                            <select
                              {...fieldProps}
                              value={value || ""}
                              onChange={onChange}
                              disabled={field.disabled}
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
                                {...fieldProps}
                                type="checkbox"
                                checked={value || false}
                                onChange={(e) => onChange(e.target.checked)}
                                disabled={field.disabled}
                                className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                              />
                              <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                {field.label}
                              </label>
                            </div>
                          );

                        case "number":
                          return (
                            <input
                              {...fieldProps}
                              type="number"
                              value={value || ""}
                              onChange={(e) =>
                                onChange(
                                  e.target.valueAsNumber || e.target.value
                                )
                              }
                              placeholder={field.placeholder}
                              min={field.min}
                              max={field.max}
                              step={field.step}
                              disabled={field.disabled}
                              className={baseInputClasses}
                            />
                          );

                        default:
                          return (
                            <input
                              {...fieldProps}
                              type={field.type}
                              value={value || ""}
                              onChange={onChange}
                              placeholder={field.placeholder}
                              disabled={field.disabled}
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
            </div>

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
          );
        </div>
      </Modal>
    </div>
  );
};

export default ProductVariantManager;

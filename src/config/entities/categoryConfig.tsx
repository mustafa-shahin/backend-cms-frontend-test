import { EntityManagerConfig } from "../../components/entities/EntityManager";
import { Category, FormField } from "../../types";
import {
  createCheckboxField,
  createNumberField,
  createSelectField,
  createTextAreaField,
  createTextField,
} from "../../utils/formFieldHelpers";
import { format } from "date-fns";
import ImageSelector from "../../components/ui/ImageSelector";
import React from "react";

export const categoryEntityConfig: EntityManagerConfig<Category> = {
  entityName: "Category",
  apiEndpoint: "/category",
  columns: [
    {
      key: "name",
      label: "Name",
      render: (name, category) => (
        <div className="flex items-center">
          {category.featuredImageUrl && (
            <div className="flex-shrink-0 h-8 w-8 mr-3">
              <img
                src={category.featuredImageUrl}
                alt={name}
                className="h-8 w-8 object-cover rounded"
              />
            </div>
          )}
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {name}
            </div>
            {category.parentCategoryName && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Parent: {category.parentCategoryName}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "slug",
      label: "Slug",
      render: (slug) => (
        <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
          /{slug}
        </code>
      ),
    },
    {
      key: "productCount",
      label: "Products",
      render: (count) => (
        <span className="text-sm text-gray-900 dark:text-white">{count}</span>
      ),
    },
    {
      key: "isActive",
      label: "Status",
      render: (isActive, category) => (
        <div className="flex flex-col gap-1">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              isActive
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
            }`}
          >
            {isActive ? "Active" : "Inactive"}
          </span>
          {category.isVisible && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              Visible
            </span>
          )}
        </div>
      ),
    },
    {
      key: "sortOrder",
      label: "Sort Order",
    },
    {
      key: "createdAt",
      label: "Created",
      render: (date) => format(new Date(date), "MMM dd, yyyy"),
    },
  ],
  formFields: [
    createTextField("name", "Category Name", {
      required: true,
      validation: { required: "Category name is required" },
    }),
    createTextField("slug", "URL Slug", {
      required: true,
      validation: { required: "URL slug is required" },
      description: "URL-friendly version of the category name",
    }),
    createTextAreaField("description", "Description", 4),
    createTextAreaField("shortDescription", "Short Description", 2),

    // Category Images
    {
      name: "imageIds",
      label: "Category Images",
      type: "text", // We'll override this with custom render
      description: "Select images for this category",
    } as FormField,

    createSelectField("parentCategoryId", "Parent Category", []),
    createCheckboxField("isActive", "Active"),
    createCheckboxField("isVisible", "Visible"),
    createNumberField("sortOrder", "Sort Order", { min: 0 }),
    createTextField("metaTitle", "Meta Title", {
      description: "SEO title for search engines",
    }),
    createTextAreaField("metaDescription", "Meta Description", 2, {
      description: "SEO description for search engines",
    }),
    createTextField("metaKeywords", "Meta Keywords", {
      description: "Comma-separated keywords for SEO",
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
            maxImages={10}
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
  transformDataForForm: (category) => {
    const transformed = {
      ...category,
      imageIds: category.images?.map((img) => img.fileId) || [],
    };
    return transformed;
  },
};

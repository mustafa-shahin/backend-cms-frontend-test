import React, { useState, useEffect } from "react";
import { Category } from "../../types/Category";
import { PagedResult } from "../../types/api";
import { apiService } from "../../Services/ApiServices";
import { Button, Icon, Modal } from "../common";
import toast from "react-hot-toast";

interface CategorySelectorProps {
  value?: number | number[];
  onChange: (value: number | number[]) => void;
  multiple?: boolean;
  className?: string;
  maxCategories?: number;
  onCategoryEdit?: (category: Category) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  value,
  onChange,
  multiple = false,
  className = "",
  maxCategories = 10,
  onCategoryEdit,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Effect to load selected categories when the 'value' prop changes
  useEffect(() => {
    console.log("CategorySelector: value prop changed to:", value);
    if (value && (Array.isArray(value) ? value.length > 0 : value > 0)) {
      loadSelectedCategories();
    } else {
      setSelectedCategories([]);
      console.log(
        "CategorySelector: Clearing selected categories (value is empty/0)."
      );
    }
  }, [value]);

  const loadSelectedCategories = async () => {
    try {
      if (!value) {
        setSelectedCategories([]);
        console.log(
          "loadSelectedCategories: No value provided, clearing selected categories."
        );
        return;
      }

      // Ensure value is treated as an array of IDs
      const categoryIds = Array.isArray(value) ? value : [value];
      // Filter out invalid IDs (0 or falsy values)
      const validIds = categoryIds.filter((id) => id && id > 0);

      if (validIds.length === 0) {
        setSelectedCategories([]);
        console.log(
          "loadSelectedCategories: No valid category IDs found, clearing selected categories."
        );
        return;
      }

      console.log(
        "loadSelectedCategories: Attempting to load category IDs:",
        validIds
      );

      // Create promises for fetching each category
      const promises = validIds.map(async (id) => {
        try {
          const category = await apiService.get<Category>(`/category/${id}`);
          console.log(
            `loadSelectedCategories: Successfully loaded category ${id}:`,
            category
          );
          return category;
        } catch (error) {
          console.warn(
            `loadSelectedCategories: Failed to load category ${id}:`,
            error
          );
          return null;
        }
      });

      // Wait for all promises to resolve
      const results = await Promise.all(promises);
      // Filter out any null results from failed fetches
      const validCategories = results.filter(
        (category): category is Category => category !== null
      );
      setSelectedCategories(validCategories);
      console.log(
        "loadSelectedCategories: Selected categories updated to:",
        validCategories
      );
    } catch (error) {
      console.error(
        "loadSelectedCategories: Error loading selected categories:",
        error
      );
      setSelectedCategories([]);
    }
  };

  const fetchCategories = React.useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: "1",
        pageSize: "100",
      });

      if (searchTerm) {
        params.append("search", searchTerm);
      }

      try {
        const result = await apiService.get<PagedResult<Category> | Category[]>(
          `/category?${params.toString()}`
        );

        if (result && typeof result === "object" && "items" in result) {
          setCategories(result.items || []);
        } else if (Array.isArray(result)) {
          setCategories(result);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.warn(
          "fetchCategories: PagedResult failed, trying direct array response."
        );
        const result = await apiService.get<Category[]>(
          `/category?${params.toString()}`
        );
        setCategories(Array.isArray(result) ? result : []);
      }
    } catch (error) {
      console.error(
        "fetchCategories: Error fetching categories for modal:",
        error
      );
      toast.error("Failed to load categories");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  // Effect to fetch categories for the modal when it opens or search term changes
  useEffect(() => {
    if (isModalOpen) {
      fetchCategories();
    }
  }, [fetchCategories, isModalOpen, searchTerm]);

  const handleCategorySelect = (category: Category) => {
    if (multiple) {
      const currentIds = Array.isArray(value) ? value : [];
      if (currentIds.includes(category.id)) {
        // Remove category if already selected
        const newIds = currentIds.filter((id) => id !== category.id);
        onChange(newIds);
      } else if (currentIds.length < maxCategories) {
        // Add category if maxCategories limit not reached
        const newIds = [...currentIds, category.id];
        onChange(newIds);
      } else {
        toast.error(`Maximum ${maxCategories} categories allowed`);
      }
    } else {
      // For single selection, just set the new category ID and close modal
      onChange(category.id);
      setIsModalOpen(false);
    }
  };

  const removeCategory = (categoryId: number, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (multiple) {
      const currentIds = Array.isArray(value) ? value : [];
      const newIds = currentIds.filter((id) => id !== categoryId);
      onChange(newIds);
    } else {
      onChange(0);
    }
    console.log(
      `removeCategory: Removed category with ID ${categoryId}. New value:`,
      multiple
        ? Array.isArray(value)
          ? value.filter((id) => id !== categoryId)
          : []
        : 0
    );
  };

  const isSelected = (categoryId: number) => {
    if (Array.isArray(value)) {
      return value.includes(categoryId);
    }
    return value === categoryId;
  };

  const selectedCount = Array.isArray(value)
    ? value.filter((id) => id > 0).length
    : value && value > 0
    ? 1
    : 0;

  const shouldShowSelectButton = true;

  return (
    <div className={className}>
      {/* Selected Categories Display */}
      {selectedCategories.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map((selectedCategory, index) => {
              const featuredImageUrl = apiService.getFeaturedImageUrl(
                selectedCategory.images || []
              );

              return (
                <div
                  key={selectedCategory.id}
                  className="inline-flex items-center bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-sm rounded-full px-3 py-1 border border-blue-200 dark:border-blue-700"
                >
                  {/* Category Image */}
                  {featuredImageUrl && (
                    <div className="flex-shrink-0 h-4 w-4 mr-2">
                      <img
                        src={featuredImageUrl}
                        alt={selectedCategory.name}
                        className="h-4 w-4 object-cover rounded-full"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                        }}
                      />
                    </div>
                  )}

                  {/* Category name with click handler for editing */}
                  <span
                    className={`${
                      onCategoryEdit ? "cursor-pointer hover:underline" : ""
                    }`}
                    onClick={() =>
                      onCategoryEdit && onCategoryEdit(selectedCategory)
                    }
                  >
                    {selectedCategory.name}
                  </span>

                  {selectedCategory.parentCategoryName && (
                    <span className="ml-1 text-xs opacity-75">
                      ({selectedCategory.parentCategoryName})
                    </span>
                  )}

                  {/* Selected indicator for multiple selection */}
                  {multiple && (
                    <span className="ml-2 bg-blue-500 text-white rounded-full h-4 w-4 flex items-center justify-center text-xs">
                      {index + 1}
                    </span>
                  )}

                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={(e) => removeCategory(selectedCategory.id, e)}
                    className="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-100"
                    aria-label="Remove category"
                  >
                    <Icon name="times" size="xs" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Button to open the category selection modal */}
      {shouldShowSelectButton && (
        <Button
          type="button"
          variant="outline"
          leftIcon="tag"
          onClick={() => setIsModalOpen(true)}
          className="w-full"
        >
          {selectedCount > 0
            ? `${
                multiple ? "Add More Categories" : "Change Category"
              } (${selectedCount}${multiple ? `/${maxCategories}` : ""})`
            : "Select Categories"}
        </Button>
      )}

      {/* Category Selection Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Select Categories"
        size="xl"
      >
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon name="search" size="sm" className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm"
            />
          </div>

          {/* Categories List or Loading/No Categories Message */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Icon
                name="spinner"
                size="lg"
                spin
                className="text-primary-600"
              />
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {categories.map((category) => {
                const selected = isSelected(category.id);
                const featuredImageUrl = apiService.getFeaturedImageUrl(
                  category.images || []
                );

                return (
                  <div
                    key={category.id}
                    className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 border ${
                      selected
                        ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                    onClick={() => handleCategorySelect(category)}
                  >
                    {/* Category Image */}
                    <div className="flex-shrink-0 h-10 w-10 mr-3">
                      {featuredImageUrl ? (
                        <img
                          src={featuredImageUrl}
                          alt={category.name}
                          className="h-10 w-10 object-cover rounded"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            const fallback =
                              target.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = "flex";
                          }}
                        />
                      ) : null}
                      {/* Fallback icon */}
                      <div
                        className={`h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center ${
                          featuredImageUrl ? "hidden" : ""
                        }`}
                      >
                        <Icon name="tag" size="sm" className="text-gray-400" />
                      </div>
                    </div>

                    {/* Category Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {category.name}
                        </h4>
                        {category.parentCategoryName && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            in {category.parentCategoryName}
                          </span>
                        )}
                      </div>

                      {category.description && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate mt-1">
                          {category.description}
                        </p>
                      )}

                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {category.productCount} products
                        </span>

                        {category.isActive && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Active
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Selection indicator */}
                    {selected && (
                      <div className="flex-shrink-0 ml-3">
                        <div className="bg-primary-500 text-white rounded-full h-6 w-6 flex items-center justify-center">
                          <Icon name="check" size="xs" />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {categories.length === 0 && !loading && (
            <div className="text-center py-12">
              <Icon
                name="tag"
                size="2xl"
                className="mx-auto text-gray-400 mb-4"
              />
              <p className="text-gray-500 dark:text-gray-400">
                No categories found. Create some categories first.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            {multiple && (
              <Button
                type="button"
                onClick={() => setIsModalOpen(false)}
                leftIcon="check"
              >
                Done ({selectedCount} selected)
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CategorySelector;

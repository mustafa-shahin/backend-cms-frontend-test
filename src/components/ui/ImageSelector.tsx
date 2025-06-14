import React, { useState, useEffect } from "react";
import { FileEntity } from "../../types/FileEntity";
import { FileType } from "../../types/enums";
import { PagedResult } from "../../types/api";
import { apiService } from "../../Services/ApiServices";
import { Button, Icon, Modal } from "../common";
import toast from "react-hot-toast";

interface ImageSelectorProps {
  value?: number | number[];
  onChange: (value: number | number[]) => void;
  multiple?: boolean;
  className?: string;
  maxImages?: number;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({
  value,
  onChange,
  multiple = false,
  className = "",
  maxImages = 10,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [images, setImages] = useState<FileEntity[]>([]);
  const [selectedImages, setSelectedImages] = useState<FileEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Effect to load selected images when the 'value' prop changes
  useEffect(() => {
    console.log("ImageSelector: value prop changed to:", value);
    if (value && (Array.isArray(value) ? value.length > 0 : value > 0)) {
      loadSelectedImages();
    } else {
      // If value is empty or 0, clear any previously selected images
      setSelectedImages([]);
      console.log(
        "ImageSelector: Clearing selected images (value is empty/0)."
      );
    }
  }, [value]); // Dependency on 'value' ensures this runs when value changes

  const loadSelectedImages = async () => {
    try {
      if (!value) {
        setSelectedImages([]);
        console.log(
          "loadSelectedImages: No value provided, clearing selected images."
        );
        return;
      }

      // Ensure value is treated as an array of IDs
      const imageIds = Array.isArray(value) ? value : [value];
      // Filter out invalid IDs (0 or falsy values)
      const validIds = imageIds.filter((id) => id && id > 0);

      if (validIds.length === 0) {
        setSelectedImages([]);
        console.log(
          "loadSelectedImages: No valid image IDs found, clearing selected images."
        );
        return;
      }

      console.log(
        "loadSelectedImages: Attempting to load image IDs:",
        validIds
      );

      // Create promises for fetching each image
      const promises = validIds.map(async (id) => {
        try {
          const file = await apiService.get<FileEntity>(`/file/${id}`);
          console.log(
            `loadSelectedImages: Successfully loaded image ${id}:`,
            file
          );
          return file;
        } catch (error) {
          console.warn(
            `loadSelectedImages: Failed to load image ${id}:`,
            error
          );
          return null; // Return null if fetching fails for a specific image
        }
      });

      // Wait for all promises to resolve
      const results = await Promise.all(promises);
      // Filter out any null results from failed fetches
      const files = results.filter((file): file is FileEntity => file !== null);
      setSelectedImages(files);
      console.log("loadSelectedImages: Selected images updated to:", files);
    } catch (error) {
      console.error(
        "loadSelectedImages: Error loading selected images:",
        error
      );
      setSelectedImages([]); // Ensure state is cleared on error
    }
  };

  const fetchImages = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        fileType: FileType.Image.toString(),
        page: "1",
        pageSize: "50",
      });

      if (searchTerm) {
        params.append("search", searchTerm);
      }

      try {
        const result = await apiService.get<PagedResult<FileEntity>>(
          `/file?${params.toString()}`
        );
        setImages(result.items || []);
      } catch (error) {
        // Fallback to direct array response if PagedResult is not returned
        console.warn(
          "fetchImages: PagedResult failed, trying direct array response."
        );
        const result = await apiService.get<FileEntity[]>(
          `/file?${params.toString()}`
        );
        setImages(Array.isArray(result) ? result : []);
      }
    } catch (error) {
      console.error("fetchImages: Error fetching images for modal:", error);
      toast.error("Failed to load images");
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch images for the modal when it opens or search term changes
  useEffect(() => {
    if (isModalOpen) {
      fetchImages();
    }
  }, [isModalOpen, searchTerm]);

  const handleImageSelect = (image: FileEntity) => {
    if (multiple) {
      // Get current selected IDs, ensuring it's an array
      const currentIds = Array.isArray(value) ? value : [];
      if (currentIds.includes(image.id)) {
        // Remove image if already selected
        const newIds = currentIds.filter((id) => id !== image.id);
        onChange(newIds);
      } else if (currentIds.length < maxImages) {
        // Add image if maxImages limit not reached
        const newIds = [...currentIds, image.id];
        onChange(newIds);
      } else {
        toast.error(`Maximum ${maxImages} images allowed`);
      }
    } else {
      // For single selection, just set the new image ID and close modal
      onChange(image.id);
      setIsModalOpen(false);
    }
  };

  const removeImage = (imageId: number, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (multiple) {
      const currentIds = Array.isArray(value) ? value : [];
      const newIds = currentIds.filter((id) => id !== imageId);
      onChange(newIds);
    } else {
      // For single selection, setting to 0 or null clears the selection
      onChange(0);
    }
    console.log(
      `removeImage: Removed image with ID ${imageId}. New value:`,
      multiple
        ? Array.isArray(value)
          ? value.filter((id) => id !== imageId)
          : []
        : 0
    );
  };

  const isSelected = (imageId: number) => {
    if (Array.isArray(value)) {
      return value.includes(imageId);
    }
    return value === imageId;
  };

  const getImageUrl = (file: FileEntity) => {
    // Uses apiService to get the full image URL
    return apiService.getImageUrl(file.id, "download");
  };

  const getThumbnailUrl = (file: FileEntity) => {
    // Uses apiService to get the thumbnail URL, with fallback to full image
    return (
      apiService.getImageUrl(file.id, "thumbnail") ||
      apiService.getImageUrl(file.id, "download")
    );
  };

  const selectedCount = Array.isArray(value)
    ? value.filter((id) => id > 0).length // Count valid IDs if multiple
    : value && value > 0
    ? 1 // Count 1 if single value is valid
    : 0; // Count 0 if no valid single value

  const shouldShowSelectButton = true;

  return (
    <div className={className}>
      {/* Selected Images Display */}
      {selectedImages.length > 0 && (
        <div className="mb-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {selectedImages.map((selectedImage, index) => {
              const thumbnailUrl = getThumbnailUrl(selectedImage);
              return (
                <div
                  key={selectedImage.id}
                  className="relative group bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border-2 border-primary-200 dark:border-primary-700"
                >
                  {thumbnailUrl ? (
                    <img
                      src={thumbnailUrl}
                      alt={selectedImage.originalFileName}
                      className="w-full h-24 object-cover"
                      onError={(e) => {
                        // Fallback SVG for broken image links
                        const target = e.target as HTMLImageElement;
                        target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="%23f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%236b7280">Failed to load</text></svg>`;
                        console.error(
                          `ImageSelector: Failed to load image thumbnail for ID ${selectedImage.id}.`
                        );
                      }}
                    />
                  ) : (
                    <div className="w-full h-24 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <Icon name="image" size="lg" className="text-gray-400" />
                    </div>
                  )}

                  {/* Remove button */}
                  <div className="absolute top-1 right-1">
                    <Button
                      type="button"
                      size="xs"
                      variant="danger"
                      onClick={(e) => removeImage(selectedImage.id, e)}
                      className="!p-1 !min-w-0 h-6 w-6 rounded-full opacity-80 hover:opacity-100"
                      aria-label="Remove image"
                    >
                      <Icon name="times" size="xs" />
                    </Button>
                  </div>

                  {/* Selected indicator */}
                  <div className="absolute top-1 left-1">
                    <div className="bg-primary-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                      {multiple ? index + 1 : <Icon name="check" size="xs" />}
                    </div>
                  </div>

                  <div className="p-2">
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                      {selectedImage.originalFileName}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Button to open the image selection modal */}
      {shouldShowSelectButton && (
        <Button
          type="button"
          variant="outline"
          leftIcon="image"
          onClick={() => setIsModalOpen(true)}
          className="w-full"
        >
          {selectedCount > 0
            ? `${
                multiple ? "Add More Images" : "Change Image"
              } (${selectedCount}${multiple ? `/${maxImages}` : ""})`
            : "Select Image(s)"}
        </Button>
      )}

      {/* No longer needed as the main button changes text */}
      {/* {!multiple && selectedCount > 0 && (
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          1 image selected.{" "}
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={() => setIsModalOpen(true)}
            className="!p-1 !text-primary-600 !font-medium"
          >
            Change
          </Button>
        </div>
      )} */}

      {/* Image Selection Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Select Images"
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
              placeholder="Search images..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm"
            />
          </div>

          {/* Images Grid or Loading/No Images Message */}
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-96 overflow-y-auto">
              {images.map((image) => {
                const thumbnailUrl = getThumbnailUrl(image);
                const selected = isSelected(image.id);

                return (
                  <div
                    key={image.id}
                    className={`relative cursor-pointer rounded-lg overflow-hidden transition-all duration-200 ${
                      selected
                        ? "ring-2 ring-primary-500 shadow-lg"
                        : "hover:shadow-md"
                    }`}
                    onClick={() => handleImageSelect(image)}
                  >
                    {thumbnailUrl ? (
                      <img
                        src={thumbnailUrl}
                        alt={image.originalFileName}
                        className="w-full h-24 object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="%23f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%236b7280">Failed to load</text></svg>`;
                          console.error(
                            `ImageSelector: Failed to load image thumbnail for ID ${image.id} in modal.`
                          );
                        }}
                      />
                    ) : (
                      <div className="w-full h-24 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <Icon
                          name="image"
                          size="lg"
                          className="text-gray-400"
                        />
                      </div>
                    )}

                    {/* Selection overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                      {selected && (
                        <div className="absolute top-2 right-2">
                          <div className="bg-primary-500 text-white rounded-full h-6 w-6 flex items-center justify-center">
                            <Icon name="check" size="xs" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-2 bg-white dark:bg-gray-800">
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        {image.originalFileName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {image.fileSizeFormatted}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {images.length === 0 && !loading && (
            <div className="text-center py-12">
              <Icon
                name="image"
                size="2xl"
                className="mx-auto text-gray-400 mb-4"
              />
              <p className="text-gray-500 dark:text-gray-400">
                No images found. Upload some images first.
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

export default ImageSelector;

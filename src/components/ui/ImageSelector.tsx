import React, { useState, useEffect } from "react";
import { FileEntity } from "../../types/FileEntity";
import { FileType } from "../../types/enums";
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

interface SelectedImage {
  id: number;
  file: FileEntity;
  alt?: string;
  caption?: string;
  position: number;
  isFeatured: boolean;
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
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (value) {
      loadSelectedImages();
    }
  }, [value]);

  const loadSelectedImages = async () => {
    try {
      const imageIds = Array.isArray(value) ? value : [value];
      const promises = imageIds.map((id) =>
        apiService.get<FileEntity>(`/file/${id}`)
      );
      const files = await Promise.all(promises);

      setSelectedImages(
        files.map((file, index) => ({
          id: file.id,
          file,
          alt: "",
          caption: "",
          position: index,
          isFeatured: index === 0,
        }))
      );
    } catch (error) {
      console.error("Error loading selected images:", error);
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

      const result = await apiService.get<any>(`/file?${params.toString()}`);
      setImages(result.items || []);
    } catch (error) {
      console.error("Error fetching images:", error);
      toast.error("Failed to load images");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      fetchImages();
    }
  }, [isModalOpen, searchTerm]);

  const handleImageSelect = (image: FileEntity) => {
    if (multiple) {
      const currentIds = Array.isArray(value) ? value : [];
      if (currentIds.includes(image.id)) {
        // Remove image
        const newIds = currentIds.filter((id) => id !== image.id);
        onChange(newIds);
      } else if (currentIds.length < maxImages) {
        // Add image
        const newIds = [...currentIds, image.id];
        onChange(newIds);
      } else {
        toast.error(`Maximum ${maxImages} images allowed`);
      }
    } else {
      onChange(image.id);
      setIsModalOpen(false);
    }
  };

  const removeImage = (imageId: number) => {
    if (multiple) {
      const currentIds = Array.isArray(value) ? value : [];
      const newIds = currentIds.filter((id) => id !== imageId);
      onChange(newIds);
    } else {
      onChange(0);
    }
  };

  const isSelected = (imageId: number) => {
    if (Array.isArray(value)) {
      return value.includes(imageId);
    }
    return value === imageId;
  };

  const getImageUrl = (file: FileEntity) => {
    return apiService.getDownloadUrl(`/file/${file.id}/download`);
  };

  const getThumbnailUrl = (file: FileEntity) => {
    return apiService.getDownloadUrl(`/file/${file.id}/thumbnail`);
  };

  return (
    <div className={className}>
      {/* Selected Images Display */}
      {selectedImages.length > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Selected Images
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {selectedImages.map((selectedImage, index) => (
              <div
                key={selectedImage.id}
                className="relative group bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
              >
                <img
                  src={getThumbnailUrl(selectedImage.file)}
                  alt={selectedImage.file.originalFileName}
                  className="w-full h-24 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
                  <Button
                    size="xs"
                    variant="danger"
                    leftIcon="trash"
                    onClick={() => removeImage(selectedImage.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Remove
                  </Button>
                </div>
                <div className="p-2">
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                    {selectedImage.file.originalFileName}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Images Button */}
      <Button
        variant="outline"
        leftIcon="image"
        onClick={() => setIsModalOpen(true)}
        className="w-full"
      >
        {selectedImages.length > 0
          ? `${multiple ? "Add More Images" : "Change Image"} (${
              selectedImages.length
            }${multiple ? `/${maxImages}` : ""})`
          : "Select Image(s)"}
      </Button>

      {/* Image Selection Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Select Images"
        size="xl"
      >
        <div className="space-y-4">
          {/* Search */}
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

          {/* Images Grid */}
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
              {images.map((image) => (
                <div
                  key={image.id}
                  className={`relative cursor-pointer rounded-lg overflow-hidden transition-all duration-200 ${
                    isSelected(image.id)
                      ? "ring-2 ring-primary-500 shadow-lg"
                      : "hover:shadow-md"
                  }`}
                  onClick={() => handleImageSelect(image)}
                >
                  <img
                    src={getThumbnailUrl(image)}
                    alt={image.originalFileName}
                    className="w-full h-24 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                    {isSelected(image.id) && (
                      <div className="absolute top-2 right-2">
                        <Icon
                          name="check"
                          size="sm"
                          className="text-white bg-primary-500 rounded-full p-1"
                        />
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
              ))}
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
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            {multiple && (
              <Button onClick={() => setIsModalOpen(false)} leftIcon="check">
                Done ({Array.isArray(value) ? value.length : 0} selected)
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ImageSelector;

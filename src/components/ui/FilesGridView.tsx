import React from "react";
import { FileEntity, FileType } from "../../types/entities";
import Button from "../common/Button";
import Icon from "../common/Icon";
import { format } from "date-fns";

interface FilesGridViewProps {
  files: FileEntity[];
  loading: boolean;
  onEdit: (file: FileEntity) => void;
  onDelete: (file: FileEntity) => void;
  onDownload: (file: FileEntity) => void;
  onPreview?: (file: FileEntity) => void;
}

const FilesGridView: React.FC<FilesGridViewProps> = ({
  files,
  loading,
  onEdit,
  onDelete,
  onDownload,
  onPreview,
}) => {
  const getFileIcon = (file: FileEntity) => {
    switch (file.fileType) {
      case FileType.Image:
        return "image";
      case FileType.Video:
        return "video";
      case FileType.Audio:
        return "music";
      case FileType.Document:
        return "file-text";
      case FileType.Archive:
        return "archive";
      default:
        return "file";
    }
  };

  const getFileTypeColor = (fileType: FileType) => {
    switch (fileType) {
      case FileType.Image:
        return "text-green-500";
      case FileType.Video:
        return "text-blue-500";
      case FileType.Audio:
        return "text-purple-500";
      case FileType.Document:
        return "text-red-500";
      case FileType.Archive:
        return "text-yellow-500";
      default:
        return "text-gray-500";
    }
  };

  const getThumbnailUrl = (file: FileEntity) => {
    // Fix the thumbnail URL to use the correct API endpoint
    if (file.fileType === FileType.Image && file.id) {
      return `${
        process.env.REACT_APP_API_URL || "http://localhost:5252/api"
      }/file/${file.id}/thumbnail`;
    }
    return null;
  };

  const getFileUrl = (file: FileEntity) => {
    // Fix the file download URL
    return `${
      process.env.REACT_APP_API_URL || "http://localhost:5252/api"
    }/file/${file.id}/download`;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 animate-pulse"
          >
            <div className="w-full h-32 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-12">
        <Icon name="folder" size="2xl" className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No files found
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Upload some files to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {files.map((file) => {
        const thumbnailUrl = getThumbnailUrl(file);

        return (
          <div
            key={file.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow duration-200 overflow-hidden group"
          >
            {/* File Preview/Thumbnail */}
            <div className="relative h-32 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              {thumbnailUrl ? (
                <img
                  src={thumbnailUrl}
                  alt={file.alt || file.originalFileName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to icon if thumbnail fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = "flex";
                  }}
                />
              ) : null}

              {/* Fallback icon */}
              <div
                className={`w-full h-full flex items-center justify-center ${
                  thumbnailUrl ? "hidden" : "flex"
                }`}
                style={{ display: thumbnailUrl ? "none" : "flex" }}
              >
                <Icon
                  name={getFileIcon(file)}
                  size="2xl"
                  className={getFileTypeColor(file.fileType)}
                />
              </div>

              {/* File type badge */}
              <div className="absolute top-2 left-2">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white dark:bg-gray-800 ${getFileTypeColor(
                    file.fileType
                  )}`}
                >
                  {file.fileExtension.replace(".", "").toUpperCase()}
                </span>
              </div>

              {/* Actions overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-2">
                {onPreview && file.canPreview && (
                  <Button
                    size="xs"
                    variant="secondary"
                    leftIcon="eye"
                    onClick={() => onPreview(file)}
                    className="!p-2"
                  >
                    <span className="sr-only">Preview</span>
                  </Button>
                )}
                <Button
                  size="xs"
                  variant="secondary"
                  leftIcon="download"
                  onClick={() => onDownload(file)}
                  className="!p-2"
                >
                  <span className="sr-only">Download</span>
                </Button>
                <Button
                  size="xs"
                  variant="secondary"
                  leftIcon="edit"
                  onClick={() => onEdit(file)}
                  className="!p-2"
                >
                  <span className="sr-only">Edit</span>
                </Button>
              </div>
            </div>

            {/* File info */}
            <div className="p-3">
              <h4
                className="text-sm font-medium text-gray-900 dark:text-white truncate"
                title={file.originalFileName}
              >
                {file.originalFileName}
              </h4>
              <div className="mt-1 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>{file.fileSizeFormatted}</span>
                <span>{format(new Date(file.createdAt), "MMM dd")}</span>
              </div>

              {file.description && (
                <p
                  className="mt-2 text-xs text-gray-600 dark:text-gray-400 line-clamp-2"
                  title={file.description}
                >
                  {file.description}
                </p>
              )}

              {/* Visibility indicator */}
              <div className="mt-2 flex items-center justify-between">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    file.isPublic
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                  }`}
                >
                  <Icon
                    name={file.isPublic ? "globe" : "lock"}
                    size="xs"
                    className="mr-1"
                  />
                  {file.isPublic ? "Public" : "Private"}
                </span>

                {/* Action menu */}
                <div className="flex items-center space-x-1">
                  <Button
                    size="xs"
                    variant="ghost"
                    leftIcon="edit"
                    onClick={() => onEdit(file)}
                    className="!p-1"
                  >
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    size="xs"
                    variant="ghost"
                    leftIcon="trash"
                    onClick={() => onDelete(file)}
                    className="!p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FilesGridView;

import React, { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FileEntity, FileType, TableAction, PagedResult } from "../types";
import { fileEntityConfig } from "../config/EntityConfig";
import { apiService } from "../Services/ApiServices";
import Table from "../components/ui/Tabble";
import FilesGridView from "../components/ui/FilesGridView";
import Modal from "../components/ui/Modal";
import Form from "../components/ui/Form";
import Button from "../components/ui/Button";
import Icon from "../components/ui/Icon";
import toast from "react-hot-toast";

interface FilesPageProps {
  filterType?: "documents" | "images" | "videos" | "audio" | "archives";
}

const FilesPage: React.FC<FilesPageProps> = ({ filterType }) => {
  const [files, setFiles] = useState<FileEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [editingFile, setEditingFile] = useState<FileEntity | null>(null);
  const [previewFile, setPreviewFile] = useState<FileEntity | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {}
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const pageSize = 20;

  useEffect(() => {
    fetchFiles();
  }, [filterType, currentPage, searchTerm]);

  const fetchFiles = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
      });

      if (searchTerm) {
        params.append("search", searchTerm);
      }

      if (filterType) {
        const typeMap: Record<string, FileType> = {
          documents: FileType.Document,
          images: FileType.Image,
          videos: FileType.Video,
          audio: FileType.Audio,
          archives: FileType.Archive,
        };
        params.append("fileType", typeMap[filterType].toString());
      }

      const result = await apiService.get<PagedResult<FileEntity>>(
        `/file?${params.toString()}`
      );

      setFiles(result.items);
      setTotalCount(result.totalCount);
    } catch (error) {
      console.error("Error fetching files:", error);
      toast.error("Failed to load files");
    } finally {
      setLoading(false);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true);

    for (const file of acceptedFiles) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("isPublic", "true");
        formData.append("generateThumbnail", "true");

        const result = await apiService.post<FileEntity>(
          "/file/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                const progress = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
                );
                setUploadProgress((prev) => ({
                  ...prev,
                  [file.name]: progress,
                }));
              }
            },
          }
        );

        await fetchFiles(); // Refresh the list
        toast.success(`${file.name} uploaded successfully`);
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error);
        toast.error(`Failed to upload ${file.name}`);
      } finally {
        setUploadProgress((prev) => {
          const updated = { ...prev };
          delete updated[file.name];
          return updated;
        });
      }
    }

    setUploading(false);
    setUploadModalOpen(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  const handleEdit = (file: FileEntity) => {
    setEditingFile(file);
    setEditModalOpen(true);
  };

  const handlePreview = (file: FileEntity) => {
    setPreviewFile(file);
    setPreviewModalOpen(true);
  };

  const handleDelete = async (file: FileEntity) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${file.originalFileName}"?`
      )
    ) {
      return;
    }

    try {
      await apiService.delete(`/file/${file.id}`);
      await fetchFiles(); // Refresh the list
      toast.success("File deleted successfully");
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Failed to delete file");
    }
  };

  const handleDownload = async (file: FileEntity) => {
    try {
      const downloadUrl = `${
        process.env.REACT_APP_API_URL || "http://localhost:5252/api"
      }/file/${file.id}/download`;

      // Simple approach: create invisible iframe
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = downloadUrl;
      document.body.appendChild(iframe);

      // Remove iframe after download starts
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);

      toast.success("Download started");
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Failed to download file");
    }
  };

  const handleFormSubmit = async (formData: any) => {
    if (!editingFile) return;

    try {
      const result = await apiService.put<FileEntity>(
        `/file/${editingFile.id}`,
        formData
      );
      await fetchFiles(); // Refresh the list
      setEditModalOpen(false);
      toast.success("File updated successfully");
    } catch (error) {
      console.error("Error updating file:", error);
      toast.error("Failed to update file");
    }
  };

  const tableActions: TableAction<FileEntity>[] = [
    {
      label: "Preview",
      icon: "eye",
      variant: "secondary",
      onClick: handlePreview,
      show: (file) => file.canPreview || false,
    },
    {
      label: "Download",
      icon: "download",
      variant: "secondary",
      onClick: handleDownload,
    },
    {
      label: "Edit",
      icon: "edit",
      variant: "secondary",
      onClick: handleEdit,
    },
    {
      label: "Delete",
      icon: "trash",
      variant: "danger",
      onClick: handleDelete,
    },
  ];

  const getPageTitle = () => {
    const titles = {
      documents: "Documents",
      images: "Images",
      videos: "Videos",
      audio: "Audio Files",
      archives: "Archives",
    };
    return filterType ? titles[filterType] : "All Files";
  };

  const renderPreviewContent = () => {
    if (!previewFile) return null;

    const fileUrl = `${
      process.env.REACT_APP_API_URL || "http://localhost:5252/api"
    }/file/${previewFile.id}/download`;

    switch (previewFile.fileType) {
      case FileType.Image:
        return (
          <div className="text-center">
            <img
              src={fileUrl}
              alt={previewFile.alt || previewFile.originalFileName}
              className="max-w-full max-h-96 mx-auto rounded"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="%23f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%236b7280">Failed to load</text></svg>`;
              }}
            />
          </div>
        );
      case FileType.Video:
        return (
          <video controls className="w-full max-h-96">
            <source src={fileUrl} type={previewFile.contentType} />
            Your browser does not support the video tag.
          </video>
        );
      case FileType.Audio:
        return (
          <audio controls className="w-full">
            <source src={fileUrl} type={previewFile.contentType} />
            Your browser does not support the audio tag.
          </audio>
        );
      case FileType.Document:
        if (previewFile.contentType === "application/pdf") {
          return (
            <iframe
              src={fileUrl}
              className="w-full h-96"
              title={previewFile.originalFileName}
            />
          );
        }
        return (
          <div className="text-center py-8">
            <Icon
              name="file-text"
              size="2xl"
              className="mx-auto text-gray-400 mb-4"
            />
            <p className="text-gray-600 dark:text-gray-400">
              Preview not available for this document type.
            </p>
            <Button
              className="mt-4"
              leftIcon="download"
              onClick={() => handleDownload(previewFile)}
            >
              Download to view
            </Button>
          </div>
        );
      default:
        return (
          <div className="text-center py-8">
            <Icon
              name="file"
              size="2xl"
              className="mx-auto text-gray-400 mb-4"
            />
            <p className="text-gray-600 dark:text-gray-400">
              Preview not available for this file type.
            </p>
            <Button
              className="mt-4"
              leftIcon="download"
              onClick={() => handleDownload(previewFile)}
            >
              Download file
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {getPageTitle()}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your {filterType ? filterType : "files"}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon name="search" size="sm" className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm"
            />
          </div>

          {/* View mode toggle */}
          <div className="flex rounded-md shadow-sm">
            <Button
              size="sm"
              variant={viewMode === "grid" ? "primary" : "outline"}
              leftIcon="th"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none"
            >
              Grid
            </Button>
            <Button
              size="sm"
              variant={viewMode === "table" ? "primary" : "outline"}
              leftIcon="list"
              onClick={() => setViewMode("table")}
              className="rounded-l-none border-l-0"
            >
              Table
            </Button>
          </div>

          <Button onClick={() => setUploadModalOpen(true)} leftIcon="upload">
            Upload Files
          </Button>
        </div>
      </div>

      {/* Files Display */}
      {viewMode === "grid" ? (
        <FilesGridView
          files={files}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDownload={handleDownload}
          onPreview={handlePreview}
        />
      ) : (
        <Table
          data={files}
          columns={fileEntityConfig.columns}
          actions={tableActions}
          loading={loading}
          emptyMessage="No files found"
        />
      )}

      {/* Pagination */}
      {totalCount > pageSize && (
        <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 rounded-b-lg">
          <div className="flex items-center">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Showing{" "}
              <span className="font-medium">
                {(currentPage - 1) * pageSize + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(currentPage * pageSize, totalCount)}
              </span>{" "}
              of <span className="font-medium">{totalCount}</span> results
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage <= 1}
              leftIcon="chevron-left"
            >
              Previous
            </Button>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Page {currentPage} of {Math.ceil(totalCount / pageSize)}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage >= Math.ceil(totalCount / pageSize)}
              rightIcon="chevron-right"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title="Upload Files"
        size="lg"
      >
        <div className="space-y-4">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? "border-primary-400 bg-primary-50 dark:bg-primary-900/20"
                : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
            }`}
          >
            <input {...getInputProps()} />
            <Icon
              name="upload"
              size="2xl"
              className="mx-auto text-gray-400 mb-4"
            />
            {isDragActive ? (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Drop the files here...
              </p>
            ) : (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Drag and drop files here, or click to select files
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Support for multiple files
                </p>
              </div>
            )}
          </div>

          {/* Upload Progress */}
          {Object.keys(uploadProgress).length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                Uploading...
              </h4>
              {Object.entries(uploadProgress).map(([fileName, progress]) => (
                <div key={fileName}>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {fileName}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit File"
        size="lg"
      >
        {editingFile && (
          <Form
            fields={fileEntityConfig.formFields}
            onSubmit={handleFormSubmit}
            defaultValues={editingFile}
            submitLabel="Update"
            onCancel={() => setEditModalOpen(false)}
          />
        )}
      </Modal>

      {/* Preview Modal */}
      <Modal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        title={
          previewFile
            ? `Preview: ${previewFile.originalFileName}`
            : "File Preview"
        }
        size="xl"
      >
        {previewFile && (
          <div className="space-y-4">
            {renderPreviewContent()}

            {/* File info */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Size:
                  </span>{" "}
                  <span className="text-gray-900 dark:text-white">
                    {previewFile.fileSizeFormatted}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Type:
                  </span>{" "}
                  <span className="text-gray-900 dark:text-white">
                    {previewFile.contentType}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Uploaded:
                  </span>{" "}
                  <span className="text-gray-900 dark:text-white">
                    {new Date(previewFile.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Downloads:
                  </span>{" "}
                  <span className="text-gray-900 dark:text-white">
                    {previewFile.downloadCount}
                  </span>
                </div>
              </div>

              {previewFile.description && (
                <div className="mt-4">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Description:
                  </span>
                  <p className="mt-1 text-gray-900 dark:text-white">
                    {previewFile.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FilesPage;

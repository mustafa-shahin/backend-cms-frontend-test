import React, { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FileEntity, Folder, PagedResult } from "../../types";
import { apiService } from "../../Services/ApiServices";
import { Button, Icon, Modal, Form } from "../common";
import FilesGridView from "./FilesGridView";
import toast from "react-hot-toast";

interface FileManagerProps {
  initialFolderId?: number;
}

const FileManager: React.FC<FileManagerProps> = ({ initialFolderId }) => {
  const [currentFolderId, setCurrentFolderId] = useState<number | null>(
    initialFolderId || null
  );
  const [currentFolder, setCurrentFolder] = useState<Folder | null>(null);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [files, setFiles] = useState<FileEntity[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setUploading] = useState(false);
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingFile, setEditingFile] = useState<FileEntity | null>(null);
  const [showEditFileModal, setShowEditFileModal] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {}
  );

  const fetchFolderContents = useCallback(async (folderId: number | null) => {
    try {
      setLoading(true);

      // Fetch current folder info if we have an ID
      if (folderId) {
        const folderInfo = await apiService.get<Folder>(`/folder/${folderId}`);
        setCurrentFolder(folderInfo);

        // Fetch breadcrumbs
        const breadcrumbsData = await apiService.get<Folder[]>(
          `/folder/${folderId}/breadcrumbs`
        );
        setBreadcrumbs(breadcrumbsData);
      } else {
        setCurrentFolder(null);
        setBreadcrumbs([]);
      }

      // Fetch subfolders
      const params = new URLSearchParams();
      if (folderId) {
        params.append("parentFolderId", folderId.toString());
      }

      try {
        const foldersResult = await apiService.get<PagedResult<Folder>>(
          `/folder?${params.toString()}`
        );
        setFolders(foldersResult.items || []);
      } catch (error) {
        // Fallback to direct array response
        const foldersArray = await apiService.get<Folder[]>(
          `/folder/all?${params.toString()}`
        );
        setFolders(foldersArray);
      }

      // Fetch files in current folder
      const fileParams = new URLSearchParams({
        page: "1",
        pageSize: "100",
      });
      if (folderId) {
        fileParams.append("folderId", folderId.toString());
      } else {
        fileParams.append("folderId", ""); // Root level files
      }

      try {
        const filesResult = await apiService.get<PagedResult<FileEntity>>(
          `/file?${fileParams.toString()}`
        );
        setFiles(filesResult.items || []);
      } catch (error) {
        console.warn("Could not fetch files:", error);
        setFiles([]);
      }
    } catch (error) {
      console.error("Error fetching folder contents:", error);
      toast.error("Failed to load folder contents");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFolderContents(currentFolderId);
  }, [currentFolderId, fetchFolderContents]);

  const navigateToFolder = (folderId: number | null) => {
    setCurrentFolderId(folderId);
  };

  const navigateToBreadcrumb = (folder: Folder | null) => {
    if (folder) {
      setCurrentFolderId(folder.id);
    } else {
      setCurrentFolderId(null);
    }
  };

  const handleCreateFolder = async (formData: any) => {
    try {
      const createData = {
        ...formData,
        parentFolderId: currentFolderId,
        folderType: formData.folderType || "General",
      };

      await apiService.post<Folder>("/folder", createData);
      toast.success("Folder created successfully");
      setShowCreateFolderModal(false);
      fetchFolderContents(currentFolderId);
    } catch (error: any) {
      console.error("Error creating folder:", error);
      toast.error(error.response?.data?.message || "Failed to create folder");
    }
  };

  const handleDeleteFolder = async (folder: Folder) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the folder "${folder.name}"? This will also delete all files and subfolders within it.`
      )
    ) {
      return;
    }

    try {
      await apiService.delete(`/folder/${folder.id}?deleteFiles=true`);
      toast.success("Folder deleted successfully");
      fetchFolderContents(currentFolderId);
    } catch (error: any) {
      console.error("Error deleting folder:", error);
      toast.error(error.response?.data?.message || "Failed to delete folder");
    }
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setUploading(true);

      for (const file of acceptedFiles) {
        try {
          const additionalData: Record<string, string> = {
            isPublic: "true",
            generateThumbnail: "true",
          };

          if (currentFolderId) {
            additionalData.folderId = currentFolderId.toString();
          }

          await apiService.uploadFile<FileEntity>(
            "/file/upload",
            file,
            (progress) => {
              setUploadProgress((prev) => ({
                ...prev,
                [file.name]: progress,
              }));
            },
            additionalData
          );

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
      setShowUploadModal(false);
      fetchFolderContents(currentFolderId);
    },
    [currentFolderId, fetchFolderContents]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  const handleEditFile = (file: FileEntity) => {
    setEditingFile(file);
    setShowEditFileModal(true);
  };

  const handleDeleteFile = async (file: FileEntity) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${file.originalFileName}"?`
      )
    ) {
      return;
    }

    try {
      await apiService.delete(`/file/${file.id}`);
      toast.success("File deleted successfully");
      fetchFolderContents(currentFolderId);
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Failed to delete file");
    }
  };

  const handleDownloadFile = (file: FileEntity) => {
    const downloadUrl = apiService.getDownloadUrl(`/file/${file.id}/download`);

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = file.originalFileName;
    link.target = "_blank";
    link.style.display = "none";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Download started");
  };

  const handleUpdateFile = async (formData: any) => {
    if (!editingFile) return;

    try {
      await apiService.put<FileEntity>(`/file/${editingFile.id}`, formData);
      toast.success("File updated successfully");
      setShowEditFileModal(false);
      setEditingFile(null);
      fetchFolderContents(currentFolderId);
    } catch (error) {
      console.error("Error updating file:", error);
      toast.error("Failed to update file");
    }
  };

  const createFolderFields = [
    {
      name: "name",
      label: "Folder Name",
      type: "text" as const,
      required: true,
      validation: { required: "Folder name is required" },
    },
    {
      name: "description",
      label: "Description",
      type: "textarea" as const,
      rows: 3,
    },
    {
      name: "folderType",
      label: "Folder Type",
      type: "select" as const,
      required: true,
      options: [
        { value: "General", label: "General" },
        { value: "Images", label: "Images" },
        { value: "Documents", label: "Documents" },
        { value: "Videos", label: "Videos" },
        { value: "Audio", label: "Audio" },
        { value: "Temporary", label: "Temporary" },
      ],
      validation: { required: "Folder type is required" },
    },
    {
      name: "isPublic",
      label: "Public",
      type: "checkbox" as const,
    },
  ];

  const editFileFields = [
    {
      name: "description",
      label: "Description",
      type: "textarea" as const,
      rows: 3,
    },
    {
      name: "alt",
      label: "Alt Text",
      type: "text" as const,
      description: "Alternative text for images",
    },
    {
      name: "isPublic",
      label: "Public",
      type: "checkbox" as const,
    },
  ];

  const getCurrentPath = () => {
    if (breadcrumbs.length === 0) return "/";
    return "/" + breadcrumbs.map((b) => b.name).join("/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Icon name="spinner" size="2xl" spin className="text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Breadcrumbs */}
      <div className="flex flex-col space-y-4">
        {/* Breadcrumbs */}
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <button
                onClick={() => navigateToBreadcrumb(null)}
                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
              >
                <Icon name="home" size="sm" className="mr-2" />
                Root
              </button>
            </li>
            {breadcrumbs.map((folder, index) => (
              <li key={folder.id}>
                <div className="flex items-center">
                  <Icon
                    name="chevron-right"
                    size="sm"
                    className="text-gray-400 mx-1"
                  />
                  <button
                    onClick={() => navigateToBreadcrumb(folder)}
                    className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white md:ml-2"
                  >
                    {folder.name}
                  </button>
                </div>
              </li>
            ))}
          </ol>
        </nav>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {currentFolder ? currentFolder.name : "File Manager"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Current path: {getCurrentPath()}
            </p>
          </div>

          <div className="flex items-center space-x-3">
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
                List
              </Button>
            </div>

            <Button
              onClick={() => setShowCreateFolderModal(true)}
              leftIcon="folder"
              variant="outline"
            >
              New Folder
            </Button>

            <Button onClick={() => setShowUploadModal(true)} leftIcon="upload">
              Upload Files
            </Button>
          </div>
        </div>
      </div>

      {/* Folder Contents */}
      <div className="grid grid-cols-1 gap-6">
        {/* Folders */}
        {folders.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Folders
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {folders.map((folder) => (
                <div
                  key={folder.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow duration-200 overflow-hidden group cursor-pointer"
                  onDoubleClick={() => navigateToFolder(folder.id)}
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div
                        className="flex items-center flex-1"
                        onClick={() => navigateToFolder(folder.id)}
                      >
                        <Icon
                          name="folder"
                          size="2xl"
                          className="text-blue-500 mr-3"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {folder.name}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {folder.fileCount} files
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="xs"
                          variant="ghost"
                          leftIcon="trash"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFolder(folder);
                          }}
                          className="!p-1 text-red-600 hover:text-red-700"
                        >
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Files */}
        {files.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Files
            </h3>
            <FilesGridView
              files={files}
              loading={false}
              onEdit={handleEditFile}
              onDelete={handleDeleteFile}
              onDownload={handleDownloadFile}
            />
          </div>
        )}

        {/* Empty State */}
        {folders.length === 0 && files.length === 0 && (
          <div className="text-center py-12">
            <Icon
              name="folder"
              size="2xl"
              className="mx-auto text-gray-400 mb-4"
            />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              This folder is empty
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Get started by creating a new folder or uploading some files.
            </p>
            <div className="flex justify-center space-x-3">
              <Button
                onClick={() => setShowCreateFolderModal(true)}
                leftIcon="folder"
                variant="outline"
              >
                Create Folder
              </Button>
              <Button
                onClick={() => setShowUploadModal(true)}
                leftIcon="upload"
              >
                Upload Files
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Create Folder Modal */}
      <Modal
        isOpen={showCreateFolderModal}
        onClose={() => setShowCreateFolderModal(false)}
        title="Create New Folder"
        size="md"
      >
        <Form
          fields={createFolderFields}
          onSubmit={handleCreateFolder}
          submitLabel="Create Folder"
          onCancel={() => setShowCreateFolderModal(false)}
        />
      </Modal>

      {/* Upload Files Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
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
                  Files will be uploaded to: <strong>{getCurrentPath()}</strong>
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

      {/* Edit File Modal */}
      <Modal
        isOpen={showEditFileModal}
        onClose={() => setShowEditFileModal(false)}
        title="Edit File"
        size="lg"
      >
        {editingFile && (
          <Form
            fields={editFileFields}
            onSubmit={handleUpdateFile}
            defaultValues={editingFile}
            submitLabel="Update File"
            onCancel={() => setShowEditFileModal(false)}
          />
        )}
      </Modal>
    </div>
  );
};

export default FileManager;

import React from "react";
import {
  User,
  Page,
  Location,
  FileEntity,
  Folder,
  UserRole,
  PageStatus,
  FolderType,
} from "../types";
import { EntityManagerConfig } from "../components/ui/EntityManager";
import { format } from "date-fns";

// User Entity Configuration
export const userEntityConfig: EntityManagerConfig<User> = {
  entityName: "User",
  entityNamePlural: "Users",
  apiEndpoint: "/users",
  columns: [
    {
      key: "firstName",
      label: "Name",
      render: (_, user) => `${user.firstName} ${user.lastName}`,
    },
    {
      key: "email",
      label: "Email",
    },
    {
      key: "username",
      label: "Username",
    },
    {
      key: "role",
      label: "Role",
      render: (role) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            role === UserRole.Admin
              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
              : role === UserRole.Dev
              ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
              : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
          }`}
        >
          {UserRole[role]}
        </span>
      ),
    },
    {
      key: "isActive",
      label: "Status",
      render: (isActive) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            isActive
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
          }`}
        >
          {isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      render: (date) => format(new Date(date), "MMM dd, yyyy"),
    },
  ],
  formFields: [
    {
      name: "firstName",
      label: "First Name",
      type: "text",
      required: true,
      validation: { required: "First name is required" },
    },
    {
      name: "lastName",
      label: "Last Name",
      type: "text",
      required: true,
      validation: { required: "Last name is required" },
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      required: true,
      validation: {
        required: "Email is required",
        pattern: {
          value: /^\S+@\S+$/i,
          message: "Invalid email address",
        },
      },
    },
    {
      name: "username",
      label: "Username",
      type: "text",
      required: true,
      validation: { required: "Username is required" },
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      required: true,
      validation: {
        required: "Password is required",
        minLength: {
          value: 8,
          message: "Password must be at least 8 characters",
        },
      },
    },
    {
      name: "role",
      label: "Role",
      type: "select",
      required: true,
      options: [
        { value: UserRole.Customer, label: "Customer" },
        { value: UserRole.Admin, label: "Admin" },
        { value: UserRole.Dev, label: "Developer" },
      ],
      validation: { required: "Role is required" },
    },
    {
      name: "isActive",
      label: "Active",
      type: "checkbox",
    },
    {
      name: "timezone",
      label: "Timezone",
      type: "text",
      placeholder: "UTC",
    },
    {
      name: "language",
      label: "Language",
      type: "text",
      placeholder: "en",
    },
  ],
  transformDataForForm: (user) => ({
    ...user,
    password: "", // Don't populate password field
  }),
  transformDataForApi: (data) => {
    const transformed = { ...data };
    if (!transformed.password) {
      delete transformed.password; // Don't send empty password
    }
    return transformed;
  },
};

// Page Entity Configuration
export const pageEntityConfig: EntityManagerConfig<Page> = {
  entityName: "Page",
  entityNamePlural: "Pages",
  apiEndpoint: "/pages",
  columns: [
    {
      key: "name",
      label: "Name",
    },
    {
      key: "title",
      label: "Title",
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
      key: "status",
      label: "Status",
      render: (status) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            status === PageStatus.Published
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : status === PageStatus.Draft
              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
              : status === PageStatus.Archived
              ? "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
              : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
          }`}
        >
          {PageStatus[status]}
        </span>
      ),
    },
    {
      key: "publishedOn",
      label: "Published",
      render: (date) => (date ? format(new Date(date), "MMM dd, yyyy") : "-"),
    },
  ],
  formFields: [
    {
      name: "name",
      label: "Page Name",
      type: "text",
      required: true,
      validation: { required: "Page name is required" },
    },
    {
      name: "title",
      label: "Page Title",
      type: "text",
      required: true,
      validation: { required: "Page title is required" },
    },
    {
      name: "slug",
      label: "URL Slug",
      type: "text",
      required: true,
      validation: { required: "URL slug is required" },
      description: "URL-friendly version of the page name",
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      rows: 3,
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      required: true,
      options: [
        { value: PageStatus.Draft, label: "Draft" },
        { value: PageStatus.Published, label: "Published" },
        { value: PageStatus.Archived, label: "Archived" },
        { value: PageStatus.Scheduled, label: "Scheduled" },
      ],
      validation: { required: "Status is required" },
    },
    {
      name: "metaTitle",
      label: "Meta Title",
      type: "text",
      description: "SEO title for search engines",
    },
    {
      name: "metaDescription",
      label: "Meta Description",
      type: "textarea",
      rows: 2,
      description: "SEO description for search engines",
    },
    {
      name: "metaKeywords",
      label: "Meta Keywords",
      type: "text",
      description: "Comma-separated keywords for SEO",
    },
    {
      name: "requiresLogin",
      label: "Requires Login",
      type: "checkbox",
    },
    {
      name: "adminOnly",
      label: "Admin Only",
      type: "checkbox",
    },
  ],
};

// Location Entity Configuration
export const locationEntityConfig: EntityManagerConfig<Location> = {
  entityName: "Location",
  entityNamePlural: "Locations",
  apiEndpoint: "/locations",
  columns: [
    {
      key: "name",
      label: "Name",
    },
    {
      key: "locationCode",
      label: "Code",
    },
    {
      key: "locationType",
      label: "Type",
    },
    {
      key: "isMainLocation",
      label: "Main",
      render: (isMain) =>
        isMain ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            Main
          </span>
        ) : null,
    },
    {
      key: "isActive",
      label: "Status",
      render: (isActive) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            isActive
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
          }`}
        >
          {isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
  ],
  formFields: [
    {
      name: "name",
      label: "Location Name",
      type: "text",
      required: true,
      validation: { required: "Location name is required" },
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      rows: 3,
    },
    {
      name: "locationCode",
      label: "Location Code",
      type: "text",
      description: "Unique identifier for this location",
    },
    {
      name: "locationType",
      label: "Location Type",
      type: "select",
      required: true,
      options: [
        { value: "Branch", label: "Branch" },
        { value: "Headquarters", label: "Headquarters" },
        { value: "Warehouse", label: "Warehouse" },
        { value: "Office", label: "Office" },
        { value: "Store", label: "Store" },
      ],
      validation: { required: "Location type is required" },
    },
    {
      name: "isMainLocation",
      label: "Main Location",
      type: "checkbox",
    },
    {
      name: "isActive",
      label: "Active",
      type: "checkbox",
    },
  ],
};

// File Entity Configuration
export const fileEntityConfig: EntityManagerConfig<FileEntity> = {
  entityName: "File",
  entityNamePlural: "Files",
  apiEndpoint: "/files",
  canCreate: false, // Files are uploaded, not created via form
  columns: [
    {
      key: "originalFileName",
      label: "Name",
      render: (fileName, file) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-8 w-8">
            {file.fileType === 1 ? ( // Image
              <img
                src={file.thumbnailUrl || file.fileUrl}
                alt={file.alt || fileName}
                className="h-8 w-8 object-cover rounded"
              />
            ) : (
              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  {file.fileExtension.replace(".", "").toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {fileName}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {file.fileSizeFormatted}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "fileType",
      label: "Type",
      render: (type) => {
        const typeNames = [
          "Document",
          "Image",
          "Video",
          "Audio",
          "Archive",
          "Other",
        ];
        return typeNames[type] || "Unknown";
      },
    },
    {
      key: "isPublic",
      label: "Visibility",
      render: (isPublic) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            isPublic
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
          }`}
        >
          {isPublic ? "Public" : "Private"}
        </span>
      ),
    },
    {
      key: "downloadCount",
      label: "Downloads",
    },
    {
      key: "createdAt",
      label: "Uploaded",
      render: (date) => format(new Date(date), "MMM dd, yyyy"),
    },
  ],
  formFields: [
    {
      name: "description",
      label: "Description",
      type: "textarea",
      rows: 3,
    },
    {
      name: "alt",
      label: "Alt Text",
      type: "text",
      description: "Alternative text for images",
    },
    {
      name: "isPublic",
      label: "Public",
      type: "checkbox",
    },
  ],
};

// Folder Entity Configuration
export const folderEntityConfig: EntityManagerConfig<Folder> = {
  entityName: "Folder",
  entityNamePlural: "Folders",
  apiEndpoint: "/folders",
  columns: [
    {
      key: "name",
      label: "Name",
      render: (name, folder) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-8 w-8 text-blue-500">📁</div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {name}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {folder.fileCount} files, {folder.subFolderCount} folders
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "path",
      label: "Path",
      render: (path) => (
        <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
          {path}
        </code>
      ),
    },
    {
      key: "folderType",
      label: "Type",
      render: (type) => {
        const typeNames = [
          "General",
          "Images",
          "Documents",
          "Videos",
          "Audio",
          "User Avatars",
          "Company Assets",
          "Temporary",
        ];
        return typeNames[type] || "Unknown";
      },
    },
    {
      key: "totalSizeFormatted",
      label: "Size",
    },
    {
      key: "isPublic",
      label: "Visibility",
      render: (isPublic) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            isPublic
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
          }`}
        >
          {isPublic ? "Public" : "Private"}
        </span>
      ),
    },
  ],
  formFields: [
    {
      name: "name",
      label: "Folder Name",
      type: "text",
      required: true,
      validation: { required: "Folder name is required" },
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      rows: 3,
    },
    {
      name: "folderType",
      label: "Folder Type",
      type: "select",
      required: true,
      options: [
        { value: FolderType.General, label: "General" },
        { value: FolderType.Images, label: "Images" },
        { value: FolderType.Documents, label: "Documents" },
        { value: FolderType.Videos, label: "Videos" },
        { value: FolderType.Audio, label: "Audio" },
        { value: FolderType.UserAvatars, label: "User Avatars" },
        { value: FolderType.CompanyAssets, label: "Company Assets" },
        { value: FolderType.Temporary, label: "Temporary" },
      ],
      validation: { required: "Folder type is required" },
    },
    {
      name: "isPublic",
      label: "Public",
      type: "checkbox",
    },
  ],
};

import { EntityManagerConfig } from "../../components/entities/EntityManager";
import { Folder, FolderType, FormField } from "../../types";
import {
  createCheckboxField,
  createSelectField,
  createTextAreaField,
  createTextField,
} from "../../utils/formFieldHelpers";

export const folderEntityConfig: EntityManagerConfig<Folder> = {
  entityName: "Folder",
  apiEndpoint: "/folder",
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
      render: (type: keyof typeof FolderType) => {
        const typeNames: Record<string, string> = {
          General: "General",
          Images: "Images",
          Documents: "Documents",
          Videos: "Videos",
          Audio: "Audio",
          UserAvatars: "User Avatars",
          CompanyAssets: "Company Assets",
          Temporary: "Temporary",
        };
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
    createTextField("name", "Folder Name", {
      required: true,
      validation: { required: "Folder name is required" },
    }),
    createTextAreaField("description", "Description", 3),
    createSelectField(
      "folderType",
      "Folder Type",
      [
        { value: "General", label: "General" },
        { value: "Images", label: "Images" },
        { value: "Documents", label: "Documents" },
        { value: "Videos", label: "Videos" },
        { value: "Audio", label: "Audio" },
        { value: "UserAvatars", label: "User Avatars" },
        { value: "CompanyAssets", label: "Company Assets" },
        { value: "Temporary", label: "Temporary" },
      ],
      {
        required: true,
        validation: { required: "Folder type is required" },
      }
    ),
    createCheckboxField("isPublic", "Public"),
  ] as FormField[], // Cast to FormField[]
  transformDataForApi: (data) => {
    return {
      ...data,
      folderType: data.folderType || "General",
    };
  },
};

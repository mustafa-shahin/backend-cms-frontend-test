import { EntityManagerConfig } from "../../components/entities/EntityManager";
import { FileEntity, FormField } from "../../types";
import {
  createCheckboxField,
  createTextAreaField,
  createTextField,
} from "../../utils/formFieldHelpers";
import { format } from "date-fns";
import { FileType } from "../../types/enums";

export const fileEntityConfig: EntityManagerConfig<FileEntity> = {
  entityName: "File",
  apiEndpoint: "/file",
  canCreate: false,
  columns: [
    {
      key: "originalFileName",
      label: "Name",
      render: (fileName, file) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-8 w-8">
            {file.fileType === FileType.Image ? (
              file.thumbnailUrl ? (
                <img
                  src={file.thumbnailUrl}
                  alt={file.alt || fileName}
                  className="h-8 w-8 object-cover rounded"
                />
              ) : (
                <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    IMG
                  </span>
                </div>
              )
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
    createTextAreaField("description", "Description", 3),
    createTextField("alt", "Alt Text", {
      description: "Alternative text for images",
    }),
    createCheckboxField("isPublic", "Public"),
  ] as FormField[], // Cast to FormField[]
};

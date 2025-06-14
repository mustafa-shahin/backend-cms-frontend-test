import { EntityManagerConfig } from "../../components/entities/EntityManager";
import { FormField } from "../../types";
import {
  createAddressFields,
  createCheckboxField,
  createContactDetailsFields,
  createSelectField,
  createTextAreaField,
  createTextField,
} from "../../utils/formFieldHelpers";
import { Locations } from "../../types/Location";
import {
  transformDataForApi,
  transformDataForForm,
} from "./transformFunctions";

export const locationEntityConfig: EntityManagerConfig<Locations> = {
  entityName: "Location",
  apiEndpoint: "/location",
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
    createTextField("name", "Location Name", {
      required: true,
      validation: { required: "Location name is required" },
    }),
    createTextAreaField("description", "Description", 3),
    createTextField("locationCode", "Location Code", {
      description: "Unique identifier for this location",
    }),
    createSelectField(
      "locationType",
      "Location Type",
      [
        { value: "Branch", label: "Branch" },
        { value: "Headquarters", label: "Headquarters" },
        { value: "Warehouse", label: "Warehouse" },
        { value: "Office", label: "Office" },
        { value: "Store", label: "Store" },
      ],
      {
        required: true,
        validation: { required: "Location type is required" },
      }
    ),
    createCheckboxField("isMainLocation", "Main Location"),
    createCheckboxField("isActive", "Active"),

    // Address Fields
    ...createAddressFields(),

    // Contact Details Fields
    ...createContactDetailsFields(),
  ] as FormField[], // Cast to FormField[]
  transformDataForForm,
  transformDataForApi,
};

import { EntityManagerConfig } from "../../components/entities/EntityManager";
import { Company, FormField } from "../../types";
import {
  createAddressFields,
  createContactDetailsFields,
  createSelectField,
  createTextAreaField,
  createTextField,
} from "../../utils/formFieldHelpers";
import {
  transformDataForApi,
  transformDataForForm,
} from "./transformFunctions";

export const companyEntityConfig: EntityManagerConfig<Company> = {
  entityName: "Company",
  apiEndpoint: "/company",
  canCreate: false,
  canDelete: false,
  columns: [
    {
      key: "name",
      label: "Company Name",
    },
    {
      key: "description",
      label: "Description",
    },
    {
      key: "currency",
      label: "Currency",
    },
    {
      key: "language",
      label: "Language",
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
    createTextField("name", "Company Name", {
      required: true,
      validation: { required: "Company name is required" },
    }),
    createTextAreaField("description", "Description", 3),
    createTextField("logo", "Logo URL", {
      description: "URL to the company logo image",
    }),
    createTextField("favicon", "Favicon URL", {
      description: "URL to the company favicon",
    }),
    createSelectField("timezone", "Timezone", [
      { value: "UTC", label: "UTC" },
      { value: "America/New_York", label: "Eastern Time" },
      { value: "America/Chicago", label: "Central Time" },
      { value: "America/Denver", label: "Mountain Time" },
      { value: "America/Los_Angeles", label: "Pacific Time" },
      { value: "Europe/London", label: "London" },
      { value: "Europe/Paris", label: "Paris" },
      { value: "Europe/Berlin", label: "Berlin" },
      { value: "Asia/Tokyo", label: "Tokyo" },
      { value: "Asia/Shanghai", label: "Shanghai" },
      { value: "Australia/Sydney", label: "Sydney" },
    ]),
    createSelectField("currency", "Currency", [
      { value: "USD", label: "US Dollar (USD)" },
      { value: "EUR", label: "Euro (EUR)" },
      { value: "GBP", label: "British Pound (GBP)" },
      { value: "JPY", label: "Japanese Yen (JPY)" },
      { value: "CAD", label: "Canadian Dollar (CAD)" },
      { value: "AUD", label: "Australian Dollar (AUD)" },
    ]),
    createSelectField("language", "Default Language", [
      { value: "en", label: "English" },
      { value: "es", label: "Spanish" },
      { value: "fr", label: "French" },
      { value: "de", label: "German" },
      { value: "it", label: "Italian" },
      { value: "ja", label: "Japanese" },
      { value: "zh", label: "Chinese" },
    ]),

    // Address Fields
    ...createAddressFields(),

    // Contact Details Fields
    ...createContactDetailsFields(),
  ] as FormField[], // Cast to FormField[]
  transformDataForForm,
  transformDataForApi,
};

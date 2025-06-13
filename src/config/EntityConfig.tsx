import { User } from "../types/User";
import { Page } from "../types/Page";
import { Company } from "../types/Company";
import { FileEntity } from "../types/FileEntity";
import { Folder } from "../types/Folder";
import { Location } from "../types/Location";
import { EntityManagerConfig } from "../components/entities/EntityManager";
import { format } from "date-fns";
import {
  FileType,
  FolderType,
  PageStatus,
  UserRole,
  ProductStatus,
  ProductType,
} from "../types/enums";
import { Product, Category, ProductVariant } from "../types/Product";
const createAddressFields = () => [
  {
    name: "addresses.0.street",
    label: "Street Address",
    type: "text" as const,
    required: true,
    validation: { required: "Street address is required" },
  },
  {
    name: "addresses.0.street2",
    label: "Street Address 2",
    type: "text" as const,
    placeholder: "Apartment, suite, etc.",
  },
  {
    name: "addresses.0.city",
    label: "City",
    type: "text" as const,
    required: true,
    validation: { required: "City is required" },
  },
  {
    name: "addresses.0.state",
    label: "State/Province",
    type: "text" as const,
    required: true,
    validation: { required: "State/Province is required" },
  },
  {
    name: "addresses.0.country",
    label: "Country",
    type: "text" as const,
    required: true,
    validation: { required: "Country is required" },
  },
  {
    name: "addresses.0.postalCode",
    label: "Postal Code",
    type: "text" as const,
    required: true,
    validation: { required: "Postal code is required" },
  },
  {
    name: "addresses.0.region",
    label: "Region",
    type: "text" as const,
  },
  {
    name: "addresses.0.district",
    label: "District",
    type: "text" as const,
  },
  {
    name: "addresses.0.addressType",
    label: "Address Type",
    type: "select" as const,
    options: [
      { value: "Home", label: "Home" },
      { value: "Work", label: "Work" },
      { value: "Office", label: "Office" },
      { value: "Main", label: "Main" },
      { value: "Billing", label: "Billing" },
      { value: "Shipping", label: "Shipping" },
    ],
  },
  {
    name: "addresses.0.isDefault",
    label: "Default Address",
    type: "checkbox" as const,
  },
  {
    name: "addresses.0.notes",
    label: "Address Notes",
    type: "textarea" as const,
    rows: 2,
  },
];

// Helper function to create contact details fields with proper nested naming
const createContactDetailsFields = () => [
  {
    name: "contactDetails.0.primaryPhone",
    label: "Primary Phone",
    type: "text" as const,
    placeholder: "+1 (555) 123-4567",
  },
  {
    name: "contactDetails.0.secondaryPhone",
    label: "Secondary Phone",
    type: "text" as const,
    placeholder: "+1 (555) 123-4567",
  },
  {
    name: "contactDetails.0.mobile",
    label: "Mobile Phone",
    type: "text" as const,
    placeholder: "+1 (555) 123-4567",
  },
  {
    name: "contactDetails.0.fax",
    label: "Fax",
    type: "text" as const,
    placeholder: "+1 (555) 123-4567",
  },
  {
    name: "contactDetails.0.email",
    label: "Contact Email",
    type: "email" as const,
    validation: {
      pattern: {
        value: /^\S+@\S+$/i,
        message: "Invalid email address",
      },
    },
  },
  {
    name: "contactDetails.0.secondaryEmail",
    label: "Secondary Email",
    type: "email" as const,
    validation: {
      pattern: {
        value: /^\S+@\S+$/i,
        message: "Invalid email address",
      },
    },
  },
  {
    name: "contactDetails.0.website",
    label: "Website",
    type: "text" as const,
    placeholder: "https://example.com",
  },
  {
    name: "contactDetails.0.linkedInProfile",
    label: "LinkedIn Profile",
    type: "text" as const,
    placeholder: "https://linkedin.com/in/username",
  },
  {
    name: "contactDetails.0.twitterProfile",
    label: "Twitter Profile",
    type: "text" as const,
    placeholder: "https://twitter.com/username",
  },
  {
    name: "contactDetails.0.facebookProfile",
    label: "Facebook Profile",
    type: "text" as const,
    placeholder: "https://facebook.com/username",
  },
  {
    name: "contactDetails.0.instagramProfile",
    label: "Instagram Profile",
    type: "text" as const,
    placeholder: "https://instagram.com/username",
  },
  {
    name: "contactDetails.0.whatsAppNumber",
    label: "WhatsApp Number",
    type: "text" as const,
    placeholder: "+1 (555) 123-4567",
  },
  {
    name: "contactDetails.0.telegramHandle",
    label: "Telegram Handle",
    type: "text" as const,
    placeholder: "@username",
  },
  {
    name: "contactDetails.0.contactType",
    label: "Contact Type",
    type: "select" as const,
    options: [
      { value: "Personal", label: "Personal" },
      { value: "Business", label: "Business" },
      { value: "Work", label: "Work" },
      { value: "Emergency", label: "Emergency" },
    ],
  },
  {
    name: "contactDetails.0.isDefault",
    label: "Default Contact",
    type: "checkbox" as const,
  },
];

// Transform functions for proper nested data structure
const transformDataForForm = (data: any) => {
  console.log("=== TRANSFORM FOR FORM ===");
  console.log("Original data:", data);

  const transformed = {
    ...data,
    addresses:
      data.addresses?.length > 0
        ? data.addresses.map((addr: any) => ({
            ...addr,
            // Convert null values to empty strings for text inputs
            street: addr.street || "",
            street2: addr.street2 || "",
            city: addr.city || "",
            state: addr.state || "",
            country: addr.country || "",
            postalCode: addr.postalCode || "",
            region: addr.region || "",
            district: addr.district || "",
            addressType: addr.addressType || "",
            notes: addr.notes || "",
            isDefault: addr.isDefault || false,
          }))
        : [{}],
    contactDetails:
      data.contactDetails?.length > 0
        ? data.contactDetails.map((contact: any) => ({
            ...contact,
            // Convert null values to empty strings for text inputs
            primaryPhone: contact.primaryPhone || "",
            secondaryPhone: contact.secondaryPhone || "",
            mobile: contact.mobile || "",
            fax: contact.fax || "",
            email: contact.email || "",
            secondaryEmail: contact.secondaryEmail || "",
            website: contact.website || "",
            linkedInProfile: contact.linkedInProfile || "",
            twitterProfile: contact.twitterProfile || "",
            facebookProfile: contact.facebookProfile || "",
            instagramProfile: contact.instagramProfile || "",
            whatsAppNumber: contact.whatsAppNumber || "",
            telegramHandle: contact.telegramHandle || "",
            contactType: contact.contactType || "",
            isDefault: contact.isDefault || false,
            additionalContacts: contact.additionalContacts || {},
          }))
        : [{}],
  };

  console.log("Transformed data:", transformed);
  console.log("Addresses in transformed:", transformed.addresses);
  console.log("Contact details in transformed:", transformed.contactDetails);
  console.log("=== END TRANSFORM ===");

  return transformed;
};

const transformDataForApi = (data: any) => {
  console.log("=== TRANSFORM FOR API ===");
  console.log("Form data:", data);

  const transformed = { ...data };

  // Clean up addresses - remove empty ones
  if (transformed.addresses) {
    transformed.addresses = transformed.addresses.filter(
      (addr: any) => addr.street || addr.city || addr.state || addr.country
    );
    if (transformed.addresses.length === 0) {
      delete transformed.addresses;
    }
  }

  // Clean up contact details - remove empty ones
  if (transformed.contactDetails) {
    transformed.contactDetails = transformed.contactDetails.filter(
      (contact: any) => contact.primaryPhone || contact.email || contact.website
    );
    if (transformed.contactDetails.length === 0) {
      delete transformed.contactDetails;
    }
  }

  console.log("API data:", transformed);
  console.log("=== END API TRANSFORM ===");

  return transformed;
};

export const userEntityConfig: EntityManagerConfig<User> = {
  entityName: "User",
  apiEndpoint: "/user",
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
    // Basic User Information
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

    // Address Fields
    ...createAddressFields(),

    // Contact Details Fields
    ...createContactDetailsFields(),
  ],
  transformDataForForm,
  transformDataForApi,
};

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
    {
      name: "name",
      label: "Company Name",
      type: "text",
      required: true,
      validation: { required: "Company name is required" },
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      rows: 3,
    },
    {
      name: "logo",
      label: "Logo URL",
      type: "text",
      description: "URL to the company logo image",
    },
    {
      name: "favicon",
      label: "Favicon URL",
      type: "text",
      description: "URL to the company favicon",
    },
    {
      name: "timezone",
      label: "Timezone",
      type: "select",
      options: [
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
      ],
    },
    {
      name: "currency",
      label: "Currency",
      type: "select",
      options: [
        { value: "USD", label: "US Dollar (USD)" },
        { value: "EUR", label: "Euro (EUR)" },
        { value: "GBP", label: "British Pound (GBP)" },
        { value: "JPY", label: "Japanese Yen (JPY)" },
        { value: "CAD", label: "Canadian Dollar (CAD)" },
        { value: "AUD", label: "Australian Dollar (AUD)" },
      ],
    },
    {
      name: "language",
      label: "Default Language",
      type: "select",
      options: [
        { value: "en", label: "English" },
        { value: "es", label: "Spanish" },
        { value: "fr", label: "French" },
        { value: "de", label: "German" },
        { value: "it", label: "Italian" },
        { value: "ja", label: "Japanese" },
        { value: "zh", label: "Chinese" },
      ],
    },

    // Address Fields
    ...createAddressFields(),

    // Contact Details Fields
    ...createContactDetailsFields(),
  ],
  transformDataForForm,
  transformDataForApi,
};

export const locationEntityConfig: EntityManagerConfig<Location> = {
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

    // Address Fields
    ...createAddressFields(),

    // Contact Details Fields
    ...createContactDetailsFields(),
  ],
  transformDataForForm,
  transformDataForApi,
};

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
        { value: "General", label: "General" },
        { value: "Images", label: "Images" },
        { value: "Documents", label: "Documents" },
        { value: "Videos", label: "Videos" },
        { value: "Audio", label: "Audio" },
        { value: "UserAvatars", label: "User Avatars" },
        { value: "CompanyAssets", label: "Company Assets" },
        { value: "Temporary", label: "Temporary" },
      ],
      validation: { required: "Folder type is required" },
    },
    {
      name: "isPublic",
      label: "Public",
      type: "checkbox",
    },
  ],
  transformDataForApi: (data) => {
    return {
      ...data,
      folderType: data.folderType || "General",
    };
  },
};

export const pageEntityConfig: EntityManagerConfig<Page> = {
  entityName: "Page",
  apiEndpoint: "/page",
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
export const productEntityConfig: EntityManagerConfig<Product> = {
  entityName: "Product",
  apiEndpoint: "/product",
  columns: [
    {
      key: "name",
      label: "Name",
      render: (name, product) => (
        <div className="flex items-center">
          {product.featuredImage && (
            <div className="flex-shrink-0 h-10 w-10 mr-3">
              <img
                src={product.featuredImage}
                alt={name}
                className="h-10 w-10 object-cover rounded"
              />
            </div>
          )}
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {name}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              SKU: {product.sku}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "price",
      label: "Price",
      render: (price, product) => (
        <div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            ${price.toFixed(2)}
          </div>
          {product.compareAtPrice && product.compareAtPrice > price && (
            <div className="text-sm text-gray-500 dark:text-gray-400 line-through">
              ${product.compareAtPrice.toFixed(2)}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (status) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            status === ProductStatus.Active
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : status === ProductStatus.Draft
              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
              : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
          }`}
        >
          {ProductStatus[status]}
        </span>
      ),
    },
    {
      key: "type",
      label: "Type",
      render: (type) => (
        <span className="text-sm text-gray-900 dark:text-white">
          {ProductType[type]}
        </span>
      ),
    },
    {
      key: "quantity",
      label: "Stock",
      render: (quantity, product) => (
        <div>
          <span
            className={`text-sm font-medium ${
              quantity === 0
                ? "text-red-600 dark:text-red-400"
                : quantity < 10
                ? "text-yellow-600 dark:text-yellow-400"
                : "text-green-600 dark:text-green-400"
            }`}
          >
            {product.hasVariants ? "Variants" : quantity}
          </span>
        </div>
      ),
    },
    {
      key: "categories",
      label: "Categories",
      render: (categories) => (
        <div className="flex flex-wrap gap-1">
          {categories?.slice(0, 2).map((cat: any, index: number) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            >
              {cat.name}
            </span>
          ))}
          {categories?.length > 2 && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              +{categories.length - 2} more
            </span>
          )}
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      render: (date) => format(new Date(date), "MMM dd, yyyy"),
    },
  ],
  formFields: [
    // Basic Product Information
    {
      name: "name",
      label: "Product Name",
      type: "text",
      required: true,
      validation: { required: "Product name is required" },
    },
    {
      name: "slug",
      label: "URL Slug",
      type: "text",
      required: true,
      validation: { required: "URL slug is required" },
      description: "URL-friendly version of the product name",
    },
    {
      name: "sku",
      label: "SKU",
      type: "text",
      required: true,
      validation: { required: "SKU is required" },
      description: "Stock Keeping Unit - unique product identifier",
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      rows: 4,
    },
    {
      name: "shortDescription",
      label: "Short Description",
      type: "textarea",
      rows: 2,
    },

    // Pricing
    {
      name: "price",
      label: "Price",
      type: "number",
      required: true,
      min: 0,
      step: 0.01,
      validation: { required: "Price is required" },
    },
    {
      name: "compareAtPrice",
      label: "Compare at Price",
      type: "number",
      min: 0,
      step: 0.01,
      description: "Original price for showing discounts",
    },
    {
      name: "costPerItem",
      label: "Cost per Item",
      type: "number",
      min: 0,
      step: 0.01,
      description: "Cost to acquire or produce this item",
    },

    // Inventory
    {
      name: "trackQuantity",
      label: "Track Quantity",
      type: "checkbox",
    },
    {
      name: "quantity",
      label: "Quantity",
      type: "number",
      min: 0,
      validation: { min: { value: 0, message: "Quantity cannot be negative" } },
    },
    {
      name: "continueSellingWhenOutOfStock",
      label: "Continue selling when out of stock",
      type: "checkbox",
    },

    // Shipping
    {
      name: "requiresShipping",
      label: "Requires Shipping",
      type: "checkbox",
    },
    {
      name: "isPhysicalProduct",
      label: "Physical Product",
      type: "checkbox",
    },
    {
      name: "weight",
      label: "Weight",
      type: "number",
      min: 0,
      step: 0.01,
    },
    {
      name: "weightUnit",
      label: "Weight Unit",
      type: "select",
      options: [
        { value: "kg", label: "Kilograms" },
        { value: "g", label: "Grams" },
        { value: "lb", label: "Pounds" },
        { value: "oz", label: "Ounces" },
      ],
    },

    // Product Details
    {
      name: "status",
      label: "Status",
      type: "select",
      required: true,
      options: [
        { value: ProductStatus.Draft, label: "Draft" },
        { value: ProductStatus.Active, label: "Active" },
        { value: ProductStatus.Archived, label: "Archived" },
      ],
      validation: { required: "Status is required" },
    },
    {
      name: "type",
      label: "Product Type",
      type: "select",
      required: true,
      options: [
        { value: ProductType.Physical, label: "Physical" },
        { value: ProductType.Digital, label: "Digital" },
        { value: ProductType.Service, label: "Service" },
        { value: ProductType.GiftCard, label: "Gift Card" },
      ],
      validation: { required: "Product type is required" },
    },
    {
      name: "vendor",
      label: "Vendor",
      type: "text",
    },
    {
      name: "barcode",
      label: "Barcode",
      type: "text",
    },
    {
      name: "tags",
      label: "Tags",
      type: "text",
      description: "Comma-separated tags",
    },
    {
      name: "isTaxable",
      label: "Taxable",
      type: "checkbox",
    },

    // SEO
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
      name: "searchKeywords",
      label: "Search Keywords",
      type: "text",
      description: "Additional keywords for internal search",
    },
  ],
};

// Category Entity Configuration
export const categoryEntityConfig: EntityManagerConfig<Category> = {
  entityName: "Category",
  apiEndpoint: "/category",
  columns: [
    {
      key: "name",
      label: "Name",
      render: (name, category) => (
        <div className="flex items-center">
          {category.image && (
            <div className="flex-shrink-0 h-8 w-8 mr-3">
              <img
                src={category.image}
                alt={name}
                className="h-8 w-8 object-cover rounded"
              />
            </div>
          )}
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {name}
            </div>
            {category.parentCategoryName && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Parent: {category.parentCategoryName}
              </div>
            )}
          </div>
        </div>
      ),
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
      key: "productCount",
      label: "Products",
      render: (count) => (
        <span className="text-sm text-gray-900 dark:text-white">{count}</span>
      ),
    },
    {
      key: "isActive",
      label: "Status",
      render: (isActive, category) => (
        <div className="flex flex-col gap-1">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              isActive
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
            }`}
          >
            {isActive ? "Active" : "Inactive"}
          </span>
          {category.isVisible && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              Visible
            </span>
          )}
        </div>
      ),
    },
    {
      key: "sortOrder",
      label: "Sort Order",
    },
    {
      key: "createdAt",
      label: "Created",
      render: (date) => format(new Date(date), "MMM dd, yyyy"),
    },
  ],
  formFields: [
    {
      name: "name",
      label: "Category Name",
      type: "text",
      required: true,
      validation: { required: "Category name is required" },
    },
    {
      name: "slug",
      label: "URL Slug",
      type: "text",
      required: true,
      validation: { required: "URL slug is required" },
      description: "URL-friendly version of the category name",
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      rows: 4,
    },
    {
      name: "shortDescription",
      label: "Short Description",
      type: "textarea",
      rows: 2,
    },
    {
      name: "image",
      label: "Category Image URL",
      type: "text",
      description: "URL to the category image",
    },
    {
      name: "parentCategoryId",
      label: "Parent Category",
      type: "select",
      options: [], // This would be populated dynamically
    },
    {
      name: "isActive",
      label: "Active",
      type: "checkbox",
    },
    {
      name: "isVisible",
      label: "Visible",
      type: "checkbox",
    },
    {
      name: "sortOrder",
      label: "Sort Order",
      type: "number",
      min: 0,
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
  ],
};

// Product Variant Entity Configuration
export const productVariantEntityConfig: EntityManagerConfig<ProductVariant> = {
  entityName: "Product Variant",
  apiEndpoint: "/productvariant",
  columns: [
    {
      key: "title",
      label: "Title",
      render: (title, variant) => (
        <div className="flex items-center">
          {variant.image && (
            <div className="flex-shrink-0 h-8 w-8 mr-3">
              <img
                src={variant.image}
                alt={title}
                className="h-8 w-8 object-cover rounded"
              />
            </div>
          )}
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {title || variant.displayTitle}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              SKU: {variant.sku}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "price",
      label: "Price",
      render: (price, variant) => (
        <div>
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            ${price.toFixed(2)}
          </div>
          {variant.compareAtPrice && variant.compareAtPrice > price && (
            <div className="text-sm text-gray-500 dark:text-gray-400 line-through">
              ${variant.compareAtPrice.toFixed(2)}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "quantity",
      label: "Stock",
      render: (quantity) => (
        <span
          className={`text-sm font-medium ${
            quantity === 0
              ? "text-red-600 dark:text-red-400"
              : quantity < 10
              ? "text-yellow-600 dark:text-yellow-400"
              : "text-green-600 dark:text-green-400"
          }`}
        >
          {quantity}
        </span>
      ),
    },
    {
      key: "isDefault",
      label: "Default",
      render: (isDefault) =>
        isDefault ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            Default
          </span>
        ) : null,
    },
    {
      key: "isAvailable",
      label: "Available",
      render: (isAvailable) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            isAvailable
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
          }`}
        >
          {isAvailable ? "Available" : "Out of Stock"}
        </span>
      ),
    },
    {
      key: "position",
      label: "Position",
    },
  ],
  formFields: [
    {
      name: "title",
      label: "Variant Title",
      type: "text",
      required: true,
      validation: { required: "Variant title is required" },
    },
    {
      name: "sku",
      label: "SKU",
      type: "text",
      required: true,
      validation: { required: "SKU is required" },
    },
    {
      name: "price",
      label: "Price",
      type: "number",
      required: true,
      min: 0,
      step: 0.01,
      validation: { required: "Price is required" },
    },
    {
      name: "compareAtPrice",
      label: "Compare at Price",
      type: "number",
      min: 0,
      step: 0.01,
    },
    {
      name: "costPerItem",
      label: "Cost per Item",
      type: "number",
      min: 0,
      step: 0.01,
    },
    {
      name: "quantity",
      label: "Quantity",
      type: "number",
      min: 0,
    },
    {
      name: "trackQuantity",
      label: "Track Quantity",
      type: "checkbox",
    },
    {
      name: "continueSellingWhenOutOfStock",
      label: "Continue selling when out of stock",
      type: "checkbox",
    },
    {
      name: "requiresShipping",
      label: "Requires Shipping",
      type: "checkbox",
    },
    {
      name: "isTaxable",
      label: "Taxable",
      type: "checkbox",
    },
    {
      name: "weight",
      label: "Weight",
      type: "number",
      min: 0,
      step: 0.01,
    },
    {
      name: "weightUnit",
      label: "Weight Unit",
      type: "select",
      options: [
        { value: "kg", label: "Kilograms" },
        { value: "g", label: "Grams" },
        { value: "lb", label: "Pounds" },
        { value: "oz", label: "Ounces" },
      ],
    },
    {
      name: "barcode",
      label: "Barcode",
      type: "text",
    },
    {
      name: "image",
      label: "Image URL",
      type: "text",
    },
    {
      name: "position",
      label: "Position",
      type: "number",
      min: 0,
    },
    {
      name: "isDefault",
      label: "Default Variant",
      type: "checkbox",
    },
    {
      name: "option1",
      label: "Option 1",
      type: "text",
      description: "e.g., Size, Color, Material",
    },
    {
      name: "option2",
      label: "Option 2",
      type: "text",
    },
    {
      name: "option3",
      label: "Option 3",
      type: "text",
    },
  ],
};

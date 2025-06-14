import { EntityManagerConfig } from "../../components/entities/EntityManager";
import { FormField, User } from "../../types";
import {
  createAddressFields,
  createCheckboxField,
  createContactDetailsFields,
  createEmailField,
  createSelectField,
  createTextField,
} from "../../utils/formFieldHelpers";
import { format } from "date-fns";

import { UserRole } from "../../types/enums";
import {
  transformDataForApi,
  transformDataForForm,
} from "./transformFunctions";
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
    createTextField("firstName", "First Name", {
      required: true,
      validation: { required: "First name is required" },
    }),
    createTextField("lastName", "Last Name", {
      required: true,
      validation: { required: "Last name is required" },
    }),
    createEmailField("email", "Email", {
      required: true,
      validation: {
        required: "Email is required",
      },
    }),
    createTextField("username", "Username", {
      required: true,
      validation: { required: "Username is required" },
    }),
    createSelectField(
      "role",
      "Role",
      [
        { value: UserRole.Customer, label: "Customer" },
        { value: UserRole.Admin, label: "Admin" },
        { value: UserRole.Dev, label: "Developer" },
      ],
      {
        required: true,
        validation: { required: "Role is required" },
      }
    ),
    createCheckboxField("isActive", "Active"),
    createTextField("timezone", "Timezone", { placeholder: "UTC" }),
    createTextField("language", "Language", { placeholder: "en" }),

    ...createAddressFields(),

    ...createContactDetailsFields(),
  ] as FormField[], // Cast to FormField[]
  transformDataForForm,
  transformDataForApi,
};

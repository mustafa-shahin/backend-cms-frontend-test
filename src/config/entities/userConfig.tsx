// src/config/entities/userConfig.tsx
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
import ImageSelector from "../../components/ui/ImageSelector";
import React from "react";

export const userEntityConfig: EntityManagerConfig<User> = {
  entityName: "User",
  apiEndpoint: "/user",
  columns: [
    {
      key: "firstName",
      label: "Name",
      render: (_, user) => (
        <div className="flex items-center">
          {user.avatarUrl ? (
            <div className="flex-shrink-0 h-8 w-8 mr-3">
              <img
                src={user.avatarUrl}
                alt={`${user.firstName} ${user.lastName}`}
                className="h-8 w-8 rounded-full object-cover"
              />
            </div>
          ) : (
            <div className="flex-shrink-0 h-8 w-8 mr-3 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                {user.firstName?.[0]}
                {user.lastName?.[0]}
              </span>
            </div>
          )}
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {user.firstName} {user.lastName}
            </div>
          </div>
        </div>
      ),
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
    // Avatar Selection
    {
      name: "avatarFileId",
      label: "Profile Picture",
      type: "text", // We'll override this with custom render
      description: "Select a profile picture for the user",
    } as FormField,

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

    // Password field for creation only
    {
      name: "password",
      label: "Password",
      type: "password",
      required: true,
      validation: { required: "Password is required" },
      description: "Only required when creating a new user",
    } as FormField,

    ...createAddressFields(),
    ...createContactDetailsFields(),
  ] as FormField[],
  transformDataForForm,
  transformDataForApi,
  customFormRender: (field, value, onChange, errors, formData) => {
    if (field.name === "avatarFileId") {
      return (
        <div key={field.name}>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <ImageSelector
            value={value || undefined}
            onChange={onChange}
            multiple={false}
          />
          {field.description && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {field.description}
            </p>
          )}
          {errors[field.name] && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {(errors[field.name] as any)?.message || "This field is required"}
            </p>
          )}
        </div>
      );
    }

    // Hide password field when editing existing users
    if (field.name === "password" && formData?.id) {
      return null;
    }

    return null;
  },
};

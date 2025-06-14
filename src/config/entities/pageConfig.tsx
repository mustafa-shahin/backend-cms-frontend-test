import { EntityManagerConfig } from "../../components/entities/EntityManager";
import { FormField, Page } from "../../types";
import { PageStatus } from "../../types/enums";
import {
  createCheckboxField,
  createSelectField,
  createTextAreaField,
  createTextField,
} from "../../utils/formFieldHelpers";
import { format } from "date-fns";
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
    createTextField("name", "Page Name", {
      required: true,
      validation: { required: "Page name is required" },
    }),
    createTextField("title", "Page Title", {
      required: true,
      validation: { required: "Page title is required" },
    }),
    createTextField("slug", "URL Slug", {
      required: true,
      validation: { required: "URL slug is required" },
      description: "URL-friendly version of the page name",
    }),
    createTextAreaField("description", "Description", 3),
    createSelectField(
      "status",
      "Status",
      [
        { value: PageStatus.Draft, label: "Draft" },
        { value: PageStatus.Published, label: "Published" },
        { value: PageStatus.Archived, label: "Archived" },
        { value: PageStatus.Scheduled, label: "Scheduled" },
      ],
      {
        required: true,
        validation: { required: "Status is required" },
      }
    ),
    createTextField("metaTitle", "Meta Title", {
      description: "SEO title for search engines",
    }),
    createTextAreaField("metaDescription", "Meta Description", 2, {
      description: "SEO description for search engines",
    }),
    createTextField("metaKeywords", "Meta Keywords", {
      description: "Comma-separated keywords for SEO",
    }),
    createCheckboxField("requiresLogin", "Requires Login"),
    createCheckboxField("adminOnly", "Admin Only"),
  ] as FormField[], // Cast to FormField[]
};

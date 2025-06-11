import React, { useState, useEffect } from "react";
import { Company, UpdateCompany } from "../types";
import { apiService } from "../Services/ApiServices";
import Form from "../components/ui/Form";
import Icon from "../components/ui/Icon";
import toast from "react-hot-toast";

const CompanyPage: React.FC = () => {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    try {
      setLoading(true);
      const result = await apiService.get<Company>("/company");
      setCompany(result);
    } catch (error) {
      console.error("Error fetching company:", error);
      toast.error("Failed to load company information");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData: any) => {
    try {
      setSaving(true);
      const result = await apiService.put<Company>("/company", formData);
      setCompany(result);
      toast.success("Company information updated successfully");
    } catch (error) {
      console.error("Error updating company:", error);
      toast.error("Failed to update company information");
    } finally {
      setSaving(false);
    }
  };

  const formFields = [
    {
      name: "name",
      label: "Company Name",
      type: "text" as const,
      required: true,
      validation: { required: "Company name is required" },
    },
    {
      name: "description",
      label: "Description",
      type: "textarea" as const,
      rows: 3,
    },
    {
      name: "logo",
      label: "Logo URL",
      type: "text" as const,
      description: "URL to the company logo image",
    },
    {
      name: "favicon",
      label: "Favicon URL",
      type: "text" as const,
      description: "URL to the company favicon",
    },
    {
      name: "timezone",
      label: "Timezone",
      type: "select" as const,
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
      type: "select" as const,
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
      type: "select" as const,
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
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Icon name="spinner" size="2xl" spin className="text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Company Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your company information and settings
        </p>
      </div>

      {/* Company Information Form */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Basic Information
          </h2>
        </div>
        <div className="p-6">
          {company && (
            <Form
              fields={formFields}
              onSubmit={handleSave}
              defaultValues={company}
              loading={saving}
              submitLabel="Save Changes"
              showCancelButton={false}
            />
          )}
        </div>
      </div>

      {/* Additional sections can be added here */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Branding Settings */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Branding
            </h3>
          </div>
          <div className="p-6">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Customize your company's visual identity with logos, colors, and
              themes.
            </p>
            <div className="mt-4">
              {company?.logo && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Current Logo
                  </label>
                  <img
                    src={company.logo}
                    alt="Company Logo"
                    className="h-16 w-auto object-contain bg-gray-50 dark:bg-gray-700 rounded border"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Business Settings */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Business Settings
            </h3>
          </div>
          <div className="p-6">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Configure business-specific settings and preferences.
            </p>
            <div className="mt-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    company?.isActive
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                  }`}
                >
                  {company?.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Locations
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {company?.locations?.length || 0} locations
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyPage;

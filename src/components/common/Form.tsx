import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import clsx from "clsx";
import { FormField } from "../../types";
import Button from "./Button";
import Icon from "./Icon";

interface FormProps {
  fields: FormField[];
  onSubmit: (data: any) => void;
  defaultValues?: any;
  loading?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  className?: string;
  showCancelButton?: boolean;
  customFieldRenderer?: (
    field: FormField,
    value: any,
    onChange: (value: any) => void,
    errors: any,
    formData?: any
  ) => React.ReactNode | null;
}

const Form: React.FC<FormProps> = ({
  fields,
  onSubmit,
  defaultValues = {},
  loading = false,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  onCancel,
  className,
  showCancelButton = true,
  customFieldRenderer,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    defaultValues,
  });

  // Watch all form data for custom field renderer
  const formData = watch();

  // Add useEffect to handle defaultValues changes - improved to handle deep updates
  useEffect(() => {
    if (defaultValues && Object.keys(defaultValues).length > 0) {
      console.log("[Form] Resetting form with default values:", defaultValues);

      // Create a clean version of defaultValues to ensure proper form reset
      const cleanDefaults = { ...defaultValues };

      // Handle array fields (like imageIds) properly
      Object.keys(cleanDefaults).forEach((key) => {
        const value = cleanDefaults[key];
        if (Array.isArray(value)) {
          cleanDefaults[key] = [...value];
        } else if (value === null || value === undefined) {
          cleanDefaults[key] = "";
        }
      });

      reset(cleanDefaults);
    }
  }, [defaultValues, reset]);

  const handleFormSubmit = (data: any) => {
    console.log("[Form] Form submitted with data:", data);

    // Clean up the data before submission
    const cleanedData = { ...data };

    // Handle empty strings and null values
    Object.keys(cleanedData).forEach((key) => {
      if (cleanedData[key] === "" && typeof defaultValues[key] === "number") {
        cleanedData[key] = 0;
      }
    });

    onSubmit(cleanedData);
  };

  const handleCancel = () => {
    console.log("[Form] Form cancelled");
    if (onCancel) {
      onCancel();
    }
  };

  const renderField = (field: FormField) => {
    const hasError = errors[field.name];
    const baseInputClasses = clsx(
      "block py-2 px-2 w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm",
      hasError && "border-red-300 focus:border-red-500 focus:ring-red-500",
      field.disabled && "bg-gray-100 dark:bg-gray-600 cursor-not-allowed"
    );

    return (
      <Controller
        key={field.name}
        name={field.name}
        control={control}
        rules={field.validation}
        render={({ field: { onChange, value, ...fieldProps } }) => {
          // Handle custom renderer first
          if (customFieldRenderer) {
            const customRender = customFieldRenderer(
              field,
              value,
              onChange,
              errors,
              formData
            );

            // If custom renderer returns something, return it directly (it should handle its own label)
            if (customRender != null) {
              return React.isValidElement(customRender) ? (
                customRender
              ) : (
                <>{customRender}</>
              );
            }
          }

          // Default field rendering
          switch (field.type) {
            case "textarea":
              return (
                <textarea
                  {...fieldProps}
                  value={value || ""}
                  onChange={onChange}
                  placeholder={field.placeholder}
                  rows={field.rows || 3}
                  disabled={field.disabled}
                  className={baseInputClasses}
                />
              );

            case "select":
              return (
                <select
                  {...fieldProps}
                  value={value !== undefined && value !== null ? value : ""}
                  onChange={onChange}
                  disabled={field.disabled}
                  multiple={field.multiple}
                  className={baseInputClasses}
                >
                  <option value="">Select {field.label}</option>
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              );

            case "checkbox":
              return (
                <div className="flex items-center">
                  <input
                    {...fieldProps}
                    type="checkbox"
                    checked={Boolean(value)}
                    onChange={(e) => onChange(e.target.checked)}
                    disabled={field.disabled}
                    className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                  />
                  <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    {field.label}
                  </label>
                </div>
              );

            case "file":
              return (
                <input
                  {...fieldProps}
                  type="file"
                  multiple={field.multiple}
                  accept={field.accept}
                  disabled={field.disabled}
                  onChange={(e) => {
                    const files = e.target.files;
                    onChange(
                      field.multiple ? Array.from(files || []) : files?.[0]
                    );
                  }}
                  className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 dark:file:bg-primary-900 dark:file:text-primary-300"
                />
              );

            case "number":
              return (
                <input
                  {...fieldProps}
                  type="number"
                  value={
                    value !== undefined && value !== null && value !== ""
                      ? value
                      : ""
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "") {
                      onChange("");
                    } else {
                      const numVal = e.target.valueAsNumber;
                      onChange(isNaN(numVal) ? val : numVal);
                    }
                  }}
                  placeholder={field.placeholder}
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  disabled={field.disabled}
                  className={baseInputClasses}
                />
              );

            default:
              return (
                <input
                  {...fieldProps}
                  type={field.type}
                  value={value || ""}
                  onChange={onChange}
                  placeholder={field.placeholder}
                  disabled={field.disabled}
                  className={baseInputClasses}
                />
              );
          }
        }}
      />
    );
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={className}>
      <div className="space-y-6">
        {fields.map((field) => {
          // Check if this field has a custom renderer
          const hasCustomRenderer =
            customFieldRenderer &&
            customFieldRenderer(
              field,
              formData[field.name],
              () => {},
              errors,
              formData
            ) !== null;

          return (
            <div key={field.name}>
              {/* Only show label if it's not a checkbox and doesn't have a custom renderer */}
              {field.type !== "checkbox" && !hasCustomRenderer && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {field.label}
                  {field.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>
              )}

              {renderField(field)}

              {/* Only show description and errors if no custom renderer */}
              {!hasCustomRenderer && (
                <>
                  {field.description && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {field.description}
                    </p>
                  )}

                  {errors[field.name] && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                      <Icon
                        name="exclamation-triangle"
                        size="xs"
                        className="mr-1"
                      />
                      {(errors[field.name] as any)?.message ||
                        "This field is required"}
                    </p>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        {showCancelButton && onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
        )}

        <Button type="submit" loading={loading} leftIcon="save">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default Form;

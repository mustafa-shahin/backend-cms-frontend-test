import { ValidationRule } from "react-hook-form"; // Assuming react-hook-form is used based on 'validation'

export type FieldType =
  | "text"
  | "email"
  | "number"
  | "textarea"
  | "select"
  | "checkbox";

export interface BaseFormField {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  description?: string;
  placeholder?: string;
  validation?: {
    required?: string | ValidationRule<boolean>;
    min?: { value: number; message: string };
    max?: { value: number; message: string };
    pattern?: { value: RegExp; message: string };
    // Add other common validation rules as needed
  };
}

export interface TextField extends BaseFormField {
  type: "text" | "email";
}

export interface NumberField extends BaseFormField {
  type: "number";
  min?: number;
  max?: number;
  step?: number;
}

export interface TextAreaField extends BaseFormField {
  type: "textarea";
  rows?: number;
}

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectField extends BaseFormField {
  type: "select";
  options: SelectOption[];
}

export interface CheckboxField extends BaseFormField {
  type: "checkbox";
}

export type FormField =
  | TextField
  | NumberField
  | TextAreaField
  | SelectField
  | CheckboxField;

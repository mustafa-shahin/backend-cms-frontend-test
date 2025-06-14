import { ValidationRule } from "react-hook-form";

export interface BaseField {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  validation?: any;
  disabled?: boolean;
  description?: string;
}

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

export interface TextField extends BaseField {
  type: "text" | "email" | "password" | "url" | "tel";
}

export interface NumberField extends BaseField {
  type: "number";
  min?: number;
  max?: number;
  step?: number;
}

export interface TextAreaField extends BaseField {
  type: "textarea";
  rows?: number;
}

export interface SelectOption {
  value: any;
  label: string;
}

export interface SelectField extends BaseField {
  type: "select";
  options: SelectOption[];
  multiple?: boolean;
}

export interface CheckboxField extends BaseField {
  type: "checkbox";
}

export interface FileField extends BaseField {
  type: "file";
  accept?: string;
  multiple?: boolean;
}
export interface DateField extends BaseField {
  type: "date" | "time" | "datetime-local";
}
export type FormField =
  | TextField
  | NumberField
  | TextAreaField
  | SelectField
  | CheckboxField
  | FileField
  | DateField;

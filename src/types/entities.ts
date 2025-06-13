export interface TableColumn<T = any> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (value: any, row: T) => React.ReactNode;
}
export interface FormField {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "textarea"
    | "select"
    | "checkbox"
    | "file"
    | "date"
    | "time"
    | "datetime-local";
  placeholder?: string;
  required?: boolean;
  validation?: any;
  options?: { value: any; label: string }[];
  rows?: number;
  multiple?: boolean;
  accept?: string;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  description?: string;
}

export interface TableAction<T = any> {
  label: string;
  icon?: any;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  onClick: (row: T) => void;
  show?: (row: T) => boolean;
}

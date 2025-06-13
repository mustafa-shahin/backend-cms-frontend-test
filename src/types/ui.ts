import React from "react";

export interface TableColumn<T = any> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface TableAction<T = any> {
  label: string;
  icon?: any;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  onClick: (row: T) => void;
  show?: (row: T) => boolean;
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

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  showCloseButton?: boolean;
}

export interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  iconSolid: any;
  children?: NavigationItem[];
}

export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export interface SearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export interface FilterOption {
  label: string;
  value: string | number;
}

export interface FilterProps {
  options: FilterOption[];
  value: string | number | null;
  onChange: (value: string | number | null) => void;
  placeholder?: string;
  multiple?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

export interface ToastType {
  id: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number;
}

export interface ViewMode {
  value: "grid" | "table" | "list";
  label: string;
  icon: string;
}

export interface SortState {
  column: string | null;
  direction: "asc" | "desc";
}

export interface SelectionState<T> {
  selectedItems: T[];
  isAllSelected: boolean;
  isPartiallySelected: boolean;
}

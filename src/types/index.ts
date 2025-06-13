export * from "./api";
export * from "./auth";
export * from "./entities";
export * from "./ui";

// Re-export commonly used types for convenience
// Ensure that './api' exists or update the path if necessary
export type { BaseEntity, PagedResult } from "./api";

export type {
  User,
  Company,
  Location,
  FileEntity,
  Folder,
  Page,
  UserRole,
  PageStatus,
  FileType,
  FolderType,
} from "./entities";

export type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  AuthContextType,
} from "./auth";

export type {
  TableColumn,
  TableAction,
  FormField,
  ModalProps,
  NavigationItem,
  ThemeContextType,
} from "./ui";

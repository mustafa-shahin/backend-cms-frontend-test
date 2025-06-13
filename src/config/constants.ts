import { ENV } from "./env";

// API Configuration
export const API_CONFIG = {
  BASE_URL: ENV.API_BASE_URL,
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
} as const;

// Authentication Configuration
export const AUTH_CONFIG = {
  TOKEN_STORAGE_KEY: "accessToken",
  REFRESH_TOKEN_STORAGE_KEY: "refreshToken",
  TOKEN_REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes before expiry
} as const;

// UI Configuration
export const UI_CONFIG = {
  PAGE_SIZES: [10, 20, 50, 100] as const,
  DEFAULT_PAGE_SIZE: 10,
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 4000,
  MODAL_ANIMATION_DURATION: 200,
} as const;

// File Upload Configuration
export const FILE_CONFIG = {
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  ALLOWED_IMAGE_TYPES: [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
  ] as readonly string[],
  ALLOWED_DOCUMENT_TYPES: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain",
    "text/csv",
  ] as readonly string[],
  ALLOWED_VIDEO_TYPES: [
    "video/mp4",
    "video/webm",
    "video/ogg",
    "video/avi",
    "video/mov",
  ] as readonly string[],
  ALLOWED_AUDIO_TYPES: [
    "audio/mp3",
    "audio/wav",
    "audio/ogg",
    "audio/mpeg",
    "audio/webm",
  ] as readonly string[],
  CHUNK_SIZE: 1024 * 1024, // 1MB chunks for large file uploads
} as const;

// Theme Configuration
export const THEME_CONFIG = {
  STORAGE_KEY: "theme",
  DEFAULT_THEME: "light",
  THEMES: ["light", "dark"] as const,
} as const;

// Validation Messages
export const VALIDATION_MESSAGES = {
  REQUIRED: "This field is required",
  EMAIL_INVALID: "Please enter a valid email address",
  PASSWORD_MIN_LENGTH: "Password must be at least 8 characters",
  PASSWORD_WEAK:
    "Password must contain at least one uppercase letter, one lowercase letter, and one number",
  CONFIRM_PASSWORD_MISMATCH: "Passwords do not match",
  FILE_TOO_LARGE: "File size exceeds the maximum allowed limit",
  FILE_TYPE_NOT_ALLOWED: "File type is not allowed",
} as const;

// Date/Time Formats
export const DATE_FORMATS = {
  DISPLAY: "MMM dd, yyyy",
  DISPLAY_WITH_TIME: "MMM dd, yyyy HH:mm",
  ISO: "yyyy-MM-dd",
  ISO_WITH_TIME: "yyyy-MM-dd'T'HH:mm:ss",
  TIME_ONLY: "HH:mm",
} as const;

// Pagination Constants
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Entity Names (for consistency)
export const ENTITY_NAMES = {
  USER: "User",
  COMPANY: "Company",
  LOCATION: "Location",
  PAGE: "Page",
  FILE: "File",
  FOLDER: "Folder",
  JOB: "Job",
} as const;

// Route Paths
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  USERS: "/dashboard/users",
  COMPANY: "/dashboard/company",
  LOCATIONS: "/dashboard/locations",
  PAGES: "/dashboard/pages",
  FILES: "/dashboard/files",
  FILES_MANAGER: "/dashboard/files",
  FILES_FOLDERS: "/dashboard/files/folders",
  FILES_DOCUMENTS: "/dashboard/files/documents",
  FILES_PHOTOS: "/dashboard/files/photos",
  FILES_VIDEOS: "/dashboard/files/videos",
  FILES_AUDIO: "/dashboard/files/audio",
  FILES_ARCHIVES: "/dashboard/files/archives",
  JOBS_TRIGGERS: "/dashboard/jobs/triggers",
  JOBS_HISTORY: "/dashboard/jobs/history",
  PRODUCTS: "/dashboard/products",
  PRODUCTS_LIST: "/dashboard/products/list",
  CATEGORIES: "/dashboard/products/categories",
  PRODUCT_VARIANTS: "/dashboard/products/variants",
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  THEME: "theme",
  USER_PREFERENCES: "userPreferences",
  SIDEBAR_COLLAPSED: "sidebarCollapsed",
} as const;

// Animation Durations (in milliseconds)
export const ANIMATIONS = {
  FAST: 150,
  NORMAL: 200,
  SLOW: 300,
  VERY_SLOW: 500,
} as const;

// Breakpoints (matching Tailwind CSS)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  "2XL": 1536,
} as const;

// Z-Index values
export const Z_INDEX = {
  DROPDOWN: 10,
  MODAL_BACKDROP: 40,
  MODAL: 50,
  TOOLTIP: 60,
  NOTIFICATION: 70,
} as const;

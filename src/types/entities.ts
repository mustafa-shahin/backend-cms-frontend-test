import { BaseEntity } from "./api";

export enum UserRole {
  Customer = 0,
  Admin = 1,
  Dev = 2,
}

export enum PageStatus {
  Draft = 0,
  Published = 1,
  Archived = 2,
  Scheduled = 3,
}

export enum FileType {
  Document = 0,
  Image = 1,
  Video = 2,
  Audio = 3,
  Archive = 4,
  Other = 5,
}

export enum FolderType {
  General = 0,
  Images = 1,
  Documents = 2,
  Videos = 3,
  Audio = 4,
  UserAvatars = 5,
  CompanyAssets = 6,
  Temporary = 7,
}

export interface Address extends BaseEntity {
  street: string;
  street2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  region?: string;
  district?: string;
  isDefault: boolean;
  addressType?: string;
  notes?: string;
}

export interface CreateAddress {
  street: string;
  street2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  region?: string;
  district?: string;
  isDefault: boolean;
  addressType?: string;
  notes?: string;
}

export interface UpdateAddress extends CreateAddress {}

export interface ContactDetails extends BaseEntity {
  primaryPhone?: string;
  secondaryPhone?: string;
  mobile?: string;
  fax?: string;
  email?: string;
  secondaryEmail?: string;
  website?: string;
  linkedInProfile?: string;
  twitterProfile?: string;
  facebookProfile?: string;
  instagramProfile?: string;
  whatsAppNumber?: string;
  telegramHandle?: string;
  additionalContacts: Record<string, any>;
  isDefault: boolean;
  contactType?: string;
}

export interface CreateContactDetails {
  primaryPhone?: string;
  secondaryPhone?: string;
  mobile?: string;
  fax?: string;
  email?: string;
  secondaryEmail?: string;
  website?: string;
  linkedInProfile?: string;
  twitterProfile?: string;
  facebookProfile?: string;
  instagramProfile?: string;
  whatsAppNumber?: string;
  telegramHandle?: string;
  additionalContacts: Record<string, any>;
  isDefault: boolean;
  contactType?: string;
}

export interface UpdateContactDetails extends CreateContactDetails {}

export interface User extends BaseEntity {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  isLocked: boolean;
  lastLoginAt?: string;
  avatar?: string;
  timezone?: string;
  language?: string;
  emailVerifiedAt?: string;
  preferences: Record<string, any>;
  addresses: Address[];
  contactDetails: ContactDetails[];
}

export interface CreateUser {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  avatar?: string;
  timezone?: string;
  language?: string;
  role: UserRole;
  preferences: Record<string, any>;
  addresses: CreateAddress[];
  contactDetails: CreateContactDetails[];
}

export interface UpdateUser {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  avatar?: string;
  timezone?: string;
  language?: string;
  role: UserRole;
  preferences: Record<string, any>;
  addresses: UpdateAddress[];
  contactDetails: UpdateContactDetails[];
}

export interface Company extends BaseEntity {
  name: string;
  description?: string;
  logo?: string;
  favicon?: string;
  brandingSettings: Record<string, any>;
  businessSettings: Record<string, any>;
  isActive: boolean;
  timezone?: string;
  currency?: string;
  language?: string;
  locations: Location[];
  addresses: Address[];
  contactDetails: ContactDetails[];
}

export interface UpdateCompany {
  name: string;
  description?: string;
  logo?: string;
  favicon?: string;
  brandingSettings: Record<string, any>;
  businessSettings: Record<string, any>;
  timezone?: string;
  currency?: string;
  language?: string;
  addresses: UpdateAddress[];
  contactDetails: UpdateContactDetails[];
}

export interface LocationOpeningHour extends BaseEntity {
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
  isOpen24Hours: boolean;
  notes?: string;
}

export interface Location extends BaseEntity {
  name: string;
  description?: string;
  locationCode?: string;
  locationType: string;
  isMainLocation: boolean;
  isActive: boolean;
  locationSettings: Record<string, any>;
  additionalInfo: Record<string, any>;
  openingHours: LocationOpeningHour[];
  addresses: Address[];
  contactDetails: ContactDetails[];
}

export interface CreateLocation {
  name: string;
  description?: string;
  locationCode?: string;
  locationType: string;
  isMainLocation: boolean;
  isActive: boolean;
  locationSettings: Record<string, any>;
  additionalInfo: Record<string, any>;
  openingHours: CreateLocationOpeningHour[];
  addresses: CreateAddress[];
  contactDetails: CreateContactDetails[];
}

export interface CreateLocationOpeningHour {
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
  isOpen24Hours: boolean;
  notes?: string;
}

export interface UpdateLocation extends CreateLocation {}

export interface FileEntity extends BaseEntity {
  originalFileName: string;
  storedFileName: string;
  contentType: string;
  fileSize: number;
  fileExtension: string;
  fileType: FileType;
  description?: string;
  alt?: string;
  metadata: Record<string, any>;
  isPublic: boolean;
  folderId?: number;
  folder?: Folder;
  downloadCount: number;
  lastAccessedAt?: string;
  width?: number;
  height?: number;
  duration?: string;
  hash?: string;
  isProcessed: boolean;
  processingStatus?: string;
  tags: Record<string, any>;

  // Computed properties
  fileSizeFormatted?: string;
  fileUrl?: string;
  thumbnailUrl?: string;
  canPreview?: boolean;
  canEdit?: boolean;
}

export interface Folder extends BaseEntity {
  name: string;
  description?: string;
  path: string;
  parentFolderId?: number;
  parentFolderPath?: string;
  subFolders: Folder[];
  files: FileEntity[];
  isPublic: boolean;
  metadata: Record<string, any>;
  folderType: FolderType;
  fileCount: number;
  subFolderCount: number;
  totalSize: number;
  totalSizeFormatted: string;
}

export interface Page extends BaseEntity {
  name: string;
  title: string;
  slug: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  status: PageStatus;
  template?: string;
  priority?: number;
  parentPageId?: number;
  requiresLogin: boolean;
  adminOnly: boolean;
  publishedOn?: string;
  publishedBy?: string;
  childPages: Page[];
}

// Job-related entities
export interface IndexingJob extends BaseEntity {
  jobType: "Full" | "Incremental" | "EntitySpecific";
  status: "Pending" | "Running" | "Completed" | "Failed" | "Cancelled";
  startedAt: string;
  completedAt?: string;
  totalEntities: number;
  processedEntities: number;
  failedEntities: number;
  errorMessage?: string;
  duration?: string;
  progressPercentage: number;
  jobMetadata: Record<string, any>;
}

export interface IndexingJobStatistics {
  totalJobs: number;
  runningJobs: number;
  completedJobs: number;
  failedJobs: number;
  jobsLast24Hours: number;
  jobsLast7Days: number;
  jobsLast30Days: number;
  lastFullIndex?: string;
  lastIncrementalIndex?: string;
  averageJobDuration?: string;
  jobTypeBreakdown: Record<string, number>;
}
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

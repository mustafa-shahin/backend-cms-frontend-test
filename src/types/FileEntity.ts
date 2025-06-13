import { BaseEntity } from "./api";
import { Folder } from "./Folder";
import { FileType } from "./enums";

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

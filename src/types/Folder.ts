import { BaseEntity } from "./api";
import { FolderType } from "./enums";
import { FileEntity } from "./FileEntity";

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

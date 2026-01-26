// Types
export type {
  FileMetadataDTO,
  FileAttachment as FileAttachmentType,
  UploadedFile,
} from './types/file';

// Config
export { FILE_CONFIG, isBlockedExtension } from './config/fileConfig';

// API
export { fileApi } from './api/fileApi';

// Hooks
export { useFileUpload } from './hooks/useFileUpload';

// Components
export { FileUploadButton } from './components/FileUploadButton/FileUploadButton';
export { FilePreview } from './components/FilePreview/FilePreview.tsx';
export { FileAttachment } from './components/FileAttachment/FileAttachment.tsx';

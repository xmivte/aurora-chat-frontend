export type FileMetadataDTO = {
  fileUrl: string;
  fileName: string;
  originalFileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt?: string;
  expiresAt?: string;
};

export type FileAttachment = {
  id: number;
  fileName: string;
  originalFileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
  expiresAt: string;
};

export type UploadedFile = {
  file: File;
  error?: string;
};

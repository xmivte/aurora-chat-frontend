import axios from 'axios';
import { useState } from 'react';

import { FILE_CONFIG, isBlockedExtension } from '@/features/files';

import { fileApi } from '../api/fileApi';
import { FileMetadataDTO } from '../types/file';

export const useFileUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const { MAX_FILES, MAX_TOTAL_SIZE, MAX_FILE_NAME_LENGTH } = FILE_CONFIG;

  const validateFiles = (newFiles: File[]): string | null => {
    const totalFiles = selectedFiles.length + newFiles.length;
    if (totalFiles > MAX_FILES) {
      return `Maximum ${MAX_FILES} files allowed per message`;
    }

    const totalSize = [...selectedFiles, ...newFiles].reduce((sum, file) => sum + file.size, 0);
    if (totalSize > MAX_TOTAL_SIZE) {
      const sizeMB = (totalSize / 1024 / 1024).toFixed(2);
      return `Total file size (${sizeMB}MB) exceeds 10MB limit`;
    }

    for (const file of newFiles) {
      const name = file.name.trim();
      if (isBlockedExtension(name)) {
        return `Executable files are not allowed: ${name}`;
      }
      if (name.length > MAX_FILE_NAME_LENGTH) {
        return `File name is too long. Maximum ${MAX_FILE_NAME_LENGTH} characters allowed`;
      }
    }

    return null;
  };

  const addFiles = (files: File[]): boolean => {
    const validationError = validateFiles(files);
    if (validationError) {
      setError(validationError);
      return false;
    }

    setSelectedFiles(prev => [...prev, ...files]);
    setError(null);
    return true;
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const clearFiles = () => {
    setSelectedFiles([]);
    setUploadProgress(0);
    setError(null);
  };

  const uploadFiles = async (): Promise<FileMetadataDTO[]> => {
    if (selectedFiles.length === 0) {
      const errMsg = 'No files selected';
      setError(errMsg);
      throw new Error(errMsg);
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      const metadata = await fileApi.uploadFiles(selectedFiles);
      setUploadProgress(100);
      return metadata;
    } catch (err) {
      let errorMessage = 'Upload failed. Please try again.';

      if (axios.isAxiosError(err)) {
        if (err.response?.data) {
          const responseData = err.response.data as string | { message?: string };
          errorMessage =
            typeof responseData === 'string'
              ? responseData
              : (responseData.message ?? errorMessage);
        } else if (err.request) {
          errorMessage = 'Network error. Please check your connection.';
        } else {
          errorMessage = err.message || errorMessage;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return {
    selectedFiles,
    isUploading,
    uploadProgress,
    error,
    addFiles,
    uploadFiles,
    removeFile,
    clearFiles,
    MAX_FILES,
    MAX_TOTAL_SIZE,
  };
};

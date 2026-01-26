import { api } from '@/auth/utils/api';
import { FileMetadataDTO } from '@/features/files/types/file.ts';

export const fileApi = {
  uploadFiles: async (files: File[]): Promise<FileMetadataDTO[]> => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    try {
      const response = await api.post<FileMetadataDTO[]>('/api/files/upload', formData);
      return response.data;
    } catch (error) {
      console.error('File upload failed:', error);
      throw error;
    }
  },

  downloadFile: async (fileId: number, originalFileName: string): Promise<void> => {
    try {
      const response = await api.get<Blob>(`/api/files/download/${fileId}`, {
        responseType: 'blob',
      });

      const headers = response.headers as Record<string, string>;
      const contentType = headers['content-type'] ?? 'application/octet-stream';
      const blob = new Blob([response.data], { type: contentType });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      link.download = encodeURIComponent(originalFileName.replace(/[/\\?%*:|"<>]/g, '_'));

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('File download failed:', error);
      throw error;
    }
  },
};

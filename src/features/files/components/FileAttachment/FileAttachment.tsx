import DownloadIcon from '@mui/icons-material/Download';
import ImageIcon from '@mui/icons-material/Image';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { Box, Typography, IconButton, CircularProgress } from '@mui/material';
import React, { useState } from 'react';

import { fileApi } from '@/features/files';

import { FileAttachment as FileAttachmentType } from '../../types/file';

import * as styles from './FileAttachment.ts';

interface FileAttachmentProps {
  file: FileAttachmentType;
}

export const FileAttachment: React.FC<FileAttachmentProps> = ({ file }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <ImageIcon sx={styles.icon} />;
    if (fileType === 'application/pdf') return <PictureAsPdfIcon sx={styles.icon} />;
    return <InsertDriveFileIcon sx={styles.icon} />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);

      const safeFileName = encodeURIComponent(file.originalFileName.replace(/[/\\?%*:|"<>]/g, '_'));
      await fileApi.downloadFile(file.id, safeFileName);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Box sx={styles.container}>
      {getFileIcon(file.fileType)}
      <Box sx={styles.fileInfo}>
        <Typography variant="body2" sx={styles.fileName}>
          {file.originalFileName}
        </Typography>
        <Typography variant="caption" sx={styles.fileSize}>
          {formatFileSize(file.fileSize)}
        </Typography>
      </Box>
      <IconButton
        onClick={() => void handleDownload()}
        size="small"
        sx={styles.downloadButton}
        disabled={isDownloading}
        aria-label={`Download ${file.originalFileName}`}
      >
        {isDownloading ? <CircularProgress size={20} /> : <DownloadIcon fontSize="small" />}
      </IconButton>
    </Box>
  );
};

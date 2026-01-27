import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { Box, Typography, Chip } from '@mui/material';
import React from 'react';

import * as styles from './FilePreview.ts';

interface FilePreviewProps {
  files: File[];
  onRemove: (index: number) => void;
}

export const FilePreview: React.FC<FilePreviewProps> = ({ files, onRemove }) => {
  const getFileIcon = (fileType: string): React.ReactElement => {
    if (fileType.startsWith('image/')) return <ImageIcon />;
    if (fileType === 'application/pdf') return <PictureAsPdfIcon />;
    return <InsertDriveFileIcon />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (files.length === 0) return null;

  return (
    <Box sx={styles.container}>
      {files.map((file, index) => (
        <Chip
          key={index}
          icon={getFileIcon(file.type)}
          label={
            <Box sx={styles.fileInfo}>
              <Typography variant="body2" sx={styles.fileName}>
                {file.name}
              </Typography>
              <Typography variant="caption" sx={styles.fileSize}>
                {formatFileSize(file.size)}
              </Typography>
            </Box>
          }
          onDelete={() => onRemove(index)}
          deleteIcon={<CloseIcon />}
          sx={styles.fileChip}
        />
      ))}
    </Box>
  );
};

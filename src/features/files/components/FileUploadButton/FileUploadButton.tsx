import AttachFileIcon from '@mui/icons-material/AttachFile';
import { IconButton, Tooltip } from '@mui/material';
import React, { useRef } from 'react';

import { FILE_CONFIG } from '@/features/files';

interface FileUploadButtonProps {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
  maxFiles?: number;
}

export const FileUploadButton: React.FC<FileUploadButtonProps> = ({
  onFilesSelected,
  disabled = false,
  maxFiles = FILE_CONFIG.MAX_FILES,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      onFilesSelected(fileArray);
    }
    event.target.value = '';
  };

  return (
    <>
      <Tooltip title={`Attach files (max ${maxFiles})`}>
        <span>
          <IconButton onClick={handleButtonClick} disabled={disabled} color="primary" size="medium">
            <AttachFileIcon />
          </IconButton>
        </span>
      </Tooltip>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept="*"
      />
    </>
  );
};

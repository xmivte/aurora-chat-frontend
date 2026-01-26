export const FILE_CONFIG = {
  MAX_FILES: 5,

  MAX_TOTAL_SIZE: 10 * 1024 * 1024,

  MAX_FILE_NAME_LENGTH: 200,

  BLOCKED_EXTENSIONS: [
    '.exe',
    '.bat',
    '.sh',
    '.dll',
    '.msi',
    '.app',
    '.deb',
    '.rpm',
    '.cmd',
    '.com',
    '.scr',
    '.vbs',
    '.jar',
    '.ps1',
    '.pif',
    '.gadget',
    '.cpl',
    '.hta',
    '.msc',
    '.wsf',
    '.wsh',
    '.reg',
  ],
} as const;

export const isBlockedExtension = (fileName: string): boolean => {
  const lowerFileName = fileName.toLowerCase();
  return FILE_CONFIG.BLOCKED_EXTENSIONS.some(ext => lowerFileName.endsWith(ext));
};

export const getBlockedExtensionsMessage = (): string => {
  return FILE_CONFIG.BLOCKED_EXTENSIONS.join(', ');
};

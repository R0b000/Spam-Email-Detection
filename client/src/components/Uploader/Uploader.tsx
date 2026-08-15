import React, { useCallback } from 'react';
import { Button, LinearProgress, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface UploaderProps {
  onUpload: (file: File) => Promise<void> | void;
  accept?: string;
  multiple?: boolean;
  maxSizeMB?: number;
  disabled?: boolean;
}

const Uploader: React.FC<UploaderProps> = ({
  onUpload,
  accept = '*',
  multiple = false,
  maxSizeMB = 10,
  disabled = false,
}) => {
  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;

      const file = files[0];
      if (file.size > maxSizeMB * 1024 * 1024) {
        alert(`File size must be less than ${maxSizeMB}MB`);
        return;
      }

      await onUpload(file);
      e.target.value = '';
    },
    [onUpload, maxSizeMB]
  );

  return (
    <div className="flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gborder p-6 text-center">
      <CloudUploadIcon className="mb-2 text-4xl text-gsubtext" />
      <Typography variant="body1" className="mb-2 text-gtext">
        Drag & drop files here, or click to browse
      </Typography>
      <Typography variant="body2" className="mb-4 text-gsubtext">
        Max file size: {maxSizeMB}MB
      </Typography>
      <Button variant="contained" component="label" disabled={disabled}>
        Browse Files
        <input type="file" hidden accept={accept} multiple={multiple} onChange={handleFileChange} />
      </Button>
    </div>
  );
};

export default Uploader;

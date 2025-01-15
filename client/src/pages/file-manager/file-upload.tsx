import { Upload } from 'lucide-react';
import React from 'react';
import { handleResponseErrorMessage, useUploadFile } from '../../services/apis';
import { toast } from '../../hooks';

export type FileUploadProps = {
  onFileUploadSuccess: () => void;
};

export const FileUpload = ({ onFileUploadSuccess }: FileUploadProps) => {
  // Queries.
  const { mutate: uploadFile } = useUploadFile();

  // Handlers.
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadFile(
        { file: e.target.files[0] },
        {
          onSuccess: () => {
            // Clear input
            e.target.value = '';
            onFileUploadSuccess();
          },
          onError: (error) => {
            if (error.meta.status_code === 409) {
              toast({
                title: 'File already exists',
                description: 'A file with this name already exists',
                variant: 'destructive',
              });
            } else {
              handleResponseErrorMessage(error);
            }
          },
        },
      );
    }
  };

  return (
    <div>
      <label
        htmlFor="file-upload"
        className="flex cursor-pointer items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm text-secondary hover:bg-primary/90"
      >
        <Upload className="size-4" />
        Upload File
      </label>
      <input
        id="file-upload"
        type="file"
        className="hidden"
        onChange={handleFileUpload}
      />
    </div>
  );
};

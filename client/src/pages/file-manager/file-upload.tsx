import { Plus } from 'lucide-react';
import React from 'react';
import { handleResponseErrorMessage, useUploadFile } from '../../services/apis';
import { toast } from '../../hooks';
import { cn } from '../../lib/utils';

export type FileUploadProps = {
  onFileUploadSuccess: () => void;
  className?: string;
};

export const FileUpload = ({
  onFileUploadSuccess,
  className,
}: FileUploadProps) => {
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
    <div
      className={cn(
        'group relative rounded-lg border-2 border-dashed border-muted-foreground/25 bg-card p-3 transition-all hover:border-primary/50 hover:bg-accent hover:shadow-lg',
        className,
      )}
    >
      <label
        htmlFor="file-upload"
        className="flex cursor-pointer flex-col items-center justify-center"
      >
        <div className="mb-2 flex size-8 items-center justify-center rounded-full border-2 border-muted-foreground/25 bg-background/50 group-hover:border-primary/50">
          <Plus className="size-4 text-muted-foreground group-hover:text-primary" />
        </div>
        <div className="space-y-0.5 text-center">
          <h3 className="text-sm font-medium group-hover:text-primary">
            New File
          </h3>
          <div className="text-[11px] text-muted-foreground group-hover:text-primary/80">
            <span>Click to browse files</span>
          </div>
        </div>
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

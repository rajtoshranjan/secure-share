import { FileX } from 'lucide-react';
import { useState } from 'react';
import { isNil } from 'lodash';
import { ScrollArea, Spinner } from '../../components/ui';
import { toast } from '../../hooks/use-toast';
import {
  FileData,
  handleResponseErrorMessage,
  useDeleteFile,
  useDownloadFile,
  useGetFiles,
  useGetSharedFiles,
} from '../../services/apis';
import { useAppSelector } from '../../store/hooks';
import { selectActiveDrive } from '../../store/slices';
import { FileCard } from './file-card';
import { FilePermissionsDialog } from './file-permissions-dialog';
import { FileShareDialog } from './file-share-dialog';
import { FileUpload } from './file-upload';

type FileManagementPageProps = {
  fileType?: 'drive' | 'shared';
};

export function FileManagementPage({
  fileType = 'drive',
}: FileManagementPageProps) {
  const { activeDriveId, canManageFiles } = useAppSelector(selectActiveDrive);

  // States.
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [activeFile, setActiveFile] = useState<FileData | null>(null);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);

  // Queries.
  const {
    data: filesResponse,
    isLoading: isLoadingFiles,
    refetch: refetchFiles,
  } = useGetFiles(
    activeDriveId ?? '',
    fileType === 'drive' && !isNil(activeDriveId),
  );

  const { data: sharedFilesResponse, isLoading: isLoadingSharedFiles } =
    useGetSharedFiles(fileType === 'shared');

  const { mutate: deleteFile } = useDeleteFile();
  const { mutate: downloadFile } = useDownloadFile();

  // Constants
  const sharedFiles =
    sharedFilesResponse?.data.map(({ file, canDownload }) => ({
      ...file,
      canDownload,
    })) || [];

  // Handlers.
  const handleShare = (file: FileData) => {
    setActiveFile(file);
    setIsShareModalOpen(true);
  };

  const handleDownload = (file: FileData) => {
    downloadFile(file.id, {
      onSuccess: (fileBlob: Blob) => {
        // FIXME: This is a temporary solution to download the file.
        const url = window.URL.createObjectURL(fileBlob);
        // Create temporary link element
        const link = document.createElement('a');
        link.href = url;
        link.download = file.name;

        // Trigger download
        document.body.appendChild(link);
        link.click();
        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast({
          title: 'File downloaded successfully',
        });
      },
      onError: (error) => {
        handleResponseErrorMessage(error);
      },
    });
  };

  const handleDelete = (file: FileData) => {
    deleteFile(file.id, {
      onSuccess: () => {
        refetchFiles();
        toast({
          title: 'File deleted successfully',
          description: file.name,
        });
      },
      onError: (error) => {
        handleResponseErrorMessage(error);
      },
    });
  };

  const handleManagePermissions = (file: FileData) => {
    setActiveFile(file);
    setIsPermissionsModalOpen(true);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {fileType === 'drive' ? 'My Files' : 'Shared with Me'}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {fileType === 'drive'
              ? "View and manage your drive's files and documents"
              : 'Access files that others have shared with you'}
          </p>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-17rem)] w-full  md:h-[calc(100vh-16rem)]">
        <div className="w-full py-4">
          {/* Drive Files */}
          {fileType === 'drive' && (
            <>
              {isLoadingFiles ? (
                <div className="flex justify-center p-8">
                  <Spinner />
                </div>
              ) : filesResponse?.data.length === 0 ? (
                <div className="flex min-h-[50vh] flex-col items-center justify-center gap-8 p-8 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <FileX className="size-5" />
                    <span>No files found</span>
                  </div>
                  {canManageFiles && (
                    <FileUpload
                      onFileUploadSuccess={refetchFiles}
                      className="w-full max-w-sm"
                    />
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {canManageFiles && (
                    <FileUpload onFileUploadSuccess={refetchFiles} />
                  )}
                  {filesResponse?.data.map((file) => {
                    return (
                      <FileCard
                        key={file.id}
                        file={file}
                        onShare={() => handleShare(file)}
                        onDelete={() => handleDelete(file)}
                        onDownload={() => handleDownload(file)}
                        onManagePermissions={() =>
                          handleManagePermissions(file)
                        }
                      />
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* Shared Files */}
          {fileType === 'shared' && (
            <>
              {isLoadingSharedFiles ? (
                <div className="flex justify-center p-8">
                  <Spinner />
                </div>
              ) : sharedFiles.length === 0 ? (
                <div className="flex min-h-[50vh] flex-col items-center justify-center gap-8 p-8 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <FileX className="size-5" />
                    <span>No shared files found</span>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {sharedFiles.map((file) => {
                    return (
                      <FileCard
                        key={file.id}
                        file={file}
                        onDownload={() => handleDownload(file)}
                      />
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </ScrollArea>

      {/* Dialogs */}
      <FileShareDialog
        open={isShareModalOpen}
        onOpenChange={setIsShareModalOpen}
        file={activeFile}
      />
      <FilePermissionsDialog
        open={isPermissionsModalOpen}
        onOpenChange={setIsPermissionsModalOpen}
        file={activeFile}
      />
    </div>
  );
}

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui';
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
import { FileShareDialog } from './file-share-dialog';
import { FileUpload } from './file-upload';
import { FileTable } from './files-table';
import { FilePermissionsDialog } from './file-permissions-dialog';

export function FileManagementPage() {
  const { activeDriveId } = useAppSelector(selectActiveDrive);

  // States.
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [activeFile, setActiveFile] = useState<FileData | null>(null);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);

  // Queries.
  const {
    data: filesResponse,
    isLoading: isLoadingFiles,
    refetch: refetchFiles,
  } = useGetFiles(activeDriveId ?? '');

  const {
    data: sharedFilesResponse,
    isLoading: isLoadingSharedFiles,
    refetch: refetchSharedFiles,
  } = useGetSharedFiles(false);

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

  const handleTabChange = (value: string) => {
    if (value === 'shared') {
      refetchSharedFiles();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">File Management</h1>
        <FileUpload onFileUploadSuccess={refetchFiles} />
      </div>

      <Tabs
        defaultValue="personal"
        className="w-full"
        onValueChange={handleTabChange}
      >
        <TabsList>
          <TabsTrigger value="personal">My Files</TabsTrigger>
          <TabsTrigger value="shared">Shared Files</TabsTrigger>
        </TabsList>
        <TabsContent value="personal">
          <FileTable
            files={filesResponse?.data || []}
            onShare={handleShare}
            onDelete={handleDelete}
            onDownload={handleDownload}
            onManagePermissions={handleManagePermissions}
            isLoading={isLoadingFiles}
          />
        </TabsContent>
        <TabsContent value="shared">
          <FileTable
            files={sharedFiles}
            onDownload={handleDownload}
            isLoading={isLoadingSharedFiles}
          />
        </TabsContent>
      </Tabs>

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

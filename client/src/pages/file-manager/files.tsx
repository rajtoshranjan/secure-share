import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui';
import { toast } from '../../hooks/use-toast';
import {
  handleResponseErrorMessage,
  useDeleteFile,
  useDownloadFile,
  useGetFiles,
} from '../../services/apis';
import { FileShareDialog } from './file-share-dialog';
import { FileUpload } from './file-upload';
import { FileTable } from './files-table';

export function FileManagementPage() {
  // States.
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Queries.
  const {
    data: filesResponse,
    isLoading: isLoadingFiles,
    refetch: refetchFiles,
  } = useGetFiles();

  const { mutate: deleteFile } = useDeleteFile();
  const { mutate: downloadFile } = useDownloadFile();

  const handleShare = (id: string) => {
    setIsShareModalOpen(true);
    // Implement sharing logic here
  };

  const handleDownload = (id: string) => {
    downloadFile(id, {
      onSuccess: (fileBlob: Blob) => {
        // FIXME: This is a temporary solution to download the file.
        const url = window.URL.createObjectURL(fileBlob);
        // Create temporary link element
        const link = document.createElement('a');
        link.href = url;
        link.download =
          filesResponse?.data.find((file) => file.id === id)?.name || 'file';
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

  const handleDelete = (id: string) => {
    deleteFile(id, {
      onSuccess: () => {
        refetchFiles();
        toast({
          title: 'File deleted successfully',
        });
      },
      onError: (error) => {
        handleResponseErrorMessage(error);
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">File Management</h1>
        <FileUpload onFileUploadSuccess={refetchFiles} />
      </div>

      <Tabs defaultValue="personal" className="w-full">
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
            isLoading={isLoadingFiles}
          />
        </TabsContent>
        <TabsContent value="shared">
          <FileTable files={[]} />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <FileShareDialog
        open={isShareModalOpen}
        onOpenChange={setIsShareModalOpen}
      />
    </div>
  );
}

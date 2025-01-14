import { Upload } from 'lucide-react';
import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../components/ui';
import {
  handleResponseErrorMessage,
  useDeleteFile,
  useDownloadFile,
  useGetFiles,
  useUploadFile,
} from '../../services/apis';
import { toast } from '../../hooks/use-toast';
import { FileTable } from './table';

export function FileManagementPage() {
  // States.
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Queries.
  const {
    data: filesResponse,
    isLoading: isLoadingFiles,
    refetch: refetchFiles,
  } = useGetFiles();

  const { mutate: uploadFile } = useUploadFile();
  const { mutate: deleteFile } = useDeleteFile();
  const { mutate: downloadFile } = useDownloadFile();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadFile(
        { file: e.target.files[0] },
        {
          onSuccess: () => {
            // Clear input
            e.target.value = '';
            refetchFiles();
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

      <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share File</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter recipient's email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="permission">Permission</Label>
              <Select>
                <SelectTrigger id="permission">
                  <SelectValue placeholder="Select permission" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="view">View</SelectItem>
                  <SelectItem value="edit">Edit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiry">Link Expiry</Label>
              <Input id="expiry" type="date" />
            </div>
            <Button className="w-full">Share</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

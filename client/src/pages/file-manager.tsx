import { Share, Trash2, Upload } from 'lucide-react';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../components/ui';

interface File {
  id: number;
  name: string;
  size: string;
  lastModified: string;
  sharedBy?: string;
}

const FileTable = ({
  files,
  onShare,
  onDelete,
}: {
  files: File[];
  onShare: (id: number) => void;
  onDelete: (id: number) => void;
}) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Name</TableHead>
        <TableHead>Size</TableHead>
        <TableHead>Last Modified</TableHead>
        {files[0]?.sharedBy && <TableHead>Shared By</TableHead>}
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {files.map((file) => (
        <TableRow key={file.id}>
          <TableCell>{file.name}</TableCell>
          <TableCell>{file.size}</TableCell>
          <TableCell>{file.lastModified}</TableCell>
          {file.sharedBy && <TableCell>{file.sharedBy}</TableCell>}
          <TableCell className="flex justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onShare(file.id)}
            >
              <Share className="mr-2 size-4" />
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(file.id)}
            >
              <Trash2 className="mr-2 size-4" />
              Delete
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export function FileManagementPage() {
  const [personalFiles, setPersonalFiles] = useState<File[]>([
    { id: 1, name: 'Document.pdf', size: '2.5 MB', lastModified: '2023-05-15' },
    { id: 2, name: 'Image.jpg', size: '1.8 MB', lastModified: '2023-05-14' },
    {
      id: 3,
      name: 'Spreadsheet.xlsx',
      size: '3.2 MB',
      lastModified: '2023-05-13',
    },
  ]);

  const [sharedFiles, setSharedFiles] = useState<File[]>([
    {
      id: 4,
      name: 'SharedDoc.pdf',
      size: '1.5 MB',
      lastModified: '2023-05-16',
      sharedBy: 'John Doe',
    },
    {
      id: 5,
      name: 'TeamPresentation.pptx',
      size: '5.7 MB',
      lastModified: '2023-05-17',
      sharedBy: 'Jane Smith',
    },
  ]);

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFile: File = {
        id: Date.now(),
        name: e.target.files[0].name,
        size: `${(e.target.files[0].size / 1024 / 1024).toFixed(2)} MB`,
        lastModified: new Date().toISOString().split('T')[0],
      };
      setPersonalFiles([...personalFiles, newFile]);
    }
  };

  const handleShare = (id: number) => {
    setIsShareModalOpen(true);
    // Implement sharing logic here
  };

  const handleDelete = (id: number) => {
    setPersonalFiles(personalFiles.filter((file) => file.id !== id));
    setSharedFiles(sharedFiles.filter((file) => file.id !== id));
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
            files={personalFiles}
            onShare={handleShare}
            onDelete={handleDelete}
          />
        </TabsContent>
        <TabsContent value="shared">
          <FileTable
            files={sharedFiles}
            onShare={handleShare}
            onDelete={handleDelete}
          />
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

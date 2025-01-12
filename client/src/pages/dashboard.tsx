import { Share, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
} from '../components/ui';

export function DashboardPage() {
  const [files, setFiles] = useState([
    { id: 1, name: 'Document.pdf', size: '2.5 MB', lastModified: '2023-05-15' },
    { id: 2, name: 'Image.jpg', size: '1.8 MB', lastModified: '2023-05-14' },
    {
      id: 3,
      name: 'Spreadsheet.xlsx',
      size: '3.2 MB',
      lastModified: '2023-05-13',
    },
  ]);

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFile = {
        id: files.length + 1,
        name: e.target.files[0].name,
        size: `${(e.target.files[0].size / 1024 / 1024).toFixed(2)} MB`,
        lastModified: new Date().toISOString().split('T')[0],
      };
      setFiles([...files, newFile]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Files</h1>
        <Button>Upload File</Button>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          onChange={handleFileUpload}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Last Modified</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => (
            <TableRow key={file.id}>
              <TableCell>{file.name}</TableCell>
              <TableCell>{file.size}</TableCell>
              <TableCell>{file.lastModified}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Dialog
                    open={isShareModalOpen}
                    onOpenChange={setIsShareModalOpen}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Share className="mr-2 size-4" />
                        Share
                      </Button>
                    </DialogTrigger>
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
                  <Button variant="outline" size="sm">
                    <Trash2 className="mr-2 size-4" />
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

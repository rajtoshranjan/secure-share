import { Download, Share2, Trash2 } from 'lucide-react';
import React from 'react';
import {
  Button,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui';
import { FileData } from '../../services/apis';
import { formatBytes, formatDate, StringFormatter } from '../../lib/utils';

type FileTableProps = {
  files: FileData[];
  onShare?: (id: string) => void;
  onDelete?: (id: string) => void;
  onDownload?: (id: string) => void;
  isLoading?: boolean;
};

export const FileTable: React.FC<FileTableProps> = ({
  files,
  onShare,
  onDelete,
  onDownload,
  isLoading,
}) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Name</TableHead>
        <TableHead>Size</TableHead>
        <TableHead>Uploaded At</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {isLoading ? (
        <TableRow>
          <TableCell colSpan={4} className="text-center">
            <Spinner />
          </TableCell>
        </TableRow>
      ) : files.length === 0 ? (
        <TableRow>
          <TableCell colSpan={4} className="text-center">
            No files found
          </TableCell>
        </TableRow>
      ) : (
        files.map((file) => (
          <TableRow key={file.id}>
            <TableCell title={file.name}>
              {StringFormatter.truncate(file.name, 50)}
            </TableCell>
            <TableCell className="whitespace-nowrap">
              {formatBytes(file.size)}
            </TableCell>
            <TableCell>{formatDate(file.createdAt)}</TableCell>
            <TableCell className="flex justify-end space-x-2">
              {onDownload && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDownload(file.id)}
                >
                  <Download className="size-4" />
                </Button>
              )}
              {onShare && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onShare(file.id)}
                >
                  <Share2 className="size-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(file.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))
      )}
    </TableBody>
  </Table>
);

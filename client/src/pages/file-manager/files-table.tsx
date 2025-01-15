import {
  Ban,
  Download,
  Info,
  MoreVertical,
  Share2,
  Trash2,
} from 'lucide-react';
import React from 'react';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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

type FileTableData = FileData & {
  canDownload?: boolean;
  canShare?: boolean;
  canDelete?: boolean;
};

type FileTableProps = {
  files: FileTableData[];
  onShare?: (id: string) => void;
  onDelete?: (id: string) => void;
  onDownload?: (file: FileData) => void;
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
        <TableHead className="w-[50px]" />
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
        files.map((file) => {
          const canDownloadFile = onDownload && file.canDownload !== false;
          const canShareFile = onShare && file.canShare !== false;
          const canDeleteFile = onDelete && file.canDelete !== false;
          const hasNoActions =
            !canDownloadFile && !canShareFile && !canDeleteFile;

          return (
            <TableRow key={file.id}>
              <TableCell title={file.name}>
                {StringFormatter.truncate(file.name, 50)}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {formatBytes(file.size)}
              </TableCell>
              <TableCell>{formatDate(file.createdAt)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8 p-0">
                      <MoreVertical className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {hasNoActions && (
                      <div className="flex items-center gap-2 p-2 text-sm text-muted-foreground">
                        <Ban className="size-4" />
                        No actions allowed
                      </div>
                    )}
                    {canDownloadFile && (
                      <DropdownMenuItem
                        onClick={() => onDownload(file)}
                        className="gap-2"
                      >
                        <Download className="size-4" />
                        Download
                      </DropdownMenuItem>
                    )}
                    {canShareFile && (
                      <DropdownMenuItem
                        onClick={() => onShare(file.id)}
                        className="gap-2"
                      >
                        <Share2 className="size-4" />
                        Share
                      </DropdownMenuItem>
                    )}
                    {canDeleteFile && (
                      <DropdownMenuItem
                        onClick={() => onDelete(file.id)}
                        className="gap-2 text-destructive focus:text-destructive"
                      >
                        <Trash2 className="size-4" />
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          );
        })
      )}
    </TableBody>
  </Table>
);

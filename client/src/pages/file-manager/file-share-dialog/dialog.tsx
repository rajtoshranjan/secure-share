import { DialogDescription, DialogProps } from '@radix-ui/react-dialog';
import React from 'react';
import { FileIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../../components/ui';
import { FileData } from '../../../services/apis';
import { StringFormatter } from '../../../lib/utils';
import { ShareWithUser } from './share-with-user';
import { GenerateLink } from './generate-link';

type FileShareDialogProps = DialogProps & {
  file: FileData | null;
};

export const FileShareDialog = ({ file, ...props }: FileShareDialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share File</DialogTitle>
          <DialogDescription
            className="flex items-center gap-1 text-sm text-muted-foreground"
            title={file?.name}
          >
            <FileIcon className="size-4" />
            <span className="font-medium">
              {StringFormatter.truncate(file?.name ?? '', 30)}
            </span>
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="user" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="user">Share with User</TabsTrigger>
            <TabsTrigger value="link">Generate Link</TabsTrigger>
          </TabsList>

          <TabsContent value="user" className="space-y-4">
            <ShareWithUser
              fileId={file?.id ?? ''}
              onSuccess={() => props.onOpenChange?.(false)}
            />
          </TabsContent>

          <TabsContent value="link" className="space-y-4">
            <GenerateLink fileId={file?.id ?? ''} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

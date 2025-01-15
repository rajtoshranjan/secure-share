import { DialogProps } from '@radix-ui/react-dialog';
import React from 'react';
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
import { ShareWithUser } from './share-with-user';
import { GenerateLink } from './generate-link';

type FileShareDialogProps = DialogProps & {
  fileId: string;
};

export const FileShareDialog = ({ fileId, ...props }: FileShareDialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share File</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="user" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="user">Share with User</TabsTrigger>
            <TabsTrigger value="link">Generate Link</TabsTrigger>
          </TabsList>

          <TabsContent value="user" className="space-y-4">
            <ShareWithUser
              fileId={fileId}
              onSuccess={() => props.onOpenChange?.(false)}
            />
          </TabsContent>

          <TabsContent value="link" className="space-y-4">
            <GenerateLink fileId={fileId} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export * from './share-with-user';
export * from './generate-link';

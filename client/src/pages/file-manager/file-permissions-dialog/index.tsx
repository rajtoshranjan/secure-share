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
import { UserPermissions } from './user-permissions';
import { SharedLinks } from './shared-links';

type FilePermissionsDialogProps = DialogProps & {
  fileId: string;
};

export const FilePermissionsDialog = ({
  fileId,
  ...props
}: FilePermissionsDialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className="outline-none sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Manage Access</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="users" className="h-[350px] w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users">User Access</TabsTrigger>
            <TabsTrigger value="links">Shared Links</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <UserPermissions fileId={fileId} />
          </TabsContent>

          <TabsContent value="links" className="space-y-4">
            <SharedLinks fileId={fileId} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

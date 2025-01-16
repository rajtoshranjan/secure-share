import { DialogDescription, DialogProps } from '@radix-ui/react-dialog';
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
import { StringFormatter } from '../../../lib/utils';
import { FileData } from '../../../services/apis';
import { SharedLinks } from './shared-links';
import { UserPermissions } from './user-permissions';

type FilePermissionsDialogProps = DialogProps & {
  file: FileData | null;
};

export const FilePermissionsDialog = ({
  file,
  ...props
}: FilePermissionsDialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className="outline-none sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Manage Access</DialogTitle>
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

        <Tabs defaultValue="users" className="h-[350px] w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users">User Access</TabsTrigger>
            <TabsTrigger value="links">Shared Links</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <UserPermissions fileId={file?.id ?? ''} />
          </TabsContent>

          <TabsContent value="links" className="space-y-4">
            <SharedLinks fileId={file?.id ?? ''} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

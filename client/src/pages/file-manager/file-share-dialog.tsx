import { DialogProps } from '@radix-ui/react-dialog';
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

type ShareDialogProps = DialogProps & {
  onShareWithUser?: (data: { email: string; canWrite: boolean }) => void;
  onGenerateLink?: (data: { expiresAt: string }) => void;
};

export const FileShareDialog: React.FC<ShareDialogProps> = ({
  onShareWithUser,
  onGenerateLink,
  ...props
}) => {
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState<'view' | 'edit'>('view');
  const [expiryDate, setExpiryDate] = useState('');

  const handleShareWithUser = () => {
    onShareWithUser?.({
      email,
      canWrite: permission === 'edit',
    });
  };

  const handleGenerateLink = () => {
    onGenerateLink?.({
      expiresAt: expiryDate,
    });
  };

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
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter recipient's email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="permission">Permission</Label>
              <Select
                value={permission}
                onValueChange={(value) =>
                  setPermission(value as 'view' | 'edit')
                }
              >
                <SelectTrigger id="permission">
                  <SelectValue placeholder="Select permission" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="view">View only</SelectItem>
                  <SelectItem value="edit">Can edit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              className="w-full"
              onClick={handleShareWithUser}
              disabled={!email}
            >
              Share with User
            </Button>
          </TabsContent>

          <TabsContent value="link" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">Link Expiry</Label>
              <Input
                id="expiry"
                type="datetime-local"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>
            <Button
              className="w-full"
              onClick={handleGenerateLink}
              disabled={!expiryDate}
            >
              Generate Link
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

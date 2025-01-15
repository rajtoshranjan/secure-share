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
} from '../../ui';
import { ProfileForm } from './profile-form';
import { PasswordChangeForm } from './password-change-form';

export const ProfileDialog: React.FC<DialogProps> = (props) => {
  return (
    <Dialog {...props}>
      <DialogContent className="outline-none sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Profile Settings</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Personal Info</TabsTrigger>
            <TabsTrigger value="password">Change Password</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <ProfileForm onSuccess={() => props.onOpenChange?.(false)} />
          </TabsContent>

          <TabsContent value="password" className="space-y-4">
            <PasswordChangeForm onSuccess={() => props.onOpenChange?.(false)} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

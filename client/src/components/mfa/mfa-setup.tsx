import React from 'react';
import { useGetActiveMFAMethods } from '../../services/apis';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui';
import { MFAActivate } from './mfa-activate';
import { MFADeactivate } from './mfa-deactivate';

type MFASetupProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const MFASetup: React.FC<MFASetupProps> = ({ open, onOpenChange }) => {
  const { data: activeMethods, refetch: refetchMethods } =
    useGetActiveMFAMethods();
  const isMfaActive = activeMethods?.data?.some((m) => m.name === 'app');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          {!isMfaActive && (
            <DialogTitle>Setup two-factor authentication</DialogTitle>
          )}
        </DialogHeader>
        {isMfaActive ? (
          <MFADeactivate onDeactivationSuccess={refetchMethods} />
        ) : (
          <MFAActivate
            onActivationSuccess={() => {
              refetchMethods();
              onOpenChange(false);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

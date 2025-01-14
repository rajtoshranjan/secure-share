import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  handleResponseErrorMessage,
  useActivateMFA,
  useConfirmMFA,
} from '../../services/apis';
import { Button, Input, Label } from '../ui';

type MFAActivateProps = {
  onActivationSuccess: () => void;
};

const activateMfaSchema = z.object({
  code: z.string().length(6, 'MFA code must be 6 digits'),
});

type ActivateMFAFormData = z.infer<typeof activateMfaSchema>;

export const MFAActivate: React.FC<MFAActivateProps> = ({
  onActivationSuccess,
}) => {
  // States.
  const [qrCodeSecret, setQrCodeSecret] = useState<string | null>(null);
  const [backupCodes, setBackupCodes] = useState<number[] | null>(null);

  // Queries.
  const { mutate: activate, isPending: isActivatePending } = useActivateMFA();
  const {
    mutate: sendConfirmMFARequest,
    isPending: isConfirmPending,
    isSuccess: isConfirmSuccess,
  } = useConfirmMFA();

  // Hooks.
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ActivateMFAFormData>({
    resolver: zodResolver(activateMfaSchema),
  });

  // Effects.
  useEffect(() => {
    handleActivate();
  }, []);

  // Handlers.
  const handleActivate = () => {
    activate('app', {
      onSuccess: (response) => {
        if (response.data) {
          setQrCodeSecret(response.data.details);
        }
      },
      onError: (error) => {
        handleResponseErrorMessage(error);
      },
    });
  };

  const onSubmit = (data: ActivateMFAFormData) => {
    sendConfirmMFARequest(
      { method: 'app', code: data.code },
      {
        onSuccess: (response) => {
          setBackupCodes(response.data.backup_codes);
        },
        onError: (error) => {
          handleResponseErrorMessage(error, setError);
        },
      },
    );
  };

  return (
    <>
      {isConfirmSuccess && backupCodes ? (
        <div className="grid gap-4">
          <p className="text-sm text-muted-foreground">
            Please save these backup codes in a secure location. You can use
            them to access your account if you lose access to your authenticator
            app.
          </p>
          <div className="grid gap-2 rounded-md border p-4">
            <div className="grid grid-cols-2 gap-2">
              {backupCodes.map((code, index) => (
                <div key={index} className="font-mono text-sm">
                  {code}
                </div>
              ))}
            </div>
          </div>
          <Button onClick={onActivationSuccess}>Done</Button>
        </div>
      ) : (
        <>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Scan this QR code with your authenticator app
            </p>
          </div>
          <div className="flex justify-center">
            {isActivatePending ? (
              <div className="flex size-[200px] items-center justify-center">
                <Loader2 className="size-8 animate-spin" />
              </div>
            ) : qrCodeSecret ? (
              <QRCodeCanvas
                value={qrCodeSecret}
                size={200}
                className="rounded-sm border-4 border-white"
              />
            ) : (
              <Button variant="outline" onClick={handleActivate}>
                Reload QR Code
              </Button>
            )}
          </div>
          <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-2">
              <Label htmlFor="code">Verification Code</Label>
              <Input
                {...register('code')}
                id="code"
                type="text"
                placeholder="Enter 6-digit code"
                error={errors.code?.message}
              />
            </div>
            <Button type="submit" loading={isConfirmPending}>
              Verify and Get Backup Codes
            </Button>
          </form>
        </>
      )}
    </>
  );
};

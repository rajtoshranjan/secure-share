import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { QRCodeCanvas } from 'qrcode.react';
import { Loader2 } from 'lucide-react';
import {
  handleResponseErrorMessage,
  useActivateMFA,
  useConfirmMFA,
} from '../services/apis';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
} from './ui';

const setupSchema = z.object({
  code: z.string().length(6, 'MFA code must be 6 digits'),
});

type SetupFormData = z.infer<typeof setupSchema>;

interface MFASetupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MFASetup({ open, onOpenChange }: MFASetupProps) {
  const [qrCodeSecret, setQrCodeSecret] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SetupFormData>({
    resolver: zodResolver(setupSchema),
  });

  const { mutate: activate, isPending: isActivatePending } = useActivateMFA();

  const {
    mutate: confirm,
    isPending,
    isError: isConfirmError,
    error: confirmError,
    isSuccess,
    data: confirmResponse,
  } = useConfirmMFA();

  useEffect(() => {
    if (open) {
      handleActivate();
    }
  }, [open]);

  useEffect(() => {
    if (isSuccess && confirmResponse?.data) {
      onOpenChange(false);
    } else {
      handleResponseErrorMessage(isConfirmError, confirmError, setError);
    }
  }, [isSuccess, isConfirmError]);

  const onSubmit = (data: SetupFormData) => {
    confirm({ method: 'app', code: data.code });
  };

  const handleActivate = () => {
    activate('app', {
      onSuccess: (response) => {
        if (response.data) {
          setQrCodeSecret(response.data.details);
        }
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set up two-factor authentication</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6">
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
            <Button type="submit" loading={isPending}>
              Verify and Get Backup Codes
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

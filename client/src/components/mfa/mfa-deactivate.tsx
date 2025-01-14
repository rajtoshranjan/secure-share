import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  handleResponseErrorMessage,
  useDeactivateMFA,
} from '../../services/apis';
import {
  Button,
  Input,
  Label,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../ui';

type MFADeactivateProps = {
  onDeactivationSuccess: () => void;
};

const deactivateSchema = z.object({
  code: z.string().length(6, 'MFA code must be 6 digits'),
});

type DeactivateMFAFormData = z.infer<typeof deactivateSchema>;

export const MFADeactivate: React.FC<MFADeactivateProps> = ({
  onDeactivationSuccess,
}) => {
  const { mutate: deactivate, isPending: isDeactivating } = useDeactivateMFA();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DeactivateMFAFormData>({
    resolver: zodResolver(deactivateSchema),
  });

  const onSubmit = (data: DeactivateMFAFormData) => {
    deactivate(
      { method: 'app', code: data.code },
      {
        onSuccess: () => {
          onDeactivationSuccess();
        },
        onError: (error) => {
          handleResponseErrorMessage(error);
        },
      },
    );
  };

  return (
    <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="code">Enter Code to Deactivate</Label>
          <Tooltip>
            <TooltipTrigger>
              <span className="cursor-help text-sm text-muted-foreground">
                ⓘ
              </span>
            </TooltipTrigger>
            <TooltipContent>
              Open your authenticator app to get the current code
            </TooltipContent>
          </Tooltip>
        </div>
        <Input
          {...register('code')}
          id="code"
          type="text"
          placeholder="Enter 6-digit code"
          error={errors.code?.message}
        />
      </div>
      <Button type="submit" variant="destructive" loading={isDeactivating}>
        Deactivate MFA
      </Button>
    </form>
  );
};

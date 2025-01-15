import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Label } from '../../ui';
import { useChangePassword } from '../../../services/apis/auth';
import { toast } from '../../../hooks';
import { handleResponseErrorMessage } from '../../../services/apis';

const passwordChangeFormSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type PasswordChangeFormData = z.infer<typeof passwordChangeFormSchema>;

type PasswordChangeFormProps = {
  onSuccess?: () => void;
};

export const PasswordChangeForm = ({ onSuccess }: PasswordChangeFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setError,
  } = useForm<PasswordChangeFormData>({
    resolver: zodResolver(passwordChangeFormSchema),
  });

  const { mutate: changePassword, isPending } = useChangePassword();

  const handlePasswordChange = (data: PasswordChangeFormData) => {
    changePassword(
      {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      },
      {
        onSuccess: () => {
          toast({
            title: 'Password changed successfully',
          });
          onSuccess?.();
        },
        onError: (error) => {
          handleResponseErrorMessage(error, setError);
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(handlePasswordChange)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="currentPassword">Current Password</Label>
        <Input
          id="currentPassword"
          type="password"
          {...register('currentPassword')}
          error={errors.currentPassword?.message}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword">New Password</Label>
        <Input
          id="newPassword"
          type="password"
          {...register('newPassword')}
          error={errors.newPassword?.message}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        loading={isPending}
        disabled={!isDirty}
      >
        Change Password
      </Button>
    </form>
  );
};

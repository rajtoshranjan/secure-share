import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Label } from '../../ui';
import { useGetUserInfo, useUpdateProfile } from '../../../services/apis/auth';
import { toast } from '../../../hooks';
import { handleResponseErrorMessage } from '../../../services/apis';

const profileFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
});

type ProfileFormData = z.infer<typeof profileFormSchema>;

type ProfileFormProps = {
  onSuccess?: () => void;
};

export const ProfileForm = ({ onSuccess }: ProfileFormProps) => {
  // Queries.
  const { data: userResponse } = useGetUserInfo();
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  // Hooks.
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setError,
    setValue,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  // Effects.
  useEffect(() => {
    if (userResponse?.data) {
      setValue('name', userResponse.data.name);
      setValue('email', userResponse.data.email);
    }
  }, [userResponse?.data]);

  // Handlers.
  const handleUpdateProfile = (data: ProfileFormData) => {
    updateProfile(
      { name: data.name }, // Only send name in payload
      {
        onSuccess: () => {
          toast({
            title: 'Profile updated successfully',
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
    <form onSubmit={handleSubmit(handleUpdateProfile)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...register('name')} error={errors.name?.message} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          error={errors.email?.message}
          readOnly
          className="bg-muted"
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        loading={isPending}
        disabled={!isDirty}
      >
        Update Profile
      </Button>
    </form>
  );
};

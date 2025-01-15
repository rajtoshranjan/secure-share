import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui';
import { useShareWithUser } from '../../../services/apis/files';
import { toast } from '../../../hooks';
import { handleResponseErrorMessage } from '../../../services/apis';

type ShareWithUserForm = {
  email: string;
  permission: 'view' | 'download';
};

type ShareWithUserProps = {
  fileId: string;
  onSuccess?: () => void;
};

export const ShareWithUser = ({ fileId, onSuccess }: ShareWithUserProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
  } = useForm<ShareWithUserForm>({
    defaultValues: {
      permission: 'view',
    },
  });

  const { mutate: shareWithUser, isPending } = useShareWithUser();

  const handleShareWithUser = (data: ShareWithUserForm) => {
    shareWithUser(
      {
        file: fileId,
        email: data.email,
        canDownload: data.permission === 'download',
      },
      {
        onSuccess: () => {
          toast({
            title: 'File shared successfully',
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
    <form onSubmit={handleSubmit(handleShareWithUser)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter recipient's email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
          error={errors.email?.message}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="permission">Permission</Label>
        <Select
          defaultValue="view"
          onValueChange={(value) =>
            register('permission').onChange({
              target: { value, name: 'permission' },
            })
          }
        >
          <SelectTrigger id="permission">
            <SelectValue placeholder="Select permission" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="view">View only</SelectItem>
            <SelectItem value="download">Can download</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={!watch('email')}
        loading={isPending}
      >
        Share with User
      </Button>
    </form>
  );
};

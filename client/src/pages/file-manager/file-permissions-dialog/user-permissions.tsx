import { Loader2, Trash2, UserX } from 'lucide-react';
import React from 'react';
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui';
import {
  useFilePermissions,
  useUpdateFilePermission,
  useRevokeFilePermission,
  handleResponseErrorMessage,
} from '../../../services/apis';
import { toast } from '../../../hooks';

type UserPermissionsProps = {
  fileId: string;
};

export const UserPermissions = ({ fileId }: UserPermissionsProps) => {
  const {
    data: filePermissionsResponse,
    isLoading,
    refetch: refetchFilePermissions,
  } = useFilePermissions(fileId);
  const { mutate: updateFilePermission } = useUpdateFilePermission();
  const { mutate: revokeFilePermission } = useRevokeFilePermission();

  const handlePermissionChange = (
    permissionId: string,
    canDownload: boolean,
  ) => {
    updateFilePermission(
      { id: permissionId, canDownload },
      {
        onSuccess: () => {
          toast({
            title: 'Permission updated successfully',
          });
          refetchFilePermissions();
        },
        onError: (error) => {
          handleResponseErrorMessage(error);
        },
      },
    );
  };

  const handleRevokeAccess = (permissionId: string) => {
    revokeFilePermission(
      { id: permissionId },
      {
        onSuccess: () => {
          toast({
            title: 'Access revoked successfully',
          });
          refetchFilePermissions();
        },
        onError: (error) => {
          handleResponseErrorMessage(error);
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="size-6 animate-spin" />
      </div>
    );
  }

  const hasPermissions =
    filePermissionsResponse?.data && filePermissionsResponse.data.length > 0;

  return (
    <div className="flex h-[300px] flex-col">
      <div className="flex-none">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Permission</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      </div>
      <div className="flex-1 overflow-auto">
        <Table>
          <TableBody>
            {!hasPermissions ? (
              <TableRow>
                <TableCell colSpan={4} className="h-[200px]">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <UserX className="size-8" />
                    <p>No users have access</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filePermissionsResponse.data.map((permission) => (
                <TableRow key={permission.id}>
                  <TableCell className="whitespace-nowrap">
                    {permission.sharedWithName}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {permission.sharedWithEmail}
                  </TableCell>
                  <TableCell>
                    <Select
                      defaultValue={
                        permission.canDownload ? 'download' : 'view'
                      }
                      onValueChange={(value) =>
                        handlePermissionChange(
                          permission.id,
                          value === 'download',
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="view">View Only</SelectItem>
                        <SelectItem value="download">Can Download</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRevokeAccess(permission.id)}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

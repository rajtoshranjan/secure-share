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
  useFileShares,
  useUpdateSharePermission,
  useRevokeFileShare,
  handleResponseErrorMessage,
} from '../../../services/apis';
import { toast } from '../../../hooks';

type UserPermissionsProps = {
  fileId: string;
};

export const UserPermissions = ({ fileId }: UserPermissionsProps) => {
  const {
    data: sharesResponse,
    isLoading,
    refetch: refetchShares,
  } = useFileShares(fileId);
  const { mutate: updateShare } = useUpdateSharePermission();
  const { mutate: revokeShare } = useRevokeFileShare();

  const handlePermissionChange = (shareId: string, canDownload: boolean) => {
    updateShare(
      { id: shareId, canDownload },
      {
        onSuccess: () => {
          toast({
            title: 'Permission updated successfully',
          });
          refetchShares();
        },
        onError: (error) => {
          handleResponseErrorMessage(error);
        },
      },
    );
  };

  const handleRevokeAccess = (shareId: string) => {
    revokeShare(
      { id: shareId },
      {
        onSuccess: () => {
          toast({
            title: 'Access revoked successfully',
          });
          refetchShares();
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

  const hasShares = sharesResponse?.data && sharesResponse.data.length > 0;

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
            {!hasShares ? (
              <TableRow>
                <TableCell colSpan={4} className="h-[200px]">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <UserX className="size-8" />
                    <p>No users have access</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              sharesResponse.data.map((share) => (
                <TableRow key={share.id}>
                  <TableCell className="whitespace-nowrap">
                    {share.sharedWithName}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {share.sharedWithEmail}
                  </TableCell>
                  <TableCell>
                    <Select
                      defaultValue={share.canDownload ? 'download' : 'view'}
                      onValueChange={(value) =>
                        handlePermissionChange(share.id, value === 'download')
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
                      onClick={() => handleRevokeAccess(share.id)}
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

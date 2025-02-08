import { useState } from 'react';
import { Trash2, UserPlus, Mail, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
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
  Spinner,
} from '../components/ui';
import { toast } from '../hooks/use-toast';
import {
  useGetDriveMembers,
  useAddDriveMember,
  useUpdateDriveMember,
  useRemoveDriveMember,
  handleResponseErrorMessage,
  DriveRole,
} from '../services/apis';
import { AddDriveMemberPayload } from '../services/apis/drives/types';
import { selectActiveDrive } from '../store/slices/drive-slice';

export function UsersPage() {
  // Store.
  const { canManageUsers } = useAppSelector(selectActiveDrive);
  const { activeDriveId } = useAppSelector(selectActiveDrive);

  // States.
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const form = useForm<AddDriveMemberPayload>();

  // Navigation.
  const navigate = useNavigate();
  if (!canManageUsers) {
    navigate('/');
  }

  // Queries.
  const {
    data: membersResponse,
    isPending,
    refetch,
  } = useGetDriveMembers(activeDriveId ?? '', canManageUsers);
  const { mutate: addMember } = useAddDriveMember();
  const { mutate: updateMember } = useUpdateDriveMember();
  const { mutate: removeMember } = useRemoveDriveMember();

  const handleAddUser = (data: AddDriveMemberPayload) => {
    addMember(data, {
      onSuccess: () => {
        toast({
          title: 'User added successfully',
        });
        setIsAddUserModalOpen(false);
        refetch();
        form.reset();
      },
      onError: (error) => {
        handleResponseErrorMessage(error, form.setError);
      },
    });
  };

  const handleUpdateRole = (memberId: string, role: DriveRole) => {
    updateMember(
      { id: memberId, role },
      {
        onSuccess: () => {
          toast({
            title: 'User role updated successfully',
          });
          refetch();
        },
        onError: (error) => {
          handleResponseErrorMessage(error);
        },
      },
    );
  };

  const handleDelete = (memberId: string) => {
    removeMember(memberId, {
      onSuccess: () => {
        toast({
          title: 'User removed successfully',
        });
        refetch();
      },
      onError: (error) => {
        handleResponseErrorMessage(error);
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Drive Members
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Add and manage members who can access the drive
          </p>
        </div>
        <div className="flex items-center">
          <Dialog
            open={isAddUserModalOpen}
            onOpenChange={setIsAddUserModalOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 size-4" />
                Add Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Member</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={form.handleSubmit(handleAddUser)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...form.register('email')}
                    error={form.formState.errors.email?.message}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    onValueChange={(value) =>
                      form.setValue('role', value as DriveRole)
                    }
                    value={form.watch('role')}
                  >
                    <SelectTrigger
                      id="role"
                      className={
                        form.formState.errors.role ? 'border-destructive' : ''
                      }
                    >
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="regular">Regular</SelectItem>
                      <SelectItem value="guest">Guest</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.role && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.role.message}
                    </p>
                  )}
                </div>
                <Button type="submit" className="w-full">
                  Add Member
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  <div className="flex justify-center">
                    <Spinner />
                  </div>
                </TableCell>
              </TableRow>
            ) : membersResponse?.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  No members found
                </TableCell>
              </TableRow>
            ) : (
              membersResponse?.data.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                        <User className="size-5 text-secondary-foreground" />
                      </div>
                      <div>
                        <div className="font-medium">{member.userName}</div>
                        <div className="text-sm text-muted-foreground">
                          {member.userEmail}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      defaultValue={member.role}
                      onValueChange={(value) =>
                        handleUpdateRole(member.id, value as DriveRole)
                      }
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="regular">Regular</SelectItem>
                        <SelectItem value="guest">Guest</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(member.id)}
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
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
}

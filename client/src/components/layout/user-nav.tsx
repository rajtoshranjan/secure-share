import { User } from 'lucide-react';
import React, { useState } from 'react';
import { localStorageManager } from '../../lib/utils';
import { useLogout } from '../../services/apis/auth';
import { logout } from '../../services/apis/helpers';
import {
  Button,
  ButtonProps,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui';
import { MFASetup } from './mfa';
import { ProfileDialog } from './profile';

export const UserNav: React.FC<ButtonProps> = (props) => {
  // States.
  const [showMFASetup, setShowMFASetup] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);

  // Hooks.
  const { mutate: sendLogoutRequest } = useLogout();

  // Handlers.
  const handleLogout = () => {
    const refreshToken = localStorageManager.getRefreshToken();
    if (refreshToken) {
      sendLogoutRequest(
        {
          refreshToken,
        },
        {
          onSuccess: () => {
            logout();
          },
          onError: () => {
            logout();
          },
        },
      );
    } else {
      logout();
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button {...props}>
            <User className="size-3.5 sm:size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuItem onClick={() => setShowProfileDialog(true)}>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <button className="w-full" onClick={() => setShowMFASetup(true)}>
              Setup MFA
            </button>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <button className="w-full" onClick={handleLogout}>
              Log out
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <MFASetup open={showMFASetup} onOpenChange={setShowMFASetup} />
      <ProfileDialog
        open={showProfileDialog}
        onOpenChange={setShowProfileDialog}
      />
    </>
  );
};

import { User } from 'lucide-react';
import { useState } from 'react';
import { logout } from '../services/apis/helpers';
import { MFASetup } from './mfa';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui';

export function UserNav() {
  const [showMFASetup, setShowMFASetup] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative size-8">
            <User className="size-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuItem asChild>
            <button className="w-full" onClick={() => {}}>
              Profile
            </button>
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
    </>
  );
}

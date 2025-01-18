import { Moon, Sun } from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Theme } from '../../store/enums';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  selectTheme,
  toggleTheme,
  selectActiveDrive,
} from '../../store/slices';
import { CustomIcons } from '../icons';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { SelectDrive } from './select-drive';
import { UserNav } from './user-nav';

export function Layout() {
  // Store.
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectTheme);
  const { canManageUsers } = useAppSelector(selectActiveDrive);

  // Constants.
  const menuItems = [
    { path: '/', label: 'Files', show: true },
    { path: '/users', label: 'Users', show: canManageUsers },
    { path: '/shared-with-me', label: 'Shared with me', show: true },
  ];

  // Hooks.
  const pathname = useLocation().pathname;

  // Handlers.
  const handleThemeChange = () => {
    dispatch(toggleTheme());
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50">
        {/* Main Header */}
        <nav className="border-b bg-muted">
          <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
            <div className="flex h-14 items-center justify-between">
              <div className="flex items-center gap-3 sm:gap-8">
                <Link to="/" className="flex items-center gap-2">
                  <CustomIcons.SafeFile className="size-4 text-primary sm:size-5" />
                  <span className="text-base font-semibold tracking-tight sm:text-lg">
                    SecureShare
                  </span>
                </Link>

                <SelectDrive />
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2">
                <Button
                  variant="ghost"
                  onClick={handleThemeChange}
                  size="icon"
                  className="size-7 rounded-full hover:bg-background/60 sm:size-8"
                >
                  {theme.current === Theme.Dark ? (
                    <Sun className="size-3.5 sm:size-4" />
                  ) : (
                    <Moon className="size-3.5 sm:size-4" />
                  )}
                </Button>
                <UserNav
                  variant="ghost"
                  size="icon"
                  className="size-7 rounded-full hover:bg-background/60 sm:size-8"
                />
              </div>
            </div>
          </div>
        </nav>

        {/* Sub Header */}
        <nav className="border-b bg-card/40 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
            <div className="flex h-10 items-center justify-between">
              <div className="flex items-center space-x-4">
                {menuItems
                  .filter((item) => item.show)
                  .map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        'text-sm font-medium transition-colors hover:text-primary',
                        pathname === item.path
                          ? 'text-primary'
                          : 'text-muted-foreground',
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-3 py-4 sm:p-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}

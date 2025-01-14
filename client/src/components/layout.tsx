import { Moon, Sun } from 'lucide-react';
import { Link, Outlet } from 'react-router-dom';
import { Theme } from '../hooks';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleTheme } from '../store/slices/theme-slice';
import { CustomIcons } from './icons';
import { Button } from './ui/button';
import { UserNav } from './user-nav';

export function Layout() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.current);

  const handleThemeChange = () => {
    dispatch(toggleTheme());
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-12 justify-between">
            <div className="flex">
              <Link to="/" className="flex shrink-0 items-center">
                <CustomIcons.SafeFile className="size-4 text-primary md:size-6" />
                <span className="ml-2 font-bold md:text-xl">SecureShare</span>
              </Link>
            </div>
            <div className="flex items-center space-x-0 md:space-x-2">
              <Button variant="ghost">
                <Link to="/">Files</Link>
              </Button>
              <Button variant="ghost">
                <Link to="/users">Users</Link>
              </Button>
              <Button variant="ghost" onClick={handleThemeChange} size="icon">
                {theme === Theme.Dark ? (
                  <Sun className="size-5" />
                ) : (
                  <Moon className="size-5" />
                )}
              </Button>
              <UserNav />
            </div>
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}

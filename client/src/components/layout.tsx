import { LogOut, Moon, Sun } from 'lucide-react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Theme, useTheme } from '../hooks';
import { CustomIcons } from './icons';
import { Button } from './ui/button';

export function Layout() {
  // States.
  const { theme, setTheme } = useTheme();

  // Hooks.
  const navigate = useNavigate();

  // Handlers.
  const toggleTheme = () => {
    setTheme((prev) => {
      if (prev === Theme.Dark) return Theme.Light;
      else return Theme.Dark;
    });
  };

  const handleLogout = () => {
    // TODO: Implement actual logout logic here
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-12 justify-between">
            <div className="flex">
              <Link to="/" className="flex shrink-0 items-center">
                <CustomIcons.SafeFile className="size-6 text-primary" />
                <span className="ml-2 text-xl font-bold">SecureShare</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link to="/">Dashboard</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/users">Users</Link>
              </Button>
              <Button variant="ghost" onClick={toggleTheme} size="icon">
                {theme === 'dark' ? (
                  <Sun className="size-5" />
                ) : (
                  <Moon className="size-5" />
                )}
              </Button>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="size-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}

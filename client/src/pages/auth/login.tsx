import { Link, useNavigate } from 'react-router-dom';
import { FormEvent, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from '../../components/ui';

export function LoginPage() {
  // State.
  const [step, setStep] = useState<'login' | 'mfa'>('login');

  // Hooks.
  const navigate = useNavigate();

  // Handlers.
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (step === 'login') {
      setStep('mfa');
    } else {
      navigate('/');
    }
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Welcome back</CardTitle>
        <CardDescription>
          {step === 'login'
            ? 'Login with your email and password'
            : 'Verify your MFA code'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-6" onSubmit={handleSubmit}>
          {step === 'login' ? (
            <>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="#"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input id="password" type="password" required />
              </div>
            </>
          ) : (
            <Input type="text" placeholder="MFA Code" required />
          )}
          <Button type="submit" className="w-full">
            {step === 'login' ? 'Login' : 'Verify'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import {
  Alert,
  AlertDescription,
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
import { tokenManager } from '../../lib/utils';
import {
  handleResponseErrorMessage,
  useLogin,
  useVerifyMFA,
} from '../../services/apis';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const mfaSchema = z.object({
  code: z.string().length(6, 'MFA code must be 6 digits'),
});

type LoginFormData = z.infer<typeof loginSchema>;
type MFAFormData = z.infer<typeof mfaSchema>;

export function LoginPage() {
  const navigate = useNavigate();

  // State
  const [step, setStep] = useState<'login' | 'mfa-verify'>('login');
  const [ephemeralToken, setEphemeralToken] = useState<string | null>(null);

  // Login form
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
    setError: setLoginError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // MFA form
  const {
    register: registerMFA,
    handleSubmit: handleMFASubmit,
    formState: { errors: mfaErrors },
    setError: setMFAError,
  } = useForm<MFAFormData>({
    resolver: zodResolver(mfaSchema),
  });

  // API hooks
  const {
    mutate: sendLoginRequest,
    isPending: isLoginPending,
    isError: isLoginError,
    error: loginError,
    isSuccess: isLoginSuccess,
    data: loginResponse,
  } = useLogin();

  const {
    mutate: sendVerifyRequest,
    isPending: isVerifyPending,
    isError: isVerifyError,
    error: verifyError,
    isSuccess: isVerifySuccess,
    data: verifyResponse,
  } = useVerifyMFA();

  // Effects.
  useEffect(() => {
    if (isLoginSuccess && loginResponse?.data) {
      if (loginResponse.data.ephemeral_token) {
        setEphemeralToken(loginResponse.data.ephemeral_token);
        setStep('mfa-verify');
      } else if (loginResponse.data.access && loginResponse.data.refresh) {
        tokenManager.setToken(loginResponse.data.access);
        tokenManager.setRefreshToken(loginResponse.data.refresh);
        navigate('/');
      }
    } else {
      handleResponseErrorMessage(isLoginError, loginError, setLoginError);
    }
  }, [isLoginSuccess, isLoginError]);

  useEffect(() => {
    if (
      isVerifySuccess &&
      verifyResponse?.data?.access &&
      verifyResponse?.data?.refresh
    ) {
      tokenManager.setToken(verifyResponse.data.access);
      tokenManager.setRefreshToken(verifyResponse.data.refresh);
      navigate('/');
    } else {
      handleResponseErrorMessage(isVerifyError, verifyError, setMFAError);
    }
  }, [isVerifySuccess, isVerifyError]);

  // Handlers.
  const onLoginSubmit = (data: LoginFormData) => {
    sendLoginRequest(data);
  };

  const onMFASubmit = (data: MFAFormData) => {
    if (!ephemeralToken) return;
    sendVerifyRequest({ ephemeral_token: ephemeralToken, code: data.code });
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Welcome back</CardTitle>
        <CardDescription>
          {step === 'login' && 'Login with your email and password'}
          {step === 'mfa-verify' && 'Enter your MFA code'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === 'login' && (
          <form
            className="grid gap-6"
            onSubmit={handleLoginSubmit(onLoginSubmit)}
          >
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                {...registerLogin('email')}
                id="email"
                type="email"
                error={loginErrors.email?.message}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                {...registerLogin('password')}
                id="password"
                type="password"
                error={loginErrors.password?.message}
              />
            </div>
            {isLoginError && (
              <Alert variant="destructive">
                <AlertDescription>Invalid credentials</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" loading={isLoginPending}>
              Login
            </Button>
          </form>
        )}

        {step === 'mfa-verify' && (
          <form className="grid gap-6" onSubmit={handleMFASubmit(onMFASubmit)}>
            <div className="grid gap-2">
              <Label htmlFor="code">Authentication Code</Label>
              <Input
                {...registerMFA('code')}
                id="code"
                type="text"
                placeholder="Enter 6-digit code"
                error={mfaErrors.code?.message}
              />
            </div>
            {isVerifyError && (
              <Alert variant="destructive">
                <AlertDescription>Invalid MFA code</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" loading={isVerifyPending}>
              Verify
            </Button>
          </form>
        )}
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

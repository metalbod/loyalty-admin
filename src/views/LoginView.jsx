import React, { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { LogIn, ShieldCheck } from 'lucide-react';
import Card from '../components/common/Card.jsx';
import Input from '../components/common/Input.jsx';
import Button from '../components/common/Button.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { useAsyncAction } from '../hooks/useAsyncAction.js';

export function LoginView() {
  const { isAuthenticated, login, sessionExpired, acknowledgeSessionExpired } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { run, isSubmitting, error } = useAsyncAction(login);

  // Already logged in (e.g. navigated back to /login manually) - bounce straight through
  // rather than showing the form again.
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const loggedInUser = await run(email, password);
      // Superadmins have no institution-scoped dashboard to land on - send them straight to
      // institution management instead of the transactions view.
      const defaultRoute = loggedInUser.role === 'ROLE_SUPERADMIN' ? '/superadmin/institutions' : '/';
      const redirectTo = location.state?.from?.pathname || defaultRoute;
      navigate(redirectTo, { replace: true });
    } catch {
      // error is already captured by useAsyncAction and rendered below
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
      <Card className="w-full max-w-sm p-6">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-emerald-400">
            <ShieldCheck size={22} />
          </span>
          <h1 className="text-base font-semibold text-slate-100">Loyalty Admin</h1>
          <p className="mt-0.5 text-xs text-slate-500">Sign in to the back-office console</p>
        </div>

        {sessionExpired && (
          <p className="mb-4 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-400">
            Your session has expired. Please log in again.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="email"
            type="email"
            label="Email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (sessionExpired) acknowledgeSessionExpired();
            }}
            autoFocus
          />
          <Input
            id="password"
            type="password"
            label="Password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (sessionExpired) acknowledgeSessionExpired();
            }}
          />

          {error && <p className="text-xs text-rose-400">{error}</p>}

          <Button type="submit" icon={LogIn} isLoading={isSubmitting} fullWidth>
            Sign in
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default LoginView;

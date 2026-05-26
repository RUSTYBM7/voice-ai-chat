import { useState } from 'react';
import { Mail, Lock, User, Loader2, X, LogIn, UserPlus } from 'lucide-react';
import { signIn, signUp } from '../lib/supabase';

interface LoginPageProps {
  isOpen: boolean;
  onLogin: (email: string) => void;
  onClose: () => void;
}

export function LoginPage({ isOpen, onLogin, onClose }: LoginPageProps) {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) {
          const errorMessage = typeof error === 'string' ? error : error.message;
          setError(errorMessage);
        } else {
          onLogin(email);
        }
      } else {
        const { error } = await signUp(email, password);
        if (error) {
          const errorMessage = typeof error === 'string' ? error : error.message;
          setError(errorMessage);
        } else {
          setSuccessMessage('Account created! Please check your email to confirm your account, then log in.');
          setMode('login');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Demo mode for testing without Supabase
  const handleDemoMode = () => {
    onLogin('demo@example.com');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-violet-600 rounded-xl flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">
                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-sm text-zinc-400">
                {mode === 'login'
                  ? 'Sign in to your account'
                  : 'Join Voice AI Chat'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Email
                </div>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4" /> Password
                </div>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
                required
                minLength={6}
              />
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4" /> Confirm Password
                  </div>
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors"
                  required
                  minLength={6}
                />
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm">
                {successMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-violet-600 hover:bg-violet-500 disabled:bg-zinc-700 disabled:cursor-not-allowed rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                <>
                  {mode === 'login' ? (
                    <>
                      <LogIn className="w-4 h-4" /> Sign In
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" /> Create Account
                    </>
                  )}
                </>
              )}
            </button>
          </form>

          <div className="mt-6 space-y-3">
            <button
              type="button"
              onClick={handleDemoMode}
              className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors text-zinc-300"
            >
              <User className="w-4 h-4" /> Try Demo Mode
            </button>

            <button
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
                setError('');
                setSuccessMessage('');
              }}
              className="w-full py-3 text-zinc-400 hover:text-white transition-colors text-sm"
            >
              {mode === 'login'
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-zinc-800">
            <p className="text-xs text-zinc-500 text-center">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

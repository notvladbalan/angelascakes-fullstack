import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import api from '@/api/axios';
import useAuthStore from '@/store/authStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      const { data: profile } = await api.get('/users/me');
      setAuth(data.token, { ...profile, role: data.role });
      navigate(data.role === 'ADMIN' ? '/admin/cakes' : '/', { replace: true });
    } catch (err) {
      const status = err.response?.status;
      setError(
        err.response?.data?.message ||
        (status === 401 || status === 403
          ? 'Incorrect email or password.'
          : 'Something went wrong. Please try again.')
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* Left – hero image */}
      <div
        className="hidden lg:block lg:w-1/2 xl:w-3/5 bg-cover bg-center"
        style={{ backgroundImage: "url('/cake-hero.jpg')" }}
        aria-hidden="true"
      />

      {/* Right – form panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12 bg-[#FFF5EC]">
        <div className="w-full max-w-sm">

          {/* Logo */}
          <Link to="/" className="block mb-8">
            <img src="/logo.svg" alt="Angela's Cakes" className="h-12 w-auto" />
          </Link>

          {/* Heading */}
          <h1 className="font-heading text-3xl text-brown mb-1">Welcome back</h1>
          <p className="text-sm text-muted-foreground mb-8">
            Sign in to your account to continue.
          </p>

          {/* Error banner */}
          {error && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-semibold text-brown">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-11 px-4 rounded-lg border border-stroke bg-white text-sm text-brown placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-crimson/30 focus:border-crimson transition"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-semibold text-brown">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 pl-4 pr-11 rounded-lg border border-stroke bg-white text-sm text-brown placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-crimson/30 focus:border-crimson transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-brown transition-colors"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 h-11 w-full rounded-lg bg-crimson text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-crimson/90 active:bg-crimson/80 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? 'Signing in…' : 'Log In'}
            </button>

          </form>

          {/* Footer link */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-crimson font-semibold hover:underline">
              Create one
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

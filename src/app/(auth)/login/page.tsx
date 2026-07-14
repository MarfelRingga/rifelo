'use client';

import { useState, Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, RefreshCw, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { formatIndonesianPhoneNumber } from '@/lib/phone';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParamsUrl = searchParams.get('redirect');
  let redirectUrl = '/profile';
  if (redirectParamsUrl && redirectParamsUrl.startsWith('/') && !redirectParamsUrl.startsWith('//')) {
    redirectUrl = redirectParamsUrl;
  }
  
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedIdentifier = localStorage.getItem('rememberedIdentifier');
    if (savedIdentifier) {
      setIdentifier(savedIdentifier);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        setError('Konfigurasi Supabase tidak ditemukan. Silakan hubungi admin atau periksa Secrets Anda.');
        setIsLoading(false);
        return;
      }

      if (rememberMe) {
        localStorage.setItem('rememberedIdentifier', identifier);
      } else {
        localStorage.removeItem('rememberedIdentifier');
      }

      // Check if identifier is an email (contains @ symbol)
      const cleanIdentifier = identifier.trim();
      const isEmail = cleanIdentifier.includes('@');
      
      let signInData;
      
      if (isEmail) {
        signInData = {
          email: cleanIdentifier,
          password: password,
        };
      } else {
        const formattedPhone = formatIndonesianPhoneNumber(cleanIdentifier);
        signInData = {
          phone: formattedPhone,
          password: password,
        };
      }

      const { data, error: authError } = await supabase.auth.signInWithPassword(signInData);

      if (authError) throw authError;

      if (data.user) {
        router.push(redirectUrl);
      }
    } catch (err: any) {
      console.error('Login error detail:', err);
      if (err.message === 'Failed to fetch') {
        setError('Koneksi ke server gagal. Harap pastikan Supabase URL dan API Key sudah dikonfigurasi dengan benar di Secrets.');
      } else {
        setError('Gagal masuk. Silakan periksa kembali kredensial Anda dan coba lagi.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
      <div className="py-8 px-6 sm:px-10">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600 text-sm animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <div className="mt-2">
              <input
                id="identifier"
                name="identifier"
                type="text"
                autoComplete="username"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="block w-full rounded-xl border-0 py-3 text-[#0c0e0b] placeholder:text-[#0c0e0b]/40 outline-none focus:ring-0 sm:text-sm sm:leading-6 bg-[#F4F3EE] px-4 shadow-[inset_4px_4px_8px_#d1d0cc,inset_-4px_-4px_8px_#ffffff] focus:shadow-[inset_6px_6px_10px_#d1d0cc,inset_-6px_-6px_10px_#ffffff] transition-shadow duration-300"
                placeholder="Email or phone"
              />
            </div>
          </div>

          <div>
            <div className="mt-2 relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-xl border-0 py-3 text-[#0c0e0b] placeholder:text-[#0c0e0b]/40 outline-none focus:ring-0 sm:text-sm sm:leading-6 bg-[#F4F3EE] px-4 pr-10 shadow-[inset_4px_4px_8px_#d1d0cc,inset_-4px_-4px_8px_#ffffff] focus:shadow-[inset_6px_6px_10px_#d1d0cc,inset_-6px_-6px_10px_#ffffff] transition-shadow duration-300"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#0c0e0b]/40 hover:text-[#0c0e0b]/70 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <Eye className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <EyeOff className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-[#aaafbc]/30 text-[#0c0e0b] focus:ring-[#a299af]"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-[#0c0e0b]/70">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link href="/forgot-password" className="font-medium text-[#0c0e0b] hover:text-[#a299af] transition-colors">
                Forgot password?
              </Link>
            </div>
          </div>

          <div>
            <button 
              type="submit"
              disabled={isLoading}
              className={`flex w-full justify-center items-center text-[#090909] py-[0.7em] px-[1.7em] text-[18px] rounded-[0.5em] bg-[#e8e8e8] border border-[#e8e8e8] transition-all duration-300 shadow-[6px_6px_12px_#c5c5c5,-6px_-6px_12px_#ffffff] hover:border-white active:shadow-[4px_4px_12px_#c5c5c5,-4px_-4px_12px_#ffffff] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed ${isLoading ? 'animate-pulse' : ''}`}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F4F3EE] font-sans selection:bg-[#a299af]/30 selection:text-[#0c0e0b] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-semibold tracking-tight text-[#0c0e0b] flex items-center justify-center gap-3">
          <Link href="/" className="hover:opacity-80 transition-opacity" title="Back to Home">
            <img 
              src="https://i.ibb.co.com/B5m6T7RZ/rifelo-logo.png" 
              alt="Rifelo Logo" 
              className="w-9 h-9 object-contain"
              referrerPolicy="no-referrer" 
            />
          </Link>
          Log in
        </h2>
        <p className="mt-2 text-center text-sm text-[#0c0e0b]/70">
          Don't have an account?{' '}
          <Link href="/signup" className="font-medium text-[#0c0e0b] hover:text-[#a299af] transition-colors">
            Get started today
          </Link>
        </p>
      </div>

      <Suspense fallback={<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md flex justify-center"><RefreshCw className="w-6 h-6 animate-spin text-[#a299af]" /></div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}

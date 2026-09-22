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
      <div className="py-8 px-6 sm:px-10 bg-white border border-[#0c0e0b]/10 rounded-3xl shadow-[0_4px_24px_rgba(12,14,11,0.04)]">
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
                className="block w-full rounded-xl py-3 text-[#0c0e0b] placeholder:text-[#0c0e0b]/40 outline-none sm:text-sm sm:leading-6 bg-[#FAF9F5] px-4 border border-[#0c0e0b]/10 focus-within:border-[#0c0e0b] focus-within:ring-1 focus-within:ring-[#0c0e0b] transition-all duration-300"
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
                className="block w-full rounded-xl py-3 text-[#0c0e0b] placeholder:text-[#0c0e0b]/40 outline-none sm:text-sm sm:leading-6 bg-[#FAF9F5] px-4 pr-10 border border-[#0c0e0b]/10 focus-within:border-[#0c0e0b] focus-within:ring-1 focus-within:ring-[#0c0e0b] transition-all duration-300"
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
                className="h-4 w-4 rounded border-[#0c0e0b]/20 text-[#0c0e0b] focus:ring-[#0c0e0b] bg-[#FAF9F5]"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-[#0c0e0b]/60">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link href="/forgot-password" className="font-medium text-[#0c0e0b] hover:text-[#0c0e0b]/70 transition-colors">
                Forgot password?
              </Link>
            </div>
          </div>

          <div>
            <button 
              type="submit"
              disabled={isLoading}
              className={`flex w-full justify-center items-center py-3 px-4 text-sm font-semibold rounded-xl bg-[#1A1A1A] text-white hover:bg-[#0c0e0b] transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm ${isLoading ? 'animate-pulse' : ''}`}
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
    <div className="min-h-screen bg-[#F4F3EE] font-sans selection:bg-[#a299af]/30 selection:text-[#0c0e0b] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      {/* Top Corner Logo like Homepage */}
      <div className="absolute top-0 left-0 w-full p-4 sm:p-6 flex items-center justify-between pointer-events-none">
        <Link href="/" className="pointer-events-auto flex items-center gap-2 group">
          <div className="relative w-7 h-7 transition-transform group-hover:scale-105">
            <img 
              src="https://i.ibb.co.com/20WNbGMp/favicon-192x192.png" 
              alt="Rifelo Logo" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer" 
            />
          </div>
          <span className="font-semibold text-base tracking-tight text-[#0c0e0b]">Rifelo</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-semibold tracking-tight text-[#0c0e0b]">
          Log in
        </h2>
        <p className="mt-2 text-center text-sm text-[#0c0e0b]/60">
          Don't have an account?{' '}
          <Link href="/signup" className="font-medium text-[#0c0e0b] underline underline-offset-4 hover:text-[#0c0e0b]/70 transition-colors">
            Get started today
          </Link>
        </p>
      </div>

      <Suspense fallback={<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md flex justify-center"><RefreshCw className="w-6 h-6 animate-spin text-[#0c0e0b]/40" /></div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}

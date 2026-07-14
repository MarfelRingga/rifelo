'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, RefreshCw, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { formatIndonesianPhoneNumber } from '@/lib/phone';

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const claimToken = searchParams.get('claimToken');
  const redirectParamsUrl = searchParams.get('redirect');
  
  // Safe redirect validation
  let redirectUrl = '/profile';
  if (redirectParamsUrl && redirectParamsUrl.startsWith('/') && !redirectParamsUrl.startsWith('//')) {
    redirectUrl = redirectParamsUrl;
  }

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [nfcTagCode, setNfcTagCode] = useState(claimToken || '');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validate username: minimum 4 characters, only a-z, ., _
      const usernameRegex = /^[a-z._]{4,}$/;
      if (!usernameRegex.test(username)) {
        throw new Error('Username must be at least 4 characters and can only contain lowercase letters, dots, and underscores.');
      }

      const formattedPhone = formatIndonesianPhoneNumber(phone);
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          phone: formattedPhone,
          password,
          username,
          nfcTagCode,
        }),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || 'Gagal membuat akun');
      }

      // Immediately sign in to establish session
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      if (data.user) {
        setSuccess(true);
        // For new tag code, overwrite redirect if not coming from claim but they entered one
        const finalRedirectUrl = (nfcTagCode && !claimToken && redirectUrl === '/profile') 
          ? `/tags?claim=${nfcTagCode}` 
          : redirectUrl;

        setTimeout(() => {
          router.push(finalRedirectUrl);
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || 'Gagal membuat akun. Silakan periksa kembali data Anda dan coba lagi.');
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

        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-3 text-emerald-600 text-sm animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-semibold">Account created!</p>
              <p className="mt-1">Signing you in & redirecting...</p>
            </div>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSignup}>
          <div>
            <div className="mt-2">
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z._]/g, ''))}
                className="block w-full rounded-xl border-0 py-3 text-[#0c0e0b] placeholder:text-[#0c0e0b]/40 outline-none focus:ring-0 sm:text-sm sm:leading-6 bg-[#F4F3EE] px-4 shadow-[inset_4px_4px_8px_#d1d0cc,inset_-4px_-4px_8px_#ffffff] focus:shadow-[inset_6px_6px_10px_#d1d0cc,inset_-6px_-6px_10px_#ffffff] transition-shadow duration-300"
                placeholder="Username"
                minLength={4}
              />
            </div>
          </div>

          <div>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-xl border-0 py-3 text-[#0c0e0b] placeholder:text-[#0c0e0b]/40 outline-none focus:ring-0 sm:text-sm sm:leading-6 bg-[#F4F3EE] px-4 shadow-[inset_4px_4px_8px_#d1d0cc,inset_-4px_-4px_8px_#ffffff] focus:shadow-[inset_6px_6px_10px_#d1d0cc,inset_-6px_-6px_10px_#ffffff] transition-shadow duration-300"
                placeholder="Email address"
              />
            </div>
          </div>

          <div>
            <div className="mt-2 flex rounded-xl bg-[#F4F3EE] overflow-hidden shadow-[inset_4px_4px_8px_#d1d0cc,inset_-4px_-4px_8px_#ffffff] focus-within:shadow-[inset_6px_6px_10px_#d1d0cc,inset_-6px_-6px_10px_#ffffff] transition-shadow duration-300">
              <span className="flex select-none items-center pl-4 pr-1 text-[#0c0e0b]/60 sm:text-sm font-medium">
                +62
              </span>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="block w-full border-0 py-3 text-[#0c0e0b] placeholder:text-[#0c0e0b]/40 focus:ring-0 sm:text-sm sm:leading-6 bg-transparent pl-1 pr-4 outline-none"
                placeholder="Phone number"
              />
            </div>
          </div>

          <div>
            <div className="mt-2 relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
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

          <div>
            <div className="mt-2">
              <input
                id="nfcTagCode"
                name="nfcTagCode"
                type="text"
                required
                disabled={!!claimToken}
                value={nfcTagCode}
                onChange={(e) => setNfcTagCode(e.target.value)}
                className={`block w-full rounded-xl border-0 py-3 text-[#0c0e0b] placeholder:text-[#0c0e0b]/40 outline-none focus:ring-0 sm:text-sm sm:leading-6 px-4 shadow-[inset_4px_4px_8px_#d1d0cc,inset_-4px_-4px_8px_#ffffff] focus:shadow-[inset_6px_6px_10px_#d1d0cc,inset_-6px_-6px_10px_#ffffff] transition-shadow duration-300 ${claimToken ? 'bg-transparent text-[#0c0e0b]/60 cursor-not-allowed' : 'bg-[#F4F3EE]'}`}
                placeholder="Enter your tag code"
              />
              {claimToken && (
                <p className="mt-2 text-xs text-emerald-600 font-medium">Tag code automatically filled from your scan.</p>
              )}
            </div>
          </div>

          <div>
            <button 
              type="submit"
              disabled={isLoading || success}
              className={`flex w-full justify-center items-center text-[#090909] py-[0.7em] px-[1.7em] text-[18px] rounded-[0.5em] bg-[#e8e8e8] border border-[#e8e8e8] transition-all duration-300 shadow-[6px_6px_12px_#c5c5c5,-6px_-6px_12px_#ffffff] hover:border-white active:shadow-[4px_4px_12px_#c5c5c5,-4px_-4px_12px_#ffffff] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed ${isLoading ? 'animate-pulse' : ''}`}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function SignupPage() {
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
          Sign up
        </h2>
        <p className="mt-2 text-center text-sm text-[#0c0e0b]/70">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-[#0c0e0b] hover:text-[#a299af] transition-colors">
            Sign in instead
          </Link>
        </p>
      </div>

      <Suspense fallback={<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md flex justify-center"><RefreshCw className="w-6 h-6 animate-spin text-[#a299af]" /></div>}>
        <SignupForm />
      </Suspense>
    </div>
  );
}

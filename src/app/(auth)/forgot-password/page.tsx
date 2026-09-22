'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ExternalLink, Loader2, AlertCircle, RefreshCw, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

export default function ForgotPasswordPage() {
  const [supportLink, setSupportLink] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form state
  const [identifier, setIdentifier] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchSupportLink = async () => {
      try {
        const { data, error } = await supabase
          .from('app_settings')
          .select('value')
          .eq('id', 'contact_support_link')
          .maybeSingle();

        if (error) {
          if (error.code !== '42P01' && !error.message?.includes('app_settings')) {
            throw error;
          }
        } else if (data?.value) {
          setSupportLink(data.value);
        }
      } catch (err) {
        // Soft fail
      } finally {
        setIsLoading(false);
      }
    };

    fetchSupportLink();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: identifier.trim(),
          code,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password. Please check your code and try again.');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Gagal mengatur ulang kata sandi. Silakan periksa kembali kode Anda dan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F3EE] font-sans selection:bg-[#a299af]/30 selection:text-[#0c0e0b] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
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
        <h2 className="mt-6 text-center text-2xl sm:text-3xl font-semibold tracking-tight text-[#0c0e0b]">
          Reset password
        </h2>
        <p className="mt-2 text-center text-sm text-[#0c0e0b]/60 px-4 sm:px-0">
          Enter your phone number or email, the reset code from admin, and your new password.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="py-8 px-6 sm:px-10 bg-white border border-[#0c0e0b]/10 rounded-3xl shadow-[0_4px_24px_rgba(12,14,11,0.04)]">
          
          {success ? (
            <div className="text-center py-4">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 mb-4">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-medium text-[#0c0e0b] mb-2">Password Reset Successful</h3>
              <p className="text-sm text-[#0c0e0b]/60 mb-6">Your password has been successfully updated. You can now log in with your new password.</p>
              <Link 
                href="/login"
                className="flex w-full justify-center items-center rounded-xl bg-[#1A1A1A] px-3 py-3 text-sm font-medium text-white shadow-sm hover:bg-[#0c0e0b] transition-all"
              >
                Go to Login
              </Link>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}

              <div>
                <div className="mt-2 flex rounded-xl bg-[#FAF9F5] overflow-hidden border border-[#0c0e0b]/10 focus-within:border-[#0c0e0b] focus-within:ring-1 focus-within:ring-[#0c0e0b] transition-all duration-300">
                  <input
                    id="identifier"
                    name="identifier"
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="block w-full border-0 py-3 text-[#0c0e0b] placeholder:text-[#0c0e0b]/40 focus:ring-0 sm:text-sm sm:leading-6 bg-transparent px-4 outline-none"
                    placeholder="Email or phone"
                  />
                </div>
              </div>

              <div>
                <div className="mt-2">
                  <input
                    id="code"
                    name="code"
                    type="text"
                    required
                    placeholder="Enter 6-digit code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="block w-full rounded-xl py-3 text-[#0c0e0b] placeholder:text-[#0c0e0b]/40 outline-none sm:text-sm sm:leading-6 bg-[#FAF9F5] px-4 border border-[#0c0e0b]/10 focus-within:border-[#0c0e0b] focus-within:ring-1 focus-within:ring-[#0c0e0b] transition-all duration-300"
                  />
                </div>
              </div>

              <div>
                <div className="mt-2 relative">
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="block w-full rounded-xl py-3 text-[#0c0e0b] placeholder:text-[#0c0e0b]/40 outline-none sm:text-sm sm:leading-6 bg-[#FAF9F5] px-4 pr-10 border border-[#0c0e0b]/10 focus-within:border-[#0c0e0b] focus-within:ring-1 focus-within:ring-[#0c0e0b] transition-all duration-300"
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
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex w-full justify-center items-center py-3 px-4 text-sm font-semibold rounded-xl bg-[#1A1A1A] text-white hover:bg-[#0c0e0b] transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm ${isSubmitting ? 'animate-pulse' : ''}`}
                >
                  {isSubmitting ? 'Resetting...' : 'Reset Password'}
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-[#0c0e0b]/10">
            {isLoading ? (
              <div className="flex justify-center py-2">
                <Loader2 className="w-6 h-6 animate-spin text-[#0c0e0b]/40" />
              </div>
            ) : supportLink ? (
              <a
                href={supportLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full justify-center items-center gap-2 rounded-xl bg-white border border-[#0c0e0b]/15 px-3 py-3 text-sm font-semibold text-[#0c0e0b] shadow-sm hover:bg-[#FAF9F5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0c0e0b] transition-all active:scale-[0.98]"
              >
                Contact admin for reset code
                <ExternalLink className="w-4 h-4" />
              </a>
            ) : (
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-center gap-2 text-amber-700 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <p>Support contact unavailable.</p>
              </div>
            )}

            <div className="mt-6 text-center">
              <Link href="/login" className="text-sm font-medium text-[#0c0e0b] underline underline-offset-4 hover:text-[#0c0e0b]/70 transition-colors">
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

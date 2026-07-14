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
    <div className="min-h-screen bg-[#F4F3EE] font-sans selection:bg-[#a299af]/30 selection:text-[#0c0e0b] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-2xl sm:text-3xl font-semibold tracking-tight text-[#0c0e0b] flex items-center justify-center gap-3">
          <Link href="/" className="hover:opacity-80 transition-opacity" title="Back to Home">
            <img 
              src="https://i.ibb.co.com/B5m6T7RZ/rifelo-logo.png" 
              alt="Rifelo Logo" 
              className="w-9 h-9 object-contain"
              referrerPolicy="no-referrer" 
            />
          </Link>
          Reset password
        </h2>
        <p className="mt-2 text-center text-sm text-[#0c0e0b]/70 px-4 sm:px-0">
          Enter your phone number or email, the reset code from admin, and your new password.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="py-8 px-6 sm:px-10">
          
          {success ? (
            <div className="text-center py-4">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 mb-4">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Password Reset Successful</h3>
              <p className="text-sm text-gray-500 mb-6">Your password has been successfully updated. You can now log in with your new password.</p>
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
                <div className="mt-2 flex rounded-xl bg-[#F4F3EE] overflow-hidden shadow-[inset_4px_4px_8px_#d1d0cc,inset_-4px_-4px_8px_#ffffff] focus-within:shadow-[inset_6px_6px_10px_#d1d0cc,inset_-6px_-6px_10px_#ffffff] transition-shadow duration-300">
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
                    className="block w-full rounded-xl border-0 py-3 text-[#0c0e0b] placeholder:text-[#0c0e0b]/40 outline-none focus:ring-0 sm:text-sm sm:leading-6 bg-[#F4F3EE] px-4 shadow-[inset_4px_4px_8px_#d1d0cc,inset_-4px_-4px_8px_#ffffff] focus:shadow-[inset_6px_6px_10px_#d1d0cc,inset_-6px_-6px_10px_#ffffff] transition-shadow duration-300"
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
                    className="block w-full rounded-xl border-0 py-3 text-[#0c0e0b] placeholder:text-[#0c0e0b]/40 outline-none focus:ring-0 sm:text-sm sm:leading-6 bg-[#F4F3EE] px-4 pr-10 shadow-[inset_4px_4px_8px_#d1d0cc,inset_-4px_-4px_8px_#ffffff] focus:shadow-[inset_6px_6px_10px_#d1d0cc,inset_-6px_-6px_10px_#ffffff] transition-shadow duration-300"
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
                  className={`flex w-full justify-center items-center text-[#090909] py-[0.7em] px-[1.7em] text-[18px] rounded-[0.5em] bg-[#e8e8e8] border border-[#e8e8e8] transition-all duration-300 shadow-[6px_6px_12px_#c5c5c5,-6px_-6px_12px_#ffffff] hover:border-white active:shadow-[4px_4px_12px_#c5c5c5,-4px_-4px_12px_#ffffff] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed ${isSubmitting ? 'animate-pulse' : ''}`}
                >
                  {isSubmitting ? 'Resetting...' : 'Reset Password'}
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-[#aaafbc]/20">
            {isLoading ? (
              <div className="flex justify-center py-2">
                <Loader2 className="w-6 h-6 animate-spin text-[#a299af]" />
              </div>
            ) : supportLink ? (
              <a
                href={supportLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full justify-center items-center gap-2 rounded-xl bg-white border-2 border-[#1A1A1A] px-3 py-3 text-sm font-bold text-[#1A1A1A] shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A1A1A] transition-all active:scale-[0.98]"
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
              <Link href="/login" className="text-sm font-medium text-[#0c0e0b] hover:text-[#a299af] transition-colors">
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

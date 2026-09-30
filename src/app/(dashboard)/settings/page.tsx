'use client';

import { useState, useEffect } from 'react';
import { Shield, ExternalLink, Mail, Phone, LogOut, Loader2, CheckCircle2, AlertCircle, Pencil, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { PageSkeleton } from '@/components/ui/PageSkeleton';
import { formatPhoneDisplay } from '@/lib/phone';

export default function SettingsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [contactSupportLink, setContactSupportLink] = useState('');
  const [contactSupportText, setContactSupportText] = useState('');
  
  // Current registered credentials
  const [userPhone, setUserPhone] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');

  // Phone edit state
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [oldPhone, setOldPhone] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [isSavingPhone, setIsSavingPhone] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [phoneSuccess, setPhoneSuccess] = useState<string | null>(null);

  // Email edit state
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [oldEmail, setOldEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [isSavingEmail, setIsSavingEmail] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSuccess, setEmailSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        let loadedEmail = user?.email || '';
        let loadedPhone = user?.phone || '';

        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('email, phone')
            .eq('id', user.id)
            .maybeSingle();

          if (profile) {
            loadedEmail = loadedEmail || profile.email || '';
            loadedPhone = loadedPhone || profile.phone || '';
          }
        }

        setUserEmail(loadedEmail);
        setUserPhone(loadedPhone);

        const { data, error } = await supabase
          .from('app_settings')
          .select('id, value')
          .in('id', ['contact_support_link', 'contact_support_text']);

        if (error) {
          console.error('Error fetching settings:', error);
          return;
        }

        if (data) {
          const linkSetting = data.find(s => s.id === 'contact_support_link');
          const textSetting = data.find(s => s.id === 'contact_support_text');
          if (linkSetting) setContactSupportLink(linkSetting.value || '');
          if (textSetting) setContactSupportText(textSetting.value || '');
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleUpdatePhone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPhone.trim() || !newPhone.trim() || isSavingPhone) return;

    setIsSavingPhone(true);
    setPhoneError(null);
    setPhoneSuccess(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Your session has expired. Please sign in again.');
      }

      const response = await fetch('/api/account/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          type: 'phone',
          oldPhone: oldPhone.trim(),
          newPhone: newPhone.trim()
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update phone number.');
      }

      setUserPhone(result.phone || newPhone.trim());
      setPhoneSuccess('Phone number updated successfully.');
      setOldPhone('');
      setNewPhone('');

      await supabase.auth.refreshSession();

      setTimeout(() => {
        setIsEditingPhone(false);
        setPhoneSuccess(null);
      }, 1500);

    } catch (err: any) {
      console.error('Update phone error:', err);
      setPhoneError(err.message || 'Failed to update phone number.');
    } finally {
      setIsSavingPhone(false);
    }
  };

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldEmail.trim() || !newEmail.trim() || isSavingEmail) return;

    setIsSavingEmail(true);
    setEmailError(null);
    setEmailSuccess(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Your session has expired. Please sign in again.');
      }

      const response = await fetch('/api/account/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          type: 'email',
          oldEmail: oldEmail.trim(),
          newEmail: newEmail.trim()
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update email address.');
      }

      setUserEmail(result.email || newEmail.trim().toLowerCase());
      setEmailSuccess('Email address updated successfully.');
      setOldEmail('');
      setNewEmail('');

      await supabase.auth.refreshSession();

      setTimeout(() => {
        setIsEditingEmail(false);
        setEmailSuccess(null);
      }, 1500);

    } catch (err: any) {
      console.error('Update email error:', err);
      setEmailError(err.message || 'Failed to update email address.');
    } finally {
      setIsSavingEmail(false);
    }
  };

  if (isLoading) {
    return <PageSkeleton type="settings" />;
  }

  return (
    <div className="space-y-6 sm:space-y-8 font-sans max-w-4xl mx-auto pb-24">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Manage credentials and security.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        {/* Card Header */}
        <div className="px-5 py-4 sm:px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Account Security</h2>
              <p className="text-sm text-slate-500 mt-0.5">Credentials and active sessions</p>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 sm:p-6 space-y-6">
          {/* Section: Credentials */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-3.5">Credentials</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Phone Box */}
              <div className="rounded-xl border border-slate-200/80 bg-white shadow-2xs hover:border-slate-300 transition-all overflow-hidden">
                {!isEditingPhone ? (
                  /* Normal View */
                  <div className="p-3.5 sm:p-4 flex items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-600 shrink-0">
                        <Phone className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 flex-1 overflow-hidden">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-0.5">
                          Phone Number
                        </p>
                        <div className="overflow-x-auto whitespace-nowrap hide-scrollbar py-0.5">
                          <p className="text-sm font-semibold text-slate-900 inline-block">
                            {userPhone ? formatPhoneDisplay(userPhone) : 'Not set'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingPhone(true);
                        setOldPhone('');
                        setNewPhone('');
                        setPhoneError(null);
                        setPhoneSuccess(null);
                      }}
                      className="px-3 py-1 rounded-lg border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-xs font-semibold transition-all shadow-2xs inline-flex items-center gap-1.5 shrink-0 active:scale-95"
                      title="Edit phone number"
                    >
                      <Pencil className="w-3 h-3 text-slate-500" />
                      <span>Edit</span>
                    </button>
                  </div>
                ) : (
                  /* Phone Edit Form */
                  <div className="p-3.5 sm:p-4 bg-slate-50/60 border-t-2 border-slate-900 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between mb-3.5">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-slate-700" />
                        <h4 className="text-sm sm:text-base font-bold text-slate-900">Edit Phone Number</h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingPhone(false);
                          setPhoneError(null);
                          setPhoneSuccess(null);
                        }}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleUpdatePhone} className="space-y-3">
                      <div>
                        <input
                          type="tel"
                          required
                          value={oldPhone}
                          onChange={(e) => setOldPhone(e.target.value)}
                          placeholder="Current Phone"
                          className="w-full px-4 py-2.5 bg-white border border-slate-200/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm font-medium text-slate-900 placeholder:text-slate-400 transition-all"
                        />
                      </div>

                      <div>
                        <input
                          type="tel"
                          required
                          value={newPhone}
                          onChange={(e) => setNewPhone(e.target.value)}
                          placeholder="New Phone"
                          className="w-full px-4 py-2.5 bg-white border border-slate-200/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm font-medium text-slate-900 placeholder:text-slate-400 transition-all"
                        />
                      </div>

                      {phoneError && (
                        <div className="flex items-center text-sm text-red-600 font-medium pt-0.5 animate-in fade-in">
                          <AlertCircle className="w-4 h-4 mr-1.5 shrink-0" />
                          <span>{phoneError}</span>
                        </div>
                      )}

                      {phoneSuccess && (
                        <div className="flex items-center text-sm text-emerald-600 font-medium pt-0.5 animate-in fade-in">
                          <CheckCircle2 className="w-4 h-4 mr-1.5 shrink-0" />
                          <span>{phoneSuccess}</span>
                        </div>
                      )}

                      <div className="pt-2 flex items-center justify-end gap-2.5">
                        <button
                          type="button"
                          disabled={isSavingPhone}
                          onClick={() => {
                            setIsEditingPhone(false);
                            setPhoneError(null);
                            setPhoneSuccess(null);
                          }}
                          className="px-3.5 py-2 text-sm font-semibold rounded-xl text-slate-600 hover:bg-slate-200/70 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSavingPhone || !oldPhone.trim() || !newPhone.trim()}
                          className="px-5 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-all shadow-2xs inline-flex items-center gap-1.5 active:scale-95"
                        >
                          {isSavingPhone ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Saving...</span>
                            </>
                          ) : (
                            'Save'
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>

              {/* Email Box */}
              <div className="rounded-xl border border-slate-200/80 bg-white shadow-2xs hover:border-slate-300 transition-all overflow-hidden">
                {!isEditingEmail ? (
                  /* Normal View */
                  <div className="p-3.5 sm:p-4 flex items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-600 shrink-0">
                        <Mail className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0 flex-1 overflow-hidden">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-0.5">
                          Email Address
                        </p>
                        <div className="overflow-x-auto whitespace-nowrap hide-scrollbar py-0.5">
                          <p className="text-sm font-semibold text-slate-900 inline-block">
                            {userEmail || 'Not set'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingEmail(true);
                        setOldEmail('');
                        setNewEmail('');
                        setEmailError(null);
                        setEmailSuccess(null);
                      }}
                      className="px-3 py-1 rounded-lg border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-xs font-semibold transition-all shadow-2xs inline-flex items-center gap-1.5 shrink-0 active:scale-95"
                      title="Edit email address"
                    >
                      <Pencil className="w-3 h-3 text-slate-500" />
                      <span>Edit</span>
                    </button>
                  </div>
                ) : (
                  /* Email Edit Form */
                  <div className="p-3.5 sm:p-4 bg-slate-50/60 border-t-2 border-slate-900 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between mb-3.5">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-slate-700" />
                        <h4 className="text-sm sm:text-base font-bold text-slate-900">Edit Email Address</h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingEmail(false);
                          setEmailError(null);
                          setEmailSuccess(null);
                        }}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleUpdateEmail} className="space-y-3">
                      <div>
                        <input
                          type="email"
                          required
                          value={oldEmail}
                          onChange={(e) => setOldEmail(e.target.value)}
                          placeholder="Current Email"
                          className="w-full px-4 py-2.5 bg-white border border-slate-200/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm font-medium text-slate-900 placeholder:text-slate-400 transition-all"
                        />
                      </div>

                      <div>
                        <input
                          type="email"
                          required
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          placeholder="New Email"
                          className="w-full px-4 py-2.5 bg-white border border-slate-200/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm font-medium text-slate-900 placeholder:text-slate-400 transition-all"
                        />
                      </div>

                      {emailError && (
                        <div className="flex items-center text-sm text-red-600 font-medium pt-0.5 animate-in fade-in">
                          <AlertCircle className="w-4 h-4 mr-1.5 shrink-0" />
                          <span>{emailError}</span>
                        </div>
                      )}

                      {emailSuccess && (
                        <div className="flex items-center text-sm text-emerald-600 font-medium pt-0.5 animate-in fade-in">
                          <CheckCircle2 className="w-4 h-4 mr-1.5 shrink-0" />
                          <span>{emailSuccess}</span>
                        </div>
                      )}

                      <div className="pt-2 flex items-center justify-end gap-2.5">
                        <button
                          type="button"
                          disabled={isSavingEmail}
                          onClick={() => {
                            setIsEditingEmail(false);
                            setEmailError(null);
                            setEmailSuccess(null);
                          }}
                          className="px-3.5 py-2 text-sm font-semibold rounded-xl text-slate-600 hover:bg-slate-200/70 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSavingEmail || !oldEmail.trim() || !newEmail.trim()}
                          className="px-5 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-all shadow-2xs inline-flex items-center gap-1.5 active:scale-95"
                        >
                          {isSavingEmail ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Saving...</span>
                            </>
                          ) : (
                            'Save'
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          {/* Section: Support */}
          <div>
            <label className="block text-base font-bold text-slate-900 mb-1.5">Need Help?</label>
            <p className="text-sm text-slate-500 mb-4 leading-relaxed max-w-xl">
              {contactSupportText || "Contact support if you need assistance with your account."}
            </p>
            <button 
              type="button"
              onClick={() => {
                if (contactSupportLink) {
                  window.open(contactSupportLink, '_blank');
                }
              }}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200/90 text-slate-700 hover:bg-slate-50 hover:text-slate-900 text-sm font-semibold rounded-xl transition-all shadow-2xs active:scale-[0.98]"
            >
              <span>Contact Support</span>
              <ExternalLink className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          <div className="h-px bg-slate-100" />

          {/* Section: Session */}
          <div>
            <label className="block text-base font-bold text-slate-900 mb-1.5">Account Session</label>
            <p className="text-sm text-slate-500 mb-4 leading-relaxed max-w-xl">
              Sign out of your account on this device.
            </p>
            <button
              type="button"
              onClick={async () => {
                await supabase.auth.signOut();
                router.push('/login');
              }}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 text-sm font-semibold rounded-xl transition-all border border-red-100 hover:border-red-200 cursor-pointer shadow-2xs active:scale-95"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

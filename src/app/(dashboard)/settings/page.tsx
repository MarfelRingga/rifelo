'use client';

import { useState, useEffect } from 'react';
import { Shield, Smartphone, ExternalLink, Mail, Phone, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { PageSkeleton } from '@/components/ui/PageSkeleton';

export default function SettingsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [contactSupportLink, setContactSupportLink] = useState('');
  const [contactSupportText, setContactSupportText] = useState('');
  const [userPhone, setUserPhone] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserPhone(user.phone || null);
          setUserEmail(user.email || null);
        }

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

  if (isLoading) {
    return <PageSkeleton type="settings" />;
  }

  return (
    <div className="space-y-8 font-sans max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your account preferences and security.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-8">
        {/* Account Security Section */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-6 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-slate-400" />
            Account Security
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Need Help?</label>
              <p className="text-sm text-slate-600 mb-4">
                {contactSupportText || "Your email or phone number is your primary identifier and cannot be changed directly. Contact support if you lost access."}
              </p>
              <button 
                onClick={() => {
                  if (contactSupportLink) {
                    window.open(contactSupportLink, '_blank');
                  }
                }}
                className="inline-flex items-center justify-center px-6 py-2.5 bg-slate-100 text-slate-900 text-sm font-medium rounded-xl transition-all"
              >
                Contact Support
                <ExternalLink className="w-4 h-4 ml-2" />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Account Information</label>
              <div className="space-y-3">
                <div className="flex items-center px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <Phone className="w-5 h-5 text-slate-400 mr-3" />
                  <div className="flex-1">
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">Phone Number</p>
                    <p className="text-sm text-slate-900 font-medium">{userPhone || 'Not provided'}</p>
                  </div>
                </div>
                
                <div className="flex items-center px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <Mail className="w-5 h-5 text-slate-400 mr-3" />
                  <div className="flex-1">
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">Email Address</p>
                    <p className="text-sm text-slate-900 font-medium">{userEmail || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Session Management */}
            <div className="pt-6 border-t border-slate-200">
              <label className="block text-sm font-medium text-slate-700 mb-1 font-semibold">Account Session</label>
              <p className="text-xs text-slate-500 mb-4">
                Since this device retains your session, you only need to sign out if you are on a shared or public computer.
              </p>
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.push('/login');
                }}
                className="inline-flex items-center justify-center px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold rounded-xl transition-all border border-red-100 hover:border-red-200 cursor-pointer shadow-sm active:scale-95"
              >
                <LogOut className="w-3.5 h-3.5 mr-2" />
                Sign Out / Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

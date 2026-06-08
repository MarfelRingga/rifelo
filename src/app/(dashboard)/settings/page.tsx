'use client';

import { useState, useEffect } from 'react';
import { Shield, Smartphone, ExternalLink, Mail, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '@/lib/supabase';

export default function SettingsPage() {
  const [contactSupportLink, setContactSupportLink] = useState('');
  const [contactSupportText, setContactSupportText] = useState('');
  const [userPhone, setUserPhone] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
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
      }
    };

    fetchSettings();
  }, []);

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
          </div>
        </div>
      </div>
    </div>
  );
}

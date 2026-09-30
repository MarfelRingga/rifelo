'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Loader2, MessageSquare, Trash2, Clock, AlertCircle, Trash, User, CheckCheck, Mail, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PageSkeleton } from '@/components/ui/PageSkeleton';
import { cn } from '@/lib/utils';

type ProfileMessage = {
  id: string;
  sender_name: string | null;
  message_content: string;
  created_at: string;
  is_read?: boolean;
};

export default function InboxPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<ProfileMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        if (userError.message.includes('Refresh Token Not Found') || userError.message.includes('Invalid Refresh Token')) {
          await supabase.auth.signOut();
          router.push('/login');
          return;
        }
      }
      if (!user) return;

      const { data, error } = await supabase
        .from('profile_messages')
        .select('*')
        .eq('profile_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      const fetched = data || [];
      setMessages(fetched);
      
      window.dispatchEvent(new Event('inbox-updated'));
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id: string, currentIsRead?: boolean) => {
    if (currentIsRead !== false) return; // Only update if it's currently unread

    // Optimistic update
    setMessages(prev => 
      prev.map(msg => msg.id === id ? { ...msg, is_read: true } : msg)
    );

    try {
      const { error } = await supabase
        .from('profile_messages')
        .update({ is_read: true })
        .eq('id', id);
        
      if (!error) {
        window.dispatchEvent(new Event('inbox-updated'));
      } else {
        console.error('Update failed:', error);
        setMessages(prev => 
          prev.map(msg => msg.id === id ? { ...msg, is_read: false } : msg)
        );
      }
    } catch (error) {
      console.error('Error marking as read:', error);
      setMessages(prev => 
        prev.map(msg => msg.id === id ? { ...msg, is_read: false } : msg)
      );
    }
  };

  const markAllAsRead = async () => {
    const unreadIds = messages.filter(m => m.is_read === false).map(m => m.id);
    if (unreadIds.length === 0) return;

    setIsMarkingAll(true);
    setMessages(prev => prev.map(m => ({ ...m, is_read: true })));

    try {
      const { error } = await supabase
        .from('profile_messages')
        .update({ is_read: true })
        .in('id', unreadIds);

      if (!error) {
        window.dispatchEvent(new Event('inbox-updated'));
      } else {
        console.error('Failed to mark all as read:', error);
        fetchMessages();
      }
    } catch (error) {
      console.error('Failed to mark all as read:', error);
      fetchMessages();
    } finally {
      setIsMarkingAll(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleteId(null);
    setIsDeleting(id);
    try {
      const { error } = await supabase
        .from('profile_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      const remaining = messages.filter(msg => msg.id !== id);
      setMessages(remaining);

      window.dispatchEvent(new Event('inbox-updated'));
    } catch (error) {
      console.error('Error deleting message:', error);
      setErrorMessage('Failed to delete message');
    } finally {
      setIsDeleting(null);
    }
  };

  const unreadCount = useMemo(() => {
    return messages.filter(m => m.is_read === false).length;
  }, [messages]);

  const filteredMessages = useMemo(() => {
    if (filter === 'unread') {
      return messages.filter(m => m.is_read === false);
    }
    return messages;
  }, [messages, filter]);

  const getInitials = (name?: string | null) => {
    if (!name || name.trim() === '') return '';
    return name.trim().charAt(0).toUpperCase();
  };

  const formatDateTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return { datePart: '', timePart: '' };

      const dd = String(date.getDate()).padStart(2, '0');
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const yy = String(date.getFullYear()).slice(-2);

      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');

      return {
        datePart: `${dd}/${mm}/${yy}`,
        timePart: `${hours}:${minutes}`,
      };
    } catch {
      return { datePart: '', timePart: '' };
    }
  };

  if (isLoading) {
    return <PageSkeleton type="inbox" />;
  }

  return (
    <div className="space-y-6 sm:space-y-8 font-sans max-w-6xl mx-auto pb-24">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Inbox</h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200/60">
              {messages.length} {messages.length === 1 ? 'message' : 'messages'}
            </span>
            {unreadCount > 0 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/80">
                {unreadCount} unread
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1">Messages left by visitors on your public profile.</p>
        </div>

        {/* Filter Pills & Actions */}
        {messages.length > 0 && (
          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            {/* Filter Toggle Pills */}
            <div className="flex items-center bg-slate-100/90 p-1 rounded-full border border-slate-200/60">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={cn(
                  "px-3.5 py-1 text-xs font-semibold rounded-full transition-all",
                  filter === 'all'
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                All ({messages.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter('unread')}
                className={cn(
                  "px-3.5 py-1 text-xs font-semibold rounded-full transition-all",
                  filter === 'unread'
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                Unread ({unreadCount})
              </button>
            </div>

            {/* Mark All as Read Button */}
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                disabled={isMarkingAll}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-white border border-slate-200/80 text-slate-700 hover:bg-slate-50 transition-all shadow-2xs disabled:opacity-50"
                title="Mark all as read"
              >
                {isMarkingAll ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Check className="w-3.5 h-3.5 text-slate-500" />
                )}
                <span className="hidden sm:inline">Mark all read</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Messages Grid or Empty State */}
      {messages.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 sm:p-16 text-center shadow-xs">
          <div className="w-16 h-16 bg-slate-50 rounded-full border border-slate-100 flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-7 h-7 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1.5">No messages yet</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
            When visitors leave a message or note on your public profile, it will appear here.
          </p>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center shadow-xs">
          <div className="w-12 h-12 bg-slate-50 rounded-full border border-slate-100 flex items-center justify-center mx-auto mb-3">
            <CheckCheck className="w-6 h-6 text-slate-400" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">No unread messages</h3>
          <p className="text-xs text-slate-500">
            You have caught up with all incoming messages.
          </p>
          <button
            type="button"
            onClick={() => setFilter('all')}
            className="mt-4 px-4 py-1.5 text-xs font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-2xs"
          >
            Show All Messages
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredMessages.map((msg) => (
            <div 
              key={msg.id} 
              onClick={() => markAsRead(msg.id, msg.is_read)}
              className={cn(
                "cursor-pointer px-4 sm:px-5 pt-4 sm:pt-5 pb-3 sm:pb-3.5 rounded-2xl border relative flex flex-col justify-between transition-all duration-200 group",
                msg.is_read === false 
                  ? "bg-white border-amber-300/80 shadow-[0_4px_20px_-4px_rgba(212,175,55,0.15)] ring-1 ring-amber-300/40" 
                  : "bg-white border-slate-200/80 shadow-2xs hover:shadow-xs hover:border-slate-300"
              )}
            >
              {/* Card Top Row: Sender Avatar + Name & Time + Action Button */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-3.5">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 border select-none transition-colors",
                      msg.is_read === false
                        ? "bg-amber-500/10 border-amber-500/30 text-amber-700 font-semibold"
                        : "bg-slate-100 border-slate-200/80 text-slate-700"
                    )}>
                      {msg.sender_name && getInitials(msg.sender_name) ? (
                        getInitials(msg.sender_name)
                      ) : (
                        <User className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                    
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center flex-wrap gap-1.5">
                        <h3 className="font-semibold text-slate-900 text-sm break-words">
                          {msg.sender_name || 'Anonymous'}
                        </h3>
                        {msg.is_read === false && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200/70 shrink-0">
                            New
                          </span>
                        )}
                      </div>
                      {(() => {
                        const { datePart, timePart } = formatDateTime(msg.created_at);
                        return (
                          <div className="flex items-center text-[11px] font-medium text-slate-400 mt-0.5">
                            <Clock className="w-3 h-3 mr-1.5 shrink-0 opacity-70" />
                            <span className="tabular-nums">{datePart}</span>
                            <span className="inline-block mx-1.5 text-slate-300 select-none">•</span>
                            <span className="tabular-nums">{timePart}</span>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Delete Action Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteId(msg.id);
                    }}
                    disabled={isDeleting === msg.id}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50/80 rounded-xl opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all disabled:opacity-50 shrink-0"
                    title="Delete message"
                    aria-label="Delete message"
                  >
                    {isDeleting === msg.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Message Body Box - Refined rounded-xl speech container matching Rifelo radius math */}
                <div className={cn(
                  "p-4 rounded-xl text-slate-700 text-sm leading-relaxed whitespace-pre-wrap break-words border transition-colors",
                  msg.is_read === false 
                    ? "bg-slate-50/80 border-slate-200/70" 
                    : "bg-slate-50/50 border-slate-100/90"
                )}>
                  {msg.message_content}
                </div>
              </div>

              {/* Card Bottom: Status hint / Mark as read */}
              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-end text-[11px] text-slate-400 leading-none">
                <span className="flex items-center gap-1.5">
                  {msg.is_read === false ? (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                      <span className="font-medium text-amber-700/90">Click card to mark as read</span>
                    </>
                  ) : (
                    <>
                      <CheckCheck className="w-3.5 h-3.5 text-slate-400" />
                      <span>Read</span>
                    </>
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden border border-slate-200"
            >
              <div className="p-6 text-center">
                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Message</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Are you sure you want to delete this message? This action cannot be undone.
                </p>
                <div className="mt-6 flex gap-3">
                  <button 
                    onClick={() => setDeleteId(null)}
                    className="flex-1 py-2.5 bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-200/80 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => handleDelete(deleteId)}
                    className="flex-1 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-all shadow-2xs"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Error Modal */}
      <AnimatePresence>
        {errorMessage && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden border border-slate-200"
            >
              <div className="p-6 text-center">
                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Error</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {errorMessage}
                </p>
                <button 
                  onClick={() => setErrorMessage(null)}
                  className="mt-6 w-full py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-all shadow-2xs"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

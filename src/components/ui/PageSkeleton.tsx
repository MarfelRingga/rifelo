'use client';

import React from 'react';

type SkeletonType = 'default' | 'tags' | 'inbox' | 'settings' | 'circle_settings';

export function PageSkeleton({ type = 'default' }: { type?: SkeletonType }) {
  if (type === 'tags') {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-8 animate-pulse w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-3 w-full max-w-md">
            <div className="h-8 w-48 bg-slate-200 rounded-lg"></div>
            <div className="h-4 w-72 bg-slate-100 rounded-md"></div>
          </div>
          <div className="h-10 w-36 bg-slate-200 rounded-xl shrink-0 w-full sm:w-auto"></div>
        </div>

        {/* NFC Tags Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-slate-200 rounded"></div>
                    <div className="h-3 w-24 bg-slate-100 rounded font-mono"></div>
                  </div>
                </div>
                <div className="h-6 w-16 bg-slate-100 rounded-full"></div>
              </div>
              <div className="h-px bg-slate-100"></div>
              <div className="flex justify-between items-center pt-1">
                <div className="h-3.5 w-24 bg-slate-100 rounded"></div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg"></div>
                  <div className="w-8 h-8 bg-slate-100 rounded-lg"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'inbox') {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-8 animate-pulse w-full">
        {/* Header */}
        <div className="space-y-3">
          <div className="h-8 w-32 bg-slate-200 rounded-lg"></div>
          <div className="h-4 w-96 bg-slate-100 rounded-md"></div>
        </div>

        {/* Messages list */}
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 shadow-sm">
              <div className="flex justify-between items-center">
                <div className="h-4 w-32 bg-slate-200 rounded"></div>
                <div className="h-3 w-24 bg-slate-100 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-slate-100 rounded"></div>
                <div className="h-4 w-5/6 bg-slate-100 rounded"></div>
              </div>
              <div className="flex justify-end pt-2">
                <div className="h-8 w-20 bg-slate-100 rounded-xl"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'settings') {
    return (
      <div className="p-6 max-w-3xl mx-auto space-y-8 animate-pulse w-full">
        {/* Header */}
        <div className="space-y-3">
          <div className="h-8 w-44 bg-slate-200 rounded-lg"></div>
          <div className="h-4 w-80 bg-slate-100 rounded-md"></div>
        </div>

        {/* Card Container */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-8">
          <div className="space-y-6">
            <div className="h-6 w-44 bg-slate-200 rounded-lg"></div>
            
            <div className="space-y-4">
              <div className="h-4 w-24 bg-slate-200 rounded-md"></div>
              <div className="h-10 w-full bg-slate-100 rounded-xl"></div>
              <div className="h-10 w-36 bg-slate-200 rounded-xl"></div>
            </div>

            <div className="space-y-4 pt-4">
              <div className="h-4 w-36 bg-slate-200 rounded-md"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="h-16 bg-slate-50 border border-slate-100 rounded-xl"></div>
                <div className="h-16 bg-slate-50 border border-slate-100 rounded-xl"></div>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-slate-100">
              <div className="h-4 w-32 bg-slate-200 rounded-md"></div>
              <div className="h-12 w-full bg-slate-100 rounded-xl"></div>
              <div className="h-10 w-36 bg-red-50/50 rounded-xl border border-red-100"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'circle_settings') {
    return (
      <div className="p-6 max-w-3xl mx-auto space-y-8 animate-pulse w-full">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-slate-200"></div>
          <div className="space-y-2">
            <div className="h-8 w-48 bg-slate-200 rounded-lg"></div>
            <div className="h-4 w-64 bg-slate-100 rounded-md"></div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Section 1 */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
            <div className="h-6 w-40 bg-slate-200 rounded-md"></div>
            <div className="space-y-3">
              <div className="h-4 w-20 bg-slate-200 rounded"></div>
              <div className="h-12 w-full bg-slate-100 rounded-xl"></div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
            <div className="h-6 w-36 bg-slate-200 rounded-md"></div>
            <div className="space-y-3">
              <div className="h-12 w-full bg-slate-100 rounded-xl"></div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
            <div className="h-6 w-32 bg-slate-200 rounded-md"></div>
            <div className="h-12 w-full bg-slate-100 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback 'default' Card Table layout
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 animate-pulse w-full">
      {/* Skeleton Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-3 w-full max-w-md">
          <div className="h-8 w-48 bg-slate-200 rounded-lg"></div>
          <div className="h-4 w-72 bg-slate-100 rounded-md"></div>
        </div>
        <div className="h-10 w-32 bg-slate-200 rounded-xl shrink-0"></div>
      </div>

      {/* Skeleton Content Blocks */}
      <div className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm min-h-[400px]">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="h-5 w-32 bg-slate-200 rounded-md"></div>
            <div className="flex gap-2">
              <div className="h-8 w-20 bg-slate-100 rounded-md"></div>
              <div className="h-8 w-20 bg-slate-100 rounded-md"></div>
            </div>
          </div>
          
          {/* Skeleton list items */}
          <div className="space-y-4 pt-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-3 border-b border-slate-50 last:border-0">
                <div className="w-10 h-10 bg-slate-100 rounded-full shrink-0"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-1/4 bg-slate-200 rounded"></div>
                  <div className="h-3 w-1/2 bg-slate-100 rounded font-mono"></div>
                </div>
                <div className="h-8 w-16 bg-slate-100 rounded-md"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

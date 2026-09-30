'use client';

import React from 'react';

type SkeletonType = 'default' | 'tags' | 'inbox' | 'settings' | 'circle_settings';

export function PageSkeleton({ type = 'default' }: { type?: SkeletonType }) {
  if (type === 'tags') {
    return (
      <div className="space-y-6 sm:space-y-8 animate-pulse w-full max-w-4xl mx-auto pb-24">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2 w-full max-w-md">
            <div className="flex items-center gap-3">
              <div className="h-8 w-32 bg-slate-200 rounded-lg"></div>
              <div className="h-5 w-16 bg-slate-100 rounded-full"></div>
            </div>
            <div className="h-4 w-72 bg-slate-100 rounded-md"></div>
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2.5 w-full sm:w-auto">
            <div className="h-10 w-28 bg-slate-100 rounded-xl"></div>
            <div className="h-10 w-32 bg-slate-200 rounded-xl"></div>
          </div>
        </div>

        {/* Full-Page Configure Card */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-200 rounded-xl"></div>
              <div className="space-y-1.5">
                <div className="h-4 w-36 bg-slate-200 rounded"></div>
                <div className="h-3 w-56 bg-slate-100 rounded"></div>
              </div>
            </div>
            <div className="w-8 h-8 bg-slate-100 rounded-xl"></div>
          </div>

          <div className="p-5 sm:p-6 space-y-6">
            <div className="space-y-2">
              <div className="h-3.5 w-24 bg-slate-200 rounded"></div>
              <div className="h-10 w-full bg-slate-100 rounded-xl"></div>
            </div>

            <div className="h-16 w-full bg-slate-50 rounded-xl border border-slate-100"></div>

            <div className="space-y-2">
              <div className="h-3.5 w-48 bg-slate-200 rounded"></div>
              <div className="h-12 w-full bg-slate-100 rounded-xl"></div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="h-10 w-36 bg-slate-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'inbox') {
    return (
      <div className="space-y-6 sm:space-y-8 animate-pulse w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-8 w-28 bg-slate-200 rounded-lg"></div>
              <div className="h-5 w-24 bg-slate-100 rounded-full"></div>
            </div>
            <div className="h-4 w-72 bg-slate-100 rounded-md"></div>
          </div>
          <div className="h-8 w-36 bg-slate-100 rounded-full"></div>
        </div>

        {/* Messages grid */}
        <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white px-4 sm:px-5 pt-4 sm:pt-5 pb-3 sm:pb-3.5 rounded-2xl border border-slate-200/80 space-y-3.5 shadow-2xs">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 border border-slate-200/60 rounded-full shrink-0"></div>
                  <div className="space-y-1.5">
                    <div className="h-4 w-28 bg-slate-200 rounded"></div>
                    <div className="h-3 w-20 bg-slate-100 rounded"></div>
                  </div>
                </div>
                <div className="w-7 h-7 bg-slate-100 rounded-lg"></div>
              </div>
              <div className="h-20 bg-slate-50 border border-slate-100/90 rounded-xl p-3"></div>
              <div className="pt-2 border-t border-slate-100 flex justify-end items-center">
                <div className="h-3 w-14 bg-slate-100 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'settings') {
    return (
      <div className="space-y-6 sm:space-y-8 font-sans max-w-4xl mx-auto pb-24 animate-pulse w-full">
        {/* Page Header */}
        <div className="space-y-2">
          <div className="h-8 w-32 bg-slate-200 rounded-lg"></div>
          <div className="h-4 w-64 bg-slate-100 rounded-md"></div>
        </div>

        {/* Security Card */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          {/* Card Header */}
          <div className="px-5 py-4 sm:px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-200 shrink-0"></div>
              <div className="space-y-1.5">
                <div className="h-5 w-40 bg-slate-200 rounded"></div>
                <div className="h-3.5 w-56 bg-slate-100 rounded"></div>
              </div>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-5 sm:p-6 space-y-6">
            {/* Credentials Section */}
            <div>
              <div className="h-5 w-28 bg-slate-200 rounded mb-3.5"></div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Phone Box Skeleton */}
                <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 sm:p-4 flex items-center justify-between gap-2.5 shadow-2xs">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200/60 shrink-0"></div>
                    <div className="space-y-1.5 flex-1">
                      <div className="h-2.5 w-16 bg-slate-100 rounded"></div>
                      <div className="h-4 w-32 bg-slate-200 rounded"></div>
                    </div>
                  </div>
                  <div className="h-7 w-14 bg-slate-100 rounded-lg shrink-0"></div>
                </div>

                {/* Email Box Skeleton */}
                <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 sm:p-4 flex items-center justify-between gap-2.5 shadow-2xs">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200/60 shrink-0"></div>
                    <div className="space-y-1.5 flex-1">
                      <div className="h-2.5 w-20 bg-slate-100 rounded"></div>
                      <div className="h-4 w-40 bg-slate-200 rounded"></div>
                    </div>
                  </div>
                  <div className="h-7 w-14 bg-slate-100 rounded-lg shrink-0"></div>
                </div>
              </div>
            </div>

            <div className="h-px bg-slate-100" />

            {/* Need Help Section */}
            <div className="space-y-2">
              <div className="h-4.5 w-24 bg-slate-200 rounded"></div>
              <div className="h-3.5 w-72 bg-slate-100 rounded"></div>
              <div className="pt-2">
                <div className="h-10 w-36 bg-slate-100 border border-slate-200/60 rounded-xl"></div>
              </div>
            </div>

            <div className="h-px bg-slate-100" />

            {/* Account Session Section */}
            <div className="space-y-2">
              <div className="h-4.5 w-32 bg-slate-200 rounded"></div>
              <div className="h-3.5 w-60 bg-slate-100 rounded"></div>
              <div className="pt-2">
                <div className="h-10 w-28 bg-red-50/70 border border-red-100/60 rounded-xl"></div>
              </div>
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

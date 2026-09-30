'use client';

import React from 'react';

export function ProfileSkeleton() {
  return (
    <div className="space-y-8 font-sans max-w-6xl mx-auto pb-20 animate-pulse">
      {/* 1. Page Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div className="space-y-2">
          <div className="h-8 w-44 sm:w-52 bg-slate-200 rounded-lg" />
          <div className="h-4 w-60 sm:w-72 bg-slate-100 rounded-md" />
        </div>
        {/* Live Page Button Placeholder */}
        <div className="h-9 w-28 bg-slate-200 rounded-lg shrink-0" />
      </div>

      <div className="w-full space-y-6">
        {/* 2. Appearance Studio Card Skeleton */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Studio Header (Compact) */}
          <div className="px-4 py-3 sm:px-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="h-5 w-28 bg-slate-200 rounded-md" />
          </div>

          {/* Two-column layout on laptop: Selectors Left, Live Preview Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 lg:divide-x lg:divide-slate-100">
            
            {/* Left Column: Selectors */}
            <div className="p-4 sm:p-5 lg:p-6 lg:col-span-7 flex flex-col justify-start">
              
              {/* --- Mobile View: Segmented Tabs (hidden on laptop) --- */}
              <div className="block lg:hidden">
                {/* Segmented Control 4 Tabs */}
                <div className="flex bg-slate-100/90 p-1.5 rounded-xl mb-4 gap-1">
                  <div className="flex-1 h-9 bg-white rounded-lg shadow-xs" />
                  <div className="flex-1 h-9 bg-slate-200/50 rounded-lg" />
                  <div className="flex-1 h-9 bg-slate-200/50 rounded-lg" />
                  <div className="flex-1 h-9 bg-slate-200/50 rounded-lg" />
                </div>

                {/* Persona Mode Pills Horizontal Skeleton */}
                <div className="flex items-center gap-2 sm:gap-3 py-1 overflow-x-auto hide-scrollbar">
                  <div className="h-10 w-28 bg-slate-200 rounded-full shrink-0" />
                  <div className="h-10 w-36 bg-slate-200 rounded-full shrink-0" />
                  <div className="h-10 w-28 bg-slate-200 rounded-full shrink-0" />
                </div>
              </div>

              {/* --- Laptop View: Vertical Stack for Persona, Theme, Shape, and Font --- */}
              <div className="hidden lg:flex lg:flex-col lg:space-y-7">
                {/* 1. Persona */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="h-3.5 w-16 bg-slate-200 rounded" />
                    <div className="h-3 w-20 bg-slate-100 rounded" />
                  </div>
                  <div className="flex items-center gap-2.5 py-1">
                    <div className="h-10 w-28 bg-slate-200 rounded-full" />
                    <div className="h-10 w-36 bg-slate-200 rounded-full" />
                    <div className="h-10 w-28 bg-slate-200 rounded-full" />
                  </div>
                </div>

                <div className="h-px bg-slate-100" />

                {/* 2. Theme */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="h-3.5 w-14 bg-slate-200 rounded" />
                    <div className="h-3 w-24 bg-slate-100 rounded" />
                  </div>
                  {/* Theme Preview Cards Grid (4 columns) */}
                  <div className="grid grid-cols-4 gap-3.5 py-1">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex flex-col items-center gap-2">
                        <div className="w-full aspect-[3/4] rounded-2xl bg-slate-100 border-2 border-slate-200/80" />
                        <div className="h-3 w-14 bg-slate-200 rounded" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-slate-100" />

                {/* 3. Button Shape */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="h-3.5 w-24 bg-slate-200 rounded" />
                    <div className="h-3 w-16 bg-slate-100 rounded" />
                  </div>
                  <div className="grid grid-cols-3 gap-2.5">
                    <div className="h-10 bg-slate-100 border-2 border-slate-200 rounded-none" />
                    <div className="h-10 bg-slate-100 border-2 border-slate-200 rounded-xl" />
                    <div className="h-10 bg-slate-100 border-2 border-slate-200 rounded-full" />
                  </div>
                </div>

                <div className="h-px bg-slate-100" />

                {/* 4. Typography */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="h-3.5 w-20 bg-slate-200 rounded" />
                    <div className="h-3 w-16 bg-slate-100 rounded" />
                  </div>
                  <div className="grid grid-cols-3 gap-2.5">
                    <div className="h-10 bg-slate-100 border-2 border-slate-200 rounded-xl" />
                    <div className="h-10 bg-slate-100 border-2 border-slate-200 rounded-xl" />
                    <div className="h-10 bg-slate-100 border-2 border-slate-200 rounded-xl" />
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Live Interactive Smartphone Preview Skeleton (100% matches real preview) */}
            <div className="border-t lg:border-t-0 border-slate-100 py-6 sm:py-8 lg:py-8 lg:px-4 lg:col-span-5 flex flex-col items-center justify-center overflow-hidden bg-slate-50/50 w-full h-full min-h-full">
              {/* Scaled Device Wrapper with exact layout dimensions */}
              <div className="w-[270px] sm:w-[312px] h-[567px] sm:h-[654px] relative shrink-0 flex justify-center my-auto">
                <div className="w-[416px] h-[872px] origin-top scale-[0.65] sm:scale-[0.75] shrink-0">
                  {/* Physical Smartphone Chassis - Calm neutral dark slate */}
                  <div className="w-[416px] h-[872px] bg-slate-800/90 rounded-[3.4rem] p-[13px] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,255,255,0.06)] border-[3.5px] border-slate-700/70 flex flex-col relative shrink-0 select-none">
                    
                    {/* Realistic Physical Buttons on Edge */}
                    <div className="absolute -left-[5.5px] top-28 w-[3.5px] h-7 bg-slate-600/70 rounded-l-sm" />
                    <div className="absolute -left-[5.5px] top-40 w-[3.5px] h-12 bg-slate-600/70 rounded-l-sm" />
                    <div className="absolute -left-[5.5px] top-56 w-[3.5px] h-12 bg-slate-600/70 rounded-l-sm" />
                    <div className="absolute -right-[5.5px] top-44 w-[3.5px] h-16 bg-slate-600/70 rounded-r-sm" />

                    {/* Top Speaker Ear-piece */}
                    <div className="w-16 h-1 bg-slate-600/60 rounded-full mx-auto mb-1.5 opacity-80" />

                    {/* Phone Screen Viewport - Calm light slate matching the page */}
                    <div className="w-[390px] h-[844px] rounded-[2.5rem] overflow-hidden flex flex-col relative shadow-inner bg-slate-50 [transform:translateZ(0)]">
                      
                      {/* Realistic Native Status Bar */}
                      <div className="h-10 px-6 flex items-center justify-between text-xs font-semibold select-none shrink-0 z-30 relative text-slate-400">
                        <span className="tracking-tight font-medium">9:41</span>

                        {/* Status Icons */}
                        <div className="flex items-center gap-1.5 opacity-90 text-[10px]">
                          <div className="flex items-end gap-[1.5px] h-2.5">
                            <div className="w-[2px] h-1 bg-current rounded-2xs" />
                            <div className="w-[2px] h-1.5 bg-current rounded-2xs" />
                            <div className="w-[2px] h-2 bg-current rounded-2xs" />
                            <div className="w-[2px] h-2.5 bg-current rounded-2xs" />
                          </div>
                          <span className="text-[9px] font-bold">5G</span>
                          <div className="w-4 h-2.5 border border-current rounded-xs p-[1px] flex items-center">
                            <div className="w-full h-full bg-current rounded-2xs" />
                          </div>
                        </div>
                      </div>

                      {/* Scrollable Viewport mirroring PublicProfileView */}
                      <div className="w-full flex-1 overflow-y-auto overflow-x-hidden px-4 pt-2 pb-6 flex flex-col items-center">
                        
                        {/* Profile Card Container - Clean harmonious floating card */}
                        <div className="w-full max-w-2xl bg-white rounded-[32px] p-6 shadow-sm border border-slate-200/70 flex flex-col items-center text-center">
                          
                          {/* Clean Header Badge Pill Box */}
                          <div className="h-6 w-24 rounded-full bg-slate-100 border border-slate-200/80 shadow-2xs my-1" />

                          {/* Links Stack Section (Clean Structural Boxes) */}
                          <div className="w-full space-y-3 mt-5">
                            {/* Link Card 1 */}
                            <div className="w-full h-14 rounded-[20px] bg-slate-50/80 border border-slate-200/80 p-3 flex items-center">
                              <div className="w-10 h-10 bg-white rounded-xl shadow-2xs border border-slate-200/70 shrink-0" />
                            </div>

                            {/* Link Card 2: Media / Widget Box */}
                            <div className="w-full h-18 rounded-[20px] bg-slate-800/90 border border-slate-700/70 p-3 flex items-center justify-between shadow-xs">
                              <div className="w-12 h-12 rounded-xl bg-slate-700/80 border border-slate-600/50 shrink-0" />
                              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shadow-xs shrink-0">
                                <div className="w-0 h-0 border-y-[4px] border-y-transparent border-l-[7px] border-l-slate-800 ml-0.5" />
                              </div>
                            </div>

                            {/* Link Card 3 */}
                            <div className="w-full h-14 rounded-[20px] bg-slate-50/80 border border-slate-200/80 p-3 flex items-center">
                              <div className="w-10 h-10 bg-white rounded-xl shadow-2xs border border-slate-200/70 shrink-0" />
                            </div>

                            {/* Link Card 4 */}
                            <div className="w-full h-14 rounded-[20px] bg-slate-50/80 border border-slate-200/80 p-3 flex items-center">
                              <div className="w-10 h-10 bg-white rounded-xl shadow-2xs border border-slate-200/70 shrink-0" />
                            </div>
                          </div>

                        </div>

                        {/* Leave a Message Section (Beneath Card) - Clean structural form boxes */}
                        <div className="w-full max-w-2xl px-1 pt-6 pb-2 space-y-2">
                          <div className="w-full h-11 bg-white border border-slate-200/80 rounded-xl shadow-2xs" />
                          <div className="w-full h-10 bg-slate-900/80 rounded-xl shadow-2xs" />
                        </div>
                      </div>

                      {/* Bottom iOS Home Indicator Bar */}
                      <div className="h-6 w-full shrink-0 flex items-center justify-center relative z-20 pointer-events-none">
                        <div className="w-36 h-1 rounded-full bg-slate-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 3. Profile Information & URL Settings Skeleton */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-6">
          <div className="pb-6 border-b border-slate-100">
            {/* Top row: URL/Username label and Public Profile Visibility toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-2 mb-3 sm:mb-2">
              <div className="h-4 w-28 bg-slate-200 rounded-md order-2 sm:order-1" />
              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 order-1 sm:order-2">
                <div className="h-4 w-36 bg-slate-200 rounded-md" />
                <div className="h-6 w-11 bg-slate-200 rounded-full" />
              </div>
            </div>

            {/* Input Box prefix */}
            <div className="max-w-xl">
              <div className="flex items-stretch h-11 sm:h-12 rounded-xl overflow-hidden border border-slate-200">
                <div className="w-28 bg-slate-100 border-r border-slate-200" />
                <div className="flex-1 bg-slate-50" />
              </div>
            </div>
          </div>

          {/* Profile Information Heading */}
          <div className="h-5 w-40 bg-slate-200 rounded-md mb-4" />

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2 col-span-1">
                <div className="h-4 w-24 bg-slate-200 rounded-md" />
                <div className="h-11 bg-slate-50 border border-slate-200 rounded-xl" />
              </div>
            ))}
            {/* Bio field */}
            <div className="space-y-2 md:col-span-2">
              <div className="h-4 w-16 bg-slate-200 rounded-md" />
              <div className="h-28 bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                <div className="h-3 w-3/4 bg-slate-200/60 rounded" />
                <div className="h-3 w-1/2 bg-slate-200/60 rounded" />
              </div>
            </div>
          </div>
        </div>

        {/* 4. Platforms & Links Skeleton */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="space-y-2">
              <div className="h-5 w-36 bg-slate-200 rounded-md" />
              <div className="h-4 w-64 bg-slate-100 rounded" />
            </div>
            <div className="h-9 w-28 bg-slate-200 rounded-lg shrink-0" />
          </div>

          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3.5 sm:p-4 border border-slate-200 rounded-xl bg-slate-50/50">
                <div className="w-5 h-8 bg-slate-200/70 rounded shrink-0" />
                <div className="w-10 h-10 rounded-lg bg-slate-200 shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-4 w-28 bg-slate-200 rounded" />
                  <div className="h-3 w-44 bg-slate-100 rounded" />
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-8 h-8 rounded-lg bg-slate-200/80" />
                  <div className="w-8 h-8 rounded-lg bg-slate-200/80" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Message Box Settings Skeleton */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 sm:px-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="h-5 w-32 bg-slate-200 rounded-md" />
            <div className="flex items-center gap-3">
              <div className="h-4 w-16 bg-slate-200 rounded" />
              <div className="h-6 w-11 bg-slate-200 rounded-full" />
            </div>
          </div>

          {/* Two-column layout on laptop: Selectors Left, Live Preview Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 lg:divide-x lg:divide-slate-100">
            
            {/* Left Column: Presets & Custom Text Fields */}
            <div className="p-4 sm:p-5 lg:p-6 lg:col-span-7 flex flex-col justify-start">
              
              {/* Mobile View: Segmented Control Tabs (hidden on laptop) */}
              <div className="block lg:hidden">
                <div className="flex bg-slate-100/90 p-1.5 rounded-xl mb-4 gap-1">
                  <div className="flex-1 h-9 bg-white rounded-lg shadow-xs" />
                  <div className="flex-1 h-9 bg-slate-200/50 rounded-lg" />
                </div>

                {/* Mobile Active Content Skeleton */}
                <div className="space-y-2">
                  <div className="h-3.5 w-16 bg-slate-200 rounded mb-2.5" />
                  <div className="grid grid-cols-2 gap-2.5">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-20 rounded-xl bg-slate-50 border border-slate-200 p-2.5 flex flex-col justify-between">
                        <div className="w-6 h-6 rounded-lg bg-slate-200" />
                        <div className="space-y-1">
                          <div className="h-3.5 w-16 bg-slate-200 rounded" />
                          <div className="h-2.5 w-24 bg-slate-100 rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Laptop View: Vertical Stack for Presets & Custom Fields */}
              <div className="hidden lg:flex lg:flex-col lg:space-y-6">
                {/* Presets Subsection */}
                <div>
                  <div className="h-3.5 w-16 bg-slate-200 rounded mb-2.5" />
                  <div className="grid grid-cols-2 gap-2.5">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-20 rounded-xl bg-slate-50 border border-slate-200 p-2.5 flex flex-col justify-between">
                        <div className="w-6 h-6 rounded-lg bg-slate-200" />
                        <div className="space-y-1">
                          <div className="h-3.5 w-16 bg-slate-200 rounded" />
                          <div className="h-2.5 w-24 bg-slate-100 rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-slate-100" />

                {/* Custom Subsection */}
                <div className="space-y-3.5">
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <div className="h-3.5 w-28 bg-slate-200 rounded" />
                      <div className="h-3 w-8 bg-slate-100 rounded" />
                    </div>
                    <div className="h-10 bg-slate-50 border border-slate-200 rounded-xl" />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <div className="h-3.5 w-32 bg-slate-200 rounded" />
                      <div className="h-3 w-8 bg-slate-100 rounded" />
                    </div>
                    <div className="h-20 bg-slate-50 border border-slate-200 rounded-xl" />
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Live Preview on laptop, bottom on mobile */}
            <div className="border-t lg:border-t-0 border-slate-100 py-6 sm:py-8 lg:py-8 px-4 sm:px-6 lg:px-5 lg:col-span-5 flex flex-col items-center justify-center overflow-hidden bg-slate-50/50 w-full h-full min-h-full">
              <div className="w-full max-w-sm rounded-2xl bg-white border border-slate-200/80 p-5 shadow-xs flex flex-col space-y-3 my-auto">
                <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 shrink-0" />
                  <div className="h-4 w-28 bg-slate-200 rounded" />
                </div>
                <div className="w-full h-9 bg-slate-50 border border-slate-200/80 rounded-xl shadow-2xs" />
                <div className="w-full h-20 bg-slate-50 border border-slate-200/80 rounded-xl shadow-2xs" />
                <div className="w-full h-9 bg-slate-900/80 rounded-xl shadow-2xs" />
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

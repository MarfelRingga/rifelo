#!/bin/bash
FILE="src/app/(auth)/login/page.tsx"

# Change wrapper bg
sed -i 's/bg-\[#F4F3EE\]/bg-slate-50/g' "$FILE"
# It might replace bg-[#F4F3EE] inside inputs too, but we will replace input classes entirely.

# The text and selection colors
sed -i 's/text-\[#0c0e0b\]/text-slate-900/g' "$FILE"
sed -i 's/selection:bg-\[#a299af\]\/30/selection:bg-slate-200/g' "$FILE"
sed -i 's/text-\[#a299af\]/text-slate-500/g' "$FILE"

# Make the card white
sed -i 's/<div className="py-8 px-6 sm:px-10">/<div className="py-8 px-6 sm:px-10 bg-white border border-slate-200 rounded-3xl shadow-sm">/g' "$FILE"

# Change input classes
sed -i 's/border-0 py-3 text-\[#0c0e0b\] placeholder:text-\[#0c0e0b\]\/40 outline-none focus:ring-0 sm:text-sm sm:leading-6 bg-\[#F4F3EE\] px-4 shadow-\[inset_4px_4px_8px_#d1d0cc,inset_-4px_-4px_8px_#ffffff\] focus:shadow-\[inset_6px_6px_10px_#d1d0cc,inset_-6px_-6px_10px_#ffffff\] transition-shadow/border border-slate-200 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent sm:text-sm sm:leading-6 bg-white px-4 transition-all/g' "$FILE"
sed -i 's/border-0 py-3 text-\[#0c0e0b\] placeholder:text-\[#0c0e0b\]\/40 outline-none focus:ring-0 sm:text-sm sm:leading-6 bg-\[#F4F3EE\] px-4 pr-10 shadow-\[inset_4px_4px_8px_#d1d0cc,inset_-4px_-4px_8px_#ffffff\] focus:shadow-\[inset_6px_6px_10px_#d1d0cc,inset_-6px_-6px_10px_#ffffff\] transition-shadow/border border-slate-200 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent sm:text-sm sm:leading-6 bg-white px-4 pr-10 transition-all/g' "$FILE"

# Change buttons or text colors inside
sed -i 's/text-\[#0c0e0b\]\/40/text-slate-400/g' "$FILE"
sed -i 's/text-\[#0c0e0b\]\/60/text-slate-500/g' "$FILE"
sed -i 's/text-\[#0c0e0b\]\/70/text-slate-500/g' "$FILE"
sed -i 's/hover:text-\[#0c0e0b\]\/70/hover:text-slate-600/g' "$FILE"

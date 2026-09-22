import fs from 'fs';
const files = [
  'src/app/(auth)/login/page.tsx',
  'src/app/(auth)/signup/page.tsx',
  'src/app/(auth)/forgot-password/page.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace wrapper background and texts
  content = content.replace(/bg-\[#F4F3EE\]/g, 'bg-slate-50');
  content = content.replace(/text-\[#0c0e0b\]/g, 'text-slate-900');
  content = content.replace(/selection:bg-\[#a299af\]\/30/g, 'selection:bg-slate-200');
  content = content.replace(/text-\[#a299af\]/g, 'text-slate-500');
  content = content.replace(/text-slate-900\/40/g, 'text-slate-400');
  content = content.replace(/text-slate-900\/60/g, 'text-slate-500');
  content = content.replace(/text-slate-900\/70/g, 'text-slate-500');
  content = content.replace(/text-\[#0c0e0b\]\/40/g, 'text-slate-400');
  content = content.replace(/text-\[#0c0e0b\]\/60/g, 'text-slate-500');
  content = content.replace(/text-\[#0c0e0b\]\/70/g, 'text-slate-500');
  content = content.replace(/hover:text-\[#0c0e0b\]\/70/g, 'hover:text-slate-600');
  content = content.replace(/hover:text-slate-900\/70/g, 'hover:text-slate-600');

  // Replace form inputs shadow neumorphism with flat bordered UI
  // Pattern: shadow-[inset_4px_4px_8px_#d1d0cc,inset_-4px_-4px_8px_#ffffff] focus:shadow-[inset_6px_6px_10px_#d1d0cc,inset_-6px_-6px_10px_#ffffff] transition-shadow duration-300
  content = content.replace(/shadow-\[inset_[^\]]+\] focus(?:-within)?:shadow-\[inset_[^\]]+\] transition-shadow/g, 'border border-slate-200 focus-within:border-slate-900 focus-within:ring-1 focus-within:ring-slate-900 transition-all');
  
  // Make sure bg is white inside inputs, and border is visible
  content = content.replace(/bg-slate-50 px-4 shadow/g, 'bg-white px-4 shadow');
  content = content.replace(/bg-slate-50 px-4 pr-10 shadow/g, 'bg-white px-4 pr-10 shadow');
  
  // Actually, since I replaced the shadows above, let's fix the remaining input styles
  // className="block w-full rounded-xl border-0 py-3 text-slate-900 placeholder:text-slate-400 outline-none focus:ring-0 sm:text-sm sm:leading-6 bg-slate-50 px-4 pr-10 border border-slate-200 focus-within:border-slate-900 focus-within:ring-1 focus-within:ring-slate-900 transition-all duration-300"
  
  // We can just regex replace the entire class of the input
  content = content.replace(/className="block w-full rounded-xl border-0 py-3([^"]+)"/g, function(match, p1) {
    let newClasses = p1
      .replace(/bg-slate-50/g, 'bg-white')
      .replace(/focus:ring-0/g, '')
      .replace(/shadow-\[inset_[^\]]+\]/g, '')
      .replace(/focus(?:-within)?:shadow-\[inset_[^\]]+\]/g, '')
      .replace(/transition-shadow/g, 'transition-all');
    
    // Add border if not exists
    if (!newClasses.includes('border-slate-200')) {
      newClasses = ' border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900' + newClasses;
    }
    
    return `className="block w-full rounded-xl py-3${newClasses}"`.replace(/\s+/g, ' ');
  });

  // Card wrapper
  content = content.replace(/<div className="py-8 px-6 sm:px-10">/g, '<div className="py-8 px-6 sm:px-10 bg-white border border-slate-200 rounded-3xl shadow-sm">');
  
  // Flex wrapper in signup and forgot password that wraps input + prefix
  // <div className="mt-2 flex rounded-xl bg-slate-50 overflow-hidden shadow-[inset_4px_4px_8px_#d1d0cc,inset_-4px_-4px_8px_#ffffff] focus-within:shadow-[inset_6px_6px_10px_#d1d0cc,inset_-6px_-6px_10px_#ffffff] transition-shadow duration-300">
  content = content.replace(/<div className="mt-2 flex rounded-xl bg-slate-50 overflow-hidden shadow-\[inset_[^\]]+\] focus-within:shadow-\[inset_[^\]]+\] transition-shadow duration-300">/g, '<div className="mt-2 flex rounded-xl bg-white border border-slate-200 overflow-hidden focus-within:border-slate-900 focus-within:ring-1 focus-within:ring-slate-900 transition-all duration-300">');

  fs.writeFileSync(file, content);
}

import fs from 'fs';
const files = [
  'src/app/(auth)/login/page.tsx',
  'src/app/(auth)/signup/page.tsx',
  'src/app/(auth)/forgot-password/page.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  // Replace primary button classes (neumorphism)
  // `flex w-full justify-center items-center text-[#090909] py-[0.7em] px-[1.7em] text-[18px] rounded-[0.5em] bg-[#e8e8e8] border border-[#e8e8e8] transition-all duration-300 shadow-[6px_6px_12px_#c5c5c5,-6px_-6px_12px_#ffffff] hover:border-white active:shadow-[4px_4px_12px_#c5c5c5,-4px_-4px_12px_#ffffff] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed ${isLoading ? 'animate-pulse' : ''}`
  // We can just use a regex to match the button className and replace it.
  
  content = content.replace(/className={`flex w-full justify-center items-center text-\[#090909\] py-\[0\.7em\] px-\[1\.7em\] text-\[18px\] rounded-\[0\.5em\] bg-\[#e8e8e8\] border border-\[#e8e8e8\] transition-all duration-300 shadow-\[6px_6px_12px_#c5c5c5,-6px_-6px_12px_#ffffff\] hover:border-white active:shadow-\[4px_4px_12px_#c5c5c5,-4px_-4px_12px_#ffffff\] active:scale-\[0\.98\] disabled:opacity-70 disabled:cursor-not-allowed \${isLoading \? 'animate-pulse' : ''}`}/g, 
    "className={`flex w-full justify-center items-center py-3 px-4 text-sm font-semibold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm ${isLoading ? 'animate-pulse' : ''}`}");

  fs.writeFileSync(file, content);
}

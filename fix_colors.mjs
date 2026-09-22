import fs from 'fs';
const files = [
  'src/app/(auth)/login/page.tsx',
  'src/app/(auth)/signup/page.tsx',
  'src/app/(auth)/forgot-password/page.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/bg-\[#1A1A1A\]/g, 'bg-slate-900');
  content = content.replace(/hover:bg-\[#0c0e0b\]/g, 'hover:bg-slate-800');
  content = content.replace(/border-\[#aaafbc\]\/20/g, 'border-slate-200');
  content = content.replace(/border-\[#1A1A1A\]/g, 'border-slate-200');
  content = content.replace(/focus-visible:outline-\[#1A1A1A\]/g, 'focus-visible:outline-slate-900');
  fs.writeFileSync(file, content);
}

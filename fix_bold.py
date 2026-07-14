import os

files = [
    'src/app/(dashboard)/profile/page.tsx',
    'src/components/profile/ThemeSelector.tsx',
    'src/components/profile/ModeSelector.tsx'
]

for file in files:
    with open(file, 'r') as f:
        content = f.read()
    
    # We only want to replace font-extrabold in the context of button selections. 
    # They all seem to have "bg-slate-100/80 text-slate-900 shadow-inner backdrop-blur-sm font-extrabold" or similar.
    content = content.replace("font-extrabold", "font-medium")
    
    with open(file, 'w') as f:
        f.write(content)

print("Done")

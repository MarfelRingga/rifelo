import re

with open('src/components/PhantomDeckProfile.tsx', 'r') as f:
    content = f.read()

target = """          {/* Links & Platforms */}
          {profile.links.length > 0 && (
            <div className="space-y-4 pt-2 flex flex-col items-center w-full">
              <h2 className="text-xs font-bold uppercase tracking-widest text-amber-600/70 font-mono text-center">
                Social & Links
              </h2>
              <div className="space-y-3 w-full">"""

replacement = """          {/* Links & Platforms */}
          {profile.links.length > 0 && (
            <div className="space-y-4 pt-2 flex flex-col items-center w-full">
              <div className="space-y-3 w-full">"""

if target in content:
    content = content.replace(target, replacement)
    print("Replaced social heading")

with open('src/components/PhantomDeckProfile.tsx', 'w') as f:
    f.write(content)


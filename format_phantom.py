import re

with open('src/components/PhantomDeckProfile.tsx', 'r') as f:
    content = f.read()

# 1. Update Bio layout to be centered
bio_target = """          {/* Bio */}
          {profile.bio && (
            <div className="space-y-3">
              {profile.profileMode !== 'casual' && (
                <h2 className="text-xs font-bold uppercase tracking-widest text-amber-600/70 flex items-center font-mono">
                  {profile.profileMode === 'professional' && <><FileText className="w-3.5 h-3.5 mr-2" /> Summary</>}
                  {profile.profileMode === 'creative' && <><Feather className="w-3.5 h-3.5 mr-2" /> Vision</>}
                </h2>
              )}
              <p className="leading-relaxed whitespace-pre-wrap text-[#f5ebd5]/90 text-[15px] font-serif">
                {profile.bio}
              </p>
            </div>
          )}"""

bio_replacement = """          {/* Bio */}
          {profile.bio && (
            <div className="flex flex-col items-center text-center space-y-3">
              {profile.profileMode !== 'casual' && (
                <h2 className="text-xs font-bold uppercase tracking-widest text-amber-600/70 flex items-center justify-center font-mono">
                  {profile.profileMode === 'professional' && <><FileText className="w-3.5 h-3.5 mr-2" /> Summary</>}
                  {profile.profileMode === 'creative' && <><Feather className="w-3.5 h-3.5 mr-2" /> Vision</>}
                </h2>
              )}
              <p className="leading-relaxed whitespace-pre-wrap text-[#f5ebd5]/90 text-[15px] font-serif max-w-xl mx-auto">
                {profile.bio}
              </p>
            </div>
          )}"""
if bio_target in content:
    content = content.replace(bio_target, bio_replacement)
    print("Bio replaced")

# 2. Update Details section to flex-wrap center instead of grid
details_target = """          {/* Details based on mode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">"""

details_replacement = """          {/* Details based on mode */}
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4">"""

if details_target in content:
    content = content.replace(details_target, details_replacement)
    print("Details replaced")

# 3. Center the "Social & Links" heading
social_target = """          {/* Links & Platforms */}
          {profile.links.length > 0 && (
            <div className="space-y-4 pt-2">
              <h2 className="text-xs font-bold uppercase tracking-widest text-amber-600/70 font-mono">
                Social & Links
              </h2>
              <div className="space-y-3">"""
              
social_replacement = """          {/* Links & Platforms */}
          {profile.links.length > 0 && (
            <div className="space-y-4 pt-2 flex flex-col items-center w-full">
              <h2 className="text-xs font-bold uppercase tracking-widest text-amber-600/70 font-mono text-center">
                Social & Links
              </h2>
              <div className="space-y-3 w-full">"""

if social_target in content:
    content = content.replace(social_target, social_replacement)
    print("Social replaced")

with open('src/components/PhantomDeckProfile.tsx', 'w') as f:
    f.write(content)


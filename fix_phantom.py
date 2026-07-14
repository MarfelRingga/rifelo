import re

with open('src/components/PhantomDeckProfile.tsx', 'r') as f:
    content = f.read()

# 1. Update Header to show name, status (jobTitle) and school (company) centered, and remove any remaining icons if they somehow got back in.
header_target = """          {/* Header */}
          <div className="flex flex-col items-center text-center space-y-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#f5ebd5] font-serif">
              {profile.fullName}
            </h1>
            
            {profile.jobTitle && (
              <div className="flex items-center justify-center text-amber-500/80 text-sm md:text-base font-semibold uppercase tracking-widest font-mono">
                <p>
                  {profile.jobTitle}
                  {profile.profileMode === 'professional' && profile.company ? ` | ${profile.company}` : ''}
                </p>
              </div>
            )}
          </div>"""

header_replacement = """          {/* Header */}
          <div className="flex flex-col items-center text-center space-y-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#f5ebd5] font-serif">
              {profile.fullName}
            </h1>
            
            {(profile.jobTitle || profile.company) && (
              <div className="flex flex-col items-center justify-center text-amber-500/80 text-sm md:text-base font-semibold uppercase tracking-widest font-mono space-y-1">
                {profile.jobTitle && <p>{profile.jobTitle}</p>}
                {profile.company && <p>{profile.company}</p>}
              </div>
            )}
          </div>"""

if header_target in content:
    content = content.replace(header_target, header_replacement)
    print("Header replaced")

# 2. Remove the Company/School card from the grid
company_target = """            {/* Company / School (Casual & Pro) */}
            {(profile.profileMode === 'casual' || profile.profileMode === 'professional') && profile.company && (
              <div 
                className="flex items-center gap-3 p-4 bg-[#261914]/40 border border-amber-950/40 rounded-xl text-amber-500 font-mono text-xs tracking-wider uppercase"
                style={{ borderRadius: linkRadius }}
              >
                {profile.profileMode === 'casual' ? (
                  <GraduationCap className="w-4 h-4 opacity-75" />
                ) : (
                  <Building className="w-4 h-4 opacity-75" />
                )}
                <span className="truncate">{profile.company}</span>
              </div>
            )}
            """

if company_target in content:
    content = content.replace(company_target, "")
    print("Company card removed")

with open('src/components/PhantomDeckProfile.tsx', 'w') as f:
    f.write(content)


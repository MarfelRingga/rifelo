import re

with open('src/app/(dashboard)/profile/page.tsx', 'r') as f:
    content = f.read()

target = """                <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-6">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest sm:w-36 shrink-0 sm:mt-5">Link Style</div>
                  <div className="flex flex-col gap-3 flex-1 w-full max-w-xl">
                    {/* Sharp */}
                    <button 
                      type="button"
                      onClick={() => updateCustomTheme({ borderRadius: 'sharp' })}
                      className={`flex items-center justify-between px-5 py-3.5 border-[1.5px] rounded-2xl transition-all duration-200 text-left w-full
                        ${(customTheme?.borderRadius) === 'sharp' 
                          ? 'border-slate-400 bg-slate-100/80 text-slate-900 shadow-inner backdrop-blur-sm font-extrabold' 
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                    >
                      <span className="text-sm">Sharp</span>
                      <div className="px-3 py-1 text-[11px] font-bold border-[1.5px] border-current rounded-none">
                        Link
                      </div>
                    </button>

                    {/* Rounded */}
                    <button 
                      type="button"
                      onClick={() => updateCustomTheme({ borderRadius: 'rounded' })}
                      className={`flex items-center justify-between px-5 py-3.5 border-[1.5px] rounded-2xl transition-all duration-200 text-left w-full
                        ${(customTheme?.borderRadius || 'rounded') === 'rounded' 
                          ? 'border-slate-400 bg-slate-100/80 text-slate-900 shadow-inner backdrop-blur-sm font-extrabold' 
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                    >
                      <span className="text-sm">Rounded</span>
                      <div className="px-3 py-1 text-[11px] font-bold border-[1.5px] border-current rounded-lg">
                        Link
                      </div>
                    </button>

                    {/* Pill */}
                    <button 
                      type="button"
                      onClick={() => updateCustomTheme({ borderRadius: 'pill' })}
                      className={`flex items-center justify-between px-5 py-3.5 border-[1.5px] rounded-2xl transition-all duration-200 text-left w-full
                        ${(customTheme?.borderRadius) === 'pill' 
                          ? 'border-slate-400 bg-slate-100/80 text-slate-900 shadow-inner backdrop-blur-sm font-extrabold' 
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                    >
                      <span className="text-sm">Pill</span>
                      <div className="px-3 py-1 text-[11px] font-bold border-[1.5px] border-current rounded-full">
                        Link
                      </div>
                    </button>
                  </div>
                </div>"""


replacement = """                <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-6">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest sm:w-36 shrink-0 sm:mt-5">Link Style</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 w-full max-w-xl">
                    {/* Sharp */}
                    <button 
                      type="button"
                      onClick={() => updateCustomTheme({ borderRadius: 'sharp' })}
                      className={`flex items-center justify-center px-5 py-3.5 border-[1.5px] rounded-none transition-all duration-200 text-center w-full
                        ${(customTheme?.borderRadius) === 'sharp' 
                          ? 'border-slate-400 bg-slate-100/80 text-slate-900 shadow-inner backdrop-blur-sm font-extrabold' 
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                    >
                      <span className="text-sm">Sharp</span>
                    </button>

                    {/* Rounded */}
                    <button 
                      type="button"
                      onClick={() => updateCustomTheme({ borderRadius: 'rounded' })}
                      className={`flex items-center justify-center px-5 py-3.5 border-[1.5px] rounded-lg transition-all duration-200 text-center w-full
                        ${(customTheme?.borderRadius || 'rounded') === 'rounded' 
                          ? 'border-slate-400 bg-slate-100/80 text-slate-900 shadow-inner backdrop-blur-sm font-extrabold' 
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                    >
                      <span className="text-sm">Rounded</span>
                    </button>

                    {/* Pill */}
                    <button 
                      type="button"
                      onClick={() => updateCustomTheme({ borderRadius: 'pill' })}
                      className={`flex items-center justify-center px-5 py-3.5 border-[1.5px] rounded-full transition-all duration-200 text-center w-full
                        ${(customTheme?.borderRadius) === 'pill' 
                          ? 'border-slate-400 bg-slate-100/80 text-slate-900 shadow-inner backdrop-blur-sm font-extrabold' 
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                    >
                      <span className="text-sm">Pill</span>
                    </button>
                  </div>
                </div>"""

if target in content:
    content = content.replace(target, replacement)
    with open('src/app/(dashboard)/profile/page.tsx', 'w') as f:
        f.write(content)
    print("Successfully replaced.")
else:
    print("Target not found.")


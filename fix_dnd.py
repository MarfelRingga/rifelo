import re

with open('src/app/(dashboard)/profile/page.tsx', 'r') as f:
    content = f.read()

# Add imports
imports_target = """import { ModeSwitchConfirmation } from '@/components/profile/ModeSwitchConfirmation';"""
imports_replacement = """import { ModeSwitchConfirmation } from '@/components/profile/ModeSwitchConfirmation';
import { SortableLinkItem } from '@/components/profile/SortableLinkItem';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';"""

if imports_target in content:
    content = content.replace(imports_target, imports_replacement)
    print("Added imports")

# Setup sensors in the component
# Need to find a good place, maybe right after state declarations

state_target = """  const { showToast } = useToast();"""
state_replacement = """  const { showToast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setLinks((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };"""

if state_target in content:
    content = content.replace(state_target, state_replacement)
    print("Added sensors and drag handler")

# Replace link mapping
links_target = """          <div className="space-y-4">
            {links.map((link) => {
              const isExpanded = expandedLinks[link.id];
              const platformInfo = getPlatformInfo(link.title || '', link.url || '');
              const isUrl = link.url?.startsWith('http://') || link.url?.startsWith('https://');
              
              return (
                <div key={link.id} className="flex flex-col bg-slate-50 rounded-xl border border-slate-200 group relative overflow-hidden transition-all">
                  <div 
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-100 transition-colors"
                    onClick={() => toggleLinkExpansion(link.id)}
                  >
                    <div className="flex items-center gap-3 flex-1 overflow-hidden">
                      <div className={`w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 ${platformInfo ? platformInfo.color : 'text-slate-400'}`}>
                        {platformInfo ? (
                          <platformInfo.icon className="w-4 h-4" />
                        ) : isUrl ? (
                          <LinkIcon className="w-4 h-4" />
                        ) : (
                          <span className="text-xs font-bold text-slate-400">
                            {link.title ? link.title.charAt(0).toUpperCase() : '#'}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 truncate">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {link.title || 'New Link'}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {link.url || 'No URL provided'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-4">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleToggleVisibility(link.id); }}
                        className={`p-2 rounded-lg transition-colors ${
                          link.is_visible === false 
                            ? 'text-slate-400 hover:text-slate-600 hover:bg-slate-200' 
                            : 'text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50'
                        }`}
                      >
                        {link.is_visible === false ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleRemoveLink(link.id); }}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="p-4 pt-0 border-t border-slate-100 mt-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1.5">Platform Name</label>
                          <input 
                            type="text" 
                            placeholder="Instagram, Portfolio..." 
                            value={link.title}
                            onChange={(e) => handleLinkChange(link.id, 'title', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all text-sm" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1.5">URL</label>
                          <input 
                            type="text" 
                            placeholder="https://..." 
                            value={link.url}
                            onChange={(e) => handleLinkChange(link.id, 'url', e.target.value)}
                            onBlur={() => handleLinkBlur(link.id)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all text-sm" 
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}"""

links_replacement = """          <div className="space-y-4">
            <DndContext 
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext 
                items={links.map(l => l.id)}
                strategy={verticalListSortingStrategy}
              >
                {links.map((link) => (
                  <SortableLinkItem
                    key={link.id}
                    link={link}
                    isExpanded={!!expandedLinks[link.id]}
                    toggleLinkExpansion={toggleLinkExpansion}
                    handleToggleVisibility={handleToggleVisibility}
                    handleRemoveLink={handleRemoveLink}
                    handleLinkChange={handleLinkChange}
                    handleLinkBlur={handleLinkBlur}
                  />
                ))}
              </SortableContext>
            </DndContext>"""

if links_target in content:
    content = content.replace(links_target, links_replacement)
    print("Replaced links map")
else:
    print("Links target not found")

with open('src/app/(dashboard)/profile/page.tsx', 'w') as f:
    f.write(content)


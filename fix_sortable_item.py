import re

with open('src/components/profile/SortableLinkItem.tsx', 'r') as f:
    content = f.read()

# Remove GripVertical import
content = content.replace("import { Trash2, Eye, EyeOff, ChevronDown, ChevronUp, Link as LinkIcon, GripVertical } from 'lucide-react';", "import { Trash2, Eye, EyeOff, ChevronDown, ChevronUp, Link as LinkIcon } from 'lucide-react';")

# Update rendering to remove grip icon and add attributes/listeners to the header div
old_render = """  return (
    <div ref={setNodeRef} style={style} className="flex flex-col bg-slate-50 rounded-xl border border-slate-200 group relative overflow-hidden transition-all">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-100 transition-colors"
        onClick={() => toggleLinkExpansion(link.id)}
      >
        <div className="flex items-center gap-3 flex-1 overflow-hidden">
          <div 
            {...attributes} 
            {...listeners}
            onClick={(e) => e.stopPropagation()} 
            className="cursor-grab hover:bg-slate-200 p-1.5 rounded-lg text-slate-400 transition-colors mr-1"
          >
            <GripVertical className="w-4 h-4" />
          </div>
          <div className={`w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 ${platformInfo ? platformInfo.color : 'text-slate-400'}`}>"""

new_render = """  return (
    <div ref={setNodeRef} style={style} className="flex flex-col bg-slate-50 rounded-xl border border-slate-200 group relative overflow-hidden transition-all">
      <div 
        {...attributes}
        {...listeners}
        className="flex items-center justify-between p-4 cursor-grab hover:bg-slate-100 transition-colors"
        onClick={() => toggleLinkExpansion(link.id)}
      >
        <div className="flex items-center gap-3 flex-1 overflow-hidden">
          <div className={`w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 ${platformInfo ? platformInfo.color : 'text-slate-400'}`}>"""

if old_render in content:
    content = content.replace(old_render, new_render)
    print("Successfully removed grip icon")
else:
    print("Could not find old render block")
    
# We also need to add stopPropagation to all the buttons so dragging from them doesn't start or something?
# Oh wait, buttons inside the drag handle (listeners) might trigger drag. We should use `onPointerDown={(e) => e.stopPropagation()}` on the buttons.

# Let's fix the buttons block
old_buttons = """        <div className="flex items-center gap-2 shrink-0 ml-4">
          <button 
            onClick={(e) => { e.stopPropagation(); handleToggleVisibility(link.id); }}"""
            
new_buttons = """        <div className="flex items-center gap-2 shrink-0 ml-4" onPointerDown={(e) => e.stopPropagation()}>
          <button 
            onClick={(e) => { e.stopPropagation(); handleToggleVisibility(link.id); }}"""

if old_buttons in content:
    content = content.replace(old_buttons, new_buttons)
    print("Added stopPropagation for buttons pointer down")

with open('src/components/profile/SortableLinkItem.tsx', 'w') as f:
    f.write(content)


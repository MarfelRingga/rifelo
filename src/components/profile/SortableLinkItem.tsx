import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, Eye, EyeOff, ChevronDown, ChevronUp, Link as LinkIcon } from 'lucide-react';
import { getPlatformInfo } from '@/lib/platforms';

interface CustomLink {
  id: string;
  title: string;
  url: string;
  is_visible?: boolean;
}

interface SortableLinkItemProps {
  link: CustomLink;
  isExpanded: boolean;
  toggleLinkExpansion: (id: string) => void;
  handleToggleVisibility: (id: string) => void;
  handleRemoveLink: (id: string) => void;
  handleLinkChange: (id: string, field: 'title' | 'url', value: string) => void;
  handleLinkBlur: (id: string) => void;
}

export function SortableLinkItem({
  link,
  isExpanded,
  toggleLinkExpansion,
  handleToggleVisibility,
  handleRemoveLink,
  handleLinkChange,
  handleLinkBlur
}: SortableLinkItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    opacity: isDragging ? 0.5 : 1,
  };

  const platformInfo = getPlatformInfo(link.title || '', link.url || '');
  const isUrl = link.url?.startsWith('http://') || link.url?.startsWith('https://');

  return (
    <div ref={setNodeRef} style={style} className="flex flex-col bg-slate-50 rounded-xl border border-slate-200 group relative overflow-hidden transition-all">
      <div 
        {...attributes}
        {...listeners}
        className={`flex items-center justify-between px-3 py-2.5 cursor-grab hover:bg-slate-100 transition-colors ${!isExpanded ? 'select-none' : ''}`}
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
            <p className="text-sm font-semibold text-slate-900 truncate leading-tight">
              {link.title || 'New Link'}
            </p>
            <p className="text-[11px] text-slate-500 truncate leading-tight mt-0.5">
              {link.url || 'No URL provided'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0 ml-3" onPointerDown={(e) => e.stopPropagation()}>
          <button 
            onClick={(e) => { e.stopPropagation(); handleToggleVisibility(link.id); }}
            className={`p-1.5 rounded-md transition-colors ${
              link.is_visible === false 
                ? 'text-slate-400 hover:text-slate-600 hover:bg-slate-200' 
                : 'text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50'
            }`}
          >
            {link.is_visible === false ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); handleRemoveLink(link.id); }}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-md transition-colors">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="px-4 pb-4 pt-3 border-t border-slate-200 cursor-default" onClick={(e) => e.stopPropagation()}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Platform</label>
              <input 
                type="text" 
                placeholder="Instagram, Portfolio..." 
                value={link.title}
                onChange={(e) => handleLinkChange(link.id, 'title', e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all text-sm" 
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                {platformInfo ? 'Username' : 'URL'}
              </label>
              <input 
                type="text" 
                placeholder={platformInfo ? "@username" : "https://..."}
                value={link.url}
                onChange={(e) => handleLinkChange(link.id, 'url', e.target.value)}
                onBlur={() => handleLinkBlur(link.id)}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all text-sm" 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

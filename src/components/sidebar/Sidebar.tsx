import React, { useState } from 'react';
import {
    Monitor,
    ChevronDown,
    ChevronRight,
    GripVertical,
    HelpCircle,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { RichTooltip } from '../ui/RichTooltip';
import { TOOLBOX_DATA } from '../../data/toolbox';
import type { ToolboxItem } from '../../data/toolbox';

interface SidebarProps {
    nodeCounts?: Record<string, number>;
}

const Sidebar = ({ nodeCounts = {} }: SidebarProps) => {
    const { t } = useLanguage();
    // State to track expanded categories. Default 'ui_lib' to open.
    const [expanded, setExpanded] = useState<Record<string, boolean>>({
        'ui_lib': true,
        'frontend': true
    });

    const onDragStart = (event: React.DragEvent, nodeType: string, label: string, uiType?: string, itemId?: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.setData('application/label', label);
        if (uiType) {
            event.dataTransfer.setData('application/uiType', uiType);
        }
        if (itemId) {
            event.dataTransfer.setData('application/toolboxId', itemId);
        }
        event.dataTransfer.effectAllowed = 'move';
    };

    const toggleExpand = (id: string) => {
        setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const getLabel = (item: ToolboxItem) => {
        if (item.type === 'tech' && item.techId) {
            return item.techId; // Tech Name is usually universal or can be translated if needed
        }
        if (item.type === 'ui' && item.labelKey) {
            // @ts-ignore - Dynamic key access
            return t.uiComponents.items[item.labelKey] || item.labelKey;
        }
        return item.id;
    };

    const renderItem = (item: ToolboxItem, colorClass: string) => {
        const label = getLabel(item);
        const isTech = item.type === 'tech';

        // Get count
        const countKey = item.id || item.uiType || label;
        const count = nodeCounts[countKey] || 0;

        // Get rich details if it's a tech item
        // @ts-ignore
        const techDetails = isTech && item.techId ? t.techDetails[item.techId] : undefined;

        // Get UI description for tooltip
        // @ts-ignore
        const uiDescription = !isTech && item.labelKey ? t.uiDescriptions[item.labelKey] : undefined;

        const content = (
            <div
                className={`
            flex items-center gap-2 px-3 py-2 rounded-lg border cursor-grab active:cursor-grabbing hover:shadow-md transition-all
            bg-white ${colorClass}
            relative group
            `}
                draggable
                onDragStart={(e) => onDragStart(e, isTech ? 'custom' : 'custom', label, item.uiType, item.id)} // Pass item.id as toolboxId
            >
                <GripVertical size={14} className="text-slate-400 opacity-50" />
                <span className="text-sm font-medium text-slate-700 flex-1 truncate">{label}</span>

                {count > 0 && (
                    <span className="flex items-center justify-center min-w-[20px] h-5 bg-blue-100 text-blue-600 text-xs font-bold rounded-full px-1.5 shadow-sm">
                        {count}
                    </span>
                )}

                {/* Question mark icon for tooltip with refined positioning */}
                {(isTech || uiDescription) && (
                    <div className="relative group/tip">
                        <div className="p-1 cursor-help text-slate-400 hover:text-slate-600 group-hover:opacity-100 opacity-50 transition-opacity">
                            <HelpCircle size={12} />
                        </div>

                        {/* Tooltip Content - precisely next to the icon */}
                        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-[9999] opacity-0 group-hover/tip:opacity-100 pointer-events-none transition-opacity duration-200">
                            <div className="bg-slate-800 text-white text-xs px-3 py-2 rounded-lg shadow-xl w-[220px] whitespace-normal border border-slate-700 relative">
                                {/* Small Arrow */}
                                <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-slate-800" />

                                <div className="font-medium text-slate-100 mb-1">{label}</div>
                                <div className="text-slate-300 leading-relaxed">{techDetails?.summary || uiDescription}</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );

        // Wrap with tooltip for tech items
        if (isTech && techDetails) {
            return (
                <div key={item.id} className="relative group/item">
                    <RichTooltip title={label} content={techDetails}>
                        {content}
                    </RichTooltip>
                </div>
            );
        }

        // Wrap with simple tooltip for UI items
        if (uiDescription) {
            return (
                <div key={item.id} className="relative group/tip">
                    {content}
                    <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-[9999] opacity-0 group-hover/tip:opacity-100 pointer-events-none transition-opacity duration-200">
                        {/* Tooltip Content */}
                        <div className="bg-slate-800 text-white text-xs px-3 py-2 rounded-lg shadow-xl w-[220px] whitespace-normal border border-slate-700 relative">
                            {/* Small Arrow */}
                            <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-slate-800" />

                            <div className="font-medium text-slate-100 mb-1">{label}</div>
                            <div className="text-slate-300 leading-relaxed">{uiDescription}</div>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div key={item.id} className="relative">
                {content}
            </div>
        );
    };

    return (
        <aside className="w-64 bg-white border-r border-slate-200 h-full flex flex-col shadow-xl z-10 shrink-0">
            <div className="p-4 border-b border-slate-100 bg-slate-50">
                <h2 className="font-bold text-slate-800 flex items-center gap-2">
                    <Monitor size={18} />
                    {t.toolbox}
                </h2>
                <p className="text-xs text-slate-500 mt-1">{t.dragTip}</p>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-hide">
                {TOOLBOX_DATA.map(category => {
                    const isExpanded = expanded[category.id];
                    // Resolve category title
                    let title = '';
                    if (category.labelKey.includes('.')) {
                        // Nested key like 'uiComponents.title'
                        const keys = category.labelKey.split('.');
                        // @ts-ignore
                        title = t[keys[0]][keys[1]];
                    } else {
                        // @ts-ignore
                        title = t.categories[category.labelKey];
                    }

                    return (
                        <div key={category.id} className="rounded-xl border border-slate-100 bg-white shadow-sm">
                            {/* Category Header */}
                            <button
                                onClick={() => toggleExpand(category.id)}
                                className={`w-full flex items-center justify-between p-3 text-left transition-colors ${isExpanded ? 'bg-slate-50' : 'hover:bg-slate-50'}`}
                            >
                                <span className="font-bold text-sm text-slate-700">{title}</span>
                                {isExpanded ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}
                            </button>

                            {/* Category Content */}
                            {isExpanded && (
                                <div className="p-2 space-y-2 bg-slate-50/50">
                                    {/* Flat Items (Tech) */}
                                    {category.items && (
                                        <div className="grid grid-cols-1 gap-2">
                                            {category.items.map(item => renderItem(item, category.color))}
                                        </div>
                                    )}

                                    {/* Nested SubGroups (UI Components) */}
                                    {category.subGroups && category.subGroups.map(sub => {
                                        // @ts-ignore
                                        const subTitle = t.uiComponents[sub.labelKey];

                                        return (
                                            <div key={sub.id} className="ml-1 pl-2 border-l-2 border-slate-200">
                                                <h4 className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">{subTitle}</h4>
                                                <div className="grid grid-cols-1 gap-2">
                                                    {sub.items.map(item => renderItem(item, 'border-slate-100 bg-white'))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </aside>
    );
};

export default Sidebar;

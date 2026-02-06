import { memo, useState, useCallback, useRef, useEffect } from 'react';
import { Handle, Position, useReactFlow, NodeResizer } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { Edit3, X, Search, Image as ImageIcon, Check, ChevronDown, Type, Palette, Layers, FileText } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

// Define Color Options
const COLORS = [
    { name: 'slate', bg: 'bg-slate-100', border: 'border-slate-300', text: 'text-slate-700', ring: 'ring-slate-400' },
    { name: 'red', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', ring: 'ring-red-400' },
    { name: 'orange', bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', ring: 'ring-orange-400' },
    { name: 'amber', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', ring: 'ring-amber-400' },
    { name: 'green', bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', ring: 'ring-green-400' },
    { name: 'blue', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', ring: 'ring-blue-400' },
    { name: 'indigo', bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700', ring: 'ring-indigo-400' },
    { name: 'purple', bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', ring: 'ring-purple-400' },
    { name: 'pink', bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-700', ring: 'ring-pink-400' },
];

const CustomNode = ({ id, data, selected }: NodeProps) => {
    const { setNodes, deleteElements } = useReactFlow();
    const { t } = useLanguage();
    const [isEditing, setIsEditing] = useState(false);

    // State for Node Data
    const [label, setLabel] = useState((data.label as string) || 'Node');
    const [description, setDescription] = useState((data.description as string) || '');
    const [attribute, setAttribute] = useState((data.attribute as string) || 'component');
    const [variant, setVariant] = useState((data.variant as string) || 'solid');
    const [colorName, setColorName] = useState((data.color as string) || 'slate');

    const inputRef = useRef<HTMLInputElement>(null);

    // Identify Node Type
    const uiType = data.uiType as string | undefined;

    // Derived Color Styles
    const activeColor = COLORS.find(c => c.name === colorName) || COLORS[0];

    useEffect(() => {
        setLabel((data.label as string) || 'Node');
        setDescription((data.description as string) || '');
        setAttribute((data.attribute as string) || 'component');
        setVariant((data.variant as string) || 'solid');
        setColorName((data.color as string) || 'slate');
    }, [data]);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const onSubmit = useCallback(() => {
        setIsEditing(false);
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === id) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            label,
                            description,
                            attribute,
                            variant,
                            color: colorName,
                        },
                    };
                }
                return node;
            })
        );
    }, [id, label, description, attribute, variant, colorName, setNodes]);

    const onDelete = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        deleteElements({ nodes: [{ id }] });
    }, [id, deleteElements]);

    // --- Renderers ---

    // Edit Mode UI
    if (isEditing) {
        return (
            <div className="min-w-[300px] bg-white rounded-xl shadow-2xl border border-primary p-4 z-[1000] relative animate-in fade-in zoom-in-95 duration-200 cursor-default" onDoubleClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2">
                    <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <Edit3 size={14} /> {t.edit.title}
                    </h3>
                    <button onClick={onSubmit} className="p-1 hover:bg-slate-100 rounded text-slate-400">
                        <X size={14} />
                    </button>
                </div>

                <div className="space-y-4">
                    {/* Title */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{t.edit.title}</label>
                        <input
                            ref={inputRef}
                            type="text"
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
                            className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                        />
                    </div>

                    {/* Attribute & Variant Row */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                <Layers size={10} /> {t.edit.attribute}
                            </label>
                            <div className="relative">
                                <select
                                    value={attribute}
                                    onChange={(e) => setAttribute(e.target.value)}
                                    className="w-full pl-2 pr-6 py-1.5 text-xs border border-slate-200 rounded appearance-none focus:border-primary outline-none bg-white font-sans"
                                >
                                    {Object.entries(t.attributes).map(([key, val]) => (
                                        <option key={key} value={key}>{val}</option>
                                    ))}
                                </select>
                                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                <Type size={10} /> {t.edit.variant}
                            </label>
                            <div className="relative">
                                <select
                                    value={variant}
                                    onChange={(e) => setVariant(e.target.value)}
                                    className="w-full pl-2 pr-6 py-1.5 text-xs border border-slate-200 rounded appearance-none focus:border-primary outline-none bg-white font-sans"
                                >
                                    {Object.entries(t.variants).map(([key, val]) => (
                                        <option key={key} value={key}>{val}</option>
                                    ))}
                                </select>
                                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Color Picker */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                            <Palette size={10} /> {t.edit.color}
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                            {COLORS.map((c) => (
                                <button
                                    key={c.name}
                                    onClick={() => setColorName(c.name)}
                                    className={`w-6 h-6 rounded-full border-2 transition-all ${c.bg} ${c.border} flex items-center justify-center ${colorName === c.name ? 'ring-2 ring-primary ring-offset-1 scale-110' : 'hover:scale-105'}`}
                                >
                                    {colorName === c.name && <Check size={12} className={c.text} />}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                            <FileText size={10} /> {t.edit.description}
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
                            placeholder="Describe logic, requirements, or AI context..."
                        />
                    </div>

                    <button
                        onClick={onSubmit}
                        className="w-full py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-blue-600 transition-colors"
                    >
                        Save Changes
                    </button>

                    <button
                        onClick={onDelete}
                        className="w-full py-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-md text-xs font-medium transition-colors"
                    >
                        Delete Node
                    </button>
                </div>
            </div>
        );
    }


    /* --- View Mode Renderers based on uiType / toolboxId --- */

    // Helper to determine specific visual style
    const toolboxId = data.toolboxId as string | undefined;

    // Common Wrapper Props
    const DeleteBtn = () => (
        <button
            onClick={onDelete}
            className="absolute -top-2 -right-2 z-50 p-0.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-sm"
        >
            <X size={10} />
        </button>
    );

    // Quad-Directional Handles Component
    const QuadHandles = () => (
        <>
            <Handle
                type="target"
                position={Position.Top}
                id="top-target"
                className="!w-2 !h-2 !bg-slate-300 !border-white !border hover:!bg-primary transition-colors !opacity-0 group-hover:!opacity-100"
            />
            <Handle
                type="source"
                position={Position.Top}
                id="top-source"
                className="!w-2 !h-2 !bg-slate-300 !border-white !border hover:!bg-primary transition-colors !opacity-0 group-hover:!opacity-100"
            />
            <Handle
                type="target"
                position={Position.Bottom}
                id="bottom-target"
                className="!w-2 !h-2 !bg-slate-300 !border-white !border hover:!bg-primary transition-colors !opacity-0 group-hover:!opacity-100"
            />
            <Handle
                type="source"
                position={Position.Bottom}
                id="bottom-source"
                className="!w-2 !h-2 !bg-slate-300 !border-white !border hover:!bg-primary transition-colors !opacity-0 group-hover:!opacity-100"
            />
            <Handle
                type="target"
                position={Position.Left}
                id="left-target"
                className="!w-2 !h-2 !bg-slate-300 !border-white !border hover:!bg-primary transition-colors !opacity-0 group-hover:!opacity-100"
            />
            <Handle
                type="source"
                position={Position.Left}
                id="left-source"
                className="!w-2 !h-2 !bg-slate-300 !border-white !border hover:!bg-primary transition-colors !opacity-0 group-hover:!opacity-100"
            />
            <Handle
                type="target"
                position={Position.Right}
                id="right-target"
                className="!w-2 !h-2 !bg-slate-300 !border-white !border hover:!bg-primary transition-colors !opacity-0 group-hover:!opacity-100"
            />
            <Handle
                type="source"
                position={Position.Right}
                id="right-source"
                className="!w-2 !h-2 !bg-slate-300 !border-white !border hover:!bg-primary transition-colors !opacity-0 group-hover:!opacity-100"
            />
        </>
    );

    // --- Specialized Renderers ---

    // 1. Navbar
    if (toolboxId === 'navbar') {
        return (
            <>
                <NodeResizer minWidth={300} minHeight={50} isVisible={selected} />
                <div className="group relative w-full h-full min-w-[300px]" onDoubleClick={() => setIsEditing(true)}>
                    <DeleteBtn />
                    <div className={`w-full h-full flex items-center justify-between px-4 py-2 bg-white border border-slate-200 shadow-sm ${selected ? 'ring-2 ring-primary border-primary' : ''} ${activeColor.border}`}>
                        <div className="flex items-center gap-4">
                            <div className={`w-8 h-8 rounded bg-slate-100 ${activeColor.bg} flex items-center justify-center font-bold text-xs ${activeColor.text}`}>Logo</div>
                            <div className="flex gap-3 text-xs text-slate-500">
                                <span className="text-slate-800 font-medium">Home</span>
                                <span>Products</span>
                                <span>Pricing</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <div className={`w-20 h-8 rounded bg-slate-100 ${activeColor.bg}`} />
                        </div>
                    </div>
                    <QuadHandles />
                </div>
            </>
        );
    }

    // 2. Sidebar
    if (toolboxId === 'sidebar') {
        return (
            <>
                <NodeResizer minWidth={180} minHeight={300} isVisible={selected} />
                <div className="group relative w-full h-full min-w-[180px]" onDoubleClick={() => setIsEditing(true)}>
                    <DeleteBtn />
                    <div className={`w-full h-full flex flex-col bg-white border border-slate-200 shadow-sm ${selected ? 'ring-2 ring-primary border-primary' : ''} ${activeColor.border}`}>
                        <div className={`h-12 w-full border-b border-slate-100 flex items-center px-4 font-bold text-slate-700 ${activeColor.text}`}>
                            {label === 'Node' ? 'Dashboard' : label}
                        </div>
                        <div className="p-2 space-y-1">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className={`h-8 w-full rounded flex items-center px-2 text-xs text-slate-500 ${i === 1 ? `${activeColor.bg} ${activeColor.text} font-medium` : 'hover:bg-slate-50'}`}>
                                    Item {i}
                                </div>
                            ))}
                        </div>
                    </div>
                    <QuadHandles />
                </div>
            </>
        );
    }

    // 3. Table
    if (toolboxId === 'table') {
        return (
            <>
                <NodeResizer minWidth={300} minHeight={200} isVisible={selected} />
                <div className="group relative w-full h-full min-w-[300px]" onDoubleClick={() => setIsEditing(true)}>
                    <DeleteBtn />
                    <div className={`w-full h-full bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden flex flex-col ${selected ? 'ring-2 ring-primary border-primary' : ''}`}>
                        {/* Header */}
                        <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 bg-slate-50/50">
                            <span className="text-xs font-bold text-slate-700">{label}</span>
                            <div className="flex gap-1">
                                <div className="w-2 h-2 rounded-full bg-slate-200" />
                                <div className="w-2 h-2 rounded-full bg-slate-200" />
                            </div>
                        </div>
                        {/* Grid */}
                        <div className="flex-1 flex flex-col">
                            <div className="flex border-b border-slate-100 bg-slate-50 text-[10px] text-slate-500 font-medium">
                                <div className="flex-1 p-2 border-r border-slate-100">Col 1</div>
                                <div className="flex-1 p-2 border-r border-slate-100">Col 2</div>
                                <div className="flex-1 p-2">Col 3</div>
                            </div>
                            {[1, 2, 3].map(row => (
                                <div key={row} className="flex border-b border-slate-50 text-[10px] text-slate-600 last:border-0">
                                    <div className="flex-1 p-2 border-r border-slate-50">Row {row}</div>
                                    <div className="flex-1 p-2 border-r border-slate-50">Data</div>
                                    <div className="flex-1 p-2">Data</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // 4. Modal
    if (toolboxId === 'modal') {
        return (
            <>
                <NodeResizer minWidth={300} minHeight={200} isVisible={selected} />
                <div className="group relative w-full h-full min-w-[300px]" onDoubleClick={() => setIsEditing(true)}>
                    <DeleteBtn />
                    {/* Backdrop representation */}
                    <div className="absolute inset-0 bg-slate-900/10 rounded-lg -z-10 scale-105 blur-sm" />

                    <div className={`w-full h-full bg-white border border-slate-200 rounded-lg shadow-xl flex flex-col overflow-hidden ${selected ? 'ring-2 ring-primary border-primary' : ''}`}>
                        <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                            <span className="font-semibold text-slate-800 text-sm">{label}</span>
                            <X size={14} className="text-slate-400" />
                        </div>
                        <div className="p-4 flex-1 bg-slate-50/30">
                            <div className="space-y-2">
                                <div className="h-2 w-3/4 bg-slate-200 rounded animate-pulse" />
                                <div className="h-2 w-1/2 bg-slate-200 rounded animate-pulse" />
                                <div className="h-2 w-5/6 bg-slate-200 rounded animate-pulse" />
                            </div>
                        </div>
                        <div className="px-4 py-3 border-t border-slate-100 flex justify-end gap-2 bg-slate-50">
                            <div className="h-8 w-16 bg-white border border-slate-200 rounded shadow-sm" />
                            <div className={`h-8 w-16 rounded shadow-sm ${activeColor.bg}`} />
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // 5. Tabs
    if (toolboxId === 'tabs') {
        return (
            <>
                <NodeResizer minWidth={250} minHeight={100} isVisible={selected} />
                <div className="group relative w-full h-full min-w-[250px]" onDoubleClick={() => setIsEditing(true)}>
                    <DeleteBtn />
                    <div className={`w-full h-full bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col overflow-hidden ${selected ? 'ring-2 ring-primary border-primary' : ''}`}>
                        <div className="flex border-b border-slate-200 bg-slate-50">
                            {['Tab 1', 'Tab 2', 'Tab 3'].map((tab, i) => (
                                <div key={tab} className={`px-4 py-2 text-xs font-medium ${i === 0 ? `bg-white border-t-2 ${activeColor.border.replace('border-', 'border-t-')} text-slate-800` : 'text-slate-500 hover:text-slate-700'}`}>
                                    {tab}
                                </div>
                            ))}
                        </div>
                        <div className="p-4 flex-1">
                            <div className="text-xs text-slate-400 text-center mt-2">{label} Content</div>
                        </div>
                    </div>
                    <QuadHandles />
                </div>
            </>
        )
    }

    // 6. Form Controls (Switch, Checkbox, Radio, Slider)
    if (['switch', 'checkbox', 'radio', 'slider'].includes(toolboxId || '')) {
        return (
            <>
                <NodeResizer minWidth={120} minHeight={40} isVisible={selected} />
                <div className="group relative w-full h-full" onDoubleClick={() => setIsEditing(true)}>
                    <DeleteBtn />
                    <div className={`w-full h-full bg-white border border-slate-200 rounded px-3 flex items-center gap-3 shadow-sm ${selected ? 'ring-2 ring-primary border-primary' : ''}`}>

                        {toolboxId === 'switch' && (
                            <div className={`w-8 h-4 rounded-full p-0.5 ${activeColor.bg.replace('50', '500')}`}>
                                <div className="w-3 h-3 bg-white rounded-full shadow-sm ml-auto" />
                            </div>
                        )}

                        {toolboxId === 'checkbox' && (
                            <div className={`w-4 h-4 rounded border ${activeColor.border.replace('200', '400')} ${activeColor.bg} flex items-center justify-center text-current`}>
                                <Check size={10} />
                            </div>
                        )}

                        {toolboxId === 'radio' && (
                            <div className={`w-4 h-4 rounded-full border ${activeColor.border.replace('200', '400')} flex items-center justify-center`}>
                                <div className={`w-2 h-2 rounded-full ${activeColor.bg.replace('50', '500')}`} />
                            </div>
                        )}

                        {toolboxId === 'slider' && (
                            <div className="flex-1 h-1.5 bg-slate-100 rounded-full relative">
                                <div className={`absolute top-0 left-0 h-full w-1/2 rounded-full ${activeColor.bg.replace('50', '500')}`} />
                                <div className="absolute top-1/2 left-1/2 -translate-y-1/2 w-3 h-3 bg-white border border-slate-200 rounded-full shadow-sm" />
                            </div>
                        )}

                        {toolboxId !== 'slider' && <span className="text-xs font-medium text-slate-700 truncate">{label}</span>}
                    </div>
                    <QuadHandles />
                </div>
            </>
        )
    }

    // 7. Standard Inputs (Text, Search) - exclude select which has specialized renderer
    if ((uiType === 'Input' || toolboxId === 'inp_text' || toolboxId === 'inp_search') && toolboxId !== 'select') {
        return (
            <>
                <NodeResizer minWidth={150} minHeight={35} isVisible={selected} />
                <div className="group relative w-full h-full min-w-[150px]" onDoubleClick={() => setIsEditing(true)}>
                    <DeleteBtn />
                    <div className={`
                        flex items-center gap-2 px-3 py-2 bg-white border rounded-md shadow-sm w-full h-full
                        ${selected ? 'border-primary ring-1 ring-primary' : `${activeColor.border}`}
                    `}>
                        <span className="text-slate-400">
                            {(label.toLowerCase().includes('search') || toolboxId === 'inp_search') ? <Search size={14} /> : <Edit3 size={14} />}
                        </span>
                        <span className="text-sm text-slate-400 flex-1 truncate">{label || 'Input'}</span>
                    </div>
                    <QuadHandles />
                </div>
            </>
        );
    }

    // 8. Image
    if (uiType === 'Image' || toolboxId === 'image') {
        return (
            <>
                <NodeResizer minWidth={50} minHeight={50} isVisible={selected} keepAspectRatio />
                <div className="group relative w-full h-full min-w-[50px] min-h-[50px]" onDoubleClick={() => setIsEditing(true)}>
                    <DeleteBtn />
                    <div className={`
                        w-full h-full bg-slate-50 border rounded-lg flex flex-col items-center justify-center text-slate-400 overflow-hidden
                        ${selected ? 'border-primary ring-1 ring-primary' : `${activeColor.border}`}
                    `}>
                        <ImageIcon size={24} className="mb-1 opacity-50" />
                        <span className="text-[10px] truncate w-full text-center px-1 font-mono">IMG</span>
                    </div>
                    <QuadHandles />
                </div>
            </>
        );
    }

    // 9. Buttons (exclude items that have specialized renderers)
    const specializedIds = ['breadcrumb', 'tag', 'badge', 'toast', 'select', 'divider', 'list', 'alert'];
    if ((uiType === 'Button' || toolboxId?.includes('button')) && !specializedIds.includes(toolboxId || '')) {
        const isOutline = variant === 'outline';
        const isGhost = variant === 'ghost';
        const isLink = variant === 'link';

        let btnClass = `${activeColor.bg} ${activeColor.text} border-transparent`;

        if (isOutline) {
            btnClass = `bg-white border-2 ${activeColor.border.replace('border-', 'border-')} ${activeColor.text}`;
        }
        if (isGhost) {
            btnClass = `bg-transparent hover:${activeColor.bg} ${activeColor.text} border-transparent`;
        }
        if (isLink) {
            btnClass = `bg-transparent underline ${activeColor.text} border-transparent p-0 justify-start`;
        }

        return (
            <>
                <NodeResizer minWidth={80} minHeight={30} isVisible={selected} />
                <div className="group relative w-full h-full" onDoubleClick={() => setIsEditing(true)}>
                    <DeleteBtn />
                    <button
                        className={`
                         w-full h-full px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-all pointer-events-none flex items-center justify-center
                         ${selected ? 'ring-2 ring-offset-1 ring-primary' : ''}
                         ${btnClass}
                     `}
                    >
                        {label}
                    </button>
                    <QuadHandles />
                </div>
            </>
        );
    }

    // 10. Breadcrumb
    if (toolboxId === 'breadcrumb') {
        return (
            <>
                <NodeResizer minWidth={200} minHeight={30} isVisible={selected} />
                <div className="group relative w-full h-full min-w-[200px]" onDoubleClick={() => setIsEditing(true)}>
                    <DeleteBtn />
                    <div className={`w-full h-full bg-white border border-slate-200 rounded px-3 py-2 flex items-center gap-2 shadow-sm ${selected ? 'ring-2 ring-primary border-primary' : ''}`}>
                        <span className={`text-xs ${activeColor.text} font-medium`}>Home</span>
                        <span className="text-slate-300">/</span>
                        <span className="text-xs text-slate-500">Products</span>
                        <span className="text-slate-300">/</span>
                        <span className="text-xs text-slate-400">{label}</span>
                    </div>
                    <QuadHandles />
                </div>
            </>
        );
    }

    // 11. Divider
    if (toolboxId === 'divider') {
        return (
            <>
                <NodeResizer minWidth={100} minHeight={20} isVisible={selected} />
                <div className="group relative w-full h-full min-w-[100px] flex items-center" onDoubleClick={() => setIsEditing(true)}>
                    <DeleteBtn />
                    <div className={`w-full border-t-2 ${activeColor.border.replace('200', '300')}`} />
                    <QuadHandles />
                </div>
            </>
        );
    }

    // 12. List
    if (toolboxId === 'list') {
        return (
            <>
                <NodeResizer minWidth={150} minHeight={120} isVisible={selected} />
                <div className="group relative w-full h-full min-w-[150px]" onDoubleClick={() => setIsEditing(true)}>
                    <DeleteBtn />
                    <div className={`w-full h-full bg-white border border-slate-200 rounded-lg p-3 shadow-sm ${selected ? 'ring-2 ring-primary border-primary' : ''}`}>
                        <div className="space-y-2">
                            {['Item 1', 'Item 2', 'Item 3'].map((item, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <div className={`w-1.5 h-1.5 rounded-full ${activeColor.bg.replace('50', '500')}`} />
                                    <span className="text-xs text-slate-600">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <QuadHandles />
                </div>
            </>
        );
    }

    // 13. Tag
    if (toolboxId === 'tag') {
        return (
            <>
                <NodeResizer minWidth={60} minHeight={24} isVisible={selected} />
                <div className="group relative w-full h-full" onDoubleClick={() => setIsEditing(true)}>
                    <DeleteBtn />
                    <div className={`w-full h-full inline-flex items-center justify-center px-2 py-1 rounded-md text-xs font-bold ${activeColor.bg.replace('50', '600')} text-white border-transparent shadow-sm ${selected ? 'ring-2 ring-primary border-primary' : ''}`}>
                        {label}
                    </div>
                    <QuadHandles />
                </div>
            </>
        );
    }

    // 14. Badge
    if (toolboxId === 'badge') {
        return (
            <>
                <NodeResizer minWidth={24} minHeight={24} isVisible={selected} keepAspectRatio />
                <div className="group relative w-full h-full" onDoubleClick={() => setIsEditing(true)}>
                    <DeleteBtn />
                    <div className={`w-full h-full min-w-[24px] min-h-[24px] rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg ${activeColor.bg.replace('50', '700')} ${selected ? 'ring-2 ring-primary ring-offset-2' : 'ring-2 ring-white'}`}>
                        {label.length > 2 ? '1' : label || '1'}
                    </div>
                    <QuadHandles />
                </div>
            </>
        );
    }

    // 15. Alert
    if (toolboxId === 'alert') {
        return (
            <>
                <NodeResizer minWidth={250} minHeight={60} isVisible={selected} />
                <div className="group relative w-full h-full min-w-[250px]" onDoubleClick={() => setIsEditing(true)}>
                    <DeleteBtn />
                    <div className={`w-full h-full ${activeColor.bg} border ${activeColor.border} rounded-lg p-3 flex items-start gap-3 ${selected ? 'ring-2 ring-primary' : ''}`}>
                        <div className={`w-5 h-5 rounded-full ${activeColor.bg.replace('50', '100')} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                            <span className={`text-xs font-bold ${activeColor.text}`}>!</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className={`text-sm font-semibold ${activeColor.text}`}>{label}</div>
                            <div className="text-xs text-slate-500 mt-0.5">This is an alert message.</div>
                        </div>
                    </div>
                    <QuadHandles />
                </div>
            </>
        );
    }

    // 16. Toast
    if (toolboxId === 'toast') {
        return (
            <>
                <NodeResizer minWidth={250} minHeight={50} isVisible={selected} />
                <div className="group relative w-full h-full min-w-[250px]" onDoubleClick={() => setIsEditing(true)}>
                    <DeleteBtn />
                    <div className={`w-full h-full bg-slate-800 text-white rounded-lg px-4 py-3 flex items-center gap-3 shadow-lg ${selected ? 'ring-2 ring-primary ring-offset-2' : ''}`}>
                        <div className={`w-5 h-5 rounded-full ${activeColor.bg.replace('50', '500')} flex items-center justify-center flex-shrink-0`}>
                            <Check size={12} className="text-white" />
                        </div>
                        <span className="text-sm font-medium flex-1 truncate">{label}</span>
                        <X size={14} className="text-slate-400 flex-shrink-0" />
                    </div>
                    <QuadHandles />
                </div>
            </>
        );
    }

    // 17. Select (Dropdown)
    if (toolboxId === 'select') {
        return (
            <>
                <NodeResizer minWidth={150} minHeight={35} isVisible={selected} />
                <div className="group relative w-full h-full min-w-[150px]" onDoubleClick={() => setIsEditing(true)}>
                    <DeleteBtn />
                    <div className={`w-full h-full bg-white border rounded-md shadow-sm flex items-center justify-between px-3 py-2 ${selected ? 'border-primary ring-1 ring-primary' : `${activeColor.border}`}`}>
                        <span className="text-sm text-slate-500 truncate">{label || 'Select...'}</span>
                        <ChevronDown size={14} className="text-slate-400 flex-shrink-0" />
                    </div>
                    <QuadHandles />
                </div>
            </>
        );
    }

    // Default: Container / Card / Generic
    // Fallback for everything else
    const isWindow = variant === 'window' || uiType === 'Container' || toolboxId === 'container';
    return (
        <>
            <NodeResizer minWidth={150} minHeight={100} isVisible={selected} />
            <div
                className={`
                group relative w-full h-full min-w-[200px] min-h-[150px] bg-white rounded-lg shadow-sm border transition-all duration-300
                ${selected ? 'ring-2 ring-primary border-primary shadow-xl' : `border-slate-200 hover:shadow-md ${activeColor.ring}`}
            `}
                onDoubleClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
            >
                <DeleteBtn />

                {/* Header */}
                <div className={`
                h-8 border-b border-slate-100 flex items-center px-3 gap-2
                ${isWindow ? 'bg-slate-100 rounded-t-lg' : `${activeColor.bg} rounded-t-lg`}
            `}>
                    {isWindow ? (
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                        </div>
                    ) : (
                        <div className={`w-2 h-2 rounded-full ${activeColor.bg.replace('bg-', 'bg-')}-400 ring-1 ring-black/10`} />
                    )}
                    <div className="flex-1 text-xs text-slate-500 font-mono text-center truncate pointer-events-none font-bold">
                        {t.attributes[attribute as keyof typeof t.attributes] || attribute}
                    </div>
                </div>

                {/* Body */}
                <div className="p-4 flex flex-col h-[calc(100%-2rem)]">
                    <div className="text-sm font-bold text-slate-700 mb-1">{label}</div>
                    {description && <div className="text-[10px] text-slate-400 line-clamp-2">{description}</div>}

                    <div className="mt-auto w-full border-2 border-dashed border-slate-100 rounded-lg flex items-center justify-center text-xs text-slate-300 py-4 pointer-events-none">
                        Drop items
                    </div>
                </div>

                <QuadHandles />
            </div>
        </>
    );
};

export default memo(CustomNode);

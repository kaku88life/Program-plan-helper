import React, { useEffect, useState } from 'react';
import { X, Type, Palette, Trash2, AlignLeft, AlignCenter, AlignRight, Bold, ArrowRight, ArrowLeftRight, Minus } from 'lucide-react';
import type { Node, Edge } from '@xyflow/react';
import { useLanguage } from '../../context/LanguageContext';
import { COLORS } from '../../constants/colors';

interface PropertiesPanelProps {
    selectedNode: Node | null;
    selectedEdge?: Edge | null;
    onUpdateNode: (nodeId: string, data: Partial<Node['data']>) => void;
    onUpdateEdge?: (edgeId: string, data: Record<string, any>) => void;
    onDeleteNode: (nodeId: string) => void;
    onDeleteEdge?: (edgeId: string) => void;
    onClose: () => void;
}

// Use shared color constants
const COLOR_OPTIONS = COLORS.map(c => ({
    id: c.id,
    label: c.name,
    color: c.preview,
}));

const SIZE_OPTIONS = [
    { id: 'small', label: '小', scale: 0.8 },
    { id: 'medium', label: '中', scale: 1 },
    { id: 'large', label: '大', scale: 1.2 },
];

const STYLE_PRESETS = [
    { id: 'default', labelZh: '預設', labelEn: 'Default', color: 'slate', variant: 'default', icon: '⚪' },
    { id: 'primary', labelZh: '強調', labelEn: 'Primary', color: 'blue', variant: 'filled', icon: '🔵' },
    { id: 'success', labelZh: '成功', labelEn: 'Success', color: 'emerald', variant: 'filled', icon: '🟢' },
    { id: 'warning', labelZh: '警告', labelEn: 'Warning', color: 'amber', variant: 'filled', icon: '🟡' },
    { id: 'error', labelZh: '錯誤', labelEn: 'Error', color: 'rose', variant: 'filled', icon: '🔴' },
    { id: 'disabled', labelZh: '禁用', labelEn: 'Disabled', color: 'slate', variant: 'disabled', icon: '⚫' },
];

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
    selectedNode,
    selectedEdge,
    onUpdateNode,
    onUpdateEdge,
    onDeleteNode,
    onDeleteEdge,
    onClose
}) => {
    const { language } = useLanguage();

    // Node State
    const [label, setLabel] = useState('');
    const [description, setDescription] = useState('');
    const [selectedColor, setSelectedColor] = useState('slate');
    const [selectedSize, setSelectedSize] = useState('medium');
    const [textAlign, setTextAlign] = useState<string>('left');
    const [fontWeight, setFontWeight] = useState<string>('bold');

    // Edge State
    const [edgeLabel, setEdgeLabel] = useState('');
    const [arrowType, setArrowType] = useState('forward');
    const [lineStyle, setLineStyle] = useState('solid');

    // Sync state with selected node
    useEffect(() => {
        if (selectedNode) {
            setLabel((selectedNode.data.label as string) || '');
            setDescription((selectedNode.data.description as string) || '');
            setSelectedColor((selectedNode.data.color as string) || 'slate');
            setSelectedSize((selectedNode.data.size as string) || 'medium');
            setTextAlign((selectedNode.data.textAlign as string) || 'left');
            setFontWeight((selectedNode.data.fontWeight as string) || 'bold');
        }
    }, [selectedNode]);

    // Sync state with selected edge
    useEffect(() => {
        if (selectedEdge) {
            setEdgeLabel((selectedEdge.data?.label as string) || '');
            setArrowType((selectedEdge.data?.arrowType as string) || 'forward');
            setLineStyle((selectedEdge.data?.lineStyle as string) || 'solid');
        }
    }, [selectedEdge]);

    if (!selectedNode && !selectedEdge) {
        return (
            <div className="w-72 bg-white border-l border-slate-200 h-full flex flex-col shadow-xl">
                <div className="p-4 border-b border-slate-100 bg-slate-50">
                    <h3 className="font-bold text-slate-800">
                        {language === 'zh' ? '屬性面板' : 'Properties'}
                    </h3>
                </div>
                <div className="flex-1 flex items-center justify-center p-4">
                    <p className="text-sm text-slate-400 text-center">
                        {language === 'zh' ? '選擇一個元件或連線以編輯屬性' : 'Select a node or edge to edit properties'}
                    </p>
                </div>
            </div>
        );
    }

    const handleLabelChange = (newLabel: string) => {
        if (!selectedNode) return;
        setLabel(newLabel);
        onUpdateNode(selectedNode.id, { label: newLabel });
    };

    const handleDescriptionChange = (newDesc: string) => {
        if (!selectedNode) return;
        setDescription(newDesc);
        onUpdateNode(selectedNode.id, { description: newDesc });
    };

    const handleColorChange = (colorId: string) => {
        if (!selectedNode) return;
        setSelectedColor(colorId);
        onUpdateNode(selectedNode.id, { color: colorId });
    };

    const handleSizeChange = (sizeId: string) => {
        if (!selectedNode) return;
        setSelectedSize(sizeId);
        const sizeOption = SIZE_OPTIONS.find(s => s.id === sizeId);
        onUpdateNode(selectedNode.id, {
            size: sizeId,
            sizeScale: sizeOption?.scale || 1
        });
    };

    const handleTextAlignChange = (align: string) => {
        if (!selectedNode) return;
        setTextAlign(align);
        onUpdateNode(selectedNode.id, { textAlign: align });
    };

    const handleFontWeightChange = () => {
        if (!selectedNode) return;
        const newWeight = fontWeight === 'bold' ? 'normal' : 'bold';
        setFontWeight(newWeight);
        onUpdateNode(selectedNode.id, { fontWeight: newWeight });
    };

    const handlePresetChange = (preset: typeof STYLE_PRESETS[0]) => {
        if (!selectedNode) return;
        setSelectedColor(preset.color);
        onUpdateNode(selectedNode.id, {
            color: preset.color,
            variant: preset.variant,
            stylePreset: preset.id
        });
    };

    // Edge Handlers
    const handleEdgeLabelChange = (newLabel: string) => {
        setEdgeLabel(newLabel);
        if (selectedEdge && onUpdateEdge) {
            onUpdateEdge(selectedEdge.id, { label: newLabel });
        }
    };

    const handleArrowTypeChange = (type: string) => {
        setArrowType(type);
        if (selectedEdge && onUpdateEdge) {
            onUpdateEdge(selectedEdge.id, { arrowType: type });
        }
    };

    const handleLineStyleChange = (style: string) => {
        setLineStyle(style);
        if (selectedEdge && onUpdateEdge) {
            onUpdateEdge(selectedEdge.id, { lineStyle: style });
        }
    };

    const nodeType = selectedNode ? ((selectedNode.data.toolboxId as string) ||
        (selectedNode.data.uiType as string) ||
        'node') : '';

    return (
        <div className="w-72 bg-white border-l border-slate-200 h-full flex flex-col shadow-xl">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <h3 className="font-bold text-slate-800">
                    {language === 'zh' ? '屬性面板' : 'Properties'}
                </h3>
                <button
                    onClick={onClose}
                    className="p-1 hover:bg-slate-200 rounded transition-colors"
                >
                    <X size={16} className="text-slate-500" />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedEdge ? (
                    /* Edge Properties Controls */
                    <div className="space-y-4">
                        <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">
                            {language === 'zh' ? '連線設定' : 'Connection'}
                        </div>

                        {/* Edge Label */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                <Type size={14} />
                                {language === 'zh' ? '標籤' : 'Label'}
                            </label>
                            <input
                                type="text"
                                value={edgeLabel}
                                onChange={(e) => handleEdgeLabelChange(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder={language === 'zh' ? '輸入標籤...' : 'Enter label...'}
                            />
                        </div>

                        {/* Arrow Type */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">
                                {language === 'zh' ? '箭頭類型' : 'Arrow Type'}
                            </label>
                            <div className="grid grid-cols-4 gap-2">
                                {[
                                    { type: 'none', icon: <Minus size={14} />, label: 'None' },
                                    { type: 'forward', icon: <ArrowRight size={14} />, label: '→' },
                                    { type: 'backward', icon: <ArrowRight size={14} className="rotate-180" />, label: '←' },
                                    { type: 'bidirectional', icon: <ArrowLeftRight size={14} />, label: '↔' },
                                ].map((option) => (
                                    <button
                                        key={option.type}
                                        onClick={() => handleArrowTypeChange(option.type)}
                                        className={`p-2 rounded-lg border flex flex-col items-center gap-1 transition-all ${arrowType === option.type
                                            ? 'bg-blue-50 border-blue-500 text-blue-700'
                                            : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                                            }`}
                                        title={option.label}
                                    >
                                        {option.icon}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Line Style */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">
                                {language === 'zh' ? '線條樣式' : 'Line Style'}
                            </label>
                            <div className="flex gap-2">
                                {[
                                    { type: 'solid', label: language === 'zh' ? '實線' : 'Solid' },
                                    { type: 'dashed', label: language === 'zh' ? '虛線' : 'Dashed' },
                                    { type: 'dotted', label: language === 'zh' ? '點線' : 'Dotted' },
                                ].map((option) => (
                                    <button
                                        key={option.type}
                                        onClick={() => handleLineStyleChange(option.type)}
                                        className={`flex-1 py-1.5 text-xs font-medium rounded-lg border transition-all ${lineStyle === option.type
                                            ? 'bg-blue-50 border-blue-500 text-blue-700'
                                            : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                                            }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Node Properties Controls */
                    <>
                        {/* Node Type Badge */}
                        <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">
                            {nodeType}
                        </div>

                        {/* Label Input */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                <Type size={14} />
                                {language === 'zh' ? '標籤' : 'Label'}
                            </label>
                            <input
                                type="text"
                                value={label}
                                onChange={(e) => handleLabelChange(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder={language === 'zh' ? '輸入標籤文字...' : 'Enter label...'}
                            />
                        </div>

                        {/* Description Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">
                                {language === 'zh' ? '描述' : 'Description'}
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => handleDescriptionChange(e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                                placeholder={language === 'zh' ? '輸入描述...' : 'Enter description...'}
                            />
                        </div>

                        {/* Text Style Controls */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">
                                {language === 'zh' ? '文字樣式' : 'Text Style'}
                            </label>
                            <div className="flex gap-2">
                                {/* Alignment */}
                                <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-200">
                                    <button
                                        onClick={() => handleTextAlignChange('left')}
                                        className={`p-1.5 rounded ${textAlign === 'left' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
                                        title="Align Left"
                                    >
                                        <AlignLeft size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleTextAlignChange('center')}
                                        className={`p-1.5 rounded ${textAlign === 'center' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
                                        title="Align Center"
                                    >
                                        <AlignCenter size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleTextAlignChange('right')}
                                        className={`p-1.5 rounded ${textAlign === 'right' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
                                        title="Align Right"
                                    >
                                        <AlignRight size={16} />
                                    </button>
                                </div>

                                {/* Font Weight */}
                                <button
                                    onClick={handleFontWeightChange}
                                    className={`p-2 rounded-lg border flex items-center justify-center flex-1 transition-all ${fontWeight === 'bold'
                                        ? 'bg-slate-800 text-white border-slate-800'
                                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                                        }`}
                                    title="Toggle Bold"
                                >
                                    <Bold size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Color Picker */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                                <Palette size={14} />
                                {language === 'zh' ? '顏色' : 'Color'}
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {COLOR_OPTIONS.map((colorOpt) => (
                                    <button
                                        key={colorOpt.id}
                                        onClick={() => handleColorChange(colorOpt.id)}
                                        className={`w-8 h-8 rounded-full ${colorOpt.color} transition-all ${selectedColor === colorOpt.id
                                            ? 'ring-2 ring-offset-2 ring-primary scale-110'
                                            : 'hover:scale-105'
                                            } `}
                                        title={colorOpt.label}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Size Selector */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">
                                {language === 'zh' ? '大小' : 'Size'}
                            </label>
                            <div className="flex gap-2">
                                {SIZE_OPTIONS.map((sizeOpt) => (
                                    <button
                                        key={sizeOpt.id}
                                        onClick={() => handleSizeChange(sizeOpt.id)}
                                        className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg border transition-all ${selectedSize === sizeOpt.id
                                            ? 'bg-primary text-white border-primary'
                                            : 'bg-white text-slate-600 border-slate-200 hover:border-primary hover:text-primary'
                                            } `}
                                    >
                                        {language === 'zh' ? sizeOpt.label : sizeOpt.id}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Dimension Controls - Width & Height */}
                        <div className="space-y-3 pt-2 border-t border-slate-100">
                            <label className="text-sm font-medium text-slate-700">
                                {language === 'zh' ? '精確尺寸' : 'Dimensions'}
                            </label>

                            {/* Width Slider */}
                            <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-slate-500">{language === 'zh' ? '寬度' : 'Width'}</span>
                                    <span className="text-xs font-medium text-slate-600">
                                        {(selectedNode!.data.nodeWidth as number) || 180}px
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="80"
                                    max="500"
                                    value={(selectedNode!.data.nodeWidth as number) || 180}
                                    onChange={(e) => onUpdateNode(selectedNode!.id, { nodeWidth: parseInt(e.target.value) })}
                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                            </div>

                            {/* Height Slider */}
                            <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-slate-500">{language === 'zh' ? '高度' : 'Height'}</span>
                                    <span className="text-xs font-medium text-slate-600">
                                        {(selectedNode!.data.nodeHeight as number) || 60}px
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="40"
                                    max="400"
                                    value={(selectedNode!.data.nodeHeight as number) || 60}
                                    onChange={(e) => onUpdateNode(selectedNode!.id, { nodeHeight: parseInt(e.target.value) })}
                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                            </div>

                            {/* Quick Size Buttons */}
                            <div className="flex gap-1">
                                <button
                                    onClick={() => onUpdateNode(selectedNode!.id, { nodeWidth: 120, nodeHeight: 50 })}
                                    className="flex-1 py-1 text-xs rounded border border-slate-200 text-slate-600 hover:border-primary hover:text-primary"
                                >
                                    {language === 'zh' ? '小' : 'S'}
                                </button>
                                <button
                                    onClick={() => onUpdateNode(selectedNode!.id, { nodeWidth: 180, nodeHeight: 70 })}
                                    className="flex-1 py-1 text-xs rounded border border-slate-200 text-slate-600 hover:border-primary hover:text-primary"
                                >
                                    {language === 'zh' ? '中' : 'M'}
                                </button>
                                <button
                                    onClick={() => onUpdateNode(selectedNode!.id, { nodeWidth: 260, nodeHeight: 100 })}
                                    className="flex-1 py-1 text-xs rounded border border-slate-200 text-slate-600 hover:border-primary hover:text-primary"
                                >
                                    {language === 'zh' ? '大' : 'L'}
                                </button>
                                <button
                                    onClick={() => onUpdateNode(selectedNode!.id, { nodeWidth: 360, nodeHeight: 140 })}
                                    className="flex-1 py-1 text-xs rounded border border-slate-200 text-slate-600 hover:border-primary hover:text-primary"
                                >
                                    {language === 'zh' ? '特大' : 'XL'}
                                </button>
                            </div>
                        </div>

                        {/* Style Presets */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">
                                {language === 'zh' ? '快速樣式' : 'Quick Styles'}
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {STYLE_PRESETS.map((preset) => (
                                    <button
                                        key={preset.id}
                                        onClick={() => handlePresetChange(preset)}
                                        className={`p-2 text-xs font-medium rounded-lg border transition-all flex flex-col items-center gap-1 ${(selectedNode!.data.stylePreset as string) === preset.id
                                            ? 'bg-primary/10 border-primary text-primary'
                                            : 'bg-white text-slate-600 border-slate-200 hover:border-primary hover:text-primary'
                                            } `}
                                    >
                                        <span className="text-base">{preset.icon}</span>
                                        <span>{language === 'zh' ? preset.labelZh : preset.labelEn}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Footer - Delete Button */}
            <div className="p-4 border-t border-slate-100">
                <button
                    onClick={() => {
                        if (selectedNode) {
                            onDeleteNode(selectedNode.id);
                        } else if (selectedEdge && onDeleteEdge) {
                            onDeleteEdge(selectedEdge.id);
                        }
                        onClose();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-red-50 text-red-600 rounded-lg border border-red-200 hover:bg-red-100 transition-colors"
                >
                    <Trash2 size={16} />
                    {language === 'zh' ? '刪除' : 'Delete'}
                </button>
            </div>
        </div>
    );
};

export default PropertiesPanel;

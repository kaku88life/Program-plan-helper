import React, { useEffect, useState } from 'react';
import { X, Type, Palette, Trash2 } from 'lucide-react';
import type { Node } from '@xyflow/react';
import { useLanguage } from '../../context/LanguageContext';

interface PropertiesPanelProps {
    selectedNode: Node | null;
    onUpdateNode: (nodeId: string, data: Partial<Node['data']>) => void;
    onDeleteNode: (nodeId: string) => void;
    onClose: () => void;
}

const COLOR_OPTIONS = [
    { id: 'slate', label: '灰色', color: 'bg-slate-500' },
    { id: 'blue', label: '藍色', color: 'bg-blue-500' },
    { id: 'emerald', label: '綠色', color: 'bg-emerald-500' },
    { id: 'amber', label: '橙色', color: 'bg-amber-500' },
    { id: 'rose', label: '紅色', color: 'bg-rose-500' },
    { id: 'purple', label: '紫色', color: 'bg-purple-500' },
    { id: 'cyan', label: '青色', color: 'bg-cyan-500' },
];

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
    onUpdateNode,
    onDeleteNode,
    onClose
}) => {
    const { language } = useLanguage();
    const [label, setLabel] = useState('');
    const [description, setDescription] = useState('');
    const [selectedColor, setSelectedColor] = useState('slate');
    const [selectedSize, setSelectedSize] = useState('medium');

    // Sync state with selected node
    useEffect(() => {
        if (selectedNode) {
            setLabel((selectedNode.data.label as string) || '');
            setDescription((selectedNode.data.description as string) || '');
            setSelectedColor((selectedNode.data.color as string) || 'slate');
            setSelectedSize((selectedNode.data.size as string) || 'medium');
        }
    }, [selectedNode]);

    if (!selectedNode) {
        return (
            <div className="w-72 bg-white border-l border-slate-200 h-full flex flex-col shadow-xl">
                <div className="p-4 border-b border-slate-100 bg-slate-50">
                    <h3 className="font-bold text-slate-800">
                        {language === 'zh' ? '屬性面板' : 'Properties'}
                    </h3>
                </div>
                <div className="flex-1 flex items-center justify-center p-4">
                    <p className="text-sm text-slate-400 text-center">
                        {language === 'zh' ? '選擇一個元件以編輯屬性' : 'Select a node to edit properties'}
                    </p>
                </div>
            </div>
        );
    }

    const handleLabelChange = (newLabel: string) => {
        setLabel(newLabel);
        onUpdateNode(selectedNode.id, { label: newLabel });
    };

    const handleDescriptionChange = (newDesc: string) => {
        setDescription(newDesc);
        onUpdateNode(selectedNode.id, { description: newDesc });
    };

    const handleColorChange = (colorId: string) => {
        setSelectedColor(colorId);
        onUpdateNode(selectedNode.id, { color: colorId });
    };

    const handleSizeChange = (sizeId: string) => {
        setSelectedSize(sizeId);
        const sizeOption = SIZE_OPTIONS.find(s => s.id === sizeId);
        onUpdateNode(selectedNode.id, {
            size: sizeId,
            sizeScale: sizeOption?.scale || 1
        });
    };

    const handlePresetChange = (preset: typeof STYLE_PRESETS[0]) => {
        setSelectedColor(preset.color);
        onUpdateNode(selectedNode.id, {
            color: preset.color,
            variant: preset.variant,
            stylePreset: preset.id
        });
    };

    const nodeType = (selectedNode.data.toolboxId as string) ||
        (selectedNode.data.uiType as string) ||
        'node';

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
                                    }`}
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
                                    }`}
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
                                {(selectedNode.data.nodeWidth as number) || 180}px
                            </span>
                        </div>
                        <input
                            type="range"
                            min="80"
                            max="500"
                            value={(selectedNode.data.nodeWidth as number) || 180}
                            onChange={(e) => onUpdateNode(selectedNode.id, { nodeWidth: parseInt(e.target.value) })}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                    </div>

                    {/* Height Slider */}
                    <div className="space-y-1">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-500">{language === 'zh' ? '高度' : 'Height'}</span>
                            <span className="text-xs font-medium text-slate-600">
                                {(selectedNode.data.nodeHeight as number) || 60}px
                            </span>
                        </div>
                        <input
                            type="range"
                            min="40"
                            max="400"
                            value={(selectedNode.data.nodeHeight as number) || 60}
                            onChange={(e) => onUpdateNode(selectedNode.id, { nodeHeight: parseInt(e.target.value) })}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                    </div>

                    {/* Quick Size Buttons */}
                    <div className="flex gap-1">
                        <button
                            onClick={() => onUpdateNode(selectedNode.id, { nodeWidth: 120, nodeHeight: 50 })}
                            className="flex-1 py-1 text-xs rounded border border-slate-200 text-slate-600 hover:border-primary hover:text-primary"
                        >
                            {language === 'zh' ? '小' : 'S'}
                        </button>
                        <button
                            onClick={() => onUpdateNode(selectedNode.id, { nodeWidth: 180, nodeHeight: 70 })}
                            className="flex-1 py-1 text-xs rounded border border-slate-200 text-slate-600 hover:border-primary hover:text-primary"
                        >
                            {language === 'zh' ? '中' : 'M'}
                        </button>
                        <button
                            onClick={() => onUpdateNode(selectedNode.id, { nodeWidth: 260, nodeHeight: 100 })}
                            className="flex-1 py-1 text-xs rounded border border-slate-200 text-slate-600 hover:border-primary hover:text-primary"
                        >
                            {language === 'zh' ? '大' : 'L'}
                        </button>
                        <button
                            onClick={() => onUpdateNode(selectedNode.id, { nodeWidth: 360, nodeHeight: 140 })}
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
                                className={`p-2 text-xs font-medium rounded-lg border transition-all flex flex-col items-center gap-1 ${(selectedNode.data.stylePreset as string) === preset.id
                                    ? 'bg-primary/10 border-primary text-primary'
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-primary hover:text-primary'
                                    }`}
                            >
                                <span className="text-base">{preset.icon}</span>
                                <span>{language === 'zh' ? preset.labelZh : preset.labelEn}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer - Delete Button */}
            <div className="p-4 border-t border-slate-100">
                <button
                    onClick={() => {
                        onDeleteNode(selectedNode.id);
                        onClose();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-red-50 text-red-600 rounded-lg border border-red-200 hover:bg-red-100 transition-colors"
                >
                    <Trash2 size={16} />
                    {language === 'zh' ? '刪除元件' : 'Delete Node'}
                </button>
            </div>
        </div>
    );
};

export default PropertiesPanel;

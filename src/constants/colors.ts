// Shared color definitions for entire application
// Used by both PropertiesPanel and CustomNode to ensure consistency

export const COLORS = [
    {
        id: 'slate',
        name: '灰色',
        nameEn: 'Gray',
        bg: 'bg-slate-100',
        bgHex: '#f1f5f9',
        border: 'border-slate-300',
        borderHex: '#cbd5e1',
        text: 'text-slate-700',
        textHex: '#334155',
        ring: 'ring-slate-400',
        preview: 'bg-slate-500'
    },
    {
        id: 'blue',
        name: '藍色',
        nameEn: 'Blue',
        bg: 'bg-blue-50',
        bgHex: '#eff6ff',
        border: 'border-blue-200',
        borderHex: '#bfdbfe',
        text: 'text-blue-700',
        textHex: '#1d4ed8',
        ring: 'ring-blue-400',
        preview: 'bg-blue-500'
    },
    {
        id: 'emerald',
        name: '綠色',
        nameEn: 'Green',
        bg: 'bg-emerald-50',
        bgHex: '#ecfdf5',
        border: 'border-emerald-200',
        borderHex: '#a7f3d0',
        text: 'text-emerald-700',
        textHex: '#047857',
        ring: 'ring-emerald-400',
        preview: 'bg-emerald-500'
    },
    {
        id: 'amber',
        name: '橙色',
        nameEn: 'Orange',
        bg: 'bg-amber-50',
        bgHex: '#fffbeb',
        border: 'border-amber-200',
        borderHex: '#fde68a',
        text: 'text-amber-700',
        textHex: '#b45309',
        ring: 'ring-amber-400',
        preview: 'bg-amber-500'
    },
    {
        id: 'rose',
        name: '紅色',
        nameEn: 'Red',
        bg: 'bg-rose-50',
        bgHex: '#fff1f2',
        border: 'border-rose-200',
        borderHex: '#fecdd3',
        text: 'text-rose-700',
        textHex: '#be123c',
        ring: 'ring-rose-400',
        preview: 'bg-rose-500'
    },
    {
        id: 'purple',
        name: '紫色',
        nameEn: 'Purple',
        bg: 'bg-purple-50',
        bgHex: '#faf5ff',
        border: 'border-purple-200',
        borderHex: '#e9d5ff',
        text: 'text-purple-700',
        textHex: '#7e22ce',
        ring: 'ring-purple-400',
        preview: 'bg-purple-500'
    },
    {
        id: 'cyan',
        name: '青色',
        nameEn: 'Cyan',
        bg: 'bg-cyan-50',
        bgHex: '#ecfeff',
        border: 'border-cyan-200',
        borderHex: '#a5f3fc',
        text: 'text-cyan-700',
        textHex: '#0e7490',
        ring: 'ring-cyan-400',
        preview: 'bg-cyan-500'
    },
] as const;

export type ColorId = typeof COLORS[number]['id'];

export const getColorById = (id: string) => {
    return COLORS.find(c => c.id === id) || COLORS[0];
};

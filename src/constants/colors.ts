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
        bg: 'bg-blue-100',
        bgHex: '#dbeafe',
        border: 'border-blue-300',
        borderHex: '#93c5fd',
        text: 'text-blue-700',
        textHex: '#1d4ed8',
        ring: 'ring-blue-400',
        preview: 'bg-blue-500'
    },
    {
        id: 'emerald',
        name: '綠色',
        nameEn: 'Green',
        bg: 'bg-emerald-100',
        bgHex: '#d1fae5',
        border: 'border-emerald-300',
        borderHex: '#6ee7b7',
        text: 'text-emerald-700',
        textHex: '#047857',
        ring: 'ring-emerald-400',
        preview: 'bg-emerald-500'
    },
    {
        id: 'amber',
        name: '橙色',
        nameEn: 'Orange',
        bg: 'bg-amber-100',
        bgHex: '#fef3c7',
        border: 'border-amber-300',
        borderHex: '#fcd34d',
        text: 'text-amber-700',
        textHex: '#b45309',
        ring: 'ring-amber-400',
        preview: 'bg-amber-500'
    },
    {
        id: 'rose',
        name: '紅色',
        nameEn: 'Red',
        bg: 'bg-rose-100',
        bgHex: '#ffe4e6',
        border: 'border-rose-300',
        borderHex: '#fda4af',
        text: 'text-rose-700',
        textHex: '#be123c',
        ring: 'ring-rose-400',
        preview: 'bg-rose-500'
    },
    {
        id: 'purple',
        name: '紫色',
        nameEn: 'Purple',
        bg: 'bg-purple-100',
        bgHex: '#f3e8ff',
        border: 'border-purple-300',
        borderHex: '#d8b4fe',
        text: 'text-purple-700',
        textHex: '#7e22ce',
        ring: 'ring-purple-400',
        preview: 'bg-purple-500'
    },
    {
        id: 'cyan',
        name: '青色',
        nameEn: 'Cyan',
        bg: 'bg-cyan-100',
        bgHex: '#cffafe',
        border: 'border-cyan-300',
        borderHex: '#67e8f9',
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

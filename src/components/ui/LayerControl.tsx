import { Layers, ChevronUp, ChevronDown, Trash2, Crosshair, X } from 'lucide-react';
import type { Node } from '@xyflow/react';
import { useReactFlow } from '@xyflow/react';
import { useLanguage } from '../../context/LanguageContext';

interface LayerControlProps {
    nodes: Node[];
    onClose: () => void;
}

export function LayerControl({ nodes, onClose }: LayerControlProps) {
    const { setNodes, setCenter } = useReactFlow();
    const { language } = useLanguage();
    const t = language === 'zh' ? {
        title: '圖層與元件管理',
        bringToFront: '移至最前',
        sendToBack: '移至最後',
        focus: '聚焦元件',
        delete: '刪除',
        noNodes: '畫布上沒有元件'
    } : {
        title: 'Layers & Components',
        bringToFront: 'Bring to Front',
        sendToBack: 'Send to Back',
        focus: 'Focus Node',
        delete: 'Delete',
        noNodes: 'No nodes on canvas'
    };

    const adjustZIndex = (id: string, action: 'front' | 'back') => {
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === id) {
                    const zIndex = action === 'front' ? 1000 : -100;
                    return { ...node, zIndex };
                }
                return node;
            })
        );
    };

    const focusNode = (node: Node) => {
        setCenter(node.position.x + 100, node.position.y + 75, { zoom: 1.2, duration: 800 });
    };

    const deleteNode = (id: string) => {
        setNodes((nds) => nds.filter((n) => n.id !== id));
    };

    return (
        <div className="absolute top-20 right-4 w-72 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200 z-[100] overflow-hidden flex flex-col max-h-[60vh] animate-in slide-in-from-right-4 duration-300">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white/50">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                    <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                        <Layers size={18} />
                    </div>
                    <span className="text-sm">{t.title}</span>
                </div>
                <button
                    onClick={onClose}
                    className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <X size={18} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-hide">
                {nodes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-300">
                        <Layers size={32} className="opacity-20 mb-2" />
                        <span className="text-xs italic">{t.noNodes}</span>
                    </div>
                ) : (
                    [...nodes].reverse().map((node) => (
                        <div
                            key={node.id}
                            className="group flex items-center gap-3 p-2.5 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100 transition-all duration-200 cursor-default"
                        >
                            <div className={`w-2 h-8 rounded-full bg-slate-100 group-hover:bg-primary/20 transition-colors shrink-0`} />

                            <div className="flex-1 min-w-0">
                                <div className="text-[13px] font-semibold text-slate-700 truncate">
                                    {node.data.label as string}
                                </div>
                                <div className="text-[10px] text-slate-400 flex items-center gap-1 uppercase font-mono">
                                    {node.data.uiType as string || 'UI'} • Z:{node.zIndex || 0}
                                </div>
                            </div>

                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0">
                                <button
                                    onClick={() => focusNode(node)}
                                    className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-500 transition-colors"
                                    title={t.focus}
                                >
                                    <Crosshair size={14} />
                                </button>
                                <div className="w-[1px] h-4 bg-slate-100 mx-0.5" />
                                <button
                                    onClick={() => adjustZIndex(node.id, 'front')}
                                    className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                                    title={t.bringToFront}
                                >
                                    <ChevronUp size={14} />
                                </button>
                                <button
                                    onClick={() => adjustZIndex(node.id, 'back')}
                                    className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                                    title={t.sendToBack}
                                >
                                    <ChevronDown size={14} />
                                </button>
                                <button
                                    onClick={() => deleteNode(node.id)}
                                    className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 transition-colors"
                                    title={t.delete}
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-400 text-center uppercase tracking-widest font-bold">
                {nodes.length} Elements Active
            </div>
        </div>
    );
}

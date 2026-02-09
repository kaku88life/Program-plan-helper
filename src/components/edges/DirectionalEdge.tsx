import {
    BaseEdge,
    EdgeLabelRenderer,
    getBezierPath,
    useReactFlow,
    MarkerType,
} from '@xyflow/react';
import type { EdgeProps } from '@xyflow/react';
import { useState, useRef, useCallback, useEffect } from 'react';
import { X, ArrowRight, ArrowLeftRight, Minus } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

// Arrow type options
type ArrowType = 'none' | 'forward' | 'backward' | 'bidirectional';
type LineStyle = 'solid' | 'dashed' | 'dotted';

interface EdgeData {
    label?: string;
    sourceLabel?: string;
    targetLabel?: string;
    arrowType?: ArrowType;
    lineStyle?: LineStyle;
}

export default function DirectionalEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    data,
    selected,
}: EdgeProps) {
    const { setEdges } = useReactFlow();
    const { language } = useLanguage();

    // Parse edge data
    const edgeData = data as EdgeData || {};
    const arrowType: ArrowType = edgeData.arrowType || 'forward';
    const lineStyle: LineStyle = edgeData.lineStyle || 'solid';

    // Calculate paths
    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    // For bidirectional, calculate offset paths
    const offset = 4;
    const [forwardPath] = getBezierPath({
        sourceX,
        sourceY: sourceY - offset,
        sourcePosition,
        targetX,
        targetY: targetY - offset,
        targetPosition,
    });
    const [backwardPath] = getBezierPath({
        sourceX: targetX,
        sourceY: targetY + offset,
        sourcePosition: targetPosition,
        targetX: sourceX,
        targetY: sourceY + offset,
        targetPosition: sourcePosition,
    });

    // State
    const [showEditPanel, setShowEditPanel] = useState(false);
    const [label, setLabel] = useState(edgeData.label || '');
    const [sourceLabel, setSourceLabel] = useState(edgeData.sourceLabel || '');
    const [targetLabel, setTargetLabel] = useState(edgeData.targetLabel || '');
    const [selectedArrowType, setSelectedArrowType] = useState<ArrowType>(arrowType);
    const [selectedLineStyle, setSelectedLineStyle] = useState<LineStyle>(lineStyle);

    const panelRef = useRef<HTMLDivElement>(null);

    // Sync state with data
    useEffect(() => {
        setLabel(edgeData.label || '');
        setSourceLabel(edgeData.sourceLabel || '');
        setTargetLabel(edgeData.targetLabel || '');
        setSelectedArrowType(edgeData.arrowType || 'forward');
        setSelectedLineStyle(edgeData.lineStyle || 'solid');
    }, [edgeData.label, edgeData.sourceLabel, edgeData.targetLabel, edgeData.arrowType, edgeData.lineStyle]);

    // Click outside to close panel
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
                setShowEditPanel(false);
            }
        };
        if (showEditPanel) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showEditPanel]);

    const onEdgeClick = (evt: React.MouseEvent) => {
        evt.stopPropagation();
        setShowEditPanel(true);
    };

    const onDelete = (evt: React.MouseEvent) => {
        evt.stopPropagation();
        setEdges((edges) => edges.filter((e) => e.id !== id));
    };

    const updateEdgeData = useCallback((newData: Partial<EdgeData>) => {
        setEdges((edges) =>
            edges.map((e) => {
                if (e.id === id) {
                    const updatedData = { ...e.data, ...newData };
                    // Update markers based on arrow type
                    let markerStart = undefined;
                    let markerEnd = undefined;
                    const arrowT = newData.arrowType ?? selectedArrowType;

                    if (arrowT === 'forward' || arrowT === 'bidirectional') {
                        markerEnd = { type: MarkerType.ArrowClosed, color: '#64748b' };
                    }
                    if (arrowT === 'backward' || arrowT === 'bidirectional') {
                        markerStart = { type: MarkerType.ArrowClosed, color: '#64748b' };
                    }

                    return {
                        ...e,
                        data: updatedData,
                        markerStart,
                        markerEnd,
                    };
                }
                return e;
            })
        );
    }, [id, setEdges, selectedArrowType]);

    const handleSave = () => {
        updateEdgeData({
            label,
            sourceLabel,
            targetLabel,
            arrowType: selectedArrowType,
            lineStyle: selectedLineStyle,
        });
        setShowEditPanel(false);
    };

    // Line style to CSS
    const getLineStyle = () => {
        switch (selectedLineStyle) {
            case 'dashed':
                return { strokeDasharray: '8,4' };
            case 'dotted':
                return { strokeDasharray: '2,4' };
            default:
                return {};
        }
    };

    // Calculate label positions
    const sourceLabelX = sourceX + (targetX - sourceX) * 0.2;
    const sourceLabelY = sourceY + (targetY - sourceY) * 0.2;
    const targetLabelX = sourceX + (targetX - sourceX) * 0.8;
    const targetLabelY = sourceY + (targetY - sourceY) * 0.8;

    // Render edge based on type
    const renderEdge = () => {
        const baseStyle = { ...style, ...getLineStyle(), stroke: '#64748b', strokeWidth: 3 };

        if (selectedArrowType === 'bidirectional') {
            // Render two parallel paths
            return (
                <>
                    <path
                        d={forwardPath}
                        fill="none"
                        style={baseStyle}
                        markerEnd="url(#arrow-forward)"
                    />
                    <path
                        d={backwardPath}
                        fill="none"
                        style={baseStyle}
                        markerEnd="url(#arrow-backward)"
                    />
                </>
            );
        }

        // Single path with markers
        return (
            <BaseEdge
                path={edgePath}
                style={baseStyle}
                markerStart={selectedArrowType === 'backward' ? 'url(#arrow-backward)' : undefined}
                markerEnd={selectedArrowType === 'forward' ? 'url(#arrow-forward)' : undefined}
            />
        );
    };

    return (
        <>
            {/* Arrow marker definitions - smoother design */}
            <defs>
                <marker
                    id="arrow-forward"
                    viewBox="0 0 12 12"
                    refX="10"
                    refY="6"
                    markerWidth="8"
                    markerHeight="8"
                    orient="auto"
                >
                    <path
                        d="M 2 2 L 10 6 L 2 10 L 4 6 Z"
                        fill="#64748b"
                        strokeLinejoin="round"
                    />
                </marker>
                <marker
                    id="arrow-backward"
                    viewBox="0 0 12 12"
                    refX="2"
                    refY="6"
                    markerWidth="8"
                    markerHeight="8"
                    orient="auto"
                >
                    <path
                        d="M 10 2 L 2 6 L 10 10 L 8 6 Z"
                        fill="#64748b"
                        strokeLinejoin="round"
                    />
                </marker>
            </defs>

            {/* Clickable invisible path for interaction */}
            <path
                d={edgePath}
                fill="none"
                strokeWidth={20}
                stroke="transparent"
                className="react-flow__edge-interaction"
                style={{ cursor: 'pointer', pointerEvents: 'stroke' }}
                onClick={onEdgeClick}
            />

            {renderEdge()}

            <EdgeLabelRenderer>
                {/* Source Label */}
                {sourceLabel && (
                    <div
                        style={{
                            position: 'absolute',
                            transform: `translate(-50%, -50%) translate(${sourceLabelX}px,${sourceLabelY}px)`,
                            fontSize: 10,
                            pointerEvents: 'none',
                        }}
                        className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200 whitespace-nowrap"
                    >
                        {sourceLabel}
                    </div>
                )}

                {/* Center Label */}
                <div
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        fontSize: 12,
                        pointerEvents: 'all',
                    }}
                    className="nodrag nopan"
                >
                    <div className={`group relative flex items-center justify-center ${showEditPanel ? 'z-50' : 'z-10'}`}>
                        {/* Delete Button */}
                        {selected && !showEditPanel && (
                            <button
                                onClick={onDelete}
                                className="absolute -top-4 -right-4 bg-red-500 text-white rounded-full p-0.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                title="Delete Connection"
                            >
                                <X size={10} />
                            </button>
                        )}

                        {/* Label Button */}
                        <button
                            onClick={onEdgeClick}
                            className={`
                                px-2 py-1 rounded-md text-xs font-medium border shadow-sm transition-all
                                ${label
                                    ? 'bg-white border-slate-200 text-slate-600 hover:border-primary hover:text-primary'
                                    : 'bg-slate-100 border-transparent text-slate-400 hover:bg-white hover:border-slate-300'
                                }
                            `}
                        >
                            {label || (language === 'zh' ? '點擊編輯' : 'Click to Edit')}
                        </button>
                    </div>
                </div>

                {/* Target Label */}
                {targetLabel && (
                    <div
                        style={{
                            position: 'absolute',
                            transform: `translate(-50%, -50%) translate(${targetLabelX}px,${targetLabelY}px)`,
                            fontSize: 10,
                            pointerEvents: 'none',
                        }}
                        className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200 whitespace-nowrap"
                    >
                        {targetLabel}
                    </div>
                )}

                {/* Edit Panel */}
                {showEditPanel && (
                    <div
                        ref={panelRef}
                        style={{
                            position: 'absolute',
                            transform: `translate(-50%, 10px) translate(${labelX}px,${labelY}px)`,
                            zIndex: 100,
                        }}
                        className="nodrag nopan bg-white rounded-lg shadow-xl border border-slate-200 w-64 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                            <span className="text-sm font-semibold text-slate-700">
                                {language === 'zh' ? '連線設定' : 'Edge Settings'}
                            </span>
                            <button
                                onClick={() => setShowEditPanel(false)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                <X size={14} />
                            </button>
                        </div>

                        <div className="p-3 space-y-3">
                            {/* Arrow Type */}
                            <div>
                                <label className="text-xs font-medium text-slate-600 mb-1 block">
                                    {language === 'zh' ? '箭頭類型' : 'Arrow Type'}
                                </label>
                                <div className="grid grid-cols-4 gap-1">
                                    {[
                                        { type: 'none' as ArrowType, icon: <Minus size={14} />, label: language === 'zh' ? '無' : 'None' },
                                        { type: 'forward' as ArrowType, icon: <ArrowRight size={14} />, label: '→' },
                                        { type: 'backward' as ArrowType, icon: <ArrowRight size={14} className="rotate-180" />, label: '←' },
                                        { type: 'bidirectional' as ArrowType, icon: <ArrowLeftRight size={14} />, label: '↔' },
                                    ].map((option) => (
                                        <button
                                            key={option.type}
                                            onClick={() => setSelectedArrowType(option.type)}
                                            className={`p-2 rounded border text-xs flex flex-col items-center gap-1 transition-all ${selectedArrowType === option.type
                                                ? 'bg-blue-50 border-blue-300 text-blue-700'
                                                : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                                                }`}
                                        >
                                            {option.icon}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Center Label */}
                            <div>
                                <label className="text-xs font-medium text-slate-600 mb-1 block">
                                    {language === 'zh' ? '中間標籤' : 'Center Label'}
                                </label>
                                <input
                                    type="text"
                                    value={label}
                                    onChange={(e) => setLabel(e.target.value)}
                                    placeholder={language === 'zh' ? '輸入標籤...' : 'Enter label...'}
                                    className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
                                />
                            </div>

                            {/* Source Label */}
                            <div>
                                <label className="text-xs font-medium text-slate-600 mb-1 block">
                                    {language === 'zh' ? '來源端標籤' : 'Source Label'}
                                </label>
                                <input
                                    type="text"
                                    value={sourceLabel}
                                    onChange={(e) => setSourceLabel(e.target.value)}
                                    placeholder={language === 'zh' ? '來源說明...' : 'Source description...'}
                                    className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
                                />
                            </div>

                            {/* Target Label */}
                            <div>
                                <label className="text-xs font-medium text-slate-600 mb-1 block">
                                    {language === 'zh' ? '目標端標籤' : 'Target Label'}
                                </label>
                                <input
                                    type="text"
                                    value={targetLabel}
                                    onChange={(e) => setTargetLabel(e.target.value)}
                                    placeholder={language === 'zh' ? '目標說明...' : 'Target description...'}
                                    className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
                                />
                            </div>

                            {/* Line Style */}
                            <div>
                                <label className="text-xs font-medium text-slate-600 mb-1 block">
                                    {language === 'zh' ? '線條樣式' : 'Line Style'}
                                </label>
                                <div className="grid grid-cols-3 gap-1">
                                    {[
                                        { style: 'solid' as LineStyle, label: language === 'zh' ? '實線' : 'Solid', svg: 'M0,5 L40,5' },
                                        { style: 'dashed' as LineStyle, label: language === 'zh' ? '虛線' : 'Dashed', svg: 'M0,5 L40,5', dasharray: '8,4' },
                                        { style: 'dotted' as LineStyle, label: language === 'zh' ? '點線' : 'Dotted', svg: 'M0,5 L40,5', dasharray: '2,4' },
                                    ].map((option) => (
                                        <button
                                            key={option.style}
                                            onClick={() => setSelectedLineStyle(option.style)}
                                            className={`p-2 rounded border text-xs flex flex-col items-center gap-1 transition-all ${selectedLineStyle === option.style
                                                ? 'bg-blue-50 border-blue-300 text-blue-700'
                                                : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                                                }`}
                                        >
                                            <svg width="40" height="10">
                                                <path
                                                    d={option.svg}
                                                    stroke="#64748b"
                                                    strokeWidth="2"
                                                    fill="none"
                                                    strokeDasharray={option.dasharray}
                                                />
                                            </svg>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-3 py-2 bg-slate-50 border-t border-slate-200 flex justify-between">
                            <button
                                onClick={onDelete}
                                className="px-2 py-1 text-xs text-red-600 hover:text-red-700 font-medium"
                            >
                                {language === 'zh' ? '刪除連線' : 'Delete'}
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
                            >
                                {language === 'zh' ? '儲存' : 'Save'}
                            </button>
                        </div>
                    </div>
                )}
            </EdgeLabelRenderer>
        </>
    );
}

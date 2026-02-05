import {
    BaseEdge,
    EdgeLabelRenderer,
    getBezierPath,
    useReactFlow,
} from '@xyflow/react';
import type { EdgeProps } from '@xyflow/react';
import { useState, useRef, useCallback } from 'react';
import { X } from 'lucide-react';

export default function CustomEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    data,
    selected,
}: EdgeProps) {
    const { setEdges } = useReactFlow();
    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    const [isEditing, setIsEditing] = useState(false);
    const [label, setLabel] = useState((data?.label as string) || '');
    const inputRef = useRef<HTMLInputElement>(null);

    const onLabelClick = (evt: React.MouseEvent) => {
        evt.stopPropagation();
        setIsEditing(true);
        setTimeout(() => {
            inputRef.current?.focus();
        }, 100);
    };

    const onDelete = (evt: React.MouseEvent) => {
        evt.stopPropagation();
        setEdges((edges) => edges.filter((e) => e.id !== id));
    };

    const onLabelChange = useCallback(
        (evt: React.ChangeEvent<HTMLInputElement>) => {
            setLabel(evt.target.value);
        },
        []
    );

    const onLabelBlur = useCallback(() => {
        setIsEditing(false);
        setEdges((edges) =>
            edges.map((e) => {
                if (e.id === id) {
                    return {
                        ...e,
                        data: { ...e.data, label },
                    };
                }
                return e;
            })
        );
    }, [id, label, setEdges]);

    const onKeyDown = (evt: React.KeyboardEvent) => {
        if (evt.key === 'Enter') {
            onLabelBlur();
        }
    };

    return (
        <>
            <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
            <EdgeLabelRenderer>
                <div
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        fontSize: 12,
                        pointerEvents: 'all',
                    }}
                    className="nodrag nopan"
                >
                    <div className={`
                group relative flex items-center justify-center
                ${isEditing ? 'z-50' : 'z-10'}
            `}>
                        {/* Delete Button (visible on hover) */}
                        {selected && (
                            <button
                                onClick={onDelete}
                                className="absolute -top-4 -right-4 bg-red-500 text-white rounded-full p-0.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                title="Delete Connection"
                            >
                                <X size={10} />
                            </button>
                        )}

                        {isEditing ? (
                            <input
                                ref={inputRef}
                                type="text"
                                value={label}
                                onChange={onLabelChange}
                                onBlur={onLabelBlur}
                                onKeyDown={onKeyDown}
                                className="px-2 py-1 rounded bg-white border border-primary shadow-sm text-xs outline-none min-w-[60px] text-center"
                                placeholder="Action..."
                            />
                        ) : (
                            <button
                                onClick={onLabelClick}
                                className={`
                            px-2 py-1 rounded-md text-xs font-medium border shadow-sm transition-all
                            ${label
                                        ? 'bg-white border-slate-200 text-slate-600 hover:border-primary hover:text-primary'
                                        : 'bg-slate-100 border-transparent text-slate-400 hover:bg-white hover:border-slate-300'
                                    }
                        `}
                            >
                                {label || 'Add Label'}
                            </button>
                        )}
                    </div>
                </div>
            </EdgeLabelRenderer>
        </>
    );
}

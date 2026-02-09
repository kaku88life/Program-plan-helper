import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import {
    ReactFlow,
    Controls,
    Background,
    useReactFlow,
    useNodesState,
    useEdgesState,
    addEdge,
    MarkerType,
} from '@xyflow/react';
import type { Node, Edge, Connection, NodeTypes, EdgeTypes } from '@xyflow/react';
import CustomNode from '../components/nodes/CustomNode';
import DirectionalEdge from '../components/edges/DirectionalEdge';
import Sidebar from '../components/sidebar/Sidebar';
import ProjectWizard from '../components/wizard/ProjectWizard';
import { CodingEncyclopedia } from '../components/knowledge/CodingEncyclopedia';
import type { ProjectTemplate } from '../data/templates';
import { useLanguage } from '../context/LanguageContext';
import { Languages, GraduationCap, Layers, Download, ArrowLeft, Loader2, Cloud, Check } from 'lucide-react';
import { LayerControl } from '../components/ui/LayerControl';
import { exportToPng } from '../utils/exportUtils';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useOnboarding } from '../hooks/useOnboarding';
import { PropertiesPanel } from '../components/panels/PropertiesPanel';
import { useProjectStore } from '../hooks/useProjectStore';
import { useProjectAutoSave } from '../hooks/useProjectAutoSave';
import { useParams, useNavigate } from 'react-router-dom';

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

let id = 0;
const getId = () => `dndnode_${id++}`;

export function Editor() {
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();
    const reactFlowWrapper = useRef<HTMLDivElement>(null);

    // Project Data Loading
    const { project, loading, error, updateProjectName } = useProjectStore(projectId);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    // Load initial data when project is ready
    useEffect(() => {
        if (project) {
            setNodes(project.nodes || []);
            setEdges(project.edges || []);
        }
    }, [project, setNodes, setEdges]);

    const { screenToFlowPosition, fitView } = useReactFlow();
    const [showWizard, setShowWizard] = useState(false); // Default false, open if new project
    const [showEncyclopedia, setShowEncyclopedia] = useState(false);
    const [showLayerControl, setShowLayerControl] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [showPropertiesPanel, setShowPropertiesPanel] = useState(false);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const { language, setLanguage } = useLanguage();

    // Show wizard if new empty project
    useEffect(() => {
        if (!loading && project && project.nodes.length === 0) {
            setShowWizard(true);
        }
    }, [loading, project]);

    // Auto-save logic
    const { forceSave, isSaving, lastSaveTime } = useProjectAutoSave(projectId!, nodes, edges, project?.name);

    // Keyboard shortcuts
    useKeyboardShortcuts({
        nodes,
        edges,
        setNodes,
        setEdges,
        selectedNodeId,
        onSave: async () => { }, // Auto-save handles this now
        onExport: async () => {
            setIsExporting(true);
            try {
                await exportToPng('.react-flow', 'program-plan');
            } finally {
                setIsExporting(false);
            }
        }
    });

    useOnboarding();

    const nodeCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        nodes.forEach(node => {
            const key = (node.data.toolboxId as string) || (node.data.uiType as string) || (node.data.label as string);
            if (key) {
                counts[key] = (counts[key] || 0) + 1;
            }
        });
        return counts;
    }, [nodes]);

    const nodeTypes = useMemo<NodeTypes>(() => ({
        custom: CustomNode,
    }), []);

    const edgeTypes = useMemo<EdgeTypes>(() => ({
        directional: DirectionalEdge,
    }), []);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge({
            ...params,
            type: 'directional',
            markerEnd: { type: MarkerType.ArrowClosed, color: '#64748b' },
            data: { arrowType: 'forward' },
        }, eds)),
        [setEdges],
    );

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();
            const type = event.dataTransfer.getData('application/reactflow');
            const label = event.dataTransfer.getData('application/label');
            const uiType = event.dataTransfer.getData('application/uiType');
            const toolboxId = event.dataTransfer.getData('application/toolboxId');

            if (typeof type === 'undefined' || !type) return;

            const position = screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const zIndex = (uiType === 'Container') ? -10 : 0;

            const newNode: Node = {
                id: getId(),
                type,
                position,
                zIndex,
                data: {
                    label: `${label}`,
                    type: 'Tech',
                    uiType: uiType || undefined,
                    toolboxId: toolboxId || undefined
                },
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [screenToFlowPosition, setNodes],
    );

    const handleSelectTemplate = useCallback((template: ProjectTemplate) => {
        setNodes(template.nodes);
        setEdges(template.edges);
        setShowWizard(false);
        setTimeout(() => {
            fitView({ duration: 800 });
        }, 100);
    }, [setNodes, setEdges, fitView]);

    const selectedNode = useMemo(() => {
        return nodes.find(n => n.id === selectedNodeId) || null;
    }, [nodes, selectedNodeId]);

    const handleNodesChange = useCallback((changes: Parameters<typeof onNodesChange>[0]) => {
        onNodesChange(changes);
        for (const change of changes) {
            if (change.type === 'select') {
                if (change.selected) {
                    setSelectedNodeId(change.id);
                    setShowPropertiesPanel(true);
                }
            }
        }
    }, [onNodesChange]);

    const handleUpdateNode = useCallback((nodeId: string, data: Partial<Node['data']>) => {
        setNodes((nds) => {
            return nds.map((node) =>
                node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
            );
        });
    }, [setNodes]);

    const handleDeleteNode = useCallback((nodeId: string) => {
        setNodes((nds) => nds.filter((node) => node.id !== nodeId));
        setSelectedNodeId(null);
    }, [setNodes]);

    if (loading) {
        return (
            <div className="flex items-center justify-center w-screen h-screen bg-slate-50">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                <span className="ml-2 text-slate-600">Loading project...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center w-screen h-screen bg-slate-50">
                <div className="text-red-500 mb-4">{error}</div>
                <button
                    onClick={() => navigate('/')}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Return to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="flex w-screen h-screen overflow-hidden bg-slate-50">
            <Sidebar nodeCounts={nodeCounts} />
            <div className="flex-1 h-full relative" ref={reactFlowWrapper}>
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-50" />

                {/* Top Right Controls */}
                <div className="absolute top-4 right-4 z-50 flex items-center gap-2">

                    {/* Back to Dashboard */}
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white shadow-md rounded-full border border-slate-200 text-sm font-medium text-slate-600 hover:text-slate-800 hover:border-slate-300 transition-all hover:bg-slate-50"
                    >
                        <ArrowLeft size={16} />
                        {language === 'zh' ? '返回列表' : 'Back'}
                    </button>

                    {/* Export Button */}
                    <button
                        onClick={async () => {
                            setIsExporting(true);
                            try {
                                await exportToPng('.react-flow', 'program-plan');
                            } catch (error) {
                                console.error('Export failed:', error);
                            } finally {
                                setIsExporting(false);
                            }
                        }}
                        disabled={isExporting}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white shadow-md rounded-full border border-slate-200 text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:border-emerald-300 transition-all hover:bg-emerald-50 disabled:opacity-50"
                    >
                        <Download size={16} />
                        {isExporting ? (language === 'zh' ? '匯出中...' : 'Exporting...') : (language === 'zh' ? '匯出圖片' : 'PNG')}
                    </button>

                    {/* Encyclopedia Button */}
                    <button
                        onClick={() => setShowEncyclopedia(true)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white shadow-md rounded-full border border-slate-200 text-sm font-medium text-amber-600 hover:text-amber-700 hover:border-amber-300 transition-all hover:bg-amber-50"
                    >
                        <GraduationCap size={16} />
                        Coding 101
                    </button>

                    {/* Layer Control Button */}
                    <button
                        onClick={() => setShowLayerControl(!showLayerControl)}
                        className={`flex items-center gap-2 px-3 py-1.5 shadow-md rounded-full border transition-all ${showLayerControl
                            ? 'bg-primary text-white border-primary'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-primary hover:text-primary hover:bg-blue-50'
                            }`}
                    >
                        <Layers size={16} />
                        <span className="text-sm font-medium">{language === 'zh' ? '圖層' : 'Layers'}</span>
                    </button>

                    {/* Language Switcher */}
                    <button
                        onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
                        className="flex items-center gap-2 px-4 py-1.5 bg-white shadow-md rounded-full border border-slate-200 text-sm font-medium text-slate-600 hover:text-primary hover:border-primary transition-all hover:bg-blue-50"
                    >
                        <Languages size={16} />
                        {language === 'en' ? '中文' : 'English'}
                    </button>
                </div>

                {/* Project Name Input (Top Left) */}
                <div className="absolute top-4 left-4 z-50 flex items-center gap-3">
                    <input
                        value={project?.name || ''}
                        onChange={(e) => updateProjectName(e.target.value)}
                        className="bg-transparent text-lg font-semibold text-slate-700 border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none px-1 transition-colors min-w-[200px]"
                        placeholder="Project Name"
                    />

                    {/* Status Indicator & Manual Save */}
                    <div className="flex items-center gap-2">
                        {isSaving ? (
                            <div className="flex items-center gap-1.5 px-2 py-1 bg-white/80 backdrop-blur rounded-full text-xs text-slate-500 border border-slate-200 shadow-sm">
                                <Loader2 size={12} className="animate-spin text-blue-500" />
                                {language === 'zh' ? '儲存中...' : 'Saving...'}
                            </div>
                        ) : (
                            <button
                                onClick={forceSave}
                                className="flex items-center gap-1.5 px-2 py-1 bg-white/80 backdrop-blur rounded-full text-xs text-slate-500 border border-slate-200 shadow-sm hover:bg-slate-50 hover:text-blue-600 transition-colors group"
                                title={language === 'zh' ? '點擊手動儲存' : 'Click to save manually'}
                            >
                                <Cloud size={12} className="group-hover:text-blue-500" />
                                <span>{language === 'zh' ? '已儲存' : 'Saved'}</span>
                                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-slate-400">
                                    {new Date(lastSaveTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </button>
                        )}
                    </div>
                </div>

                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={handleNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                    defaultEdgeOptions={{ type: 'directional' }}
                    onDragOver={onDragOver}
                    onDrop={onDrop}
                    deleteKeyCode={['Delete', 'Backspace']}
                    snapToGrid={true}
                    snapGrid={[16, 16]}
                    fitView
                    className="bg-transparent"
                >
                    <Background color="#94a3b8" gap={16} size={1} variant={undefined} style={{ opacity: 0.2 }} />
                    <Controls className="bg-white p-1 rounded-lg shadow border border-slate-200 text-slate-500" />
                </ReactFlow>
            </div>

            {showLayerControl && (
                <LayerControl
                    nodes={nodes}
                    onClose={() => setShowLayerControl(false)}
                />
            )}

            {showWizard && (
                <ProjectWizard
                    onSelectTemplate={handleSelectTemplate}
                    onClose={() => setShowWizard(false)}
                />
            )}

            {showPropertiesPanel && (
                <PropertiesPanel
                    selectedNode={selectedNode}
                    onUpdateNode={handleUpdateNode}
                    onDeleteNode={handleDeleteNode}
                    onClose={() => {
                        setShowPropertiesPanel(false);
                        setSelectedNodeId(null);
                    }}
                />
            )}

            <CodingEncyclopedia
                isOpen={showEncyclopedia}
                onClose={() => setShowEncyclopedia(false)}
            />
        </div>
    );
}

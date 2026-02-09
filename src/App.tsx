import { useState, useCallback, useRef, useMemo } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  ReactFlowProvider,
  useReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
} from '@xyflow/react';
import type { Node, Edge, Connection, NodeTypes, EdgeTypes } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CustomNode from './components/nodes/CustomNode';
import DirectionalEdge from './components/edges/DirectionalEdge';
import Sidebar from './components/sidebar/Sidebar';
import ProjectWizard from './components/wizard/ProjectWizard';
import { CodingEncyclopedia } from './components/knowledge/CodingEncyclopedia'; // Import Encyclopedia
import type { ProjectTemplate } from './data/templates';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Languages, GraduationCap, Layers, Download, Save, Upload } from 'lucide-react';
import { LayerControl } from './components/ui/LayerControl';
import { exportToPng } from './utils/exportUtils';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useOnboarding } from './hooks/useOnboarding';
import { PropertiesPanel } from './components/panels/PropertiesPanel';

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

let id = 0;
const getId = () => `dndnode_${id++}`;

function FlowContent() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { screenToFlowPosition, fitView } = useReactFlow();
  const [showWizard, setShowWizard] = useState(true);
  const [showEncyclopedia, setShowEncyclopedia] = useState(false); // State for Encyclopaedia
  const [showLayerControl, setShowLayerControl] = useState(false); // State for Layer Control
  const [isExporting, setIsExporting] = useState(false); // Export loading state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPropertiesPanel, setShowPropertiesPanel] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const { language, setLanguage } = useLanguage();

  // Local storage auto-save
  const { exportToFile, importFromFile } = useLocalStorage(nodes, edges, setNodes, setEdges);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    nodes,
    edges,
    setNodes,
    setEdges,
    selectedNodeId,
    onSave: exportToFile,
    onExport: async () => {
      setIsExporting(true);
      try {
        await exportToPng('.react-flow', 'program-plan');
      } finally {
        setIsExporting(false);
      }
    }
  });

  // Onboarding for first-time users
  useOnboarding();

  // Calculate node counts for Toolbox
  const nodeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    nodes.forEach(node => {
      // Count by toolboxId (specific item) first, then uiType, then label
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

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      // Default Container to bottom layer
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

    // Fit view after a slight delay to ensure nodes are rendered
    setTimeout(() => {
      fitView({ duration: 800 });
    }, 100);
  }, [setNodes, setEdges, fitView]);

  // Get selected node
  const selectedNode = useMemo(() => {
    return nodes.find(n => n.id === selectedNodeId) || null;
  }, [nodes, selectedNodeId]);

  // Handle node selection change
  const handleNodesChange = useCallback((changes: Parameters<typeof onNodesChange>[0]) => {
    onNodesChange(changes);
    // Track selection
    for (const change of changes) {
      if (change.type === 'select') {
        if (change.selected) {
          setSelectedNodeId(change.id);
          setShowPropertiesPanel(true);
        }
      }
    }
  }, [onNodesChange]);

  // Update node data
  const handleUpdateNode = useCallback((nodeId: string, data: Partial<Node['data']>) => {
    console.log('[App] handleUpdateNode called:', nodeId, data);
    setNodes((nds) => {
      const updated = nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
      );
      console.log('[App] Node after update:', updated.find(n => n.id === nodeId)?.data);
      return updated;
    });
  }, [setNodes]);

  // Delete node
  const handleDeleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setSelectedNodeId(null);
  }, [setNodes]);

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-slate-50">
      <Sidebar nodeCounts={nodeCounts} />
      <div className="flex-1 h-full relative" ref={reactFlowWrapper}>
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-50" />

        {/* Top Right Controls */}
        <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
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

          {/* Save JSON Button */}
          <button
            onClick={exportToFile}
            className="flex items-center gap-2 px-3 py-1.5 bg-white shadow-md rounded-full border border-slate-200 text-sm font-medium text-blue-600 hover:text-blue-700 hover:border-blue-300 transition-all hover:bg-blue-50"
          >
            <Save size={16} />
            {language === 'zh' ? '儲存' : 'Save'}
          </button>

          {/* Load JSON Button */}
          <input
            type="file"
            ref={fileInputRef}
            accept=".json"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) {
                try {
                  await importFromFile(file);
                } catch (error) {
                  console.error('Import failed:', error);
                  alert(language === 'zh' ? '匯入失敗，請檢查檔案格式' : 'Import failed, please check file format');
                }
              }
              e.target.value = ''; // Reset input
            }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-3 py-1.5 bg-white shadow-md rounded-full border border-slate-200 text-sm font-medium text-purple-600 hover:text-purple-700 hover:border-purple-300 transition-all hover:bg-purple-50"
          >
            <Upload size={16} />
            {language === 'zh' ? '載入' : 'Load'}
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

      {/* Layer Control Panel */}
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

      {/* Properties Panel */}
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

      {/* Encyclopedia Modal */}
      <CodingEncyclopedia
        isOpen={showEncyclopedia}
        onClose={() => setShowEncyclopedia(false)}
      />
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <ReactFlowProvider>
        <FlowContent />
      </ReactFlowProvider>
    </LanguageProvider>
  );
}

export default App;

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
} from '@xyflow/react';
import type { Node, Edge, Connection, NodeTypes } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CustomNode from './components/nodes/CustomNode';
import CustomEdge from './components/edges/CustomEdge'; // Import CustomEdge
import Sidebar from './components/sidebar/Sidebar';
import ProjectWizard from './components/wizard/ProjectWizard';
import { CodingEncyclopedia } from './components/knowledge/CodingEncyclopedia'; // Import Encyclopedia
import type { ProjectTemplate } from './data/templates';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Languages, GraduationCap } from 'lucide-react';

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
  const { language, setLanguage } = useLanguage();

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

  const edgeTypes = useMemo(() => ({
    custom: CustomEdge,
  }), []);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, type: 'custom' }, eds)),
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

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-slate-50">
      <Sidebar nodeCounts={nodeCounts} />
      <div className="flex-1 h-full relative" ref={reactFlowWrapper}>
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-50" />

        {/* Top Right Controls */}
        <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
          {/* Encyclopedia Button */}
          <button
            onClick={() => setShowEncyclopedia(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-white shadow-md rounded-full border border-slate-200 text-sm font-medium text-amber-600 hover:text-amber-700 hover:border-amber-300 transition-all hover:bg-amber-50"
          >
            <GraduationCap size={16} />
            Coding 101
          </button>

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
            className="flex items-center gap-2 px-3 py-1.5 bg-white shadow-md rounded-full border border-slate-200 text-sm font-medium text-slate-600 hover:text-primary hover:border-primary transition-all"
          >
            <Languages size={16} />
            {language === 'en' ? '中文' : 'English'}
          </button>
        </div>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onDragOver={onDragOver}
          onDrop={onDrop}
          deleteKeyCode={['Delete', 'Backspace']}
          fitView
          className="bg-transparent"
        >
          <Background color="#94a3b8" gap={16} size={1} variant={undefined} style={{ opacity: 0.2 }} />
          <Controls className="bg-white p-1 rounded-lg shadow border border-slate-200 text-slate-500" />
        </ReactFlow>
      </div>

      {showWizard && (
        <ProjectWizard
          onSelectTemplate={handleSelectTemplate}
          onClose={() => setShowWizard(false)}
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

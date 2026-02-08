import React, { useEffect, useCallback, useRef } from 'react';
import type { Node, Edge } from '@xyflow/react';

interface HistoryState {
    nodes: Node[];
    edges: Edge[];
}

interface UseKeyboardShortcutsOptions {
    nodes: Node[];
    edges: Edge[];
    setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
    setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
    selectedNodeId: string | null;
    onSave?: () => void;
    onExport?: () => void;
}

/**
 * Hook for handling keyboard shortcuts with undo/redo functionality
 */
export const useKeyboardShortcuts = ({
    nodes,
    edges,
    setNodes,
    setEdges,
    selectedNodeId,
    onSave,
    onExport
}: UseKeyboardShortcutsOptions) => {
    // History for undo/redo
    const historyRef = useRef<HistoryState[]>([]);
    const historyIndexRef = useRef(-1);
    const maxHistoryLength = 50;

    // Clipboard for copy/paste
    const clipboardRef = useRef<Node[]>([]);

    // Add state to history
    const pushToHistory = useCallback(() => {
        const newState: HistoryState = {
            nodes: JSON.parse(JSON.stringify(nodes)),
            edges: JSON.parse(JSON.stringify(edges))
        };

        // Remove any "future" states if we're not at the end
        if (historyIndexRef.current < historyRef.current.length - 1) {
            historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
        }

        historyRef.current.push(newState);

        // Keep history size manageable
        if (historyRef.current.length > maxHistoryLength) {
            historyRef.current.shift();
        } else {
            historyIndexRef.current++;
        }
    }, [nodes, edges]);

    // Initialize history with current state
    useEffect(() => {
        if (historyRef.current.length === 0 && (nodes.length > 0 || edges.length > 0)) {
            pushToHistory();
        }
    }, [nodes, edges, pushToHistory]);

    // Undo
    const undo = useCallback(() => {
        if (historyIndexRef.current > 0) {
            historyIndexRef.current--;
            const state = historyRef.current[historyIndexRef.current];
            setNodes(state.nodes);
            setEdges(state.edges);
            console.log('Undo');
        }
    }, [setNodes, setEdges]);

    // Redo
    const redo = useCallback(() => {
        if (historyIndexRef.current < historyRef.current.length - 1) {
            historyIndexRef.current++;
            const state = historyRef.current[historyIndexRef.current];
            setNodes(state.nodes);
            setEdges(state.edges);
            console.log('Redo');
        }
    }, [setNodes, setEdges]);

    // Copy selected node(s)
    const copy = useCallback(() => {
        if (selectedNodeId) {
            const selectedNodes = nodes.filter(n => n.id === selectedNodeId || n.selected);
            if (selectedNodes.length > 0) {
                clipboardRef.current = JSON.parse(JSON.stringify(selectedNodes));
                console.log('Copied', selectedNodes.length, 'node(s)');
            }
        }
    }, [nodes, selectedNodeId]);

    // Paste from clipboard
    const paste = useCallback(() => {
        if (clipboardRef.current.length > 0) {
            const offset = 50;
            const newNodes = clipboardRef.current.map((node, index) => ({
                ...node,
                id: `${node.id}_copy_${Date.now()}_${index}`,
                position: {
                    x: node.position.x + offset,
                    y: node.position.y + offset
                },
                selected: true
            }));

            setNodes((nds) => [
                ...nds.map(n => ({ ...n, selected: false })),
                ...newNodes
            ]);
            pushToHistory();
            console.log('Pasted', newNodes.length, 'node(s)');
        }
    }, [setNodes, pushToHistory]);

    // Keyboard event handler
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Skip if typing in an input
            const target = event.target as HTMLElement;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
                return;
            }

            const isCtrl = event.ctrlKey || event.metaKey;

            // Ctrl+Z: Undo
            if (isCtrl && event.key === 'z' && !event.shiftKey) {
                event.preventDefault();
                undo();
            }

            // Ctrl+Y or Ctrl+Shift+Z: Redo
            if (isCtrl && (event.key === 'y' || (event.key === 'z' && event.shiftKey))) {
                event.preventDefault();
                redo();
            }

            // Ctrl+C: Copy
            if (isCtrl && event.key === 'c') {
                event.preventDefault();
                copy();
            }

            // Ctrl+V: Paste
            if (isCtrl && event.key === 'v') {
                event.preventDefault();
                paste();
            }

            // Ctrl+S: Save
            if (isCtrl && event.key === 's') {
                event.preventDefault();
                onSave?.();
                console.log('Save shortcut triggered');
            }

            // Ctrl+E: Export
            if (isCtrl && event.key === 'e') {
                event.preventDefault();
                onExport?.();
                console.log('Export shortcut triggered');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [undo, redo, copy, paste, onSave, onExport]);

    return {
        undo,
        redo,
        copy,
        paste,
        pushToHistory,
        canUndo: historyIndexRef.current > 0,
        canRedo: historyIndexRef.current < historyRef.current.length - 1
    };
};

import { useEffect, useCallback, useRef } from 'react';
import type { Node, Edge } from '@xyflow/react';

const STORAGE_KEY = 'program-plan-helper-data';
const AUTO_SAVE_INTERVAL = 30000; // 30 seconds

interface StoredData {
    version: string;
    lastSaved: string;
    nodes: Node[];
    edges: Edge[];
}

/**
 * Hook for auto-saving and loading diagram data from localStorage
 */
export const useLocalStorage = (
    nodes: Node[],
    edges: Edge[],
    setNodes: (nodes: Node[]) => void,
    setEdges: (edges: Edge[]) => void
) => {
    const lastSavedRef = useRef<string>('');
    const hasLoadedRef = useRef(false);

    // Load data from localStorage on initial mount
    useEffect(() => {
        if (hasLoadedRef.current) return;
        hasLoadedRef.current = true;

        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const data: StoredData = JSON.parse(stored);
                if (data.nodes && data.nodes.length > 0) {
                    setNodes(data.nodes);
                    setEdges(data.edges || []);
                    console.log('Loaded saved diagram from localStorage');
                }
            }
        } catch (error) {
            console.error('Failed to load from localStorage:', error);
        }
    }, [setNodes, setEdges]);

    // Save to localStorage
    const saveToStorage = useCallback(() => {
        try {
            const data: StoredData = {
                version: '1.0',
                lastSaved: new Date().toISOString(),
                nodes,
                edges
            };
            const serialized = JSON.stringify(data);

            // Only save if data actually changed
            if (serialized !== lastSavedRef.current) {
                localStorage.setItem(STORAGE_KEY, serialized);
                lastSavedRef.current = serialized;
                console.log('Auto-saved diagram to localStorage');
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to save to localStorage:', error);
            return false;
        }
    }, [nodes, edges]);

    // Auto-save periodically
    useEffect(() => {
        const interval = setInterval(() => {
            if (nodes.length > 0) {
                saveToStorage();
            }
        }, AUTO_SAVE_INTERVAL);

        return () => clearInterval(interval);
    }, [nodes, edges, saveToStorage]);

    // Save on page unload
    useEffect(() => {
        const handleBeforeUnload = () => {
            if (nodes.length > 0) {
                saveToStorage();
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [nodes, saveToStorage]);

    // Clear saved data
    const clearStorage = useCallback(() => {
        localStorage.removeItem(STORAGE_KEY);
        lastSavedRef.current = '';
        console.log('Cleared saved diagram from localStorage');
    }, []);

    // Export to JSON file
    const exportToFile = useCallback(() => {
        const data: StoredData = {
            version: '1.0',
            lastSaved: new Date().toISOString(),
            nodes,
            edges
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.download = `program-plan-${new Date().toISOString().slice(0, 10)}.json`;
        link.href = url;
        link.click();

        URL.revokeObjectURL(url);
    }, [nodes, edges]);

    // Import from JSON file
    const importFromFile = useCallback((file: File): Promise<void> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (event) => {
                try {
                    const data: StoredData = JSON.parse(event.target?.result as string);
                    if (data.nodes && Array.isArray(data.nodes)) {
                        setNodes(data.nodes);
                        setEdges(data.edges || []);
                        saveToStorage();
                        resolve();
                    } else {
                        reject(new Error('Invalid file format: missing nodes array'));
                    }
                } catch (error) {
                    reject(error);
                }
            };

            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }, [setNodes, setEdges, saveToStorage]);

    return {
        saveToStorage,
        clearStorage,
        exportToFile,
        importFromFile
    };
};

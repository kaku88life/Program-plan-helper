import { useEffect, useRef, useCallback, useState } from 'react';
import type { Node, Edge } from '@xyflow/react';
import { saveProject } from '../db/db';
import type { Project } from '../types/Project';

export function useProjectAutoSave(projectId: string, nodes: Node[], edges: Edge[], projectName: string = 'Untitled Project') {
    const [isSavingState, setIsSavingState] = useState(false);
    const isSavingRef = useRef(false);
    const lastSaveTime = useRef(Date.now());
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

    const save = useCallback(async () => {
        if (isSavingRef.current) return;
        isSavingRef.current = true;
        setIsSavingState(true);

        try {
            const project: Project = {
                id: projectId,
                name: projectName,
                nodes,
                edges,
                createdAt: Date.now(), // This should ideally come from initial load
                updatedAt: Date.now(),
                version: 1,
            };

            await saveProject(project);
            lastSaveTime.current = Date.now();
            console.log(`[AutoSave] Project ${projectId} saved at ${new Date().toLocaleTimeString()}`);
        } catch (error) {
            console.error('[AutoSave] Failed to save project:', error);
        } finally {
            isSavingRef.current = false;
            setIsSavingState(false);
        }
    }, [projectId, projectName, nodes, edges]);

    // Auto-save on change with debounce
    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            save();
        }, 2000); // Save after 2 seconds of inactivity

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [nodes, edges, save]);

    return {
        forceSave: save,
        lastSaveTime: lastSaveTime.current,
        isSaving: isSavingState
    };
}

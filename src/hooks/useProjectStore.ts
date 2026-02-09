import { useState, useCallback, useEffect } from 'react';
import type { Project } from '../types/Project';
import { getProject, saveProject } from '../db/db';


export function useProjectStore(projectId: string | undefined) {
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadProject = useCallback(async () => {
        if (!projectId) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const data = await getProject(projectId);
            if (data) {
                setProject(data);
            } else {
                setError('Project not found');
            }
        } catch (err) {
            console.error('Failed to load project:', err);
            setError('Failed to load project data');
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    const updateProjectName = useCallback(async (newName: string) => {
        if (!project) return;

        const updatedProject = { ...project, name: newName, updatedAt: Date.now() };
        setProject(updatedProject);
        await saveProject(updatedProject);
    }, [project]);

    useEffect(() => {
        loadProject();
    }, [loadProject]);

    return {
        project,
        loading,
        error,
        updateProjectName,
        reload: loadProject
    };
}

import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { Project, ProjectSummary } from '../types/Project';

interface ProgramPlanDB extends DBSchema {
    projects: {
        key: string;
        value: Project;
        indexes: { 'by-updated': number };
    };
}

const DB_NAME = 'program-plan-db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<ProgramPlanDB>>;

export const initDB = () => {
    if (!dbPromise) {
        dbPromise = openDB<ProgramPlanDB>(DB_NAME, DB_VERSION, {
            upgrade(db) {
                // Create store if it doesn't exist
                if (!db.objectStoreNames.contains('projects')) {
                    const store = db.createObjectStore('projects', { keyPath: 'id' });
                    store.createIndex('by-updated', 'updatedAt');
                }
            },
        });
    }
    return dbPromise;
};

// Get all projects (summary only for listing)
export const getAllProjects = async (): Promise<ProjectSummary[]> => {
    const db = await initDB();
    const tx = db.transaction('projects', 'readonly');
    const index = tx.store.index('by-updated');
    // Get all projects sorted by update time (descending)
    const projects = await index.getAll();

    // Return reversed array to show newest first, and map to summary
    return projects.reverse().map(p => ({
        id: p.id,
        name: p.name,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        thumbnail: p.thumbnail
    }));
};

// Get single project full data
export const getProject = async (id: string): Promise<Project | undefined> => {
    const db = await initDB();
    return db.get('projects', id);
};

// Save project (create or update)
export const saveProject = async (project: Project): Promise<string> => {
    const db = await initDB();
    await db.put('projects', project);
    return project.id;
};

// Delete project
export const deleteProject = async (id: string): Promise<void> => {
    const db = await initDB();
    await db.delete('projects', id);
};

// Export database to JSON file (Backup)
export const exportDatabase = async (): Promise<string> => {
    const projects = await getAllProjects();
    const fullData = await Promise.all(projects.map(p => getProject(p.id)));
    return JSON.stringify(fullData);
};

// Import database from JSON file (Restore)
export const importDatabase = async (json: string): Promise<void> => {
    try {
        const projects: Project[] = JSON.parse(json);
        const db = await initDB();
        const tx = db.transaction('projects', 'readwrite');
        await Promise.all(projects.map(p => tx.store.put(p)));
        await tx.done;
    } catch (error) {
        console.error('Failed to import database:', error);
        throw new Error('Invalid backup file');
    }
};

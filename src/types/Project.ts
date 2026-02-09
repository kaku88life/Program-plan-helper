import type { Node, Edge } from '@xyflow/react';

export interface Project {
    id: string;
    name: string;
    createdAt: number;
    updatedAt: number;
    thumbnail?: string; // Base64 encoded image
    nodes: Node[];
    edges: Edge[];
    version: number;
}

export type ProjectSummary = Pick<Project, 'id' | 'name' | 'createdAt' | 'updatedAt' | 'thumbnail'>;

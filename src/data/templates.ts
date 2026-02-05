import type { Node, Edge } from '@xyflow/react';

export interface ProjectTemplate {
    name: string;
    description: string;
    nodes: Node[];
    edges: Edge[];
}

export const TEMPLATES: Record<string, ProjectTemplate> = {
    landing: {
        name: "Landing Page",
        description: "Marketing site with high conversion focus",
        nodes: [
            { id: '1', type: 'custom', position: { x: 250, y: 0 }, data: { label: 'Visitor arrives', type: 'Trigger' } },
            { id: '2', type: 'custom', position: { x: 250, y: 100 }, data: { label: 'Hero Section', type: 'View' } },
            { id: '3', type: 'custom', position: { x: 250, y: 200 }, data: { label: 'Features', type: 'View' } },
            { id: '4', type: 'custom', position: { x: 250, y: 300 }, data: { label: 'Pricing', type: 'View' } },
            { id: '5', type: 'custom', position: { x: 250, y: 400 }, data: { label: 'Contact Form', type: 'View' } },
            { id: '6', type: 'custom', position: { x: 450, y: 400 }, data: { label: 'API: Submit Lead', type: 'Backend' } },
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2', animated: true },
            { id: 'e2-3', source: '2', target: '3' },
            { id: 'e3-4', source: '3', target: '4' },
            { id: 'e4-5', source: '4', target: '5' },
            { id: 'e5-6', source: '5', target: '6', animated: true },
        ]
    },
    crm: {
        name: "CRM System",
        description: "Admin dashboard for customer management",
        nodes: [
            { id: '1', type: 'custom', position: { x: 250, y: 0 }, data: { label: 'Admin Login', type: 'Trigger' } },
            { id: '2', type: 'custom', position: { x: 250, y: 100 }, data: { label: 'Dashboard', type: 'View' } },
            { id: '3', type: 'custom', position: { x: 100, y: 200 }, data: { label: 'Customer List', type: 'View' } },
            { id: '4', type: 'custom', position: { x: 400, y: 200 }, data: { label: 'Settings', type: 'View' } },
            { id: '5', type: 'custom', position: { x: 100, y: 300 }, data: { label: 'DB: Users', type: 'Database' } },
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2', animated: true },
            { id: 'e2-3', source: '2', target: '3' },
            { id: 'e2-4', source: '2', target: '4' },
            { id: 'e3-5', source: '3', target: '5', animated: true },
        ]
    },
    game: {
        name: "Mini Game",
        description: "Web-based game logic loop",
        nodes: [
            { id: '1', type: 'custom', position: { x: 250, y: 0 }, data: { label: 'Game Start', type: 'Trigger' } },
            { id: '2', type: 'custom', position: { x: 250, y: 100 }, data: { label: 'Main Menu', type: 'View' } },
            { id: '3', type: 'custom', position: { x: 250, y: 200 }, data: { label: 'Game Loop', type: 'Logic' } },
            { id: '4', type: 'custom', position: { x: 450, y: 300 }, data: { label: 'Save Score', type: 'Backend' } },
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2' },
            { id: 'e2-3', source: '2', target: '3', animated: true },
            { id: 'e3-4', source: '3', target: '4', animated: true },
        ]
    },
    mindmap: {
        name: "Mind Map",
        description: "Central idea with radiating branches",
        nodes: [
            { id: '1', type: 'custom', position: { x: 250, y: 150 }, data: { label: 'Central Idea', type: 'Core' } },
            { id: '2', type: 'custom', position: { x: 50, y: 50 }, data: { label: 'Branch 1', type: 'Topic' } },
            { id: '3', type: 'custom', position: { x: 450, y: 50 }, data: { label: 'Branch 2', type: 'Topic' } },
            { id: '4', type: 'custom', position: { x: 50, y: 300 }, data: { label: 'Branch 3', type: 'Topic' } },
            { id: '5', type: 'custom', position: { x: 450, y: 300 }, data: { label: 'Branch 4', type: 'Topic' } },
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2' },
            { id: 'e1-3', source: '1', target: '3' },
            { id: 'e1-4', source: '1', target: '4' },
            { id: 'e1-5', source: '1', target: '5' },
        ]
    },
    flowchart: {
        name: "Flowchart",
        description: "Process logic with decision points",
        nodes: [
            { id: '1', type: 'custom', position: { x: 250, y: 0 }, data: { label: 'Start', type: 'Trigger' } },
            { id: '2', type: 'custom', position: { x: 250, y: 100 }, data: { label: 'Process A', type: 'Action' } },
            { id: '3', type: 'custom', position: { x: 250, y: 200 }, data: { label: 'Decision?', type: 'Logic' } },
            { id: '4', type: 'custom', position: { x: 100, y: 300 }, data: { label: 'Option Yes', type: 'Action' } },
            { id: '5', type: 'custom', position: { x: 400, y: 300 }, data: { label: 'Option No', type: 'Action' } },
            { id: '6', type: 'custom', position: { x: 250, y: 400 }, data: { label: 'End', type: 'Trigger' } },
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2', animated: true },
            { id: 'e2-3', source: '2', target: '3', animated: true },
            { id: 'e3-4', source: '3', target: '4', label: 'Yes' },
            { id: 'e3-5', source: '3', target: '5', label: 'No' },
            { id: 'e4-6', source: '4', target: '6', animated: true },
            { id: 'e5-6', source: '5', target: '6', animated: true },
        ]
    },
    sitemap: {
        name: "Sitemap",
        description: "Hierarchical website structure",
        nodes: [
            { id: '1', type: 'custom', position: { x: 300, y: 0 }, data: { label: 'Home Page', type: 'Root' } },
            { id: '2', type: 'custom', position: { x: 100, y: 150 }, data: { label: 'About', type: 'Page' } },
            { id: '3', type: 'custom', position: { x: 300, y: 150 }, data: { label: 'Products', type: 'Page' } },
            { id: '4', type: 'custom', position: { x: 500, y: 150 }, data: { label: 'Contact', type: 'Page' } },
            { id: '5', type: 'custom', position: { x: 200, y: 300 }, data: { label: 'Product A', type: 'Subpage' } },
            { id: '6', type: 'custom', position: { x: 400, y: 300 }, data: { label: 'Product B', type: 'Subpage' } },
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2' },
            { id: 'e1-3', source: '1', target: '3' },
            { id: 'e1-4', source: '1', target: '4' },
            { id: 'e3-5', source: '3', target: '5' },
            { id: 'e3-6', source: '3', target: '6' },
        ]
    }
};

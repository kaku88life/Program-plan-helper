import { toPng, toSvg } from 'html-to-image';

/**
 * Export the React Flow viewport to PNG image
 */
export const exportToPng = async (
    elementSelector: string = '.react-flow',
    filename: string = 'program-plan'
): Promise<void> => {
    const element = document.querySelector(elementSelector) as HTMLElement;
    if (!element) {
        console.error('Export element not found');
        return;
    }

    try {
        // Get the viewport element for better quality
        const viewport = element.querySelector('.react-flow__viewport') as HTMLElement;
        const targetElement = viewport || element;

        const dataUrl = await toPng(targetElement, {
            backgroundColor: '#f8fafc', // slate-50 background
            quality: 1.0,
            pixelRatio: 2, // Higher quality
            filter: (node) => {
                // Exclude UI controls from export
                const excludeClasses = ['react-flow__controls', 'react-flow__minimap', 'react-flow__panel'];
                return !excludeClasses.some(cls =>
                    node.classList?.contains(cls)
                );
            }
        });

        // Create download link
        const link = document.createElement('a');
        link.download = `${filename}-${new Date().toISOString().slice(0, 10)}.png`;
        link.href = dataUrl;
        link.click();
    } catch (error) {
        console.error('Failed to export PNG:', error);
        throw error;
    }
};

/**
 * Export the React Flow viewport to SVG
 */
export const exportToSvg = async (
    elementSelector: string = '.react-flow',
    filename: string = 'program-plan'
): Promise<void> => {
    const element = document.querySelector(elementSelector) as HTMLElement;
    if (!element) {
        console.error('Export element not found');
        return;
    }

    try {
        const viewport = element.querySelector('.react-flow__viewport') as HTMLElement;
        const targetElement = viewport || element;

        const dataUrl = await toSvg(targetElement, {
            backgroundColor: '#f8fafc',
            filter: (node) => {
                const excludeClasses = ['react-flow__controls', 'react-flow__minimap', 'react-flow__panel'];
                return !excludeClasses.some(cls =>
                    node.classList?.contains(cls)
                );
            }
        });

        const link = document.createElement('a');
        link.download = `${filename}-${new Date().toISOString().slice(0, 10)}.svg`;
        link.href = dataUrl;
        link.click();
    } catch (error) {
        console.error('Failed to export SVG:', error);
        throw error;
    }
};

/**
 * Export nodes and edges as JSON for saving/sharing
 */
export const exportToJson = (
    nodes: unknown[],
    edges: unknown[],
    filename: string = 'program-plan'
): void => {
    const data = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        nodes,
        edges
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.download = `${filename}-${new Date().toISOString().slice(0, 10)}.json`;
    link.href = url;
    link.click();

    URL.revokeObjectURL(url);
};

/**
 * Import nodes and edges from JSON file
 */
export const importFromJson = (file: File): Promise<{ nodes: unknown[]; edges: unknown[] }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target?.result as string);
                if (data.nodes && data.edges) {
                    resolve({ nodes: data.nodes, edges: data.edges });
                } else {
                    reject(new Error('Invalid file format'));
                }
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
    });
};

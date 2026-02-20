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

// ============================================================
// ASCII Wireframe Markdown Export
// ============================================================

interface NodeData {
    label?: string;
    description?: string;
    uiType?: string;
    attribute?: string;
    variant?: string;
    color?: string;
    toolboxId?: string;
}

interface FlowNode {
    id: string;
    position: { x: number; y: number };
    data: NodeData;
    measured?: { width?: number; height?: number };
    width?: number;
    height?: number;
}

interface FlowEdge {
    id: string;
    source: string;
    target: string;
    data?: { label?: string; arrowType?: string };
}

// Toolbox ID to ASCII art representation
// Keys match the `toolboxId` values from src/data/toolbox.ts
const toolboxIdToAscii: Record<string, (label: string, width: number) => string[]> = {
    navbar: (_label, w) => {
        const inner = w - 4;
        const items = 'Logo    [Home]  [About]  [Contact]';
        const padded = items.length > inner ? items.slice(0, inner) : items + ' '.repeat(Math.max(0, inner - items.length));
        return [
            '┌' + '─'.repeat(w - 2) + '┐',
            '│ ' + padded + ' │',
            '└' + '─'.repeat(w - 2) + '┘',
        ];
    },
    sidebar: (_label, w) => {
        const inner = w - 4;
        const pad = (s: string) => {
            const t = s.slice(0, inner);
            return t + ' '.repeat(Math.max(0, inner - t.length));
        };
        return [
            '┌' + '─'.repeat(w - 2) + '┐',
            '│ ' + pad('▸ Menu Item 1') + ' │',
            '│ ' + pad('▸ Menu Item 2') + ' │',
            '│ ' + pad('▸ Menu Item 3') + ' │',
            '└' + '─'.repeat(w - 2) + '┘',
        ];
    },
    img: (_label, w) => {
        const inner = w - 4;
        const imgTag = '/IMG\\';
        const padded = Math.floor((inner - imgTag.length) / 2);
        return [
            '┌' + '─'.repeat(w - 2) + '┐',
            '│ ' + ' '.repeat(Math.max(0, padded)) + '\\      /' + ' '.repeat(Math.max(0, inner - padded - 8)) + ' │',
            '│ ' + ' '.repeat(Math.max(0, padded)) + ' /IMG\\ ' + ' '.repeat(Math.max(0, inner - padded - 8)) + ' │',
            '│ ' + ' '.repeat(Math.max(0, padded)) + '/      \\' + ' '.repeat(Math.max(0, inner - padded - 8)) + ' │',
            '└' + '─'.repeat(w - 2) + '┘',
        ];
    },
    btn_pri: (label, _w) => {
        const text = `[ ${label} ]`;
        return [text];
    },
    btn_sec: (label, _w) => {
        const text = `( ${label} )`;
        return [text];
    },
    action: (label, _w) => {
        const text = `< ${label} >`;
        return [text];
    },
    checkbox: (label, _w) => {
        return [`[x] ${label}`];
    },
    radio: (_label, _w) => {
        return [`(●) Option A  ( ) Option B  ( ) Option C`];
    },
    switch: (label, _w) => {
        return [`[■□] ${label}`];
    },
    inp_text: (label, w) => {
        const inner = Math.max(10, w - 4);
        return [
            `${label}:`,
            '┌' + '─'.repeat(inner) + '┐',
            '│' + ' '.repeat(inner) + '│',
            '└' + '─'.repeat(inner) + '┘',
        ];
    },
    inp_search: (_label, w) => {
        const inner = Math.max(10, w - 4);
        return [
            '┌' + '🔍─' + '─'.repeat(inner - 2) + '┐',
            '│' + ' Search...' + ' '.repeat(Math.max(0, inner - 12)) + '│',
            '└' + '─'.repeat(inner) + '┘',
        ];
    },
    select: (label, w) => {
        const inner = Math.max(10, w - 4);
        return [
            `${label}:`,
            '┌' + '─'.repeat(inner - 2) + '▼┐',
            '│' + ' Select...' + ' '.repeat(Math.max(0, inner - 12)) + '│',
            '└' + '─'.repeat(inner) + '┘',
        ];
    },
    table: (_label, w) => {
        const colW = Math.floor((w - 5) / 3);
        const pad = (s: string) => {
            const t = s.slice(0, colW);
            return t + ' '.repeat(Math.max(0, colW - t.length));
        };
        return [
            '┌' + ('─'.repeat(colW) + '┬').repeat(2) + '─'.repeat(colW) + '┐',
            '│' + pad(' Col A') + '│' + pad(' Col B') + '│' + pad(' Col C') + '│',
            '├' + ('─'.repeat(colW) + '┼').repeat(2) + '─'.repeat(colW) + '┤',
            '│' + pad(' data') + '│' + pad(' data') + '│' + pad(' data') + '│',
            '└' + ('─'.repeat(colW) + '┴').repeat(2) + '─'.repeat(colW) + '┘',
        ];
    },
    modal: (label, w) => {
        const inner = w - 4;
        const pad = (s: string) => {
            const t = s.slice(0, inner);
            return t + ' '.repeat(Math.max(0, inner - t.length));
        };
        const title = label || 'Modal';
        return [
            '╔' + '═'.repeat(w - 2) + '╗',
            '║ ' + pad(title + '                    [X]') + ' ║',
            '║ ' + pad('─'.repeat(inner)) + ' ║',
            '║ ' + pad('Modal content here...') + ' ║',
            '║ ' + pad('') + ' ║',
            '║ ' + pad('        [ OK ]  [ Cancel ]') + ' ║',
            '╚' + '═'.repeat(w - 2) + '╝',
        ];
    },
    tabs: (_label, _w) => {
        return [
            `┌──────┐──────┐──────┐`,
            `│ Tab1 │ Tab2 │ Tab3 │`,
            `└──────┴──────┴──────┘`,
        ];
    },
    divider: (_label, w) => {
        return ['─'.repeat(Math.max(w, 20))];
    },
    breadcrumb: (label, _w) => {
        return [`Home > ${label || 'Page'} > Current`];
    },
    list: (label, _w) => {
        return [
            `• ${label || 'Item'} 1`,
            `• ${label || 'Item'} 2`,
            `• ${label || 'Item'} 3`,
        ];
    },
    tag: (label, _w) => {
        return [`〔${label}〕`];
    },
    badge: (label, _w) => {
        return [`(${label})`];
    },
    alert: (label, w) => {
        const inner = Math.max(20, w - 4);
        const pad = (s: string) => {
            const t = s.slice(0, inner);
            return t + ' '.repeat(Math.max(0, inner - t.length));
        };
        return [
            '┌' + '─'.repeat(inner + 2) + '┐',
            '│ ⚠ ' + pad(label || 'Alert message') + '│',
            '└' + '─'.repeat(inner + 2) + '┘',
        ];
    },
    toast: (label, _w) => {
        return [`🔔 ${label || 'Notification'}`];
    },
    avatar: (label, _w) => {
        return [`(👤) ${label}`];
    },
    container: (label, w) => {
        const inner = w - 4;
        const pad = (s: string) => {
            const t = s.slice(0, inner);
            return t + ' '.repeat(Math.max(0, inner - t.length));
        };
        return [
            '┌' + '─'.repeat(w - 2) + '┐',
            '│ ' + pad(label) + ' │',
            '│ ' + pad('') + ' │',
            '│ ' + pad('  [content]') + ' │',
            '│ ' + pad('') + ' │',
            '└' + '─'.repeat(w - 2) + '┘',
        ];
    },
    card: (label, w) => {
        const inner = w - 4;
        const pad = (s: string) => {
            const t = s.slice(0, inner);
            return t + ' '.repeat(Math.max(0, inner - t.length));
        };
        return [
            '╭' + '─'.repeat(w - 2) + '╮',
            '│ ' + pad(label) + ' │',
            '│ ' + pad('─'.repeat(Math.min(inner, 20))) + ' │',
            '│ ' + pad('Card content...') + ' │',
            '╰' + '─'.repeat(w - 2) + '╯',
        ];
    },
};

// Generate ASCII art for a single node
function nodeToAscii(node: FlowNode, width: number): string[] {
    const data = node.data;
    const label = data.label || 'Node';
    const toolboxId = data.toolboxId || '';

    // Check if there's a specific toolbox ID renderer (most specific)
    if (toolboxId && toolboxIdToAscii[toolboxId]) {
        return toolboxIdToAscii[toolboxId](label, width);
    }

    // Default container/card rendering
    const inner = width - 4;
    const pad = (s: string) => {
        const t = s.slice(0, inner);
        return t + ' '.repeat(Math.max(0, inner - t.length));
    };

    const lines: string[] = [];
    lines.push('┌' + '─'.repeat(width - 2) + '┐');
    lines.push('│ ' + pad(label) + ' │');
    if (data.description) {
        lines.push('│ ' + pad('─'.repeat(Math.min(inner, 20))) + ' │');
        // Wrap description text
        const desc = data.description;
        for (let i = 0; i < desc.length; i += inner) {
            lines.push('│ ' + pad(desc.slice(i, i + inner)) + ' │');
        }
    }
    lines.push('└' + '─'.repeat(width - 2) + '┘');
    return lines;
}

// Get attribute display name
function getAttributeName(attr: string): string {
    const map: Record<string, string> = {
        mainPage: '頁面 (Page)',
        subPage: '子頁面 (Sub Page)',
        modal: '彈窗 (Modal)',
        alert: '警告 (Alert)',
        component: '元件 (Component)',
        trigger: '觸發器 (Trigger)',
        logic: '邏輯 (Logic)',
        backend: '後端 (Backend)',
        database: '資料庫 (Database)',
    };
    return map[attr] || attr;
}

// Get UI type display name from toolboxId or uiType
function getUiTypeName(toolboxId: string | undefined, uiType: string | undefined): string {
    const toolboxMap: Record<string, string> = {
        navbar: '導航欄 (Navbar)',
        sidebar: '側邊欄 (Sidebar)',
        table: '表格 (Table)',
        modal: '彈窗 (Modal)',
        tabs: '分頁標籤 (Tabs)',
        img: '圖片 (Image)',
        avatar: '頭像 (Avatar)',
        inp_text: '文字輸入 (Text Input)',
        inp_search: '搜尋框 (Search)',
        select: '下拉選單 (Select)',
        checkbox: '勾選框 (Checkbox)',
        radio: '單選按鈕 (Radio)',
        switch: '開關 (Switch)',
        btn_pri: '主要按鈕 (Primary)',
        btn_sec: '次要按鈕 (Secondary)',
        action: '動作按鈕 (Action)',
        breadcrumb: '麵包屑 (Breadcrumb)',
        divider: '分隔線 (Divider)',
        list: '清單 (List)',
        tag: '標籤 (Tag)',
        badge: '徽章 (Badge)',
        alert: '警告框 (Alert)',
        toast: '通知 (Toast)',
        container: '容器框架 (Container)',
        card: '資訊卡片 (Card)',
    };
    if (toolboxId && toolboxMap[toolboxId]) return toolboxMap[toolboxId];

    const uiTypeMap: Record<string, string> = {
        Container: '容器',
        Button: '按鈕',
        Input: '輸入',
        Image: '圖片',
        Card: '卡片',
    };
    if (uiType && uiTypeMap[uiType]) return uiTypeMap[uiType];

    return toolboxId || uiType || '-';
}

/**
 * Export nodes and edges as ASCII Wireframe Markdown
 * Generates a document with:
 * 1. ASCII wireframe layout showing UI positions
 * 2. Component detail table
 * 3. Connection/flow relationships
 */
export const exportToMarkdown = (
    nodes: FlowNode[],
    edges: FlowEdge[],
    projectName: string = 'Program Plan',
    filename: string = 'program-plan'
): void => {
    if (nodes.length === 0) {
        console.warn('No nodes to export');
        return;
    }

    const lines: string[] = [];
    const date = new Date().toLocaleDateString('zh-TW');

    // ── Header ──
    lines.push(`# ${projectName}`);
    lines.push(`> 匯出時間: ${date}`);
    lines.push('');

    // ── Build hierarchy: find parent-child relationships ──
    // Sort nodes by Y position (top to bottom), then X (left to right)
    const sorted = [...nodes].sort((a, b) => {
        const dy = a.position.y - b.position.y;
        if (Math.abs(dy) > 30) return dy;
        return a.position.x - b.position.x;
    });

    // Build adjacency from edges
    const childrenOf = new Map<string, string[]>();
    const parentOf = new Map<string, string>();
    const nodeMap = new Map<string, FlowNode>();
    nodes.forEach(n => nodeMap.set(n.id, n));

    edges.forEach(e => {
        if (!childrenOf.has(e.source)) childrenOf.set(e.source, []);
        childrenOf.get(e.source)!.push(e.target);
        parentOf.set(e.target, e.source);
    });

    // Find root nodes (no incoming edges)
    const roots = sorted.filter(n => !parentOf.has(n.id));

    // ── Section 1: ASCII Wireframe Layout ──
    lines.push('## 📐 頁面佈局 (Wireframe)');
    lines.push('');
    lines.push('```');

    // Render each root and its children as a layout group
    const renderGroup = (rootNode: FlowNode, depth: number = 0) => {
        const indent = '  '.repeat(depth);
        const boxWidth = 50;
        const ascii = nodeToAscii(rootNode, boxWidth);
        const label = rootNode.data.label || 'Node';

        if (depth === 0) {
            // Top-level container
            const containerWidth = 60;
            lines.push('┌' + '─'.repeat(containerWidth - 2) + '┐');
            lines.push('│ ' + label + ' '.repeat(Math.max(0, containerWidth - 4 - label.length)) + ' │');
            lines.push('├' + '─'.repeat(containerWidth - 2) + '┤');
        } else {
            // Nested element with indent
            ascii.forEach(line => {
                lines.push(indent + line);
            });
        }

        // Render children
        const children = childrenOf.get(rootNode.id) || [];
        children.forEach(childId => {
            const child = nodeMap.get(childId);
            if (child) {
                lines.push(indent + '│');
                renderGroup(child, depth + 1);
            }
        });

        if (depth === 0) {
            // Close top-level container
            const containerWidth = 60;
            lines.push('└' + '─'.repeat(containerWidth - 2) + '┘');
            lines.push('');
        }
    };

    roots.forEach(root => {
        renderGroup(root);
    });

    // Also render orphan nodes (no connections) as standalone elements
    const connectedIds = new Set<string>();
    edges.forEach(e => {
        connectedIds.add(e.source);
        connectedIds.add(e.target);
    });
    const orphans = sorted.filter(n => !connectedIds.has(n.id));
    orphans.forEach(node => {
        const ascii = nodeToAscii(node, 40);
        ascii.forEach(line => lines.push(line));
        lines.push('');
    });

    lines.push('```');
    lines.push('');

    // ── Section 2: Component Details Table ──
    lines.push('## 📋 元件說明 (Component Details)');
    lines.push('');
    lines.push('| # | 名稱 | 類型 | 屬性 | 顏色 | 說明 |');
    lines.push('|---|------|------|------|------|------|');

    sorted.forEach((node, i) => {
        const d = node.data;
        const name = d.label || '-';
        const uiType = getUiTypeName(d.toolboxId, d.uiType);
        const attr = d.attribute ? getAttributeName(d.attribute) : '-';
        const color = d.color || 'slate';
        const desc = d.description || '-';
        lines.push(`| ${i + 1} | **${name}** | ${uiType} | ${attr} | ${color} | ${desc} |`);
    });

    lines.push('');

    // ── Section 3: Connections / Flow ──
    if (edges.length > 0) {
        lines.push('## 🔗 連線關係 (Connections)');
        lines.push('');
        lines.push('```mermaid');
        lines.push('graph TD');

        // Generate Mermaid flowchart
        nodes.forEach(node => {
            const label = (node.data.label || 'Node').replace(/"/g, "'");
            lines.push(`    ${node.id}["${label}"]`);
        });

        edges.forEach(edge => {
            const edgeLabel = edge.data?.label ? `|${edge.data.label}|` : '';
            lines.push(`    ${edge.source} -->${edgeLabel} ${edge.target}`);
        });

        lines.push('```');
        lines.push('');

        // Also add text-based flow list
        lines.push('### 文字版流程');
        lines.push('');
        edges.forEach(edge => {
            const source = nodeMap.get(edge.source)?.data.label || edge.source;
            const target = nodeMap.get(edge.target)?.data.label || edge.target;
            const label = edge.data?.label ? ` (${edge.data.label})` : '';
            lines.push(`- **${source}** → **${target}**${label}`);
        });
        lines.push('');
    }

    // ── Section 4: Statistics ──
    lines.push('---');
    lines.push('');
    lines.push(`📊 **統計**: ${nodes.length} 個元件 | ${edges.length} 條連線 | 匯出自 Program Plan Helper`);
    lines.push('');

    // ── Download ──
    const content = lines.join('\n');
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.download = `${filename}-${new Date().toISOString().slice(0, 10)}.md`;
    link.href = url;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Delay revocation to ensure download starts
    setTimeout(() => URL.revokeObjectURL(url), 1000);
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

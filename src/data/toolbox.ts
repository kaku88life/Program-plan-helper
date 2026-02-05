export interface ToolboxItem {
    id: string;
    labelKey?: string; // If present, use t.uiComponents.items[labelKey]
    techKey?: string;  // If present, use t.techDetails[techKey].summary
    type: 'tech' | 'ui';
    techId?: string; // For tech items, the ID used in translations (e.g. 'React')
    uiType?: string; // For UI items, the node type (e.g. 'Button', 'Container')
}

export interface ToolboxSubGroup {
    id: string;
    labelKey: string; // use t.uiComponents[labelKey]
    items: ToolboxItem[];
}

export interface ToolboxCategory {
    id: string;
    labelKey: string; // use t.categories[labelKey] or t.uiComponents.title
    type: 'tech' | 'ui_group';
    color: string;
    items?: ToolboxItem[]; // For flat tech categories
    subGroups?: ToolboxSubGroup[]; // For nested UI categories
}

export const TOOLBOX_DATA: ToolboxCategory[] = [
    {
        id: 'ui_lib',
        labelKey: 'uiComponents.title',
        type: 'ui_group',
        color: 'border-indigo-200 bg-indigo-50',
        subGroups: [
            {
                id: 'layout',
                labelKey: 'layout',
                items: [
                    { id: 'container', labelKey: 'container', type: 'ui', uiType: 'Container' },
                    { id: 'card', labelKey: 'card', type: 'ui', uiType: 'Card' }, // Distinct type
                    { id: 'divider', labelKey: 'divider', type: 'ui', uiType: 'Container' }, // Simplified
                ]
            },
            {
                id: 'ui_nav',
                labelKey: 'ui_nav',
                items: [
                    { id: 'navbar', labelKey: 'navbar', type: 'ui', uiType: 'Container' },
                    { id: 'sidebar', labelKey: 'sidebar', type: 'ui', uiType: 'Container' },
                    { id: 'tabs', labelKey: 'tabs', type: 'ui', uiType: 'Button' },
                    { id: 'breadcrumb', labelKey: 'breadcrumb', type: 'ui', uiType: 'Button' },
                ]
            },
            {
                id: 'buttons',
                labelKey: 'buttons',
                items: [
                    { id: 'btn_pri', labelKey: 'button_primary', type: 'ui', uiType: 'Button' },
                    { id: 'btn_sec', labelKey: 'button_secondary', type: 'ui', uiType: 'Button' },
                    { id: 'action', labelKey: 'action', type: 'ui', uiType: 'Button' },
                ]
            },
            {
                id: 'inputs',
                labelKey: 'inputs',
                items: [
                    { id: 'inp_text', labelKey: 'input_text', type: 'ui', uiType: 'Input' },
                    { id: 'inp_search', labelKey: 'input_search', type: 'ui', uiType: 'Input' },
                    { id: 'select', labelKey: 'select', type: 'ui', uiType: 'Input' },
                    { id: 'checkbox', labelKey: 'checkbox', type: 'ui', uiType: 'Button' }, // Button variant
                    { id: 'switch', labelKey: 'switch', type: 'ui', uiType: 'Button' },
                ]
            },
            {
                id: 'display',
                labelKey: 'display',
                items: [
                    { id: 'img', labelKey: 'image', type: 'ui', uiType: 'Image' },
                    { id: 'table', labelKey: 'table', type: 'ui', uiType: 'Container' },
                    { id: 'list', labelKey: 'list', type: 'ui', uiType: 'Container' },
                    { id: 'avatar', labelKey: 'avatar', type: 'ui', uiType: 'Image' },
                    { id: 'tag', labelKey: 'tag', type: 'ui', uiType: 'Button' },
                    { id: 'badge', labelKey: 'badge', type: 'ui', uiType: 'Button' },
                ]
            },
            {
                id: 'feedback',
                labelKey: 'ui_feedback',
                items: [
                    { id: 'modal', labelKey: 'modal', type: 'ui', uiType: 'Container' },
                    { id: 'alert', labelKey: 'alert', type: 'ui', uiType: 'Container' },
                    { id: 'toast', labelKey: 'toast', type: 'ui', uiType: 'Button' },
                ]
            }
        ]
    },
    {
        id: 'workflow',
        labelKey: 'workflow', // New category
        type: 'tech',
        color: 'border-slate-200 bg-slate-50',
        items: [
            // Using tech items for logical flows, can reuse UI types if needed but sticking to tech structure for simplicity or add a new 'logic' type
            // Actually, let's treat them as UI nodes for visual editing or generic tech nodes?
            // Let's use generic tech nodes for now as they are simple cards.
            { id: 'Trigger', type: 'tech', techId: 'Trigger' },
            { id: 'Logic', type: 'tech', techId: 'Logic' },
            { id: 'Action', type: 'tech', techId: 'Action' },
        ]
    },
    {
        id: 'frontend',
        labelKey: 'frontend',
        type: 'tech',
        color: 'border-blue-200 bg-blue-50',
        items: [
            { id: 'React', type: 'tech', techId: 'React' },
            { id: 'Vue', type: 'tech', techId: 'Vue' },
            { id: 'Next.js', type: 'tech', techId: 'Next.js' },
            { id: 'Tailwind CSS', type: 'tech', techId: 'Tailwind CSS' },
            { id: 'Htmx', type: 'tech', techId: 'Htmx' },
            { id: 'Angular', type: 'tech', techId: 'Angular' },
            { id: 'Svelte', type: 'tech', techId: 'Svelte' },
        ]
    },
    {
        id: 'backend',
        labelKey: 'backend',
        type: 'tech',
        color: 'border-green-200 bg-green-50',
        items: [
            { id: 'Node.js', type: 'tech', techId: 'Node.js' },
            { id: 'Python', type: 'tech', techId: 'Python' },
            { id: 'Go', type: 'tech', techId: 'Go' },
            { id: 'Java', type: 'tech', techId: 'Java' },
            { id: 'PHP', type: 'tech', techId: 'PHP' },
            { id: 'Stripe', type: 'tech', techId: 'Stripe' }, // Service
        ]
    },
    {
        id: 'database',
        labelKey: 'database',
        type: 'tech',
        color: 'border-amber-200 bg-amber-50',
        items: [
            { id: 'PostgreSQL', type: 'tech', techId: 'PostgreSQL' },
            { id: 'MySQL', type: 'tech', techId: 'MySQL' },
            { id: 'MongoDB', type: 'tech', techId: 'MongoDB' },
            { id: 'Supabase', type: 'tech', techId: 'Supabase' }, // New
            { id: 'Firebase', type: 'tech', techId: 'Firebase' },
            { id: 'Redis', type: 'tech', techId: 'Redis' },
        ]
    },
    {
        id: 'security',
        labelKey: 'security',
        type: 'tech',
        color: 'border-red-200 bg-red-50',
        items: [
            { id: 'OAuth 2.0', type: 'tech', techId: 'OAuth 2.0' },
            { id: 'JWT', type: 'tech', techId: 'JWT' },
            { id: 'SSL/HTTPS', type: 'tech', techId: 'SSL/HTTPS' },
            { id: 'WAF', type: 'tech', techId: 'WAF' },
        ]
    },
    {
        id: 'quality',
        labelKey: 'quality',
        type: 'tech',
        color: 'border-purple-200 bg-purple-50',
        items: [
            { id: 'Jest', type: 'tech', techId: 'Jest' },
            { id: 'Cypress', type: 'tech', techId: 'Cypress' },
            { id: 'SonarQube', type: 'tech', techId: 'SonarQube' },
            { id: 'k6', type: 'tech', techId: 'k6' },
        ]
    },
];


import React from 'react';
import type { ProjectTemplate } from '../../data/templates';
import { TEMPLATES } from '../../data/templates';
import { Rocket, Layout, Gamepad2, FileText, Network, Workflow, GitBranch, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface ProjectWizardProps {
    onSelectTemplate: (template: ProjectTemplate) => void;
    onClose: () => void;
}

const ICONS: Record<string, React.ReactNode> = {
    landing: <Layout size={32} className="text-blue-500" />,
    crm: <FileText size={32} className="text-emerald-500" />,
    game: <Gamepad2 size={32} className="text-purple-500" />,
    mindmap: <Network size={32} className="text-amber-500" />,
    flowchart: <Workflow size={32} className="text-rose-500" />,
    sitemap: <GitBranch size={32} className="text-indigo-500" />,
};

const ProjectWizard = ({ onSelectTemplate, onClose }: ProjectWizardProps) => {
    const { t } = useLanguage();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
                <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            <Rocket className="text-primary" />
                            {t.newProject}
                        </h2>
                        <p className="text-slate-500 mt-1">{t.chooseStarter}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        {t.skip}
                    </button>
                </div>

                <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(TEMPLATES).map(([key, template]) => (
                        <button
                            key={key}
                            onClick={() => onSelectTemplate(template)}
                            className="flex flex-col items-start p-5 rounded-xl border border-slate-200 hover:border-primary hover:shadow-lg hover:bg-blue-50/30 transition-all text-left group"
                        >
                            <div className="mb-4 p-3 rounded-full bg-slate-100 group-hover:bg-white transition-colors">
                                {ICONS[key] || <Rocket size={32} className="text-slate-400" />}
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-2">
                                {t.templates[key as keyof typeof t.templates]?.name || template.name}
                            </h3>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                {t.templates[key as keyof typeof t.templates]?.desc || template.description}
                            </p>
                        </button>
                    ))}

                    <button
                        onClick={onClose}
                        className="flex flex-col items-center justify-center p-5 rounded-xl border border-dashed border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all text-center md:col-span-2 lg:col-span-3"
                    >
                        <div className="mb-2">
                            <Sparkles size={32} className="text-slate-400" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-600">{t.blankCanvas}</h3>
                        <p className="text-sm text-slate-400">{t.startScratch}</p>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProjectWizard;

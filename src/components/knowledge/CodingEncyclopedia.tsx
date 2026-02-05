import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Book, X, Lightbulb, Search, GraduationCap } from 'lucide-react';
import { createPortal } from 'react-dom';

interface CodingEncyclopediaProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CodingEncyclopedia = ({ isOpen, onClose }: CodingEncyclopediaProps) => {
    const { t } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTech, setSelectedTech] = useState<string | null>(null);

    if (!isOpen) return null;

    // Filter categories/techs
    // We need to flatten the structure to find all tech keys
    const techKeys = Object.keys(t.techDetails);

    const filteredKeys = techKeys.filter(key =>
        key.toLowerCase().includes(searchTerm.toLowerCase()) ||
        // @ts-ignore
        t.techDetails[key].summary.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Auto-select first result if nothing selected
    if (!selectedTech && filteredKeys.length > 0) {
        setSelectedTech(filteredKeys[0]);
    }

    // Get current tech details
    // @ts-ignore
    const activeDetail = selectedTech ? t.techDetails[selectedTech] : null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[80vh] flex overflow-hidden border border-slate-200">

                {/* Sidebar List */}
                <div className="w-1/3 bg-slate-50 border-r border-slate-200 flex flex-col">
                    <div className="p-4 border-b border-slate-200 bg-white">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                                <GraduationCap size={24} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-800">Coding 101</h2>
                                <p className="text-xs text-slate-500">新手村百科全書</p>
                            </div>
                        </div>
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="搜尋技術名詞..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {filteredKeys.map(key => (
                            <button
                                key={key}
                                onClick={() => setSelectedTech(key)}
                                className={`
                                    w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-between group
                                    ${selectedTech === key
                                        ? 'bg-white shadow-sm border border-slate-200 text-primary'
                                        : 'text-slate-600 hover:bg-slate-100'}
                                `}
                            >
                                <span>{key}</span>
                                {selectedTech === key && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 bg-white flex flex-col relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
                    >
                        <X size={20} />
                    </button>

                    {activeDetail ? (
                        <div className="flex-1 overflow-y-auto p-8">
                            {/* Header */}
                            <div className="mb-8">
                                <h1 className="text-4xl font-bold text-slate-800 mb-2">{selectedTech}</h1>
                                <p className="text-lg text-slate-500 font-light">{activeDetail.summary}</p>
                            </div>

                            {/* Analogy Card - The Star of the Show */}
                            {activeDetail.analogy && (
                                <div className="mb-8 bg-amber-50 border border-amber-100 rounded-2xl p-6 relative overflow-hidden">
                                    <div className="absolute -right-4 -top-4 text-amber-100 opacity-50">
                                        <Lightbulb size={120} />
                                    </div>
                                    <div className="relative z-10">
                                        <h3 className="flex items-center gap-2 text-amber-700 font-bold text-lg mb-3">
                                            <Lightbulb size={20} />
                                            Coding 小常識
                                        </h3>
                                        <p className="text-amber-900/80 text-lg leading-relaxed italic">
                                            "{activeDetail.analogy}"
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Deep Dive Details */}
                            {activeDetail.details && (
                                <div className="mb-8 p-6 bg-slate-50 border border-slate-100 rounded-2xl">
                                    <h4 className="flex items-center gap-2 text-md font-bold text-slate-700 mb-4">
                                        <Book size={18} className="text-primary" />
                                        Deep Dive & 比較
                                    </h4>
                                    <div className="text-slate-600 leading-7 whitespace-pre-wrap text-sm">
                                        {activeDetail.details}
                                    </div>
                                </div>
                            )}

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Use Cases */}
                                <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                                    <h4 className="font-semibold text-slate-700 mb-3 uppercase tracking-wider text-xs">Best For</h4>
                                    <ul className="space-y-2">
                                        {activeDetail.useCases.map((useCase: string, idx: number) => (
                                            <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                                                {useCase}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Pros */}
                                <div className="bg-emerald-50/50 rounded-xl p-5 border border-emerald-100/50">
                                    <h4 className="font-semibold text-emerald-700 mb-3 uppercase tracking-wider text-xs">Strengths</h4>
                                    <ul className="space-y-2">
                                        {activeDetail.pros.map((pro: string, idx: number) => (
                                            <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                                                {pro}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Cons */}
                                <div className="bg-red-50/50 rounded-xl p-5 border border-red-100/50">
                                    <h4 className="font-semibold text-red-700 mb-3 uppercase tracking-wider text-xs">Limitations</h4>
                                    <ul className="space-y-2">
                                        {activeDetail.cons.map((con: string, idx: number) => (
                                            <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                                                {con}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-slate-400 flex-col">
                            <Book size={48} className="mb-4 opacity-50" />
                            <p>Select a term to start learning</p>
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};

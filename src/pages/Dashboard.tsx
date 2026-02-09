import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, FolderOpen, Clock, Search, LayoutGrid, List } from 'lucide-react';
import { getAllProjects, saveProject, deleteProject } from '../db/db';
import type { ProjectSummary } from '../types/Project';
import { v4 as uuidv4 } from 'uuid';
import { useLanguage } from '../context/LanguageContext';

export function Dashboard() {
    const navigate = useNavigate();
    const { language } = useLanguage(); // Although we might need to move LanguageContext up
    const [projects, setProjects] = useState<ProjectSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const loadProjects = async () => {
        try {
            setLoading(true);
            const data = await getAllProjects();
            setProjects(data);
        } catch (error) {
            console.error('Failed to load projects:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProjects();
    }, []);

    const handleCreateProject = async () => {
        const newId = uuidv4();
        const newProject = {
            id: newId,
            name: language === 'zh' ? '未命名專案' : 'Untitled Project',
            createdAt: Date.now(),
            updatedAt: Date.now(),
            nodes: [],
            edges: [],
            version: 1
        };

        try {
            await saveProject(newProject);
            navigate(`/project/${newId}`);
        } catch (error) {
            console.error('Failed to create project:', error);
        }
    };

    const handleDeleteProject = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!window.confirm(language === 'zh' ? '確定要刪除此專案嗎？' : 'Are you sure you want to delete this project?')) return;

        try {
            await deleteProject(id);
            await loadProjects();
        } catch (error) {
            console.error('Failed to delete project:', error);
        }
    };

    const filteredProjects = projects.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString() + ' ' + new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                            <FolderOpen className="text-blue-500" size={32} />
                            {language === 'zh' ? '我的專案' : 'My Projects'}
                        </h1>
                        <p className="text-slate-500 mt-1">
                            {language === 'zh' ? '管理您的所有程式規劃圖表' : 'Manage all your program planning diagrams'}
                        </p>
                    </div>
                    <button
                        onClick={handleCreateProject}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition-all active:scale-95"
                    >
                        <Plus size={20} />
                        {language === 'zh' ? '新增專案' : 'New Project'}
                    </button>
                </div>

                {/* Toolbar */}
                <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder={language === 'zh' ? '搜尋專案...' : 'Search projects...'}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-100'}`}
                        >
                            <LayoutGrid size={20} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-100'}`}
                        >
                            <List size={20} />
                        </button>
                    </div>
                </div>

                {/* Project List */}
                {loading ? (
                    <div className="text-center py-20 text-slate-400">Loading...</div>
                ) : filteredProjects.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                            <FolderOpen size={32} />
                        </div>
                        <h3 className="text-lg font-medium text-slate-600 mb-1">
                            {searchTerm ? (language === 'zh' ? '找不到專案' : 'No projects found') : (language === 'zh' ? '還沒有專案' : 'No projects yet')}
                        </h3>
                        <p className="text-slate-400 mb-4">
                            {searchTerm ? '' : (language === 'zh' ? '建立您的第一個專案開始使用！' : 'Create your first project to get started!')}
                        </p>
                        {!searchTerm && (
                            <button
                                onClick={handleCreateProject}
                                className="px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 font-medium transition-all"
                            >
                                {language === 'zh' ? '立即建立' : 'Create Now'}
                            </button>
                        )}
                    </div>
                ) : (
                    <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                        {filteredProjects.map(project => (
                            <div
                                key={project.id}
                                onClick={() => navigate(`/project/${project.id}`)}
                                className={`
                                    group bg-white border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer overflow-hidden
                                    ${viewMode === 'grid' ? 'rounded-xl flex flex-col' : 'rounded-lg flex items-center p-4'}
                                `}
                            >
                                {/* Thumbnail (Grid only) */}
                                {viewMode === 'grid' && (
                                    <div className="h-40 bg-slate-100 relative overflow-hidden flex items-center justify-center border-b border-slate-100">
                                        {project.thumbnail ? (
                                            <img src={project.thumbnail} alt={project.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="text-slate-300">
                                                <LayoutGrid size={48} opacity={0.2} />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                                    </div>
                                )}

                                {/* Content */}
                                <div className={viewMode === 'grid' ? "p-4 flex-1" : "flex-1 flex justify-between items-center"}>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-slate-800 truncate group-hover:text-blue-600 transition-colors mb-1">
                                            {project.name}
                                        </h3>
                                        <div className="flex items-center gap-4 text-xs text-slate-500">
                                            <span className="flex items-center gap-1">
                                                <Clock size={12} />
                                                {formatDate(project.updatedAt)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                                        <button
                                            onClick={(e) => handleDeleteProject(e, project.id)}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                            title={language === 'zh' ? '刪除專案' : 'Delete Project'}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { ReactNode } from 'react';
import { Check, AlertTriangle, Lightbulb } from 'lucide-react';

interface TechDetail {
    summary: string;
    pros: string[];
    cons: string[];
    useCases: string[];
    analogy?: string;
}

interface RichTooltipProps {
    content?: TechDetail;
    title: string;
    children: ReactNode;
    fallbackText?: string;
}

export const RichTooltip = ({ content, title, children, fallbackText }: RichTooltipProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const triggerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isVisible && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            const tooltipHeight = 350; // Approximate max height
            const tooltipWidth = 320;

            let left = rect.right + 10;
            let top = rect.top;

            // Flip to left if not enough space on right
            if (left + tooltipWidth > viewportWidth) {
                left = rect.left - tooltipWidth - 10;
            }

            // Flip to top if not enough space below
            if (top + tooltipHeight > viewportHeight) {
                // If more space above than below, or simply hits bottom, go up
                // Use rect.bottom for "below", rect.top for "above" reference
                // But we want to align the TOP of the tooltip with rect.top usually, 
                // so if calculating "Up", we want tooltip bottom to be around rect.bottom or rect.top

                // Let's try aligning bottom of tooltip with bottom of trigger
                top = rect.bottom - tooltipHeight;

                // If that's still too high (cutoff top), pin to bottom of viewport
                if (top < 10) {
                    top = Math.max(10, viewportHeight - tooltipHeight - 10);
                }
            }

            setPosition({ top, left });
        }
    }, [isVisible]);

    // If no rich content, just render children without tooltip logic (or fallback)
    if (!content) {
        return (
            <div className="relative flex items-center" title={fallbackText}>{children}</div>
        )
    }

    return (
        <div
            className="relative flex items-center"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
            ref={triggerRef}
        >
            {children}
            {isVisible && createPortal(
                <div
                    className="fixed z-[9999] w-[320px] bg-slate-800 text-white rounded-xl shadow-2xl pointer-events-none animate-in fade-in duration-200 overflow-hidden border border-slate-700"
                    style={{ top: position.top, left: position.left }}
                >
                    {/* Header */}
                    <div className="bg-slate-900/50 p-3 border-b border-slate-700 flex justify-between items-center">
                        <h3 className="font-bold text-sm text-white">{title}</h3>
                        {/* Hint about encyclopedia */}
                        {content.analogy && (
                            <div className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">
                                <Lightbulb size={10} />
                                <span>Coding 101 Available</span>
                            </div>
                        )}
                    </div>

                    {/* Body */}
                    <div className="p-4 space-y-4 text-xs">

                        {/* Summary */}
                        <p className="text-slate-300 leading-relaxed">{content.summary}</p>

                        {/* Pros */}
                        {content.pros.length > 0 && (
                            <div>
                                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1.5">
                                    <Check size={12} />
                                    <span>Strengths</span>
                                </div>
                                <ul className="space-y-1">
                                    {content.pros.map((pro, i) => (
                                        <li key={i} className="flex items-start gap-1.5 text-slate-400">
                                            <span className="mt-1 block w-1 h-1 rounded-full bg-slate-600 shrink-0" />
                                            {pro}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Cons */}
                        {content.cons.length > 0 && (
                            <div>
                                <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-1.5">
                                    <AlertTriangle size={12} />
                                    <span>Limitations</span>
                                </div>
                                <ul className="space-y-1">
                                    {content.cons.map((con, i) => (
                                        <li key={i} className="flex items-start gap-1.5 text-slate-400">
                                            <span className="mt-1 block w-1 h-1 rounded-full bg-slate-600 shrink-0" />
                                            {con}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Use Cases */}
                        {content.useCases.length > 0 && (
                            <div>
                                <div className="flex items-center gap-1.5 text-blue-400 font-semibold mb-1.5">
                                    <Lightbulb size={12} />
                                    <span>Best For</span>
                                </div>
                                <ul className="space-y-1">
                                    {content.useCases.map((useCase, i) => (
                                        <li key={i} className="flex items-start gap-1.5 text-slate-400">
                                            <span className="mt-1 block w-1 h-1 rounded-full bg-slate-600 shrink-0" />
                                            {useCase}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

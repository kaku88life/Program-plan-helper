import { useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface SimpleTooltipProps {
    content: string | ReactNode;
    children: ReactNode;
    className?: string;
    side?: 'right' | 'top' | 'bottom' | 'left';
}

export const SimpleTooltip = ({ content, children, className = '', side = 'right' }: SimpleTooltipProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const triggerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isVisible && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            const tooltipWidth = 220; // Approximate width based on CSS
            const tooltipHeight = 100; // Approximate max height

            let top = 0;
            let left = 0;

            if (side === 'right') {
                left = rect.right + 10;
                top = rect.top + (rect.height / 2) - 20; // Align somewhat with center/top

                // Flip if overflow right
                if (left + tooltipWidth > viewportWidth) {
                    left = rect.left - tooltipWidth - 10;
                }
            } else if (side === 'top') {
                left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
                top = rect.top - tooltipHeight - 10;
            }

            // Boundary checks
            if (top < 10) top = 10;
            if (top + tooltipHeight > viewportHeight) top = viewportHeight - tooltipHeight - 10;
            if (left < 10) left = 10;
            if (left + tooltipWidth > viewportWidth) left = viewportWidth - tooltipWidth - 10;

            setPosition({ top, left });
        }
    }, [isVisible, side]);

    if (!content) return <>{children}</>;

    return (
        <div
            className={`relative flex items-center ${className}`}
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
            ref={triggerRef}
        >
            {children}
            {isVisible && createPortal(
                <div
                    className="fixed z-[9999] w-[220px] bg-slate-800 text-white rounded-lg shadow-2xl pointer-events-none animate-in fade-in zoom-in-95 duration-200 overflow-hidden border border-slate-700 p-3 text-xs"
                    style={{ top: position.top, left: position.left }}
                >
                    {/* Arrow (Visual only, simple pointing left) */}
                    <div
                        className="absolute w-3 h-3 bg-slate-800 border-l border-b border-slate-700 transform rotate-45"
                        style={{
                            left: -6,
                            top: 20,
                            visibility: (position.left > (triggerRef.current?.getBoundingClientRect().left || 0)) ? 'visible' : 'hidden'
                        }}
                    />

                    {/* Right-side arrow if flipped? Custom arrow logic is clearer without it or simplified. 
                        Let's just stick to the content box first, arrow is a nice-to-have but positioning is key.
                        I'll use a simple CSS arrow if possible or omit it for robustness. 
                        The previous manual one had an arrow.
                    */}
                    {/* Re-add simple arrow logic if positioned to the right */}
                    {(position.left > (triggerRef.current?.getBoundingClientRect().right || 0)) && (
                        <div className="absolute top-4 -left-1.5 w-3 h-3 bg-slate-800 border-l border-b border-slate-700 transform rotate-45" />
                    )}

                    <div className="relative z-10 text-slate-300 leading-relaxed font-normal">
                        {content}
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

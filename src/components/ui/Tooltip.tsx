import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { ReactNode } from 'react';

interface TooltipProps {
    content: string;
    children: ReactNode;
}

export const Tooltip = ({ content, children }: TooltipProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const triggerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isVisible && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setPosition({
                top: rect.top + rect.height / 2,
                left: rect.right + 10, // 10px offset to the right
            });
        }
    }, [isVisible]);

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
                    className="fixed z-[9999] w-48 p-2 bg-slate-800 text-white text-xs rounded shadow-lg pointer-events-none animate-in fade-in duration-200"
                    style={{
                        top: position.top,
                        left: position.left,
                        transform: 'translateY(-50%)'
                    }}
                >
                    <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45" />
                    {content}
                </div>,
                document.body
            )}
        </div>
    );
};

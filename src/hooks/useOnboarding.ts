import { useEffect, useState } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { useLanguage } from '../context/LanguageContext';

const ONBOARDING_COMPLETED_KEY = 'program-plan-helper-onboarding-completed';

export const useOnboarding = (enabled: boolean = true) => {
    const { language } = useLanguage();
    const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(() => {
        return localStorage.getItem(ONBOARDING_COMPLETED_KEY) === 'true';
    });

    const startOnboarding = () => {
        const isZh = language === 'zh';

        const driverObj = driver({
            showProgress: true,
            animate: true,
            allowClose: true,
            overlayColor: 'rgba(0, 0, 0, 0.7)',
            stagePadding: 10,
            popoverClass: 'onboarding-popover',
            nextBtnText: isZh ? '下一步' : 'Next',
            prevBtnText: isZh ? '上一步' : 'Previous',
            doneBtnText: isZh ? '開始使用！' : 'Get Started!',
            onDestroyStarted: () => {
                localStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
                setHasCompletedOnboarding(true);
                driverObj.destroy();
            },
            steps: [
                {
                    element: '.sidebar-toolbox',
                    popover: {
                        title: isZh ? '👋 歡迎使用 Program Plan Helper!' : '👋 Welcome to Program Plan Helper!',
                        description: isZh
                            ? '這是工具箱。點擊展開分類，然後拖放元件到畫布上開始規劃你的專案架構。'
                            : 'This is the toolbox. Click to expand categories, then drag and drop components onto the canvas to start planning your project architecture.',
                        side: 'right',
                        align: 'start'
                    }
                },
                {
                    element: '.react-flow',
                    popover: {
                        title: isZh ? '📐 這是你的畫布' : '📐 This is Your Canvas',
                        description: isZh
                            ? '在這裡規劃你的專案架構。你可以：\n• 拖放元件\n• 拖動連接線把元件串起來\n• 雙擊編輯文字'
                            : 'Plan your project architecture here. You can:\n• Drag and drop components\n• Draw connections between nodes\n• Double-click to edit text',
                        side: 'left',
                        align: 'center'
                    }
                },
                {
                    element: '[class*="text-emerald"]',
                    popover: {
                        title: isZh ? '📥 匯出圖片' : '📥 Export Image',
                        description: isZh
                            ? '完成規劃後，點擊這裡將畫布匯出為 PNG 圖片，可以分享給團隊或放入文件。'
                            : 'When you\'re done planning, click here to export the canvas as a PNG image to share with your team or add to documents.',
                        side: 'bottom',
                        align: 'center'
                    }
                },
                {
                    element: '[class*="text-blue-600"]',
                    popover: {
                        title: isZh ? '💾 儲存專案' : '💾 Save Project',
                        description: isZh
                            ? '點擊儲存將專案匯出為 JSON 檔案。你的工作也會自動儲存到瀏覽器。'
                            : 'Click save to export as JSON file. Your work is also auto-saved to browser storage.',
                        side: 'bottom',
                        align: 'center'
                    }
                },
                {
                    element: '.react-flow__controls',
                    popover: {
                        title: isZh ? '🔍 視圖控制' : '🔍 View Controls',
                        description: isZh
                            ? '使用這些按鈕來縮放和調整視圖。也可以用滾輪縮放！'
                            : 'Use these buttons to zoom and adjust the view. You can also use the scroll wheel to zoom!',
                        side: 'right',
                        align: 'end'
                    }
                },
                {
                    popover: {
                        title: isZh ? '⌨️ 快捷鍵提示' : '⌨️ Keyboard Shortcuts',
                        description: isZh
                            ? '• Ctrl+Z：復原\n• Ctrl+Y：重做\n• Ctrl+C/V：複製/貼上\n• Ctrl+S：儲存\n• Delete：刪除選中元件'
                            : '• Ctrl+Z: Undo\n• Ctrl+Y: Redo\n• Ctrl+C/V: Copy/Paste\n• Ctrl+S: Save\n• Delete: Delete selected',
                        align: 'center'
                    }
                }
            ]
        });

        driverObj.drive();
    };

    // Auto-start onboarding for first-time users (only when enabled)
    useEffect(() => {
        if (!hasCompletedOnboarding && enabled) {
            // Small delay to ensure DOM is ready
            const timer = setTimeout(() => {
                startOnboarding();
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [hasCompletedOnboarding, enabled]);

    const resetOnboarding = () => {
        localStorage.removeItem(ONBOARDING_COMPLETED_KEY);
        setHasCompletedOnboarding(false);
    };

    return {
        hasCompletedOnboarding,
        startOnboarding,
        resetOnboarding
    };
};

export default useOnboarding;

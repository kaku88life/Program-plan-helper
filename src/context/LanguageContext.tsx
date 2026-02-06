import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type Language = 'en' | 'zh';

type TechDetail = {
    summary: string;
    pros: string[];
    cons: string[];
    useCases: string[];
    analogy?: string; // Coding 101
    details?: string; // Deep dive explanation
};

type Translations = {
    // Sidebar
    toolbox: string;
    dragTip: string;
    categories: {
        frontend: string;
        backend: string;
        database: string;
        security: string;
        quality: string;
        workflow: string;
    };
    uiDescriptions: Record<string, string>;
    // New fields
    attributes: {
        mainPage: string;
        subPage: string;
        modal: string;
        alert: string;
        component: string;
        trigger: string;
        logic: string;
        backend: string;
        database: string;
    };
    variants: {
        solid: string;
        outline: string;
        ghost: string;
        link: string;
        card: string;
        window: string;
        section: string;
        circle: string;
        pill: string;
    };
    edit: {
        title: string;
        description: string;
        attribute: string;
        variant: string;
        color: string;
    };
    uiComponents: {
        title: string;
        layout: string;
        ui_nav: string;
        buttons: string;
        inputs: string;
        display: string;
        ui_feedback: string;
        items: {
            container: string;
            card: string;
            button_primary: string;
            button_secondary: string;
            input_text: string;
            input_search: string;
            image: string;
            divider: string;
            // New additions
            navbar: string;
            sidebar: string;
            tabs: string;
            breadcrumb: string;
            modal: string;
            alert: string;
            toast: string;
            checkbox: string;
            radio: string;
            switch: string;
            select: string;
            slider: string;
            table: string;
            list: string;
            tag: string;
            avatar: string;
            badge: string;
            trigger: string;
            logic: string;
            action: string;
        }
    };
    techDetails: Record<string, TechDetail>;
    // Wizard
    newProject: string;
    chooseStarter: string;
    skip: string;
    blankCanvas: string;
    startScratch: string;
    templates: {
        landing: { name: string; desc: string };
        crm: { name: string; desc: string };
        game: { name: string; desc: string };
        mindmap: { name: string; desc: string };
        flowchart: { name: string; desc: string };
        sitemap: { name: string; desc: string };
    };
};

const translations: Record<Language, Translations> = {
    en: {
        toolbox: 'Toolbox',
        dragTip: 'Drag items to the canvas',
        categories: {
            frontend: 'Frontend',
            backend: 'Backend',
            database: 'Database',
            security: 'Security',
            quality: 'Quality & Test',
            workflow: 'Interactions',
        },
        uiDescriptions: {
            container: 'Groups related components together. Use for: page sections, form groups, card layouts.',
            card: 'Displays content in a bordered box. Use for: product cards, user profiles, dashboard widgets.',
            divider: 'Separates content visually. Use for: section breaks, menu separators, list dividers.',
            navbar: 'Top navigation with logo and links. Use for: main site navigation, app header.',
            sidebar: 'Vertical navigation panel. Use for: dashboard menus, settings navigation, filters.',
            tabs: 'Switchable content panels. Use for: settings pages, product details, multi-step forms.',
            breadcrumb: 'Path navigation like "Home > Products > Details". Use for: e-commerce, docs, file browsers.',
            button_primary: 'Main action button. Use for: Submit, Save, Confirm, Buy Now.',
            button_secondary: 'Secondary action. Use for: Cancel, Back, Learn More, alternative actions.',
            input_text: 'Text input field. Use for: names, emails, addresses, any typed input.',
            input_search: 'Search with icon. Use for: site search, filtering lists, product lookup.',
            select: 'Dropdown menu. Use for: country selection, categories, sorting options.',
            checkbox: 'Multiple selection. Use for: filters, terms agreement, feature toggles.',
            switch: 'On/Off toggle. Use for: dark mode, notifications, enable/disable settings.',
            slider: 'Range selector. Use for: price range, volume control, rating filters.',
            image: 'Image placeholder. Use for: product photos, avatars, banners, galleries.',
            table: 'Data grid. Use for: order lists, user management, analytics data.',
            list: 'Item listing. Use for: menus, features, steps, comments.',
            avatar: 'Profile picture. Use for: user icons, team members, comment authors.',
            tag: 'Category label. Use for: article tags, product labels, status indicators.',
            badge: 'Count/status indicator. Use for: notification count, new items, online status.',
            modal: 'Popup dialog. Use for: confirmations, forms, detail views, alerts.',
            alert: 'Important message box. Use for: errors, warnings, success messages, info notices.',
            toast: 'Temporary notification. Use for: save confirmations, action feedback, updates.',
            trigger: 'Event starter. Use for: button clicks, form submissions, page loads.',
            logic: 'Conditional step. Use for: if/else decisions, validation checks, routing.',
            action: 'Flow output. Use for: API calls, page redirects, data updates.',
        },
        attributes: {
            mainPage: 'Main Page',
            subPage: 'Sub Page',
            modal: 'Modal',
            alert: 'Alert',
            component: 'Component',
            trigger: 'Trigger',
            logic: 'Logic',
            backend: 'Backend',
            database: 'Database',
        },
        variants: {
            solid: 'Solid',
            outline: 'Outline',
            ghost: 'Ghost',
            link: 'Link',
            card: 'Card',
            window: 'Window',
            section: 'Section',
            circle: 'Circle',
            pill: 'Pill',
        },
        edit: {
            title: 'Title',
            description: 'Description',
            attribute: 'Attribute',
            variant: 'Variant',
            color: 'Color',
        },
        uiComponents: {
            title: 'UI Components',
            layout: 'Layout & Containers',
            ui_nav: 'Navigation',
            buttons: 'Buttons & Controls',
            inputs: 'Forms & Inputs',
            display: 'Data Display',
            ui_feedback: 'Feedback & Alerts',
            items: {
                container: 'Container',
                card: 'Card',
                button_primary: 'Primary Button',
                button_secondary: 'Secondary Button',
                input_text: 'Text Input',
                input_search: 'Search Bar',
                image: 'Image Placeholder',
                divider: 'Divider',
                navbar: 'Navbar',
                sidebar: 'Sidebar',
                tabs: 'Tabs',
                breadcrumb: 'Breadcrumb',
                modal: 'Modal',
                alert: 'Alert',
                toast: 'Toast',
                checkbox: 'Checkbox',
                radio: 'Radio',
                switch: 'Switch',
                select: 'Select',
                slider: 'Slider',
                table: 'Table',
                list: 'List',
                tag: 'Tag',
                avatar: 'Avatar',
                badge: 'Badge',
                trigger: 'Trigger',
                logic: 'Logic',
                action: 'Action',
            }
        },
        techDetails: {
            'React': {
                summary: 'A JavaScript library for building user interfaces',
                pros: ['Component-based architecture', 'Huge ecosystem', 'Virtual DOM for performance'],
                cons: ['Steep learning curve', 'Requires additional libraries for routing/state', 'Frequent updates'],
                useCases: ['Single Page Apps (SPA)', 'Complex dashboards', 'Social media platforms'],
                analogy: 'Like playing with LEGOs. You build small blocks (components) and combine them to make a castle (website).'
            },
            'Vue': {
                summary: 'The Progressive JavaScript Framework',
                pros: ['Easy to learn', 'Flexible', 'High performance'],
                cons: ['Smaller ecosystem than React', 'Language barrier in some docs (Chinese origin)'],
                useCases: ['Small to medium scale apps', 'Rapid prototyping', 'Legacy app migration'],
                analogy: 'Like a furnished apartment. It comes with the essentials (router, state management) so you can move in quickly.'
            },
            'Next.js': {
                summary: 'The React Framework for the Web',
                pros: ['Server-side Rendering (SSR)', 'Great SEO', 'Built-in routing'],
                cons: ['Opinionated structure', 'Server costs', 'Learning curve specific to Next.js'],
                useCases: ['E-commerce sites', 'Content-heavy websites', 'SEO-critical apps'],
                analogy: 'Like a pre-fabricated house. It\'s based on React (LEGOs) but comes with walls and plumbing already set up for performance.'
            },
            'Angular': {
                summary: 'A platform for building mobile and desktop web applications',
                pros: ['Full-featured framework', 'TypeScript native', 'Stable & mature'],
                cons: ['Very steep learning curve', 'Verbose code', 'Heavy bundle size'],
                useCases: ['Enterprise level applications', 'Large scale management systems'],
                analogy: 'Like a fully equipped factory. It has every tool you need built-in, but it takes time to learn how to operate all the machinery.'
            },
            'Svelte': {
                summary: 'Cybernetically enhanced web apps',
                pros: ['No virtual DOM', 'Truly reactivity', 'Less code'],
                cons: ['Smaller community', 'Fewer libraries'],
                useCases: ['High performance apps', 'Embedded systems', 'Interactive visualizations'],
                analogy: 'Like a 3D printer. It compiles your design into pure efficiency, removing the need for a construction crew (Virtual DOM) at runtime.'
            },
            'Node.js': {
                summary: 'JavaScript runtime built on Chrome\'s V8 JavaScript engine',
                pros: ['Same language on frontend/backend', 'High performance async I/O', 'Huge package registry (NPM)'],
                cons: ['Not suitable for CPU heavy tasks', 'Callback hell (mitigated by async/await)', 'Immature standard library compared to Go/Java'],
                useCases: ['Real-time apps', 'API servers', 'Microservices'],
                analogy: 'Like a super-fast waiter. One waiter handles many tables (requests) by noting orders and running to the kitchen, never blocking.'
            },
            'Python': {
                summary: 'A programming language that lets you work quickly',
                pros: ['Easy to read syntax', 'Massive libraries for AI/Data', 'Versatile'],
                cons: ['Slower execution speed', 'Global Interpreter Lock (GIL)', 'Mobile development is weak'],
                useCases: ['Data Science', 'AI/ML backends', 'Scripting & Automation'],
                analogy: 'Like English. It reads almost like human language, making it the easiest way to talk to the computer, especially for science.'
            },
            'Go': {
                summary: 'Build simple, secure, scalable systems',
                pros: ['Compilation speed', 'Concurrency (Goroutines)', 'Single binary deployment'],
                cons: ['Smaller ecosystem than Java/Node', 'Simple type system can be limiting', 'No generics (historically)'],
                useCases: ['High performance servers', 'Cloud native tools', 'Microservices'],
                analogy: 'Like a high-speed train system. Designed by Google to move massive amounts of data/people efficiently and reliably.'
            },
            'Java': {
                summary: 'Write once, run anywhere',
                pros: ['Robust', 'Multi-threaded', 'Huge ecosystem'],
                cons: ['Verbose', 'Memory consumption', 'Startup time'],
                useCases: ['Enterprise backends', 'Android apps', 'Large systems'],
                analogy: 'Like a heavy-duty truck. It\'s not the fastest to start, but it can haul massive loads reliably across any terrain.'
            },
            'PHP': {
                summary: 'A popular general-purpose scripting language',
                pros: ['Easy deployment', 'Huge community', 'Great for simple sites'],
                cons: ['Inconsistent API', 'Security reputation', 'Performance (historically)'],
                useCases: ['Content sites', 'Wordpress', 'Small business apps'],
                analogy: 'Like a Swiss Army Knife for the web. It\'s everywhere, easy to use for small tasks, but maybe not the best tool for building a skyscraper.'
            },
            'PostgreSQL': {
                summary: 'The World\'s Most Advanced Open Source Relational Database',
                pros: ['Advanced features (JSON, GIS)', 'ACID compliant', 'Reliable & Robust'],
                cons: ['Complex configuration', 'Slower for simple read-heavy loads than MySQL', 'Steep learning curve'],
                useCases: ['Complex data models', 'Financial systems', 'Geospatial apps'],
                analogy: 'Like a massive, organized library archive. It can store anything, relate everything, and never loses a single page.'
            },
            'MySQL': { summary: 'Relational DB', pros: ['Popular', 'Fast'], cons: ['Features'], useCases: ['Web apps'], analogy: 'Like a standard filing cabinet. Reliable, fast, and what everyone expects to find.' },
            'MongoDB': { summary: 'NoSQL DB', pros: ['Flexible', 'Scalable'], cons: ['Transactions'], useCases: ['Big data'], analogy: 'Like a messy desk (in a good way). You can throw documents in any folder without checking the label first.' },
            'Firebase': { summary: 'BaaS', pros: ['Realtime', 'Easy'], cons: ['Vendor lock-in'], useCases: ['Mobile apps'], analogy: 'Like a hotel service. You just check in, and they handle the cleaning, security, and room service.' },
            'Redis': { summary: 'Cache', pros: ['Fast', 'Simple'], cons: ['Memory only'], useCases: ['Caching'], analogy: 'Like sticky notes on your monitor. Extremely fast to read, but limited space and gone if power goes out.' },
            'OAuth 2.0': { summary: 'Auth Protocol', pros: ['Standard', 'Secure'], cons: ['Complex'], useCases: ['Auth'], analogy: 'Like a hotel key card. It gives you access to a room without giving you the master key to the building.' },
            'JWT': { summary: 'Token Format', pros: ['Stateless', 'Portable'], cons: ['Revocation'], useCases: ['API Auth'], analogy: 'Like a stamped passport. It proves who you are without calling the embassy every time.' },
            'SSL/HTTPS': { summary: 'Security Protocol', pros: ['Encryption', 'Trust'], cons: ['Cert management'], useCases: ['Security'], analogy: 'Like an armored truck. It ensures no one can steal or read the message while it\'s on the road.' },
            'WAF': { summary: 'Firewall', pros: ['Protection', 'Rules'], cons: ['Configuration'], useCases: ['Security'], analogy: 'Like a security guard at the door. Checks your ID and bag before letting you enter the building.' },
            'Jest': { summary: 'Testing Framework', pros: ['Fast', 'Snapshot'], cons: ['Config'], useCases: ['Unit testing'], analogy: 'Like a quality inspector providing a checklist for every part made.' },
            'Cypress': { summary: 'E2E Testing', pros: ['Visual', 'Easy'], cons: ['Slow'], useCases: ['E2E testing'], analogy: 'Like a secret shopper. It pretends to be a user and tests the whole store experience.' },
            'SonarQube': { summary: 'Code Quality', pros: ['Comprehensive', 'Visual'], cons: ['Setup'], useCases: ['CI/CD'], analogy: 'Like a building inspector. Checks if your code foundation is rotting or has safety violations.' },
            'k6': { summary: 'Load Testing', pros: ['Scriptable', 'Fast'], cons: ['CLI only'], useCases: ['Performance'], analogy: 'Like a stress test. Puts 1000 sandbags on a bridge to see if it collapses.' },
            'Htmx': { summary: 'High Power Tools for HTML', pros: ['Simplicity', 'No build step', 'Backend agnostic'], cons: ['Not for complex offline apps', 'Different mental model'], useCases: ['Server-driven apps', 'Internal tools'], analogy: 'Like upgrading your HTML with a jetpack. It gives simple HTML pages the power of a complex app.' },
            'Tailwind CSS': { summary: 'Utility-first CSS framework', pros: ['Speed of development', 'Consistency', 'Customizable'], cons: ['Ugly HTML class strings', 'Learning curve'], useCases: ['Modern web apps', 'Design systems'], analogy: 'Like painting by numbers. You use pre-made colors (classes) to paint quickly without mixing paint yourself.' },
            'Supabase': { summary: 'Open Source Firebase Alternative', pros: ['Postgres power', 'Realtime', 'Generated API'], cons: ['Complex queries can be tricky', 'Hosting costs'], useCases: ['SaaS MVPs', 'Real-time apps'], analogy: 'Like Firebase but with SQL super powers.' },
            'Stripe': { summary: 'Financial infrastructure for the internet', pros: ['World-class API', 'Reliable', 'Great docs'], cons: ['Fees', 'Account storage reqs'], useCases: ['E-commerce', 'SaaS Subscriptions'], analogy: 'The payment processor of the internet.' },
        },
        newProject: 'New Project Setup',
        chooseStarter: 'Choose a starter kit to begin your journey',
        skip: 'Skip',
        blankCanvas: 'Blank Canvas',
        startScratch: 'Start from scratch',
        templates: {
            landing: { name: 'Landing Page', desc: 'Marketing site with high conversion focus' },
            crm: { name: 'CRM System', desc: 'Admin dashboard for customer management' },
            game: { name: 'Mini Game', desc: 'Web-based game logic loop' },
            mindmap: { name: 'Mind Map', desc: 'Central idea with radiating branches' },
            flowchart: { name: 'Flowchart', desc: 'Process logic with decision points' },
            sitemap: { name: 'Sitemap', desc: 'Hierarchical website structure' },
        },
    },
    zh: {
        toolbox: '工具箱',
        dragTip: '拖曳項目到畫布上',
        categories: {
            frontend: '前端開發',
            backend: '後端系統',
            database: '資料庫',
            security: '資安防護',
            quality: '測試品質',
            workflow: '互動流程',
        },
        uiDescriptions: {
            container: '用於包裝相關元件。場景：頁面區塊、表單群組、卡片佈局。',
            card: '有邊框的內容區塊。場景：產品卡片、使用者資料、儀表板小工具。',
            divider: '視覺分隔線。場景：區塊分隔、選單分線、列表分隔。',
            navbar: '頂部導航欄。場景：網站主導航、應用程式頂部。',
            sidebar: '側邊導航面板。場景：儀表板選單、設定導航、篩選器。',
            tabs: '分頁切換。場景：設定頁面、產品詳情、多步驟表單。',
            breadcrumb: '路徑導航（如「首頁 > 分類 > 詳情」）。場景：電商、文件、檔案管理。',
            button_primary: '主要操作按鈕。場景：提交、儲存、確認、立即購買。',
            button_secondary: '次要操作按鈕。場景：取消、返回、了解更多。',
            input_text: '文字輸入欄。場景：姓名、Email、地址輸入。',
            input_search: '搜尋框。場景：站內搜尋、清單篩選、產品查詢。',
            select: '下拉選單。場景：國家選擇、分類、排序方式。',
            checkbox: '多選框。場景：篩選條件、同意條款、功能開關。',
            switch: '開關切換。場景：深色模式、通知開關、設定啟用。',
            slider: '範圍選擇器。場景：價格範圍、音量控制、評分篩選。',
            image: '圖片區塊。場景：產品照片、頭像、Banner、相簿。',
            table: '資料表格。場景：訂單列表、會員管理、分析數據。',
            list: '項目列表。場景：選單、功能列表、步驟、留言。',
            avatar: '使用者頭像。場景：個人圖示、團隊成員、留言者。',
            tag: '分類標籤。場景：文章標籤、產品分類、狀態標記。',
            badge: '數量/狀態指示。場景：通知數量、新項目、在線狀態。',
            modal: '彈出對話框。場景：確認操作、表單填寫、詳細檢視。',
            alert: '重要訊息框。場景：錯誤、警告、成功提示、資訊通知。',
            toast: '浮動通知。場景：儲存確認、操作回饋、更新提示。',
            trigger: '事件觸發器。場景：按鈕點擊、表單提交、頁面載入。',
            logic: '條件判斷。場景：if/else 決策、資料驗證、路由分支。',
            action: '流程輸出。場景：API 呼叫、頁面跳轉、資料更新。',
        },
        attributes: {
            mainPage: '主頁面',
            subPage: '子頁面',
            modal: '彈窗',
            alert: '警告與提示',
            component: '獨立元件',
            trigger: '觸發事件',
            logic: '邏輯處理',
            backend: '後端服務',
            database: '資料庫',
        },
        variants: {
            solid: '實心風格',
            outline: '邊框風格',
            ghost: '幽靈風格',
            link: '連結風格',
            card: '卡片',
            window: '視窗',
            section: '區塊',
            circle: '圓形',
            pill: '膠囊形',
        },
        edit: {
            title: '標題',
            description: '描述說明',
            attribute: '屬性分類',
            variant: '外觀變體',
            color: '主題顏色',
        },
        uiComponents: {
            title: 'UI 元件庫',
            layout: '佈局與容器',
            ui_nav: '導覽元件',
            buttons: '按鈕與控制',
            inputs: '表單與輸入',
            display: '資料展示',
            ui_feedback: '回饋與通知',
            items: {
                container: '容器框架',
                card: '資訊卡片',
                button_primary: '主要按鈕',
                button_secondary: '次要按鈕',
                input_text: '文字輸入框',
                input_search: '搜尋欄',
                image: '圖片佔位符',
                divider: '分隔線',
                navbar: '導航欄',
                sidebar: '側邊欄',
                tabs: '分頁標籤',
                breadcrumb: '麵包屑',
                modal: '對話視窗',
                alert: '警告框',
                toast: '提示訊息',
                checkbox: '核取方塊',
                radio: '單選按鈕',
                switch: '開關',
                select: '下拉選單',
                slider: '滑桿',
                table: '表格',
                list: '列表',
                tag: '標籤',
                avatar: '頭像',
                badge: '數字標記',
                trigger: '觸發器',
                logic: '邏輯',
                action: '動作',
            }
        },
        techDetails: {
            'React': {
                summary: '用於構建用戶界面的 JavaScript 庫',
                pros: ['組件化架構，重用性高', '生態系極其豐富', 'Virtual DOM 效能優異'],
                cons: ['學習曲線較陡峭 (Hook, JSX)', '需搭配其他庫 (Router, Redux) 才能完整', '更新頻繁，最佳實踐變動快'],
                useCases: ['單頁應用程式 (SPA)', '複雜的互動儀表板', '大型社群平台'],
                analogy: '就像玩樂高積木 (LEGO)。你把一個個小積木 (元件) 拼起來，最後就變成了一座城堡 (網站)。',
                details: '為什麼選擇 React？ 因為「生態系」。\n\nReact 是目前世界上最流行的前端工具。這意味著無論你遇到什麼從零開始的問題，網路上一定有人解決過，而且有現成的套件可以用。就像你要蓋房子，React 不只給你磚塊，還給你整套的窗戶、門、甚至家具型錄。\n\n• React vs Vue: React 更像寫程式，自由度極高；Vue 更像寫網頁，對新手更友善一點，但 React 工作機會最多。\n• 學習建議：先學好 JavaScript 的基礎 (ES6)，再來學 React 會事半功倍。'
            },
            'Vue': {
                summary: '漸進式 JavaScript 框架',
                pros: ['容易上手，文檔友善', '雙向綁定方便開發', '效能輕量'],
                cons: ['生態系較 React 小', '企業級大型應用案例較少'],
                useCases: ['中小型專案', '快速原型開發', '漸進式重構舊專案'],
                analogy: '就像一個精裝修的公寓。它已經幫你準備好好用的家具 (路由、狀態管理)，你可以直接拎包入住，不用自己從頭裝潢。',
                details: '為什麼選擇 Vue？ 因為「優雅且好上手」。\n\nVue 的設計哲學是「漸進式」，你可以只在網頁的一個小角落用它，也可以用它做整個大網站。它的寫法非常直覺，HTML、CSS、JS 分得很清楚，不會像 React 那樣全部混在一起，對於習慣傳統網頁開發的人來說，Vue 就像回家一樣舒適。\n\n• Vue vs React: 如果你是接案公司或追求開發速度，Vue 通常比較快；如果你想進跨國大公司，React 是標準配備。'
            },
            'Next.js': {
                summary: '基於 React 的全端框架',
                pros: ['支援伺服器端渲染 (SSR)', 'SEO 效果極佳', '內建路由與優化'],
                cons: ['框架限制較多 (Opinionated)', 'Vercel 部署成本', '需了解 Server Component 概念'],
                useCases: ['電商網站', '內容型網站 (部落格、新聞)', '重視 SEO 的應用'],
                analogy: '就像是已經蓋好的透天厝。基於 React (樂高)，但它連牆壁、水電管線都幫你配置好了，讓你的網站跑得跟飛的一樣。',
                details: '為什麼選擇 Next.js？ 因為「SEO 與效能」。\n\n標準的 React 網頁一開始是全白的，要等 JavaScript 下載完才會顯示內容 (CSR)，這對 Google 搜尋引擎 (SEO) 不太友善。Next.js 解決了這個問題，它在伺服器端就把網頁「畫」好了 (SSR)，使用者一進來馬上看到內容，體驗極佳。\n\n• 適合誰：如果你要用 React 做一個公開的、需要被搜尋到的網站 (如官網、電商)，Next.js 幾乎是唯一選擇。'
            },
            'Angular': {
                summary: 'Google 開發的網頁應用程式平台',
                pros: ['功能大滿配 (Full-featured)', '原生 TypeScript 支援', '適合大型團隊協作'],
                cons: ['學習曲線極陡', '程式碼較為冗長', 'Bundle Size 較大'],
                useCases: ['企業級內部系統', '大型管理後台'],
                analogy: '就像是一個設備齊全的大型工廠。因為功能太強大，裡面有太多按鈕和拉桿，新手可能需要花很久時間學習操作手冊。',
                details: '為什麼選擇 Angular？ 因為「標準化」。\n\nAngular 規定了你該怎麼寫程式，不能隨便亂寫。這在幾百人的大團隊裡非常重要，因為這保證了不管誰寫的程式碼看起來都一樣。銀行、保險業喜歡用 Angular，因為它嚴謹、穩定，而且是 Google 維護的。\n\n• 新手注意：學習門檻很高，除非工作需要，否則不建議作為第一個框架學習。'
            },
            'Svelte': {
                summary: '編譯型的現代前端框架',
                pros: ['無 Virtual DOM', '真正的 Reactivity', '程式碼更少'],
                cons: ['社群較小', '第三方套件較少'],
                useCases: ['高效能應用', '嵌入式系統', '互動式圖表'],
                analogy: '就像一台 3D 印表機。它在出廠前就把你的設計圖 (程式碼) 印成實體，所以運作時不需要隨身帶一個建築工班 (Virtual DOM)。',
                details: '為什麼選擇 Svelte？ 因為「簡單純粹」。\n\nSvelte 回歸了網頁開發的本質，你寫的程式碼非常少，但功能卻很強大。它沒有 React 那麼多複雜的概念 (如 Hook 依賴)，效能卻往往更好。它是近年來開發者滿意度最高的框架之一。\n\n• 缺點：工作機會目前比 React/Vue 少很多，比較適合作為個人專案的選擇。'
            },
            'Node.js': {
                summary: '基於 Chrome V8 引擎的 JavaScript 執行環境',
                pros: ['前後端語言統一 (JS/TS)', '高併發處理能力 (Async I/O)', 'NPM 套件庫龐大'],
                cons: ['不適合 CPU 密集型運算', '回調地獄 (雖已有 Async/Await)', '標準庫不如 Java/Go 完整'],
                useCases: ['即時通訊應用', 'REST/GraphQL API', '微服務架構'],
                analogy: '就像一個超級快手服務生。他可以同時服務好幾桌客人 (請求)，點完菜就馬上去下一桌，完全不會因為等廚房出菜而發呆。',
                details: '為什麼選擇 Node.js？ 因為「全端通吃」。\n\n如果你已經學會了 JavaScript (前端)，那你只需要花一點點時間就能用 Node.js 寫後端。這讓一個人就能完成整個網站 (全端開發)。它的特長是處理「大量的小請求」，比如聊天室、即時通知，非常高效。\n\n• 它是什麼：它不是語言，而是一個讓 JavaScript 可以跑在伺服器上的環境。'
            },
            'Python': {
                summary: '語法簡潔且功能強大的程式語言',
                pros: ['語法接近自然語言，易讀', 'AI/Data 領域霸主', '應用範圍廣'],
                cons: ['執行速度較慢', 'GIL 限制多執行緒效能', '行動端開發較弱'],
                useCases: ['資料科學與分析', 'AI/機器學習後端', '自動化腳本'],
                analogy: '就像說英語。它的語法非常接近人類語言，是目前跟電腦溝通最簡單的方式，特別是科學家們的最愛。',
                details: '為什麼選擇 Python？ 因為「無所不能」。\n\n想做 AI？用 Python。想爬蟲？用 Python。想分析股票？用 Python。Python 的程式碼非常像英文，好讀好寫，是全世界最受歡迎的入門語言。\n\n• Python vs Node.js: 如果你要做的是 AI 或數據分析，選 Python；如果你要做高併發的網站後端，Node.js 可能略勝一籌。'
            },
            'Go': {
                summary: 'Google 開發的高效能系統語言',
                pros: ['編譯速度快', '並發處理強大 (Goroutines)', '部署簡單 (單一二進制檔)'],
                cons: ['生態系不如 Java/Node 成熟', '簡潔語法有時顯得繁瑣', '泛型支援較晚'],
                useCases: ['高效能後端服務', '雲原生工具 (Docker/K8s)', '微服務'],
                analogy: '就像Google設計的高鐵系統。為了快速、穩定地運送大量人流 (資料) 而生，結構簡單但極其高效。',
                details: '為什麼選擇 Go？ 因為「雲端時代的 C 語言」。\n\nGo 是為了現代雲端伺服器設計的。它編譯出來的檔案很小，跑得非常快，而且可以同時處理成千上萬個連線 (高併發) 而不費力。Docker 和 Kubernetes 這些雲端大都是用 Go 寫的。\n\n• 適合誰：追求極致效能的後端工程師，或者想寫區塊鏈、微服務的人。'
            },
            'Java': {
                summary: '跨平台的物件導向程式語言',
                pros: ['生態系龐大', '效能穩定', '多執行緒支援佳'],
                cons: ['語法冗長', '記憶體消耗大', '啟動時間慢'],
                useCases: ['企業級後端', 'Android App', '大型系統'],
                analogy: '就像一台重型卡車。雖然啟動慢，跑起來也不像跑車那麼輕快，但它能穩定地載運巨量貨物穿越任何地形。',
                details: '為什麼選擇 Java？ 因為「穩定與就業」。\n\nJava 已經流行了 20 年，幾乎所有的大銀行、保險公司、舊系統都是用 Java 寫的。雖然現在看起來有點老氣、寫起來很囉唆，但它的就業市場非常巨大且穩定。\n\n• 學習建議：如果你想進大型傳統企業，Java 是必備技能。'
            },
            'PHP': {
                summary: '廣泛使用的網頁後端腳本語言',
                pros: ['部署容易', '社群龐大', '適合中小型網站'],
                cons: ['API 設計不一致', '安全性歷史紀錄較差', '效能瓶頸'],
                useCases: ['內容型網站', 'WordPress', '快速開發'],
                analogy: '就像是網頁界的瑞士刀。隨手可得，你要切水果、開瓶子都能用，但如果要蓋摩天大樓，可能不是最合適的工具。',
                details: '為什麼選擇 PHP？ 因為「活著」。\n\n網路上 70% 的網站 (包括 WordPress) 都是用 PHP 跑的。買個便宜的虛擬主機，把 PHP 檔案丟上去就能跑，這種便利性至今無人能敵。對於接案、做形象官網來說，PHP 依然是王者。\n\n• 現況：現代 PHP (Laravel) 已經變得非常優雅且強大，不要被舊印象騙了。'
            },
            'PostgreSQL': {
                summary: '強大且開源的關聯式資料庫系統',
                pros: ['功能超群 (JSON, GIS)', 'ACID 事務支援完整', '穩定可靠'],
                cons: ['設定與優化較複雜', '簡單讀取效能可能輸 MySQL', '學習門檻較高'],
                useCases: ['複雜資料模型', '金融系統', '地理資訊系統'],
                analogy: '就像一個超巨大的國家檔案館。無論資料多複雜、多重要，它都能完美分類、保存，絕不會弄丟任何一張紙。',
                details: '為什麼選擇 PostgreSQL？ 因為「先進」。\n\n它是目前世界上最先進的開源資料庫。它不只能存表格 (關聯式)，還能存 JSON (NoSQL)，甚至能存地圖座標 (GIS)。如果你不知道選哪個資料庫，選 PostgreSQL 通常不會錯，因為它能陪你的專案從小長到大。'
            },
            'MySQL': { summary: '最流行的開源資料庫', pros: ['流行', '快速'], cons: ['功能特性'], useCases: ['一般 Web 應用'], analogy: '就像辦公室的標準檔案櫃。每個人都知道怎麼用，存取速度快，是大家最習慣的選擇。' },
            'MongoDB': { summary: 'NoSQL 資料庫首選', pros: ['彈性', '可擴展'], cons: ['交易支援'], useCases: ['大數據'], analogy: '就像一個可以隨意丟東西的大桌子。你不需要先把文件分類好，直接把整疊紙 (JSON) 丟上去就行。', details: '為什麼選擇 MongoDB？ 因為「靈活」。\n\n傳統資料庫 (SQL) 在存資料前要先定義好表格格式，這很麻煩。MongoDB (NoSQL) 就像筆記本，你想寫什麼就寫什麼，格式隨時可以改。這對於需求變來變去的新創產品開發非常方便。' },
            'Firebase': { summary: 'Google 後端服務平台', pros: ['即時', '簡單'], cons: ['被綁定'], useCases: ['行動應用'], analogy: '就像住飯店。你只要 Check-in，打掃、保全、甚至客房服務 (後端功能) 飯店都幫你包辦好了。', details: '為什麼選擇 Firebase？ 因為「不用寫後端」。\n\nFirebase 把資料庫、登入系統、主機都包好了。你做 App 的時候，不用請後端工程師，前端直接呼叫 Firebase 就能存資料。是開發 MVP (最小可行性產品) 的神器。' },
            'Redis': { summary: '記憶體快取資料庫', pros: ['極快', '簡單'], cons: ['僅限記憶體'], useCases: ['快取'], analogy: '就像電腦螢幕上的便利貼。讀取速度超快，一眼就看到，但寫不下太多東西，而且電腦關機就不見了。' },
            'OAuth 2.0': { summary: '授權標準協定', pros: ['標準', '安全'], cons: ['複雜'], useCases: ['授權'], analogy: '就像飯店的房卡。它讓你可以進入特定的房間 (資料)，但不會把整棟飯店的萬能鑰匙交給你。' },
            'JWT': { summary: 'JSON Web Token', pros: ['無狀態', '可攜'], cons: ['撤銷困難'], useCases: ['API 驗證'], analogy: '就像護照上的入境章。證明了你的身份和停留期限，你去任何景點 (API) 都不用再打電話回大使館確認。' },
            'SSL/HTTPS': { summary: '安全加密協定', pros: ['加密', '信任'], cons: ['憑證管理'], useCases: ['安全傳輸'], analogy: '就像運鈔車。確保你的錢 (資料) 在運送過程中，就算被搶匪攔截，他們也打不開箱子。' },
            'WAF': { summary: '網頁防火牆', pros: ['保護', '規則'], cons: ['設定'], useCases: ['安全防護'], analogy: '就像大樓門口的保全。他會檢查每個人的證件和包包，把可疑份子擋在門外。' },
            'Jest': { summary: 'JS 測試框架', pros: ['快速', '快照'], cons: ['設定'], useCases: ['單元測試'], analogy: '就像工廠的品管員。他拿著一張檢查表，確認每一個零件出廠前都是正常的。' },
            'Cypress': { summary: '前端 E2E 測試', pros: ['可視化', '易用'], cons: ['慢'], useCases: ['E2E 測試'], analogy: '就像神秘客。他假裝成一般顧客 (使用者)，實際把整個購物流程走一遍，看有沒有問題。' },
            'SonarQube': { summary: '程式碼品質檢測', pros: ['全面', '圖表'], cons: ['架設'], useCases: ['CI/CD'], analogy: '就像房屋驗收員。他會拿著儀器詳細檢查你的房子 (程式碼)，看有沒有漏水、管線老舊 (Bug) 的問題。' },
            'k6': { summary: '負載測試工具', pros: ['腳本化', '快'], cons: ['CLI'], useCases: ['效能測試'], analogy: '就像壓力測試。把一千包水泥放在橋上，看看橋會不會斷掉。' },
            'Htmx': { summary: 'HTML 的超能力工具', pros: ['極簡', '無需 Build', '後端無關'], cons: ['不適合重度離線應用', '需改變設計思維'], useCases: ['伺服器驅動應用', '內部管理系統'], analogy: '就像幫 HTML 裝上噴射背包。讓原本只能走路的靜態網頁，瞬間擁有飛行的能力。' },
            'Tailwind CSS': { summary: '原子化 CSS 框架', pros: ['開發速度快', '樣式統一', '高度客製化'], cons: ['HTML 類名很長', '需學習 Class 名稱'], useCases: ['現代網頁', '設計系統'], analogy: '就像數位著色畫。你不需要自己調色 (寫 CSS)，只要填入對應的號碼 (Class)，就能畫出漂亮的圖。', details: '為什麼選擇 Tailwind？ 因為「不想想名字」。\n\n以前寫 CSS 最痛苦的是要想 .wrapper-left-box 這種名字。Tailwind 讓你直接在 HTML 寫 class="p-4 bg-red-500"，所見即所得。剛開始會覺得 HTML 很亂，習慣後會快到回不去。' },
            'Supabase': { summary: '開源的 Firebase 替代品', pros: ['PostgreSQL 核心', '即時訂閱', '自動生成 API'], cons: ['複雜查詢有時較難', '託管成本'], useCases: ['SaaS MVP', '即時應用'], analogy: '就像是有超能力的 Firebase。一樣方便，但背後是強大的 SQL 資料庫在撐腰。' },
            'Stripe': { summary: '網路金流基礎設施', pros: ['頂級 API 體驗', '穩定可靠', '文件完善'], cons: ['手續費較高', '帳號審核嚴格'], useCases: ['電商', 'SaaS 訂閱制'], analogy: '網路世界的收銀機。不管你要收信用卡、Apple Pay，接上它就能開始做生意。' },
        },
        newProject: '建立新專案',
        chooseStarter: '選擇一個啟動模版開始您的旅程',
        skip: '跳過',
        blankCanvas: '空白畫布',
        startScratch: '從零開始',
        templates: {
            landing: { name: '行銷頁面 (Landing Page)', desc: '高轉換率的行銷網站動線' },
            crm: { name: 'CRM 後台系統', desc: '客戶管理與數據儀表板' },
            game: { name: '網頁小遊戲', desc: '包含遊戲迴圈的邏輯設計' },
            mindmap: { name: '心智圖', desc: '從核心發散的思維導圖' },
            flowchart: { name: '流程圖', desc: '包含判斷邏輯的步驟圖' },
            sitemap: { name: '網站地圖', desc: '階層式的網站架構規劃' },
        },
    },
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguage] = useState<Language>('zh');

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};


export type Language = 'zh' | 'en' | 'ja' | 'ko' | 'es';

export const TRANSLATIONS = {
  zh: {
    app_name: 'AI UI/UX 审计师',
    app_desc: 'Gemini 3 Pro',
    new_audit: '开始新审查',
    upload_btn: '上传截图',
    history_title: '历史记录',
    no_history: '暂无历史记录',
    no_history_desc: '您的审计报告将保存在这里',
    recent_history: '最近记录',
    clear_history: '清空历史',
    clear_history_confirm: '确定要清空所有历史记录吗？',
    select_category: '1. 选择设计分类',
    current_perspective: '当前视角',
    upload_title: '2. 上传设计稿',
    preview_title: '界面预览',
    report_title: '专家审计报告',
    click_upload: '点击或拖拽上传截图',
    upload_hint: '支持 JPG, PNG 格式。Gemini 3 Pro 将为您提供像素级的界面设计与交互逻辑分析。',
    upload_category_hint: (cat: string) => `上传【${cat}】截图`,
    ai_lens_hint: (cat: string) => `AI 专家将启用 “${cat}” 专属评审透镜，针对性分析您的设计。`,
    analyzing: '分析中...',
    analyzing_desc: '正在比对行业标准与视觉规范',
    status_generating: '生成中...',
    status_completed: '已完成',
    error_title: '分析遇到问题',
    retry_btn: '换张图片重试',
    issues_critical: '严重问题',
    issues_suggestions: '改进建议',
    issues_positive: '值得肯定',
    select_placeholder: '请选择分类并上传',
    history_review: '历史回顾',
    new_task: '新审计任务',
    ready: '准备就绪',
    help_title: '使用指南 & 应用场景',
    help_how_to: '如何使用',
    help_step_1: '选择一个与您设计最匹配的分类（如电商、游戏、B端后台等）。',
    help_step_2: '上传您的设计截图（支持网页、App、海报等）。',
    help_step_3: '等待 AI 专家从视觉、交互、体验等维度生成深度报告。',
    help_scenarios: '应用场景',
    help_scenario_1: '自查优化：设计师完成初稿后，快速发现被忽视的可用性问题。',
    help_scenario_2: '竞品分析：上传竞品截图，分析其优缺点。',
    help_scenario_3: '设计评审：在团队评审前获取客观的第三方视角。',
    close: '关闭',
    
    // Donation
    support_us: '支持我们',
    donate_title: '支持开发者',
    donate_desc: '本网站由个人开发，感谢支持。',
    donate_contact: '如有使用问题可反馈至邮箱',
    wechat_pay: '微信支付',
    alipay: '支付宝',
    
    // Categories
    cat_ui_ux: '网页/APP UI',
    cat_ecommerce: '电商/详情页',
    cat_dashboard: 'B端后台/仪表盘',
    cat_game: '游戏界面',
    cat_poster: '宣传/活动海报',
    cat_artistic: '艺术/创意海报',
    cat_branding: 'Logo/品牌标识',
    cat_social: '社媒配图',
    cat_video: '视频封面',
    cat_packaging: '产品包装',
    cat_presentation: 'PPT/演示文稿',
  },
  en: {
    app_name: 'AI UI/UX Auditor',
    app_desc: 'Gemini 3 Pro',
    new_audit: 'New Audit',
    upload_btn: 'Upload',
    history_title: 'History',
    no_history: 'No History',
    no_history_desc: 'Your audit reports will be saved here',
    recent_history: 'Recent',
    clear_history: 'Clear All',
    clear_history_confirm: 'Are you sure you want to clear all history?',
    select_category: '1. Select Category',
    current_perspective: 'Perspective',
    upload_title: '2. Upload Design',
    preview_title: 'Preview',
    report_title: 'Audit Report',
    click_upload: 'Click or Drag to Upload',
    upload_hint: 'JPG, PNG supported. Gemini 3 Pro provides pixel-level UI/UX analysis.',
    upload_category_hint: (cat: string) => `Upload [${cat}] Screenshot`,
    ai_lens_hint: (cat: string) => `AI Expert will apply the "${cat}" lens to analyze your design.`,
    analyzing: 'Analyzing...',
    analyzing_desc: 'Comparing with industry standards',
    status_generating: 'Generating...',
    status_completed: 'Done',
    error_title: 'Analysis Failed',
    retry_btn: 'Try Another Image',
    issues_critical: 'Critical Issues',
    issues_suggestions: 'Suggestions',
    issues_positive: 'Positives',
    select_placeholder: 'Select category & upload',
    history_review: 'Review',
    new_task: 'New Task',
    ready: 'Ready',
    help_title: 'Guide & Scenarios',
    help_how_to: 'How to Use',
    help_step_1: 'Select a design category that matches your work.',
    help_step_2: 'Upload a screenshot of your design.',
    help_step_3: 'Wait for the AI expert to generate a deep audit report.',
    help_scenarios: 'Scenarios',
    help_scenario_1: 'Self-Check: Quickly find usability issues before review.',
    help_scenario_2: 'Competitor Analysis: Analyze pros/cons of competitor apps.',
    help_scenario_3: 'Design Review: Get an objective third-party opinion.',
    close: 'Close',
    
    // Donation
    support_us: 'Support Us',
    donate_title: 'Support the Developer',
    donate_desc: 'Developed by an individual. Thanks for your support.',
    donate_contact: 'Feedback email:',
    wechat_pay: 'WeChat Pay',
    alipay: 'Alipay',

    // Categories
    cat_ui_ux: 'Web/App UI',
    cat_ecommerce: 'E-commerce',
    cat_dashboard: 'Dashboard/SaaS',
    cat_game: 'Game UI',
    cat_poster: 'Marketing Poster',
    cat_artistic: 'Artistic Poster',
    cat_branding: 'Logo/Branding',
    cat_social: 'Social Media',
    cat_video: 'Video Thumbnail',
    cat_packaging: 'Packaging',
    cat_presentation: 'Presentation',
  },
  ja: {
    app_name: 'AI UI/UX 監査',
    app_desc: 'Gemini 3 Pro',
    new_audit: '新規監査',
    upload_btn: 'アップロード',
    history_title: '履歴',
    no_history: '履歴なし',
    no_history_desc: 'レポートはここに保存されます',
    recent_history: '最近の履歴',
    clear_history: '履歴を消去',
    clear_history_confirm: 'すべての履歴を消去しますか？',
    select_category: '1. カテゴリ選択',
    current_perspective: '視点',
    upload_title: '2. デザインをアップロード',
    preview_title: 'プレビュー',
    report_title: '監査レポート',
    click_upload: 'クリックまたはドラッグ',
    upload_hint: 'JPG, PNG 対応。Gemini 3 Proがピクセルレベルで分析します。',
    upload_category_hint: (cat: string) => `【${cat}】の画像をアップロード`,
    ai_lens_hint: (cat: string) => `AIエキスパートが「${cat}」の視点で分析します。`,
    analyzing: '分析中...',
    analyzing_desc: '業界標準と比較しています',
    status_generating: '生成中...',
    status_completed: '完了',
    error_title: '分析エラー',
    retry_btn: '別の画像を試す',
    issues_critical: '重大な問題',
    issues_suggestions: '改善提案',
    issues_positive: '良い点',
    select_placeholder: 'カテゴリを選択してアップロード',
    history_review: '履歴レビュー',
    new_task: '新規タスク',
    ready: '準備完了',
    help_title: '使い方 & 利用シーン',
    help_how_to: '使い方',
    help_step_1: 'デザインに合ったカテゴリを選択します。',
    help_step_2: 'スクリーンショットをアップロードします。',
    help_step_3: 'AIが多角的なレポートを生成するのを待ちます。',
    help_scenarios: '利用シーン',
    help_scenario_1: 'セルフチェック：レビュー前にユーザビリティの問題を発見。',
    help_scenario_2: '競合分析：競合アプリの長所と短所を分析。',
    help_scenario_3: 'デザインレビュー：客観的な第三者の意見を取得。',
    close: '閉じる',
    
    // Donation
    support_us: 'サポート',
    donate_title: '開発者を支援',
    donate_desc: '個人開発です。ご支援ありがとうございます。',
    donate_contact: 'お問い合わせ:',
    wechat_pay: 'WeChat Pay',
    alipay: 'Alipay',

    // Categories
    cat_ui_ux: 'Web/App UI',
    cat_ecommerce: 'ECサイト',
    cat_dashboard: '管理画面/ダッシュボード',
    cat_game: 'ゲームUI',
    cat_poster: '広告ポスター',
    cat_artistic: 'アートポスター',
    cat_branding: 'ロゴ/ブランディング',
    cat_social: 'SNS画像',
    cat_video: '動画サムネイル',
    cat_packaging: 'パッケージ',
    cat_presentation: 'プレゼン資料',
  },
  ko: {
    app_name: 'AI UI/UX 감사',
    app_desc: 'Gemini 3 Pro',
    new_audit: '새 감사',
    upload_btn: '업로드',
    history_title: '히스토리',
    no_history: '기록 없음',
    no_history_desc: '감사 보고서가 여기에 저장됩니다',
    recent_history: '최근 기록',
    clear_history: '기록 지우기',
    clear_history_confirm: '모든 기록을 삭제하시겠습니까?',
    select_category: '1. 카테고리 선택',
    current_perspective: '관점',
    upload_title: '2. 디자인 업로드',
    preview_title: '미리보기',
    report_title: '감사 보고서',
    click_upload: '클릭 또는 드래그하여 업로드',
    upload_hint: 'JPG, PNG 지원. Gemini 3 Pro가 정밀 분석을 제공합니다.',
    upload_category_hint: (cat: string) => `[${cat}] 스크린샷 업로드`,
    ai_lens_hint: (cat: string) => `AI 전문가가 "${cat}" 관점에서 분석합니다.`,
    analyzing: '분석 중...',
    analyzing_desc: '업계 표준과 비교 중',
    status_generating: '생성 중...',
    status_completed: '완료',
    error_title: '분석 실패',
    retry_btn: '다시 시도',
    issues_critical: '치명적 문제',
    issues_suggestions: '개선 제안',
    issues_positive: '긍정적 요소',
    select_placeholder: '카테고리 선택 및 업로드',
    history_review: '기록 검토',
    new_task: '새 작업',
    ready: '준비 완료',
    help_title: '가이드 & 시나리오',
    help_how_to: '사용 방법',
    help_step_1: '디자인에 맞는 카테고리를 선택하세요.',
    help_step_2: '스크린샷을 업로드하세요.',
    help_step_3: 'AI 전문가의 심층 보고서를 기다리세요.',
    help_scenarios: '활용 시나리오',
    help_scenario_1: '자가 점검: 리뷰 전 사용성 문제를 빠르게 발견.',
    help_scenario_2: '경쟁사 분석: 경쟁 앱의 장단점 분석.',
    help_scenario_3: '디자인 리뷰: 객관적인 제3자의 의견 확보.',
    close: '닫기',
    
    // Donation
    support_us: '후원하기',
    donate_title: '개발자 후원',
    donate_desc: '개인 개발자입니다. 지원해 주셔서 감사합니다.',
    donate_contact: '문의 메일:',
    wechat_pay: '위챗 페이',
    alipay: '알리페이',

    // Categories
    cat_ui_ux: '웹/앱 UI',
    cat_ecommerce: '이커머스',
    cat_dashboard: '대시보드/SaaS',
    cat_game: '게임 UI',
    cat_poster: '홍보 포스터',
    cat_artistic: '아트 포스터',
    cat_branding: '로고/브랜딩',
    cat_social: 'SNS 이미지',
    cat_video: '비디오 썸네일',
    cat_packaging: '제품 패키지',
    cat_presentation: '프레젠테이션',
  },
  es: {
    app_name: 'Auditor IA UI/UX',
    app_desc: 'Gemini 3 Pro',
    new_audit: 'Nueva Auditoría',
    upload_btn: 'Subir',
    history_title: 'Historial',
    no_history: 'Sin Historial',
    no_history_desc: 'Tus informes se guardarán aquí',
    recent_history: 'Reciente',
    clear_history: 'Borrar Todo',
    clear_history_confirm: '¿Estás seguro de querer borrar todo el historial?',
    select_category: '1. Seleccionar Categoría',
    current_perspective: 'Perspectiva',
    upload_title: '2. Subir Diseño',
    preview_title: 'Vista Previa',
    report_title: 'Informe de Auditoría',
    click_upload: 'Clic o Arrastrar para Subir',
    upload_hint: 'Soporta JPG, PNG. Análisis UI/UX a nivel de píxel.',
    upload_category_hint: (cat: string) => `Subir captura de [${cat}]`,
    ai_lens_hint: (cat: string) => `El experto IA analizará usando la lente de "${cat}".`,
    analyzing: 'Analizando...',
    analyzing_desc: 'Comparando con estándares de la industria',
    status_generating: 'Generando...',
    status_completed: 'Listo',
    error_title: 'Error de Análisis',
    retry_btn: 'Intentar Otra Imagen',
    issues_critical: 'Problemas Críticos',
    issues_suggestions: 'Sugerencias',
    issues_positive: 'Puntos Positivos',
    select_placeholder: 'Selecciona categoría y sube',
    history_review: 'Revisión',
    new_task: 'Nueva Tarea',
    ready: 'Listo',
    help_title: 'Guía y Escenarios',
    help_how_to: 'Cómo Usar',
    help_step_1: 'Selecciona una categoría que coincida con tu diseño.',
    help_step_2: 'Sube una captura de pantalla de tu diseño.',
    help_step_3: 'Espera el informe detallado del experto IA.',
    help_scenarios: 'Escenarios',
    help_scenario_1: 'Auto-chequeo: Encuentra problemas de usabilidad rápidamente.',
    help_scenario_2: 'Análisis de Competencia: Analiza pros y contras.',
    help_scenario_3: 'Revisión de Diseño: Obtén una opinión objetiva.',
    close: 'Cerrar',
    
    // Donation
    support_us: 'Apóyanos',
    donate_title: 'Apoyar al Desarrollador',
    donate_desc: 'Desarrollado por un individuo. Gracias por tu apoyo.',
    donate_contact: 'Email de contacto:',
    wechat_pay: 'WeChat Pay',
    alipay: 'Alipay',

    // Categories
    cat_ui_ux: 'Web/App UI',
    cat_ecommerce: 'E-commerce',
    cat_dashboard: 'Dashboard/SaaS',
    cat_game: 'Game UI',
    cat_poster: 'Póster Marketing',
    cat_artistic: 'Póster Artístico',
    cat_branding: 'Logo/Branding',
    cat_social: 'Redes Sociales',
    cat_video: 'Miniatura de Video',
    cat_packaging: 'Packaging',
    cat_presentation: 'Presentación',
  }
};

export const DESIGN_CATEGORIES = [
  { id: 'UI/UX', labelKey: 'cat_ui_ux', icon: '📱' },
  { id: 'E-commerce', labelKey: 'cat_ecommerce', icon: '🛍️' },
  { id: 'Dashboard', labelKey: 'cat_dashboard', icon: '📊' },
  { id: 'Game UI', labelKey: 'cat_game', icon: '🎮' },
  { id: 'Marketing Poster', labelKey: 'cat_poster', icon: '📢' },
  { id: 'Artistic', labelKey: 'cat_artistic', icon: '🎨' },
  { id: 'Branding', labelKey: 'cat_branding', icon: '®️' },
  { id: 'Social Media', labelKey: 'cat_social', icon: '❤️' },
  { id: 'Video Thumbnail', labelKey: 'cat_video', icon: '▶️' },
  { id: 'Packaging', labelKey: 'cat_packaging', icon: '📦' },
  { id: 'Presentation', labelKey: 'cat_presentation', icon: '📽️' },
];

export const SYSTEM_INSTRUCTION = `
**角色设定 (Role):**
你是一位拥有20年经验的全能型视觉设计总监。你的眼睛就是一把尺，既能像工程师一样通过 WCAG 标准审查 UI，也能像艺术家一样剖析构图与美学。你的风格犀利、客观、直击要害，绝不使用模棱两可的废话。

**核心任务 (Task):**
用户将上传一张图片，并指定一个【设计分类】。
你必须基于该分类特有的“评审透镜 (Lens)”，对图片进行深度审计，并输出一份严格的 JSON 报告。

**设计分类与评审透镜 (Category Logic Map):**
你必须根据用户输入的分类，切换不同的评价标准：

1.  **电商/详情页 (E-commerce)**
    * *关注点:* 转化率 (CRO)、购买按钮 (CTA) 的显著性、信任感建立（评价/保障）、价格清晰度、紧迫感营造。
    * *禁忌:* 购买流程受阻、关键信息被折叠。

2.  **网页/APP UI (General UI/UX)**
    * *关注点:* 可用性 (Usability)、导航逻辑、无障碍设计 (Contrast/Size)、交互一致性、表单体验。
    * *禁忌:* 误触风险、层级混乱、操作反馈缺失。

3.  **B端后台/仪表盘 (Dashboard/SaaS)**
    * *关注点:* 信息密度控制、数据可视化规范、认知负荷管理、关键指标 (KPI) 可读性、筛选/搜索效率。
    * *禁忌:* 炫技导致数据难读、无效的装饰性图表。

4.  **游戏界面 (Game UI/HUD)**
    * *关注点:* 沉浸感与风格融合、HUD 视线遮挡率、状态反馈（血条/弹药）的直觉性、操作的人体工学。
    * *禁忌:* UI 风格跳戏、关键战斗信息不明显。

5.  **宣传/活动海报 (Marketing Poster)**
    * *关注点:* 3秒法则（吸睛度）、信息层级 (Headline > Body)、视觉动线引导、行动号召。
    * *禁忌:* 信息过载、主次不分、找不到重点。

6.  **艺术/创意海报 (Artistic/Creative)**
    * *关注点:* 构图创新、负空间运用、色彩情感表达、排版张力、打破常规。
    * *禁忌:* 平庸、缺乏情绪、过于保守。

7.  **Logo/品牌标识 (Branding)**
    * *关注点:* 缩放可识别性（极小尺寸下是否清晰）、记忆点、负形运用、单色表现力、品牌性格契合度。
    * *禁忌:* 细节过于复杂、含义不明、抄袭嫌疑。

8.  **社交媒体配图 (Social Media - RedBook/Instagram)**
    * *关注点:* 封面点击率 (CTR)、标题吸引力、生活感/氛围感、特定平台的审美趋势（如小红书的大字报风格）。
    * *禁忌:* 图片模糊、裁剪不当、由于字太小在手机上看不清。

9.  **YouTube/B站封面 (Video Thumbnail)**
    * *关注点:* 高对比度、夸张的情绪表达（面部特写）、文字钩子 (Hook)、背景与前景的分离度。
    * *禁忌:* 元素杂乱、没有焦点、无法引起好奇心。

10. **产品包装设计 (Packaging)**
    * *关注点:* 货架陈列优势 (Shelf Presence)、材质与工艺结合、法规信息清晰度、品牌识别区。
    * *禁忌:* 甚至看不出卖的是什么产品。

11. **PPT/演示文稿 (Presentation)**
    * *关注点:* 演讲辅助性、每页一个观点、字体大小（投影可读性）、图文对齐。
    * *禁忌:* 大段文字堆砌 (Wall of text)。

**输出格式 (Output Format):**
你必须**仅输出**一个纯净的 JSON 对象，包含以下字段。不要输出 \`\`\`json 标记。

{
  "audit_perspective": "你所使用的分类视角的名称",
  "critical_issues": [
    { "title": "简短标题", "description": "基于该分类视角的致命问题分析" }
  ],
  "improvement_suggestions": [
    { "title": "简短标题", "description": "具体的修改建议" }
  ],
  "positive_elements": [
    { "title": "简短标题", "description": "符合该分类审美标准的亮点" }
  ]
}
`;

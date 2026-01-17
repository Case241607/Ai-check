
import React, { useState, useRef, useEffect } from 'react';
import { analyzeUI } from './services/geminiService';
import { AuditReport, AuditType, HistoryItem } from './types';
import { fileToBase64, createThumbnail } from './utils/imageUtils';
import { saveImageToDB, getImageFromDB, clearImageDB, deleteImageFromDB } from './utils/db';
import AuditCard from './components/AuditCard';
import DonateModal from './components/DonateModal';
import { DESIGN_CATEGORIES, TRANSLATIONS, Language } from './constants';

// Skeleton Component for loading state
const SkeletonReport = () => (
  <div className="space-y-6 animate-pulse">
    {[1, 2, 3].map((i) => (
      <div key={i} className="space-y-3">
        <div className="h-6 w-32 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
        <div className="h-24 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700"></div>
        <div className="h-24 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700"></div>
      </div>
    ))}
  </div>
);

// Help Modal Component
const HelpModal = ({ isOpen, onClose, t }: { isOpen: boolean; onClose: () => void; t: any }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
          <span className="text-2xl">💡</span> {t.help_title}
        </h2>
        
        <div className="space-y-6 text-slate-600 dark:text-slate-300">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">{t.help_how_to}</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2"><span className="font-bold bg-slate-100 dark:bg-slate-800 px-1.5 rounded">1</span> {t.help_step_1}</li>
              <li className="flex gap-2"><span className="font-bold bg-slate-100 dark:bg-slate-800 px-1.5 rounded">2</span> {t.help_step_2}</li>
              <li className="flex gap-2"><span className="font-bold bg-slate-100 dark:bg-slate-800 px-1.5 rounded">3</span> {t.help_step_3}</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">{t.help_scenarios}</h3>
             <ul className="space-y-2 text-sm">
              <li className="flex gap-2">✅ {t.help_scenario_1}</li>
              <li className="flex gap-2">✅ {t.help_scenario_2}</li>
              <li className="flex gap-2">✅ {t.help_scenario_3}</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button onClick={onClose} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors">
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [report, setReport] = useState<AuditReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Category State
  const [selectedCategory, setSelectedCategory] = useState<string>(DESIGN_CATEGORIES[0].id);

  // History State
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Language & UI State
  const [currentLang, setCurrentLang] = useState<Language>('zh');
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  // Helper for translations
  const t = TRANSLATIONS[currentLang];

  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // --- PERSISTENCE LOGIC START ---

  // Load history metadata from LocalStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('audit_history_meta');
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load history metadata", e);
    }
  }, []);

  // Save history to LocalStorage whenever it changes
  useEffect(() => {
    const saveToStorage = (items: HistoryItem[]) => {
      try {
        // We only store the list with thumbnails in LocalStorage
        localStorage.setItem('audit_history_meta', JSON.stringify(items));
      } catch (e) {
        console.error("LocalStorage quota exceeded", e);
      }
    };
    saveToStorage(history);
  }, [history]);

  // --- PERSISTENCE LOGIC END ---

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const previewUrl = reader.result as string;
      setImagePreview(previewUrl);
      processFile(file, previewUrl);
    };
    reader.readAsDataURL(file);
    // Reset input so same file can be selected again
    event.target.value = '';
  };

  const processFile = async (file: File, previewUrl: string) => {
    setReport(null);
    setError(null);
    setLoading(true);
    setSelectedHistoryId(null);
    if (window.innerWidth < 1024) setIsSidebarOpen(false);

    try {
      // 1. Convert file to Base64 for API
      const base64Data = await fileToBase64(file);
      
      // 2. Call Gemini API
      const auditResult = await analyzeUI(base64Data, file.type, selectedCategory, currentLang);
      
      // 3. Create a unique ID
      const newId = Date.now().toString();
      
      // 4. Generate a small thumbnail for the sidebar (saves LocalStorage space)
      const thumbnailUrl = await createThumbnail(previewUrl, 80);

      // 5. Save the FULL image to IndexedDB (for reloading later)
      // Note: We remove the 'data:image/png;base64,' prefix inside saveImageToDB if passed raw, 
      // but here we pass the base64Data which is already clean from fileToBase64
      // We'll store it with prefix to make retrieval easier for <img src>
      await saveImageToDB(newId, previewUrl);

      setReport(auditResult);
      
      const newItem: HistoryItem = {
        id: newId,
        timestamp: Date.now(),
        thumbnail: thumbnailUrl, // Only store the tiny thumbnail in state/LS
        report: auditResult,
        category: selectedCategory
      };

      setHistory(prev => {
        const updated = [newItem, ...prev];
        // Keep last 20 items in metadata
        if (updated.length > 20) {
           // Cleanup old images from IndexedDB
           const toRemove = updated.slice(20);
           toRemove.forEach(item => deleteImageFromDB(item.id));
           return updated.slice(0, 20);
        }
        return updated;
      });
      setSelectedHistoryId(newItem.id);

    } catch (err: any) {
      setError(err.message || "Audit Failed.");
    } finally {
      setLoading(false);
    }
  };

  const loadHistoryItem = async (item: HistoryItem) => {
    setSelectedHistoryId(item.id);
    setLoading(true); // Show loading while fetching image from DB
    setError(null);

    // Set report immediately from metadata
    setReport(item.report);
    if (item.category) {
      setSelectedCategory(item.category);
    }

    try {
      // Fetch full res image from IndexedDB
      const fullImage = await getImageFromDB(item.id);
      
      if (fullImage) {
        setImagePreview(fullImage);
      } else {
        // Fallback to thumbnail if full image is missing/cleared
        setImagePreview(item.thumbnail);
        setError("Original image not found in cache. Showing thumbnail.");
      }
    } catch (e) {
      console.error("Error loading image from DB", e);
      setImagePreview(item.thumbnail);
    } finally {
      setLoading(false);
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      }
    }
  };

  const startNewAudit = () => {
    setImagePreview(null);
    setReport(null);
    setError(null);
    setSelectedHistoryId(null);
    triggerFileInput();
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(currentLang === 'en' ? 'en-US' : 'zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const currentCategoryLabel = (t[DESIGN_CATEGORIES.find(c => c.id === selectedCategory)?.labelKey as keyof typeof t] || selectedCategory) as string;

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans transition-colors duration-300">
      
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} t={t} />
      <DonateModal isOpen={isDonateOpen} onClose={() => setIsDonateOpen(false)} t={t} />

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Drawer on Mobile, Static on Desktop */}
      <aside className={`
        fixed lg:relative z-40 h-full w-[280px] shrink-0
        bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-r border-slate-200 dark:border-slate-800
        transform transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] flex flex-col shadow-2xl lg:shadow-none
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Sidebar Header */}
        <div className="h-16 flex items-center px-5 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight">{t.app_name}</h1>
              <p className="text-[10px] uppercase font-bold text-indigo-500 dark:text-indigo-400 tracking-wider">{t.app_desc}</p>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="ml-auto lg:hidden text-slate-400 hover:text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
           <button 
            onClick={startNewAudit}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 text-white py-3 rounded-xl font-medium transition-all shadow-lg shadow-slate-900/20 dark:shadow-indigo-600/20 active:scale-95 mb-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            {t.new_audit}
          </button>

          {history.length === 0 ? (
            <div className="text-center py-10 px-4">
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t.no_history}<br/>{t.no_history_desc}</p>
            </div>
          ) : (
            <>
              <h3 className="px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 mt-2">{t.recent_history}</h3>
              {history.map(item => (
                <div 
                  key={item.id}
                  onClick={() => loadHistoryItem(item)}
                  className={`group flex gap-3 p-3 rounded-xl cursor-pointer transition-all border ${
                    selectedHistoryId === item.id 
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-500/30 shadow-sm' 
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800 border-transparent'
                  }`}
                >
                  <div className="w-12 h-12 rounded-lg bg-slate-200 dark:bg-slate-700 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-600 relative">
                    <img src={item.thumbnail} alt="Thumbnail" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    {item.category && (
                      <div className="absolute bottom-0 right-0 bg-black/60 text-white text-[8px] px-1 py-0.5 rounded-tl-md">
                        {DESIGN_CATEGORIES.find(c => c.id === item.category)?.icon || '📄'}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 mb-0.5">{formatDate(item.timestamp)}</div>
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                      {item.report.critical_issues.length > 0 ? 
                        <span className="text-red-600 dark:text-red-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> {item.report.critical_issues.length} Issues
                        </span> : 
                        <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Good
                        </span>
                      }
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
           {history.length > 0 && (
            <button 
              onClick={async () => {
                if(window.confirm(t.clear_history_confirm)) {
                  setHistory([]);
                  localStorage.removeItem('audit_history_meta');
                  await clearImageDB(); // Clear IndexedDB as well
                  startNewAudit();
                }
              }}
              className="text-xs text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 flex items-center justify-center gap-2 w-full py-2 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              {t.clear_history}
            </button>
           )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full min-w-0 relative">
        {/* Top Header */}
        <header className="h-16 shrink-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 lg:px-8 z-20">
          <div className="flex items-center gap-3 lg:hidden">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </button>
            <span className="font-bold text-slate-900 dark:text-white">{t.app_name}</span>
          </div>

          <div className="hidden lg:flex items-center gap-4">
             <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                <span className={`px-2 py-0.5 rounded ${imagePreview ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 font-medium' : ''}`}>
                  {selectedHistoryId ? t.history_review : imagePreview ? t.new_task : t.select_placeholder}
                </span>
             </div>
          </div>

          <div className="flex items-center gap-2">
            
            <button 
              onClick={() => setIsDonateOpen(true)}
              className="p-2 lg:px-3 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors flex items-center gap-1.5"
              title={t.support_us}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
              <span className="text-xs font-bold uppercase hidden lg:block">{t.support_us}</span>
            </button>
            
            <div className="h-5 w-px bg-slate-200 dark:bg-slate-700 hidden lg:block mx-1"></div>

            {/* Language Switcher */}
            <div className="relative">
              <button 
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="p-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors flex items-center gap-1"
                title="Change Language"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                <span className="text-xs font-bold uppercase">{currentLang}</span>
              </button>
              
              {isLangMenuOpen && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setIsLangMenuOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden z-30 py-1">
                    {[
                      { code: 'zh', label: '简体中文' },
                      { code: 'en', label: 'English' },
                      { code: 'ja', label: '日本語' },
                      { code: 'ko', label: '한국어' },
                      { code: 'es', label: 'Español' },
                    ].map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setCurrentLang(lang.code as Language);
                          setIsLangMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 ${currentLang === lang.code ? 'text-indigo-600 font-bold bg-indigo-50 dark:bg-indigo-900/20' : 'text-slate-700 dark:text-slate-300'}`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Help Button */}
            <button 
              onClick={() => setIsHelpOpen(true)}
              className="p-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              title={t.help_title}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>

            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-full transition-all"
              title="切换主题"
            >
              {theme === 'light' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              )}
            </button>

            {/* Desktop Upload Button */}
            <button 
              onClick={startNewAudit}
              className="hidden lg:flex bg-slate-900 dark:bg-white hover:bg-slate-700 dark:hover:bg-slate-200 text-white dark:text-slate-900 text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-lg shadow-slate-500/10 active:scale-95 items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              {t.upload_btn}
            </button>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
            accept="image/*"
          />
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth">
          <div className="max-w-[1600px] mx-auto h-full flex flex-col lg:flex-row gap-6 lg:gap-8">
            
            {/* Left Column: Image Area */}
            <section className={`
               flex flex-col gap-6 transition-all duration-500 ease-in-out
               ${(report || loading) ? 'lg:w-[45%] xl:w-[40%]' : 'lg:w-full lg:max-w-4xl lg:mx-auto lg:mt-12'}
            `}>
              {/* Category Selector (Always visible unless viewing history/report) */}
              {!report && !loading && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="flex items-center justify-between mb-3 px-1">
                    <h2 className="text-lg font-bold tracking-tight">{t.select_category}</h2>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{t.current_perspective}: <span className="font-bold text-indigo-600 dark:text-indigo-400">{t[DESIGN_CATEGORIES.find(c => c.id === selectedCategory)?.labelKey as keyof typeof t] as string}</span></span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {DESIGN_CATEGORIES.map(category => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`
                          flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200
                          ${selectedCategory === category.id 
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20 scale-[1.02]' 
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'}
                        `}
                      >
                        <span className="text-xl">{category.icon}</span>
                        <span className={`text-sm font-medium ${selectedCategory === category.id ? 'text-white' : 'text-slate-700 dark:text-slate-200'}`}>
                          {t[category.labelKey as keyof typeof t] as string}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-4">
                 <div className="flex items-center justify-between px-1">
                  <h2 className="text-lg font-bold tracking-tight">{report ? t.preview_title : t.upload_title}</h2>
                </div>
                
                <div 
                  className={`
                    relative group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border-2 border-dashed border-slate-300 dark:border-slate-700 
                    transition-all duration-300 flex items-center justify-center shadow-sm
                    ${!imagePreview ? 'hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 cursor-pointer min-h-[300px] lg:min-h-[320px]' : 'border-transparent dark:border-transparent bg-slate-900 dark:bg-black min-h-[200px] lg:h-[calc(100vh-340px)]'}
                  `}
                  onClick={!imagePreview ? triggerFileInput : undefined}
                >
                  {imagePreview ? (
                    <div className="w-full h-full p-2 lg:p-4 flex items-center justify-center relative">
                       <div className="absolute inset-0 bg-slate-100/5 dark:bg-slate-800/20 pattern-grid-lg opacity-20 pointer-events-none" />
                       <img src={imagePreview} alt="UI 截图" className="max-w-full max-h-full object-contain shadow-2xl rounded-lg relative z-10" />
                    </div>
                  ) : (
                    <div className="text-center p-8 lg:p-12">
                      <div className="w-16 h-16 bg-gradient-to-tr from-indigo-100 to-purple-100 dark:from-slate-700 dark:to-slate-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600 dark:text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                        {(t.upload_category_hint as (cat: string) => string)(currentCategoryLabel)}
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">
                        {(t.ai_lens_hint as (cat: string) => string)(currentCategoryLabel)}
                      </p>
                    </div>
                  )}
                  
                  {loading && (
                    <div className="absolute inset-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center z-20">
                      <div className="relative w-20 h-20 mb-6">
                        <div className="absolute inset-0 border-4 border-slate-200 dark:border-slate-700 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl">{DESIGN_CATEGORIES.find(c => c.id === selectedCategory)?.icon}</span>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">
                         {t.analyzing}
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm">{t.analyzing_desc}</p>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Right Column: Audit Results */}
            {(report || loading) && (
              <section className="flex flex-col gap-4 flex-1 min-w-0 animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="flex items-center justify-between px-1">
                   <h2 className="text-lg font-bold tracking-tight">{t.report_title}</h2>
                   <div className="flex gap-2">
                     <span className="flex h-2 w-2 relative mt-2">
                       <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${loading ? 'bg-indigo-400' : 'hidden'}`}></span>
                       <span className={`relative inline-flex rounded-full h-2 w-2 ${loading ? 'bg-indigo-500' : 'bg-emerald-500'}`}></span>
                     </span>
                     <span className="text-xs font-medium text-slate-500 dark:text-slate-400 self-center">{loading ? t.status_generating : t.status_completed}</span>
                   </div>
                </div>

                <div className="relative">
                  {error ? (
                    <div className="p-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-center">
                      <div className="w-12 h-12 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600 dark:text-red-400">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </div>
                      <div className="text-red-800 dark:text-red-300 font-bold text-lg mb-2">{t.error_title}</div>
                      <p className="text-red-600 dark:text-red-400/80 text-sm mb-6">{error}</p>
                      <button 
                        onClick={triggerFileInput}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-red-600/20"
                      >
                        {t.retry_btn}
                      </button>
                    </div>
                  ) : loading ? (
                     <SkeletonReport />
                  ) : report ? (
                    <div className="space-y-8 pb-12">
                      {report.audit_perspective && (
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900/30 rounded-xl p-4 flex items-center gap-3">
                           <span className="text-2xl">{DESIGN_CATEGORIES.find(c => c.labelKey === report.audit_perspective || c.id === selectedCategory)?.icon || '👁️'}</span>
                           <div>
                             <p className="text-xs text-indigo-500 dark:text-indigo-400 font-bold uppercase tracking-wide">{t.current_perspective}</p>
                             <p className="text-indigo-900 dark:text-indigo-100 font-medium">{t[DESIGN_CATEGORIES.find(c => c.id === (report.audit_perspective || selectedCategory))?.labelKey as keyof typeof t] as string || report.audit_perspective}</p>
                           </div>
                        </div>
                      )}

                      {report.critical_issues.length > 0 && (
                        <div className="space-y-4">
                           <div className="flex items-center gap-2 sticky top-0 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur z-10 py-3 -mx-2 px-2 border-b border-transparent">
                             <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                               <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span>
                               {t.issues_critical}
                             </h3>
                             <span className="bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-[10px] font-bold px-2 py-0.5 rounded-full">{report.critical_issues.length}</span>
                           </div>
                           <div className="grid grid-cols-1 gap-4">
                              {report.critical_issues.map((item, idx) => (
                                <AuditCard key={`critical-${idx}`} item={item} type={AuditType.CRITICAL} />
                              ))}
                           </div>
                        </div>
                      )}

                      {report.improvement_suggestions.length > 0 && (
                        <div className="space-y-4">
                           <div className="flex items-center gap-2 sticky top-0 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur z-10 py-3 -mx-2 px-2">
                             <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                               <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]"></span>
                               {t.issues_suggestions}
                             </h3>
                             <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full">{report.improvement_suggestions.length}</span>
                           </div>
                           <div className="grid grid-cols-1 gap-4">
                              {report.improvement_suggestions.map((item, idx) => (
                                <AuditCard key={`suggest-${idx}`} item={item} type={AuditType.IMPROVEMENT} />
                              ))}
                           </div>
                        </div>
                      )}

                      {report.positive_elements.length > 0 && (
                        <div className="space-y-4">
                           <div className="flex items-center gap-2 sticky top-0 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur z-10 py-3 -mx-2 px-2">
                             <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                               <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
                               {t.issues_positive}
                             </h3>
                             <span className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full">{report.positive_elements.length}</span>
                           </div>
                           <div className="grid grid-cols-1 gap-4">
                              {report.positive_elements.map((item, idx) => (
                                <AuditCard key={`positive-${idx}`} item={item} type={AuditType.POSITIVE} />
                              ))}
                           </div>
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;

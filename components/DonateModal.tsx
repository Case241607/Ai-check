
import React from 'react';

interface DonateModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: any;
}

const DonateModal: React.FC<DonateModalProps> = ({ isOpen, onClose, t }) => {
  if (!isOpen) return null;

  // IMPORTANT: Replace these placeholders with the actual image paths or Base64 strings of your QR codes.
  // Example: import wechatQr from '../assets/wechat.jpg';
  const WECHAT_QR = "https://placehold.co/400x400/22c55e/ffffff?text=WeChat+Pay"; // REPLACE THIS
  const ALIPAY_QR = "https://placehold.co/400x400/3b82f6/ffffff?text=Alipay"; // REPLACE THIS

  return (
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" 
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 lg:p-10 shadow-2xl border border-slate-200 dark:border-slate-700 relative flex flex-col items-center" 
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-pink-100 dark:bg-pink-900/30 text-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-lg shadow-pink-500/20">
            🎁
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {t.donate_title}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-md mx-auto">
            {t.donate_desc}
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center w-full mb-8">
          {/* WeChat Pay */}
          <div className="flex flex-col items-center gap-3">
             <div className="w-48 h-48 lg:w-56 lg:h-56 bg-slate-100 dark:bg-slate-800 rounded-xl p-3 border border-slate-200 dark:border-slate-700 shadow-inner">
               <img 
                 src={WECHAT_QR} 
                 alt="WeChat Pay" 
                 className="w-full h-full object-contain rounded-lg mix-blend-multiply dark:mix-blend-normal" 
               />
             </div>
             <div className="flex items-center gap-2 text-[#09BB07] font-bold">
               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.5,14.5C6,14.5,4,13.2,4,11.3c0-1.9,2-3.8,4.5-3.8s4.5,1.9,4.5,3.8C13,13.2,11,14.5,8.5,14.5z M8.5,8.1 c-1.9,0-3.5,1.4-3.5,3.2c0,1.7,1.6,3.2,3.5,3.2c1.9,0,3.5-1.4,3.5-3.2C12,9.6,10.4,8.1,8.5,8.1z M6.9,10.4c-0.4,0-0.6-0.3-0.6-0.6 s0.3-0.6,0.6-0.6c0.4,0,0.6,0.3,0.6,0.6S7.2,10.4,6.9,10.4z M10.1,10.4c-0.4,0-0.6-0.3-0.6-0.6s0.3-0.6,0.6-0.6 c0.4,0,0.6,0.3,0.6,0.6S10.4,10.4,10.1,10.4z M16.5,17c-2.8,0-5-1.5-5-3.9c0-0.2,0-0.4,0.1-0.6c0.8,0.5,1.7,0.7,2.8,0.7 c3.3,0,6-2.2,6-5c0-0.3,0-0.6-0.1-0.9c1.9,0.8,3.2,2.4,3.2,4.3C23.5,14.5,20.4,17,16.5,17z M18.4,13.4c-0.4,0-0.8-0.3-0.8-0.8 c0-0.4,0.3-0.8,0.8-0.8c0.4,0,0.8,0.3,0.8,0.8C19.1,13,18.8,13.4,18.4,13.4z M14.6,13.4c-0.4,0-0.8-0.3-0.8-0.8 c0-0.4,0.3-0.8,0.8-0.8c0.4,0,0.8,0.3,0.8,0.8C15.3,13,15,13.4,14.6,13.4z"/></svg>
               {t.wechat_pay}
             </div>
          </div>

          {/* Alipay */}
          <div className="flex flex-col items-center gap-3">
             <div className="w-48 h-48 lg:w-56 lg:h-56 bg-slate-100 dark:bg-slate-800 rounded-xl p-3 border border-slate-200 dark:border-slate-700 shadow-inner">
               <img 
                 src={ALIPAY_QR} 
                 alt="Alipay" 
                 className="w-full h-full object-contain rounded-lg mix-blend-multiply dark:mix-blend-normal" 
               />
             </div>
             <div className="flex items-center gap-2 text-[#1678FF] font-bold">
               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6.2,6.7h11.6v2.1h-5.2c1.3,2.7,1.3,4.4,0.6,6.4c-0.7,2-3.1,3.4-6.3,3.7L5.7,16c2.2-0.2,3.7-0.9,4.2-2 c0.5-1.1,0.5-2.6-0.6-5.3H6.2V6.7z M20,17.9h-8v-2h8V17.9z M9.6,3h4.8v2.1H9.6V3z"/></svg>
               {t.alipay}
             </div>
          </div>
        </div>

        <div className="w-full pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t.donate_contact} <span className="font-medium text-slate-700 dark:text-slate-200 select-all">3276533901@qq.com</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DonateModal;

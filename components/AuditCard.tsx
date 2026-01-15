
import React from 'react';
import { AuditItem, AuditType } from '../types';

interface AuditCardProps {
  item: AuditItem;
  type: AuditType;
}

const AuditCard: React.FC<AuditCardProps> = ({ item, type }) => {
  const styles = {
    [AuditType.CRITICAL]: {
      container: "bg-red-50/80 dark:bg-red-900/10 border-red-200 dark:border-red-900/30",
      iconBg: "bg-red-100 dark:bg-red-900/30",
      iconColor: "text-red-600 dark:text-red-400",
      titleColor: "text-red-900 dark:text-red-200",
      textColor: "text-red-800/80 dark:text-red-200/70",
      badge: "严重问题"
    },
    [AuditType.IMPROVEMENT]: {
      container: "bg-amber-50/80 dark:bg-amber-900/10 border-amber-200 dark:border-amber-900/30",
      iconBg: "bg-amber-100 dark:bg-amber-900/30",
      iconColor: "text-amber-600 dark:text-amber-400",
      titleColor: "text-amber-900 dark:text-amber-200",
      textColor: "text-amber-800/80 dark:text-amber-200/70",
      badge: "改进建议"
    },
    [AuditType.POSITIVE]: {
      container: "bg-emerald-50/80 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-900/30",
      iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      titleColor: "text-emerald-900 dark:text-emerald-200",
      textColor: "text-emerald-800/80 dark:text-emerald-200/70",
      badge: "值得肯定"
    }
  };

  const currentStyle = styles[type];

  return (
    <div className={`
      relative p-5 rounded-2xl border backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5
      ${currentStyle.container}
    `}>
      <div className="flex items-start gap-3">
        <div className={`shrink-0 mt-0.5 w-6 h-6 rounded-full flex items-center justify-center ${currentStyle.iconBg} ${currentStyle.iconColor}`}>
           {type === AuditType.CRITICAL && (
             <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
           )}
           {type === AuditType.IMPROVEMENT && (
             <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
           )}
           {type === AuditType.POSITIVE && (
             <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
           )}
        </div>
        <div>
          <h3 className={`font-bold text-base mb-1.5 leading-snug ${currentStyle.titleColor}`}>{item.title}</h3>
          <p className={`text-sm leading-relaxed ${currentStyle.textColor}`}>{item.description}</p>
        </div>
      </div>
    </div>
  );
};

export default AuditCard;

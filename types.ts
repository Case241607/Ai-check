
export interface AuditItem {
  title: string;
  description: string;
}

export interface AuditReport {
  audit_perspective?: string;
  critical_issues: AuditItem[];
  improvement_suggestions: AuditItem[];
  positive_elements: AuditItem[];
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  thumbnail: string; // Small low-res base64 for sidebar list (LocalStorage)
  report: AuditReport;
  category?: string;
}

export enum AuditType {
  CRITICAL = 'critical',
  IMPROVEMENT = 'improvement',
  POSITIVE = 'positive'
}

export interface AuditItem {
  title: string;
  description: string;
}

export interface AuditReport {
  audit_perspective?: string; // New field for the lens used
  critical_issues: AuditItem[];
  improvement_suggestions: AuditItem[];
  positive_elements: AuditItem[];
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  imagePreview: string; // Data URL for the image
  report: AuditReport;
  category?: string; // Store the category used for this audit
}

export enum AuditType {
  CRITICAL = 'critical',
  IMPROVEMENT = 'improvement',
  POSITIVE = 'positive'
}

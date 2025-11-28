export type Role = 'TOP_MANAGEMENT' | 'HALAL_EXECUTIVE' | 'EXTERNAL_AUDITOR';

export interface User {
  id: number;
  name: string;
  role: Role;
  outletId?: number; // Optional because Top Management doesn't have a single outlet
  outletName?: string;
  avatar: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface OutletStats {
  id: number;
  name: string;
  readinessScore: number; // 0-100
  expiringItems: number;
  ncrs: number;
}

export interface ChartData {
  name: string;
  value: number;
  fill?: string;
}

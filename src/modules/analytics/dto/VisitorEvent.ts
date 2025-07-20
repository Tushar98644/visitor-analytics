export interface VisitorEvent {
  type: 'pageview' | 'click' | 'session_end';
  page: string;
  sessionId: string;
  timestamp: string;
  country: string;
  metadata?: Record<string, unknown>;
}
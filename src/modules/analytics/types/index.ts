export type EventType = 'pageview' | 'click' | 'session_end';

export interface VisitorEvent {
  type: EventType;
  page: string;
  sessionId: string;
  timestamp: string;
  country: string;
  metadata?: {
    device?: string;
    referrer?: string;
    [key: string]: any;
  };
}

// Analytics Types
export interface Analytics {
  totalActive: number;
  totalToday: number;
  pagesVisited: Record<string, number>;
  countriesCount: Record<string, number>;
}

export interface Session {
  sessionId: string;
  journey: string[];
  currentPage: string;
  duration: number;
  startTime: string;
  lastActivity: string;
  country: string;
  metadata?: Record<string, any>;
}

export interface VisitorUpdateEvent {
  type: 'visitor_update';
  data: {
    event: VisitorEvent;
    stats: Analytics;
  };
}

export interface UserConnectedEvent {
  type: 'user_connected';
  data: {
    totalDashboards: number;
    connectedAt: string;
  };
}

export interface UserDisconnectedEvent {
  type: 'user_disconnected';
  data: {
    totalDashboards: number;
  };
}

export interface SessionActivityEvent {
  type: 'session_activity';
  data: Session;
}

export interface AlertEvent {
  type: 'alert';
  data: {
    level: 'info' | 'warning' | 'milestone';
    message: string;
    details: Record<string, any>;
  };
}

export type ServerToClientEvent = 
  | VisitorUpdateEvent 
  | UserConnectedEvent 
  | UserDisconnectedEvent 
  | SessionActivityEvent 
  | AlertEvent;

export interface RequestDetailedStatsEvent {
  type: 'request_detailed_stats';
  filter?: {
    country?: string;
    page?: string;
  };
}

export interface TrackDashboardActionEvent {
  type: 'track_dashboard_action';
  action: string;
  details: Record<string, any>;
}

export type ClientToServerEvent = 
  | RequestDetailedStatsEvent 
  | TrackDashboardActionEvent;

export interface ExtendedWebSocket extends WebSocket {
  id: string;
  connectedAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface SummaryResponse {
  stats: Analytics;
  activeSessions: Session[];
  recentEvents: VisitorEvent[];
}
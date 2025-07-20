import { WebSocketServer, WebSocket } from "ws";
import { eventBus } from "../events/EventBus";
import { eventStore } from "../storage/EventStore";

interface ConnectedUser {
  ws: WebSocket;
  id: string;
  connectedAt: Date;
}

export class AnalyticsWebSocketServer {
  private wss: WebSocketServer;
  private connectedUsers = new Map<string, ConnectedUser>();
  private activeSessions = new Set<string>();

  constructor(port: number = 8080) {
    this.wss = new WebSocketServer({ port });
    this.setupConnectionHandling();
    this.setupEventListeners();
    this.startStatsUpdates();

    console.log(`WebSocket server listening on port ${port}`);
  }

  private setupConnectionHandling() {
    this.wss.on("connection", (ws) => {
      const userId = this.generateId();
      const user: ConnectedUser = {
        ws,
        id: userId,
        connectedAt: new Date(),
      };

      this.connectedUsers.set(userId, user);
      console.log(
        `User ${userId} connected. Total: ${this.connectedUsers.size}`
      );

      ws.send(
        JSON.stringify({
          type: "connected",
          data: { userId, timestamp: new Date().toISOString() },
        })
      );

      this.broadcastToAll({
        type: "user_connected",
        data: {
          userId,
          totalConnected: this.connectedUsers.size,
          timestamp: new Date().toISOString(),
        },
      });

      ws.on("message", (message) => {
        this.handleClientMessage(userId, JSON.parse(message.toString()));
      });

      ws.on("close", () => {
        this.connectedUsers.delete(userId);
        console.log(
          `User ${userId} disconnected. Total: ${this.connectedUsers.size}`
        );

        this.broadcastToAll({
          type: "user_disconnected",
          data: {
            userId,
            totalConnected: this.connectedUsers.size,
            timestamp: new Date().toISOString(),
          },
        });
      });
    });
  }

  private setupEventListeners() {
    eventBus.on("new_visitor_event", (message) => {
      this.activeSessions.add(message.data.sessionId);

      this.broadcastToAll({
        type: "session_activity",
        data: {
          event: message.data,
          sessionId: message.data.sessionId,
          timestamp: message.timestamp.toISOString(),
        },
      });
    });
  }

  private handleClientMessage(userId: string, data: any) {
    const user = this.connectedUsers.get(userId);
    if (!user) return;

    switch (data.type) {
      case "request_detailed_stats":
        const detailedStats = this.getDetailedStats();
        user.ws.send(
          JSON.stringify({
            type: "detailed_stats_response",
            data: detailedStats,
          })
        );
        break;

      case "track_dashboard_action":
        console.log(`Dashboard action: ${data.action} by user ${userId}`);
        break;
    }
  }

  private startStatsUpdates() {
    setInterval(() => {
      const stats = this.getCurrentStats();

      this.broadcastToAll({
        type: "visitor_update",
        data: {
          totalActive: this.activeSessions.size,
          totalToday: stats.totalToday,
          pagesVisited: stats.pagesVisited,
          connectedDashboards: this.connectedUsers.size,
          timestamp: new Date().toISOString(),
        },
      });

      if (Math.random() < 0.1) {
        this.activeSessions.clear();
      }
    }, 5000);
  }

  private getCurrentStats() {
    const pageViews = eventStore.getPageViews();
    console.log("the pageviews are:", pageViews.length);

    const today = new Date().toISOString().slice(0, 10);
    console.log("TODAY:", today);

    const todayViews = pageViews.filter((event) => {
      const eventDate = event.timestamp.slice(0, 10);
      console.log("EVENT DATE:", eventDate);
      return eventDate === today;
    });
    const pagesVisited = new Set(todayViews.map((event) => event.page));

    return {
      totalToday: todayViews.length,
      pagesVisited: Array.from(pagesVisited),
    };
  }

  private getDetailedStats() {
    const allEvents = eventStore.getAllEvents();
    return {
      totalEvents: allEvents.length,
      uniqueSessions: eventStore.getUniqueSessions().length,
      countries: eventStore.getCountriesStats(),
      recentEvents: allEvents.slice(-10),
    };
  }

  private broadcastToAll(message: any) {
    const payload = JSON.stringify(message);
    let activeConnections = 0;

    for (const [userId, user] of this.connectedUsers) {
      if (user.ws.readyState === WebSocket.OPEN) {
        try {
          user.ws.send(payload);
          activeConnections++;
        } catch (error) {
          console.error(`Failed to send to user ${userId}:`, error);
          this.connectedUsers.delete(userId);
        }
      } else {
        this.connectedUsers.delete(userId);
      }
    }
  }

  private generateId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
  }

  public getConnectionStats() {
    return {
      totalConnections: this.connectedUsers.size,
      totalEvents: eventStore.getEventCount(),
      activeSessions: this.activeSessions.size,
    };
  }
}

import { eventStore } from "@/storage/EventStore";

interface AnalyticsSummary {
  totalPageViews: number;
  uniqueSessions: number;
  topCountries: Array<{ country: string; count: number }>;
  totalEvents: number;
  lastUpdated: string;
}

export default class AnalyticsService {
  private cache: AnalyticsSummary | null = null;
  private cacheTimestamp: number = 0;
  private readonly CACHE_TTL = 30000;

  getSummary(): AnalyticsSummary & { totalToday: number } {
    const now = Date.now();

    if (this.cache && now - this.cacheTimestamp < this.CACHE_TTL) {
      return this.cache as AnalyticsSummary & { totalToday: number };
    }

    const pageViews = eventStore.getPageViews();
    const uniqueSessions = eventStore.getUniqueSessions();
    const countries = eventStore.getCountriesStats();

    const today = new Date().toISOString().slice(0, 10);
    const todayViews = pageViews.filter(
      (ev) => ev.timestamp.slice(0, 10) === today
    );

    const topCountries = Object.entries(countries)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const summary: AnalyticsSummary & { totalToday: number } = {
      totalPageViews: pageViews.length,
      uniqueSessions: uniqueSessions.length,
      topCountries,
      totalEvents: eventStore.getEventCount(),
      totalToday: todayViews.length,
      lastUpdated: new Date().toISOString(),
    };

    this.cache = summary;
    this.cacheTimestamp = now;

    return summary;
  }

  invalidateCache() {
    this.cache = null;
  }

  getSessionsData() {
    const sessions: Record<string, any> = {};
    const allEvents = eventStore.getAllEvents();

    allEvents.forEach((event) => {
      if (!sessions[event.sessionId]) {
        sessions[event.sessionId] = {
          sessionId: event.sessionId,
          country: event.country,
          pages: [],
          events: [],
          startTime: event.timestamp,
          lastActivity: event.timestamp,
        };
      }

      const session = sessions[event.sessionId];
      session.events.push({
        type: event.type,
        page: event.page,
        timestamp: event.timestamp,
      });

      if (event.type === "pageview") {
        session.pages.push(event.page);
      }

      session.lastActivity = event.timestamp;
    });

    return {
      sessions: Object.values(sessions),
      totalSessions: Object.keys(sessions).length,
    };
  }
}

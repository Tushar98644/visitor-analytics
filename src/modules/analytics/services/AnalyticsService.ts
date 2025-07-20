import redis from '@/config/redisClient';

interface AnalyticsSummary {
  totalPageViews: number;
  uniqueSessions: number;
  topCountries: Array<{ country: string; count: number }>;
  lastUpdated: string;
}

interface StreamEntry {
  id: string;
  message: Record<string, string>;
}

interface VisitorEvent {
  type: string;
  sessionId: string;
  country: string;
  [key: string]: string; 
}

export default class AnalyticsService {
  private readonly CACHE_KEY = 'analytics:summary';
  private readonly CACHE_TTL = 300;

  async getSummary(): Promise<AnalyticsSummary> {
    const cached = await redis.get(this.CACHE_KEY);
    if (cached) {
      return JSON.parse(cached) as AnalyticsSummary;
    }

    const summary = await this.computeSummary();
    
    await redis.setex(
      this.CACHE_KEY,
      this.CACHE_TTL,
      JSON.stringify(summary)
    );

    return summary;
  }

  private async computeSummary(): Promise<AnalyticsSummary> {
    const events = await redis.xRange('visitor-events', '-', '+') as StreamEntry[];
    
    const sessions = new Set<string>();
    const countries: Record<string, number> = {};
    let pageViews = 0;

    for (const entry of events) {
      const event = entry.message as VisitorEvent;
      
      if (event.type === 'pageview') pageViews++;
      sessions.add(event.sessionId);
      countries[event.country] = (countries[event.country] || 0) + 1;
    }

    const topCountries = Object.entries(countries)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalPageViews: pageViews,
      uniqueSessions: sessions.size,
      topCountries,
      lastUpdated: new Date().toISOString(),
    };
  }
}
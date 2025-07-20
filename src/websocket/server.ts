import { Server } from 'ws';
import type { WebSocket } from 'ws';
import { consumeEvents } from '@/modules/analytics/services/EventStreamConsumer';

const wss = new Server({ port: 8080 });
const clients = new Set<WebSocket>();

wss.on('connection', (ws) => {
  clients.add(ws);
  ws.on('close', () => clients.delete(ws));
});

consumeEvents((event) => {
  const payload = JSON.stringify(event);
  for (const ws of clients) {
    if (ws.readyState === ws.OPEN) {
      ws.send(payload);
    }
  }
});
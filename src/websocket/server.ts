import { Server } from 'ws';

const wss = new Server({ port: Number(process.env.PORT) || 8080 });

wss.on('connection', (ws) => {
  ws.on('message', (msg) => {
    console.log(msg);
  });

  ws.send('WebSocket connected');
});

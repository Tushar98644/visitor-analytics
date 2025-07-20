import express, { Request, Response } from "express";
import analyticsRoutes from "./modules/analytics/routes";
import { AnalyticsWebSocketServer } from "./websocket/server";
import path from "path";
import "dotenv/config";

const app = express();
app.use(express.json());

app.use(express.static("public"));

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/dashboard.html"));
});

app.use("/api", analyticsRoutes);

let wsServer: AnalyticsWebSocketServer;

app.get("/api/ws/stats", (req: Request, res: Response) => {
  if (wsServer) {
    res.json(wsServer.getConnectionStats());
  } else {
    res.status(503).json({ error: "WebSocket server not initialized" });
  }
});

const PORT = process.env.PORT || 3000;

async function startServer() {
  app.listen(PORT, () => console.log(`API up on ${PORT}`));
  wsServer = new AnalyticsWebSocketServer(8080);
}

startServer();

import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";

const Port = process.env.PORT;
const app = express();
app.use(cors());
app.use(express.json());

app.all("/api/auth/{*any}", toNodeHandler(auth));

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

httpServer.listen(Port, () => {
  console.log(`Server is running on http://localhost:${Port}`);
});

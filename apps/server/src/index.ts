import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import apiRoutes from "./routes/index.js";
import { errorHandler, notFoundHandler } from "./middleware/error-handler.middleware.js";

const Port = process.env.PORT;
const app = express();
app.use(cors());

// better-auth needs the raw (unparsed) body, so it must be mounted before express.json()
app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/api", apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

httpServer.listen(Port, () => {
  console.log(`Server is running on http://localhost:${Port}`);
});

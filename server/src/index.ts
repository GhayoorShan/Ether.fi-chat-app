import path from "path";
import http from "http";
import express from "express";
import { Server as SocketIO } from "socket.io";
import dotenv from "dotenv";
import initializeSocket from "./socket";
import mongoose from "mongoose";
import bodyParser from "body-parser"; // Import body-parser
import routes from "./routes/routes";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketIO(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});
initializeSocket(io);
app.use(express.static(path.join(__dirname, "public")));

// Use body-parser middleware
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use("/", routes);
mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

const PORT: number = parseInt(process.env.PORT as string, 10) || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

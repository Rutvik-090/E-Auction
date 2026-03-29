import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import connectDB from "./config/db.js";
import adminRoutes from "./routes/adminRoutes.js";
import auctionRoutes from "./routes/auctionRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import bidRoutes from "./routes/bidRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { initializeSocket } from "./socket/socket.js";
import { startAuctionCron } from "./utils/auctionCron.js";

// express app
const app = express();

// socket.io connection
const server = http.createServer(app);
const io = initializeSocket(server);

// global.set = io;
global.io = io;

dotenv.config();
connectDB();
// startAuctionCron();

// middlewares
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("API working.");
});

// Routes
app.use("/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/auctions", auctionRoutes);
app.use("/api/bids", bidRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startAuctionCron();
});

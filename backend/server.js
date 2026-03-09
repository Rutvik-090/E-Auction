import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import connectDB from "./config/db.js";
import auctionRoutes from "./routes/auctionRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import bidRoutes from "./routes/bidRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { initializeSocket } from "./socket/socket.js";

dotenv.config();
connectDB();

// express app
const app = express();

// socket.io connection
const server = http.createServer(app);
const io = initializeSocket(server);

app.set("io", io);

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

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

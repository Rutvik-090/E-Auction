import dotenv from "dotenv";
import express from "express";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 5001;

const app = express();

app.get("/", (req, res) => {
  res.send("API working.");
});

app.use("/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

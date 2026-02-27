import express from "express";
import userRoutes from "./routes/userRoutes.js";

const PORT = 3000;

const app = express();

app.get("/", (req, res) => {
  res.send("API working.");
});

app.use("/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

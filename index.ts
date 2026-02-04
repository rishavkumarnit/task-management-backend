import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./src/authRoute.js";
import taskRoutes from "./src/taskRoutes.js";
dotenv.config();
const app = express();

const port = process.env.Port || 4000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API running...");
});

app.use("/", authRoutes);

app.use("/tasks", taskRoutes);

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});

export default app;

import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import cron from "node-cron";
import userRouter from "./routes/userRoutes.js";
import { configDotenv } from "dotenv";
import imageRouter from "./routes/imageRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";
import { keepAlive } from "./config/mongodb.js";

const PORT = process.env.PORT || 4000;
const app = express();

configDotenv();

app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

await connectDB();

app.use("/api/user", userRouter);
app.use("/api/image", imageRouter);
app.use("/api/payment", paymentRouter);

app.get("/", (req, res) => {
  res.send("Api working");
});

cron.schedule("*/10 * * * *", () => {
  keepAlive();
});

app.get("/ping", async (req, res) => {
  await mongoose.connection.db.admin().ping();
  res.send("MongoDB alive");
});

// Server Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date(),
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

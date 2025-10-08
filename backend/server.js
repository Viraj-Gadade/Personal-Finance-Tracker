import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import balanceRoutes from "./routes/BalanceRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import billRoutes from "./routes/billRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";

dotenv.config();

const app = express();

// Use CORS with specific origin and credentials
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.options('*', cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/goals",goalRoutes);
// app.use("/api/goals", require("./routes/goalRoutes"));
app.use("/api/balances", balanceRoutes);

mongoose.connect(process.env.MONGO_URI).then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
});

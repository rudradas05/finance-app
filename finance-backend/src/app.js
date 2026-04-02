import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "./config/db.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

//  Routes

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Finance Backend API is running!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

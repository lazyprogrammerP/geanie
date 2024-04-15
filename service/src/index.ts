import express from "express";
import authRoutes from "./routes/auth.routes";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).send({ status: "success", message: "The service is running." });
});

app.use("/auth", authRoutes);

app.listen(PORT, () => console.log(`The server is running at http://127.0.0.1:${PORT}`));

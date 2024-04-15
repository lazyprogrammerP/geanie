import dotenv from "dotenv";
import express from "express";
import verifyJWT from "./middleware/verify-jwt";
import authRoutes from "./routes/auth.routes";

dotenv.config();

declare global {
  namespace Express {
    interface Request {
      userId: null | string;
    }
  }
}

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).send({ status: "success", message: "The service is running." });
});

app.use("/auth", authRoutes);

// These route's are protected by the verifyJWT middleware
app.use(verifyJWT);

app.listen(PORT, () => console.log(`The server is running at http://127.0.0.1:${PORT}`));

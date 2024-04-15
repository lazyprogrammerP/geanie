import { Router } from "express";
import { UserController } from "../controllers/auth.controllers";

const authRoutes = Router();
const userController = new UserController();

// Sign-up Route
authRoutes.post("/sign-up", userController.signUp);

// Sign-in Route
authRoutes.post("/sign-in", userController.signIn);

export default authRoutes;

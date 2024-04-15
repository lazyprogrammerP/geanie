import { Request, Response } from "express";
import jsonwebtoken from "jsonwebtoken";
import { JWTPayload, SignInRequest, SignInResponse, SignUpRequest, SignUpResponse } from "../interfaces/auth.interfaces";
import { UserService } from "../services/auth.services";
import { SignInRequestValidator, SignUpRequestValidator } from "../validators/auth.validators";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  signUp = async (req: Request<null, SignUpResponse, SignUpRequest, null>, res: Response<SignUpResponse>) => {
    const body = req.body;

    const validation = SignUpRequestValidator.safeParse(body);
    if (!validation.success) {
      return res.status(400).json({ status: "error", message: "Invalid request body.", data: validation.error });
    }

    await this.userService.createUser(body);
    return res.status(201).json({ status: "success", message: "User created.", data: null });
  };

  signIn = async (req: Request<null, SignInResponse, SignInRequest, null>, res: Response<SignInResponse>) => {
    const body = req.body;

    const validation = SignInRequestValidator.safeParse(body);
    if (!validation.success) {
      return res.status(400).json({ status: "error", message: "Invalid request body.", data: validation.error });
    }

    const user = await this.userService.getUserByEmail(body.email);
    if (!user) {
      return res.status(401).json({ status: "error", message: "Invalid email or password.", data: null });
    }

    const passwordMatch = this.userService.comparePassword(body.password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ status: "error", message: "Invalid email or password.", data: null });
    }

    const tokenPayload: JWTPayload = {
      userId: user.id,
    };

    if (!process.env.JWT_SECRET) {
      console.error(`The JWT_SECRET environment variable is not set.`);
      return res.status(500).json({ status: "error", message: "Internal server error.", data: null });
    }

    const token = jsonwebtoken.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      status: "success",
      message: "User signed in.",
      data: {
        user: {
          userId: user.id,
          name: user.name,
          email: user.email,
        },
        token,
      },
    });
  };
}

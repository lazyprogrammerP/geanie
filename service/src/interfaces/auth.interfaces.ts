import { z } from "zod";
import { ResponseStatus } from "../constants";
import { SignInRequestValidator, SignUpRequestValidator } from "../validators/auth.validators";

export type SignUpRequest = z.infer<typeof SignUpRequestValidator>;

export type SignUpResponse = {
  status: ResponseStatus;
  message: string; // TODO: Add a more specific message type
  data: z.ZodError | null;
};

export type SignInRequest = z.infer<typeof SignInRequestValidator>;

export type JWTPayload = {
  userId: string;
};

export type SignInResponse = {
  status: ResponseStatus;
  message: string; // TODO: Add a more specific message type
  data:
    | z.ZodError
    | null
    | {
        user: {
          userId: string;
          name: string;
          email: string;
        };
        token: string;
      };
};

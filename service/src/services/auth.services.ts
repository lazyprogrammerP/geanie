import bcrypt from "bcrypt";
import { SignUpRequest } from "../interfaces/auth.interfaces";
import prisma from "../prisma";

export class UserService {
  saltRounds = 10;

  private hashPassword(password: string): string {
    return bcrypt.hashSync(password, this.saltRounds);
  }

  comparePassword(password: string, passwordHash: string): boolean {
    return bcrypt.compareSync(password, passwordHash);
  }

  async createUser(data: SignUpRequest): Promise<null> {
    const passwordHash = this.hashPassword(data.password);

    await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash,
      },
    });

    return null;
  }

  async getUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }
}

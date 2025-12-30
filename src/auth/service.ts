import { status } from "elysia";
import { eq } from "drizzle-orm";

import type { AuthModel } from "@/auth/model";
import { db } from "@/db";
import { user as userSchema } from "@/db/schema";
import { AuthError } from "@/exceptions/authError";

export abstract class Auth {
  static async signIn({ username, password }: AuthModel.signInBody) {
    const [user] = await db
      .select()
      .from(userSchema)
      .where(eq(userSchema.username, username));

    if (!user) {
      throw new AuthError(
        "Invalid username or password" satisfies AuthModel.signInInvalid,
      );
    }

    const isMatch = await Bun.password.verify(password, user.password);

    if (!isMatch) {
      throw new AuthError(
        "Invalid username or password" satisfies AuthModel.signInInvalid,
      );
    }

    const response = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    return response;
  }
  static async signUp({ username, password, email }: AuthModel.signUpBody) {
    const [user] = await db
      .select()
      .from(userSchema)
      .where(eq(userSchema.username, username));

    if (user) {
      throw status(
        400,
        "User already exists" satisfies AuthModel.signUpInvalid
      );
    }
    const hashedPassword = await Bun.password.hash(password);

    const [newUser] = await db
      .insert(userSchema)
      .values({ username, password: hashedPassword, email })
      .returning();

    const response = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
    };
    return response;
  }

  static async getUserById(id: number) {
    const [user] = await db
      .select()
      .from(userSchema)
      .where(eq(userSchema.id, id));

    if (!user) {
      throw status(
        404,
        "User not found" satisfies AuthModel.getUserByIdInvalid
      );
    }

    const response = {
      id: user.id,
      username: user.username,
      email: user.email,
    };
    return response;
  }
}

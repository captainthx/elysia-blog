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
      throw AuthError.userNotFound()
    }

    const isMatch = await Bun.password.verify(password, user.password);

    if (!isMatch) {
      throw AuthError.invalidCredentials()
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
      throw AuthError.duplicateUser()
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
      throw AuthError.userNotFound()
    }

    const response = {
      id: user.id,
      username: user.username,
      email: user.email,
    };
    return response;
  }
}

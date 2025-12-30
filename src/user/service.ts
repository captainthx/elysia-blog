import { status } from "elysia";
import { eq } from "drizzle-orm";
import { UserModel } from "@/user/model";
import { db } from "@/db";
import { user as userSchema } from "@/db/schema";

export abstract class User {
  static async getUserById(id: number): Promise<UserModel.UserResponse> {
    const [user] = await db
      .select()
      .from(userSchema)
      .where(eq(userSchema.id, id));

    if (!user) {
      throw status(
        404,
        "User not found" satisfies UserModel.getUserByIdInvalid
      );
    }
    return {
      id: user.id,
      username: user.username,
      email: user.email,
    };
  }
}

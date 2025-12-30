import { eq } from "drizzle-orm";
import { UserModel } from "@/user/model";
import { db } from "@/db";
import { user as userSchema } from "@/db/schema";
import { UserError } from "@/exceptions/userError";

export abstract class User {
  static async getUserById(id: number): Promise<UserModel.UserResponse> {
    const [user] = await db
      .select()
      .from(userSchema)
      .where(eq(userSchema.id, id));

    if (!user) {
      throw UserError.userNotFound()
    }
    return {
      id: user.id,
      username: user.username,
      email: user.email,
    };
  }
}

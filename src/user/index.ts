import { ExceptionModel } from "@/exceptions/model";
import authPlugin from "@/lib/auth.plugin";
import { UserModel } from "@/user/model";
import jwt from "@elysiajs/jwt";
import { Elysia } from "elysia";

export const user = new Elysia({ prefix: "/auth" })
  .use(
    jwt({
      name: "jwt",
      secret: Bun.env.JWT_SECRET!,
    })
  )
  .use(authPlugin)
  .get(
    "/me",
    ({ user }) => {
      return user;
    },
    {
      detail: {
        tags: ["User"],
        summary: "Get profile",
        description: "Get profile",
      },
      response: {
        200: UserModel.UserResponse,
        404: ExceptionModel.errorResponse,
        500: ExceptionModel.errorResponse
      },
    }
  );

import { AuthModel } from "@/auth/model";
import { Auth } from "@/auth/service";
import { ExceptionModel } from "@/exceptions/model";
import jwt from "@elysiajs/jwt";
import { Elysia } from "elysia";

export const auth = new Elysia({ prefix: "/auth" })
  .use(
    jwt({
      name: "jwt",
      secret: Bun.env.JWT_SECRET!,
    })
  )
  .post(
    "/sign-in",
    async ({ body, jwt }) => {
      const result = await Auth.signIn(body);
      const token = await jwt.sign({
        jti: crypto.randomUUID(),
        iss: "elysia-app",
        sub: result.id.toString(),
        exp: Date.now() + 60 * 60 * 1000,
      });
      return {
        message: "User signed in successfully",
        token,
      };
    },
    {
      detail: {
        tags: ["Auth"],
        summary: "Sign in to get a token",
        description: "Sign in to get a token",
      },
      body: AuthModel.signInBody,
      response: {
        200: AuthModel.signInResponse,
        401: ExceptionModel.errorResponse,
      },
    }
  )
  .post(
    "/sign-up",
    async ({ body, jwt }) => {
      const result = await Auth.signUp(body);
      const token = await jwt.sign({
        jti: crypto.randomUUID(),
        iss: "elysia-app",
        sub: result.id.toString(),
        exp: Date.now() + 60 * 60 * 1000,
      });
      return {
        message: "User created successfully",
        token,
      };
    },
    {
      detail: {
        tags: ["Auth"],
        summary: "Sign up to create an account",
        description: "Sign up to create an account",
      },
      body: AuthModel.signUpBody,
      response: {
        200: AuthModel.signUpResponse,
        400: ExceptionModel.errorResponse,
        500: ExceptionModel.errorResponse
      },
    }
  );

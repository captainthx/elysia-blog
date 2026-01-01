import openapi from "@elysiajs/openapi";
import { Elysia } from "elysia";

import { cors } from "@elysiajs/cors";
import { auth } from "@/auth";
import { user } from "@/user";
import logixlysia from "logixlysia";
import { AppError } from "@/exceptions/appError";
import { blog } from "@/blog";

const app = new Elysia()
  .use(
    cors({
      origin: "*",
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    })
  )
  .use(
    openapi({
      path: "/docs",
      documentation: {
        components: {
          securitySchemes: {
            BearerAuth: {
              type: "http",
              scheme: "bearer",
            },
          },
        },
      },
    })
  )
  .use(
    logixlysia({
      config: {
        showStartupMessage: false,
        pino: {
          level: "debug",
          messageKey: "message",
          redact: ["password", "token"],
          transport: {
            target: "pino-pretty",
            options: {
              ignore: "pid,hostname",
              colorize: true,
              translateTime: "SYS:dd-mm-yyyy HH:MM:ss",
              messageKey: "message",
            },
          },
        },
      },
    })
  )
  .error({
    "AppError": AppError
  })
  .onError({ as: "global" }, ({ error, code, set, store, request }) => {
    const { logger } = store

    if (error instanceof AppError) {
      set.status = error.status;
      return error.toResponse();
    }

    if (code === "VALIDATION") {
      set.status = 400;
      const field = (error as any).all?.[0]?.path?.slice(1) || 'Field';
      const message = (error as any).all?.[0]?.message || error.message;
      return {
        error: `${field} ${message}`,
        code: 400,
      };
    }

    if (code === "NOT_FOUND") {
      set.status = 404;
      return {
        error: "Not Found",
        code: 404
      };
    }
    logger.error(request, "internal Server Error", error)
    set.status = 500;
    return {
      error: "Internal Server Error",
      code: 500
    };
  })
  .use(auth)
  .use(user)
  .use(blog)
  .listen(3000);


console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

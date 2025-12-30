import openapi from "@elysiajs/openapi";
import { Elysia } from "elysia";

import { cors } from "@elysiajs/cors";
import { auth } from "@/auth";
import { user } from "@/user";
import logixlysia from "logixlysia";
import { AppError } from "@/exceptions/appError";

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
  .error({
    "AppError":AppError
  })
  .onError({as:"global"},({ error, code, set }) => {
    console.log({error,code});
    if (code === "VALIDATION") {
      set.status = 400;
      const field = (error as any).all?.[0]?.path?.slice(1) || 'Field';
      const message = (error as any).all?.[0]?.message || error.message;
      const fullMessage = `${field} ${message}`;
      return {
        error: fullMessage,
        code: 400,
      };
    }
    if (error instanceof AppError) {
      return error.toResponse();
    }
  })
  .use(auth)
  .use(user)
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
  .get("/", ({ store, request }) => {
    const { logger, pino } = store;
    logger.info(request, "logger", {
      message: "Hello World",
    });
    pino.info("auth-service");
    return "Hello World";
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

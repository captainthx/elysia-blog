import { t } from "elysia";

export namespace AuthModel {
  export const signInBody = t.Object({
    username: t.String({
      minLength: 4,
      maxLength: 10,
      error: "Username must be between 4 and 10 characters",
    }),
    password: t.String({
      minLength: 4,
      maxLength: 10,
      error: "Password must be between 4 and 10 characters",
    }),
  });

  export const signUpBody = t.Object({
    username: t.String(),
    password: t.String(),
    email: t.String(),
  });

  export type signInBody = typeof signInBody.static;
  export type signUpBody = typeof signUpBody.static;

  export const signInResponse = t.Object({
    message: t.String(),
    token: t.String(),
  });

  export type signInResponse = typeof signInResponse.static;

  export const signUpResponse = t.Object({
    message: t.String(),
    token: t.String(),
  });
  export type signUpResponse = typeof signUpResponse.static;
}

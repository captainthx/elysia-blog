import { t } from "elysia";

export namespace UserModel {
  export const UserResponse = t.Object({
    id: t.Number(),
    username: t.String(),
    email: t.String(),
  });

  export type UserResponse = typeof UserResponse.static;

}

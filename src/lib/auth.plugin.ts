import { Auth } from "@/auth/service";
import bearer from "@elysiajs/bearer";
import jwt from "@elysiajs/jwt";
import Elysia from "elysia";

const authPlugin = new Elysia({ name: "auth-plugin" })
  .use(
    jwt({
      name: "jwt",
      secret: Bun.env.JWT_SECRET!,
    })
  )
  .use(bearer())
  .derive({ as: "scoped" }, async ({ jwt, set, bearer }) => {
    const jwtPayload = await jwt.verify(bearer);
    if (!jwtPayload || !jwtPayload.sub) {
      console.log("invalid token ", jwtPayload);
      set.status = "Forbidden";
      throw new Error("invalid token");
    }

    const userId = +jwtPayload.sub;
    const user = await Auth.getUserById(userId);
    return { user };
  });
export default authPlugin;

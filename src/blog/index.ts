import { BlogModel } from "@/blog/model";
import { Blog } from "@/blog/service";
import authPlugin from "@/lib/auth.plugin";
import jwt from "@elysiajs/jwt";
import { Elysia, t } from "elysia";

export const blog = new Elysia({ prefix: "/blog" })
    .use(
        jwt({
            name: "jwt",
            secret: Bun.env.JWT_SECRET!,
        })
    )
    .use(authPlugin)
    .post("/", async ({ body, user }) => {
        const result = await Blog.createBlog({ body, userId: user.id });
        return result;
    },
        {
            detail: {
                tags: ["Blog"],
                summary: "Create a new blog",
                description: "Create a new blog",
            },
            body: BlogModel.createBlogBody,
        }
    )
    .get("/", async ({ query, user }) => {
        const page = (query.page || 1);
        const limit = (query.limit || 10);
        const offset = (page - 1) * limit;
        const result = await Blog.getBlogs({ userId: user.id, limit, offset });
        return result;
    }, {
        detail: {
            tags: ["Blog"],
            summary: "Get all blogs",
            description: "Get all blogs",
        },
        query: t.Object({
            page: t.Optional(t.Numeric()),
            limit: t.Optional(t.Numeric())
        })
    }
    )
    .get("/:blogId", async ({ params }) => {
        const result = await Blog.getBlogById({ blogId: params.blogId });
        return result;
    }, {
        detail: {
            tags: ["Blog"],
            summary: "Get a blog by id",
            description: "Get a blog by id",
        },
        params: t.Object({
            blogId: t.Numeric()
        })
    }
    );


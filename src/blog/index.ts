import { BlogModel } from "@/blog/model";
import { Blog } from "@/blog/service";
import { ExceptionModel } from "@/exceptions/model";
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
            response: {
                500: ExceptionModel.errorResponse
            }
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
        }),
        response: {
            400: ExceptionModel.errorResponse,
            500: ExceptionModel.errorResponse
        }
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
        }),
        response: {
            404: ExceptionModel.errorResponse,
            500: ExceptionModel.errorResponse
        }
    }
    )
    .put("/:blogId", async ({ body, params }) => {
        const result = await Blog.updateBlog({ body, blogId: params.blogId });
        return result;
    }, {
        detail: {
            tags: ["Blog"],
            summary: "Update a blog by id",
            description: "Update a blog by id",
        },
        response: {
            200: BlogModel.updateBlogResponse,
            404: ExceptionModel.errorResponse,
            500: ExceptionModel.errorResponse
        },
        params: t.Object({
            blogId: t.Numeric()
        }),
        body: BlogModel.updateBlogBody,
    }
    )
    .delete("/:blogId", async ({ params }) => {
        const result = await Blog.deleteBlog({ blogId: params.blogId });
        return result;
    }, {
        detail: {
            tags: ["Blog"],
            summary: "Delete a blog by id",
            description: "Delete a blog by id",
        },
        response: {
            200: BlogModel.deleteBlogResponse,
            404: ExceptionModel.errorResponse,
            500: ExceptionModel.errorResponse
        },
        params: t.Object({
            blogId: t.Numeric()
        })
    }
    );



import { t } from "elysia";

export namespace BlogModel {
    export const createBlogBody = t.Object({
        title: t.String({
            minLength: 10,
            maxLength: 100,
            error: "Title must be between 10 and 100 characters"
        }),
        content: t.String({
            minLength: 10,
            maxLength: 1000,
            error: "Content must be between 10 and 1000 characters"
        }),
    })
    export type createBlogBody = typeof createBlogBody.static

    export const updateBlogBody = t.Object({
        title: t.Optional(t.String({
            minLength: 10,
            maxLength: 100,
            error: "Title must be between 10 and 100 characters"
        })),
        content: t.Optional(t.String({
            minLength: 10,
            maxLength: 1000,
            error: "Content must be between 10 and 1000 characters"
        })),
    })
    export type updateBlogBody = typeof updateBlogBody.static

    export const updateBlogResponse = t.Object({
        blogId: t.Number(),
        title: t.String(),
        content: t.String(),
        createdAt: t.Date(),
    })
    export type updateBlogResponse = typeof updateBlogResponse.static

    export const deleteBlogResponse = t.Object({
        message: t.String(),
        blogId: t.Number(),
    })
    export type deleteBlogResponse = typeof deleteBlogResponse.static
}
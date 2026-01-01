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
}
import { db } from "@/db";
import { BlogModel } from "./model";
import { blogs as blogSchema } from "@/db/schema";
import { eq } from "drizzle-orm";

export abstract class Blog {

    static async createBlog({ body, userId }: { body: BlogModel.createBlogBody, userId: number }) {
        const { title, content } = body
        const [newBlog] = await db.insert(blogSchema)
            .values({ title, content, ownerId: userId })
            .returning()
        return newBlog
    }
    static async getBlogs({ userId, limit, offset }: { userId: number, limit: number, offset: number }) {
        const results = await db.query.blogs.findMany({
            columns: {
                id: true,
                title: true,
                content: true,
                createdAt: true,
            },
            where: eq(blogSchema.ownerId, userId),
            limit: limit,
            offset: offset,
            with: {
                owner: {
                    columns: {
                        password: false,
                        createdAt: false
                    }
                }
            }
        })
        return results
    }

    static async getBlogById({ blogId }: { blogId: number }) {
        const result = await db.query.blogs.findFirst({
            columns: {
                id: true,
                title: true,
                content: true,
                createdAt: true,
            },
            where: eq(blogSchema.id, blogId),
        })
        console.log(typeof result)
        return result
    }
}
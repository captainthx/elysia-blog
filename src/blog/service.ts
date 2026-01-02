import { db } from "@/db";
import { BlogModel } from "./model";
import { blogs as blogSchema } from "@/db/schema";
import { eq } from "drizzle-orm";
import { BlogError } from "@/exceptions/blogError";

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
        if (!results) {
            throw BlogError.blogNotFound()
        }
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
        if (!result) {
            throw BlogError.blogNotFound()
        }
        return result
    }
    static async updateBlog({ body, blogId }: { body: BlogModel.updateBlogBody, blogId: number }) {
        const { title, content } = body

        const blog = await db.query.blogs.findFirst({
            where: eq(blogSchema.id, blogId),
        })

        if (!blog) {
            throw BlogError.blogNotFound()
        }
        const [updatedBlog] = await db.update(blogSchema)
            .set({
                ...(title ? { title } : {}),
                ...(content ? { content } : {})
            })
            .where(eq(blogSchema.id, blogId))
            .returning({
                blogId: blogSchema.id,
                title: blogSchema.title,
                content: blogSchema.content,
                createdAt: blogSchema.createdAt,
            })

        return {
            blogId: updatedBlog.blogId,
            title: updatedBlog.title,
            content: updatedBlog.content as string,
            createdAt: updatedBlog.createdAt,
        }

    }

    static async deleteBlog({ blogId }: { blogId: number }): Promise<BlogModel.deleteBlogResponse> {
        const blog = await db.query.blogs.findFirst({
            where: eq(blogSchema.id, blogId),
        })

        if (!blog) {
            throw BlogError.blogNotFound()
        }
        const [deletedBlog] = await db.delete(blogSchema)
            .where(eq(blogSchema.id, blogId))
            .returning({ id: blogSchema.id })

        return {
            message: "Blog deleted successfully",
            blogId: deletedBlog.id
        }
    }
}
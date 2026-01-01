import { pgTable, varchar, timestamp, integer, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const user = pgTable("user", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  username: varchar("username").notNull().unique(),
  password: varchar("password").notNull(),
  email: varchar("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const blogs = pgTable("blogs", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  title: varchar("title").notNull(),
  content: jsonb("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  ownerId: integer("user_id").notNull().references(() => user.id),
})

export const usersRelations = relations(user, ({ many }) => ({
  blogs: many(blogs),
}));

export const blogsRelations = relations(blogs, ({ one }) => ({
  owner: one(user, {
    fields: [blogs.ownerId],
    references: [user.id],
  }),
}));

export const table = {
  user,
  blogs,
} as const;

export type Table = typeof table;



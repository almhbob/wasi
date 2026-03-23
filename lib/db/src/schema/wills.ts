import { pgTable, text, timestamp, boolean, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const willsTable = pgTable("wills", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  isEncrypted: boolean("is_encrypted").notNull().default(false),
  status: text("status").notNull().default("draft"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertWillSchema = createInsertSchema(willsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertWill = z.infer<typeof insertWillSchema>;
export type Will = typeof willsTable.$inferSelect;

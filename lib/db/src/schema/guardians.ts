import { pgTable, text, timestamp, boolean, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const guardiansTable = pgTable("guardians", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  relationship: text("relationship").notNull(),
  isConfirmed: boolean("is_confirmed").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertGuardianSchema = createInsertSchema(guardiansTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertGuardian = z.infer<typeof insertGuardianSchema>;
export type Guardian = typeof guardiansTable.$inferSelect;

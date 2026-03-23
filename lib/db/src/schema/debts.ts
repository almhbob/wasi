import { pgTable, text, timestamp, boolean, numeric, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const debtsTable = pgTable("debts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  type: text("type").notNull().default("debt"),
  description: text("description").notNull(),
  amount: numeric("amount", { precision: 15, scale: 2 }),
  currency: text("currency").default("SAR"),
  creditorName: text("creditor_name"),
  creditorContact: text("creditor_contact"),
  isPaid: boolean("is_paid").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertDebtSchema = createInsertSchema(debtsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertDebt = z.infer<typeof insertDebtSchema>;
export type Debt = typeof debtsTable.$inferSelect;

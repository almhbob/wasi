import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const digitalAssetsTable = pgTable("digital_assets", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  platform: text("platform").notNull(),
  accountIdentifier: text("account_identifier"),
  instructions: text("instructions").notNull(),
  action: text("action").notNull().default("close"),
  encryptedCredentials: text("encrypted_credentials"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertDigitalAssetSchema = createInsertSchema(digitalAssetsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertDigitalAsset = z.infer<typeof insertDigitalAssetSchema>;
export type DigitalAsset = typeof digitalAssetsTable.$inferSelect;

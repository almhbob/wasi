import { Router } from "express";
import { db, debtsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = Router();

const fmt = (d: typeof debtsTable.$inferSelect) => ({
  id: d.id,
  userId: d.userId,
  type: d.type,
  description: d.description,
  amount: d.amount ? parseFloat(d.amount) : null,
  currency: d.currency,
  creditorName: d.creditorName,
  creditorContact: d.creditorContact,
  isPaid: d.isPaid,
  createdAt: d.createdAt.toISOString(),
});

router.get("/debts", requireAuth, async (req: AuthRequest, res) => {
  const items = await db.select().from(debtsTable).where(eq(debtsTable.userId, req.userId!));
  res.json(items.map(fmt));
});

router.post("/debts", requireAuth, async (req: AuthRequest, res) => {
  const { type, description, amount, currency, creditorName, creditorContact } = req.body;
  if (!description) {
    res.status(400).json({ error: "Description required" });
    return;
  }
  const [item] = await db.insert(debtsTable).values({
    userId: req.userId!,
    type: type || "debt",
    description,
    amount: amount?.toString() || null,
    currency: currency || "SAR",
    creditorName: creditorName || null,
    creditorContact: creditorContact || null,
    isPaid: false,
  }).returning();
  res.status(201).json(fmt(item));
});

router.patch("/debts/:id", requireAuth, async (req: AuthRequest, res) => {
  const { type, description, amount, currency, creditorName, creditorContact, isPaid } = req.body;
  const updates: Record<string, unknown> = {};
  if (type != null) updates.type = type;
  if (description != null) updates.description = description;
  if (amount != null) updates.amount = amount.toString();
  if (currency != null) updates.currency = currency;
  if (creditorName != null) updates.creditorName = creditorName;
  if (creditorContact != null) updates.creditorContact = creditorContact;
  if (isPaid != null) updates.isPaid = isPaid;
  const [item] = await db.update(debtsTable).set(updates)
    .where(and(eq(debtsTable.id, req.params.id), eq(debtsTable.userId, req.userId!)))
    .returning();
  if (!item) { res.status(404).json({ error: "Not found" }); return; }
  res.json(fmt(item));
});

router.delete("/debts/:id", requireAuth, async (req: AuthRequest, res) => {
  await db.delete(debtsTable)
    .where(and(eq(debtsTable.id, req.params.id), eq(debtsTable.userId, req.userId!)));
  res.json({ message: "Deleted" });
});

export default router;

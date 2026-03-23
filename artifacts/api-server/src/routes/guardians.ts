import { Router } from "express";
import { db, guardiansTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = Router();

const fmt = (g: typeof guardiansTable.$inferSelect) => ({
  id: g.id,
  userId: g.userId,
  name: g.name,
  email: g.email,
  phone: g.phone,
  relationship: g.relationship,
  isConfirmed: g.isConfirmed,
  createdAt: g.createdAt.toISOString(),
});

router.get("/guardians", requireAuth, async (req: AuthRequest, res) => {
  const items = await db.select().from(guardiansTable).where(eq(guardiansTable.userId, req.userId!));
  res.json(items.map(fmt));
});

router.post("/guardians", requireAuth, async (req: AuthRequest, res) => {
  const { name, email, phone, relationship } = req.body;
  if (!name || !email || !relationship) {
    res.status(400).json({ error: "Name, email and relationship required" });
    return;
  }
  const [item] = await db.insert(guardiansTable).values({
    userId: req.userId!,
    name,
    email,
    phone: phone || null,
    relationship,
    isConfirmed: false,
  }).returning();
  res.status(201).json(fmt(item));
});

router.patch("/guardians/:id", requireAuth, async (req: AuthRequest, res) => {
  const { name, email, phone, relationship } = req.body;
  const updates: Record<string, unknown> = {};
  if (name != null) updates.name = name;
  if (email != null) updates.email = email;
  if (phone != null) updates.phone = phone;
  if (relationship != null) updates.relationship = relationship;
  const [item] = await db.update(guardiansTable).set(updates)
    .where(and(eq(guardiansTable.id, req.params.id), eq(guardiansTable.userId, req.userId!)))
    .returning();
  if (!item) { res.status(404).json({ error: "Not found" }); return; }
  res.json(fmt(item));
});

router.delete("/guardians/:id", requireAuth, async (req: AuthRequest, res) => {
  await db.delete(guardiansTable)
    .where(and(eq(guardiansTable.id, req.params.id), eq(guardiansTable.userId, req.userId!)));
  res.json({ message: "Deleted" });
});

export default router;

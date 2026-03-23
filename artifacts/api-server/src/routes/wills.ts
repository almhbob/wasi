import { Router } from "express";
import { db, willsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = Router();

const formatWill = (w: typeof willsTable.$inferSelect) => ({
  id: w.id,
  userId: w.userId,
  title: w.title,
  content: w.content,
  isEncrypted: w.isEncrypted,
  status: w.status,
  createdAt: w.createdAt.toISOString(),
  updatedAt: w.updatedAt.toISOString(),
});

router.get("/wills", requireAuth, async (req: AuthRequest, res) => {
  const wills = await db.select().from(willsTable).where(eq(willsTable.userId, req.userId!));
  res.json(wills.map(formatWill));
});

router.post("/wills", requireAuth, async (req: AuthRequest, res) => {
  const { title, content, isEncrypted } = req.body;
  if (!title || !content) {
    res.status(400).json({ error: "Title and content required" });
    return;
  }
  const [will] = await db.insert(willsTable).values({
    userId: req.userId!,
    title,
    content,
    isEncrypted: isEncrypted ?? false,
    status: "draft",
  }).returning();
  res.status(201).json(formatWill(will));
});

router.get("/wills/:id", requireAuth, async (req: AuthRequest, res) => {
  const [will] = await db.select().from(willsTable)
    .where(and(eq(willsTable.id, req.params.id), eq(willsTable.userId, req.userId!)));
  if (!will) { res.status(404).json({ error: "Not found" }); return; }
  res.json(formatWill(will));
});

router.patch("/wills/:id", requireAuth, async (req: AuthRequest, res) => {
  const { title, content, isEncrypted, status } = req.body;
  const updates: Partial<typeof willsTable.$inferSelect> = {};
  if (title != null) updates.title = title;
  if (content != null) updates.content = content;
  if (isEncrypted != null) updates.isEncrypted = isEncrypted;
  if (status != null) updates.status = status;
  const [will] = await db.update(willsTable).set(updates)
    .where(and(eq(willsTable.id, req.params.id), eq(willsTable.userId, req.userId!)))
    .returning();
  if (!will) { res.status(404).json({ error: "Not found" }); return; }
  res.json(formatWill(will));
});

router.delete("/wills/:id", requireAuth, async (req: AuthRequest, res) => {
  await db.delete(willsTable)
    .where(and(eq(willsTable.id, req.params.id), eq(willsTable.userId, req.userId!)));
  res.json({ message: "Deleted" });
});

export default router;

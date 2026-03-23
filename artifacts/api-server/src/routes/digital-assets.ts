import { Router } from "express";
import { db, digitalAssetsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = Router();

const fmt = (d: typeof digitalAssetsTable.$inferSelect) => ({
  id: d.id,
  userId: d.userId,
  platform: d.platform,
  accountIdentifier: d.accountIdentifier,
  instructions: d.instructions,
  action: d.action,
  encryptedCredentials: d.encryptedCredentials,
  createdAt: d.createdAt.toISOString(),
});

router.get("/digital-assets", requireAuth, async (req: AuthRequest, res) => {
  const items = await db.select().from(digitalAssetsTable).where(eq(digitalAssetsTable.userId, req.userId!));
  res.json(items.map(fmt));
});

router.post("/digital-assets", requireAuth, async (req: AuthRequest, res) => {
  const { platform, accountIdentifier, instructions, action, encryptedCredentials } = req.body;
  if (!platform || !instructions || !action) {
    res.status(400).json({ error: "Platform, instructions and action required" });
    return;
  }
  const [item] = await db.insert(digitalAssetsTable).values({
    userId: req.userId!,
    platform,
    accountIdentifier: accountIdentifier || null,
    instructions,
    action,
    encryptedCredentials: encryptedCredentials || null,
  }).returning();
  res.status(201).json(fmt(item));
});

router.patch("/digital-assets/:id", requireAuth, async (req: AuthRequest, res) => {
  const { platform, accountIdentifier, instructions, action, encryptedCredentials } = req.body;
  const updates: Record<string, unknown> = {};
  if (platform != null) updates.platform = platform;
  if (accountIdentifier != null) updates.accountIdentifier = accountIdentifier;
  if (instructions != null) updates.instructions = instructions;
  if (action != null) updates.action = action;
  if (encryptedCredentials != null) updates.encryptedCredentials = encryptedCredentials;
  const [item] = await db.update(digitalAssetsTable).set(updates)
    .where(and(eq(digitalAssetsTable.id, req.params.id), eq(digitalAssetsTable.userId, req.userId!)))
    .returning();
  if (!item) { res.status(404).json({ error: "Not found" }); return; }
  res.json(fmt(item));
});

router.delete("/digital-assets/:id", requireAuth, async (req: AuthRequest, res) => {
  await db.delete(digitalAssetsTable)
    .where(and(eq(digitalAssetsTable.id, req.params.id), eq(digitalAssetsTable.userId, req.userId!)));
  res.json({ message: "Deleted" });
});

export default router;

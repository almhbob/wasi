import { Router } from "express";
import bcrypt from "bcryptjs";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth, signToken, AuthRequest } from "../middleware/auth";

const router = Router();

router.post("/auth/register", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ error: "Name, email and password are required" });
      return;
    }
    const existing = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    if (existing.length > 0) {
      res.status(409).json({ error: "Email already registered" });
      return;
    }
    const passwordHash = await bcrypt.hash(password, 12);
    const [user] = await db.insert(usersTable).values({
      name,
      email,
      passwordHash,
      phone: phone || null,
    }).returning();
    const token = signToken(user.id);
    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        lastCheckinAt: user.lastCheckinAt?.toISOString() || null,
        checkinIntervalDays: user.checkinIntervalDays,
        createdAt: user.createdAt.toISOString(),
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Email and password required" });
      return;
    }
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    const token = signToken(user.id);
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        lastCheckinAt: user.lastCheckinAt?.toISOString() || null,
        checkinIntervalDays: user.checkinIntervalDays,
        createdAt: user.createdAt.toISOString(),
      },
    });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/auth/logout", (_req, res) => {
  res.json({ message: "Logged out" });
});

router.get("/auth/me", requireAuth, async (req: AuthRequest, res) => {
  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!)).limit(1);
    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      lastCheckinAt: user.lastCheckinAt?.toISOString() || null,
      checkinIntervalDays: user.checkinIntervalDays,
      createdAt: user.createdAt.toISOString(),
    });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/auth/checkin", requireAuth, async (req: AuthRequest, res) => {
  try {
    await db.update(usersTable)
      .set({ lastCheckinAt: new Date() })
      .where(eq(usersTable.id, req.userId!));
    res.json({ message: "Check-in recorded" });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;

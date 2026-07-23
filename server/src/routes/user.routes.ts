import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth, requireRole } from "../middleware/auth";

export const userRouter = Router();

userRouter.use(requireAuth, requireRole("ADMIN"));

userRouter.get("/", async (_req, res) => {
  const resellers = await prisma.user.findMany({
    where: { role: "RESELLER" },
    select: { id: true, name: true, email: true, phone: true, isActive: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(resellers);
});

const statusSchema = z.object({
  isActive: z.boolean(),
});

userRouter.patch("/:id/status", async (req, res) => {
  const parsed = statusSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const existing = await prisma.user.findUnique({ where: { id: req.params.id } });
  if (!existing || existing.role !== "RESELLER") {
    return res.status(404).json({ error: "Reseller not found" });
  }

  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: parsed.data,
    select: { id: true, name: true, email: true, phone: true, isActive: true, createdAt: true },
  });
  res.json(user);
});

import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAuth, requireRole } from "../middleware/auth";

export const projectRouter = Router();

projectRouter.use(requireAuth);

const proposeSchema = z.object({
  clientName: z.string().min(2),
  clientContact: z.string().min(3),
  description: z.string().min(10),
  estimatedBudget: z.number().int().positive().optional(),
});

projectRouter.post("/", requireRole("RESELLER"), async (req, res) => {
  const parsed = proposeSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const project = await prisma.project.create({
    data: { ...parsed.data, resellerId: req.user!.userId },
  });
  res.status(201).json(project);
});

projectRouter.get("/", async (req, res) => {
  const isAdmin = req.user!.role === "ADMIN";
  const projects = await prisma.project.findMany({
    where: isAdmin ? {} : { resellerId: req.user!.userId },
    orderBy: { createdAt: "desc" },
    include: isAdmin ? { reseller: { select: { id: true, name: true, email: true, phone: true } } } : undefined,
  });
  res.json(projects);
});

const statusSchema = z.object({
  status: z.enum(["PENDING", "REVIEWED", "IN_PROGRESS", "COMPLETED", "REJECTED"]),
  adminNote: z.string().optional(),
});

projectRouter.patch("/:id/status", requireRole("ADMIN"), async (req, res) => {
  const parsed = statusSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const existing = await prisma.project.findUnique({ where: { id: req.params.id } });
  if (!existing) {
    return res.status(404).json({ error: "Project not found" });
  }

  const project = await prisma.project.update({
    where: { id: req.params.id },
    data: parsed.data,
  });
  res.json(project);
});

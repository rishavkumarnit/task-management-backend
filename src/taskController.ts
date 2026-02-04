import type { Response } from "express";
import { prisma } from "./prisma.js";
import type { AuthRequest } from "./authMiddleware.js";

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { description } = req.body;
    const userId = req.userId!;

    if (!description) {
      return res.status(400).json({
        message: "Description is required",
      });
    }

    const task = await prisma.task.create({
      data: {
        description,
        userId,
      },
    });

    return res.status(201).json(task);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return res.json({
      tasks,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const getTaskById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const task = await prisma.task.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.json(task);
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    console.log("Update Task Req Body:", req.body);
    const { id } = req.params;
    const { description, completed } = req.body;
    const userId = req.userId!;

    const existing = await prisma.task.findFirst({
      where: { userId },
    });

    if (!existing) {
      return res.status(404).json({ message: "Task not found" });
    }
    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const updated = await prisma.task.update({
      where: { id },
      data: {
        ...(description !== undefined && { description }),
        ...(completed !== undefined && { completed }),
      },
    });

    return res.json(updated);
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const existing = await prisma.task.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return res.status(404).json({ message: "Task not found" });
    }

    await prisma.task.delete({
      where: { id },
    });

    return res.json({ message: "Task deleted successfully" });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

export const toggleTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const task = await prisma.task.findFirst({
      where: { id, userId },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const updated = await prisma.task.update({
      where: { id },
      data: {
        completed: !task.completed,
      },
    });

    return res.json(updated);
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

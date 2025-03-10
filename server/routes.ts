import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTaskSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/tasks", async (_req, res) => {
    const tasks = await storage.getTasks();
    res.json(tasks);
  });

  app.post("/api/tasks", async (req, res) => {
    const result = insertTaskSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid task data" });
    }

    const task = await storage.createTask(result.data);
    res.status(201).json(task);
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    try {
      await storage.deleteTask(id);
      res.status(204).send();
    } catch (err) {
      res.status(404).json({ message: "Task not found" });
    }
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const updateSchema = z.object({
      completed: z.boolean().optional(),
      currentSession: z.number().optional(),
      notes: z.array(z.string()).optional(), // Added notes to update schema
    });

    const result = updateSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid update data" });
    }

    try {
      const task = await storage.updateTask(id, result.data);
      res.json(task);
    } catch (err) {
      res.status(404).json({ message: "Task not found" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
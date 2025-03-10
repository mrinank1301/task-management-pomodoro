import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  priority: text("priority").notNull().default("medium"),
  categories: text("categories").array().notNull().default([]),
  completed: boolean("completed").notNull().default(false),
  currentSession: integer("current_session").notNull().default(0),
  customTimerDuration: integer("custom_timer_duration"),
  notes: text("notes").array().notNull().default([]), // Added notes field
});

export const insertTaskSchema = createInsertSchema(tasks).pick({
  title: true,
  description: true,
  priority: true,
  categories: true,
  customTimerDuration: true,
  notes: true, // Added notes to schema
}).extend({
  priority: z.enum(["low", "medium", "high"]),
});

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;

export const POMODORO_WORK_MINUTES = 25;
export const POMODORO_BREAK_MINUTES = 5;

// Task statistics type
export type TaskStats = {
  completedTasks: number;
  totalSessions: number;
  averageSessionsPerTask: number;
};
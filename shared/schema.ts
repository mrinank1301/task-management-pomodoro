import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  completed: boolean("completed").notNull().default(false),
  currentSession: integer("current_session").notNull().default(0),
});

export const insertTaskSchema = createInsertSchema(tasks).pick({
  title: true,
});

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;

export const POMODORO_WORK_MINUTES = 25;
export const POMODORO_BREAK_MINUTES = 5;

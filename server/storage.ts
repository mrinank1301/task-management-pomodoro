import { tasks, type Task, type InsertTask } from "@shared/schema";

export interface IStorage {
  getTasks(): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  deleteTask(id: number): Promise<void>;
  updateTask(id: number, updates: Partial<Task>): Promise<Task>;
}

export class MemStorage implements IStorage {
  private tasks: Map<number, Task>;
  private currentId: number;

  constructor() {
    this.tasks = new Map();
    this.currentId = 1;
  }

  async getTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = this.currentId++;
    const task: Task = {
      id,
      ...insertTask,
      completed: false,
      currentSession: 0,
    };
    this.tasks.set(id, task);
    return task;
  }

  async deleteTask(id: number): Promise<void> {
    if (!this.tasks.delete(id)) {
      throw new Error(`Task with id ${id} not found`);
    }
  }

  async updateTask(id: number, updates: Partial<Task>): Promise<Task> {
    const task = this.tasks.get(id);
    if (!task) {
      throw new Error(`Task with id ${id} not found`);
    }
    const updatedTask = { ...task, ...updates };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }
}

export const storage = new MemStorage();

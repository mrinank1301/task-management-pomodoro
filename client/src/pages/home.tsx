import { useEffect } from "react";
import { TaskList } from "@/components/task-list";
import { TaskForm } from "@/components/task-form";
import { TimerDisplay } from "@/components/timer-display";
import { requestNotificationPermission } from "@/lib/notification";

export default function Home() {
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Task Timer</h1>
          <p className="text-muted-foreground">
            Manage your tasks with integrated Pomodoro timer
          </p>
        </div>

        <TimerDisplay />
        
        <div className="space-y-4">
          <TaskForm />
          <TaskList />
        </div>
      </div>
    </div>
  );
}

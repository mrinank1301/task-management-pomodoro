import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import type { Task, TaskStats } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Trash2, Play } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function calculateStats(tasks: Task[]): TaskStats {
  const completedTasks = tasks.filter(t => t.completed).length;
  const totalSessions = tasks.reduce((sum, t) => sum + t.currentSession, 0);
  const averageSessionsPerTask = tasks.length ? totalSessions / tasks.length : 0;

  return {
    completedTasks,
    totalSessions,
    averageSessionsPerTask,
  };
}

export function TaskList() {
  const { data: tasks, isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
  });

  if (isLoading) {
    return <div className="text-center">Loading tasks...</div>;
  }

  if (!tasks?.length) {
    return (
      <div className="text-center text-muted-foreground">
        No tasks yet. Add one above!
      </div>
    );
  }

  const stats = calculateStats(tasks);

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-primary/5">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">{stats.completedTasks}</div>
            <div className="text-sm text-muted-foreground">Completed Tasks</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{stats.totalSessions}</div>
            <div className="text-sm text-muted-foreground">Total Sessions</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{stats.averageSessionsPerTask.toFixed(1)}</div>
            <div className="text-sm text-muted-foreground">Avg Sessions/Task</div>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        {tasks.map((task) => (
          <Card key={task.id} className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{task.title}</span>
                  <Badge variant={
                    task.priority === "high" ? "destructive" :
                    task.priority === "medium" ? "default" :
                    "secondary"
                  }>
                    {task.priority}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteMutation.mutate(task.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {task.description && (
                <p className="text-sm text-muted-foreground">{task.description}</p>
              )}

              <div className="flex flex-wrap gap-2">
                {task.categories.map((category, index) => (
                  <Badge key={index} variant="outline">
                    {category}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                {task.customTimerDuration && (
                  <span>Timer: {task.customTimerDuration}min</span>
                )}
                {task.currentSession > 0 && (
                  <span>Sessions: {task.currentSession}</span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
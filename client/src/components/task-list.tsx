import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import type { Task } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Trash2, Play } from "lucide-react";
import { Card } from "@/components/ui/card";

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

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task.id} className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="font-medium">{task.title}</span>
              {task.currentSession > 0 && (
                <span className="text-sm text-muted-foreground">
                  Sessions: {task.currentSession}
                </span>
              )}
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
        </Card>
      ))}
    </div>
  );
}

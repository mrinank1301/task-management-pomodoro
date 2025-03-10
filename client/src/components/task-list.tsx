import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import type { Task, TaskStats } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Trash2, MessageSquarePlus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { TaskFilters } from "./task-filters";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

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
  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
  });

  const toggleCompleteMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: number; completed: boolean }) => {
      await apiRequest("PATCH", `/api/tasks/${id}`, { completed });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
  });

  const addNoteMutation = useMutation({
    mutationFn: async ({ id, notes }: { id: number; notes: string[] }) => {
      await apiRequest("PATCH", `/api/tasks/${id}`, { notes });
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

  const displayTasks = filteredTasks.length > 0 ? filteredTasks : tasks;
  const stats = calculateStats(displayTasks);
  const activeTasks = displayTasks.filter(t => !t.completed);
  const completedTasks = displayTasks.filter(t => t.completed);

  return (
    <div className="space-y-6">
      <TaskFilters tasks={tasks} onFilterChange={setFilteredTasks} />

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
        <h2 className="text-lg font-semibold">Active Tasks ({activeTasks.length})</h2>
        {activeTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDelete={() => deleteMutation.mutate(task.id)}
            onToggleComplete={(completed) => toggleCompleteMutation.mutate({ id: task.id, completed })}
            onAddNote={(notes) => addNoteMutation.mutate({ id: task.id, notes })}
          />
        ))}
      </div>

      {completedTasks.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Completed Tasks ({completedTasks.length})</h2>
          {completedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={() => deleteMutation.mutate(task.id)}
              onToggleComplete={(completed) => toggleCompleteMutation.mutate({ id: task.id, completed })}
              onAddNote={(notes) => addNoteMutation.mutate({ id: task.id, notes })}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface TaskCardProps {
  task: Task;
  onDelete: () => void;
  onToggleComplete: (completed: boolean) => void;
  onAddNote: (notes: string[]) => void;
}

function TaskCard({ task, onDelete, onToggleComplete, onAddNote }: TaskCardProps) {
  const [newNote, setNewNote] = useState("");
  const { toast } = useToast();

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    const updatedNotes = [...(task.notes || []), newNote.trim()];
    onAddNote(updatedNotes);
    setNewNote("");
    toast({
      description: "Note added successfully",
    });
  };

  return (
    <Card className={`p-4 ${task.completed ? 'bg-muted/50' : ''}`}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={task.completed}
              onCheckedChange={(checked) => onToggleComplete(checked as boolean)}
            />
            <span className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
              {task.title}
            </span>
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
              onClick={() => onDelete()}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {task.description && (
          <p className={`text-sm ${task.completed ? 'text-muted-foreground/70' : 'text-muted-foreground'}`}>
            {task.description}
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          {task.categories.map((category, index) => (
            <Badge key={index} variant="outline">
              {category}
            </Badge>
          ))}
        </div>

        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Add a note..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddNote();
                }
              }}
            />
            <Button
              size="sm"
              variant="outline"
              onClick={handleAddNote}
            >
              <MessageSquarePlus className="h-4 w-4" />
            </Button>
          </div>

          {task.notes && task.notes.length > 0 && (
            <div className="pl-4 border-l-2 border-muted space-y-1">
              {task.notes.map((note, index) => (
                <p key={index} className="text-sm text-muted-foreground">
                  {note}
                </p>
              ))}
            </div>
          )}
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
  );
}
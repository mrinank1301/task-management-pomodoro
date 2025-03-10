import { useTimer } from "@/lib/hooks/useTimer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, RotateCcw } from "lucide-react";
import { POMODORO_WORK_MINUTES, POMODORO_BREAK_MINUTES } from "@shared/schema";

export function TimerDisplay() {
  const { minutes, seconds, isRunning, isBreak, progress, toggle, reset } = useTimer();

  return (
    <Card className="p-6">
      <div className="text-center space-y-4">
        <div className="text-6xl font-mono tabular-nums">
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </div>

        <Progress value={progress} className="h-2" />

        <div className="text-lg font-medium text-muted-foreground">
          {isBreak ? "Break Time" : "Work Time"}
        </div>

        <div className="flex justify-center gap-2">
          <Button onClick={toggle} size="lg">
            {isRunning ? (
              <Pause className="h-4 w-4 mr-2" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            {isRunning ? "Pause" : "Start"}
          </Button>
          <Button onClick={reset} variant="outline" size="lg">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>
    </Card>
  );
}
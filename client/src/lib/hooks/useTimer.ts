import { useState, useEffect, useCallback } from 'react';
import { POMODORO_WORK_MINUTES, POMODORO_BREAK_MINUTES } from '@shared/schema';
import { showNotification } from '../notification';

export function useTimer(customDuration?: number) {
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState((customDuration || POMODORO_WORK_MINUTES) * 60);
  const [isBreak, setIsBreak] = useState(false);

  const reset = useCallback(() => {
    setTimeLeft((customDuration || POMODORO_WORK_MINUTES) * 60);
    setIsBreak(false);
    setIsRunning(false);
  }, [customDuration]);

  const toggle = useCallback(() => {
    setIsRunning(prev => !prev);
  }, []);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          const message = isBreak
            ? "Break time is over! Ready to work?"
            : "Time for a break!";

          showNotification(message);
          setIsBreak(prev => !prev);
          return (isBreak ? (customDuration || POMODORO_WORK_MINUTES) : POMODORO_BREAK_MINUTES) * 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, isBreak, customDuration]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // Calculate progress percentage
  const totalSeconds = (isBreak ? POMODORO_BREAK_MINUTES : (customDuration || POMODORO_WORK_MINUTES)) * 60;
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;

  return {
    minutes,
    seconds,
    isRunning,
    isBreak,
    progress,
    toggle,
    reset
  };
}
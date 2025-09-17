import { GameConfig } from "@/types/game";

export const GAME_CONFIG: GameConfig = {
  timePerLevel: 30,
  maxLevel: 20,
  baseScore: 10,
};

export const calculateScore = (level: number, timeLeft: number): number => {
  return level * GAME_CONFIG.baseScore + timeLeft * 2;
};

export const generateSequence = (level: number): number[] => {
  const length = Math.min(3 + level, 8); // Increasing difficulty
  return Array.from({ length }, () => Math.floor(Math.random() * 9) + 1);
};

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

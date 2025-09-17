export interface GameState {
  status: "menu" | "playing" | "gameOver";
  score: number;
  level: number;
  playerName: string;
}

export interface Score {
  id: string;
  playerName: string;
  score: number;
  createdAt: string;
}

export interface GameConfig {
  timePerLevel: number;
  maxLevel: number;
  baseScore: number;
}

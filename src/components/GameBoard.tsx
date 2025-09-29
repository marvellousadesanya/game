"use client";

import { useState, useEffect, useCallback } from "react";

interface GameBoardProps {
  onScoreUpdate: (score: number) => void;
  onGameEnd: (finalScore: number) => void;
}

// Simple puzzle game - number sequence puzzle
export default function GameBoard({
  onScoreUpdate,
  onGameEnd,
}: GameBoardProps) {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameStatus, setGameStatus] = useState<
    "waiting" | "playing" | "checking"
  >("waiting");

  // Generate a sequence for the current level
  const generateSequence = useCallback(() => {
    const length = Math.min(3 + currentLevel, 8); // Increasing difficulty
    const newSequence = Array.from(
      { length },
      () => Math.floor(Math.random() * 9) + 1
    );
    setSequence(newSequence);
    setUserInput("");
    setGameStatus("playing");
  }, [currentLevel]);

  // Start the game
  useEffect(() => {
    if (gameStatus === "waiting") {
      generateSequence();
    }
  }, [gameStatus, generateSequence]);

  // Timer countdown
  useEffect(() => {
    if (gameStatus === "playing" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameStatus("checking");
      onGameEnd(score);
    }
  }, [timeLeft, gameStatus, score, onGameEnd]);

  const checkAnswer = () => {
    if (gameStatus !== "playing") return;

    const userSequence = userInput
      .split("")
      .map(Number)
      .filter((n) => !isNaN(n));

    if (JSON.stringify(userSequence) === JSON.stringify(sequence)) {
      const levelScore = currentLevel * 10 + timeLeft * 2;
      const newScore = score + levelScore;
      setScore(newScore);
      onScoreUpdate(newScore);

      setCurrentLevel(currentLevel + 1);
      setTimeLeft(30);
      setGameStatus("waiting");
    } else {
      // Wrong answer - end game
      onGameEnd(score);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      checkAnswer();
    }
  };

  return (
    <div className="game-card p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 md:mb-6 space-y-2 sm:space-y-0">
        <div className="text-base md:text-lg font-semibold">
          Level: {currentLevel}
        </div>
        <div className="text-base md:text-lg font-semibold text-game-text">
          Score: {score}
        </div>
        <div className="text-base md:text-lg font-semibold">
          Time:{" "}
          <span className={timeLeft <= 10 ? "text-red-500" : "text-white"}>
            {timeLeft}s
          </span>
        </div>
      </div>

      <div className="text-center mb-4 md:mb-6">
        <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">
          Memorize this sequence:
        </h3>
        <div className="flex justify-center flex-wrap gap-2 mb-4">
          {sequence.map((num, index) => (
            <div
              key={index}
              className="w-10 h-10 md:w-12 md:h-12 bg-primary-600 text-white rounded-lg flex items-center justify-center text-lg md:text-xl font-bold">
              {num}
            </div>
          ))}
        </div>

        {gameStatus === "playing" && (
          <div className="mt-4">
            <p className="text-sm text-gray-300 mb-2">
              Now enter the sequence:
            </p>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="game-input text-center text-lg md:text-xl w-full max-w-xs"
              placeholder="Enter numbers..."
              maxLength={sequence.length}
            />
            <div className="mt-3">
              <button
                onClick={checkAnswer}
                className="game-button text-sm md:text-base py-2 md:py-2 px-4 md:px-4"
                disabled={userInput.length !== sequence.length}>
                Check Answer
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="text-center text-xs md:text-sm text-gray-400">
        <p>Enter the numbers in the correct order</p>
        <p>You have 30 seconds per level</p>
      </div>
    </div>
  );
}

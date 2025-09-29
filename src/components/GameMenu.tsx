"use client";

import { useState } from "react";

interface GameMenuProps {
  onStartGame: (playerName: string) => void;
}

export default function GameMenu({ onStartGame }: GameMenuProps) {
  const [playerName, setPlayerName] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);

  const handleStart = () => {
    if (playerName.trim()) {
      onStartGame(playerName.trim());
    }
  };

  const handleQuickStart = () => {
    onStartGame("Anonymous Player");
  };

  return (
    <div className="max-w-md mx-auto px-4">
      <div className="game-card p-6 md:p-8 text-center">
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">
          Choose Your Adventure
        </h2>

        {!showNameInput ? (
          <div className="space-y-3 md:space-y-4">
            <button
              onClick={() => setShowNameInput(true)}
              className="game-button w-full text-sm md:text-base py-3 md:py-2">
              Enter Your Name
            </button>
            <button
              onClick={handleQuickStart}
              className="game-button w-full bg-gray-600 hover:bg-gray-700 text-sm md:text-base py-3 md:py-2">
              Quick Start (Anonymous)
            </button>
          </div>
        ) : (
          <div className="space-y-3 md:space-y-4">
            <div>
              <label
                htmlFor="playerName"
                className="block text-sm font-medium mb-2">
                Enter your name:
              </label>
              <input
                id="playerName"
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleStart()}
                className="game-input w-full text-sm md:text-base"
                placeholder="Your name here..."
                autoFocus
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleStart}
                disabled={!playerName.trim()}
                className="game-button flex-1 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base py-3 md:py-2">
                Start Game
              </button>
              <button
                onClick={() => setShowNameInput(false)}
                className="game-button flex-1 bg-gray-600 hover:bg-gray-700 text-sm md:text-base py-3 md:py-2">
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

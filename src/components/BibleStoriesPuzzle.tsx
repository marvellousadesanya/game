"use client";

import { useState, useEffect, useRef } from "react";

interface PuzzlePiece {
  id: number;
  originalIndex: number;
  currentIndex: number;
  backgroundPosition: { x: number; y: number };
}

const imageUrls = [
  "https://res.cloudinary.com/dggeuuu1n/image/upload/v1753139844/Image_fx_28_kbgaoo.png",
  "https://res.cloudinary.com/dggeuuu1n/image/upload/v1753139826/Image_fx_21_gk3kgb.png",
  "https://res.cloudinary.com/dggeuuu1n/image/upload/v1753139816/Image_fx_19_m9xlj0.png",
  "https://res.cloudinary.com/dggeuuu1n/image/upload/v1753139781/Image_fx_23_c5o5rm.png",
  "https://res.cloudinary.com/dggeuuu1n/image/upload/v1753139719/Image_fx_27_l7kd3r.png",
  "https://res.cloudinary.com/dggeuuu1n/image/upload/v1753139678/Image_fx_22_mlhzrf.png",
];

const imageTitles = [
  "Bible Stories Puzzle 1",
  "Bible Stories Puzzle 2",
  "Bible Stories Puzzle 3",
  "Bible Stories Puzzle 4",
  "Bible Stories Puzzle 5",
  "Bible Stories Puzzle 6",
];

export default function BibleStoriesPuzzle() {
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [title, setTitle] = useState("Bible Stories Puzzle");
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [draggedPiece, setDraggedPiece] = useState<number | null>(null);
  const [touchStartPos, setTouchStartPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [currentTouchTarget, setCurrentTouchTarget] =
    useState<HTMLElement | null>(null);

  // Timer and scoring states
  const [timeLeft, setTimeLeft] = useState(25);
  const [score, setScore] = useState(0);
  const [puzzleNumber, setPuzzleNumber] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [timerActive, setTimerActive] = useState(false);

  // Game flow states
  const [gameState, setGameState] = useState<
    "nameInput" | "playing" | "finalScore"
  >("nameInput");
  const [playerName, setPlayerName] = useState("");
  const [finalScore, setFinalScore] = useState(0);
  const [showNameInput, setShowNameInput] = useState(true);

  const puzzleContainerRef = useRef<HTMLDivElement>(null);
  const rows = 3;
  const cols = 3;
  const totalPieces = rows * cols;

  // Preload image function
  const preloadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });
  };

  // Move to next puzzle
  const nextPuzzle = async () => {
    const nextPuzzleNum = puzzleNumber + 1;

    // Check if we've completed all puzzles (6 total)
    if (nextPuzzleNum > imageUrls.length) {
      // Game completed!
      setFinalScore(score);
      setGameState("finalScore");
      return;
    }

    setPuzzleNumber(nextPuzzleNum);
    setTimeLeft(25);
    setIsSolved(false);
    setMessage("");
    setPieces([]);

    // Start timer for next puzzle
    setTimerActive(true);

    await generateImage();
  };

  // Generate random image and initialize puzzle
  const generateImage = async () => {
    setIsLoading(true);
    setMessage("");
    setIsSolved(false);
    setPieces([]);

    try {
      const randomIndex = Math.floor(Math.random() * imageUrls.length);
      const selectedImageUrl = imageUrls[randomIndex];
      const selectedTitle = imageTitles[randomIndex];

      await preloadImage(selectedImageUrl);

      setImageUrl(selectedImageUrl);
      setTitle(selectedTitle);

      initializePuzzle(selectedImageUrl);

      // Start timer when puzzle is ready (for subsequent puzzles)
      if (gameStarted && gameState === "playing") {
        setTimerActive(true);
      }
    } catch (error) {
      console.error("Error loading image:", error);
      setMessage(
        `Error loading image: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Start the game
  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setPuzzleNumber(1);
    setTimeLeft(25);
    setGameState("playing");
    // Start the timer immediately when game starts
    setTimerActive(true);
    generateImage();
  };

  // Handle name submission
  const handleNameSubmit = (name: string) => {
    setPlayerName(name || "Anonymous");
    setShowNameInput(false);
    startGame();
  };

  // Play again
  const playAgain = () => {
    setGameState("nameInput");
    setPlayerName("");
    setScore(0);
    setPuzzleNumber(1);
    setTimeLeft(25);
    setGameStarted(false);
    setTimerActive(false);
    setMessage("");
    setFinalScore(0);
    setShowNameInput(true);
  };

  // Initialize puzzle pieces
  const initializePuzzle = (imageUrl: string) => {
    const newPieces: PuzzlePiece[] = [];

    for (let i = 0; i < totalPieces; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const backgroundX = col * 50; // 0, 50, 100
      const backgroundY = row * 50; // 0, 50, 100

      newPieces.push({
        id: i,
        originalIndex: i,
        currentIndex: i,
        backgroundPosition: { x: backgroundX, y: backgroundY },
      });
    }

    // Shuffle the pieces and set them
    const shuffled = [...newPieces];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const shuffledPieces = shuffled.map((piece, index) => ({
      ...piece,
      currentIndex: index,
    }));

    setPieces(shuffledPieces);
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setTimerActive(false);
            // Time's up! Move to next puzzle
            setTimeout(() => {
              nextPuzzle();
            }, 1000);
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timeLeft]);

  // Check if puzzle is solved
  const checkWinCondition = (currentPieces: PuzzlePiece[]) => {
    const solved = currentPieces.every(
      (piece, index) => piece.originalIndex === index
    );
    if (solved) {
      setIsSolved(true);
      setTimerActive(false);

      if (timeLeft > 0) {
        // Solved within time limit!
        setScore((prev) => prev + 1);
        setMessage(`Excellent! +1 point! Time left: ${timeLeft}s`);
        setIsError(false);

        // Move to next puzzle after 2 seconds
        setTimeout(() => {
          nextPuzzle();
        }, 2000);
      } else {
        // Solved but time ran out
        setMessage("Good job, but time's up! No points this time.");
        setIsError(true);

        setTimeout(() => {
          nextPuzzle();
        }, 2000);
      }
    }
    return solved;
  };

  // Swap two pieces
  const swapPieces = (piece1Index: number, piece2Index: number) => {
    setPieces((prevPieces) => {
      const newPieces = [...prevPieces];
      [newPieces[piece1Index], newPieces[piece2Index]] = [
        newPieces[piece2Index],
        newPieces[piece1Index],
      ];

      const updatedPieces = newPieces.map((piece, index) => ({
        ...piece,
        currentIndex: index,
      }));

      checkWinCondition(updatedPieces);
      return updatedPieces;
    });
  };

  // Mouse event handlers
  const handleDragStart = (e: React.DragEvent, pieceIndex: number) => {
    setDraggedPiece(pieceIndex);
    e.dataTransfer.setData("text/plain", pieceIndex.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedPiece !== null && draggedPiece !== targetIndex) {
      swapPieces(draggedPiece, targetIndex);
    }
    setDraggedPiece(null);
  };

  const handleDragEnd = () => {
    setDraggedPiece(null);
  };

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent, pieceIndex: number) => {
    e.preventDefault();
    const touch = e.touches[0];
    setTouchStartPos({ x: touch.clientX, y: touch.clientY });
    setCurrentTouchTarget(e.currentTarget as HTMLElement);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !currentTouchTarget) return;

    e.preventDefault();
    const touch = e.touches[0];

    const moveDistance = Math.sqrt(
      Math.pow(touch.clientX - touchStartPos.x, 2) +
        Math.pow(touch.clientY - touchStartPos.y, 2)
    );

    if (moveDistance > 10) {
      // Visual feedback for dragging
      currentTouchTarget.classList.add("dragging");
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging || !currentTouchTarget) return;

    e.preventDefault();
    const touch = e.changedTouches[0];
    const elementBelow = document.elementFromPoint(
      touch.clientX,
      touch.clientY
    );
    const targetPiece = elementBelow?.closest(".puzzle-piece") as HTMLElement;

    if (targetPiece && targetPiece !== currentTouchTarget) {
      const targetIndex = parseInt(targetPiece.dataset.pieceIndex || "0");
      const sourceIndex = parseInt(
        currentTouchTarget.dataset.pieceIndex || "0"
      );
      if (sourceIndex !== targetIndex) {
        swapPieces(sourceIndex, targetIndex);
      }
    }

    // Clean up
    currentTouchTarget.classList.remove("dragging");
    setIsDragging(false);
    setCurrentTouchTarget(null);
  };

  // Initialize on mount - don't auto-start
  useEffect(() => {
    // Just set up the first image without starting timer
    generateImage();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Name Input Screen
  if (gameState === "nameInput") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-5">
        <div className="game-card p-8 max-w-md w-full">
          <h1 className="game-title text-5xl font-extrabold mb-6 text-center">
            🎮 Bible Stories Puzzle Challenge
          </h1>
          <p className="text-gray-600 text-center mb-8 text-lg font-medium">
            ⏱️ Solve 6 Bible story puzzles in 25 seconds each!
          </p>

          <div className="space-y-6">
            <div>
              <label
                htmlFor="playerName"
                className="block text-sm font-semibold text-gray-700 mb-3">
                👤 Enter your name (optional):
              </label>
              <input
                id="playerName"
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Anonymous Player"
                className="game-input w-full"
              />
            </div>

            <button
              onClick={() => handleNameSubmit(playerName)}
              className="game-button w-full text-lg py-4">
              🚀 Start Challenge
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Final Score Screen
  if (gameState === "finalScore") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-5">
        <div className="game-card p-8 max-w-md w-full text-center">
          <h1 className="game-title text-5xl font-extrabold mb-6">
            🎉 Challenge Complete!
          </h1>

          <div className="space-y-6 mb-8">
            <div className="text-2xl">
              <span className="text-gray-600">👤 Player: </span>
              <span className="font-bold text-blue-600">{playerName}</span>
            </div>

            <div
              className={`text-5xl score-celebration ${
                finalScore === 6
                  ? "text-yellow-500"
                  : finalScore >= 4
                  ? "text-green-500"
                  : finalScore >= 2
                  ? "text-orange-500"
                  : "text-red-500"
              }`}>
              <span className="text-gray-600">🏆 Final Score: </span>
              <span className="font-bold">{finalScore}/6</span>
            </div>

            <div className="text-xl text-gray-600 font-medium">
              {finalScore === 6
                ? "🌟 Perfect! You solved all puzzles!"
                : finalScore >= 4
                ? "🎯 Great job! Well done!"
                : finalScore >= 2
                ? "💪 Good effort! Keep practicing!"
                : "🔥 Keep trying! You'll get better!"}
            </div>
          </div>

          <button
            onClick={playAgain}
            className="game-button w-full text-lg py-4">
            🔄 Play Again
          </button>
        </div>
      </div>
    );
  }

  // Game Screen
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-5">
      <h1 className="game-title text-4xl font-extrabold mb-6 text-center">
        🎮 Bible Stories Puzzle Challenge
      </h1>

      {/* Game Stats */}
      <div className="flex justify-center space-x-4 mb-6 text-lg font-semibold flex-wrap">
        <div className="game-stats">
          <span className="text-gray-600">👤 </span>
          <span className="text-blue-600 font-bold">{playerName}</span>
        </div>
        <div className="game-stats">
          <span className="text-gray-600">🏆 Score: </span>
          <span className="text-green-600 font-bold">{score}</span>
        </div>
        <div className="game-stats">
          <span className="text-gray-600">🧩 Puzzle: </span>
          <span className="text-purple-600 font-bold">{puzzleNumber}/6</span>
        </div>
        <div
          className={`game-stats font-bold ${
            timeLeft <= 5
              ? "bg-red-500 text-white timer-critical"
              : timeLeft <= 10
              ? "bg-yellow-500 text-white"
              : "bg-green-500 text-white"
          }`}>
          <span>⏱️ Time: </span>
          <span>{timeLeft}s</span>
        </div>
      </div>

      <div
        ref={puzzleContainerRef}
        className="puzzle-container"
        style={{
          display: "grid",
          gap: "2px",
          border: "5px solid #4a90e2",
          borderRadius: "10px",
          boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
          backgroundColor: "#fff",
          padding: "5px",
          width: "600px",
          height: "600px",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridTemplateRows: "repeat(3, 1fr)",
          userSelect: "none",
        }}>
        {pieces.length > 0 ? (
          pieces.map((piece, index) => (
            <div
              key={piece.id}
              className={`puzzle-piece ${
                draggedPiece === index ? "dragging" : ""
              } ${piece.originalIndex === index ? "correct" : ""}`}
              style={{
                backgroundImage: `url(${imageUrl})`,
                backgroundPosition: `${piece.backgroundPosition.x}% ${piece.backgroundPosition.y}%`,
                backgroundSize: "300% 300%",
                backgroundRepeat: "no-repeat",
                cursor: "grab",
                border: "1px solid rgba(0, 0, 0, 0.1)",
                boxSizing: "border-box",
                transition: "transform 0.1s ease-in-out",
                borderRadius: "5px",
                minHeight: "190px",
                minWidth: "190px",
                userSelect: "none",
                WebkitUserSelect: "none",
                MozUserSelect: "none",
                msUserSelect: "none",
                WebkitTouchCallout: "none",
                WebkitTapHighlightColor: "transparent",
              }}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              onTouchStart={(e) => handleTouchStart(e, index)}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              data-piece-index={index}
            />
          ))
        ) : (
          <div className="col-span-3 row-span-3 flex items-center justify-center text-gray-500">
            {isLoading
              ? "Loading puzzle pieces..."
              : "No puzzle pieces available"}
          </div>
        )}
      </div>

      {message && (
        <div
          className={`message-box mt-5 px-8 py-4 rounded-lg shadow-lg text-center text-xl font-bold max-w-[80vw] ${
            isError ? "bg-red-500" : "bg-green-500"
          } text-white`}>
          {message}
        </div>
      )}

      <div className="mt-6">
        <button
          onClick={playAgain}
          className="game-button bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 min-h-[44px]">
          🔄 Restart Game
        </button>
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center text-white text-2xl z-50">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-white border-t-transparent mb-6"></div>
          <span className="text-3xl font-bold">🎮 Loading puzzle...</span>
          <span className="text-lg mt-2 opacity-80">Please wait!</span>
        </div>
      )}
    </div>
  );
}

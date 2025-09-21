import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const GRID_SIZE = 24;
const INITIAL_SNAKE = [{ x: 12, y: 12 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const INITIAL_FOOD = { x: 18, y: 18 };
const INITIAL_SPEED = 180;
const SPEED_INCREMENT = 10;
const SPEED_INCREASE_INTERVAL = 3;

const SMILEY_DOTS = [
  // Left eye
  22, 23, 32, 33,
  // Right eye
  26, 27, 36, 37,
  // Smile
  62, 73, 74, 75, 76, 67,
];

interface SnakeGameProps {
  onWin?: () => void;
  onPlayAgain?: () => void;
}

const SnakeGame = ({ onWin, onPlayAgain }: SnakeGameProps) => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const [gameSuccess, setGameSuccess] = useState(false);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [revealedDots, setRevealedDots] = useState<number[]>([]);
  const [foodEaten, setFoodEaten] = useState(false);

  const generateFood = useCallback((currentSnake: typeof snake) => {
    let newFood: { x: number; y: number };
    do {
      newFood = {
        x: Math.floor(Math.random() * (GRID_SIZE - 2)),
        y: Math.floor(Math.random() * (GRID_SIZE - 2) + 1),
      };
    } while (
      currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y,
      )
    );
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(INITIAL_FOOD);
    setGameOver(false);
    setGameSuccess(false);
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setRevealedDots([]); // Reset revealed dots
    setFoodEaten(false); // Reset food eaten flag
    setGamePaused(false); // Reset pause state
  };

  const startGame = () => {
    if (!gameStarted) {
      setGameStarted(true);
    } else {
      resetGame();
    }

    onPlayAgain?.();
  };

  const skipGame = () => {
    if (gameStarted && !gameOver) {
      // Toggle pause if game is running
      setGamePaused(!gamePaused);
    } else {
      // Reset everything if not started or game over
      setGameStarted(false);
      resetGame();
    }
  };

  const getSegmentColor = (index: number, totalLength: number) => {
    if (index === 0) return "bg-teal-300"; // Head - brightest

    if (totalLength >= 3) {
      // Create gradient effect for snakes 3+ segments long
      const ratio = index / (totalLength - 1);
      if (ratio < 0.3)
        return "bg-teal-300"; // Bright near head
      else if (ratio < 0.6)
        return "bg-teal-400"; // Medium
      else if (ratio < 0.8)
        return "bg-teal-500"; // Darker
      else return "bg-teal-600"; // Darkest at tail
    } else {
      return "bg-teal-400"; // Default for short snakes
    }
  };

  // Handle speed increase when score changes
  useEffect(() => {
    if (score > 0 && score % SPEED_INCREASE_INTERVAL === 0) {
      setSpeed((currentSpeed) => Math.max(currentSpeed - SPEED_INCREMENT, 60));
    }
  }, [score]);

  // Handle score increase when food is eaten
  useEffect(() => {
    if (foodEaten) {
      setScore((prevScore) => prevScore + 1);

      setFood((prevFood) => {
        return generateFood(snake);
      });

      setFoodEaten(false);
    }
  }, [foodEaten, snake, generateFood]);

  // Handle smiley progress when score changes
  useEffect(() => {
    if (score > 0 && score - 1 < SMILEY_DOTS.length) {
      const nextDotIndex = SMILEY_DOTS[score - 1]; // score-1 to get the correct index (0-based)
      setRevealedDots((prevRevealed) => {
        if (!prevRevealed.includes(nextDotIndex)) {
          const newRevealed = [...prevRevealed, nextDotIndex];

          if (newRevealed.length === SMILEY_DOTS.length) {
            setGameSuccess(true);
            setGamePaused(true);

            setTimeout(() => {
              onWin?.();
            }, 0);
          }

          return newRevealed;
        }

        return prevRevealed;
      });
    }
  }, [score, onWin]);

  const moveSnake = useCallback(() => {
    if (!gameStarted || gameOver || gamePaused || gameSuccess) return;

    setSnake((prevSnake) => {
      const newSnake = [...prevSnake];
      const head = { ...newSnake[0] };

      head.x += direction.x;
      head.y += direction.y;

      // Check wall collision
      if (
        head.x < 0 ||
        head.x >= GRID_SIZE ||
        head.y < 0 ||
        head.y >= GRID_SIZE
      ) {
        setGameOver(true);
        return prevSnake;
      }

      // Check self collision
      if (
        newSnake.some((segment) => segment.x === head.x && segment.y === head.y)
      ) {
        setGameOver(true);
        return prevSnake;
      }

      newSnake.unshift(head);

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setFoodEaten(true); // Trigger food eaten flag
        // Don't pop - snake grows
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameStarted, gameOver, gamePaused, gameSuccess]); // Keep necessary dependencies

  // Game loop with dynamic speed
  useEffect(() => {
    const gameInterval = setInterval(moveSnake, speed);
    return () => clearInterval(gameInterval);
  }, [moveSnake, speed]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStarted || gameOver || gamePaused) return;

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          setDirection((prev) => (prev.y !== 1 ? { x: 0, y: -1 } : prev));
          break;
        case "ArrowDown":
          e.preventDefault();
          setDirection((prev) => (prev.y !== -1 ? { x: 0, y: 1 } : prev));
          break;
        case "ArrowLeft":
          e.preventDefault();
          setDirection((prev) => (prev.x !== 1 ? { x: -1, y: 0 } : prev));
          break;
        case "ArrowRight":
          e.preventDefault();
          setDirection((prev) => (prev.x !== -1 ? { x: 1, y: 0 } : prev));
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameStarted, gameOver, gamePaused]);

  return (
    <div className="flex gap-6">
      {/* Game Container */}
      <div className="bg-slate-800/80 rounded-lg p-4">
        <div className="relative">
          {/* Game Area - Smaller size */}
          <div className="size-80 bg-slate-900 border-2 border-teal-400 rounded relative overflow-hidden mb-4">
            {/* Grid with smaller cells */}
            <div className="absolute inset-0 grid grid-cols-24 grid-rows-24">
              {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
                const x = index % GRID_SIZE;
                const y = Math.floor(index / GRID_SIZE);

                const snakeSegmentIndex = snake.findIndex(
                  (segment) => segment.x === x && segment.y === y,
                );
                const isSnake = snakeSegmentIndex !== -1;
                const isFood = food.x === x && food.y === y;

                return (
                  <div
                    key={index}
                    className={`w-3 h-3 ${
                      isSnake
                        ? getSegmentColor(snakeSegmentIndex, snake.length)
                        : isFood
                          ? "bg-red-400 rounded-full"
                          : ""
                    } ${isSnake ? "rounded-sm" : ""}`}
                  />
                );
              })}
            </div>

            {/* Game Over Overlay */}
            {gameOver && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-red-400 text-lg font-bold mb-2">
                    Game Over!
                  </div>
                  <div className="text-gray-300 text-sm">Score: {score}</div>
                </div>
              </div>
            )}

            {/* Pause Screen */}
            {gameStarted && gamePaused && !gameOver && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-yellow-400 text-lg font-bold mb-2">
                    {gameSuccess ? "Game Won!" : "Game Paused"}
                  </div>
                  <div className="text-gray-300 text-xs mb-2">
                    {gameSuccess
                      ? "Press start to play again"
                      : "Click unpause to continue"}
                  </div>
                </div>
              </div>
            )}

            {/* Start Screen */}
            {!gameStarted && !gameOver && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-teal-400 text-lg font-bold mb-2">
                    Let&apos;s play Snake!
                  </div>
                  <div className="text-gray-300 text-sm mb-2">
                    Press start to begin
                  </div>
                </div>
              </div>
            )}

            {/* Arrow keys indicator */}
            {!gameStarted && (
              <div className="absolute top-2 right-6">
                <div className="grid grid-cols-3 gap-1">
                  <div></div>
                  <div className="w-5 h-5 bg-gray-700 rounded flex items-center justify-center text-xs">
                    ▲
                  </div>
                  <div></div>
                  <div className="w-5 h-5 bg-gray-700 rounded flex items-center justify-center text-xs">
                    ◄
                  </div>
                  <div className="w-5 h-5 bg-gray-700 rounded flex items-center justify-center text-xs">
                    ▼
                  </div>
                  <div className="w-5 h-5 bg-gray-700 rounded flex items-center justify-center text-xs">
                    ►
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Game Controls */}
          <div className="flex justify-between pt-3">
            <Button
              onClick={startGame}
              className="bg-orange-400 hover:bg-orange-300 text-white px-3 py-2 rounded transition-colors text-sm"
            >
              {!gameStarted || gameSuccess
                ? "start-game"
                : gameOver
                  ? "restart"
                  : "reset"}
            </Button>
            {(gameStarted || gameOver) && !gameSuccess && (
              <Button
                variant="outline"
                onClick={skipGame}
                className="border border-gray-600 hover:border-gray-500 bg-transparent text-gray-300 px-3 py-2 rounded transition-colors text-sm"
              >
                {gameStarted && !gameOver
                  ? gamePaused
                    ? "unpause"
                    : "pause"
                  : gameOver
                    ? "reset"
                    : "skip"}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Score and Controls Panel */}
      <div className="flex-1 flex flex-col space-y-6 text-white/90 justify-between">
        {/* Drawing Section */}
        <div>
          <div className="bg-slate-800/50 rounded-lg p-4 border border-teal-500/30 relative">
            <div className="grid grid-cols-10 gap-1 w-fit mx-auto">
              {Array.from({ length: 100 }).map((_, index) => {
                // Check if this index is in our revealed dots array
                const isRevealed = revealedDots.includes(index);

                return (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                      isRevealed
                        ? "bg-yellow-400 shadow-sm shadow-yellow-400/50"
                        : "bg-slate-700/50"
                    }`}
                  />
                );
              })}
            </div>

            {!gameStarted && (
              <h3 className="text-teal-300 rotate-24 font-black text-3xl mb-3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center animate-pulse">
                ?!
              </h3>
            )}
          </div>

          {/* Score Section */}
          <div className="bg-slate-800/50 rounded-lg p-4 border border-teal-500/30 mt-6">
            <h3 className="text-teal-300 font-semibold text-lg ">
              Score: <span className="font-black text-orange-400">{score}</span>
            </h3>
          </div>
        </div>

        {/* Controls */}
        <div>
          <h3 className="text-teal-300 text-lg font-semibold mb-3">Controls</h3>
          <div className="grid grid-cols-3 gap-1 w-fit">
            <div></div>
            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded flex items-center justify-center text-sm border border-white/30">
              ↑
            </div>
            <div></div>
            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded flex items-center justify-center text-sm border border-white/30">
              ←
            </div>
            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded flex items-center justify-center text-sm border border-white/30">
              ↓
            </div>
            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded flex items-center justify-center text-sm border border-white/30">
              →
            </div>
          </div>
          <div className="text-xs text-white/60 mt-2">
            Use arrow keys to move
          </div>
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;

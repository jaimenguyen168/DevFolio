import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const GAME_WIDTH = 320;
const GAME_HEIGHT = 320;
const PADDLE_WIDTH = 60;
const PADDLE_HEIGHT = 8;
const BALL_SIZE = 8;
const BRICK_WIDTH = 32;
const BRICK_HEIGHT = 16;
const BRICK_ROWS = 5;
const BRICK_COLS = 9;
const INITIAL_BALL_SPEED = 2;
const PADDLE_SPEED = 8;

const INFINITY_DOTS = [
  // Left loop
  44, 33, 32, 31, 40, 51, 52, 53,

  // Right loop
  45, 36, 37, 38, 49, 58, 57, 56,
];

interface BreakoutGameProps {
  onWin?: () => void;
  onPlayAgain?: () => void;
}

interface Brick {
  x: number;
  y: number;
  width: number;
  height: number;
  destroyed: boolean;
  color: string;
}

const BreakoutGame = ({ onWin, onPlayAgain }: BreakoutGameProps) => {
  const [paddle, setPaddle] = useState({
    x: GAME_WIDTH / 2 - PADDLE_WIDTH / 2,
    y: GAME_HEIGHT - 30,
  });
  const [ball, setBall] = useState({
    x: GAME_WIDTH / 2 - BALL_SIZE / 2,
    y: GAME_HEIGHT - 30 - PADDLE_HEIGHT - BALL_SIZE - 2, // Start ball just above paddle
    dx: INITIAL_BALL_SPEED,
    dy: -INITIAL_BALL_SPEED,
  });
  const [bricks, setBricks] = useState<Brick[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const [gameSuccess, setGameSuccess] = useState(false);
  const [score, setScore] = useState(0);
  const [revealedDots, setRevealedDots] = useState<number[]>([]);
  const [keys, setKeys] = useState({ left: false, right: false });

  // Initialize bricks
  const initializeBricks = useCallback(() => {
    const newBricks: Brick[] = [];
    const colors = [
      "bg-red-400",
      "bg-orange-400",
      "bg-yellow-400",
      "bg-green-400",
      "bg-blue-400",
    ];

    for (let row = 0; row < BRICK_ROWS; row++) {
      for (let col = 0; col < BRICK_COLS; col++) {
        newBricks.push({
          x: col * (BRICK_WIDTH + 2) + 10,
          y: row * (BRICK_HEIGHT + 2) + 40,
          width: BRICK_WIDTH,
          height: BRICK_HEIGHT,
          destroyed: false,
          color: colors[row % colors.length],
        });
      }
    }
    return newBricks;
  }, []);

  const resetGame = () => {
    const paddleX = GAME_WIDTH / 2 - PADDLE_WIDTH / 2;
    const paddleY = GAME_HEIGHT - 30;

    setPaddle({ x: paddleX, y: paddleY });
    setBall({
      x: GAME_WIDTH / 2 - BALL_SIZE / 2,
      y: paddleY - PADDLE_HEIGHT - BALL_SIZE - 2, // Position ball just above paddle
      dx: INITIAL_BALL_SPEED,
      dy: -INITIAL_BALL_SPEED,
    });
    setBricks(initializeBricks());
    setGameOver(false);
    setGameSuccess(false);
    setScore(0);
    setRevealedDots([]);
    setGamePaused(false);
  };

  const startGame = () => {
    if (!gameStarted) {
      setGameStarted(true);
      setBricks(initializeBricks());
    } else {
      resetGame();
    }
    onPlayAgain?.();
  };

  const skipGame = () => {
    if (gameStarted && !gameOver) {
      setGamePaused(!gamePaused);
    } else {
      setGameStarted(false);
      resetGame();
    }
  };

  // Handle smiley progress when score changes
  useEffect(() => {
    if (score > 0 && score - 1 < INFINITY_DOTS.length) {
      const nextDotIndex = INFINITY_DOTS[score - 1];
      setRevealedDots((prevRevealed) => {
        if (!prevRevealed.includes(nextDotIndex)) {
          const newRevealed = [...prevRevealed, nextDotIndex];

          if (newRevealed.length === INFINITY_DOTS.length) {
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

  // Improved collision detection
  const checkCollision = (rect1: any, rect2: any) => {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  };

  const updateGame = useCallback(() => {
    if (!gameStarted || gameOver || gamePaused || gameSuccess) return;

    // Get current state values
    const currentBall = ball;
    const currentBricks = bricks;
    const currentPaddle = paddle;

    // Calculate new ball position
    let newBall = {
      x: currentBall.x + currentBall.dx,
      y: currentBall.y + currentBall.dy,
      dx: currentBall.dx,
      dy: currentBall.dy,
    };

    // Check if ball fell through bottom - GAME OVER
    if (newBall.y >= GAME_HEIGHT) {
      setGameOver(true);
      setGamePaused(true);
      return;
    }

    // Wall collisions
    if (newBall.x <= 0) {
      newBall.x = 0;
      newBall.dx = Math.abs(newBall.dx);
    }
    if (newBall.x >= GAME_WIDTH - BALL_SIZE) {
      newBall.x = GAME_WIDTH - BALL_SIZE;
      newBall.dx = -Math.abs(newBall.dx);
    }
    if (newBall.y <= 0) {
      newBall.y = 0;
      newBall.dy = Math.abs(newBall.dy);
    }

    // Paddle collision
    const ballRect = {
      x: newBall.x,
      y: newBall.y,
      width: BALL_SIZE,
      height: BALL_SIZE,
    };
    const paddleRect = {
      x: currentPaddle.x,
      y: currentPaddle.y,
      width: PADDLE_WIDTH,
      height: PADDLE_HEIGHT,
    };

    if (checkCollision(ballRect, paddleRect) && newBall.dy > 0) {
      newBall.y = currentPaddle.y - BALL_SIZE;
      newBall.dy = -Math.abs(newBall.dy);
      const paddleCenter = currentPaddle.x + PADDLE_WIDTH / 2;
      const ballCenter = newBall.x + BALL_SIZE / 2;
      const diff = (ballCenter - paddleCenter) / (PADDLE_WIDTH / 2);
      newBall.dx = diff * 3;
    }

    // Brick collisions
    const newBricks = [...currentBricks];
    let brickHit = false;
    let scoreIncrease = 0;

    for (let i = 0; i < newBricks.length; i++) {
      if (
        !newBricks[i].destroyed &&
        checkCollision(ballRect, newBricks[i]) &&
        !brickHit
      ) {
        newBricks[i].destroyed = true;
        brickHit = true;
        scoreIncrease = 1;

        const brick = newBricks[i];
        const ballCenterX = newBall.x + BALL_SIZE / 2;
        const ballCenterY = newBall.y + BALL_SIZE / 2;
        const brickCenterX = brick.x + brick.width / 2;
        const brickCenterY = brick.y + brick.height / 2;

        const deltaX = ballCenterX - brickCenterX;
        const deltaY = ballCenterY - brickCenterY;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          newBall.dx = -newBall.dx;
        } else {
          newBall.dy = -newBall.dy;
        }
        break;
      }
    }

    // Update paddle position
    let newPaddleX = currentPaddle.x;
    if (keys.left && newPaddleX > 0) {
      newPaddleX = Math.max(0, newPaddleX - PADDLE_SPEED);
    }
    if (keys.right && newPaddleX < GAME_WIDTH - PADDLE_WIDTH) {
      newPaddleX = Math.min(
        GAME_WIDTH - PADDLE_WIDTH,
        newPaddleX + PADDLE_SPEED,
      );
    }

    // Apply all state updates
    setBall(newBall);
    setBricks(newBricks);
    setPaddle((prev) => ({ ...prev, x: newPaddleX }));

    // Update score if brick was hit
    if (scoreIncrease > 0) {
      setScore((prev) => prev + scoreIncrease);
    }

    // Check win condition
    const remainingBricks = newBricks.filter((brick) => !brick.destroyed);
    if (remainingBricks.length === 0) {
      setGameSuccess(true);
      setGamePaused(true);
      setTimeout(() => onWin?.(), 100);
    }
  }, [
    gameStarted,
    gameOver,
    gamePaused,
    gameSuccess,
    ball,
    bricks,
    paddle,
    keys,
    onWin,
  ]);

  // Game loop interval
  useEffect(() => {
    const gameInterval = setInterval(updateGame, 16); // ~60fps
    return () => clearInterval(gameInterval);
  }, [updateGame]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          setKeys((prev) => ({ ...prev, left: true }));
          break;
        case "ArrowRight":
          e.preventDefault();
          setKeys((prev) => ({ ...prev, right: true }));
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          setKeys((prev) => ({ ...prev, left: false }));
          break;
        case "ArrowRight":
          e.preventDefault();
          setKeys((prev) => ({ ...prev, right: false }));
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <div className="flex gap-6">
      {/* Game Container */}
      <div className="bg-slate-800/80 rounded-lg p-4">
        <div className="relative">
          {/* Game Area */}
          <div
            className="bg-slate-900 border-2 border-teal-400 rounded relative overflow-hidden mb-4"
            style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
          >
            {/* Bricks */}
            {bricks.map(
              (brick, index) =>
                !brick.destroyed && (
                  <div
                    key={index}
                    className={`absolute ${brick.color} rounded-sm`}
                    style={{
                      left: brick.x,
                      top: brick.y,
                      width: brick.width,
                      height: brick.height,
                    }}
                  />
                ),
            )}

            {/* Ball */}
            <div
              className="absolute bg-white rounded-full"
              style={{
                left: ball.x,
                top: ball.y,
                width: BALL_SIZE,
                height: BALL_SIZE,
              }}
            />

            {/* Paddle */}
            <div
              className="absolute bg-teal-400 rounded"
              style={{
                left: paddle.x,
                top: paddle.y,
                width: PADDLE_WIDTH,
                height: PADDLE_HEIGHT,
              }}
            />

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
                    Let&apos;s play Breakout!
                  </div>
                  <div className="text-gray-300 text-sm mb-2">
                    Press start to begin
                  </div>
                </div>
              </div>
            )}

            {/* Arrow keys indicator */}
            {!gameStarted && (
              <div className="absolute top-2 right-2">
                <div className="flex gap-1">
                  <div className="w-6 h-6 bg-gray-700 rounded flex items-center justify-center text-xs">
                    ◄
                  </div>
                  <div className="w-6 h-6 bg-gray-700 rounded flex items-center justify-center text-xs">
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
              <h3 className="text-teal-300 rotate-12 font-black text-3xl mb-3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center animate-pulse">
                ?!
              </h3>
            )}
          </div>

          <div className="bg-slate-800/50 rounded-lg p-4 border border-teal-500/30 mt-6">
            <h3 className="text-teal-300 font-semibold text-lg ">
              Score: <span className="font-black text-orange-400">{score}</span>
            </h3>
          </div>
        </div>

        {/* Controls */}
        <div>
          <h3 className="text-teal-300 text-lg font-semibold mb-3">Controls</h3>
          <div className="flex gap-2 w-fit">
            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded flex items-center justify-center text-sm border border-white/30">
              ←
            </div>
            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded flex items-center justify-center text-sm border border-white/30">
              →
            </div>
          </div>
          <div className="text-xs text-white/60 mt-2">
            Use left/right arrow keys to move paddle
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreakoutGame;

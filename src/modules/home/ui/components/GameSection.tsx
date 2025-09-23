import React, { useState } from "react";
import { ChevronLeft, ChevronRight, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import SnakeGame from "./SnakeGame";
import { FORTUNE_QUOTES } from "@/modules/home/constants";
import WordSearch from "@/modules/home/ui/components/WordSearch";
import { Button } from "@/components/ui/button";
import BreakoutGame from "@/modules/home/ui/components/BreakoutGame";

const GAMES = [
  {
    id: "snake",
    name: "Snake Game",
    component: SnakeGame,
  },
  {
    id: "wordSearch",
    name: "Word Search",
    component: WordSearch,
  },
  // {
  //   id: "tetris",
  //   name: "Tetris",
  //   component: TetrisGame,
  // },
  {
    id: "breakout",
    name: "Breakout Game",
    component: BreakoutGame,
  },
];

const GameSection = () => {
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [hasWon, setHasWon] = useState(false);
  const [currentQuote, setCurrentQuote] = useState("");

  const handleWin = () => {
    const randomQuote =
      FORTUNE_QUOTES[Math.floor(Math.random() * FORTUNE_QUOTES.length)];
    setCurrentQuote(randomQuote);
    setHasWon(true);
  };

  const handlePlayAgain = () => {
    setHasWon(false);
    setCurrentQuote("");
  };

  const navigateToNextGame = () => {
    setCurrentGameIndex((prevIndex) => (prevIndex + 1) % GAMES.length);
    setHasWon(false);
    setCurrentQuote("");
  };

  const navigateToPrevGame = () => {
    setCurrentGameIndex((prevIndex) =>
      prevIndex === 0 ? GAMES.length - 1 : prevIndex - 1,
    );
    setHasWon(false);
    setCurrentQuote("");
  };

  const CurrentGameComponent = GAMES[currentGameIndex].component;
  const currentGameName = GAMES[currentGameIndex].name;

  return (
    <div className="flex-1 w-full">
      <div
        className={`bg-gradient-to-br from-teal-500/20 to-blue-600/20 backdrop-blur-sm border border-teal-500/30 rounded-lg p-6 relative ${hasWon ? "" : "h-[570px]"}`}
      >
        <Nail location="top-left" />
        <Nail location="top-right" />
        <Nail location="bottom-left" />
        <Nail location="bottom-right" />

        {/* Game Title */}
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold text-teal-300">{currentGameName}</h2>
          <p className="text-sm text-gray-400">
            Game {currentGameIndex + 1} of {GAMES.length}
          </p>
        </div>

        {/* Current Game Component */}
        <CurrentGameComponent onWin={handleWin} onPlayAgain={handlePlayAgain} />

        {hasWon && (
          <div className="mt-6 text-center">
            <div className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border border-yellow-400/40 rounded-lg p-4">
              <h2 className="text-2xl font-bold text-yellow-400 mb-2">
                🎉 Congratulations! 🎉
              </h2>
              <p className="text-white/90 mb-3">Here's your fortune cookie!</p>
              <div className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-400/30 rounded-lg p-3 mt-3">
                <p className="text-amber-200 text-sm font-medium italic">
                  "🥠 {currentQuote}"
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Controls */}
      <div className="w-full mt-6 h-16 flex items-center justify-center gap-12">
        <Button
          onClick={navigateToPrevGame}
          className="bg-teal-500/20 hover:bg-teal-500/30 size-16 rounded-full transition-all hover:scale-110"
          title={`Previous: ${GAMES[currentGameIndex === 0 ? GAMES.length - 1 : currentGameIndex - 1].name}`}
        >
          <ChevronLeft className="size-10" />
        </Button>

        {/* Game indicator dots */}
        <div className="flex gap-3 items-center">
          {GAMES.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentGameIndex(index);
                setHasWon(false);
                setCurrentQuote("");
              }}
              className={cn(
                "rounded-full transition-all cursor-pointer",
                index === currentGameIndex
                  ? "bg-teal-400 size-7"
                  : "bg-teal-500/30 hover:bg-teal-500/50 size-5",
              )}
              title={GAMES[index].name}
            />
          ))}
        </div>

        <Button
          onClick={navigateToNextGame}
          className="bg-teal-500/20 hover:bg-teal-500/30 size-16 rounded-full transition-all hover:scale-110"
          title={`Next: ${GAMES[(currentGameIndex + 1) % GAMES.length].name}`}
        >
          <ChevronRight className="size-10" />
        </Button>
      </div>
    </div>
  );
};

export default GameSection;

const Nail = ({
  location,
}: {
  location: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}) => {
  let className;
  switch (location) {
    case "top-left":
      className = "left-2 top-2";
      break;
    case "top-right":
      className = "right-2 top-2";
      break;
    case "bottom-left":
      className = "left-2 bottom-2";
      break;
    case "bottom-right":
      className = "right-2 bottom-2";
      break;
    default:
      className = "left-2 top-2";
  }

  return (
    <div
      className={cn(
        "absolute bg-gradient-to-br from-teal-500/20 to-blue-600/20 size-3 rounded-full shadow shadow-slate-900 flex items-center justify-center",
        className,
      )}
    >
      <XIcon size={8} />
    </div>
  );
};

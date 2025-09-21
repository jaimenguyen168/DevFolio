import React, { useState } from "react";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import SnakeGame from "./SnakeGame";
import { FORTUNE_QUOTES } from "@/modules/home/constants";

const GameSection = () => {
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

  return (
    <div className="flex-1 w-full">
      <div className="bg-gradient-to-br from-teal-500/20 to-blue-600/20 backdrop-blur-sm border border-teal-500/30 rounded-lg p-6 relative">
        <Nail location="top-left" />
        <Nail location="top-right" />
        <Nail location="bottom-left" />
        <Nail location="bottom-right" />

        <SnakeGame onWin={handleWin} onPlayAgain={handlePlayAgain} />

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

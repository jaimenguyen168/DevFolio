import React, { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { WORD_BANK } from "@/modules/home/constants";

interface WordSearchProps {
  onWin?: () => void;
  onPlayAgain?: () => void;
}

const GRID_SIZE = 10;
const WORDS_PER_GAME = 5;

// Direction vectors for word placement
const DIRECTIONS = [
  { row: 0, col: 1 }, // horizontal right
  { row: 1, col: 0 }, // vertical down
  { row: 1, col: 1 }, // diagonal down-right
  { row: 1, col: -1 }, // diagonal down-left
  { row: 0, col: -1 }, // horizontal left
  { row: -1, col: 0 }, // vertical up
  { row: -1, col: -1 }, // diagonal up-left
  { row: -1, col: 1 }, // diagonal up-right
];

const generateGrid = () => {
  // Select random words for this game
  const shuffled = [...WORD_BANK].sort(() => Math.random() - 0.5);
  const selectedWords = shuffled.slice(0, WORDS_PER_GAME);

  const grid = Array(GRID_SIZE)
    .fill(null)
    .map(() => Array(GRID_SIZE).fill(""));

  // Fill with random letters first
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      grid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    }
  }

  const wordPositions: {
    word: string;
    positions: { row: number; col: number }[];
  }[] = [];
  const placedWords: {
    word: string;
    positions: { row: number; col: number }[];
  }[] = [];

  // Try to place each selected word
  selectedWords.forEach((word) => {
    let placed = false;
    let attempts = 0;
    const maxAttempts = 100;

    while (!placed && attempts < maxAttempts) {
      attempts++;

      // Random starting position
      const startRow = Math.floor(Math.random() * GRID_SIZE);
      const startCol = Math.floor(Math.random() * GRID_SIZE);

      // Random direction
      const direction =
        DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];

      // Check if word can fit in this position and direction
      const endRow = startRow + (word.length - 1) * direction.row;
      const endCol = startCol + (word.length - 1) * direction.col;

      if (
        endRow >= 0 &&
        endRow < GRID_SIZE &&
        endCol >= 0 &&
        endCol < GRID_SIZE
      ) {
        // Check for conflicts with already placed words
        let hasConflict = false;
        const positions = [];

        for (let i = 0; i < word.length; i++) {
          const row = startRow + i * direction.row;
          const col = startCol + i * direction.col;
          positions.push({ row, col });

          // Check if this position conflicts with already placed letters
          const currentLetter = grid[row][col];
          if (
            currentLetter !== word[i] &&
            placedWords.some((pw) =>
              pw.positions.some((pos) => pos.row === row && pos.col === col),
            )
          ) {
            hasConflict = true;
            break;
          }
        }

        if (!hasConflict) {
          // Place the word
          positions.forEach(({ row, col }, index) => {
            grid[row][col] = word[index];
          });

          wordPositions.push({
            word,
            positions: positions.map((pos) => ({ row: pos.row, col: pos.col })),
          });

          placedWords.push({ word, positions });
          placed = true;
        }
      }
    }
  });

  // Return only successfully placed words
  const actualWords = wordPositions.map((wp) => wp.word);

  return {
    grid,
    wordPositions,
    selectedWords: actualWords,
  };
};

const WordSearch = ({ onWin, onPlayAgain }: WordSearchProps) => {
  const [gameData, setGameData] = useState<{
    grid: string[][];
    wordPositions: {
      word: string;
      positions: { row: number; col: number }[];
    }[];
    selectedWords: string[];
  } | null>(null);
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [currentSelection, setCurrentSelection] = useState<
    { row: number; col: number }[]
  >([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);

  // Generate initial grid on client side only
  useEffect(() => {
    if (!gameData) {
      setGameData(generateGrid());
    }
  }, [gameData]);

  const getCellKey = (row: number, col: number) => `${row}-${col}`;

  const handleMouseDown = (row: number, col: number) => {
    if (!gameStarted) return;
    setIsSelecting(true);
    setCurrentSelection([{ row, col }]);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (!isSelecting || !gameStarted) return;

    const lastCell = currentSelection[currentSelection.length - 1];
    if (!lastCell) return;

    // Check if we're continuing in the same line
    if (currentSelection.length === 1) {
      setCurrentSelection([...currentSelection, { row, col }]);
    } else {
      // Check direction consistency
      const direction = getDirection(currentSelection[0], currentSelection[1]);
      const newDirection = getDirection(lastCell, { row, col });

      if (
        direction.row === newDirection.row &&
        direction.col === newDirection.col
      ) {
        setCurrentSelection([...currentSelection, { row, col }]);
      }
    }
  };

  const getDirection = (
    from: { row: number; col: number },
    to: { row: number; col: number },
  ) => {
    return {
      row: Math.sign(to.row - from.row),
      col: Math.sign(to.col - from.col),
    };
  };

  const handleMouseUp = () => {
    if (!isSelecting || !gameStarted || !gameData) return;

    setIsSelecting(false);

    // Check if selected cells form a valid word
    const selectedWord = currentSelection
      .map(({ row, col }) => gameData.grid[row][col])
      .join("");

    const reverseWord = selectedWord.split("").reverse().join("");

    // Check if this word exists in our selected words for this game
    const matchedWord = gameData.selectedWords.find(
      (word) => word === selectedWord || word === reverseWord,
    );

    if (matchedWord && !foundWords.has(matchedWord)) {
      // Mark cells as found
      const newSelectedCells = new Set(selectedCells);
      currentSelection.forEach(({ row, col }) => {
        newSelectedCells.add(getCellKey(row, col));
      });

      setSelectedCells(newSelectedCells);
      setFoundWords(new Set([...foundWords, matchedWord]));
      setScore((prev) => prev + matchedWord.length * 10);

      // Check if all words are found
      if (foundWords.size + 1 === gameData.selectedWords.length) {
        setTimeout(() => {
          onWin?.();
        }, 500);
      }
    }

    setCurrentSelection([]);
  };

  const startGame = useCallback(() => {
    if (!gameStarted) {
      setGameStarted(true);
    } else {
      // Generate new game
      const newGameData = generateGrid();
      setGameData(newGameData);
      setSelectedCells(new Set());
      setFoundWords(new Set());
      setCurrentSelection([]);
      setIsSelecting(false);
      setScore(0);
    }
    onPlayAgain?.();
  }, [gameStarted, onPlayAgain]);

  const resetGame = () => {
    const newGameData = generateGrid();
    setGameData(newGameData);
    setSelectedCells(new Set());
    setFoundWords(new Set());
    setCurrentSelection([]);
    setIsSelecting(false);
    setScore(0);
    setGameStarted(false);
  };

  const getCellClass = (row: number, col: number) => {
    const cellKey = getCellKey(row, col);
    const isFound = selectedCells.has(cellKey);
    const isCurrentlySelected = currentSelection.some(
      (cell) => cell.row === row && cell.col === col,
    );

    let baseClass =
      "w-6 h-6 border border-slate-600 flex items-center justify-center text-xs font-semibold cursor-pointer transition-colors ";

    if (isFound) {
      baseClass += "bg-green-500/30 text-green-300 border-green-400 ";
    } else if (isCurrentlySelected) {
      baseClass += "bg-teal-400/50 text-white border-teal-300 ";
    } else {
      baseClass += "bg-slate-700/50 text-gray-300 hover:bg-slate-600/50 ";
    }

    return baseClass;
  };

  // Show loading state while grid is being generated
  if (!gameData) {
    return (
      <div className="flex gap-6">
        <div className="bg-slate-800/80 rounded-lg p-4">
          <div className="relative">
            <div className="bg-slate-900 border-2 border-teal-400 rounded relative overflow-hidden mb-4 p-4">
              <div className="flex items-center justify-center h-64">
                <div className="text-teal-400 text-lg">Loading game...</div>
              </div>
            </div>
            <div className="flex justify-between pt-3">
              <Button
                disabled
                className="bg-orange-400/50 text-white px-4 py-2 rounded text-sm cursor-not-allowed"
              >
                Loading...
              </Button>
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col space-y-6 text-white/90 justify-between">
          <div className="bg-slate-800/50 rounded-lg p-4 border border-teal-500/30">
            <h3 className="text-teal-300 font-semibold text-lg mb-3">
              Word List
            </h3>
            <div className="text-sm text-gray-400">Loading words...</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4 border border-teal-500/30">
            <h3 className="text-teal-300 font-semibold text-lg mb-3">
              Score: <span className="font-black text-orange-400">0</span>
            </h3>
            <div className="space-y-1 text-sm text-gray-400">
              <div>Found: 0/0</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-6">
      {/* Game Container */}
      <div className="bg-slate-800/80 rounded-lg p-4">
        <div className="relative">
          {/* Game Area */}
          <div className="bg-slate-900 border-2 border-teal-400 rounded relative overflow-hidden mb-4 p-4">
            <div
              className="grid gap-1 w-fit mx-auto select-none"
              style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
            >
              {gameData.grid.map((row, rowIndex) =>
                row.map((letter, colIndex) => (
                  <div
                    key={getCellKey(rowIndex, colIndex)}
                    className={getCellClass(rowIndex, colIndex)}
                    onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                    onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                    onMouseUp={handleMouseUp}
                  >
                    {letter}
                  </div>
                )),
              )}
            </div>

            {/* Start Screen */}
            {!gameStarted && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-teal-400 text-lg font-bold mb-2">
                    Let's search!
                  </div>
                  <div className="text-gray-300 text-sm mb-4">
                    Find {WORDS_PER_GAME} hidden words
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Game Controls */}
          <div className="flex justify-between pt-3">
            <Button
              onClick={startGame}
              className="bg-orange-400 hover:bg-orange-300 text-white px-4 py-2 rounded transition-colors text-sm"
            >
              {!gameStarted ? "Start Game" : "New Game"}
            </Button>
            {gameStarted && (
              <Button
                variant="outline"
                onClick={resetGame}
                className="border border-gray-600 hover:border-gray-500 bg-transparent text-gray-300 px-4 py-2 rounded transition-colors text-sm"
              >
                Reset
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Score and Word List Panel */}
      <div className="flex-1 flex flex-col space-y-6 text-white/90 justify-between">
        <div>
          <div className="bg-slate-800/50 rounded-lg p-4 border border-teal-500/30">
            <h3 className="text-teal-300 font-semibold text-lg mb-3">
              Word List
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {gameData.selectedWords.map((word) => (
                <div
                  key={word}
                  className={`text-sm font-mono ${
                    foundWords.has(word)
                      ? "text-green-400 line-through"
                      : "text-gray-300"
                  }`}
                >
                  {word}{" "}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Score Section */}
        <div className="bg-slate-800/50 rounded-lg p-4 border border-teal-500/30">
          <h3 className="text-teal-300 font-semibold text-lg mb-3">
            Score: <span className="font-black text-orange-400">{score}</span>
          </h3>
          <div className="space-y-1 text-sm text-gray-400">
            <div>
              Found: {foundWords.size}/{gameData.selectedWords.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordSearch;

import React from "react";

const GameSection = () => {
  return (
    <div className="flex-1 w-full">
      <div className="bg-gradient-to-br from-teal-500/20 to-blue-600/20 backdrop-blur-sm border border-teal-500/30 rounded-lg p-6">
        {/* Game Container */}
        <div className="bg-slate-800/80 rounded-lg p-6 mb-6">
          <div className="relative">
            {/* Game Controls */}
            <div className="absolute top-2 right-2 text-xs text-gray-400">
              <div>// use keyboard</div>
              <div>// arrows to play</div>
            </div>

            {/* Game Area */}
            <div className="w-64 h-64 bg-slate-900 border-2 border-teal-400 rounded relative overflow-hidden mb-4">
              {/* Snake placeholder */}
              <div className="absolute top-16 left-4">
                <div className="w-4 h-4 bg-teal-400 rounded-sm mb-1"></div>
                <div className="w-4 h-4 bg-teal-400 rounded-sm mb-1"></div>
                <div className="w-4 h-4 bg-teal-400 rounded-sm"></div>
              </div>

              {/* Food dots */}
              <div className="absolute bottom-16 left-8">
                <div className="text-xs text-gray-400 mb-2">// food left</div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                </div>
                <div className="flex space-x-1 mt-1">
                  <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                </div>
              </div>

              {/* Arrow keys indicator */}
              <div className="absolute top-2 right-8">
                <div className="grid grid-cols-3 gap-1">
                  <div></div>
                  <div className="w-6 h-6 bg-gray-700 rounded flex items-center justify-center text-xs">
                    ▲
                  </div>
                  <div></div>
                  <div className="w-6 h-6 bg-gray-700 rounded flex items-center justify-center text-xs">
                    ◄
                  </div>
                  <div className="w-6 h-6 bg-gray-700 rounded flex items-center justify-center text-xs">
                    ▼
                  </div>
                  <div className="w-6 h-6 bg-gray-700 rounded flex items-center justify-center text-xs">
                    ►
                  </div>
                </div>
              </div>
            </div>

            {/* Game Controls */}
            <div className="flex justify-between">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded transition-colors">
                start-game
              </button>
              <button className="border border-gray-600 hover:border-gray-500 text-gray-300 px-4 py-2 rounded transition-colors">
                skip
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameSection;

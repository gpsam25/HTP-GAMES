import React, { useState, useEffect } from 'react';
import { formatTime, shuffleArray } from '../utils';
import { HelpCircle, RefreshCcw } from 'lucide-react';

interface StageTwoProps {
  onComplete: () => void;
}

interface Item {
  id: string;
  label: string;
  color: string;
}

const ITEMS: Item[] = [
  { id: 'A', label: '商品 A', color: 'bg-red-500' },
  { id: 'B', label: '商品 B', color: 'bg-orange-500' },
  { id: 'C', label: '商品 C', color: 'bg-yellow-500' },
  { id: 'D', label: '商品 D', color: 'bg-green-500' },
  { id: 'E', label: '商品 E', color: 'bg-blue-500' },
];

const CORRECT_SEQUENCE = ['A', 'B', 'C', 'D', 'E'];

export const StageTwo: React.FC<StageTwoProps> = ({ onComplete }) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  
  // Available items in the "pool"
  const [availableItems, setAvailableItems] = useState<Item[]>([]);
  // Items selected in sequence
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);
  
  // Validation state
  const [redCircles, setRedCircles] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  // Initialize
  useEffect(() => {
    setAvailableItems(shuffleArray([...ITEMS]));
  }, []);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      if (isTimerRunning) {
        setElapsedTime(prev => prev + 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Handle selection (Pool -> Sequence)
  const handleSelect = (item: Item) => {
    if (selectedItems.length >= 5 || redCircles !== null) return;

    const newSelected = [...selectedItems, item];
    setSelectedItems(newSelected);
    setAvailableItems(prev => prev.filter(i => i.id !== item.id));

    // Auto-check when 5 items are selected
    if (newSelected.length === 5) {
      checkResult(newSelected);
    }
  };

  // Logic to calculate red circles (correct positions)
  const checkResult = (finalSequence: Item[]) => {
    let correctCount = 0;
    finalSequence.forEach((item, index) => {
      if (item.id === CORRECT_SEQUENCE[index]) {
        correctCount++;
      }
    });

    setRedCircles(correctCount);

    if (correctCount === 5) {
      setIsFinished(true);
      setIsTimerRunning(false);
      onComplete();
    }
  };

  // Reset for retry
  const handleRetry = () => {
    setSelectedItems([]);
    setAvailableItems(shuffleArray([...ITEMS])); // Reshuffle on retry
    setRedCircles(null);
  };

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-fade-in">
        <h2 className="text-5xl font-bold text-red-500">遊戲通關！</h2>
        <div className="flex gap-4 mb-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="w-8 h-8 rounded-full bg-red-600 animate-bounce" style={{ animationDelay: `${i * 100}ms` }} />
          ))}
        </div>
        <div className="text-7xl font-mono bg-slate-800 px-10 py-6 rounded-2xl border-4 border-red-500 shadow-2xl shadow-red-500/30">
          {formatTime(elapsedTime)}
        </div>
        <p className="text-xl text-gray-300">恭喜完成所有挑戰！</p>
        <button 
            onClick={() => window.location.reload()}
            className="mt-8 px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors"
        >
            重新開始遊戲
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 bg-slate-800 p-4 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <HelpCircle size={24} className="text-orange-400" />
          第二環節：順序排列
        </h2>
        <div className="text-3xl font-mono font-bold text-yellow-400">
          {formatTime(elapsedTime)}
        </div>
      </div>

      <p className="text-center text-gray-300 mb-6 text-lg">
        請依正確順序點選 <span className="font-bold text-white">ABCDE</span> 五個商品
      </p>

      {/* Selected Sequence Display */}
      <div className="bg-slate-800/80 p-6 rounded-2xl border-2 border-slate-600 mb-8 min-h-[140px] flex items-center justify-center">
        <div className="flex gap-2 md:gap-4">
          {/* Render 5 slots */}
          {Array.from({ length: 5 }).map((_, index) => {
            const item = selectedItems[index];
            return (
              <div 
                key={index}
                className={`
                  w-16 h-16 md:w-24 md:h-24 rounded-xl border-2 border-dashed border-slate-600 
                  flex items-center justify-center bg-slate-900/50 transition-all duration-300
                  ${item ? 'border-solid border-indigo-500 scale-100 opacity-100' : 'opacity-50'}
                `}
              >
                {item && (
                  <div className={`w-full h-full rounded-lg ${item.color} flex flex-col items-center justify-center text-white shadow-lg animate-pop-in`}>
                    <span className="text-2xl font-bold">{item.id}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Result / Feedback */}
      {redCircles !== null && !isFinished && (
        <div className="mb-8 flex flex-col items-center animate-fade-in">
           <div className="flex items-center gap-3 mb-4 bg-slate-900 px-6 py-3 rounded-xl border border-slate-700">
              <span className="text-white font-bold text-lg">位置正確：</span>
              <div className="flex gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-6 h-6 rounded-full border-2 border-red-600 transition-all ${i < redCircles ? 'bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)]' : 'bg-transparent opacity-30'}`}
                    />
                ))}
              </div>
           </div>
           
           <button 
             onClick={handleRetry}
             className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xl shadow-lg transition-transform active:scale-95"
           >
             <RefreshCcw size={24} />
             順序錯誤 - 重試
           </button>
        </div>
      )}

      {/* Selection Pool */}
      <div className="grid grid-cols-5 gap-2 md:gap-4 mt-auto">
        {availableItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleSelect(item)}
            disabled={redCircles !== null} // Disable interaction during result showing
            className={`
              h-24 md:h-32 rounded-xl ${item.color} 
              flex flex-col items-center justify-center gap-2
              text-white font-bold shadow-lg 
              transition-all duration-200 
              hover:scale-105 active:scale-95
              disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
            `}
          >
            <span className="text-3xl md:text-4xl">{item.id}</span>
            <span className="text-xs md:text-sm opacity-90">{item.label}</span>
          </button>
        ))}
      </div>
      
      <style>{`
        @keyframes popIn {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-pop-in {
          animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
      `}</style>
    </div>
  );
};
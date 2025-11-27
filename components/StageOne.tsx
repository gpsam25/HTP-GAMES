import React, { useState, useEffect, useCallback } from 'react';
import { formatTime, shuffleArray } from '../utils';
import { User, Package, TestTube, ShoppingBag, Banknote, Pen, AlertTriangle, RefreshCcw } from 'lucide-react';

interface StageOneProps {
  onComplete: () => void;
}

interface GameItem {
  id: string;
  label: string;
  type: 'avatar' | 'icon';
  matchId: string;
  icon: React.ReactNode;
  color: string;
}

const PAIRS = [
  {
    id: 'warehouse',
    avatarLabel: '倉庫大哥頭像',
    iconLabel: '紙箱圖示',
    icon: <Package size={32} />,
    color: 'bg-blue-500'
  },
  {
    id: 'materials',
    avatarLabel: '物料大姊頭像',
    iconLabel: '針劑瓶圖示',
    icon: <TestTube size={32} />,
    color: 'bg-purple-500'
  },
  {
    id: 'raw',
    avatarLabel: '原料大哥頭像',
    iconLabel: '袋裝原料圖示',
    icon: <ShoppingBag size={32} />,
    color: 'bg-amber-600'
  },
  {
    id: 'accounting',
    avatarLabel: '會計大姊頭像',
    iconLabel: '鈔票圖示',
    icon: <Banknote size={32} />,
    color: 'bg-green-600'
  },
  {
    id: 'admin',
    avatarLabel: '行政妹妹頭像',
    iconLabel: '原子筆圖示',
    icon: <Pen size={32} />,
    color: 'bg-pink-500'
  }
];

export const StageOne: React.FC<StageOneProps> = ({ onComplete }) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [leftItems, setLeftItems] = useState<GameItem[]>([]);
  const [rightItems, setRightItems] = useState<GameItem[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set());
  const [mistakeFlash, setMistakeFlash] = useState(false);
  const [finishedTime, setFinishedTime] = useState<string | null>(null);

  // Initialize game
  const initGame = useCallback(() => {
    const left: GameItem[] = PAIRS.map(p => ({
      id: `left-${p.id}`,
      matchId: p.id,
      label: p.avatarLabel,
      type: 'avatar',
      icon: <User size={40} />, 
      color: 'bg-slate-700'
    }));

    const right: GameItem[] = PAIRS.map(p => ({
      id: `right-${p.id}`,
      matchId: p.id,
      label: p.iconLabel,
      type: 'icon',
      icon: p.icon,
      color: 'bg-slate-700'
    }));

    setLeftItems(shuffleArray(left));
    setRightItems(shuffleArray(right));
    setMatchedIds(new Set());
    setSelectedLeft(null);
    setSelectedRight(null);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  useEffect(() => {
    let interval: number;
    if (isTimerRunning) {
      interval = window.setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const handleReset = () => {
    setMistakeFlash(true);
    setTimeout(() => setMistakeFlash(false), 500);
    // Hard reset: Shuffle everything again on mistake
    initGame();
  };

  const checkMatch = (leftId: string, rightId: string) => {
    const leftItem = leftItems.find(i => i.id === leftId);
    const rightItem = rightItems.find(i => i.id === rightId);

    if (leftItem && rightItem && leftItem.matchId === rightItem.matchId) {
      // Correct Match
      const newMatched = new Set(matchedIds);
      newMatched.add(leftItem.matchId);
      setMatchedIds(newMatched);
      setSelectedLeft(null);
      setSelectedRight(null);

      // Check Win Condition
      if (newMatched.size === PAIRS.length) {
        setIsTimerRunning(false);
        setFinishedTime(formatTime(elapsedTime));
      }
    } else {
      // Incorrect Match
      handleReset();
    }
  };

  const handleLeftClick = (id: string) => {
    if (matchedIds.has(leftItems.find(i => i.id === id)?.matchId || '')) return;
    
    setSelectedLeft(id);
    if (selectedRight) {
      checkMatch(id, selectedRight);
    }
  };

  const handleRightClick = (id: string) => {
    if (matchedIds.has(rightItems.find(i => i.id === id)?.matchId || '')) return;

    setSelectedRight(id);
    if (selectedLeft) {
      checkMatch(selectedLeft, id);
    }
  };

  if (finishedTime) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in space-y-8">
        <h2 className="text-4xl font-bold text-green-400">第一關 完成！</h2>
        <div className="text-6xl font-mono bg-slate-800 px-8 py-4 rounded-xl border-2 border-green-500 shadow-lg shadow-green-500/20">
          {finishedTime}
        </div>
        <p className="text-gray-400">請準備進入下一階段...</p>
        <button 
          onClick={onComplete}
          className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-xl transition-all transform hover:scale-105"
        >
          輸入密碼
        </button>
      </div>
    );
  }

  return (
    <div className={`relative max-w-4xl mx-auto p-4 ${mistakeFlash ? 'animate-shake' : ''}`}>
      {mistakeFlash && (
        <div className="fixed inset-0 bg-red-500/20 z-50 pointer-events-none flex items-center justify-center">
          <div className="bg-red-600 text-white px-6 py-4 rounded-xl font-bold text-2xl shadow-xl flex items-center gap-3">
            <AlertTriangle size={32} />
            配對錯誤！全部重來！
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-8 bg-slate-800 p-4 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <RefreshCcw size={24} className="text-indigo-400" />
          第一環節：對對樂
        </h2>
        <div className="text-3xl font-mono font-bold text-yellow-400">
          {formatTime(elapsedTime)}
        </div>
      </div>

      <div className="text-center mb-4 text-gray-400 text-sm">
        <span className="text-red-400 font-bold">注意：</span> 點選錯誤將會重置所有牌卡！
      </div>

      <div className="flex gap-4 md:gap-12 justify-center">
        {/* Left Column - Avatars */}
        <div className="flex flex-col gap-3 flex-1">
          <h3 className="text-center text-lg font-semibold text-indigo-300 mb-2">人物頭像</h3>
          {leftItems.map((item) => {
            const isMatched = matchedIds.has(item.matchId);
            if (isMatched) return <div key={item.id} className="h-20" />;

            const isSelected = selectedLeft === item.id;
            const originalPair = PAIRS.find(p => p.id === item.matchId);

            return (
              <button
                key={item.id}
                onClick={() => handleLeftClick(item.id)}
                className={`
                  relative group h-20 w-full rounded-xl flex items-center px-4 gap-4 transition-all duration-200
                  ${isSelected ? 'bg-indigo-600 ring-4 ring-indigo-400 scale-105 z-10' : 'bg-slate-800 hover:bg-slate-700'}
                  border-2 border-slate-700
                `}
              >
                <div className={`p-2 rounded-full ${originalPair?.color} text-white shadow-lg`}>
                  {item.icon}
                </div>
                <span className="text-lg font-bold text-slate-100">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Column - Icons */}
        <div className="flex flex-col gap-3 flex-1">
          <h3 className="text-center text-lg font-semibold text-emerald-300 mb-2">物品圖示</h3>
          {rightItems.map((item) => {
            const isMatched = matchedIds.has(item.matchId);
            if (isMatched) return <div key={item.id} className="h-20" />;

            const isSelected = selectedRight === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleRightClick(item.id)}
                className={`
                  relative group h-20 w-full rounded-xl flex items-center justify-end px-4 gap-4 transition-all duration-200
                  ${isSelected ? 'bg-indigo-600 ring-4 ring-indigo-400 scale-105 z-10' : 'bg-slate-800 hover:bg-slate-700'}
                  border-2 border-slate-700
                `}
              >
                <span className="text-lg font-bold text-slate-100">{item.label}</span>
                <div className="p-2 rounded-lg bg-slate-600 text-white shadow-inner">
                  {item.icon}
                </div>
              </button>
            );
          })}
        </div>
      </div>
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </div>
  );
};
import React, { useState } from 'react';
import { StageOne } from './components/StageOne';
import { StageTwo } from './components/StageTwo';
import { PasswordGate } from './components/PasswordGate';
import { Gamepad2 } from 'lucide-react';

enum GameStage {
  STAGE_ONE,
  PASSWORD,
  STAGE_TWO
}

const App: React.FC = () => {
  const [stage, setStage] = useState<GameStage>(GameStage.STAGE_ONE);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 p-4 shadow-lg z-10">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-lg shadow">
              <Gamepad2 size={24} className="text-white" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              公司晚會小遊戲
            </h1>
          </div>
          <div className="text-sm font-medium text-slate-400 px-3 py-1 bg-slate-900 rounded-full border border-slate-700">
            {stage === GameStage.STAGE_ONE && "第一階段：連連看"}
            {stage === GameStage.PASSWORD && "中場休息"}
            {stage === GameStage.STAGE_TWO && "第二階段：排序"}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="w-full max-w-5xl mx-auto">
          {stage === GameStage.STAGE_ONE && (
            <StageOne onComplete={() => setStage(GameStage.PASSWORD)} />
          )}
          
          {stage === GameStage.PASSWORD && (
            <PasswordGate onSuccess={() => setStage(GameStage.STAGE_TWO)} />
          )}

          {stage === GameStage.STAGE_TWO && (
            <StageTwo onComplete={() => {}} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-slate-500 text-sm">
        <p>© {new Date().getFullYear()} 公司聚餐晚會專用</p>
      </footer>
    </div>
  );
};

export default App;
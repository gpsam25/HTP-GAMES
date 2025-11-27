import React, { useState } from 'react';
import { Lock } from 'lucide-react';

interface PasswordGateProps {
  onSuccess: () => void;
}

const CORRECT_PASSWORD = '8245';

export const PasswordGate: React.FC<PasswordGateProps> = ({ onSuccess }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === CORRECT_PASSWORD) {
      onSuccess();
    } else {
      setError(true);
      setInput('');
      setTimeout(() => setError(false), 800);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] animate-fade-in">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-slate-700">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-indigo-600 rounded-full shadow-lg">
            <Lock size={48} className="text-white" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-6 text-white">
          請輸入第二階段密碼
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className={`relative transition-transform ${error ? 'animate-shake' : ''}`}>
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full text-center text-4xl tracking-[0.5em] py-4 bg-slate-900 border-2 border-slate-600 rounded-xl focus:border-indigo-500 focus:outline-none text-white placeholder-slate-700"
              placeholder="••••"
              autoFocus
            />
          </div>
          
          {error && (
            <p className="text-red-500 text-center font-bold">密碼錯誤，請重試！</p>
          )}

          <button
            type="submit"
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xl rounded-xl transition-colors shadow-lg"
          >
            解鎖進入
          </button>
        </form>
      </div>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
};
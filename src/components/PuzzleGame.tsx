import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useAdmin } from '@/contexts/AdminContext';

type Cell = number | null;

export default function PuzzleGame() {
  const { adminCheats } = useAdmin();
  const [grid, setGrid] = useState<Cell[]>([]);
  const [emptyIndex, setEmptyIndex] = useState(8);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [solved, setSolved] = useState(false);
  const [history, setHistory] = useState<Cell[][]>([]);
  const [hints, setHints] = useState(adminCheats.hintMode ? 999 : 3);

  const solvedGrid = [1, 2, 3, 4, 5, 6, 7, 8, null];

  const shuffle = () => {
    const arr = [...solvedGrid];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    const emptyIdx = arr.indexOf(null);
    setGrid(arr);
    setEmptyIndex(emptyIdx);
    setMoves(0);
    setTime(0);
    setSolved(false);
    setHistory([arr]);
    setGameStarted(true);
  };

  useEffect(() => {
    if (!gameStarted || solved) return;

    const interval = setInterval(() => {
      if (!adminCheats.timeFreeze) {
        setTime(t => t + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [gameStarted, solved, adminCheats]);

  useEffect(() => {
    if (gameStarted && JSON.stringify(grid) === JSON.stringify(solvedGrid)) {
      setSolved(true);
    }
  }, [grid, gameStarted]);

  const canMove = (index: number) => {
    const row = Math.floor(index / 3);
    const col = index % 3;
    const emptyRow = Math.floor(emptyIndex / 3);
    const emptyCol = emptyIndex % 3;

    return (
      (row === emptyRow && Math.abs(col - emptyCol) === 1) ||
      (col === emptyCol && Math.abs(row - emptyRow) === 1)
    );
  };

  const handleClick = (index: number) => {
    if (!gameStarted || solved || !canMove(index)) return;

    const newGrid = [...grid];
    [newGrid[index], newGrid[emptyIndex]] = [newGrid[emptyIndex], newGrid[index]];
    
    setGrid(newGrid);
    setEmptyIndex(index);
    setMoves(m => m + 1);
    setHistory(h => [...h, newGrid]);
  };

  const undo = () => {
    if (history.length > 1 && (adminCheats.undoInfinite || hints > 0)) {
      const newHistory = [...history];
      newHistory.pop();
      const prevGrid = newHistory[newHistory.length - 1];
      setGrid(prevGrid);
      setEmptyIndex(prevGrid.indexOf(null));
      setHistory(newHistory);
      if (!adminCheats.undoInfinite) {
        setHints(h => h - 1);
      }
    }
  };

  const autoSolve = () => {
    if (adminCheats.autoSolve) {
      setGrid(solvedGrid);
      setEmptyIndex(8);
      setSolved(true);
    }
  };

  const skipToNextLevel = () => {
    if (adminCheats.skipLevel) {
      shuffle();
    }
  };

  return (
    <Card className="w-full max-w-md bg-gray-900/95 border-pink-500/50 p-6">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-pink-400 mb-2">🧩 Пятнашки</h2>
        <div className="flex justify-between text-sm mb-2">
          <div className="text-blue-400">Ходы: {moves}</div>
          <div className="text-yellow-400">Время: {time}с</div>
          <div className="text-green-400">Подсказки: {adminCheats.hintMode ? '∞' : hints}</div>
        </div>

        {adminCheats.autoSolve && (
          <div className="text-purple-400 text-xs mb-1">🧠 Автоматическое решение доступно</div>
        )}
        {adminCheats.undoInfinite && (
          <div className="text-cyan-400 text-xs mb-1">↩️ Бесконечные отмены</div>
        )}
      </div>

      {!gameStarted || solved ? (
        <div className="text-center py-12">
          {solved ? (
            <>
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-green-400 mb-2">Решено!</h3>
              <p className="text-gray-400 mb-4">
                Ходы: {moves} | Время: {time}с
              </p>
            </>
          ) : (
            <>
              <div className="text-6xl mb-4">🧩</div>
              <h3 className="text-xl font-bold text-pink-400 mb-4">Пятнашки</h3>
            </>
          )}
          
          <button
            onClick={shuffle}
            className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-semibold transition-colors"
          >
            {solved ? '🔄 Новая игра' : '🎮 Начать'}
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {grid.map((cell, i) => (
              <button
                key={i}
                onClick={() => handleClick(i)}
                disabled={!canMove(i)}
                className={`
                  aspect-square text-2xl font-bold rounded-lg transition-all
                  ${cell === null 
                    ? 'bg-gray-800 cursor-default' 
                    : canMove(i)
                    ? 'bg-pink-600 hover:bg-pink-700 text-white cursor-pointer transform hover:scale-105'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                {cell}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={undo}
              disabled={history.length <= 1 || (!adminCheats.undoInfinite && hints === 0)}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors text-sm"
            >
              ↩️ Отменить
            </button>
            
            {adminCheats.autoSolve && (
              <button
                onClick={autoSolve}
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors text-sm"
              >
                🧠 Решить
              </button>
            )}
            
            {adminCheats.skipLevel && (
              <button
                onClick={skipToNextLevel}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors text-sm"
              >
                ⏭️ Пропуск
              </button>
            )}
          </div>
        </>
      )}

      <div className="text-xs text-gray-400 text-center mt-3">
        Расставь числа по порядку от 1 до 8
      </div>
    </Card>
  );
}
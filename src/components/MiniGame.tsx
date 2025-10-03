import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useAdmin } from '@/contexts/AdminContext';

interface MiniGameProps {
  id: string;
  title: string;
  emoji: string;
  color: string;
  gameType: 'clicker' | 'dodge' | 'collect' | 'memory' | 'reaction' | 'platformer';
}

export default function MiniGame({ id, title, emoji, color, gameType }: MiniGameProps) {
  const { adminCheats } = useAdmin();
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [time, setTime] = useState(0);
  const [clicks, setClicks] = useState(0);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const timer = setInterval(() => {
      if (!adminCheats.timeFreeze) {
        setTime(t => t + 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, gameOver, adminCheats]);

  const handleClick = () => {
    if (!gameStarted) {
      setGameStarted(true);
      setScore(0);
      setClicks(0);
      setTime(0);
      setGameOver(false);
    } else if (!gameOver) {
      const points = adminCheats.tripleScore ? 3 : 1;
      setScore(s => s + points);
      setClicks(c => c + 1);

      if (gameType === 'clicker' && clicks >= 50 && !adminCheats.infiniteTime) {
        setGameOver(true);
      }
    }
  };

  const getDescription = () => {
    switch (gameType) {
      case 'clicker': return 'Кликай как можно быстрее!';
      case 'dodge': return 'Уворачивайся от препятствий!';
      case 'collect': return 'Собирай бонусы!';
      case 'memory': return 'Запоминай последовательность!';
      case 'reaction': return 'Проверь свою реакцию!';
      case 'platformer': return 'Прыгай по платформам!';
      default: return 'Простая мини-игра!';
    }
  };

  return (
    <Card className={`w-full bg-gray-900/95 border-${color}-500/50 p-4`}>
      <div className="text-center">
        <div className="text-4xl mb-2">{emoji}</div>
        <h3 className={`text-lg font-bold text-${color}-400 mb-1`}>{title}</h3>
        <p className="text-xs text-gray-400 mb-3">{getDescription()}</p>

        <div className="flex justify-between text-xs mb-3">
          <div className={`text-${color}-400`}>Очки: {score}</div>
          <div className="text-gray-400">Время: {time}с</div>
        </div>

        {gameOver ? (
          <div className="space-y-3">
            <div className="text-2xl">🎉</div>
            <p className={`text-${color}-400 font-semibold`}>Финиш!</p>
            <p className="text-sm text-gray-400">Очки: {score}</p>
            <button
              onClick={() => {
                setGameStarted(false);
                setGameOver(false);
              }}
              className={`w-full px-4 py-2 bg-${color}-600 hover:bg-${color}-700 text-white rounded-lg text-sm font-semibold transition-colors`}
            >
              🔄 Еще раз
            </button>
          </div>
        ) : (
          <button
            onClick={handleClick}
            className={`w-full px-4 py-2 bg-${color}-600 hover:bg-${color}-700 text-white rounded-lg text-sm font-semibold transition-colors transform active:scale-95`}
          >
            {gameStarted ? `${emoji} Клик!` : '🎮 Начать'}
          </button>
        )}

        {adminCheats.tripleScore && gameStarted && (
          <div className="text-xs text-green-400 mt-2">📊 x3 Очки активны</div>
        )}
      </div>
    </Card>
  );
}
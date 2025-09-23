import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { useAdmin } from '@/contexts/AdminContext';

interface Position {
  x: number;
  y: number;
}

interface Item {
  id: string;
  x: number;
  y: number;
  type: 'coin' | 'gem' | 'heart';
  emoji: string;
}

const GRID_SIZE = 15;
const CELL_SIZE = 24;

export default function WalkingGame() {
  const { adminCheats } = useAdmin();
  const [playerPos, setPlayerPos] = useState<Position>({ x: 7, y: 7 });
  const [items, setItems] = useState<Item[]>([]);
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(100);
  const [gameStarted, setGameStarted] = useState(false);

  // Генерация случайных предметов на карте
  const generateItems = useCallback(() => {
    const newItems: Item[] = [];
    const itemTypes = [
      { type: 'coin' as const, emoji: '🪙', chance: 0.6 },
      { type: 'gem' as const, emoji: '💎', chance: 0.3 },
      { type: 'heart' as const, emoji: '❤️', chance: 0.1 }
    ];

    for (let i = 0; i < 20; i++) {
      const x = Math.floor(Math.random() * GRID_SIZE);
      const y = Math.floor(Math.random() * GRID_SIZE);
      
      // Не размещаем предметы на стартовой позиции
      if (x === 7 && y === 7) continue;
      
      const rand = Math.random();
      let cumulativeChance = 0;
      
      for (const itemType of itemTypes) {
        cumulativeChance += itemType.chance;
        if (rand <= cumulativeChance) {
          newItems.push({
            id: `item-${i}`,
            x,
            y,
            type: itemType.type,
            emoji: itemType.emoji
          });
          break;
        }
      }
    }
    
    setItems(newItems);
  }, []);

  // Обработка движения
  const handleMove = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (!gameStarted) return;

    setPlayerPos(prev => {
      let newX = prev.x;
      let newY = prev.y;

      switch (direction) {
        case 'up':
          newY = Math.max(0, prev.y - 1);
          break;
        case 'down':
          newY = Math.min(GRID_SIZE - 1, prev.y + 1);
          break;
        case 'left':
          newX = Math.max(0, prev.x - 1);
          break;
        case 'right':
          newX = Math.min(GRID_SIZE - 1, prev.x + 1);
          break;
      }

      // Проверяем столкновение с предметами
      const collectedItem = items.find(item => item.x === newX && item.y === newY);
      if (collectedItem) {
        setItems(prev => prev.filter(item => item.id !== collectedItem.id));
        
        switch (collectedItem.type) {
          case 'coin':
            const coinValue = adminCheats.infiniteMoney ? 100 : 10;
            setScore(prev => prev + coinValue);
            break;
          case 'gem':
            const gemValue = adminCheats.infiniteMoney ? 500 : 50;
            setScore(prev => prev + gemValue);
            break;
          case 'heart':
            const healthValue = adminCheats.godMode ? 100 : 20;
            setHealth(prev => Math.min(100, prev + healthValue));
            break;
        }
      }

      return { x: newX, y: newY };
    });
  }, [gameStarted, items]);

  // Обработка клавиш
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          handleMove('up');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          handleMove('down');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          handleMove('left');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          handleMove('right');
          break;
      }
    };

    if (gameStarted) {
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [gameStarted, handleMove]);

  // Автоматическое уменьшение здоровья со временем
  useEffect(() => {
    if (!gameStarted) return;

    const healthTimer = setInterval(() => {
      if (!adminCheats.godMode) {
        setHealth(prev => {
          const newHealth = prev - 1;
          if (newHealth <= 0) {
            setGameStarted(false);
            return 0;
          }
          return newHealth;
        });
      }
    }, 2000);

    return () => clearInterval(healthTimer);
  }, [gameStarted]);

  const startGame = () => {
    setGameStarted(true);
    setPlayerPos({ x: 7, y: 7 });
    setScore(0);
    setHealth(100);
    generateItems();
  };

  const resetGame = () => {
    setGameStarted(false);
    setPlayerPos({ x: 7, y: 7 });
    setScore(0);
    setHealth(100);
    setItems([]);
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-green-900/20 to-blue-900/20 border-green-500/30">
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-bold text-green-400">🌍 Исследователь Мира</h3>
        
        {/* Статистика */}
        <div className="flex justify-center gap-6 text-sm">
          <div className="text-yellow-400">💰 Очки: {score}</div>
          <div className="text-red-400">❤️ Здоровье: {health}%</div>
        </div>

        {/* Игровое поле */}
        <div 
          className="mx-auto border-2 border-green-500/50 rounded-lg bg-green-950/30 relative"
          style={{ 
            width: GRID_SIZE * CELL_SIZE + 2, 
            height: GRID_SIZE * CELL_SIZE + 2 
          }}
        >
          {/* Сетка */}
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
            const x = index % GRID_SIZE;
            const y = Math.floor(index / GRID_SIZE);
            
            return (
              <div
                key={index}
                className="absolute border border-green-500/20"
                style={{
                  left: x * CELL_SIZE + 1,
                  top: y * CELL_SIZE + 1,
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                }}
              />
            );
          })}

          {/* Игрок */}
          <div
            className="absolute transition-all duration-200 flex items-center justify-center text-lg"
            style={{
              left: playerPos.x * CELL_SIZE + 1,
              top: playerPos.y * CELL_SIZE + 1,
              width: CELL_SIZE,
              height: CELL_SIZE,
            }}
          >
            🚀
          </div>

          {/* Предметы */}
          {items.map(item => (
            <div
              key={item.id}
              className="absolute flex items-center justify-center text-sm animate-pulse"
              style={{
                left: item.x * CELL_SIZE + 1,
                top: item.y * CELL_SIZE + 1,
                width: CELL_SIZE,
                height: CELL_SIZE,
              }}
            >
              {item.emoji}
            </div>
          ))}
        </div>

        {/* Управление */}
        {!gameStarted ? (
          <div className="space-y-4">
            <p className="text-green-300">
              Собирай предметы, но следи за здоровьем!
            </p>
            <button
              onClick={startGame}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
            >
              🎮 Начать игру
            </button>
          </div>
        ) : health <= 0 ? (
          <div className="space-y-4">
            <p className="text-red-400 text-lg font-semibold">💀 Игра окончена!</p>
            <p className="text-yellow-400">Финальный счёт: {score}</p>
            <button
              onClick={resetGame}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              🔄 Играть снова
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-green-300 text-sm">
              Используй стрелки или WASD для движения
            </p>
            
            {/* Мобильные кнопки */}
            <div className="grid grid-cols-3 gap-2 max-w-32 mx-auto md:hidden">
              <div></div>
              <button
                onClick={() => handleMove('up')}
                className="p-2 bg-green-600/50 hover:bg-green-600 rounded text-white transition-colors"
              >
                ↑
              </button>
              <div></div>
              <button
                onClick={() => handleMove('left')}
                className="p-2 bg-green-600/50 hover:bg-green-600 rounded text-white transition-colors"
              >
                ←
              </button>
              <div></div>
              <button
                onClick={() => handleMove('right')}
                className="p-2 bg-green-600/50 hover:bg-green-600 rounded text-white transition-colors"
              >
                →
              </button>
              <div></div>
              <button
                onClick={() => handleMove('down')}
                className="p-2 bg-green-600/50 hover:bg-green-600 rounded text-white transition-colors"
              >
                ↓
              </button>
              <div></div>
            </div>
          </div>
        )}

        <div className="text-xs text-green-400/60 mt-4">
          Создано @war_references специально для тебя! 🚀
        </div>
      </div>
    </Card>
  );
}
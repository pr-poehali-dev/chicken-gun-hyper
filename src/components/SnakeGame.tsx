import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { useAdmin } from '@/contexts/AdminContext';

interface Position {
  x: number;
  y: number;
}

const GRID_SIZE = 20;
const CELL_SIZE = 20;

export default function SnakeGame() {
  const { adminCheats } = useAdmin();
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Position>({ x: 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(150);
  const directionRef = useRef(direction);
  const gameLoopRef = useRef<NodeJS.Timeout>();

  const generateFood = useCallback(() => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, [snake]);

  const checkCollision = useCallback((head: Position) => {
    if (adminCheats.wallHack || adminCheats.noClip) return false;
    
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      return true;
    }
    
    return snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
  }, [snake, adminCheats]);

  const moveSnake = useCallback(() => {
    if (!gameStarted || gameOver) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + directionRef.current.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + directionRef.current.y + GRID_SIZE) % GRID_SIZE,
      };

      if (checkCollision(newHead) && !adminCheats.godMode) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      if (newHead.x === food.x && newHead.y === food.y) {
        const points = adminCheats.tripleScore ? 30 : 10;
        setScore(s => s + points);
        setFood(generateFood());
        if (!adminCheats.speedBoost) {
          setSpeed(s => Math.max(50, s - 5));
        }
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [gameStarted, gameOver, food, generateFood, checkCollision, adminCheats]);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const currentSpeed = adminCheats.speedBoost ? 50 : adminCheats.slowMotion ? 300 : speed;
    
    gameLoopRef.current = setInterval(moveSnake, currentSpeed);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameStarted, gameOver, moveSnake, speed, adminCheats]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStarted || gameOver) return;

      const keyMap: Record<string, Position> = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
        w: { x: 0, y: -1 },
        s: { x: 0, y: 1 },
        a: { x: -1, y: 0 },
        d: { x: 1, y: 0 },
      };

      const newDirection = keyMap[e.key];
      if (newDirection) {
        e.preventDefault();
        if (
          directionRef.current.x + newDirection.x !== 0 ||
          directionRef.current.y + newDirection.y !== 0
        ) {
          setDirection(newDirection);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, gameOver]);

  const startGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 15 });
    setDirection({ x: 1, y: 0 });
    directionRef.current = { x: 1, y: 0 };
    setScore(0);
    setSpeed(150);
    setGameOver(false);
    setGameStarted(true);
  };

  return (
    <Card className="w-full max-w-md bg-gray-900/95 border-green-500/50 p-6">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-green-400 mb-2">🐍 Змейка</h2>
        <div className="flex justify-between text-sm mb-2">
          <div className="text-green-400">Очки: {score}</div>
          <div className="text-blue-400">Длина: {snake.length}</div>
          <div className="text-yellow-400">Скорость: {Math.floor((200 - speed) / 10)}</div>
        </div>

        {adminCheats.wallHack && (
          <div className="text-purple-400 text-xs mb-1">👻 Сквозь стены</div>
        )}
        {adminCheats.tripleScore && (
          <div className="text-yellow-400 text-xs mb-1">📊 x3 Очки</div>
        )}
        {adminCheats.slowMotion && (
          <div className="text-cyan-400 text-xs mb-1">🐌 Замедление</div>
        )}
      </div>

      <div 
        className="relative bg-gray-800 rounded-lg border-2 border-green-500/50 mx-auto"
        style={{ 
          width: GRID_SIZE * CELL_SIZE,
          height: GRID_SIZE * CELL_SIZE,
        }}
      >
        {!gameStarted || gameOver ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/90 z-10">
            {gameOver ? (
              <>
                <div className="text-6xl mb-4">💀</div>
                <h3 className="text-2xl font-bold text-red-400 mb-2">Игра окончена!</h3>
                <p className="text-xl text-green-400 mb-2">Очки: {score}</p>
                <p className="text-sm text-gray-400 mb-6">Длина змейки: {snake.length}</p>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">🐍</div>
                <h3 className="text-xl font-bold text-green-400 mb-4">Змейка</h3>
                <p className="text-gray-400 text-sm mb-6 px-4 text-center">
                  Используй стрелки или WASD<br/>
                  Ешь яблоки и расти!
                </p>
              </>
            )}
            <button
              onClick={startGame}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
            >
              {gameOver ? '🔄 Еще раз' : '🎮 Начать'}
            </button>
          </div>
        ) : null}

        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`,
          }}
        >
          {snake.map((segment, i) => (
            <div
              key={i}
              className={`absolute ${
                adminCheats.rainbowMode
                  ? 'bg-gradient-to-r from-red-500 via-purple-500 to-blue-500'
                  : i === 0 
                  ? 'bg-green-400' 
                  : 'bg-green-600'
              } rounded-sm transition-all duration-75`}
              style={{
                left: segment.x * CELL_SIZE,
                top: segment.y * CELL_SIZE,
                width: CELL_SIZE - 2,
                height: CELL_SIZE - 2,
              }}
            />
          ))}

          <div
            className="absolute bg-red-500 rounded-full animate-pulse"
            style={{
              left: food.x * CELL_SIZE,
              top: food.y * CELL_SIZE,
              width: CELL_SIZE - 2,
              height: CELL_SIZE - 2,
            }}
          />
        </div>
      </div>

      <div className="text-xs text-gray-400 text-center mt-3">
        Управление: Стрелки или WASD
      </div>
    </Card>
  );
}
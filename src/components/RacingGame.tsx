import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { useAdmin } from '@/contexts/AdminContext';

interface Car {
  x: number;
  lane: number;
}

interface Obstacle {
  x: number;
  lane: number;
  y: number;
}

export default function RacingGame() {
  const { adminCheats } = useAdmin();
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(5);
  const [car, setCar] = useState<Car>({ x: 50, lane: 1 });
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [fuel, setFuel] = useState(100);
  const [nitro, setNitro] = useState(3);
  const gameLoopRef = useRef<number>();

  const LANES = [25, 50, 75];
  const baseSpeed = adminCheats.maxSpeed ? 15 : adminCheats.nitroBoost ? 10 : 5;

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const loop = () => {
      setObstacles(prev => {
        const updated = prev
          .map(obs => ({ ...obs, y: obs.y + baseSpeed }))
          .filter(obs => obs.y < 600);

        if (Math.random() < 0.02) {
          const lane = Math.floor(Math.random() * 3);
          updated.push({ x: LANES[lane], lane, y: -50 });
        }

        updated.forEach(obs => {
          if (
            !adminCheats.ghostCar &&
            Math.abs(obs.y - 500) < 40 &&
            car.lane === obs.lane
          ) {
            if (!adminCheats.godMode) {
              setGameOver(true);
            }
          }
        });

        return updated;
      });

      setScore(prev => prev + 1);

      if (!adminCheats.infiniteFuel) {
        setFuel(prev => Math.max(0, prev - 0.1));
        if (fuel <= 0 && !adminCheats.godMode) {
          setGameOver(true);
        }
      }

      gameLoopRef.current = requestAnimationFrame(loop);
    };

    gameLoopRef.current = requestAnimationFrame(loop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameStarted, gameOver, car.lane, baseSpeed, fuel, adminCheats]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStarted || gameOver) return;

      const steering = adminCheats.perfectSteering ? 1 : 0.8;

      if ((e.key === 'ArrowLeft' || e.key === 'a') && car.lane > 0) {
        setCar(prev => ({ ...prev, lane: prev.lane - 1, x: LANES[prev.lane - 1] }));
      }
      if ((e.key === 'ArrowRight' || e.key === 'd') && car.lane < 2) {
        setCar(prev => ({ ...prev, lane: prev.lane + 1, x: LANES[prev.lane + 1] }));
      }
      if (e.key === ' ' && nitro > 0) {
        setNitro(prev => prev - 1);
        setSpeed(prev => prev * 2);
        setTimeout(() => setSpeed(baseSpeed), 1000);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, gameOver, car.lane, nitro, baseSpeed, adminCheats]);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setSpeed(baseSpeed);
    setCar({ x: 50, lane: 1 });
    setObstacles([]);
    setFuel(100);
    setNitro(adminCheats.infiniteFuel ? 99 : 3);
  };

  return (
    <Card className="w-full max-w-md bg-gray-900/95 border-purple-500/50 p-6">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-purple-400 mb-2">🏎️ Гонки</h2>
        <div className="flex justify-between text-sm">
          <div className="text-blue-400">Очки: {score}</div>
          <div className="text-yellow-400">Топливо: {Math.floor(fuel)}%</div>
          <div className="text-orange-400">Нитро: {nitro}</div>
        </div>
        
        {adminCheats.ghostCar && (
          <div className="text-purple-400 text-xs mt-1">👻 Призрачная машина</div>
        )}
        {adminCheats.maxSpeed && (
          <div className="text-red-400 text-xs">🚀 Максимальная скорость</div>
        )}
      </div>

      <div 
        className="relative bg-gray-800 rounded-lg overflow-hidden border-2 border-purple-500/50"
        style={{ width: '100%', height: '500px' }}
      >
        {!gameStarted ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/90 z-10">
            <div className="text-4xl mb-4">🏎️</div>
            <h3 className="text-xl font-bold text-purple-400 mb-4">Гонки</h3>
            <p className="text-gray-400 text-sm mb-6 px-4 text-center">
              Используй ← → или A/D для управления<br/>
              Пробел - нитро ускорение
            </p>
            <button
              onClick={startGame}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
            >
              🏁 Старт
            </button>
          </div>
        ) : gameOver ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/90 z-10">
            <div className="text-6xl mb-4">💥</div>
            <h3 className="text-2xl font-bold text-red-400 mb-2">Авария!</h3>
            <p className="text-xl text-purple-400 mb-6">Очки: {score}</p>
            <button
              onClick={startGame}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
            >
              🔄 Еще раз
            </button>
          </div>
        ) : null}

        <div className="absolute inset-0 bg-gradient-to-b from-gray-700 to-gray-800">
          <div className="absolute left-1/3 top-0 w-0.5 h-full bg-white/20"></div>
          <div className="absolute left-2/3 top-0 w-0.5 h-full bg-white/20"></div>

          <div
            className={`absolute bottom-20 transition-all duration-200 ${
              adminCheats.ghostCar ? 'opacity-50' : ''
            }`}
            style={{
              left: `${car.x}%`,
              transform: 'translateX(-50%)',
              fontSize: '40px'
            }}
          >
            🏎️
          </div>

          {obstacles.map((obs, i) => (
            <div
              key={i}
              className="absolute transition-all"
              style={{
                left: `${obs.x}%`,
                top: `${obs.y}px`,
                transform: 'translateX(-50%)',
                fontSize: '35px'
              }}
            >
              🚧
            </div>
          ))}
        </div>
      </div>

      <div className="text-xs text-gray-400 text-center mt-3">
        Управление: ← → или A/D | Пробел: нитро
      </div>
    </Card>
  );
}
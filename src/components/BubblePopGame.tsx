import React, { useState, useEffect, useRef } from 'react';
import { useCheat } from '@/contexts/CheatContext';

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  emoji: string;
}

const EMOJIS = ['🎈', '🫧', '⭐', '🌟', '✨', '💫', '🎀', '🎁', '🍭', '🍬'];
const COLORS = ['#FF69B4', '#87CEEB', '#FFD700', '#98FB98', '#DDA0DD', '#F0E68C', '#FF6347', '#7B68EE'];

export default function BubblePopGame() {
  const { cheatsEnabled } = useCheat();
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [combo, setCombo] = useState(0);
  const nextIdRef = useRef(0);
  const comboTimerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setGameStarted(false);
    }
  }, [gameStarted, timeLeft]);

  useEffect(() => {
    if (gameStarted) {
      const interval = setInterval(() => {
        addBubble();
      }, cheatsEnabled ? 300 : 600);
      return () => clearInterval(interval);
    }
  }, [gameStarted, cheatsEnabled]);

  useEffect(() => {
    if (gameStarted) {
      const interval = setInterval(() => {
        setBubbles(prev => 
          prev
            .map(b => ({ ...b, y: b.y - b.speed }))
            .filter(b => b.y > -100)
        );
      }, 16);
      return () => clearInterval(interval);
    }
  }, [gameStarted]);

  const addBubble = () => {
    const newBubble: Bubble = {
      id: nextIdRef.current++,
      x: Math.random() * 90 + 5,
      y: 105,
      size: Math.random() * 30 + 40,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      speed: Math.random() * 1 + 0.5,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)]
    };
    setBubbles(prev => [...prev, newBubble]);
  };

  const popBubble = (id: number) => {
    setBubbles(prev => prev.filter(b => b.id !== id));
    const points = cheatsEnabled ? 30 : 10;
    setScore(s => s + points * (combo + 1));
    setCombo(c => c + 1);

    clearTimeout(comboTimerRef.current);
    comboTimerRef.current = setTimeout(() => setCombo(0), 1000);
  };

  const startGame = () => {
    setBubbles([]);
    setScore(0);
    setTimeLeft(60);
    setCombo(0);
    setGameStarted(true);
    nextIdRef.current = 0;
  };

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-sky-200 via-pink-200 to-purple-200 overflow-hidden">
      <div className="absolute top-4 left-0 right-0 flex justify-between items-center px-8 z-10">
        <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-lg">
          <div className="text-3xl font-bold text-purple-600">🎯 {score}</div>
          <div className="text-xs text-purple-400">Очки</div>
        </div>

        {combo > 1 && (
          <div className="bg-gradient-to-r from-orange-400 to-pink-500 px-6 py-3 rounded-2xl shadow-lg animate-pulse">
            <div className="text-2xl font-bold text-white">🔥 x{combo}</div>
            <div className="text-xs text-white">Комбо!</div>
          </div>
        )}

        <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-2xl shadow-lg">
          <div className="text-3xl font-bold text-blue-600">⏰ {timeLeft}s</div>
          <div className="text-xs text-blue-400">Время</div>
        </div>
      </div>

      <div className="absolute top-20 left-0 right-0 text-center z-10">
        <h1 className="font-orbitron text-4xl text-purple-600 drop-shadow-lg">
          🫧 Поймай Пузыри!
        </h1>
      </div>

      {!gameStarted && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="bg-white/95 backdrop-blur-sm p-12 rounded-3xl shadow-2xl text-center">
            <div className="text-6xl mb-4">🎈</div>
            <h2 className="text-3xl font-bold text-purple-600 mb-4">
              {timeLeft === 0 ? `Игра окончена!` : 'Поймай пузыри!'}
            </h2>
            {timeLeft === 0 && (
              <p className="text-2xl font-bold text-orange-500 mb-4">
                Твой счёт: {score} 🏆
              </p>
            )}
            <p className="text-purple-500 mb-6 max-w-md">
              Лопай пузыри, чтобы заработать очки! Создавай комбо для бонусов!
            </p>
            <button
              onClick={startGame}
              className="px-12 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-bold text-xl hover:scale-105 transition shadow-lg"
            >
              {timeLeft === 0 ? '🔄 Играть снова' : '🚀 Начать игру'}
            </button>
          </div>
        </div>
      )}

      {cheatsEnabled && gameStarted && (
        <div className="absolute top-36 left-1/2 -translate-x-1/2 bg-yellow-400/90 px-4 py-2 rounded-lg z-10">
          <span className="text-yellow-900 font-bold">⚡ Читы: x3 очки, больше пузырей!</span>
        </div>
      )}

      {bubbles.map(bubble => (
        <button
          key={bubble.id}
          onClick={() => popBubble(bubble.id)}
          className="absolute transition-all hover:scale-110 active:scale-50 cursor-pointer"
          style={{
            left: `${bubble.x}%`,
            bottom: `${bubble.y}%`,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
          }}
        >
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-2xl shadow-lg animate-bounce"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${bubble.color}dd, ${bubble.color}88)`,
              border: `3px solid ${bubble.color}`,
            }}
          >
            {bubble.emoji}
          </div>
        </button>
      ))}

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-green-400 to-transparent pointer-events-none" />
    </div>
  );
}

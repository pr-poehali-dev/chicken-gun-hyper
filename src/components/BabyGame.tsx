import React, { useState, useEffect } from 'react';

interface Animal {
  id: string;
  emoji: string;
  sound: string;
  name: string;
  color: string;
}

const animals: Animal[] = [
  { id: '1', emoji: '🐶', sound: 'Гав-гав!', name: 'Собачка', color: 'from-yellow-300 to-orange-400' },
  { id: '2', emoji: '🐱', sound: 'Мяу-мяу!', name: 'Котик', color: 'from-pink-300 to-rose-400' },
  { id: '3', emoji: '🐮', sound: 'Му-у-у!', name: 'Коровка', color: 'from-blue-300 to-cyan-400' },
  { id: '4', emoji: '🐷', sound: 'Хрю-хрю!', name: 'Хрюшка', color: 'from-pink-400 to-pink-500' },
  { id: '5', emoji: '🐸', sound: 'Ква-ква!', name: 'Лягушка', color: 'from-green-300 to-emerald-400' },
  { id: '6', emoji: '🐥', sound: 'Пи-пи-пи!', name: 'Цыплёнок', color: 'from-yellow-400 to-yellow-500' },
  { id: '7', emoji: '🐘', sound: 'Ту-у-у!', name: 'Слоник', color: 'from-gray-300 to-gray-400' },
  { id: '8', emoji: '🦁', sound: 'Р-р-р!', name: 'Львёнок', color: 'from-orange-400 to-amber-500' },
  { id: '9', emoji: '🐵', sound: 'У-у-у!', name: 'Обезьянка', color: 'from-amber-300 to-orange-400' },
  { id: '10', emoji: '🐰', sound: 'Прыг-скок!', name: 'Зайчик', color: 'from-slate-300 to-gray-300' },
  { id: '11', emoji: '🦆', sound: 'Кря-кря!', name: 'Уточка', color: 'from-yellow-300 to-amber-400' },
  { id: '12', emoji: '🐻', sound: 'Р-р-р!', name: 'Мишка', color: 'from-amber-600 to-orange-700' },
];

const shapes = [
  { id: 's1', emoji: '⭐', name: 'Звёздочка', color: 'text-yellow-400' },
  { id: 's2', emoji: '💖', name: 'Сердечко', color: 'text-red-400' },
  { id: 's3', emoji: '🌈', name: 'Радуга', color: 'text-purple-400' },
  { id: 's4', emoji: '🎈', name: 'Шарик', color: 'text-blue-400' },
  { id: 's5', emoji: '🌸', name: 'Цветочек', color: 'text-pink-400' },
  { id: 's6', emoji: '☀️', name: 'Солнышко', color: 'text-yellow-500' },
];

export default function BabyGame() {
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [showSound, setShowSound] = useState(false);
  const [confetti, setConfetti] = useState<Array<{ id: number; emoji: string; x: number; y: number }>>([]);
  const [score, setScore] = useState(0);
  const [balloons, setBalloons] = useState<Array<{ id: number; emoji: string; x: number }>>([]);
  const [rainbowMode, setRainbowMode] = useState(false);

  const playSound = (animal: Animal) => {
    setSelectedAnimal(animal);
    setShowSound(true);
    setScore(score + 1);
    
    createConfetti();
    
    setTimeout(() => {
      setShowSound(false);
    }, 2000);
  };

  const createConfetti = () => {
    const newConfetti = Array.from({ length: 20 }, (_, i) => ({
      id: Date.now() + i,
      emoji: shapes[Math.floor(Math.random() * shapes.length)].emoji,
      x: Math.random() * 100,
      y: -10,
    }));
    setConfetti(prev => [...prev, ...newConfetti]);
    
    setTimeout(() => {
      setConfetti(prev => prev.filter(c => !newConfetti.find(nc => nc.id === c.id)));
    }, 2000);
  };

  const createBalloon = () => {
    const newBalloon = {
      id: Date.now(),
      emoji: '🎈',
      x: Math.random() * 80 + 10,
    };
    setBalloons(prev => [...prev, newBalloon]);
    
    setTimeout(() => {
      setBalloons(prev => prev.filter(b => b.id !== newBalloon.id));
    }, 4000);
  };

  const popBalloon = (id: number) => {
    setBalloons(prev => prev.filter(b => b.id !== id));
    setScore(score + 1);
    createConfetti();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.5) {
        createBalloon();
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const toggleRainbow = () => {
    setRainbowMode(!rainbowMode);
    createConfetti();
  };

  return (
    <div className={`relative w-full min-h-screen p-4 overflow-hidden ${
      rainbowMode 
        ? 'bg-gradient-to-br from-pink-300 via-purple-300 via-blue-300 via-green-300 via-yellow-300 to-red-300 animate-pulse' 
        : 'bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200'
    }`}>
      {confetti.map((item) => (
        <div
          key={item.id}
          className="absolute text-4xl animate-bounce pointer-events-none"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            animation: 'fall 2s linear forwards',
          }}
        >
          {item.emoji}
        </div>
      ))}

      {balloons.map((balloon) => (
        <button
          key={balloon.id}
          onClick={() => popBalloon(balloon.id)}
          className="absolute text-6xl animate-bounce hover:scale-125 transition cursor-pointer z-10"
          style={{
            left: `${balloon.x}%`,
            bottom: '-10%',
            animation: 'flyUp 4s ease-out forwards',
          }}
        >
          {balloon.emoji}
        </button>
      ))}

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="font-orbitron text-6xl md:text-8xl mb-4 animate-bounce">
            <span className="text-red-500">🎈</span>
            <span className="text-yellow-500">🌟</span>
            <span className="text-green-500">✨</span>
            <span className="text-blue-500">🎉</span>
          </h1>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 inline-block shadow-2xl mb-4">
            <p className="text-6xl font-black text-purple-600">
              ⭐ {score} ⭐
            </p>
          </div>

          <div className="flex gap-4 justify-center mb-4">
            <button
              onClick={toggleRainbow}
              className="px-8 py-6 bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-400 hover:scale-110 text-white rounded-3xl font-black text-3xl transition shadow-2xl animate-pulse"
            >
              🌈 РАДУГА
            </button>
            
            <button
              onClick={() => {
                createConfetti();
                setScore(score + 10);
              }}
              className="px-8 py-6 bg-gradient-to-r from-pink-400 to-purple-400 hover:scale-110 text-white rounded-3xl font-black text-3xl transition shadow-2xl"
            >
              ✨ БУМ!
            </button>
          </div>
        </div>

        {showSound && selectedAnimal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl p-12 shadow-2xl transform scale-110 animate-bounce">
              <div className="text-center">
                <div className="text-9xl mb-6 animate-pulse">{selectedAnimal.emoji}</div>
                <p className="text-6xl font-black text-purple-600 mb-4">{selectedAnimal.name}</p>
                <p className="text-7xl font-black text-pink-500 animate-pulse">{selectedAnimal.sound}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
          <h2 className="text-5xl font-black text-center mb-8 text-purple-600">
            ТЫК НА ЗВЕРЮШЕК! 👆
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {animals.map((animal) => (
              <button
                key={animal.id}
                onClick={() => playSound(animal)}
                className={`bg-gradient-to-br ${animal.color} hover:scale-110 active:scale-95 p-8 rounded-3xl shadow-2xl transition transform border-4 border-white`}
              >
                <div className="text-8xl mb-4 animate-bounce">{animal.emoji}</div>
                <p className="text-3xl font-black text-white drop-shadow-lg">{animal.name}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
          <h2 className="text-5xl font-black text-center mb-6 text-pink-600">
            НАЖИМАЙ И СМОТРИ! ✨
          </h2>
          
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {shapes.map((shape) => (
              <button
                key={shape.id}
                onClick={() => {
                  createConfetti();
                  setScore(score + 1);
                }}
                className="bg-white hover:scale-125 active:scale-95 p-6 rounded-3xl shadow-xl transition transform border-4 border-purple-300 hover:border-pink-400"
              >
                <div className="text-7xl animate-spin-slow">{shape.emoji}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => {
              setScore(0);
              createConfetti();
            }}
            className="px-12 py-6 bg-gradient-to-r from-green-400 to-blue-400 hover:scale-110 text-white rounded-3xl font-black text-4xl transition shadow-2xl"
          >
            🔄 ЕЩЁ РАЗ!
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fall {
          from {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        
        @keyframes flyUp {
          from {
            bottom: -10%;
            opacity: 1;
          }
          to {
            bottom: 110%;
            opacity: 0;
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';

interface Scene {
  id: number;
  emoji: string;
  size: string;
  animation: string;
  duration: number;
  sound?: string;
  text?: string;
  frequency?: number;
}

const memeScenes: Scene[] = [
  { id: 1, emoji: '😺', size: 'text-9xl', animation: 'animate-bounce', duration: 2000, sound: '🎵', frequency: 400 },
  { id: 2, emoji: '🤪', size: 'text-[150px]', animation: 'animate-spin', duration: 1500, sound: '💥', frequency: 200 },
  { id: 3, emoji: '🦄', size: 'text-9xl', animation: 'animate-pulse', duration: 2000, sound: '✨', frequency: 600 },
  { id: 4, emoji: '🍕', size: 'text-[150px]', animation: 'animate-bounce', duration: 1500, sound: '😋', frequency: 300 },
  { id: 5, emoji: '🤖', size: 'text-9xl', animation: 'animate-spin', duration: 2000, sound: '🔊', frequency: 150 },
  { id: 6, emoji: '🎉', size: 'text-[150px]', animation: 'animate-pulse', duration: 1500, sound: '🎊', frequency: 500 },
  { id: 7, emoji: '🐶', size: 'text-9xl', animation: 'animate-bounce', duration: 2000, sound: '🐕', frequency: 350 },
  { id: 8, emoji: '💩', size: 'text-[150px]', animation: 'animate-spin', duration: 1500, sound: '😂', frequency: 250 },
  { id: 9, emoji: '🌈', size: 'text-9xl', animation: 'animate-pulse', duration: 2000, sound: '🎨', frequency: 450 },
  { id: 10, emoji: '🦖', size: 'text-[150px]', animation: 'animate-bounce', duration: 1500, sound: '🦕', frequency: 180 },
  { id: 11, emoji: '👾', size: 'text-9xl', animation: 'animate-spin', duration: 2000, sound: '🎮', frequency: 320 },
  { id: 12, emoji: '🍦', size: 'text-[150px]', animation: 'animate-pulse', duration: 1500, sound: '🤤', frequency: 550 },
  { id: 13, emoji: '🐸', size: 'text-9xl', animation: 'animate-bounce', duration: 2000, sound: '🎤', frequency: 280 },
  { id: 14, emoji: '🔥', size: 'text-[150px]', animation: 'animate-spin', duration: 1500, sound: '💪', frequency: 220 },
  { id: 15, emoji: '🦊', size: 'text-9xl', animation: 'animate-pulse', duration: 2000, sound: '🎵', frequency: 420 },
  { id: 16, emoji: '🍩', size: 'text-[150px]', animation: 'animate-bounce', duration: 1500, sound: '🤩', frequency: 380 },
  { id: 17, emoji: '🐼', size: 'text-9xl', animation: 'animate-spin', duration: 2000, sound: '🎋', frequency: 340 },
  { id: 18, emoji: '🎸', size: 'text-[150px]', animation: 'animate-pulse', duration: 1500, sound: '🎶', frequency: 240 },
  { id: 19, emoji: '🦁', size: 'text-9xl', animation: 'animate-bounce', duration: 2000, sound: '👑', frequency: 200 },
  { id: 20, emoji: '🍔', size: 'text-[150px]', animation: 'animate-spin', duration: 1500, sound: '😍', frequency: 310 },
  { id: 21, emoji: '🐙', size: 'text-9xl', animation: 'animate-pulse', duration: 2000, sound: '🌊', frequency: 470 },
  { id: 22, emoji: '🎭', size: 'text-[150px]', animation: 'animate-bounce', duration: 1500, sound: '🎪', frequency: 360 },
  { id: 23, emoji: '🦋', size: 'text-9xl', animation: 'animate-spin', duration: 2000, sound: '🌸', frequency: 520 },
  { id: 24, emoji: '🍿', size: 'text-[150px]', animation: 'animate-pulse', duration: 1500, sound: '🎬', frequency: 290 },
  { id: 25, emoji: '🐢', size: 'text-9xl', animation: 'animate-bounce', duration: 2000, sound: '🐚', frequency: 160 },
];

const backgrounds = [
  'from-pink-400 via-purple-400 to-blue-400',
  'from-yellow-400 via-orange-400 to-red-400',
  'from-green-400 via-teal-400 to-blue-400',
  'from-purple-400 via-pink-400 to-red-400',
  'from-blue-400 via-cyan-400 to-green-400',
  'from-red-400 via-pink-400 to-purple-400',
  'from-cyan-400 via-blue-400 to-indigo-400',
  'from-orange-400 via-red-400 to-pink-400',
];

export default function CartoonGame() {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [background, setBackground] = useState(backgrounds[0]);
  const [showSound, setShowSound] = useState(false);
  const [floatingEmojis, setFloatingEmojis] = useState<{id: number, emoji: string, x: number, y: number}[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);

  const playSound = (frequency: number) => {
    if (!soundEnabled) return;
    
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.3);
    } catch (error) {
      console.log('Звук не поддерживается браузером');
    }
  };

  useEffect(() => {
    if (!isPlaying) return;

    const scene = memeScenes[currentScene];
    
    setBackground(backgrounds[currentScene % backgrounds.length]);
    
    if (scene.sound && scene.frequency) {
      playSound(scene.frequency);
      setShowSound(true);
      setTimeout(() => setShowSound(false), 800);
    }

    const emojis = Array.from({length: 8}, (_, i) => ({
      id: Math.random(),
      emoji: ['⭐', '💫', '✨', '🌟', '💖', '🎈', '🎀', '💝'][i],
      x: Math.random() * 100,
      y: Math.random() * 100
    }));
    setFloatingEmojis(emojis);

    const timer = setTimeout(() => {
      if (currentScene < memeScenes.length - 1) {
        setCurrentScene(currentScene + 1);
      } else {
        setCurrentScene(0);
      }
    }, scene.duration);

    return () => clearTimeout(timer);
  }, [currentScene, isPlaying, soundEnabled]);

  const startCartoon = () => {
    setIsPlaying(true);
    setCurrentScene(0);
  };

  const pauseCartoon = () => {
    setIsPlaying(false);
  };

  const restartCartoon = () => {
    setCurrentScene(0);
    setIsPlaying(true);
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  const scene = memeScenes[currentScene];

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 overflow-hidden">
      <div className="max-w-6xl mx-auto p-4 h-screen flex flex-col">
        <div className="text-center mb-4">
          <h1 className="font-orbitron text-4xl md:text-6xl text-white mb-2">🎬 Мемный Мультик!</h1>
          <p className="text-white/80 text-lg">25 мемных персонажей! 🎉</p>
        </div>

        <div className="flex justify-center gap-3 mb-4 flex-wrap">
          {!isPlaying ? (
            <button
              onClick={startCartoon}
              className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-bold text-2xl transition hover:scale-110 shadow-2xl"
            >
              ▶️ СТАРТ
            </button>
          ) : (
            <button
              onClick={pauseCartoon}
              className="px-8 py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold text-2xl transition hover:scale-110 shadow-2xl"
            >
              ⏸️ СТОП
            </button>
          )}
          
          <button
            onClick={restartCartoon}
            className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-bold text-2xl transition hover:scale-110 shadow-2xl"
          >
            🔄 ЗАНОВО
          </button>

          <button
            onClick={toggleSound}
            className={`px-8 py-4 ${soundEnabled ? 'bg-purple-500 hover:bg-purple-600' : 'bg-gray-500 hover:bg-gray-600'} text-white rounded-2xl font-bold text-2xl transition hover:scale-110 shadow-2xl`}
          >
            {soundEnabled ? '🔊 ЗВУК' : '🔇 БЕЗ ЗВУКА'}
          </button>
        </div>

        <div className={`flex-1 relative rounded-3xl shadow-2xl overflow-hidden bg-gradient-to-br ${background} transition-all duration-1000`}>
          {floatingEmojis.map((item) => (
            <div
              key={item.id}
              className="absolute text-4xl animate-pulse"
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                animation: 'float 3s ease-in-out infinite'
              }}
            >
              {item.emoji}
            </div>
          ))}

          {isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`${scene.size} ${scene.animation} drop-shadow-2xl`}>
                {scene.emoji}
              </div>
            </div>
          )}

          {!isPlaying && currentScene === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-9xl mb-8 animate-bounce">🎬</div>
                <div className="text-6xl text-white font-bold">👇👇👇</div>
              </div>
            </div>
          )}

          {showSound && scene.sound && (
            <div className="absolute top-10 right-10 text-8xl animate-ping">
              {scene.sound}
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 bg-black/30 backdrop-blur-sm p-4">
            <div className="flex justify-center gap-2 flex-wrap">
              {memeScenes.map((s, idx) => (
                <div
                  key={s.id}
                  className={`w-3 h-3 rounded-full transition-all ${
                    idx === currentScene 
                      ? 'bg-white scale-150' 
                      : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-3 mt-4 overflow-x-auto pb-2 max-h-[180px]">
          {memeScenes.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => {
                setCurrentScene(idx);
                setIsPlaying(true);
              }}
              className={`p-4 rounded-2xl transition hover:scale-110 flex-shrink-0 ${
                idx === currentScene && isPlaying
                  ? 'bg-yellow-400 scale-110 ring-4 ring-yellow-300'
                  : 'bg-white/20 hover:bg-white/30'
              }`}
            >
              <div className="text-5xl">{s.emoji}</div>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
      `}</style>
    </div>
  );
}

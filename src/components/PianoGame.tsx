import React, { useState, useRef, useEffect } from 'react';

interface Key {
  note: string;
  frequency: number;
  color: 'white' | 'black';
  key?: string;
  emoji?: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  emoji: string;
  color: string;
}

const KEYS: Key[] = [
  { note: 'C', frequency: 261.63, color: 'white', key: 'a', emoji: '🎵' },
  { note: 'C#', frequency: 277.18, color: 'black', key: 'w', emoji: '⭐' },
  { note: 'D', frequency: 293.66, color: 'white', key: 's', emoji: '💖' },
  { note: 'D#', frequency: 311.13, color: 'black', key: 'e', emoji: '✨' },
  { note: 'E', frequency: 329.63, color: 'white', key: 'd', emoji: '🌟' },
  { note: 'F', frequency: 349.23, color: 'white', key: 'f', emoji: '💫' },
  { note: 'F#', frequency: 369.99, color: 'black', key: 't', emoji: '🎶' },
  { note: 'G', frequency: 392.00, color: 'white', key: 'g', emoji: '🌈' },
  { note: 'G#', frequency: 415.30, color: 'black', key: 'y', emoji: '💕' },
  { note: 'A', frequency: 440.00, color: 'white', key: 'h', emoji: '🎹' },
  { note: 'A#', frequency: 466.16, color: 'black', key: 'u', emoji: '🎨' },
  { note: 'B', frequency: 493.88, color: 'white', key: 'j', emoji: '🦋' },
  { note: 'C2', frequency: 523.25, color: 'white', key: 'k', emoji: '🌸' },
];

const SONGS = [
  { name: '⭐ Звёздочка', notes: ['C', 'C', 'G', 'G', 'A', 'A', 'G', 'F', 'F', 'E', 'E', 'D', 'D', 'C'], emoji: '⭐' },
  { name: '🦗 Кузнечик', notes: ['C', 'D', 'E', 'F', 'G', 'G', 'G', 'A', 'G', 'F', 'E', 'E', 'E'], emoji: '🦗' },
  { name: '🎵 Простая', notes: ['C', 'E', 'G', 'C2', 'G', 'E', 'C'], emoji: '🎵' },
  { name: '🎂 День рождения', notes: ['C', 'C', 'D', 'C', 'F', 'E', 'C', 'C', 'D', 'C', 'G', 'F'], emoji: '🎂' },
  { name: '💖 Сердечко', notes: ['E', 'D', 'C', 'D', 'E', 'E', 'E', 'D', 'D', 'D', 'E', 'G', 'G'], emoji: '💖' },
];

const DRUM_SOUNDS = [
  { name: '🥁 Барабан', emoji: '🥁', sound: 'kick' },
  { name: '🎸 Бас', emoji: '🎸', sound: 'bass' },
  { name: '🔔 Звонок', emoji: '🔔', sound: 'bell' },
  { name: '💥 Хлопок', emoji: '💥', sound: 'clap' },
  { name: '✨ Тарелка', emoji: '✨', sound: 'cymbal' },
  { name: '🎺 Труба', emoji: '🎺', sound: 'horn' },
];

export default function PianoGame() {
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());
  const [isRecording, setIsRecording] = useState(false);
  const [recordedNotes, setRecordedNotes] = useState<string[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [visualMode, setVisualMode] = useState<'normal' | 'rainbow' | 'sparkle'>('normal');
  const [instrumentType, setInstrumentType] = useState<'piano' | 'synth' | 'bells' | 'guitar'>('piano');
  const [showDrums, setShowDrums] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const audioContextRef = useRef<AudioContext>();

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    return () => audioContextRef.current?.close();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = KEYS.find(k => k.key === e.key.toLowerCase());
      if (key && !activeNotes.has(key.note)) {
        playNote(key.note, key.frequency, key.emoji);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = KEYS.find(k => k.key === e.key.toLowerCase());
      if (key) {
        setActiveNotes(prev => {
          const next = new Set(prev);
          next.delete(key.note);
          return next;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [activeNotes]);

  const createParticle = (x: number, y: number, emoji: string, color: string) => {
    const particle: Particle = {
      id: Date.now() + Math.random(),
      x: x + (Math.random() - 0.5) * 100,
      y: y,
      emoji,
      color
    };
    setParticles(prev => [...prev, particle]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== particle.id));
    }, 1500);
  };

  const getInstrumentType = () => {
    switch (instrumentType) {
      case 'piano': return 'sine';
      case 'synth': return 'square';
      case 'bells': return 'triangle';
      case 'guitar': return 'sawtooth';
      default: return 'sine';
    }
  };

  const playNote = (note: string, frequency: number, emoji?: string) => {
    if (!audioContextRef.current) return;

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();
    const filter = audioContextRef.current.createBiquadFilter();

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = getInstrumentType();

    filter.type = 'lowpass';
    filter.frequency.value = 2000;

    gainNode.gain.setValueAtTime(volume, audioContextRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.8);

    oscillator.start();
    oscillator.stop(audioContextRef.current.currentTime + 0.8);

    setActiveNotes(prev => new Set(prev).add(note));
    setTimeout(() => {
      setActiveNotes(prev => {
        const next = new Set(prev);
        next.delete(note);
        return next;
      });
    }, 200);

    if (visualMode === 'sparkle' || visualMode === 'rainbow') {
      const colors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      createParticle(window.innerWidth / 2, window.innerHeight / 2, emoji || '🎵', randomColor);
    }

    if (isRecording) {
      setRecordedNotes(prev => [...prev, note]);
    }
  };

  const playDrumSound = (soundType: string, emoji: string) => {
    if (!audioContextRef.current) return;

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();
    const filter = audioContextRef.current.createBiquadFilter();

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    switch (soundType) {
      case 'kick':
        oscillator.frequency.value = 150;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(volume * 2, audioContextRef.current.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.3);
        break;
      case 'bass':
        oscillator.frequency.value = 100;
        oscillator.type = 'sawtooth';
        gainNode.gain.setValueAtTime(volume * 1.5, audioContextRef.current.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.4);
        break;
      case 'bell':
        oscillator.frequency.value = 800;
        oscillator.type = 'triangle';
        gainNode.gain.setValueAtTime(volume, audioContextRef.current.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 1);
        break;
      case 'clap':
        oscillator.frequency.value = 1000;
        oscillator.type = 'square';
        gainNode.gain.setValueAtTime(volume * 0.8, audioContextRef.current.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.1);
        break;
      case 'cymbal':
        oscillator.frequency.value = 3000;
        oscillator.type = 'triangle';
        gainNode.gain.setValueAtTime(volume * 0.5, audioContextRef.current.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.5);
        break;
      case 'horn':
        oscillator.frequency.value = 440;
        oscillator.type = 'sawtooth';
        gainNode.gain.setValueAtTime(volume, audioContextRef.current.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.6);
        break;
    }

    filter.type = 'lowpass';
    filter.frequency.value = 2000;

    oscillator.start();
    oscillator.stop(audioContextRef.current.currentTime + 0.5);

    createParticle(window.innerWidth / 2, window.innerHeight / 3, emoji, '#FFA500');
  };

  const handleKeyClick = (note: string, frequency: number, emoji?: string) => {
    playNote(note, frequency, emoji);
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setRecordedNotes([]);
      setIsRecording(true);
    }
  };

  const playRecording = async () => {
    for (let i = 0; i < recordedNotes.length; i++) {
      const note = recordedNotes[i];
      const key = KEYS.find(k => k.note === note);
      if (key) {
        playNote(key.note, key.frequency, key.emoji);
        await new Promise(resolve => setTimeout(resolve, 350));
      }
    }
  };

  const playSong = async (song: typeof SONGS[0]) => {
    for (let i = 0; i < song.notes.length; i++) {
      const note = song.notes[i];
      const key = KEYS.find(k => k.note === note);
      if (key) {
        playNote(key.note, key.frequency, key.emoji);
        await new Promise(resolve => setTimeout(resolve, 450));
      }
    }
  };

  const whiteKeys = KEYS.filter(k => k.color === 'white');
  const blackKeys = KEYS.filter(k => k.color === 'black');

  return (
    <div className="relative flex flex-col items-center gap-6 p-6 min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute text-5xl pointer-events-none animate-bounce z-50"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            color: particle.color,
            animation: 'floatUp 1.5s ease-out forwards'
          }}
        >
          {particle.emoji}
        </div>
      ))}
      
      <style>{`
        @keyframes floatUp {
          from {
            opacity: 1;
            transform: translateY(0) scale(1) rotate(0deg);
          }
          to {
            opacity: 0;
            transform: translateY(-200px) scale(1.5) rotate(360deg);
          }
        }
      `}</style>

      <div className="text-center">
        <h1 className="font-orbitron text-5xl text-white mb-2">🎹 СУПЕР ПИАНИНО</h1>
        <p className="text-purple-300 text-lg">Играй музыку! Звуки, барабаны, песни! 🎵✨</p>
      </div>

      <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl w-full max-w-6xl">
        <div className="flex flex-wrap gap-3 justify-center items-center mb-4">
          <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl">
            <span className="text-white font-semibold text-sm">🔊 Громкость:</span>
            <input
              type="range"
              min="0"
              max="100"
              value={volume * 100}
              onChange={(e) => setVolume(Number(e.target.value) / 100)}
              className="w-24"
            />
            <span className="text-white font-bold">{Math.round(volume * 100)}%</span>
          </div>

          <button
            onClick={toggleRecording}
            className={`px-5 py-2.5 rounded-xl font-bold transition text-sm ${
              isRecording
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-white text-purple-600 hover:bg-purple-100'
            }`}
          >
            {isRecording ? '⏹️ Стоп' : '⏺️ Записать'}
          </button>

          {recordedNotes.length > 0 && (
            <>
              <button
                onClick={playRecording}
                className="px-5 py-2.5 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition text-sm"
              >
                ▶️ Играть ({recordedNotes.length})
              </button>
              <button
                onClick={() => setRecordedNotes([])}
                className="px-5 py-2.5 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition text-sm"
              >
                🗑️ Очистить
              </button>
            </>
          )}
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-4">
          <p className="w-full text-center text-yellow-300 font-bold mb-2">🎸 Инструменты:</p>
          {[
            { type: 'piano', name: '🎹 Пианино', emoji: '🎹' },
            { type: 'synth', name: '🎛️ Синтезатор', emoji: '🎛️' },
            { type: 'bells', name: '🔔 Колокольчики', emoji: '🔔' },
            { type: 'guitar', name: '🎸 Гитара', emoji: '🎸' },
          ].map((inst) => (
            <button
              key={inst.type}
              onClick={() => setInstrumentType(inst.type as any)}
              className={`px-4 py-2 rounded-lg font-bold transition text-sm ${
                instrumentType === inst.type
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white scale-105'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {inst.name}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 justify-center mb-4">
          <p className="w-full text-center text-pink-300 font-bold mb-2">✨ Эффекты:</p>
          {[
            { mode: 'normal', name: '⚪ Обычный', emoji: '⚪' },
            { mode: 'rainbow', name: '🌈 Радуга', emoji: '🌈' },
            { mode: 'sparkle', name: '✨ Блёстки', emoji: '✨' },
          ].map((mode) => (
            <button
              key={mode.mode}
              onClick={() => setVisualMode(mode.mode as any)}
              className={`px-4 py-2 rounded-lg font-bold transition text-sm ${
                visualMode === mode.mode
                  ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white scale-105'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {mode.name}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl w-full max-w-6xl">
        <div className="flex justify-between items-center mb-3">
          <p className="text-white font-bold text-lg">🎵 5 Песен для обучения:</p>
          <button
            onClick={() => setShowDrums(!showDrums)}
            className={`px-4 py-2 rounded-lg font-bold transition ${
              showDrums
                ? 'bg-gradient-to-r from-orange-400 to-red-400 text-white'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            {showDrums ? '🎹 Пианино' : '🥁 Барабаны'}
          </button>
        </div>

        {!showDrums ? (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {SONGS.map((song, i) => (
              <button
                key={i}
                onClick={() => playSong(song)}
                className="px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-bold hover:scale-105 transition text-sm"
              >
                <div className="text-2xl mb-1">{song.emoji}</div>
                {song.name}
              </button>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {DRUM_SOUNDS.map((drum, i) => (
              <button
                key={i}
                onClick={() => playDrumSound(drum.sound, drum.emoji)}
                className="px-6 py-6 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold hover:scale-110 transition shadow-lg"
              >
                <div className="text-5xl mb-2">{drum.emoji}</div>
                <div className="text-sm">{drum.name}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-2xl shadow-2xl">
        <div className="relative flex">
          {whiteKeys.map((key) => (
            <button
              key={key.note}
              onClick={() => handleKeyClick(key.note, key.frequency, key.emoji)}
              className={`relative w-16 h-64 border-2 border-gray-800 rounded-b-lg transition-all ${
                activeNotes.has(key.note)
                  ? 'bg-gradient-to-b from-yellow-300 to-yellow-400 scale-95 shadow-2xl'
                  : 'bg-gradient-to-b from-white to-gray-100 hover:from-gray-50 hover:to-gray-200'
              }`}
              style={{ zIndex: 1 }}
            >
              <div className="absolute top-4 left-0 right-0 text-center text-3xl">
                {key.emoji}
              </div>
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <div className="text-sm font-bold text-gray-700">{key.note}</div>
                <div className="text-xs text-gray-500 font-bold">{key.key?.toUpperCase()}</div>
              </div>
            </button>
          ))}
        </div>

        <div className="absolute top-6 left-6 flex pointer-events-none">
          {whiteKeys.map((_, whiteIndex) => {
            const shouldRender = whiteIndex < whiteKeys.length - 1 && 
              !whiteKeys[whiteIndex].note.includes('E') && 
              !whiteKeys[whiteIndex].note.includes('B');

            const blackKey = blackKeys.find(bk => {
              const whiteNote = whiteKeys[whiteIndex].note.replace(/[0-9]/g, '');
              const blackNote = bk.note.replace('#', '').replace(/[0-9]/g, '');
              return blackNote === whiteNote;
            });

            return (
              <div key={whiteIndex} className="relative w-16">
                {shouldRender && blackKey && (
                  <button
                    onClick={() => handleKeyClick(blackKey.note, blackKey.frequency, blackKey.emoji)}
                    className={`absolute -right-5 w-10 h-40 rounded-b-lg pointer-events-auto transition-all ${
                      activeNotes.has(blackKey.note)
                        ? 'bg-gradient-to-b from-purple-600 to-purple-700 scale-95 shadow-2xl'
                        : 'bg-gradient-to-b from-gray-900 to-black hover:from-gray-800'
                    }`}
                    style={{ zIndex: 2 }}
                  >
                    <div className="absolute top-3 left-0 right-0 text-center text-xl">
                      {blackKey.emoji}
                    </div>
                    <div className="absolute bottom-4 left-0 right-0 text-center">
                      <div className="text-xs font-bold text-white">
                        {blackKey.key?.toUpperCase()}
                      </div>
                    </div>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm px-8 py-4 rounded-xl max-w-3xl">
        <p className="text-white text-center">
          <span className="font-bold text-yellow-300">⌨️ Клавиши:</span> A, W, S, E, D, F, T, G, Y, H, U, J, K
          <br />
          <span className="text-purple-300">🖱️ Или нажимай на пианино мышкой!</span>
          <br />
          <span className="text-pink-300">✨ 4 инструмента + 6 барабанов + 5 песен!</span>
        </p>
      </div>
    </div>
  );
}

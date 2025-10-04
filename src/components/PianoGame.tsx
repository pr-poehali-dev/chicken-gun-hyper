import React, { useState, useRef, useEffect } from 'react';

interface Key {
  note: string;
  frequency: number;
  color: 'white' | 'black';
  key?: string;
}

const KEYS: Key[] = [
  { note: 'C', frequency: 261.63, color: 'white', key: 'a' },
  { note: 'C#', frequency: 277.18, color: 'black', key: 'w' },
  { note: 'D', frequency: 293.66, color: 'white', key: 's' },
  { note: 'D#', frequency: 311.13, color: 'black', key: 'e' },
  { note: 'E', frequency: 329.63, color: 'white', key: 'd' },
  { note: 'F', frequency: 349.23, color: 'white', key: 'f' },
  { note: 'F#', frequency: 369.99, color: 'black', key: 't' },
  { note: 'G', frequency: 392.00, color: 'white', key: 'g' },
  { note: 'G#', frequency: 415.30, color: 'black', key: 'y' },
  { note: 'A', frequency: 440.00, color: 'white', key: 'h' },
  { note: 'A#', frequency: 466.16, color: 'black', key: 'u' },
  { note: 'B', frequency: 493.88, color: 'white', key: 'j' },
  { note: 'C2', frequency: 523.25, color: 'white', key: 'k' },
];

const SONGS = [
  { name: 'Мерцай, звёздочка', notes: ['C', 'C', 'G', 'G', 'A', 'A', 'G', 'F', 'F', 'E', 'E', 'D', 'D', 'C'] },
  { name: 'В траве сидел кузнечик', notes: ['C', 'D', 'E', 'F', 'G', 'G', 'G', 'A', 'G', 'F', 'E', 'E', 'E'] },
  { name: 'Простая мелодия', notes: ['C', 'E', 'G', 'C2', 'G', 'E', 'C'] },
];

export default function PianoGame() {
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());
  const [isRecording, setIsRecording] = useState(false);
  const [recordedNotes, setRecordedNotes] = useState<string[]>([]);
  const [selectedSong, setSelectedSong] = useState(0);
  const audioContextRef = useRef<AudioContext>();

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    return () => audioContextRef.current?.close();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = KEYS.find(k => k.key === e.key.toLowerCase());
      if (key && !activeNotes.has(key.note)) {
        playNote(key.note, key.frequency);
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

  const playNote = (note: string, frequency: number) => {
    if (!audioContextRef.current) return;

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.5);

    oscillator.start();
    oscillator.stop(audioContextRef.current.currentTime + 0.5);

    setActiveNotes(prev => new Set(prev).add(note));
    setTimeout(() => {
      setActiveNotes(prev => {
        const next = new Set(prev);
        next.delete(note);
        return next;
      });
    }, 200);

    if (isRecording) {
      setRecordedNotes(prev => [...prev, note]);
    }
  };

  const handleKeyClick = (note: string, frequency: number) => {
    playNote(note, frequency);
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
        playNote(key.note, key.frequency);
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }
  };

  const playSong = async (songIndex: number) => {
    const song = SONGS[songIndex];
    for (let i = 0; i < song.notes.length; i++) {
      const note = song.notes[i];
      const key = KEYS.find(k => k.note === note);
      if (key) {
        playNote(key.note, key.frequency);
        await new Promise(resolve => setTimeout(resolve, 400));
      }
    }
  };

  const whiteKeys = KEYS.filter(k => k.color === 'white');
  const blackKeys = KEYS.filter(k => k.color === 'black');

  return (
    <div className="flex flex-col items-center gap-8 p-8 min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="text-center">
        <h1 className="font-orbitron text-5xl text-white mb-2">🎹 Пианино</h1>
        <p className="text-purple-300 text-lg">Играй на клавишах или используй клавиатуру!</p>
      </div>

      <div className="flex gap-4 flex-wrap justify-center">
        <button
          onClick={toggleRecording}
          className={`px-6 py-3 rounded-xl font-bold text-lg transition ${
            isRecording
              ? 'bg-red-500 text-white animate-pulse'
              : 'bg-white text-purple-600 hover:bg-purple-100'
          }`}
        >
          {isRecording ? '⏹️ Стоп' : '⏺️ Записать'}
        </button>

        {recordedNotes.length > 0 && (
          <button
            onClick={playRecording}
            className="px-6 py-3 bg-green-500 text-white rounded-xl font-bold text-lg hover:bg-green-600 transition"
          >
            ▶️ Воспроизвести ({recordedNotes.length} нот)
          </button>
        )}

        {recordedNotes.length > 0 && (
          <button
            onClick={() => setRecordedNotes([])}
            className="px-6 py-3 bg-orange-500 text-white rounded-xl font-bold text-lg hover:bg-orange-600 transition"
          >
            🗑️ Очистить
          </button>
        )}
      </div>

      <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
        <p className="text-white font-semibold mb-3 text-center">🎵 Песни для обучения:</p>
        <div className="flex gap-3 flex-wrap justify-center">
          {SONGS.map((song, i) => (
            <button
              key={i}
              onClick={() => playSong(i)}
              className="px-5 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-semibold hover:scale-105 transition"
            >
              {song.name}
            </button>
          ))}
        </div>
      </div>

      <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl">
        <div className="relative flex">
          {whiteKeys.map((key, index) => (
            <button
              key={key.note}
              onClick={() => handleKeyClick(key.note, key.frequency)}
              className={`relative w-16 h-64 border-2 border-gray-800 rounded-b-lg transition-all ${
                activeNotes.has(key.note)
                  ? 'bg-gradient-to-b from-yellow-300 to-yellow-400 scale-95'
                  : 'bg-gradient-to-b from-white to-gray-100 hover:from-gray-50 hover:to-gray-200'
              }`}
              style={{ zIndex: 1 }}
            >
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <div className="text-sm font-bold text-gray-700">{key.note}</div>
                <div className="text-xs text-gray-500">{key.key?.toUpperCase()}</div>
              </div>
            </button>
          ))}
        </div>

        <div className="absolute top-8 left-8 flex pointer-events-none">
          {whiteKeys.map((_, whiteIndex) => {
            const blackKey = blackKeys[Math.floor(whiteIndex * blackKeys.length / whiteKeys.length)];
            if (!blackKey) return <div key={whiteIndex} className="w-16" />;
            
            const shouldRender = whiteIndex < whiteKeys.length - 1 && 
              !whiteKeys[whiteIndex].note.includes('E') && 
              !whiteKeys[whiteIndex].note.includes('B');

            return (
              <div key={whiteIndex} className="relative w-16">
                {shouldRender && blackKeys.find(bk => {
                  const whiteNote = whiteKeys[whiteIndex].note.replace(/[0-9]/g, '');
                  const blackNote = bk.note.replace('#', '').replace(/[0-9]/g, '');
                  return blackNote === whiteNote;
                }) && (
                  <button
                    onClick={() => {
                      const bk = blackKeys.find(bk2 => {
                        const whiteNote = whiteKeys[whiteIndex].note.replace(/[0-9]/g, '');
                        const blackNote = bk2.note.replace('#', '').replace(/[0-9]/g, '');
                        return blackNote === whiteNote;
                      });
                      if (bk) handleKeyClick(bk.note, bk.frequency);
                    }}
                    className={`absolute -right-5 w-10 h-40 rounded-b-lg pointer-events-auto transition-all ${
                      activeNotes.has(blackKeys.find(bk => {
                        const whiteNote = whiteKeys[whiteIndex].note.replace(/[0-9]/g, '');
                        const blackNote = bk.note.replace('#', '').replace(/[0-9]/g, '');
                        return blackNote === whiteNote;
                      })?.note || '')
                        ? 'bg-gradient-to-b from-purple-600 to-purple-700 scale-95'
                        : 'bg-gradient-to-b from-gray-900 to-black hover:from-gray-800'
                    }`}
                    style={{ zIndex: 2 }}
                  >
                    <div className="absolute bottom-4 left-0 right-0 text-center">
                      <div className="text-xs font-bold text-white">
                        {blackKeys.find(bk => {
                          const whiteNote = whiteKeys[whiteIndex].note.replace(/[0-9]/g, '');
                          const blackNote = bk.note.replace('#', '').replace(/[0-9]/g, '');
                          return blackNote === whiteNote;
                        })?.key?.toUpperCase()}
                      </div>
                    </div>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm px-8 py-4 rounded-xl max-w-2xl">
        <p className="text-white text-center">
          <span className="font-bold text-yellow-300">Клавиши:</span> A, W, S, E, D, F, T, G, Y, H, U, J, K
          <br />
          <span className="text-purple-300">Или нажимай на клавиши пианино мышкой! 🖱️</span>
        </p>
      </div>
    </div>
  );
}

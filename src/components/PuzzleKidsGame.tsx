import React, { useState, useEffect } from 'react';

const PUZZLES = [
  {
    id: 1,
    name: 'Котик',
    emoji: '🐱',
    pieces: ['🟫', '🟧', '🟨', '⬜'],
    solution: [0, 1, 2, 3],
  },
  {
    id: 2,
    name: 'Машинка',
    emoji: '🚗',
    pieces: ['🔵', '🔴', '⚫', '⬜'],
    solution: [0, 1, 2, 3],
  },
  {
    id: 3,
    name: 'Домик',
    emoji: '🏠',
    pieces: ['🟥', '🟦', '🟩', '🟨'],
    solution: [0, 1, 2, 3],
  },
  {
    id: 4,
    name: 'Цветок',
    emoji: '🌸',
    pieces: ['💗', '💜', '💛', '💚'],
    solution: [0, 1, 2, 3],
  },
  {
    id: 5,
    name: 'Солнышко',
    emoji: '☀️',
    pieces: ['🟡', '🟠', '🔶', '⭐'],
    solution: [0, 1, 2, 3],
  },
];

interface PuzzlePiece {
  id: number;
  emoji: string;
  position: number | null;
}

export default function PuzzleKidsGame() {
  const [currentPuzzle, setCurrentPuzzle] = useState(PUZZLES[0]);
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [slots, setSlots] = useState<(number | null)[]>([null, null, null, null]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [draggedPiece, setDraggedPiece] = useState<number | null>(null);

  useEffect(() => {
    initPuzzle();
  }, [currentPuzzle]);

  const initPuzzle = () => {
    const shuffledPieces = currentPuzzle.pieces
      .map((emoji, index) => ({ id: index, emoji, position: null }))
      .sort(() => Math.random() - 0.5);
    
    setPieces(shuffledPieces);
    setSlots([null, null, null, null]);
    setMessage('');
  };

  const handlePieceClick = (pieceId: number) => {
    const emptySlot = slots.findIndex(s => s === null);
    if (emptySlot !== -1) {
      const newSlots = [...slots];
      newSlots[emptySlot] = pieceId;
      setSlots(newSlots);

      const newPieces = pieces.filter(p => p.id !== pieceId);
      setPieces(newPieces);

      if (newPieces.length === 0) {
        checkSolution(newSlots);
      }
    }
  };

  const handleSlotClick = (slotIndex: number) => {
    const pieceId = slots[slotIndex];
    if (pieceId !== null) {
      const newSlots = [...slots];
      newSlots[slotIndex] = null;
      setSlots(newSlots);

      const piece = { 
        id: pieceId, 
        emoji: currentPuzzle.pieces[pieceId], 
        position: null 
      };
      setPieces([...pieces, piece]);
    }
  };

  const checkSolution = (currentSlots: (number | null)[]) => {
    const isCorrect = currentSlots.every((pieceId, index) => pieceId === index);
    
    if (isCorrect) {
      setMessage('🎉 Молодец! Собрала пазл!');
      setScore(score + 10);
      setTimeout(() => {
        const nextPuzzleIndex = (PUZZLES.findIndex(p => p.id === currentPuzzle.id) + 1) % PUZZLES.length;
        setCurrentPuzzle(PUZZLES[nextPuzzleIndex]);
      }, 2500);
    } else {
      setMessage('Попробуй ещё раз! 💪');
      setTimeout(() => {
        initPuzzle();
      }, 1500);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-purple-200 via-pink-200 to-blue-200 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-orbitron text-6xl text-purple-600 mb-2">🧩 Пазлы</h1>
          <p className="text-purple-500 text-2xl">Собери картинку!</p>
        </div>

        <div className="flex justify-center gap-8 mb-8">
          <div className="bg-white/90 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-lg">
            <div className="text-4xl font-bold text-purple-600">🏆 {score}</div>
            <div className="text-sm text-purple-400">Очки</div>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-12 mb-8">
          <div className="text-center mb-8">
            <div className="text-9xl mb-4 animate-bounce">{currentPuzzle.emoji}</div>
            <p className="text-4xl font-bold text-purple-600">
              Собери {currentPuzzle.name.toLowerCase()}!
            </p>
          </div>

          <div className="mb-12">
            <p className="text-2xl font-bold text-gray-700 text-center mb-6">
              Собери пазл здесь:
            </p>
            <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
              {slots.map((pieceId, index) => (
                <div
                  key={index}
                  onClick={() => handleSlotClick(index)}
                  className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 border-4 border-dashed border-purple-400 rounded-3xl flex items-center justify-center cursor-pointer hover:border-purple-600 transition shadow-lg"
                >
                  {pieceId !== null ? (
                    <div className="text-9xl">{currentPuzzle.pieces[pieceId]}</div>
                  ) : (
                    <div className="text-7xl text-purple-300">?</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {pieces.length > 0 && (
            <>
              <p className="text-2xl font-bold text-gray-700 text-center mb-6">
                Выбери кусочек:
              </p>
              <div className="flex justify-center gap-6 flex-wrap">
                {pieces.map((piece) => (
                  <button
                    key={piece.id}
                    onClick={() => handlePieceClick(piece.id)}
                    className="bg-white rounded-3xl p-8 shadow-2xl hover:scale-110 active:scale-95 transition-all border-4 border-purple-300 hover:border-purple-500"
                  >
                    <div className="text-8xl">{piece.emoji}</div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {message && (
          <div className={`text-center py-6 px-12 rounded-2xl shadow-2xl text-4xl font-bold mb-6 ${
            message.includes('Молодец')
              ? 'bg-green-400/90 text-white'
              : 'bg-orange-400/90 text-white'
          }`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-5 gap-3 mb-8">
          {PUZZLES.map((puzzle) => (
            <button
              key={puzzle.id}
              onClick={() => setCurrentPuzzle(puzzle)}
              className={`p-4 rounded-2xl transition ${
                currentPuzzle.id === puzzle.id
                  ? 'bg-purple-500 scale-105'
                  : 'bg-white/80 hover:bg-white'
              }`}
            >
              <div className="text-5xl">{puzzle.emoji}</div>
            </button>
          ))}
        </div>

        <div className="bg-white/70 backdrop-blur-sm px-6 py-4 rounded-xl text-center">
          <p className="text-purple-600 font-semibold text-xl">
            💡 Нажимай на кусочки и собирай картинку!
            <br />
            Выбирай разные пазлы снизу! 🌟
          </p>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useAdmin } from '@/contexts/AdminContext';

interface CardType {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const EMOJIS = ['🎮', '🚀', '🌟', '🎨', '🎯', '🎪', '🎭', '🎸'];

export default function MemoryGame() {
  const { adminCheats } = useAdmin();
  const [cards, setCards] = useState<CardType[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (!gameStarted || gameWon) return;

    const timer = setInterval(() => {
      if (!adminCheats.timeFreeze) {
        setTime(t => t + 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, gameWon, adminCheats]);

  const initCards = () => {
    const cardPairs = [...EMOJIS, ...EMOJIS];
    const shuffled = cardPairs
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffled);
    setFlipped([]);
    setMoves(0);
    setMatches(0);
    setTime(0);
    setGameWon(false);
    setGameStarted(true);
  };

  const handleCardClick = (id: number) => {
    if (!gameStarted || gameWon) return;
    if (flipped.length === 2) return;
    if (flipped.includes(id)) return;
    if (cards[id].isMatched) return;

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    const newCards = cards.map(card =>
      card.id === id ? { ...card, isFlipped: true } : card
    );
    setCards(newCards);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newFlipped;
      
      if (cards[first].emoji === cards[second].emoji) {
        setTimeout(() => {
          setCards(prev =>
            prev.map(card =>
              card.id === first || card.id === second
                ? { ...card, isMatched: true }
                : card
            )
          );
          setMatches(m => m + 1);
          setFlipped([]);

          if (matches + 1 === EMOJIS.length) {
            setGameWon(true);
          }
        }, adminCheats.instantCooldown ? 100 : 500);
      } else {
        setTimeout(() => {
          setCards(prev =>
            prev.map(card =>
              card.id === first || card.id === second
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlipped([]);
        }, adminCheats.instantCooldown ? 200 : 1000);
      }
    }
  };

  const autoSolve = () => {
    if (!adminCheats.autoWin) return;
    
    setCards(prev => prev.map(card => ({ ...card, isMatched: true, isFlipped: true })));
    setMatches(EMOJIS.length);
    setGameWon(true);
  };

  return (
    <Card className="w-full max-w-md bg-gray-900/95 border-purple-500/50 p-6">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-purple-400 mb-2">🎴 Память</h2>
        <div className="flex justify-between text-sm mb-2">
          <div className="text-blue-400">Ходы: {moves}</div>
          <div className="text-green-400">Пары: {matches}/{EMOJIS.length}</div>
          <div className="text-yellow-400">Время: {time}с</div>
        </div>

        {adminCheats.xrayVision && (
          <div className="text-pink-400 text-xs mb-1">👁️ Рентген-зрение активно</div>
        )}
      </div>

      {!gameStarted || gameWon ? (
        <div className="text-center py-12">
          {gameWon ? (
            <>
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-green-400 mb-2">Победа!</h3>
              <p className="text-gray-400 mb-1">Ходов: {moves}</p>
              <p className="text-gray-400 mb-6">Время: {time}с</p>
            </>
          ) : (
            <>
              <div className="text-6xl mb-4">🎴</div>
              <h3 className="text-xl font-bold text-purple-400 mb-4">Игра "Память"</h3>
              <p className="text-gray-400 text-sm mb-6">
                Найди все пары одинаковых карт!
              </p>
            </>
          )}
          
          <div className="flex gap-2 justify-center">
            <button
              onClick={initCards}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
            >
              {gameWon ? '🔄 Еще раз' : '🎮 Начать'}
            </button>
            
            {adminCheats.autoWin && gameStarted && (
              <button
                onClick={autoSolve}
                className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
              >
                🧠 Решить
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {cards.map((card) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              disabled={card.isMatched || card.isFlipped}
              className={`
                aspect-square rounded-lg text-3xl font-bold transition-all duration-300 transform
                ${
                  card.isMatched
                    ? 'bg-green-600 text-white scale-95'
                    : card.isFlipped || adminCheats.xrayVision
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 active:scale-95'
                }
              `}
            >
              {(card.isFlipped || card.isMatched || adminCheats.xrayVision) ? card.emoji : '?'}
            </button>
          ))}
        </div>
      )}

      <div className="text-xs text-gray-400 text-center mt-3">
        Найди все {EMOJIS.length} пар карточек!
      </div>
    </Card>
  );
}
import React, { useState, useEffect } from 'react';

const ANIMALS = [
  { emoji: '🐶', name: 'Собачка', sound: 'Гав-гав!' },
  { emoji: '🐱', name: 'Кошечка', sound: 'Мяу-мяу!' },
  { emoji: '🐮', name: 'Коровка', sound: 'Му-му!' },
  { emoji: '🐷', name: 'Свинка', sound: 'Хрю-хрю!' },
  { emoji: '🐸', name: 'Лягушка', sound: 'Ква-ква!' },
  { emoji: '🐔', name: 'Курочка', sound: 'Ко-ко-ко!' },
  { emoji: '🐑', name: 'Овечка', sound: 'Бе-е-е!' },
  { emoji: '🦆', name: 'Уточка', sound: 'Кря-кря!' },
];

interface Card {
  id: number;
  animal: typeof ANIMALS[0];
  isFlipped: boolean;
  isMatched: boolean;
}

export default function AnimalMatchGame() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [message, setMessage] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium'>('easy');

  useEffect(() => {
    initGame();
  }, [difficulty]);

  const initGame = () => {
    const numPairs = difficulty === 'easy' ? 4 : 6;
    const selectedAnimals = ANIMALS.slice(0, numPairs);
    const cardPairs = [...selectedAnimals, ...selectedAnimals];
    
    const shuffled = cardPairs
      .map((animal, index) => ({
        id: index,
        animal,
        isFlipped: false,
        isMatched: false,
      }))
      .sort(() => Math.random() - 0.5);

    setCards(shuffled);
    setFlippedCards([]);
    setScore(0);
    setMoves(0);
    setMessage('');
  };

  const handleCardClick = (cardId: number) => {
    if (flippedCards.length === 2) return;
    if (flippedCards.includes(cardId)) return;
    if (cards[cardId].isMatched) return;

    const newCards = [...cards];
    newCards[cardId].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      const [first, second] = newFlipped;
      
      if (cards[first].animal.emoji === cards[second].animal.emoji) {
        setMessage(`🎉 Молодец! Нашла пару ${cards[first].animal.name}!`);
        setScore(score + 10);
        
        setTimeout(() => {
          const updatedCards = [...newCards];
          updatedCards[first].isMatched = true;
          updatedCards[second].isMatched = true;
          setCards(updatedCards);
          setFlippedCards([]);
          setMessage('');

          if (updatedCards.every(card => card.isMatched)) {
            setMessage('🎊 Поздравляю! Ты нашла все пары! 🎊');
          }
        }, 1500);
      } else {
        setMessage('Попробуй ещё раз! 💪');
        setTimeout(() => {
          const updatedCards = [...newCards];
          updatedCards[first].isFlipped = false;
          updatedCards[second].isFlipped = false;
          setCards(updatedCards);
          setFlippedCards([]);
          setMessage('');
        }, 1500);
      }
    }
  };

  const allMatched = cards.length > 0 && cards.every(card => card.isMatched);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-green-200 via-blue-200 to-purple-200 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-orbitron text-6xl text-green-600 mb-2">🐾 Найди пару!</h1>
          <p className="text-green-500 text-2xl">Найди одинаковых животных!</p>
        </div>

        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setDifficulty('easy')}
            className={`px-8 py-4 rounded-2xl font-bold text-xl transition ${
              difficulty === 'easy'
                ? 'bg-green-500 text-white scale-105'
                : 'bg-white/80 text-green-600 hover:bg-white'
            }`}
          >
            🌱 Легко (4 пары)
          </button>
          <button
            onClick={() => setDifficulty('medium')}
            className={`px-8 py-4 rounded-2xl font-bold text-xl transition ${
              difficulty === 'medium'
                ? 'bg-green-500 text-white scale-105'
                : 'bg-white/80 text-green-600 hover:bg-white'
            }`}
          >
            🌳 Посложнее (6 пар)
          </button>
        </div>

        <div className="flex justify-center gap-8 mb-8">
          <div className="bg-white/90 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-lg">
            <div className="text-4xl font-bold text-green-600">🏆 {score}</div>
            <div className="text-sm text-green-400">Очки</div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-lg">
            <div className="text-4xl font-bold text-blue-600">👆 {moves}</div>
            <div className="text-sm text-blue-400">Ходы</div>
          </div>
          <button
            onClick={initGame}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-bold text-xl hover:scale-105 transition shadow-lg"
          >
            🔄 Новая игра
          </button>
        </div>

        <div className={`grid gap-4 mb-8 ${
          difficulty === 'easy' ? 'grid-cols-4' : 'grid-cols-4'
        } max-w-3xl mx-auto`}>
          {cards.map((card) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              disabled={card.isFlipped || card.isMatched}
              className="relative group"
            >
              <div
                className={`aspect-square rounded-3xl shadow-xl transition-all duration-500 transform ${
                  card.isFlipped || card.isMatched
                    ? 'bg-white rotate-y-180'
                    : 'bg-gradient-to-br from-green-400 to-blue-400 hover:scale-105'
                }`}
              >
                {card.isFlipped || card.isMatched ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="text-7xl mb-2">{card.animal.emoji}</div>
                    <div className="text-lg font-bold text-gray-700">{card.animal.name}</div>
                    <div className="text-sm text-gray-500">{card.animal.sound}</div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-6xl">❓</div>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {message && (
          <div className={`text-center py-6 px-12 rounded-2xl shadow-2xl mb-6 ${
            allMatched
              ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-5xl'
              : message.includes('Молодец')
              ? 'bg-green-400/90 text-white text-4xl'
              : 'bg-orange-400/90 text-white text-3xl'
          } font-bold`}>
            {message}
          </div>
        )}

        <div className="bg-white/70 backdrop-blur-sm px-6 py-4 rounded-xl text-center">
          <p className="text-green-600 font-semibold text-xl">
            💡 Нажимай на карточки, чтобы найти одинаковых животных!
            <br />
            Запоминай, где какое животное! 🐾
          </p>
        </div>
      </div>
    </div>
  );
}

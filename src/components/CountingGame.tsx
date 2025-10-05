import React, { useState, useEffect } from 'react';

const ITEMS = [
  { emoji: '🍎', name: 'яблоки' },
  { emoji: '⭐', name: 'звёздочки' },
  { emoji: '🐠', name: 'рыбки' },
  { emoji: '🎈', name: 'шарики' },
  { emoji: '🍓', name: 'ягодки' },
  { emoji: '🌸', name: 'цветочки' },
  { emoji: '🦋', name: 'бабочки' },
  { emoji: '🍭', name: 'конфеты' },
];

export default function CountingGame() {
  const [targetNumber, setTargetNumber] = useState(3);
  const [currentItem, setCurrentItem] = useState(ITEMS[0]);
  const [items, setItems] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [level, setLevel] = useState(1);

  useEffect(() => {
    generateQuestion();
  }, []);

  const generateQuestion = () => {
    const maxNumber = Math.min(5 + level, 10);
    const number = Math.floor(Math.random() * (maxNumber - 1)) + 1;
    const item = ITEMS[Math.floor(Math.random() * ITEMS.length)];
    
    setTargetNumber(number);
    setCurrentItem(item);
    setItems([]);
    setMessage('');
  };

  const handleNumberClick = (num: number) => {
    if (num === targetNumber) {
      setMessage('🎉 Правильно! Молодец!');
      setScore(score + 10);
      
      if ((score + 10) % 50 === 0) {
        setLevel(level + 1);
      }
      
      setTimeout(() => {
        generateQuestion();
      }, 2000);
    } else {
      setMessage('❌ Попробуй ещё раз!');
      setTimeout(() => setMessage(''), 1500);
    }
  };

  const displayItems = () => {
    const itemsArray = [];
    for (let i = 0; i < targetNumber; i++) {
      itemsArray.push(
        <div
          key={i}
          className="text-6xl animate-bounce"
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          {currentItem.emoji}
        </div>
      );
    }
    return itemsArray;
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-yellow-200 via-orange-200 to-pink-200 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-orbitron text-6xl text-orange-600 mb-2">🔢 Учимся считать!</h1>
          <p className="text-orange-500 text-2xl">Посчитай сколько здесь {currentItem.name}!</p>
        </div>

        <div className="flex justify-center gap-8 mb-8">
          <div className="bg-white/90 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-lg">
            <div className="text-4xl font-bold text-orange-600">🏆 {score}</div>
            <div className="text-sm text-orange-400">Очки</div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-lg">
            <div className="text-4xl font-bold text-purple-600">📊 {level}</div>
            <div className="text-sm text-purple-400">Уровень</div>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-12 mb-8">
          <div className="flex flex-wrap justify-center gap-6 mb-8 min-h-[200px] items-center">
            {displayItems()}
          </div>

          <div className="text-center mb-6">
            <p className="text-3xl font-bold text-purple-600 mb-4">
              Сколько {currentItem.name}?
            </p>
          </div>

          <div className="grid grid-cols-5 gap-4 max-w-3xl mx-auto">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].slice(0, Math.min(5 + level, 10)).map((num) => (
              <button
                key={num}
                onClick={() => handleNumberClick(num)}
                className="relative group"
              >
                <div className="bg-gradient-to-br from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white rounded-3xl p-8 font-bold text-5xl shadow-xl hover:scale-110 active:scale-95 transition-all duration-200">
                  {num}
                </div>
              </button>
            ))}
          </div>
        </div>

        {message && (
          <div className={`text-center py-6 px-12 rounded-2xl shadow-2xl text-4xl font-bold ${
            message.includes('Правильно')
              ? 'bg-green-400/90 text-white'
              : 'bg-red-400/90 text-white'
          }`}>
            {message}
          </div>
        )}

        <div className="mt-8 bg-white/70 backdrop-blur-sm px-6 py-4 rounded-xl text-center">
          <p className="text-purple-600 font-semibold text-xl">
            💡 Посчитай {currentItem.name} и нажми правильную цифру!
            <br />
            Чем больше правильных ответов, тем сложнее задания! 🌟
          </p>
        </div>
      </div>
    </div>
  );
}

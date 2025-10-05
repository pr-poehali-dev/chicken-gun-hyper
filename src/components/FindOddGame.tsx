import React, { useState, useEffect } from 'react';

const TASKS = [
  {
    id: 1,
    items: ['🍎', '🍎', '🍎', '🍌'],
    odd: 3,
    description: 'Найди фрукт, который не похож на другие!',
  },
  {
    id: 2,
    items: ['🐶', '🐱', '🐶', '🐶'],
    odd: 1,
    description: 'Найди животное, которое отличается!',
  },
  {
    id: 3,
    items: ['⭐', '⭐', '❤️', '⭐'],
    odd: 2,
    description: 'Какой предмет не такой как все?',
  },
  {
    id: 4,
    items: ['🚗', '🚗', '🚗', '🚁'],
    odd: 3,
    description: 'Найди транспорт, который отличается!',
  },
  {
    id: 5,
    items: ['🌸', '🌺', '🌸', '🌸'],
    odd: 1,
    description: 'Какой цветок другой?',
  },
  {
    id: 6,
    items: ['🟥', '🟥', '🟦', '🟥'],
    odd: 2,
    description: 'Найди квадрат другого цвета!',
  },
  {
    id: 7,
    items: ['🐠', '🐟', '🐠', '🐠'],
    odd: 1,
    description: 'Какая рыбка не такая?',
  },
  {
    id: 8,
    items: ['🎈', '🎈', '🎈', '🎁'],
    odd: 3,
    description: 'Что здесь лишнее?',
  },
];

export default function FindOddGame() {
  const [currentTask, setCurrentTask] = useState(TASKS[0]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [level, setLevel] = useState(1);

  useEffect(() => {
    generateTask();
  }, []);

  const generateTask = () => {
    const randomTask = TASKS[Math.floor(Math.random() * TASKS.length)];
    setCurrentTask(randomTask);
    setMessage('');
  };

  const handleItemClick = (index: number) => {
    if (index === currentTask.odd) {
      setMessage('🎉 Правильно! Молодец!');
      setScore(score + 10);
      
      if ((score + 10) % 30 === 0) {
        setLevel(level + 1);
      }
      
      setTimeout(() => {
        generateTask();
      }, 2000);
    } else {
      setMessage('Попробуй ещё раз! 💪');
      setTimeout(() => setMessage(''), 1500);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-orbitron text-6xl text-blue-600 mb-2">🔍 Найди лишнее!</h1>
          <p className="text-blue-500 text-2xl">Какой предмет отличается?</p>
        </div>

        <div className="flex justify-center gap-8 mb-8">
          <div className="bg-white/90 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-lg">
            <div className="text-4xl font-bold text-blue-600">🏆 {score}</div>
            <div className="text-sm text-blue-400">Очки</div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-lg">
            <div className="text-4xl font-bold text-purple-600">📊 {level}</div>
            <div className="text-sm text-purple-400">Уровень</div>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-12 mb-8">
          <div className="text-center mb-12">
            <p className="text-4xl font-bold text-purple-600 mb-2">
              {currentTask.description}
            </p>
            <p className="text-2xl text-gray-600">
              Нажми на него!
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {currentTask.items.map((item, index) => (
              <button
                key={index}
                onClick={() => handleItemClick(index)}
                className="group relative"
              >
                <div className="bg-gradient-to-br from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 rounded-3xl p-12 shadow-2xl hover:scale-110 active:scale-95 transition-all duration-200">
                  <div className="text-9xl">{item}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {message && (
          <div className={`text-center py-6 px-12 rounded-2xl shadow-2xl text-4xl font-bold mb-6 ${
            message.includes('Правильно')
              ? 'bg-green-400/90 text-white'
              : 'bg-orange-400/90 text-white'
          }`}>
            {message}
          </div>
        )}

        <div className="bg-white/70 backdrop-blur-sm px-6 py-4 rounded-xl text-center">
          <p className="text-blue-600 font-semibold text-xl">
            💡 Посмотри внимательно — один предмет отличается от других!
            <br />
            Найди его и нажми! 🌟
          </p>
        </div>
      </div>
    </div>
  );
}

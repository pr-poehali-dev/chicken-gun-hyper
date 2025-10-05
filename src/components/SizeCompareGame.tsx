import React, { useState, useEffect } from 'react';

const OBJECTS = [
  { emoji: '🐘', name: 'Слон', sizes: ['text-9xl', 'text-6xl', 'text-4xl'] },
  { emoji: '🐶', name: 'Собачка', sizes: ['text-9xl', 'text-6xl', 'text-4xl'] },
  { emoji: '🌳', name: 'Дерево', sizes: ['text-9xl', 'text-6xl', 'text-4xl'] },
  { emoji: '⭐', name: 'Звёздочка', sizes: ['text-9xl', 'text-6xl', 'text-4xl'] },
  { emoji: '🎈', name: 'Шарик', sizes: ['text-9xl', 'text-6xl', 'text-4xl'] },
  { emoji: '🏀', name: 'Мяч', sizes: ['text-9xl', 'text-6xl', 'text-4xl'] },
];

const QUESTIONS = [
  'Где САМЫЙ БОЛЬШОЙ?',
  'Где САМЫЙ МАЛЕНЬКИЙ?',
  'Покажи СРЕДНИЙ!',
];

export default function SizeCompareGame() {
  const [currentObject, setCurrentObject] = useState(OBJECTS[0]);
  const [question, setQuestion] = useState(QUESTIONS[0]);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [shuffledSizes, setShuffledSizes] = useState<number[]>([]);

  useEffect(() => {
    generateQuestion();
  }, []);

  const generateQuestion = () => {
    const randomObject = OBJECTS[Math.floor(Math.random() * OBJECTS.length)];
    const randomQuestion = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
    
    setCurrentObject(randomObject);
    setQuestion(randomQuestion);
    
    let answer = 0;
    if (randomQuestion.includes('БОЛЬШОЙ')) {
      answer = 0;
    } else if (randomQuestion.includes('МАЛЕНЬКИЙ')) {
      answer = 2;
    } else {
      answer = 1;
    }
    
    const positions = [0, 1, 2].sort(() => Math.random() - 0.5);
    setShuffledSizes(positions);
    setCorrectAnswer(positions.indexOf(answer));
    setMessage('');
  };

  const handleSizeClick = (index: number) => {
    if (index === correctAnswer) {
      setMessage('🎉 Правильно! Молодец!');
      setScore(score + 10);
      setTimeout(() => {
        generateQuestion();
      }, 2000);
    } else {
      setMessage('Попробуй ещё раз! 💪');
      setTimeout(() => setMessage(''), 1500);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-yellow-200 via-green-200 to-blue-200 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-orbitron text-6xl text-green-600 mb-2">📏 Большой и Маленький</h1>
          <p className="text-green-500 text-2xl">Учимся сравнивать размеры!</p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="bg-white/90 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-lg">
            <div className="text-4xl font-bold text-green-600">🏆 {score}</div>
            <div className="text-sm text-green-400">Очки</div>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-12 mb-8">
          <div className="text-center mb-12">
            <p className="text-5xl font-bold text-purple-600 mb-4">
              {question}
            </p>
            <p className="text-3xl text-gray-600">
              Нажми на него!
            </p>
          </div>

          <div className="flex justify-center items-end gap-12 mb-12">
            {shuffledSizes.map((sizeIndex, index) => (
              <button
                key={index}
                onClick={() => handleSizeClick(index)}
                className="group relative flex flex-col items-center"
              >
                <div className="bg-gradient-to-br from-yellow-300 to-orange-300 hover:from-yellow-400 hover:to-orange-400 rounded-3xl p-8 shadow-2xl hover:scale-110 active:scale-95 transition-all duration-200">
                  <div className={currentObject.sizes[sizeIndex]}>
                    {currentObject.emoji}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="text-center">
            <p className="text-2xl text-gray-500 mb-4">
              Это {currentObject.name.toLowerCase()}
            </p>
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

        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-8">
          <p className="text-2xl font-bold text-gray-700 text-center mb-6">
            📚 Учимся:
          </p>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center bg-gradient-to-br from-red-200 to-orange-200 rounded-2xl p-6">
              <div className="text-8xl mb-2">🐘</div>
              <p className="text-xl font-bold text-gray-700">БОЛЬШОЙ</p>
            </div>
            <div className="text-center bg-gradient-to-br from-yellow-200 to-green-200 rounded-2xl p-6">
              <div className="text-6xl mb-2">🐘</div>
              <p className="text-xl font-bold text-gray-700">СРЕДНИЙ</p>
            </div>
            <div className="text-center bg-gradient-to-br from-blue-200 to-purple-200 rounded-2xl p-6">
              <div className="text-4xl mb-2">🐘</div>
              <p className="text-xl font-bold text-gray-700">МАЛЕНЬКИЙ</p>
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm px-6 py-4 rounded-xl text-center">
          <p className="text-green-600 font-semibold text-xl">
            💡 Смотри внимательно на размеры и выбирай правильный!
            <br />
            Большой, средний или маленький! 📏
          </p>
        </div>
      </div>
    </div>
  );
}

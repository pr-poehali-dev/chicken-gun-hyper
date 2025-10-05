import React, { useState, useEffect } from 'react';

const ANIMALS = [
  { emoji: '🐶', name: 'Собачка', sound: 'Гав-гав!', color: 'from-yellow-400 to-orange-400' },
  { emoji: '🐱', name: 'Кошечка', sound: 'Мяу-мяу!', color: 'from-pink-400 to-purple-400' },
  { emoji: '🐮', name: 'Коровка', sound: 'Му-му!', color: 'from-brown-400 to-orange-400' },
  { emoji: '🐷', name: 'Свинка', sound: 'Хрю-хрю!', color: 'from-pink-400 to-red-400' },
  { emoji: '🐸', name: 'Лягушка', sound: 'Ква-ква!', color: 'from-green-400 to-emerald-400' },
  { emoji: '🐔', name: 'Курочка', sound: 'Ко-ко-ко!', color: 'from-yellow-400 to-red-400' },
  { emoji: '🐑', name: 'Овечка', sound: 'Бе-е-е!', color: 'from-gray-300 to-gray-400' },
  { emoji: '🦆', name: 'Уточка', sound: 'Кря-кря!', color: 'from-yellow-400 to-orange-400' },
  { emoji: '🐴', name: 'Лошадка', sound: 'И-го-го!', color: 'from-brown-500 to-amber-600' },
  { emoji: '🐻', name: 'Мишка', sound: 'Р-р-р!', color: 'from-brown-600 to-orange-700' },
];

export default function AnimalSoundsGame() {
  const [currentAnimal, setCurrentAnimal] = useState(ANIMALS[0]);
  const [options, setOptions] = useState<typeof ANIMALS>([]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [showSound, setShowSound] = useState(true);
  const [correctCount, setCorrectCount] = useState(0);

  useEffect(() => {
    generateQuestion();
  }, []);

  const generateQuestion = () => {
    const randomAnimal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
    setCurrentAnimal(randomAnimal);

    const otherAnimals = ANIMALS.filter(a => a.name !== randomAnimal.name);
    const shuffled = [randomAnimal, ...otherAnimals.sort(() => Math.random() - 0.5).slice(0, 3)]
      .sort(() => Math.random() - 0.5);

    setOptions(shuffled);
    setMessage('');
  };

  const handleAnimalClick = (animal: typeof ANIMALS[0]) => {
    if (animal.name === currentAnimal.name) {
      setMessage(`🎉 Правильно! Это ${animal.name}!`);
      setScore(score + 10);
      setCorrectCount(correctCount + 1);
      
      setTimeout(() => {
        generateQuestion();
      }, 2000);
    } else {
      setMessage(`Нет, это ${animal.name}. Попробуй ещё раз!`);
      setTimeout(() => setMessage(''), 2000);
    }
  };

  const playAllSounds = () => {
    setShowSound(true);
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-green-200 via-yellow-200 to-orange-200 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-orbitron text-6xl text-green-600 mb-2">🔊 Угадай кто говорит!</h1>
          <p className="text-green-500 text-2xl">Слушай звуки животных!</p>
        </div>

        <div className="flex justify-center gap-8 mb-8">
          <div className="bg-white/90 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-lg">
            <div className="text-4xl font-bold text-green-600">🏆 {score}</div>
            <div className="text-sm text-green-400">Очки</div>
          </div>
          <div className="bg-white/90 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-lg">
            <div className="text-4xl font-bold text-orange-600">⭐ {correctCount}</div>
            <div className="text-sm text-orange-400">Правильно</div>
          </div>
          <button
            onClick={() => setShowSound(!showSound)}
            className={`px-8 py-4 rounded-2xl font-bold text-xl transition shadow-lg ${
              showSound
                ? 'bg-green-500 text-white'
                : 'bg-white/80 text-green-600 hover:bg-white'
            }`}
          >
            {showSound ? '🔊 Звук ВКЛ' : '🔇 Звук ВЫКЛ'}
          </button>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-12 mb-8">
          <div className="text-center mb-12">
            {showSound ? (
              <>
                <div className="text-9xl mb-6 animate-bounce">🔊</div>
                <div className={`bg-gradient-to-r ${currentAnimal.color} text-white rounded-3xl py-8 px-12 text-6xl font-bold shadow-2xl mb-6 inline-block`}>
                  {currentAnimal.sound}
                </div>
                <p className="text-3xl font-bold text-gray-700">
                  Кто так говорит?
                </p>
              </>
            ) : (
              <>
                <div className="text-9xl mb-6">{currentAnimal.emoji}</div>
                <p className="text-3xl font-bold text-gray-700">
                  Как говорит {currentAnimal.name}?
                </p>
              </>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {options.map((animal) => (
              <button
                key={animal.name}
                onClick={() => handleAnimalClick(animal)}
                className="group relative"
              >
                <div className={`bg-gradient-to-br ${animal.color} rounded-3xl p-8 shadow-xl hover:scale-110 active:scale-95 transition-all duration-200`}>
                  <div className="text-8xl mb-4">{animal.emoji}</div>
                  <p className="text-xl font-bold text-white">{animal.name}</p>
                  {!showSound && (
                    <p className="text-lg text-white/90 mt-2">{animal.sound}</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {message && (
          <div className={`text-center py-6 px-12 rounded-2xl shadow-2xl text-4xl font-bold mb-8 ${
            message.includes('Правильно')
              ? 'bg-green-400/90 text-white'
              : 'bg-orange-400/90 text-white'
          }`}>
            {message}
          </div>
        )}

        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-8">
          <p className="text-2xl font-bold text-gray-700 text-center mb-6">
            🎵 Все животные и их звуки:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {ANIMALS.map((animal) => (
              <div
                key={animal.name}
                className={`bg-gradient-to-br ${animal.color} rounded-2xl p-4 text-center shadow-lg`}
              >
                <div className="text-5xl mb-2">{animal.emoji}</div>
                <p className="text-sm font-bold text-white">{animal.name}</p>
                <p className="text-xs text-white/90">{animal.sound}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm px-6 py-4 rounded-xl text-center">
          <p className="text-green-600 font-semibold text-xl">
            💡 Слушай звук и угадывай животное!
            <br />
            Переключай режимы кнопкой сверху! 🐾
          </p>
        </div>
      </div>
    </div>
  );
}

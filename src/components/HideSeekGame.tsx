import React, { useState, useEffect } from 'react';

const CHARACTERS = [
  { emoji: '🐶', name: 'Собачка', color: 'from-yellow-400 to-orange-400' },
  { emoji: '🐱', name: 'Котик', color: 'from-pink-400 to-purple-400' },
  { emoji: '🐻', name: 'Мишка', color: 'from-brown-400 to-orange-400' },
  { emoji: '🐰', name: 'Зайка', color: 'from-gray-300 to-pink-300' },
  { emoji: '🦊', name: 'Лисичка', color: 'from-orange-400 to-red-400' },
];

const HIDING_PLACES = [
  { emoji: '🪴', name: 'За цветком' },
  { emoji: '🏠', name: 'За домиком' },
  { emoji: '🌳', name: 'За деревом' },
  { emoji: '☁️', name: 'За облачком' },
];

export default function HideSeekGame() {
  const [character, setCharacter] = useState(CHARACTERS[0]);
  const [hidingPlace, setHidingPlace] = useState(0);
  const [revealed, setRevealed] = useState<boolean[]>([false, false, false, false]);
  const [found, setFound] = useState(false);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    startNewRound();
  }, []);

  const startNewRound = () => {
    const randomCharacter = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
    const randomPlace = Math.floor(Math.random() * 4);
    
    setCharacter(randomCharacter);
    setHidingPlace(randomPlace);
    setRevealed([false, false, false, false]);
    setFound(false);
    setMessage('');
    setShowHint(false);
  };

  const handlePlaceClick = (index: number) => {
    if (found) return;

    const newRevealed = [...revealed];
    newRevealed[index] = true;
    setRevealed(newRevealed);

    if (index === hidingPlace) {
      setFound(true);
      setMessage(`🎉 Нашла! ${character.name} прятался здесь!`);
      setScore(score + 10);
      setTimeout(() => {
        startNewRound();
      }, 3000);
    } else {
      setMessage('Здесь никого нет! Ищи дальше! 🔍');
      setTimeout(() => setMessage(''), 1500);
    }
  };

  const useHint = () => {
    setShowHint(true);
    setTimeout(() => setShowHint(false), 3000);
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-sky-200 via-blue-200 to-indigo-200 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-orbitron text-6xl text-blue-600 mb-2">🙈 Весёлые Прятки!</h1>
          <p className="text-blue-500 text-2xl">Найди где спрятался зверёк!</p>
        </div>

        <div className="flex justify-center gap-8 mb-8">
          <div className="bg-white/90 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-lg">
            <div className="text-4xl font-bold text-blue-600">🏆 {score}</div>
            <div className="text-sm text-blue-400">Очки</div>
          </div>
          <button
            onClick={useHint}
            disabled={showHint}
            className={`px-8 py-4 rounded-2xl font-bold text-xl transition shadow-lg ${
              showHint
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-yellow-400 hover:bg-yellow-500 text-yellow-900'
            }`}
          >
            💡 Подсказка
          </button>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-12 mb-8">
          <div className="text-center mb-12">
            <div className="text-9xl mb-4 animate-bounce">{character.emoji}</div>
            <p className="text-4xl font-bold text-purple-600 mb-2">
              {character.name} играет в прятки!
            </p>
            <p className="text-2xl text-gray-600">
              Где же {character.name.toLowerCase()} спрятался?
            </p>
            {showHint && (
              <div className="mt-6 bg-yellow-200 border-4 border-yellow-400 rounded-2xl px-8 py-4 inline-block">
                <p className="text-2xl font-bold text-yellow-900">
                  💡 Подсказка: {HIDING_PLACES[hidingPlace].name}!
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {HIDING_PLACES.map((place, index) => (
              <button
                key={index}
                onClick={() => handlePlaceClick(index)}
                disabled={revealed[index]}
                className={`relative group ${revealed[index] ? 'cursor-default' : ''}`}
              >
                <div className={`rounded-3xl p-12 shadow-2xl transition-all duration-500 ${
                  revealed[index]
                    ? index === hidingPlace
                      ? `bg-gradient-to-br ${character.color} scale-110`
                      : 'bg-gray-300'
                    : 'bg-gradient-to-br from-green-400 to-emerald-400 hover:scale-110 active:scale-95'
                }`}>
                  <div className="text-8xl mb-4">{place.emoji}</div>
                  <p className="text-xl font-bold text-white">
                    {place.name}
                  </p>
                  {revealed[index] && index === hidingPlace && (
                    <div className="text-7xl mt-4 animate-bounce">
                      {character.emoji}
                    </div>
                  )}
                  {revealed[index] && index !== hidingPlace && (
                    <div className="text-5xl mt-4">❌</div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {message && (
          <div className={`text-center py-6 px-12 rounded-2xl shadow-2xl text-4xl font-bold mb-6 ${
            found
              ? 'bg-green-400/90 text-white'
              : 'bg-blue-400/90 text-white'
          }`}>
            {message}
          </div>
        )}

        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-8">
          <p className="text-2xl font-bold text-gray-700 text-center mb-6">
            🐾 Кто может спрятаться:
          </p>
          <div className="flex justify-center gap-6 flex-wrap">
            {CHARACTERS.map((char) => (
              <div
                key={char.name}
                className={`bg-gradient-to-br ${char.color} rounded-2xl p-6 text-center shadow-lg`}
              >
                <div className="text-6xl mb-2">{char.emoji}</div>
                <p className="text-lg font-bold text-white">{char.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm px-6 py-4 rounded-xl text-center">
          <p className="text-blue-600 font-semibold text-xl">
            💡 Нажимай на места и ищи зверюшку!
            <br />
            Используй подсказку если сложно! 🌟
          </p>
        </div>
      </div>
    </div>
  );
}

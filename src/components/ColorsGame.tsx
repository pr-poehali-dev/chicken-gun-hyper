import React, { useState, useEffect } from 'react';

const COLORS = [
  { name: 'Красный', value: '#FF0000', emoji: '🍎' },
  { name: 'Синий', value: '#0000FF', emoji: '💙' },
  { name: 'Жёлтый', value: '#FFFF00', emoji: '🌟' },
  { name: 'Зелёный', value: '#00FF00', emoji: '🍀' },
  { name: 'Оранжевый', value: '#FFA500', emoji: '🍊' },
  { name: 'Фиолетовый', value: '#9370DB', emoji: '🍇' },
  { name: 'Розовый', value: '#FF69B4', emoji: '🌸' },
  { name: 'Коричневый', value: '#8B4513', emoji: '🤎' },
];

const OBJECTS = {
  'Красный': ['🍎', '🍓', '🌹', '❤️', '🍅'],
  'Синий': ['💙', '🌊', '🦋', '🫐', '🩵'],
  'Жёлтый': ['🌟', '🌻', '🍌', '🌙', '⭐'],
  'Зелёный': ['🍀', '🌿', '🐸', '🌲', '🥒'],
  'Оранжевый': ['🍊', '🎃', '🦊', '🥕', '🧡'],
  'Фиолетовый': ['🍇', '💜', '🌂', '🦄', '🔮'],
  'Розовый': ['🌸', '🩷', '🌺', '🦩', '🐷'],
  'Коричневый': ['🤎', '🐻', '🍫', '🥔', '🪵'],
};

export default function ColorsGame() {
  const [currentColor, setCurrentColor] = useState(COLORS[0]);
  const [options, setOptions] = useState<typeof COLORS>([]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [showObjects, setShowObjects] = useState(true);

  useEffect(() => {
    generateQuestion();
  }, []);

  const generateQuestion = () => {
    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    setCurrentColor(randomColor);

    const otherColors = COLORS.filter(c => c.name !== randomColor.name);
    const shuffled = [randomColor, ...otherColors.sort(() => Math.random() - 0.5).slice(0, 3)]
      .sort(() => Math.random() - 0.5);

    setOptions(shuffled);
    setMessage('');
  };

  const handleColorClick = (color: typeof COLORS[0]) => {
    if (color.name === currentColor.name) {
      setMessage('🎉 Правильно! Молодец!');
      setScore(score + 10);
      setTimeout(() => {
        generateQuestion();
      }, 2000);
    } else {
      setMessage(`Попробуй ещё раз! Это ${color.name.toLowerCase()} цвет`);
      setTimeout(() => setMessage(''), 2000);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-pink-200 via-yellow-200 to-blue-200 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-orbitron text-6xl text-purple-600 mb-2">🎨 Учим цвета!</h1>
          <p className="text-purple-500 text-2xl">Найди правильный цвет!</p>
        </div>

        <div className="flex justify-center gap-8 mb-8">
          <div className="bg-white/90 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-lg">
            <div className="text-4xl font-bold text-purple-600">🏆 {score}</div>
            <div className="text-sm text-purple-400">Очки</div>
          </div>
          <button
            onClick={() => setShowObjects(!showObjects)}
            className={`px-8 py-4 rounded-2xl font-bold text-xl transition shadow-lg ${
              showObjects
                ? 'bg-purple-500 text-white'
                : 'bg-white/80 text-purple-600'
            }`}
          >
            {showObjects ? '🎨 Показать цвет' : '🎈 Показать предметы'}
          </button>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-12 mb-8">
          <div className="text-center mb-8">
            <p className="text-4xl font-bold text-purple-600 mb-8">
              Где {currentColor.name.toLowerCase()} цвет?
            </p>

            {showObjects ? (
              <div className="flex justify-center gap-6 mb-8 flex-wrap">
                {OBJECTS[currentColor.name as keyof typeof OBJECTS].map((obj, idx) => (
                  <div
                    key={idx}
                    className="text-8xl animate-bounce"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    {obj}
                  </div>
                ))}
              </div>
            ) : (
              <div className="mb-8 flex justify-center">
                <div
                  className="w-64 h-64 rounded-3xl shadow-2xl border-8 border-white"
                  style={{ backgroundColor: currentColor.value }}
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {options.map((color) => (
              <button
                key={color.name}
                onClick={() => handleColorClick(color)}
                className="group relative"
              >
                <div className="bg-white rounded-3xl p-8 shadow-xl hover:scale-110 active:scale-95 transition-all duration-200">
                  <div
                    className="w-32 h-32 rounded-2xl mx-auto mb-4 shadow-lg border-4 border-gray-200"
                    style={{ backgroundColor: color.value }}
                  />
                  <p className="text-2xl font-bold text-gray-700">{color.name}</p>
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
          <p className="text-purple-600 font-semibold text-xl">
            💡 Смотри на предметы или цвет и выбирай правильное название!
            <br />
            Переключай режимы кнопкой сверху! 🌈
          </p>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';

const HAIRSTYLES = [
  { id: 'long', emoji: '👱‍♀️', name: 'Длинные', color: 'bg-pink-400' },
  { id: 'short', emoji: '👩', name: 'Короткие', color: 'bg-purple-400' },
  { id: 'curly', emoji: '👩‍🦱', name: 'Кудрявые', color: 'bg-rose-400' },
  { id: 'ponytail', emoji: '🙋‍♀️', name: 'Хвостик', color: 'bg-fuchsia-400' },
];

const HAIR_COLORS = [
  { id: 'blonde', name: 'Блонд', color: '#FFD700', bg: 'bg-yellow-300' },
  { id: 'brown', name: 'Шатен', color: '#8B4513', bg: 'bg-amber-700' },
  { id: 'black', name: 'Чёрный', color: '#000000', bg: 'bg-gray-900' },
  { id: 'red', name: 'Рыжий', color: '#FF4500', bg: 'bg-orange-600' },
  { id: 'pink', name: 'Розовый', color: '#FF69B4', bg: 'bg-pink-500' },
  { id: 'blue', name: 'Синий', color: '#4169E1', bg: 'bg-blue-500' },
];

const MAKEUP_ITEMS = [
  { id: 'lipstick', emoji: '💄', name: 'Помада', colors: ['#FF1493', '#DC143C', '#FF69B4', '#C71585'] },
  { id: 'eyeshadow', emoji: '🎨', name: 'Тени', colors: ['#9370DB', '#4169E1', '#20B2AA', '#FFD700'] },
  { id: 'blush', emoji: '✨', name: 'Румяна', colors: ['#FFB6C1', '#FFC0CB', '#FF69B4', '#FFE4E1'] },
];

const ACCESSORIES = [
  { id: 'crown', emoji: '👑', name: 'Корона' },
  { id: 'bow', emoji: '🎀', name: 'Бантик' },
  { id: 'flower', emoji: '🌸', name: 'Цветок' },
  { id: 'star', emoji: '⭐', name: 'Звёздочка' },
  { id: 'heart', emoji: '💖', name: 'Сердечко' },
];

export default function BeautySalonGame() {
  const [selectedHair, setSelectedHair] = useState(HAIRSTYLES[0]);
  const [selectedColor, setSelectedColor] = useState(HAIR_COLORS[0]);
  const [makeup, setMakeup] = useState<{[key: string]: string}>({});
  const [accessory, setAccessory] = useState(ACCESSORIES[0]);
  const [currentTab, setCurrentTab] = useState<'hair' | 'makeup' | 'accessories'>('hair');

  const resetAll = () => {
    setSelectedHair(HAIRSTYLES[0]);
    setSelectedColor(HAIR_COLORS[0]);
    setMakeup({});
    setAccessory(ACCESSORIES[0]);
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-rose-200 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="font-orbitron text-4xl md:text-6xl text-pink-600 mb-2">💅 Салон Красоты!</h1>
          <p className="text-pink-500 text-xl md:text-2xl">Создай свой неповторимый образ!</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Preview Area */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
            <div className="text-center mb-4">
              <h2 className="text-3xl font-bold text-purple-600 mb-2">✨ Твоя модель</h2>
            </div>
            
            <div className="relative bg-gradient-to-br from-pink-100 to-purple-100 rounded-3xl p-12 min-h-[400px] flex flex-col items-center justify-center">
              {/* Accessory on top */}
              <div className="text-7xl mb-2 animate-bounce">
                {accessory.emoji}
              </div>
              
              {/* Hair */}
              <div className="text-9xl mb-4" style={{ filter: `hue-rotate(${selectedColor.id === 'blonde' ? '0deg' : selectedColor.id === 'brown' ? '20deg' : selectedColor.id === 'black' ? '40deg' : selectedColor.id === 'red' ? '-20deg' : selectedColor.id === 'pink' ? '-40deg' : '-60deg'})` }}>
                {selectedHair.emoji}
              </div>

              {/* Makeup indicators */}
              <div className="flex gap-4 mt-4">
                {makeup.lipstick && (
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-3xl" style={{ backgroundColor: makeup.lipstick }}>
                    💋
                  </div>
                )}
                {makeup.eyeshadow && (
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-3xl" style={{ backgroundColor: makeup.eyeshadow }}>
                    👁️
                  </div>
                )}
                {makeup.blush && (
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-3xl" style={{ backgroundColor: makeup.blush }}>
                    ✨
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={resetAll}
              className="w-full mt-6 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold text-xl py-4 rounded-2xl shadow-lg transition"
            >
              🔄 Начать заново
            </button>
          </div>

          {/* Tools Area */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6">
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setCurrentTab('hair')}
                className={`flex-1 py-3 rounded-xl font-bold text-lg transition ${
                  currentTab === 'hair'
                    ? 'bg-pink-500 text-white shadow-lg scale-105'
                    : 'bg-pink-200 text-pink-700 hover:bg-pink-300'
                }`}
              >
                💇‍♀️ Волосы
              </button>
              <button
                onClick={() => setCurrentTab('makeup')}
                className={`flex-1 py-3 rounded-xl font-bold text-lg transition ${
                  currentTab === 'makeup'
                    ? 'bg-purple-500 text-white shadow-lg scale-105'
                    : 'bg-purple-200 text-purple-700 hover:bg-purple-300'
                }`}
              >
                💄 Макияж
              </button>
              <button
                onClick={() => setCurrentTab('accessories')}
                className={`flex-1 py-3 rounded-xl font-bold text-lg transition ${
                  currentTab === 'accessories'
                    ? 'bg-rose-500 text-white shadow-lg scale-105'
                    : 'bg-rose-200 text-rose-700 hover:bg-rose-300'
                }`}
              >
                👑 Украшения
              </button>
            </div>

            <div className="overflow-y-auto max-h-[500px] pr-2">
              {/* Hair Tab */}
              {currentTab === 'hair' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-pink-600 mb-4">Выбери причёску:</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {HAIRSTYLES.map((style) => (
                        <button
                          key={style.id}
                          onClick={() => setSelectedHair(style)}
                          className={`${style.color} p-6 rounded-2xl shadow-lg transition hover:scale-105 ${
                            selectedHair.id === style.id ? 'ring-4 ring-white scale-105' : ''
                          }`}
                        >
                          <div className="text-5xl mb-2">{style.emoji}</div>
                          <p className="text-white font-bold text-lg">{style.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-pink-600 mb-4">Выбери цвет:</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {HAIR_COLORS.map((color) => (
                        <button
                          key={color.id}
                          onClick={() => setSelectedColor(color)}
                          className={`${color.bg} p-4 rounded-xl shadow-lg transition hover:scale-105 ${
                            selectedColor.id === color.id ? 'ring-4 ring-white scale-105' : ''
                          }`}
                        >
                          <div className="w-12 h-12 rounded-full mx-auto mb-2" style={{ backgroundColor: color.color }}></div>
                          <p className="text-white font-bold text-sm">{color.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Makeup Tab */}
              {currentTab === 'makeup' && (
                <div className="space-y-6">
                  {MAKEUP_ITEMS.map((item) => (
                    <div key={item.id}>
                      <h3 className="text-2xl font-bold text-purple-600 mb-4">
                        {item.emoji} {item.name}:
                      </h3>
                      <div className="grid grid-cols-4 gap-3">
                        {item.colors.map((color, idx) => (
                          <button
                            key={idx}
                            onClick={() => setMakeup({ ...makeup, [item.id]: color })}
                            className={`p-4 rounded-xl shadow-lg transition hover:scale-105 ${
                              makeup[item.id] === color ? 'ring-4 ring-purple-500 scale-105' : ''
                            }`}
                            style={{ backgroundColor: color }}
                          >
                            <div className="text-2xl">{item.emoji}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Accessories Tab */}
              {currentTab === 'accessories' && (
                <div>
                  <h3 className="text-2xl font-bold text-rose-600 mb-4">Выбери украшение:</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {ACCESSORIES.map((acc) => (
                      <button
                        key={acc.id}
                        onClick={() => setAccessory(acc)}
                        className={`bg-gradient-to-br from-rose-400 to-pink-400 p-8 rounded-2xl shadow-lg transition hover:scale-105 ${
                          accessory.id === acc.id ? 'ring-4 ring-white scale-105' : ''
                        }`}
                      >
                        <div className="text-6xl mb-2">{acc.emoji}</div>
                        <p className="text-white font-bold text-lg">{acc.name}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm px-6 py-4 rounded-xl text-center">
          <p className="text-pink-600 font-semibold text-xl">
            💖 Создавай красивые образы и веселись! ✨
          </p>
        </div>
      </div>
    </div>
  );
}

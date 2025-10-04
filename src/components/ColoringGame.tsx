import React, { useState } from 'react';

interface ColoringImage {
  id: string;
  name: string;
  emoji: string;
  paths: { d: string; defaultColor: string }[];
}

const IMAGES: ColoringImage[] = [
  {
    id: 'cat',
    name: 'Кошка',
    emoji: '🐱',
    paths: [
      { d: 'M150 100 Q140 80 120 80 Q100 80 90 100 L80 140 Q80 180 100 200 L120 220 L140 220 Q160 200 160 180 L160 140 Z', defaultColor: '#f0f0f0' },
      { d: 'M110 105 A8 8 0 1 1 110 103 Z', defaultColor: '#333' },
      { d: 'M130 105 A8 8 0 1 1 130 103 Z', defaultColor: '#333' },
      { d: 'M120 130 Q115 135 120 140 Q125 135 120 130 Z', defaultColor: '#ff69b4' },
      { d: 'M70 80 L90 95 L85 100 Z', defaultColor: '#f0f0f0' },
      { d: 'M170 80 L150 95 L155 100 Z', defaultColor: '#f0f0f0' },
    ]
  },
  {
    id: 'flower',
    name: 'Цветок',
    emoji: '🌸',
    paths: [
      { d: 'M120 120 A20 20 0 1 1 121 120 Z', defaultColor: '#FFD700' },
      { d: 'M120 100 Q110 90 115 75 Q120 90 120 100 Z', defaultColor: '#FF69B4' },
      { d: 'M140 120 Q150 110 155 95 Q145 110 140 120 Z', defaultColor: '#FF1493' },
      { d: 'M120 140 Q110 150 115 165 Q120 150 120 140 Z', defaultColor: '#FF69B4' },
      { d: 'M100 120 Q90 110 85 95 Q95 110 100 120 Z', defaultColor: '#FF1493' },
      { d: 'M120 140 L120 220 L125 220 L125 140 Z', defaultColor: '#228B22' },
    ]
  },
  {
    id: 'house',
    name: 'Домик',
    emoji: '🏠',
    paths: [
      { d: 'M120 60 L70 110 L170 110 Z', defaultColor: '#DC143C' },
      { d: 'M80 110 L80 200 L160 200 L160 110 Z', defaultColor: '#FFE4B5' },
      { d: 'M105 150 L105 200 L135 200 L135 150 Z', defaultColor: '#8B4513' },
      { d: 'M90 130 L110 130 L110 145 L90 145 Z', defaultColor: '#87CEEB' },
      { d: 'M130 130 L150 130 L150 145 L130 145 Z', defaultColor: '#87CEEB' },
    ]
  },
  {
    id: 'car',
    name: 'Машинка',
    emoji: '🚗',
    paths: [
      { d: 'M70 140 L90 110 L150 110 L170 140 L170 170 L70 170 Z', defaultColor: '#FF4500' },
      { d: 'M95 115 L135 115 L145 135 L85 135 Z', defaultColor: '#87CEEB' },
      { d: 'M85 165 A12 12 0 1 1 86 165 Z', defaultColor: '#333' },
      { d: 'M155 165 A12 12 0 1 1 156 165 Z', defaultColor: '#333' },
      { d: 'M65 145 L75 145 L75 165 L65 165 Z', defaultColor: '#FFD700' },
      { d: 'M165 145 L175 145 L175 165 L165 165 Z', defaultColor: '#FFD700' },
    ]
  },
  {
    id: 'sun',
    name: 'Солнышко',
    emoji: '☀️',
    paths: [
      { d: 'M120 120 A30 30 0 1 1 121 120 Z', defaultColor: '#FFD700' },
      { d: 'M120 70 L115 85 L125 85 Z', defaultColor: '#FFA500' },
      { d: 'M155 85 L145 95 L150 102 Z', defaultColor: '#FFA500' },
      { d: 'M170 120 L155 115 L155 125 Z', defaultColor: '#FFA500' },
      { d: 'M155 155 L145 145 L150 138 Z', defaultColor: '#FFA500' },
      { d: 'M120 170 L115 155 L125 155 Z', defaultColor: '#FFA500' },
      { d: 'M85 155 L95 145 L90 138 Z', defaultColor: '#FFA500' },
      { d: 'M70 120 L85 115 L85 125 Z', defaultColor: '#FFA500' },
      { d: 'M85 85 L95 95 L90 102 Z', defaultColor: '#FFA500' },
    ]
  },
  {
    id: 'butterfly',
    name: 'Бабочка',
    emoji: '🦋',
    paths: [
      { d: 'M120 100 L120 180 L125 180 L125 100 Z', defaultColor: '#333' },
      { d: 'M115 105 A5 5 0 1 1 116 105 Z', defaultColor: '#333' },
      { d: 'M75 110 Q60 100 60 120 Q60 140 75 145 Q85 135 85 120 Q85 115 75 110 Z', defaultColor: '#FF69B4' },
      { d: 'M165 110 Q180 100 180 120 Q180 140 165 145 Q155 135 155 120 Q155 115 165 110 Z', defaultColor: '#9370DB' },
      { d: 'M75 150 Q60 145 60 165 Q60 180 75 180 Q85 170 85 160 Q85 155 75 150 Z', defaultColor: '#FF1493' },
      { d: 'M165 150 Q180 145 180 165 Q180 180 165 180 Q155 170 155 160 Q155 155 165 150 Z', defaultColor: '#BA55D3' },
    ]
  }
];

const COLORS = [
  { name: 'Красный', value: '#FF4500' },
  { name: 'Розовый', value: '#FF69B4' },
  { name: 'Оранжевый', value: '#FFA500' },
  { name: 'Жёлтый', value: '#FFD700' },
  { name: 'Зелёный', value: '#32CD32' },
  { name: 'Голубой', value: '#87CEEB' },
  { name: 'Синий', value: '#4169E1' },
  { name: 'Фиолетовый', value: '#9370DB' },
  { name: 'Коричневый', value: '#8B4513' },
  { name: 'Чёрный', value: '#333333' },
  { name: 'Белый', value: '#F0F0F0' },
  { name: 'Серый', value: '#808080' },
];

export default function ColoringGame() {
  const [selectedImage, setSelectedImage] = useState(IMAGES[0]);
  const [selectedColor, setSelectedColor] = useState(COLORS[0].value);
  const [pathColors, setPathColors] = useState<Record<number, string>>(
    Object.fromEntries(selectedImage.paths.map((p, i) => [i, p.defaultColor]))
  );

  const handleImageChange = (image: ColoringImage) => {
    setSelectedImage(image);
    setPathColors(Object.fromEntries(image.paths.map((p, i) => [i, p.defaultColor])));
  };

  const handlePathClick = (index: number) => {
    setPathColors(prev => ({ ...prev, [index]: selectedColor }));
  };

  const resetColors = () => {
    setPathColors(Object.fromEntries(selectedImage.paths.map((p, i) => [i, p.defaultColor])));
  };

  return (
    <div className="flex flex-col items-center gap-6 p-8 min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
      <div className="text-center">
        <h1 className="font-orbitron text-4xl text-purple-600 mb-2">🎨 Раскраска</h1>
        <p className="text-purple-500">Раскрась картинку!</p>
      </div>

      <div className="flex gap-2 flex-wrap justify-center">
        {IMAGES.map(img => (
          <button
            key={img.id}
            onClick={() => handleImageChange(img)}
            className={`px-4 py-2 rounded-xl font-semibold transition ${
              selectedImage.id === img.id
                ? 'bg-purple-500 text-white scale-110'
                : 'bg-white text-purple-600 hover:bg-purple-100'
            }`}
          >
            {img.emoji} {img.name}
          </button>
        ))}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-2xl">
        <svg
          viewBox="0 0 240 240"
          className="w-[400px] h-[400px]"
          style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}
        >
          {selectedImage.paths.map((path, index) => (
            <path
              key={index}
              d={path.d}
              fill={pathColors[index]}
              stroke="#333"
              strokeWidth="2"
              className="cursor-pointer transition-all hover:opacity-80 active:scale-95"
              onClick={() => handlePathClick(index)}
            />
          ))}
        </svg>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-xl">
        <p className="text-center text-purple-600 font-semibold mb-3">Выбери цвет:</p>
        <div className="flex gap-2 flex-wrap max-w-md justify-center">
          {COLORS.map(color => (
            <button
              key={color.value}
              onClick={() => setSelectedColor(color.value)}
              className={`w-12 h-12 rounded-full border-4 transition-all hover:scale-110 active:scale-95 ${
                selectedColor === color.value ? 'border-purple-600 scale-125' : 'border-gray-300'
              }`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          ))}
        </div>
      </div>

      <button
        onClick={resetColors}
        className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold text-lg hover:scale-105 transition shadow-lg"
      >
        🔄 Сбросить
      </button>

      <div className="bg-white/80 px-6 py-3 rounded-xl text-center max-w-md">
        <p className="text-purple-600 font-semibold">
          Нажимай на части картинки, чтобы раскрасить! 🖌️
        </p>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';

interface Shape {
  id: number;
  type: 'circle' | 'square' | 'triangle' | 'star' | 'heart';
  color: string;
  x: number;
  y: number;
  targetSlot: number;
}

const COLORS = [
  { name: 'Красный', value: '#FF4444' },
  { name: 'Синий', value: '#4444FF' },
  { name: 'Зелёный', value: '#44FF44' },
  { name: 'Жёлтый', value: '#FFD700' },
  { name: 'Фиолетовый', value: '#9370DB' },
];

const SHAPE_TYPES: Shape['type'][] = ['circle', 'square', 'triangle', 'star', 'heart'];

export default function ShapeSorterGame() {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [slots, setSlots] = useState<(Shape | null)[]>(Array(5).fill(null));
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [draggedShape, setDraggedShape] = useState<Shape | null>(null);

  useEffect(() => {
    generateShapes();
  }, [level]);

  const generateShapes = () => {
    const newShapes: Shape[] = [];
    const numShapes = Math.min(3 + level, 5);
    
    for (let i = 0; i < numShapes; i++) {
      newShapes.push({
        id: Date.now() + i,
        type: SHAPE_TYPES[i % SHAPE_TYPES.length],
        color: COLORS[i % COLORS.length].value,
        x: 50 + (i * 120),
        y: 350,
        targetSlot: i
      });
    }
    
    const shuffled = [...newShapes].sort(() => Math.random() - 0.5);
    setShapes(shuffled);
    setSlots(Array(5).fill(null));
  };

  const handleDragStart = (shape: Shape) => {
    setDraggedShape(shape);
  };

  const handleDrop = (slotIndex: number) => {
    if (!draggedShape) return;

    const newSlots = [...slots];
    newSlots[slotIndex] = draggedShape;
    setSlots(newSlots);
    setShapes(shapes.filter(s => s.id !== draggedShape.id));
    setDraggedShape(null);

    if (draggedShape.targetSlot === slotIndex) {
      setScore(score + 10);
    }

    if (shapes.length === 1) {
      const allCorrect = newSlots.every((slot, idx) => slot && slot.targetSlot === idx);
      if (allCorrect) {
        setTimeout(() => {
          setLevel(level + 1);
          setScore(score + 50);
        }, 500);
      }
    }
  };

  const resetGame = () => {
    setLevel(1);
    setScore(0);
    generateShapes();
  };

  const renderShape = (type: Shape['type'], color: string, size: number = 80) => {
    switch (type) {
      case 'circle':
        return (
          <div
            className="rounded-full"
            style={{ width: size, height: size, backgroundColor: color }}
          />
        );
      case 'square':
        return (
          <div
            className="rounded-lg"
            style={{ width: size, height: size, backgroundColor: color }}
          />
        );
      case 'triangle':
        return (
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: `${size / 2}px solid transparent`,
              borderRight: `${size / 2}px solid transparent`,
              borderBottom: `${size}px solid ${color}`,
            }}
          />
        );
      case 'star':
        return (
          <div className="text-6xl" style={{ color }}>
            ⭐
          </div>
        );
      case 'heart':
        return (
          <div className="text-6xl" style={{ color }}>
            ❤️
          </div>
        );
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-orbitron text-5xl text-purple-600 mb-2">🔷 Собери Фигуры</h1>
          <p className="text-purple-500 text-lg">Перетащи фигуры в правильные места!</p>
        </div>

        <div className="flex justify-between items-center mb-8 bg-white/80 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-lg">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">🏆 {score}</div>
            <div className="text-sm text-purple-400">Очки</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">📊 {level}</div>
            <div className="text-sm text-blue-400">Уровень</div>
          </div>
          <button
            onClick={resetGame}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:scale-105 transition"
          >
            🔄 Новая игра
          </button>
        </div>

        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-2xl mb-8">
          <p className="text-center text-purple-600 font-bold text-lg mb-6">
            Слоты для фигур:
          </p>
          <div className="flex justify-center gap-6">
            {slots.map((slot, index) => (
              <div
                key={index}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(index)}
                className="w-32 h-32 border-4 border-dashed border-purple-400 rounded-2xl flex items-center justify-center bg-purple-50 hover:bg-purple-100 transition"
              >
                {slot ? (
                  <div className="cursor-move">
                    {renderShape(slot.type, slot.color)}
                  </div>
                ) : (
                  <div className="text-4xl text-purple-300">?</div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-200 to-orange-200 p-8 rounded-3xl shadow-2xl">
          <p className="text-center text-orange-700 font-bold text-lg mb-6">
            Перетащи фигуры:
          </p>
          <div className="flex justify-center gap-6 flex-wrap">
            {shapes.map((shape) => (
              <div
                key={shape.id}
                draggable
                onDragStart={() => handleDragStart(shape)}
                onClick={() => {
                  if (slots.some(s => s === null)) {
                    const emptySlot = slots.findIndex(s => s === null);
                    handleDrop(emptySlot);
                  }
                }}
                className="cursor-move hover:scale-110 active:scale-95 transition-all p-4 bg-white rounded-2xl shadow-lg"
              >
                {renderShape(shape.type, shape.color)}
              </div>
            ))}
          </div>
        </div>

        {shapes.length === 0 && (
          <div className="mt-8 text-center">
            <div className="bg-green-500/90 backdrop-blur-sm px-12 py-6 rounded-2xl shadow-2xl inline-block">
              <p className="text-3xl font-bold text-white mb-2">🎉 Уровень пройден!</p>
              <p className="text-white text-lg">Молодец! Переходим на уровень {level}!</p>
            </div>
          </div>
        )}

        <div className="mt-8 bg-white/70 backdrop-blur-sm px-6 py-4 rounded-xl text-center">
          <p className="text-purple-600 font-semibold">
            💡 Совет: Перетаскивай фигуры мышкой или нажимай на них! 
            <br />
            Правильное размещение даёт больше очков! 🌟
          </p>
        </div>
      </div>
    </div>
  );
}

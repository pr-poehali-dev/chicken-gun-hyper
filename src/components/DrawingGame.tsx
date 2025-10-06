import React, { useRef, useState, useEffect } from 'react';

interface Template {
  id: string;
  name: string;
  emoji: string;
  draw: (ctx: CanvasRenderingContext2D, width: number, height: number) => void;
}

const templates: Template[] = [
  {
    id: 'cat',
    name: 'Котик',
    emoji: '🐱',
    draw: (ctx, w, h) => {
      const cx = w / 2, cy = h / 2;
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      
      ctx.beginPath();
      ctx.arc(cx, cy, 80, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(cx - 60, cy - 60);
      ctx.lineTo(cx - 80, cy - 120);
      ctx.lineTo(cx - 40, cy - 80);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(cx + 60, cy - 60);
      ctx.lineTo(cx + 80, cy - 120);
      ctx.lineTo(cx + 40, cy - 80);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(cx - 30, cy - 20, 15, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx + 30, cy - 20, 15, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(cx, cy + 10, 10, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(cx, cy + 10);
      ctx.lineTo(cx, cy + 30);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(cx - 15, cy + 30, 10, 0, Math.PI);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx + 15, cy + 30, 10, 0, Math.PI);
      ctx.stroke();
    }
  },
  {
    id: 'house',
    name: 'Домик',
    emoji: '🏠',
    draw: (ctx, w, h) => {
      const cx = w / 2, cy = h / 2;
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      
      ctx.strokeRect(cx - 80, cy - 20, 160, 120);
      
      ctx.beginPath();
      ctx.moveTo(cx - 100, cy - 20);
      ctx.lineTo(cx, cy - 100);
      ctx.lineTo(cx + 100, cy - 20);
      ctx.closePath();
      ctx.stroke();
      
      ctx.strokeRect(cx - 25, cy + 40, 50, 60);
      
      ctx.strokeRect(cx - 60, cy, 30, 30);
      ctx.strokeRect(cx + 30, cy, 30, 30);
    }
  },
  {
    id: 'flower',
    name: 'Цветок',
    emoji: '🌸',
    draw: (ctx, w, h) => {
      const cx = w / 2, cy = h / 2;
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI * 2 * i) / 6;
        const x = cx + Math.cos(angle) * 50;
        const y = cy + Math.sin(angle) * 50;
        ctx.beginPath();
        ctx.arc(x, y, 30, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      ctx.beginPath();
      ctx.arc(cx, cy, 25, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(cx, cy + 25);
      ctx.lineTo(cx, cy + 120);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(cx, cy + 60);
      ctx.bezierCurveTo(cx + 30, cy + 50, cx + 40, cy + 70, cx + 30, cy + 80);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(cx, cy + 80);
      ctx.bezierCurveTo(cx - 30, cy + 70, cx - 40, cy + 90, cx - 30, cy + 100);
      ctx.stroke();
    }
  },
  {
    id: 'sun',
    name: 'Солнышко',
    emoji: '☀️',
    draw: (ctx, w, h) => {
      const cx = w / 2, cy = h / 2;
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      
      ctx.beginPath();
      ctx.arc(cx, cy, 60, 0, Math.PI * 2);
      ctx.stroke();
      
      for (let i = 0; i < 12; i++) {
        const angle = (Math.PI * 2 * i) / 12;
        const x1 = cx + Math.cos(angle) * 70;
        const y1 = cy + Math.sin(angle) * 70;
        const x2 = cx + Math.cos(angle) * 100;
        const y2 = cy + Math.sin(angle) * 100;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      
      ctx.beginPath();
      ctx.arc(cx - 20, cy - 10, 8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx + 20, cy - 10, 8, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(cx, cy + 20, 20, 0, Math.PI);
      ctx.stroke();
    }
  },
  {
    id: 'tree',
    name: 'Дерево',
    emoji: '🌳',
    draw: (ctx, w, h) => {
      const cx = w / 2, cy = h / 2;
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      
      ctx.strokeRect(cx - 15, cy + 20, 30, 80);
      
      ctx.beginPath();
      ctx.arc(cx, cy - 40, 60, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(cx - 40, cy - 10, 50, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(cx + 40, cy - 10, 50, 0, Math.PI * 2);
      ctx.stroke();
    }
  },
  {
    id: 'butterfly',
    name: 'Бабочка',
    emoji: '🦋',
    draw: (ctx, w, h) => {
      const cx = w / 2, cy = h / 2;
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      
      ctx.beginPath();
      ctx.ellipse(cx - 50, cy - 40, 40, 60, 0, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.ellipse(cx + 50, cy - 40, 40, 60, 0, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.ellipse(cx - 50, cy + 40, 35, 50, 0, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.ellipse(cx + 50, cy + 40, 35, 50, 0, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(cx, cy - 80);
      ctx.lineTo(cx, cy + 80);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(cx, cy - 85, 8, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(cx, cy - 80);
      ctx.lineTo(cx - 15, cy - 95);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx, cy - 80);
      ctx.lineTo(cx + 15, cy - 95);
      ctx.stroke();
    }
  },
  {
    id: 'car',
    name: 'Машинка',
    emoji: '🚗',
    draw: (ctx, w, h) => {
      const cx = w / 2, cy = h / 2;
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      
      ctx.strokeRect(cx - 80, cy, 160, 60);
      
      ctx.strokeRect(cx - 50, cy - 40, 100, 40);
      
      ctx.beginPath();
      ctx.arc(cx - 50, cy + 60, 20, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(cx + 50, cy + 60, 20, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.strokeRect(cx - 40, cy - 30, 35, 25);
      ctx.strokeRect(cx + 5, cy - 30, 35, 25);
    }
  },
  {
    id: 'heart',
    name: 'Сердечко',
    emoji: '💖',
    draw: (ctx, w, h) => {
      const cx = w / 2, cy = h / 2;
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      
      ctx.beginPath();
      ctx.moveTo(cx, cy - 40);
      ctx.bezierCurveTo(cx - 80, cy - 100, cx - 100, cy - 20, cx, cy + 60);
      ctx.bezierCurveTo(cx + 100, cy - 20, cx + 80, cy - 100, cx, cy - 40);
      ctx.closePath();
      ctx.stroke();
    }
  }
];

export default function DrawingGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#FF0000');
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState<'brush' | 'eraser'>('brush');
  const [isAutoColoring, setIsAutoColoring] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  const colors = [
    { name: 'Красный', value: '#FF0000' },
    { name: 'Синий', value: '#0000FF' },
    { name: 'Зелёный', value: '#00FF00' },
    { name: 'Жёлтый', value: '#FFFF00' },
    { name: 'Оранжевый', value: '#FFA500' },
    { name: 'Фиолетовый', value: '#9370DB' },
    { name: 'Розовый', value: '#FF69B4' },
    { name: 'Чёрный', value: '#000000' },
    { name: 'Белый', value: '#FFFFFF' },
    { name: 'Коричневый', value: '#8B4513' },
    { name: 'Голубой', value: '#87CEEB' },
    { name: 'Салатовый', value: '#90EE90' },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x, y;

    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x, y;

    if ('touches' in e) {
      e.preventDefault();
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    if (tool === 'eraser') {
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = brushSize * 3;
    } else {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.closePath();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const downloadDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `рисунок_${Date.now()}.png`;
    link.href = url;
    link.click();
  };

  const loadTemplate = (template: Template) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    template.draw(ctx, canvas.width, canvas.height);
    setShowTemplates(false);
  };

  const autoColorDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsAutoColoring(true);
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsAutoColoring(false);
      return;
    }

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const colorPalette = [
      [255, 105, 180],
      [135, 206, 250],
      [144, 238, 144],
      [255, 215, 0],
      [255, 160, 122],
      [221, 160, 221],
      [173, 216, 230],
      [255, 182, 193],
    ];

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      if (r === 255 && g === 255 && b === 255) {
        const randomChance = Math.random();
        if (randomChance > 0.7) {
          const randomColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
          data[i] = randomColor[0];
          data[i + 1] = randomColor[1];
          data[i + 2] = randomColor[2];
        }
      } else if (r < 50 && g < 50 && b < 50) {
      } else {
        const brightness = (r + g + b) / 3;
        if (brightness < 200) {
          const randomColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
          const blendFactor = 0.6;
          data[i] = Math.floor(r * (1 - blendFactor) + randomColor[0] * blendFactor);
          data[i + 1] = Math.floor(g * (1 - blendFactor) + randomColor[1] * blendFactor);
          data[i + 2] = Math.floor(b * (1 - blendFactor) + randomColor[2] * blendFactor);
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
    setTimeout(() => setIsAutoColoring(false), 500);
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="font-orbitron text-5xl text-purple-600 mb-2">🎨 Рисовалка</h1>
          <p className="text-purple-500 text-lg">Рисуй или выбери готовую раскраску!</p>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 mb-6">
          <div className="flex flex-wrap gap-4 justify-center items-center mb-6">
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-bold transition hover:scale-105"
            >
              📋 {showTemplates ? 'Скрыть раскраски' : 'Готовые раскраски'}
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => setTool('brush')}
                className={`px-6 py-3 rounded-xl font-bold transition ${
                  tool === 'brush'
                    ? 'bg-purple-500 text-white scale-105'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                🖌️ Кисть
              </button>
              <button
                onClick={() => setTool('eraser')}
                className={`px-6 py-3 rounded-xl font-bold transition ${
                  tool === 'eraser'
                    ? 'bg-purple-500 text-white scale-105'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                🧹 Ластик
              </button>
            </div>

            <div className="flex items-center gap-3 bg-gray-100 px-6 py-3 rounded-xl">
              <span className="text-gray-700 font-semibold">Размер:</span>
              <input
                type="range"
                min="1"
                max="30"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-32"
              />
              <span className="text-purple-600 font-bold text-lg">{brushSize}px</span>
            </div>

            <button
              onClick={clearCanvas}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition hover:scale-105"
            >
              🗑️ Очистить
            </button>

            <button
              onClick={autoColorDrawing}
              disabled={isAutoColoring}
              className={`px-6 py-3 rounded-xl font-bold transition hover:scale-105 ${
                isAutoColoring
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white'
              }`}
            >
              {isAutoColoring ? '✨ Раскрашиваю...' : '✨ ИИ Раскраска'}
            </button>

            <button
              onClick={downloadDrawing}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition hover:scale-105"
            >
              💾 Скачать
            </button>
          </div>

          {showTemplates && (
            <div className="mb-6 p-6 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl">
              <h3 className="text-2xl font-bold text-blue-600 text-center mb-4">Выбери раскраску:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => loadTemplate(template)}
                    className="bg-white hover:bg-blue-50 p-4 rounded-xl shadow-lg transition hover:scale-110 border-2 border-blue-300 hover:border-blue-500"
                  >
                    <div className="text-4xl mb-2">{template.emoji}</div>
                    <p className="text-sm font-bold text-blue-600">{template.name}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6">
            <p className="text-gray-700 font-semibold text-center mb-3">Выбери цвет:</p>
            <div className="grid grid-cols-6 md:grid-cols-12 gap-3 max-w-4xl mx-auto">
              {colors.map((c) => (
                <button
                  key={c.value}
                  onClick={() => {
                    setColor(c.value);
                    setTool('brush');
                  }}
                  className={`w-12 h-12 rounded-full border-4 transition hover:scale-110 ${
                    color === c.value && tool === 'brush'
                      ? 'border-purple-600 scale-110 shadow-lg'
                      : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-4 flex justify-center">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="border-4 border-purple-300 rounded-2xl cursor-crosshair touch-none"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>

        <div className="mt-6 bg-white/70 backdrop-blur-sm px-6 py-4 rounded-xl text-center">
          <p className="text-purple-600 font-semibold text-lg">
            💡 Выбери готовую раскраску или рисуй сама!
            <br />
            Используй "ИИ Раскраска" для автоматического раскрашивания! 🎨✨
          </p>
        </div>
      </div>
    </div>
  );
}

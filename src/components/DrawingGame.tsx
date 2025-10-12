import React, { useRef, useState, useEffect, useCallback } from 'react';

interface Template {
  id: string;
  name: string;
  emoji: string;
  draw: (ctx: CanvasRenderingContext2D, width: number, height: number) => void;
}

interface Sticker {
  id: string;
  emoji: string;
  name: string;
  size: number;
}

interface Stamp {
  id: string;
  emoji: string;
  name: string;
  size: number;
}

const catStickers: Sticker[] = [
  { id: 'cat1', emoji: '😺', name: 'Котик', size: 60 },
  { id: 'cat2', emoji: '😸', name: 'Улыбка', size: 60 },
  { id: 'cat3', emoji: '😹', name: 'Смех', size: 60 },
  { id: 'cat4', emoji: '😻', name: 'Влюблён', size: 60 },
  { id: 'cat5', emoji: '😼', name: 'Хитрец', size: 60 },
  { id: 'cat6', emoji: '😽', name: 'Поцелуй', size: 60 },
  { id: 'cat7', emoji: '🙀', name: 'Удивлён', size: 60 },
  { id: 'cat8', emoji: '😿', name: 'Грустный', size: 60 },
  { id: 'cat9', emoji: '😾', name: 'Злой', size: 60 },
  { id: 'cat10', emoji: '🐱', name: 'Мордочка', size: 60 },
  { id: 'cat11', emoji: '🐈', name: 'Кошка', size: 60 },
  { id: 'cat12', emoji: '🐈‍⬛', name: 'Чёрный', size: 60 },
];

const funStickers: Sticker[] = [
  { id: 'heart1', emoji: '💖', name: 'Сердце', size: 50 },
  { id: 'heart2', emoji: '💕', name: 'Два сердца', size: 50 },
  { id: 'heart3', emoji: '💗', name: 'Растущее', size: 50 },
  { id: 'heart4', emoji: '💝', name: 'С лентой', size: 50 },
  { id: 'star1', emoji: '⭐', name: 'Звезда', size: 50 },
  { id: 'star2', emoji: '🌟', name: 'Сияние', size: 50 },
  { id: 'star3', emoji: '✨', name: 'Искры', size: 50 },
  { id: 'star4', emoji: '💫', name: 'Звёздочки', size: 50 },
  { id: 'flower1', emoji: '🌸', name: 'Цветок', size: 50 },
  { id: 'flower2', emoji: '🌺', name: 'Гибискус', size: 50 },
  { id: 'flower3', emoji: '🌼', name: 'Ромашка', size: 50 },
  { id: 'flower4', emoji: '🌷', name: 'Тюльпан', size: 50 },
  { id: 'rainbow', emoji: '🌈', name: 'Радуга', size: 50 },
  { id: 'butterfly', emoji: '🦋', name: 'Бабочка', size: 50 },
  { id: 'sparkle', emoji: '🎀', name: 'Бантик', size: 50 },
  { id: 'crown', emoji: '👑', name: 'Корона', size: 50 },
];

const stamps: Stamp[] = [
  { id: 'stamp1', emoji: '🐾', name: 'Лапки', size: 40 },
  { id: 'stamp2', emoji: '👣', name: 'Следы', size: 40 },
  { id: 'stamp3', emoji: '🍎', name: 'Яблоко', size: 45 },
  { id: 'stamp4', emoji: '🍌', name: 'Банан', size: 45 },
  { id: 'stamp5', emoji: '🍓', name: 'Клубника', size: 45 },
  { id: 'stamp6', emoji: '🍉', name: 'Арбуз', size: 45 },
  { id: 'stamp7', emoji: '🚗', name: 'Машинка', size: 45 },
  { id: 'stamp8', emoji: '✈️', name: 'Самолёт', size: 45 },
  { id: 'stamp9', emoji: '🚂', name: 'Поезд', size: 45 },
  { id: 'stamp10', emoji: '🎁', name: 'Подарок', size: 45 },
  { id: 'stamp11', emoji: '🎂', name: 'Торт', size: 45 },
  { id: 'stamp12', emoji: '🍭', name: 'Конфета', size: 45 },
];

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
  }
];

export default function DrawingGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#FF0000');
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState<'brush' | 'eraser' | 'sticker' | 'stamp' | 'fill' | 'spray'>('brush');
  const [isAutoColoring, setIsAutoColoring] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showStickers, setShowStickers] = useState(false);
  const [showStamps, setShowStamps] = useState(false);
  const [selectedSticker, setSelectedSticker] = useState<Sticker | null>(null);
  const [selectedStamp, setSelectedStamp] = useState<Stamp | null>(null);
  const [stickerSize, setStickerSize] = useState(60);
  const [magicMode, setMagicMode] = useState(false);
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number; emoji: string }>>([]);
  const [rainbowTrail, setRainbowTrail] = useState(false);
  const [neonMode, setNeonMode] = useState(false);
  const [symmetryMode, setSymmetryMode] = useState(false);
  const rainbowColorsRef = useRef(['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3']);
  const colorIndexRef = useRef(0);

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

  const playDrawSound = useCallback(() => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800 + Math.random() * 400;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  }, []);

  const playClickSound = useCallback(() => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 1000;
    oscillator.type = 'square';
    
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.05);
  }, []);

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

  const createSparkle = useCallback((x: number, y: number) => {
    const sparkleEmojis = ['✨', '⭐', '💫', '🌟', '💖', '💕'];
    const newSparkle = {
      id: Date.now() + Math.random(),
      x,
      y,
      emoji: sparkleEmojis[Math.floor(Math.random() * sparkleEmojis.length)]
    };
    setSparkles(prev => [...prev, newSparkle]);
    setTimeout(() => {
      setSparkles(prev => prev.filter(s => s.id !== newSparkle.id));
    }, 1000);
  }, []);

  const floodFill = (startX: number, startY: number, fillColor: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    const startPos = (startY * canvas.width + startX) * 4;
    const startR = data[startPos];
    const startG = data[startPos + 1];
    const startB = data[startPos + 2];
    
    const fillRgb = {
      r: parseInt(fillColor.slice(1, 3), 16),
      g: parseInt(fillColor.slice(3, 5), 16),
      b: parseInt(fillColor.slice(5, 7), 16)
    };
    
    if (startR === fillRgb.r && startG === fillRgb.g && startB === fillRgb.b) return;
    
    const stack: Array<[number, number]> = [[startX, startY]];
    
    while (stack.length > 0) {
      const [x, y] = stack.pop()!;
      if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) continue;
      
      const pos = (y * canvas.width + x) * 4;
      
      if (data[pos] === startR && data[pos + 1] === startG && data[pos + 2] === startB) {
        data[pos] = fillRgb.r;
        data[pos + 1] = fillRgb.g;
        data[pos + 2] = fillRgb.b;
        data[pos + 3] = 255;
        
        stack.push([x + 1, y]);
        stack.push([x - 1, y]);
        stack.push([x, y + 1]);
        stack.push([x, y - 1]);
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
  };

  const placeSticker = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const sticker = tool === 'sticker' ? selectedSticker : selectedStamp;
    if (!sticker) return;
    
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

    const scale = canvas.width / rect.width;
    x *= scale;
    y *= scale;

    ctx.font = `${stickerSize}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(sticker.emoji, x, y);
    
    playClickSound();
    createSparkle(e.clientX || (e as TouchEvent).touches[0].clientX, e.clientY || (e as TouchEvent).touches[0].clientY);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (tool === 'sticker' || tool === 'stamp') {
      placeSticker(e);
      return;
    }
    
    if (tool === 'fill') {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      let x, y;
      
      if ('touches' in e) {
        x = Math.floor((e.touches[0].clientX - rect.left) * (canvas.width / rect.width));
        y = Math.floor((e.touches[0].clientY - rect.top) * (canvas.height / rect.height));
      } else {
        x = Math.floor((e.clientX - rect.left) * (canvas.width / rect.width));
        y = Math.floor((e.clientY - rect.top) * (canvas.height / rect.height));
      }
      
      floodFill(x, y, color);
      playClickSound();
      return;
    }
    
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

    const scale = canvas.width / rect.width;
    x *= scale;
    y *= scale;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || tool === 'sticker' || tool === 'stamp' || tool === 'fill') return;

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

    const scale = canvas.width / rect.width;
    x *= scale;
    y *= scale;

    if (tool === 'spray') {
      for (let i = 0; i < 20; i++) {
        const offsetX = (Math.random() - 0.5) * brushSize * 4;
        const offsetY = (Math.random() - 0.5) * brushSize * 4;
        ctx.fillStyle = rainbowTrail 
          ? rainbowColorsRef.current[Math.floor(Math.random() * rainbowColorsRef.current.length)]
          : color;
        ctx.fillRect(x + offsetX, y + offsetY, 2, 2);
      }
      
      if (Math.random() > 0.8) {
        playDrawSound();
      }
    } else {
      if (tool === 'eraser') {
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = brushSize * 3;
      } else {
        if (rainbowTrail) {
          ctx.strokeStyle = rainbowColorsRef.current[colorIndexRef.current];
          colorIndexRef.current = (colorIndexRef.current + 1) % rainbowColorsRef.current.length;
        } else {
          ctx.strokeStyle = color;
        }
        
        if (neonMode) {
          ctx.shadowBlur = 20;
          ctx.shadowColor = color;
        } else {
          ctx.shadowBlur = 0;
        }
        
        ctx.lineWidth = brushSize;
        
        if (Math.random() > 0.95) {
          playDrawSound();
        }
      }

      ctx.lineTo(x, y);
      ctx.stroke();
      
      if (symmetryMode) {
        const centerX = canvas.width / 2;
        const mirrorX = centerX + (centerX - x);
        ctx.lineTo(mirrorX, y);
        ctx.stroke();
      }
      
      if (magicMode && Math.random() > 0.7) {
        createSparkle(e.clientX || (e as TouchEvent).touches[0].clientX, e.clientY || (e as TouchEvent).touches[0].clientY);
      }
    }
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
    playClickSound();
  };

  const downloadDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `рисунок_${Date.now()}.png`;
    link.href = url;
    link.click();
    playClickSound();
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
    playClickSound();
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
    playClickSound();
    setTimeout(() => setIsAutoColoring(false), 500);
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 p-6 overflow-hidden">
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute text-3xl pointer-events-none animate-bounce z-50"
          style={{
            left: `${sparkle.x}px`,
            top: `${sparkle.y}px`,
            animation: 'fadeOut 1s ease-out forwards'
          }}
        >
          {sparkle.emoji}
        </div>
      ))}
      
      <style>{`
        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          to {
            opacity: 0;
            transform: scale(1.5) translateY(-30px);
          }
        }
      `}</style>
      
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="font-orbitron text-5xl text-purple-600 mb-2">🎨 Рисовалка СУПЕР</h1>
          <p className="text-purple-500 text-lg">10+ инструментов! Рисуй, украшай, твори! ✨🖌️</p>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 mb-6">
          <div className="flex flex-wrap gap-3 justify-center items-center mb-6">
            <button
              onClick={() => {
                setShowStickers(!showStickers);
                setShowTemplates(false);
                setShowStamps(false);
              }}
              className={`px-5 py-2.5 rounded-xl font-bold text-lg transition hover:scale-105 ${
                showStickers
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                  : 'bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white'
              }`}
            >
              😺 {showStickers ? 'Скрыть' : 'КОТИКИ'}
            </button>

            <button
              onClick={() => {
                setShowStamps(!showStamps);
                setShowTemplates(false);
                setShowStickers(false);
              }}
              className={`px-5 py-2.5 rounded-xl font-bold text-lg transition hover:scale-105 ${
                showStamps
                  ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white'
                  : 'bg-gradient-to-r from-green-400 to-teal-400 hover:from-green-500 hover:to-teal-500 text-white'
              }`}
            >
              🎨 {showStamps ? 'Скрыть' : 'ШТАМПЫ'}
            </button>

            <button
              onClick={() => {
                setShowTemplates(!showTemplates);
                setShowStickers(false);
                setShowStamps(false);
              }}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-bold transition hover:scale-105"
            >
              📋 {showTemplates ? 'Скрыть' : 'Раскраски'}
            </button>

            <div className="flex gap-2 flex-wrap justify-center">
              <button
                onClick={() => {
                  setTool('brush');
                  setSelectedSticker(null);
                  setSelectedStamp(null);
                }}
                className={`px-4 py-2 rounded-xl font-bold transition text-sm ${
                  tool === 'brush'
                    ? 'bg-purple-500 text-white scale-105'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                🖌️ Кисть
              </button>
              
              <button
                onClick={() => {
                  setTool('spray');
                  setSelectedSticker(null);
                  setSelectedStamp(null);
                }}
                className={`px-4 py-2 rounded-xl font-bold transition text-sm ${
                  tool === 'spray'
                    ? 'bg-blue-500 text-white scale-105'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                💨 Спрей
              </button>
              
              <button
                onClick={() => {
                  setTool('fill');
                  setSelectedSticker(null);
                  setSelectedStamp(null);
                }}
                className={`px-4 py-2 rounded-xl font-bold transition text-sm ${
                  tool === 'fill'
                    ? 'bg-orange-500 text-white scale-105'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                🪣 Заливка
              </button>
              
              <button
                onClick={() => {
                  setTool('eraser');
                  setSelectedSticker(null);
                  setSelectedStamp(null);
                }}
                className={`px-4 py-2 rounded-xl font-bold transition text-sm ${
                  tool === 'eraser'
                    ? 'bg-red-500 text-white scale-105'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                🧹 Ластик
              </button>
            </div>

            {(tool === 'brush' || tool === 'spray' || tool === 'eraser') && (
              <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl">
                <span className="text-gray-700 font-semibold text-sm">Размер:</span>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={brushSize}
                  onChange={(e) => setBrushSize(Number(e.target.value))}
                  className="w-24"
                />
                <span className="text-purple-600 font-bold">{brushSize}</span>
              </div>
            )}

            {(tool === 'sticker' || tool === 'stamp') && (selectedSticker || selectedStamp) && (
              <div className="flex items-center gap-2 bg-pink-100 px-4 py-2 rounded-xl">
                <span className="text-pink-700 font-semibold text-sm">Размер:</span>
                <input
                  type="range"
                  min="30"
                  max="120"
                  value={stickerSize}
                  onChange={(e) => setStickerSize(Number(e.target.value))}
                  className="w-24"
                />
                <span className="text-pink-600 font-bold text-2xl">{(selectedSticker || selectedStamp)?.emoji}</span>
              </div>
            )}

            <button
              onClick={() => {
                setMagicMode(!magicMode);
                playClickSound();
                if (!magicMode) {
                  for (let i = 0; i < 10; i++) {
                    setTimeout(() => {
                      createSparkle(Math.random() * window.innerWidth, Math.random() * 300);
                    }, i * 100);
                  }
                }
              }}
              className={`px-5 py-2.5 rounded-xl font-bold transition hover:scale-105 text-sm ${
                magicMode
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white animate-pulse'
                  : 'bg-gradient-to-r from-yellow-300 to-orange-400 hover:from-yellow-400 hover:to-orange-500 text-white'
              }`}
            >
              {magicMode ? '✨ ВОЛШЕБСТВО' : '🪄 Волшебство'}
            </button>

            <button
              onClick={() => {
                setRainbowTrail(!rainbowTrail);
                playClickSound();
              }}
              className={`px-5 py-2.5 rounded-xl font-bold transition hover:scale-105 text-sm ${
                rainbowTrail
                  ? 'bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-400 text-white animate-pulse'
                  : 'bg-gradient-to-r from-red-300 via-yellow-300 via-green-300 via-blue-300 to-purple-300 hover:opacity-90 text-white'
              }`}
            >
              {rainbowTrail ? '🌈 РАДУГА' : '🌈 Радуга'}
            </button>

            <button
              onClick={() => {
                setNeonMode(!neonMode);
                playClickSound();
              }}
              className={`px-5 py-2.5 rounded-xl font-bold transition hover:scale-105 text-sm ${
                neonMode
                  ? 'bg-gradient-to-r from-pink-500 to-cyan-500 text-white animate-pulse'
                  : 'bg-gradient-to-r from-pink-400 to-cyan-400 hover:from-pink-500 hover:to-cyan-500 text-white'
              }`}
            >
              {neonMode ? '💡 НЕОН' : '💡 Неон'}
            </button>

            <button
              onClick={() => {
                setSymmetryMode(!symmetryMode);
                playClickSound();
              }}
              className={`px-5 py-2.5 rounded-xl font-bold transition hover:scale-105 text-sm ${
                symmetryMode
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white animate-pulse'
                  : 'bg-gradient-to-r from-indigo-400 to-purple-400 hover:from-indigo-500 hover:to-purple-500 text-white'
              }`}
            >
              {symmetryMode ? '🪞 ЗЕРКАЛО' : '🪞 Зеркало'}
            </button>

            <button
              onClick={clearCanvas}
              className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition hover:scale-105 text-sm"
            >
              🗑️ Очистить
            </button>

            <button
              onClick={autoColorDrawing}
              disabled={isAutoColoring}
              className={`px-5 py-2.5 rounded-xl font-bold transition hover:scale-105 text-sm ${
                isAutoColoring
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white'
              }`}
            >
              {isAutoColoring ? '✨ Работаю...' : '✨ ИИ'}
            </button>

            <button
              onClick={downloadDrawing}
              className="px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition hover:scale-105 text-sm"
            >
              💾 Сохранить
            </button>
          </div>

          {showStickers && (
            <div className="mb-6 p-6 bg-gradient-to-r from-pink-100 via-purple-100 to-pink-100 rounded-2xl">
              <h3 className="text-2xl font-bold text-pink-600 text-center mb-4">😺 28 СТИКЕРОВ!</h3>
              
              <div className="mb-6">
                <h4 className="text-xl font-bold text-purple-600 mb-3 text-center">🐱 12 Котиков:</h4>
                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3">
                  {catStickers.map((sticker) => (
                    <button
                      key={sticker.id}
                      onClick={() => {
                        setSelectedSticker(sticker);
                        setSelectedStamp(null);
                        setTool('sticker');
                        playClickSound();
                      }}
                      className={`p-3 rounded-xl shadow-lg transition hover:scale-110 ${
                        selectedSticker?.id === sticker.id && tool === 'sticker'
                          ? 'bg-pink-400 ring-4 ring-pink-500 scale-110'
                          : 'bg-white hover:bg-pink-50 border-2 border-pink-300 hover:border-pink-500'
                      }`}
                    >
                      <div className="text-4xl">{sticker.emoji}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xl font-bold text-purple-600 mb-3 text-center">💖 16 Украшений:</h4>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                  {funStickers.map((sticker) => (
                    <button
                      key={sticker.id}
                      onClick={() => {
                        setSelectedSticker(sticker);
                        setSelectedStamp(null);
                        setTool('sticker');
                        playClickSound();
                      }}
                      className={`p-3 rounded-xl shadow-lg transition hover:scale-110 ${
                        selectedSticker?.id === sticker.id && tool === 'sticker'
                          ? 'bg-purple-400 ring-4 ring-purple-500 scale-110'
                          : 'bg-white hover:bg-purple-50 border-2 border-purple-300 hover:border-purple-500'
                      }`}
                    >
                      <div className="text-3xl">{sticker.emoji}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {showStamps && (
            <div className="mb-6 p-6 bg-gradient-to-r from-green-100 via-teal-100 to-green-100 rounded-2xl">
              <h3 className="text-2xl font-bold text-green-600 text-center mb-4">🎨 12 ШТАМПОВ!</h3>
              <p className="text-center text-green-600 mb-4">Лапки, фрукты, машинки, сладости!</p>
              
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3">
                {stamps.map((stamp) => (
                  <button
                    key={stamp.id}
                    onClick={() => {
                      setSelectedStamp(stamp);
                      setSelectedSticker(null);
                      setTool('stamp');
                      playClickSound();
                    }}
                    className={`p-3 rounded-xl shadow-lg transition hover:scale-110 ${
                      selectedStamp?.id === stamp.id && tool === 'stamp'
                        ? 'bg-teal-400 ring-4 ring-teal-500 scale-110'
                        : 'bg-white hover:bg-teal-50 border-2 border-teal-300 hover:border-teal-500'
                    }`}
                  >
                    <div className="text-3xl">{stamp.emoji}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {showTemplates && (
            <div className="mb-6 p-6 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl">
              <h3 className="text-2xl font-bold text-blue-600 text-center mb-4">📋 4 Раскраски:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

          {(tool !== 'sticker' && tool !== 'stamp' && tool !== 'fill') && (
            <div className="mt-6">
              <p className="text-gray-700 font-semibold text-center mb-3">Выбери цвет:</p>
              <div className="grid grid-cols-6 md:grid-cols-12 gap-3 max-w-4xl mx-auto">
                {colors.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => {
                      setColor(c.value);
                      if (tool === 'eraser') setTool('brush');
                      playClickSound();
                    }}
                    className={`w-12 h-12 rounded-full border-4 transition hover:scale-110 ${
                      color === c.value && (tool === 'brush' || tool === 'spray' || tool === 'fill')
                        ? 'border-purple-600 scale-110 shadow-lg ring-4 ring-purple-300'
                        : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: c.value }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
          )}
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
            className={`border-4 border-purple-300 rounded-2xl touch-none ${
              tool === 'sticker' || tool === 'stamp' ? 'cursor-pointer' : tool === 'fill' ? 'cursor-cell' : 'cursor-crosshair'
            }`}
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>

        <div className="mt-6 bg-white/70 backdrop-blur-sm px-6 py-4 rounded-xl text-center">
          <p className="text-purple-600 font-semibold text-lg">
            🎨 10+ ИНСТРУМЕНТОВ: Кисть, Спрей, Заливка, Волшебство, Радуга, Неон, Зеркало!
            <br />
            😺 28 Стикеров + 🎨 12 Штампов + 📋 4 Раскраски! ✨💖
          </p>
        </div>
      </div>
    </div>
  );
}

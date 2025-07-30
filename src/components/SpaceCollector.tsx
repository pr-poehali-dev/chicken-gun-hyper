import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { soundSystem } from '@/utils/soundSystem';

interface FallingItem {
  id: number;
  x: number;
  y: number;
  type: 'coin' | 'gem' | 'bomb';
  speed: number;
}

interface GameStats {
  score: number;
  lives: number;
  level: number;
  coinsCollected: number;
}

const SpaceCollector: React.FC = () => {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameOver'>('menu');
  const [items, setItems] = useState<FallingItem[]>([]);
  const [playerX, setPlayerX] = useState(50); // percentage
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    lives: 3,
    level: 1,
    coinsCollected: 0
  });
  const [highScore, setHighScore] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const lastSpawnRef = useRef<number>(0);
  const gameTimeRef = useRef<number>(0);
  const previousLevelRef = useRef<number>(1);

  // Load high score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('spaceCollectorHighScore');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  // Save high score and play new record sound
  useEffect(() => {
    if (stats.score > highScore && stats.score > 0) {
      setHighScore(stats.score);
      localStorage.setItem('spaceCollectorHighScore', stats.score.toString());
      if (soundEnabled && gameState === 'gameOver') {
        soundSystem.playNewRecord();
      }
    }
  }, [stats.score, highScore, soundEnabled, gameState]);

  // Play level up sound
  useEffect(() => {
    if (stats.level > previousLevelRef.current && soundEnabled && gameState === 'playing') {
      soundSystem.playLevelUp();
      previousLevelRef.current = stats.level;
    }
  }, [stats.level, soundEnabled, gameState]);

  const spawnItem = useCallback(() => {
    const now = Date.now();
    const spawnRate = Math.max(800 - stats.level * 100, 300);
    
    if (now - lastSpawnRef.current > spawnRate) {
      const rand = Math.random();
      let type: 'coin' | 'gem' | 'bomb';
      
      if (rand < 0.6) type = 'coin';
      else if (rand < 0.85) type = 'gem';
      else type = 'bomb';

      const newItem: FallingItem = {
        id: Date.now(),
        x: Math.random() * 90,
        y: -10,
        type,
        speed: 1 + stats.level * 0.3 + Math.random() * 0.5
      };

      setItems(prev => [...prev, newItem]);
      lastSpawnRef.current = now;
    }
  }, [stats.level]);

  const updateGame = useCallback(() => {
    if (gameState !== 'playing') return;

    gameTimeRef.current += 16;
    
    // Spawn items
    spawnItem();

    // Update items
    setItems(prev => {
      const updated = prev.map(item => ({
        ...item,
        y: item.y + item.speed
      })).filter(item => item.y < 110);

      // Check collisions
      const playerLeft = playerX;
      const playerRight = playerX + 10;
      const playerTop = 85;
      const playerBottom = 95;

      updated.forEach(item => {
        const itemLeft = item.x;
        const itemRight = item.x + 8;
        const itemTop = item.y;
        const itemBottom = item.y + 8;

        // Check collision
        if (
          playerLeft < itemRight &&
          playerRight > itemLeft &&
          playerTop < itemBottom &&
          playerBottom > itemTop
        ) {
          // Collision detected
          setStats(currentStats => {
            let newStats = { ...currentStats };
            
            if (item.type === 'coin') {
              newStats.score += 10;
              newStats.coinsCollected += 1;
              if (soundEnabled) soundSystem.playCoinCollect();
            } else if (item.type === 'gem') {
              newStats.score += 50;
              if (soundEnabled) soundSystem.playGemCollect();
            } else if (item.type === 'bomb') {
              newStats.lives -= 1;
              if (soundEnabled) soundSystem.playBombHit();
            }

            // Level up every 20 coins
            if (newStats.coinsCollected >= 20 && newStats.coinsCollected % 20 === 0) {
              newStats.level += 1;
            }

            return newStats;
          });

          // Remove collected item
          return updated.filter(i => i.id !== item.id);
        }
        return item;
      });

      return updated;
    });

    // Check game over
    if (stats.lives <= 0) {
      setGameState('gameOver');
      if (soundEnabled) {
        setTimeout(() => soundSystem.playGameOver(), 100);
      }
      return;
    }

    animationRef.current = requestAnimationFrame(updateGame);
  }, [gameState, playerX, spawnItem, stats.lives]);

  // Handle touch/mouse movement
  const handleMove = useCallback((clientX: number) => {
    if (!gameAreaRef.current || gameState !== 'playing') return;
    
    const rect = gameAreaRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    setPlayerX(Math.max(0, Math.min(90, x - 5))); // Center player on cursor
  }, [gameState]);

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  const startGame = () => {
    setGameState('playing');
    setItems([]);
    setPlayerX(50);
    setStats({ score: 0, lives: 3, level: 1, coinsCollected: 0 });
    previousLevelRef.current = 1;
    lastSpawnRef.current = 0;
    gameTimeRef.current = 0;
    if (soundEnabled) {
      soundSystem.playGameStart();
    }
    animationRef.current = requestAnimationFrame(updateGame);
  };

  const toggleSound = () => {
    setSoundEnabled(prev => !prev);
  };

  const resetGame = () => {
    setGameState('menu');
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  useEffect(() => {
    if (gameState === 'playing') {
      animationRef.current = requestAnimationFrame(updateGame);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState, updateGame]);

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'coin': return '🪙';
      case 'gem': return '💎';
      case 'bomb': return '💥';
      default: return '⭐';
    }
  };

  return (
    <Card className="bg-card/90 backdrop-blur border-retro-orange/30 p-6 w-full max-w-md mx-auto">
      <div className="text-center mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-orbitron text-xl text-retro-orange flex items-center gap-2">
            <Icon name="Rocket" size={20} />
            Космический Сбор
          </h3>
          <Button
            onClick={toggleSound}
            variant="ghost"
            size="sm"
            className={`p-2 ${soundEnabled ? 'text-retro-orange' : 'text-muted-foreground'}`}
          >
            <Icon name={soundEnabled ? 'Volume2' : 'VolumeX'} size={16} />
          </Button>
        </div>
        
        {gameState === 'playing' && (
          <div className="flex justify-between text-sm mb-4">
            <span className="text-retro-orange">Очки: {stats.score}</span>
            <span className="text-cyber-blue">Уровень: {stats.level}</span>
            <span className="text-red-400">❤️ {stats.lives}</span>
          </div>
        )}
      </div>

      {gameState === 'menu' && (
        <div className="text-center space-y-4">
          <div className="text-sm text-muted-foreground space-y-2">
            <p>🪙 Собирайте монеты (+10 очков)</p>
            <p>💎 Ловите кристаллы (+50 очков)</p>
            <p>💥 Избегайте бомб (-1 жизнь)</p>
            <p className="text-xs">Перемещайте корабль мышью или пальцем</p>
          </div>
          
          {highScore > 0 && (
            <div className="text-center text-sm">
              <span className="text-yellow-400">🏆 Рекорд: {highScore}</span>
            </div>
          )}
          
          <Button 
            onClick={startGame}
            className="bg-gradient-to-r from-retro-orange to-cyber-blue hover:from-retro-orange/80 hover:to-cyber-blue/80 text-black font-orbitron font-bold w-full"
          >
            <Icon name="Play" className="mr-2" size={16} />
            Начать игру
          </Button>
        </div>
      )}

      {gameState === 'playing' && (
        <div 
          ref={gameAreaRef}
          className="relative bg-gradient-to-b from-purple-900/20 to-black/40 rounded-lg overflow-hidden cursor-none"
          style={{ height: '300px' }}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          onMouseLeave={() => {}} // Keep player position on mouse leave
        >
          {/* Stars background */}
          <div className="absolute inset-0 opacity-30">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute text-white animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`
                }}
              >
                ✨
              </div>
            ))}
          </div>

          {/* Falling items */}
          {items.map(item => (
            <div
              key={item.id}
              className="absolute text-2xl transition-none pointer-events-none"
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              {getItemIcon(item.type)}
            </div>
          ))}

          {/* Player */}
          <div
            className="absolute text-3xl transition-none pointer-events-none z-10"
            style={{
              left: `${playerX}%`,
              top: '85%',
              transform: 'translate(-50%, -50%)'
            }}
          >
            🚀
          </div>

          {/* Game controls hint */}
          <div className="absolute bottom-2 left-2 text-xs text-white/50">
            Перемещайте мышью или пальцем
          </div>
        </div>
      )}

      {gameState === 'gameOver' && (
        <div className="text-center space-y-4">
          <div className="text-red-400 font-orbitron text-lg mb-2">Игра окончена!</div>
          
          <div className="space-y-2 text-sm">
            <div>Финальный счёт: <span className="text-retro-orange font-bold">{stats.score}</span></div>
            <div>Достигнутый уровень: <span className="text-cyber-blue font-bold">{stats.level}</span></div>
            <div>Собрано монет: <span className="text-yellow-400 font-bold">{stats.coinsCollected}</span></div>
            {stats.score === highScore && stats.score > 0 && (
              <div className="text-yellow-400 font-bold animate-pulse">🏆 Новый рекорд!</div>
            )}
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={startGame}
              className="bg-gradient-to-r from-retro-orange to-cyber-blue hover:from-retro-orange/80 hover:to-cyber-blue/80 text-black font-orbitron font-bold flex-1"
            >
              <Icon name="RotateCcw" className="mr-2" size={16} />
              Ещё раз
            </Button>
            <Button 
              onClick={resetGame}
              variant="outline"
              className="border-retro-orange/30 text-retro-orange hover:bg-retro-orange/10"
            >
              <Icon name="Home" size={16} />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default SpaceCollector;
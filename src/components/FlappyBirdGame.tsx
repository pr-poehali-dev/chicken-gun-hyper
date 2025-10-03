import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { useAdmin } from '@/contexts/AdminContext';

interface Pipe {
  x: number;
  gap: number;
  passed: boolean;
}

const BIRD_SIZE = 30;
const GAME_WIDTH = 400;
const GAME_HEIGHT = 500;
const GRAVITY = 0.6;
const JUMP_STRENGTH = -10;
const PIPE_WIDTH = 60;
const GAP_SIZE = 150;

export default function FlappyBirdGame() {
  const { adminCheats } = useAdmin();
  const [birdY, setBirdY] = useState(GAME_HEIGHT / 2);
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [pipes, setPipes] = useState<Pipe[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const gameLoopRef = useRef<number>();
  const lastPipeRef = useRef(0);

  const jump = useCallback(() => {
    if (!gameStarted) {
      setGameStarted(true);
      return;
    }
    if (gameOver) return;
    
    const strength = adminCheats.superJump ? JUMP_STRENGTH * 1.5 : JUMP_STRENGTH;
    setBirdVelocity(strength);
  }, [gameStarted, gameOver, adminCheats]);

  const checkCollision = useCallback((y: number, pipesArray: Pipe[]) => {
    if (adminCheats.godMode || adminCheats.noClip) return false;

    if (y < 0 || y + BIRD_SIZE > GAME_HEIGHT) {
      return true;
    }

    const birdLeft = 100;
    const birdRight = birdLeft + BIRD_SIZE;
    const birdTop = y;
    const birdBottom = y + BIRD_SIZE;

    for (const pipe of pipesArray) {
      const pipeLeft = pipe.x;
      const pipeRight = pipe.x + PIPE_WIDTH;

      if (birdRight > pipeLeft && birdLeft < pipeRight) {
        if (birdTop < pipe.gap || birdBottom > pipe.gap + GAP_SIZE) {
          return true;
        }
      }
    }

    return false;
  }, [adminCheats]);

  const gameLoop = useCallback(() => {
    setBirdVelocity(v => {
      const gravity = adminCheats.moonGravity ? GRAVITY * 0.3 : adminCheats.zeroGravity ? 0 : GRAVITY;
      return v + gravity;
    });

    setBirdY(y => {
      const newY = y + birdVelocity;
      return Math.max(0, Math.min(GAME_HEIGHT - BIRD_SIZE, newY));
    });

    setPipes(prevPipes => {
      const speed = adminCheats.slowMotion ? 1 : 3;
      const newPipes = prevPipes
        .map(pipe => ({ ...pipe, x: pipe.x - speed }))
        .filter(pipe => pipe.x > -PIPE_WIDTH);

      newPipes.forEach(pipe => {
        if (!pipe.passed && pipe.x + PIPE_WIDTH < 100) {
          pipe.passed = true;
          const points = adminCheats.tripleScore ? 3 : 1;
          setScore(s => s + points);
        }
      });

      if (newPipes.length === 0 || newPipes[newPipes.length - 1].x < GAME_WIDTH - 300) {
        const gapSize = adminCheats.autoWin ? 300 : GAP_SIZE;
        newPipes.push({
          x: GAME_WIDTH,
          gap: Math.random() * (GAME_HEIGHT - gapSize - 100) + 50,
          passed: false,
        });
      }

      return newPipes;
    });
  }, [birdVelocity, adminCheats]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const checkGameOver = () => {
      if (checkCollision(birdY, pipes)) {
        setGameOver(true);
      }
    };

    checkGameOver();
  }, [birdY, pipes, gameStarted, gameOver, checkCollision]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    gameLoopRef.current = requestAnimationFrame(function animate() {
      gameLoop();
      gameLoopRef.current = requestAnimationFrame(animate);
    });

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameStarted, gameOver, gameLoop]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') {
        e.preventDefault();
        jump();
      }
    };

    const handleClick = () => jump();

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('click', handleClick);
    };
  }, [jump]);

  const startGame = () => {
    setBirdY(GAME_HEIGHT / 2);
    setBirdVelocity(0);
    setPipes([]);
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
  };

  return (
    <Card className="w-full max-w-md bg-gray-900/95 border-yellow-500/50 p-6">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-yellow-400 mb-2">🐦 Flappy Bird</h2>
        <div className="text-lg text-green-400 mb-2">
          Очки: {score}
        </div>

        {adminCheats.moonGravity && (
          <div className="text-gray-400 text-xs mb-1">🌙 Лунная гравитация</div>
        )}
        {adminCheats.zeroGravity && (
          <div className="text-purple-400 text-xs mb-1">🛸 Нулевая гравитация</div>
        )}
        {adminCheats.superJump && (
          <div className="text-cyan-400 text-xs mb-1">🦘 Супер-прыжок</div>
        )}
      </div>

      <div 
        className="relative bg-gradient-to-b from-sky-400 to-sky-300 rounded-lg border-2 border-yellow-500/50 mx-auto overflow-hidden cursor-pointer"
        style={{ 
          width: GAME_WIDTH,
          height: GAME_HEIGHT,
        }}
        onClick={jump}
      >
        {!gameStarted || gameOver ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/80 z-10">
            {gameOver ? (
              <>
                <div className="text-6xl mb-4">💥</div>
                <h3 className="text-2xl font-bold text-red-400 mb-2">Упс!</h3>
                <p className="text-xl text-yellow-400 mb-6">Очки: {score}</p>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">🐦</div>
                <h3 className="text-xl font-bold text-yellow-400 mb-4">Flappy Bird</h3>
                <p className="text-gray-300 text-sm mb-6 px-4 text-center">
                  Кликни или нажми пробел<br/>
                  чтобы взлететь!
                </p>
              </>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                startGame();
              }}
              className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold transition-colors"
            >
              {gameOver ? '🔄 Еще раз' : '🎮 Начать'}
            </button>
          </div>
        ) : null}

        <div
          className={`absolute w-${BIRD_SIZE} h-${BIRD_SIZE} transition-transform`}
          style={{
            left: 100,
            top: birdY,
            width: BIRD_SIZE,
            height: BIRD_SIZE,
            transform: `rotate(${Math.min(Math.max(birdVelocity * 3, -30), 60)}deg)`,
          }}
        >
          <div className="text-3xl">🐦</div>
        </div>

        {pipes.map((pipe, i) => (
          <React.Fragment key={i}>
            <div
              className="absolute bg-green-600 border-2 border-green-700"
              style={{
                left: pipe.x,
                top: 0,
                width: PIPE_WIDTH,
                height: pipe.gap,
              }}
            />
            <div
              className="absolute bg-green-600 border-2 border-green-700"
              style={{
                left: pipe.x,
                top: pipe.gap + (adminCheats.autoWin ? 300 : GAP_SIZE),
                width: PIPE_WIDTH,
                height: GAME_HEIGHT - pipe.gap - (adminCheats.autoWin ? 300 : GAP_SIZE),
              }}
            />
          </React.Fragment>
        ))}

        <div className="absolute bottom-0 w-full h-20 bg-gradient-to-t from-green-700 to-green-600"></div>
      </div>

      <div className="text-xs text-gray-400 text-center mt-3">
        Клик или Пробел для прыжка
      </div>
    </Card>
  );
}
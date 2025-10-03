import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { useAdmin } from '@/contexts/AdminContext';

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const CELL_SIZE = 20;

type Cell = number;
type Board = Cell[][];
type Tetromino = number[][];

const TETROMINOS: Record<string, { shape: Tetromino; color: string }> = {
  I: { shape: [[1,1,1,1]], color: 'bg-cyan-500' },
  O: { shape: [[1,1],[1,1]], color: 'bg-yellow-500' },
  T: { shape: [[0,1,0],[1,1,1]], color: 'bg-purple-500' },
  S: { shape: [[0,1,1],[1,1,0]], color: 'bg-green-500' },
  Z: { shape: [[1,1,0],[0,1,1]], color: 'bg-red-500' },
  J: { shape: [[1,0,0],[1,1,1]], color: 'bg-blue-500' },
  L: { shape: [[0,0,1],[1,1,1]], color: 'bg-orange-500' },
};

export default function TetrisGame() {
  const { adminCheats } = useAdmin();
  const [board, setBoard] = useState<Board>(Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0)));
  const [currentPiece, setCurrentPiece] = useState<Tetromino>([]);
  const [currentColor, setCurrentColor] = useState('');
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [level, setLevel] = useState(1);
  const gameLoopRef = useRef<NodeJS.Timeout>();

  const createNewPiece = useCallback(() => {
    const pieces = Object.keys(TETROMINOS);
    const randomPiece = pieces[Math.floor(Math.random() * pieces.length)];
    const { shape, color } = TETROMINOS[randomPiece];
    setCurrentPiece(shape);
    setCurrentColor(color);
    setPosition({ x: Math.floor(BOARD_WIDTH / 2) - Math.floor(shape[0].length / 2), y: 0 });
  }, []);

  const checkCollision = useCallback((piece: Tetromino, pos: {x: number, y: number}, checkBoard: Board) => {
    if (adminCheats.noClip) return false;
    
    for (let y = 0; y < piece.length; y++) {
      for (let x = 0; x < piece[y].length; x++) {
        if (piece[y][x]) {
          const newX = pos.x + x;
          const newY = pos.y + y;
          
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
            return true;
          }
          if (newY >= 0 && checkBoard[newY][newX]) {
            return true;
          }
        }
      }
    }
    return false;
  }, [adminCheats]);

  const rotatePiece = (piece: Tetromino): Tetromino => {
    const rotated = piece[0].map((_, i) => piece.map(row => row[i]).reverse());
    return rotated;
  };

  const mergePiece = useCallback(() => {
    const newBoard = board.map(row => [...row]);
    currentPiece.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell && position.y + y >= 0) {
          newBoard[position.y + y][position.x + x] = 1;
        }
      });
    });

    let linesCleared = 0;
    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
      if (newBoard[y].every(cell => cell === 1)) {
        newBoard.splice(y, 1);
        newBoard.unshift(Array(BOARD_WIDTH).fill(0));
        linesCleared++;
        y++;
      }
    }

    if (linesCleared > 0) {
      const points = [0, 100, 300, 500, 800][linesCleared] * level;
      const finalPoints = adminCheats.tripleScore ? points * 3 : points;
      setScore(s => s + finalPoints);
      setLines(l => l + linesCleared);
      setLevel(Math.floor((lines + linesCleared) / 10) + 1);
    }

    setBoard(newBoard);
    createNewPiece();
  }, [board, currentPiece, position, level, lines, createNewPiece, adminCheats]);

  const moveDown = useCallback(() => {
    const newPos = { ...position, y: position.y + 1 };
    if (!checkCollision(currentPiece, newPos, board)) {
      setPosition(newPos);
    } else {
      mergePiece();
    }
  }, [position, currentPiece, board, checkCollision, mergePiece]);

  const moveHorizontal = (dir: number) => {
    const newPos = { ...position, x: position.x + dir };
    if (!checkCollision(currentPiece, newPos, board)) {
      setPosition(newPos);
    }
  };

  const rotate = () => {
    const rotated = rotatePiece(currentPiece);
    if (!checkCollision(rotated, position, board)) {
      setCurrentPiece(rotated);
    }
  };

  const drop = () => {
    const newPos = { ...position };
    while (!checkCollision(currentPiece, { ...newPos, y: newPos.y + 1 }, board)) {
      newPos.y++;
    }
    setPosition(newPos);
    setTimeout(mergePiece, 50);
  };

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const speed = adminCheats.slowMotion ? 1500 : adminCheats.speedBoost ? 100 : Math.max(100, 1000 - (level - 1) * 50);

    gameLoopRef.current = setInterval(moveDown, speed);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameStarted, gameOver, moveDown, level, adminCheats]);

  useEffect(() => {
    if (currentPiece.length && checkCollision(currentPiece, position, board) && position.y === 0) {
      if (!adminCheats.godMode) {
        setGameOver(true);
      }
    }
  }, [currentPiece, position, board, checkCollision, adminCheats]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStarted || gameOver || !currentPiece.length) return;

      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
          e.preventDefault();
          moveHorizontal(-1);
          break;
        case 'ArrowRight':
        case 'd':
          e.preventDefault();
          moveHorizontal(1);
          break;
        case 'ArrowDown':
        case 's':
          e.preventDefault();
          moveDown();
          break;
        case 'ArrowUp':
        case 'w':
          e.preventDefault();
          rotate();
          break;
        case ' ':
          e.preventDefault();
          drop();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, gameOver, currentPiece, moveDown]);

  const startGame = () => {
    setBoard(Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0)));
    setScore(0);
    setLines(0);
    setLevel(1);
    setGameOver(false);
    setGameStarted(true);
    createNewPiece();
  };

  const renderBoard = () => {
    const displayBoard = board.map(row => [...row]);
    
    if (currentPiece.length) {
      currentPiece.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell && position.y + y >= 0 && position.y + y < BOARD_HEIGHT) {
            displayBoard[position.y + y][position.x + x] = 2;
          }
        });
      });
    }

    return displayBoard;
  };

  return (
    <Card className="w-full max-w-md bg-gray-900/95 border-blue-500/50 p-6">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-blue-400 mb-2">🧱 Тетрис</h2>
        <div className="flex justify-between text-sm mb-2">
          <div className="text-yellow-400">Очки: {score}</div>
          <div className="text-green-400">Линии: {lines}</div>
          <div className="text-purple-400">Уровень: {level}</div>
        </div>

        {adminCheats.slowMotion && (
          <div className="text-cyan-400 text-xs mb-1">🐌 Замедление</div>
        )}
        {adminCheats.tripleScore && (
          <div className="text-yellow-400 text-xs mb-1">📊 x3 Очки</div>
        )}
      </div>

      <div 
        className="relative bg-gray-800 rounded-lg border-2 border-blue-500/50 mx-auto"
        style={{ 
          width: BOARD_WIDTH * CELL_SIZE,
          height: BOARD_HEIGHT * CELL_SIZE,
        }}
      >
        {!gameStarted || gameOver ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/90 z-10">
            {gameOver ? (
              <>
                <div className="text-6xl mb-4">💀</div>
                <h3 className="text-2xl font-bold text-red-400 mb-2">Игра окончена!</h3>
                <p className="text-xl text-blue-400 mb-2">Очки: {score}</p>
                <p className="text-sm text-gray-400 mb-6">Линий: {lines}</p>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">🧱</div>
                <h3 className="text-xl font-bold text-blue-400 mb-4">Тетрис</h3>
                <p className="text-gray-400 text-sm mb-6 px-4 text-center">
                  ← → - движение<br/>
                  ↑ - поворот<br/>
                  Пробел - мгновенное падение
                </p>
              </>
            )}
            <button
              onClick={startGame}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              {gameOver ? '🔄 Еще раз' : '🎮 Начать'}
            </button>
          </div>
        ) : null}

        <div className="absolute inset-0">
          {renderBoard().map((row, y) => (
            <div key={y} className="flex">
              {row.map((cell, x) => (
                <div
                  key={`${y}-${x}`}
                  className={`border border-gray-700/30 ${
                    cell === 2 ? currentColor : cell === 1 ? 'bg-gray-600' : 'bg-gray-900'
                  }`}
                  style={{
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="text-xs text-gray-400 text-center mt-3">
        ← → Движение | ↑ Поворот | Пробел Падение
      </div>
    </Card>
  );
}
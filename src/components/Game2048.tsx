import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { useAdmin } from '@/contexts/AdminContext';

type Board = number[][];

const GRID_SIZE = 4;

export default function Game2048() {
  const { adminCheats } = useAdmin();
  const [board, setBoard] = useState<Board>([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [won, setWon] = useState(false);

  const createEmptyBoard = () => Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));

  const addRandomTile = useCallback((currentBoard: Board) => {
    const emptyCells: {row: number, col: number}[] = [];
    currentBoard.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell === 0) emptyCells.push({ row: r, col: c });
      });
    });

    if (emptyCells.length > 0) {
      const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      const value = adminCheats.autoWin ? 1024 : Math.random() < 0.9 ? 2 : 4;
      currentBoard[row][col] = value;
    }

    return currentBoard;
  }, [adminCheats]);

  const initBoard = useCallback(() => {
    let newBoard = createEmptyBoard();
    newBoard = addRandomTile(newBoard);
    newBoard = addRandomTile(newBoard);
    return newBoard;
  }, [addRandomTile]);

  const move = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameOver || !gameStarted) return;

    let newBoard = board.map(row => [...row]);
    let moved = false;
    let points = 0;

    const rotateBoard = (b: Board, times: number): Board => {
      let result = b;
      for (let i = 0; i < times; i++) {
        result = result[0].map((_, index) => result.map(row => row[index]).reverse());
      }
      return result;
    };

    let rotations = 0;
    if (direction === 'up') rotations = 3;
    if (direction === 'down') rotations = 1;
    if (direction === 'right') rotations = 2;

    newBoard = rotateBoard(newBoard, rotations);

    for (let r = 0; r < GRID_SIZE; r++) {
      const row = newBoard[r].filter(x => x !== 0);
      for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
          row[i] *= 2;
          points += row[i];
          row.splice(i + 1, 1);
          if (row[i] === 2048) setWon(true);
        }
      }
      while (row.length < GRID_SIZE) row.push(0);
      
      if (JSON.stringify(row) !== JSON.stringify(newBoard[r])) moved = true;
      newBoard[r] = row;
    }

    newBoard = rotateBoard(newBoard, 4 - rotations);

    if (moved) {
      newBoard = addRandomTile(newBoard);
      const finalPoints = adminCheats.tripleScore ? points * 3 : points;
      setScore(s => s + finalPoints);
      setBoard(newBoard);

      const hasEmpty = newBoard.some(row => row.includes(0));
      const canMerge = newBoard.some((row, r) =>
        row.some((cell, c) =>
          (c < GRID_SIZE - 1 && cell === newBoard[r][c + 1]) ||
          (r < GRID_SIZE - 1 && cell === newBoard[r + 1][c])
        )
      );

      if (!hasEmpty && !canMerge && !adminCheats.godMode) {
        setGameOver(true);
      }
    }
  }, [board, gameOver, gameStarted, addRandomTile, adminCheats]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStarted || gameOver) return;

      const keyMap: Record<string, 'up' | 'down' | 'left' | 'right'> = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
        w: 'up',
        s: 'down',
        a: 'left',
        d: 'right',
      };

      const direction = keyMap[e.key];
      if (direction) {
        e.preventDefault();
        move(direction);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, gameOver, move]);

  const startGame = () => {
    const newBoard = initBoard();
    setBoard(newBoard);
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
    setWon(false);
  };

  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
    }
  }, [score, bestScore]);

  const getTileColor = (value: number) => {
    const colors: Record<number, string> = {
      0: 'bg-gray-700',
      2: 'bg-yellow-200 text-gray-900',
      4: 'bg-yellow-300 text-gray-900',
      8: 'bg-orange-400 text-white',
      16: 'bg-orange-500 text-white',
      32: 'bg-orange-600 text-white',
      64: 'bg-red-500 text-white',
      128: 'bg-yellow-500 text-white',
      256: 'bg-yellow-600 text-white',
      512: 'bg-yellow-700 text-white',
      1024: 'bg-green-500 text-white',
      2048: 'bg-green-600 text-white',
    };
    return colors[value] || 'bg-purple-600 text-white';
  };

  return (
    <Card className="w-full max-w-md bg-gray-900/95 border-orange-500/50 p-6">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-orange-400 mb-3">🎯 2048</h2>
        <div className="flex justify-around mb-3">
          <div className="bg-gray-800 rounded-lg px-4 py-2">
            <div className="text-xs text-gray-400">Очки</div>
            <div className="text-xl font-bold text-orange-400">{score}</div>
          </div>
          <div className="bg-gray-800 rounded-lg px-4 py-2">
            <div className="text-xs text-gray-400">Лучший</div>
            <div className="text-xl font-bold text-green-400">{bestScore}</div>
          </div>
        </div>

        {won && !gameOver && (
          <div className="text-green-400 text-sm mb-2 animate-pulse">🎉 Вы победили!</div>
        )}
      </div>

      <div className="bg-gray-800 rounded-lg p-2 mx-auto" style={{ width: 'fit-content' }}>
        {!gameStarted || gameOver ? (
          <div className="flex flex-col items-center justify-center bg-gray-900/90 rounded-lg p-8">
            {gameOver ? (
              <>
                <div className="text-6xl mb-4">😢</div>
                <h3 className="text-2xl font-bold text-red-400 mb-2">Игра окончена!</h3>
                <p className="text-xl text-orange-400 mb-6">Очки: {score}</p>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-orange-400 mb-4">2048</h3>
                <p className="text-gray-400 text-sm mb-6 px-4 text-center">
                  Используй стрелки или WASD<br/>
                  Собери плитку 2048!
                </p>
              </>
            )}
            <button
              onClick={startGame}
              className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-colors"
            >
              {gameOver ? '🔄 Еще раз' : '🎮 Начать'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            {board.map((row, r) =>
              row.map((cell, c) => (
                <div
                  key={`${r}-${c}`}
                  className={`w-20 h-20 rounded-lg flex items-center justify-center text-2xl font-bold transition-all duration-150 ${getTileColor(cell)}`}
                >
                  {cell !== 0 && cell}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div className="text-xs text-gray-400 text-center mt-3">
        Стрелки или WASD для управления
      </div>
    </Card>
  );
}
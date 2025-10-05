import React, { useState, useEffect } from 'react';

interface Cell {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
}

type Difficulty = 'easy' | 'medium' | 'hard';

const DIFFICULTIES = {
  easy: { rows: 8, cols: 8, mines: 10 },
  medium: { rows: 12, cols: 12, mines: 20 },
  hard: { rows: 16, cols: 16, mines: 40 }
};

export default function MinesweeperGame() {
  const [cheatsEnabled, setCheatsEnabled] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [board, setBoard] = useState<Cell[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [flagsLeft, setFlagsLeft] = useState(0);
  const [timer, setTimer] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    initGame();
  }, [difficulty]);

  useEffect(() => {
    if (gameStarted && !gameOver && !won) {
      const interval = setInterval(() => setTimer(t => t + 1), 1000);
      return () => clearInterval(interval);
    }
  }, [gameStarted, gameOver, won]);

  const initGame = () => {
    const { rows, cols, mines } = DIFFICULTIES[difficulty];
    const newBoard: Cell[][] = Array(rows).fill(null).map(() =>
      Array(cols).fill(null).map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0
      }))
    );

    let minesPlaced = 0;
    while (minesPlaced < mines) {
      const row = Math.floor(Math.random() * rows);
      const col = Math.floor(Math.random() * cols);
      if (!newBoard[row][col].isMine) {
        newBoard[row][col].isMine = true;
        minesPlaced++;
      }
    }

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!newBoard[r][c].isMine) {
          newBoard[r][c].neighborMines = countNeighborMines(newBoard, r, c);
        }
      }
    }

    setBoard(newBoard);
    setGameOver(false);
    setWon(false);
    setFlagsLeft(mines);
    setTimer(0);
    setGameStarted(false);
  };

  const countNeighborMines = (board: Cell[][], row: number, col: number): number => {
    let count = 0;
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const r = row + dr;
        const c = col + dc;
        if (r >= 0 && r < board.length && c >= 0 && c < board[0].length) {
          if (board[r][c].isMine) count++;
        }
      }
    }
    return count;
  };

  const revealCell = (row: number, col: number) => {
    if (gameOver || won || board[row][col].isRevealed || board[row][col].isFlagged) return;

    if (!gameStarted) setGameStarted(true);

    const newBoard = board.map(r => r.map(c => ({ ...c })));
    
    if (newBoard[row][col].isMine) {
      newBoard.forEach(r => r.forEach(c => { if (c.isMine) c.isRevealed = true; }));
      setBoard(newBoard);
      setGameOver(true);
      return;
    }

    const reveal = (r: number, c: number) => {
      if (r < 0 || r >= newBoard.length || c < 0 || c >= newBoard[0].length) return;
      if (newBoard[r][c].isRevealed || newBoard[r][c].isMine) return;
      
      newBoard[r][c].isRevealed = true;
      
      if (newBoard[r][c].neighborMines === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            reveal(r + dr, c + dc);
          }
        }
      }
    };

    reveal(row, col);
    setBoard(newBoard);
    checkWin(newBoard);
  };

  const toggleFlag = (row: number, col: number, e: React.MouseEvent) => {
    e.preventDefault();
    if (gameOver || won || board[row][col].isRevealed) return;

    if (!gameStarted) setGameStarted(true);

    const newBoard = board.map(r => r.map(c => ({ ...c })));
    newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged;
    setBoard(newBoard);
    setFlagsLeft(prev => newBoard[row][col].isFlagged ? prev - 1 : prev + 1);
    checkWin(newBoard);
  };

  const checkWin = (board: Cell[][]) => {
    const allSafeCellsRevealed = board.every(row =>
      row.every(cell => cell.isMine || cell.isRevealed)
    );
    if (allSafeCellsRevealed) {
      setWon(true);
    }
  };

  const getCellColor = (cell: Cell) => {
    if (!cell.isRevealed) return 'bg-gradient-to-br from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600';
    if (cell.isMine) return 'bg-red-600';
    
    const colors = [
      'bg-slate-800',
      'text-blue-400',
      'text-green-400',
      'text-red-400',
      'text-purple-400',
      'text-orange-400',
      'text-cyan-400',
      'text-pink-400',
      'text-yellow-400'
    ];
    return colors[0];
  };

  const getNumberColor = (num: number) => {
    const colors = ['', 'text-blue-400', 'text-green-400', 'text-red-400', 'text-purple-400', 'text-orange-400', 'text-cyan-400', 'text-pink-400', 'text-yellow-400'];
    return colors[num] || 'text-white';
  };

  const cellSize = difficulty === 'easy' ? 'w-10 h-10' : difficulty === 'medium' ? 'w-8 h-8' : 'w-6 h-6';
  const fontSize = difficulty === 'easy' ? 'text-lg' : difficulty === 'medium' ? 'text-base' : 'text-sm';

  return (
    <div className="flex flex-col items-center gap-6 p-8 min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="text-center">
        <h1 className="font-orbitron text-4xl text-retro-orange mb-2">💣 Сапёр</h1>
        <p className="text-slate-400">Найди все мины!</p>
      </div>

      <div className="flex gap-4 items-center flex-wrap justify-center">
        <div className="flex gap-2">
          {(['easy', 'medium', 'hard'] as Difficulty[]).map(diff => (
            <button
              key={diff}
              onClick={() => setDifficulty(diff)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                difficulty === diff
                  ? 'bg-retro-orange text-slate-900'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {diff === 'easy' ? 'Легко' : diff === 'medium' ? 'Средне' : 'Сложно'}
            </button>
          ))}
        </div>

        <div className="flex gap-4 bg-slate-800 px-6 py-3 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-retro-orange">{flagsLeft}</div>
            <div className="text-xs text-slate-400">Флаги</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-retro-cyan">{timer}s</div>
            <div className="text-xs text-slate-400">Время</div>
          </div>
        </div>

        <button
          onClick={initGame}
          className="px-6 py-2 bg-gradient-to-r from-retro-purple to-retro-pink text-white rounded-lg font-semibold hover:scale-105 transition"
        >
          🔄 Новая игра
        </button>

        <button
          onClick={() => setCheatsEnabled(!cheatsEnabled)}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            cheatsEnabled
              ? 'bg-yellow-500 text-slate-900'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          {cheatsEnabled ? '👁️ Читы ВКЛ' : '👁️ Читы ВЫКЛ'}
        </button>
      </div>

      {cheatsEnabled && (
        <div className="bg-yellow-500/20 border border-yellow-500 px-4 py-2 rounded-lg">
          <span className="text-yellow-400 font-semibold">🔍 Читы включены - мины видны!</span>
        </div>
      )}

      {gameOver && (
        <div className="bg-red-500/20 border-2 border-red-500 px-8 py-4 rounded-lg">
          <p className="text-2xl font-bold text-red-400">💥 Взрыв! Игра окончена!</p>
        </div>
      )}

      {won && (
        <div className="bg-green-500/20 border-2 border-green-500 px-8 py-4 rounded-lg">
          <p className="text-2xl font-bold text-green-400">🎉 Победа! Время: {timer}s</p>
        </div>
      )}

      <div className="inline-block bg-slate-800/50 p-4 rounded-xl backdrop-blur-sm">
        <div className="flex flex-col gap-1">
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-1">
              {row.map((cell, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => revealCell(rowIndex, colIndex)}
                  onContextMenu={(e) => toggleFlag(rowIndex, colIndex, e)}
                  className={`${cellSize} ${fontSize} ${getCellColor(cell)} rounded border-2 border-slate-900 font-bold transition-all active:scale-95 flex items-center justify-center`}
                >
                  {cell.isFlagged ? '🚩' : 
                   cell.isRevealed ? (
                     cell.isMine ? '💣' : 
                     cell.neighborMines > 0 ? (
                       <span className={getNumberColor(cell.neighborMines)}>
                         {cell.neighborMines}
                       </span>
                     ) : ''
                   ) : cheatsEnabled && cell.isMine ? '👁️' : ''}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-800/50 px-6 py-4 rounded-lg max-w-md text-center">
        <p className="text-slate-300 text-sm">
          <span className="font-bold text-retro-orange">ЛКМ</span> - открыть клетку
          <br />
          <span className="font-bold text-retro-cyan">ПКМ</span> - поставить флаг
        </p>
      </div>
    </div>
  );
}
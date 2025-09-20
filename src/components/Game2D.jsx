'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { GAME_MODES, POWER_UPS, DIFFICULTY_LEVELS } from '../lib/gameTypes.js';

// 2D Classic TicTacToe Game Component
const Game2D = ({ 
  onGameEnd, 
  onStatsUpdate,
  currentTheme,
  soundEnabled = true,
  playSound,
  currentSymbols = { X: 'X', O: 'O' },
  isAgainstAI = true,
  difficulty = DIFFICULTY_LEVELS.MEDIUM,
  onGameStateChange // For tutorial synchronization
}) => {
  // Game state for 2D
  const [board, setBoard] = useState(Array(9).fill(''));
  const [isXNext, setIsXNext] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState([]);
  const [gameStartTime, setGameStartTime] = useState(Date.now());

  // Report game state changes for tutorial synchronization
  useEffect(() => {
    if (onGameStateChange) {
      const gameState = {
        board: board,
        isXNext: isXNext,
        winner: winner,
        moveCount: board.filter(cell => cell !== '').length,
        gameOver: gameOver
      };
      
      console.log('2D Game state change:', gameState);
      onGameStateChange(gameState);
    }
  }, [board, isXNext, winner, gameOver, onGameStateChange]);
  const [moveCount, setMoveCount] = useState(0);

  // Power-ups state
  const [powerUps, setPowerUps] = useState({
    X: {
      freeze: { available: true, cooldown: 0 },
      double_move: { available: true, cooldown: 0 },
      steal: { available: true, cooldown: 0 },
      bomb: { available: true, cooldown: 0 },
      shield: { available: true, cooldown: 0 }
    },
    O: {
      freeze: { available: true, cooldown: 0 },
      double_move: { available: true, cooldown: 0 },
      steal: { available: true, cooldown: 0 },
      bomb: { available: true, cooldown: 0 },
      shield: { available: true, cooldown: 0 }
    }
  });
  
  const [activePowerUp, setActivePowerUp] = useState(null);
  const [shieldedCells, setShieldedCells] = useState(new Set());
  const [frozenTurns, setFrozenTurns] = useState(0);
  const [doubleMoveActive, setDoubleMoveActive] = useState(false);
  const [usedPowerUps, setUsedPowerUps] = useState([]);

  // AI timeout ref
  const aiMoveTimeout = useRef(null);

  // Winning combinations for 2D
  const WINNING_LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ];

  // Check for winner
  const checkWinner = useCallback((squares) => {
    for (let i = 0; i < WINNING_LINES.length; i++) {
      const [a, b, c] = WINNING_LINES[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: [a, b, c] };
      }
    }
    return { winner: null, line: [] };
  }, []);

  // Check for draw
  const checkDraw = useCallback((squares) => {
    return squares.every(square => square !== '') && !checkWinner(squares).winner;
  }, [checkWinner]);

  // Handle cell clicks
  const handleClick = useCallback((index) => {
    if (board[index] || gameOver || frozenTurns > 0) return;
    if (shieldedCells.has(index)) return; // Protected by shield

    // Handle power-up usage
    if (activePowerUp) {
      usePowerUp(activePowerUp, index);
      return;
    }

    const newBoard = [...board];
    const currentPlayer = isXNext ? 'X' : 'O';
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    setMoveCount(prev => prev + 1);

    // Play move sound
    if (soundEnabled && playSound) {
      playSound('move');
    }

    // Check win/draw
    const { winner: gameWinner, line } = checkWinner(newBoard);
    const isDraw = checkDraw(newBoard);

    if (gameWinner || isDraw) {
      handleGameEnd(gameWinner, line);
    } else {
      // Handle double move power-up
      if (doubleMoveActive) {
        setDoubleMoveActive(false);
      } else {
        setIsXNext(!isXNext);
      }
    }
  }, [board, gameOver, isXNext, frozenTurns, shieldedCells, activePowerUp, doubleMoveActive, checkWinner, checkDraw, soundEnabled, playSound]);

  // Handle game end
  const handleGameEnd = useCallback((gameWinner, cells) => {
    setGameOver(true);
    setWinner(gameWinner);
    setWinningLine(cells || []);

    const duration = Date.now() - gameStartTime;
    const result = {
      winner: gameWinner,
      draw: !gameWinner,
      gameMode: GAME_MODES.CLASSIC_2D,
      difficulty,
      duration,
      moves: moveCount,
      powerUpsUsed: usedPowerUps,
      isPlayerWin: gameWinner === 'X', // Assuming X is always player
      isAgainstAI: true
    };

    if (onGameEnd) {
      onGameEnd(result);
    }

    // Play end game sound
    if (soundEnabled && playSound) {
      if (gameWinner) {
        playSound('win');
        setTimeout(() => playSound('line'), 300);
      } else {
        playSound('draw');
      }
    }
  }, [gameStartTime, moveCount, usedPowerUps, difficulty, onGameEnd, soundEnabled, playSound]);

  // Use power-up
  const usePowerUp = useCallback((powerUpId, targetCell = null) => {
    const currentPlayer = isXNext ? 'X' : 'O';
    const powerUp = powerUps[currentPlayer]?.[powerUpId];
    
    if (!powerUp || !powerUp.available || powerUp.cooldown > 0) return;

    let newBoard = [...board];
    let newUsedPowerUps = [...usedPowerUps, powerUpId];

    switch (powerUpId) {
      case 'freeze':
        setFrozenTurns(2);
        break;
      
      case 'double_move':
        setDoubleMoveActive(true);
        break;
      
      case 'steal':
        if (targetCell !== null) {
          const opponent = isXNext ? 'O' : 'X';
          if (newBoard[targetCell] === opponent) {
            newBoard[targetCell] = currentPlayer;
          }
        }
        break;
      
      case 'bomb':
        // Clear adjacent cells
        if (targetCell !== null) {
          const adjacentCells = getBombArea(targetCell);
          adjacentCells.forEach(cell => {
            if (cell >= 0 && cell < 9) {
              newBoard[cell] = '';
            }
          });
        }
        break;
      
      case 'shield':
        if (targetCell !== null) {
          setShieldedCells(prev => new Set([...prev, targetCell]));
        }
        break;
    }

    // Update power-up cooldowns
    const newPowerUps = { ...powerUps };
    newPowerUps[currentPlayer][powerUpId] = {
      available: false,
      cooldown: POWER_UPS[powerUpId.toUpperCase()].cooldown
    };
    setPowerUps(newPowerUps);
    setUsedPowerUps(newUsedPowerUps);
    
    if (newBoard !== board) {
      setBoard(newBoard);
    }

    setActivePowerUp(null);

    // Play power-up sound
    if (soundEnabled && playSound) {
      playSound('powerup');
    }
  }, [isXNext, powerUps, board, usedPowerUps, soundEnabled, playSound]);

  // Get bomb area cells
  const getBombArea = (centerCell) => {
    const row = Math.floor(centerCell / 3);
    const col = centerCell % 3;
    const cells = [centerCell];
    
    // Add adjacent cells
    for (let r = Math.max(0, row - 1); r <= Math.min(2, row + 1); r++) {
      for (let c = Math.max(0, col - 1); c <= Math.min(2, col + 1); c++) {
        const cell = r * 3 + c;
        if (cell !== centerCell) {
          cells.push(cell);
        }
      }
    }
    
    return cells;
  };

  // AI Move Logic
  const makeAIMove = useCallback(() => {
    if (gameOver || isXNext) return;
    
    const emptyIndices = board.reduce((acc, cell, index) => {
      if (!cell) acc.push(index);
      return acc;
    }, []);
    
    if (emptyIndices.length === 0) return;
    
    let move;
    
    switch (difficulty) {
      case DIFFICULTY_LEVELS.EASY:
        // Random move
        move = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        break;
        
      case DIFFICULTY_LEVELS.MEDIUM:
        // 70% smart move, 30% random
        if (Math.random() < 0.7) {
          move = getBestMove(board, 'O', 'X') || emptyIndices[0];
        } else {
          move = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        }
        break;
        
      case DIFFICULTY_LEVELS.HARD:
      case DIFFICULTY_LEVELS.NIGHTMARE:
      default:
        // Always make the best move
        move = getBestMove(board, 'O', 'X') || emptyIndices[0];
        break;
    }
    
    const newBoard = [...board];
    newBoard[move] = 'O';
    setBoard(newBoard);
    setMoveCount(prev => prev + 1);

    // Play AI move sound
    if (soundEnabled && playSound) {
      playSound('move');
    }

    // Check for win/draw after AI move
    const { winner: gameWinner, line } = checkWinner(newBoard);
    const isDraw = checkDraw(newBoard);

    if (gameWinner || isDraw) {
      handleGameEnd(gameWinner, line);
    } else {
      setIsXNext(true);
    }
  }, [board, gameOver, isXNext, difficulty, soundEnabled, playSound, checkWinner, checkDraw, handleGameEnd]);

  // Simple minimax for AI
  const getBestMove = useCallback((board, aiPlayer, humanPlayer) => {
    // Check for winning move
    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        board[i] = aiPlayer;
        if (checkWinner(board).winner === aiPlayer) {
          board[i] = '';
          return i;
        }
        board[i] = '';
      }
    }

    // Check for blocking move
    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        board[i] = humanPlayer;
        if (checkWinner(board).winner === humanPlayer) {
          board[i] = '';
          return i;
        }
        board[i] = '';
      }
    }

    // Take center if available
    if (board[4] === '') return 4;

    // Take corners
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(i => board[i] === '');
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }

    // Take any available space
    const emptySpaces = board.reduce((acc, cell, index) => {
      if (cell === '') acc.push(index);
      return acc;
    }, []);
    
    return emptySpaces[Math.floor(Math.random() * emptySpaces.length)];
  }, [checkWinner]);

  // Handle AI moves
  useEffect(() => {
    if (isAgainstAI && !isXNext && !gameOver && frozenTurns === 0) {
      aiMoveTimeout.current = setTimeout(() => {
        makeAIMove();
      }, 500);
    }
    
    return () => {
      if (aiMoveTimeout.current) {
        clearTimeout(aiMoveTimeout.current);
        aiMoveTimeout.current = null;
      }
    };
  }, [isAgainstAI, isXNext, gameOver, frozenTurns, makeAIMove]);

  // Update power-up cooldowns
  useEffect(() => {
    const interval = setInterval(() => {
      setPowerUps(prev => {
        const updated = { ...prev };
        ['X', 'O'].forEach(player => {
          Object.keys(updated[player]).forEach(powerUpId => {
            if (updated[player][powerUpId].cooldown > 0) {
              updated[player][powerUpId].cooldown--;
              if (updated[player][powerUpId].cooldown === 0) {
                updated[player][powerUpId].available = true;
              }
            }
          });
        });
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Update frozen turns
  useEffect(() => {
    if (frozenTurns > 0) {
      const timer = setTimeout(() => {
        setFrozenTurns(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [frozenTurns]);

  // Reset game
  const resetGame = useCallback(() => {
    setBoard(Array(9).fill(''));
    setIsXNext(true);
    setGameOver(false);
    setWinner(null);
    setWinningLine([]);
    setGameStartTime(Date.now());
    setMoveCount(0);
    setActivePowerUp(null);
    setShieldedCells(new Set());
    setFrozenTurns(0);
    setDoubleMoveActive(false);
    setUsedPowerUps([]);

    // Reset power-ups
    setPowerUps({
      X: {
        freeze: { available: true, cooldown: 0 },
        double_move: { available: true, cooldown: 0 },
        steal: { available: true, cooldown: 0 },
        bomb: { available: true, cooldown: 0 },
        shield: { available: true, cooldown: 0 }
      },
      O: {
        freeze: { available: true, cooldown: 0 },
        double_move: { available: true, cooldown: 0 },
        steal: { available: true, cooldown: 0 },
        bomb: { available: true, cooldown: 0 },
        shield: { available: true, cooldown: 0 }
      }
    });
  }, []);

  const currentPlayer = isXNext ? 'X' : 'O';
  const currentPlayerPowerUps = powerUps[currentPlayer];

  return (
    <div className="game-2d">
      {/* 2D Game Board */}
      <div className="board-2d-container">
        <div className="board-2d">
          {board.map((cell, index) => {
            const isWinningCell = winningLine.includes(index);
            const isShielded = shieldedCells.has(index);
            
            return (
              <button
                key={index}
                className={`cell-2d ${cell ? `cell-${cell.toLowerCase()}` : ''} ${isWinningCell ? 'winning-cell' : ''} ${isShielded ? 'shielded-cell' : ''}`}
                onClick={() => handleClick(index)}
                disabled={!!cell || gameOver}
                aria-label={`Cell ${index + 1} ${cell ? `occupied by ${cell}` : 'empty'}`}
              >
                {cell && (
                  <span className="cell-content-2d">
                    {currentSymbols[cell] || cell}
                  </span>
                )}
                {isShielded && <div className="shield-indicator">🛡️</div>}
              </button>
            );
          })}
          
          {/* Winning Line Overlay */}
          {winningLine.length > 0 && (
            <div className="winning-line-overlay">
              <div className={`winning-line-2d ${getLineDirection(winningLine)}`} />
            </div>
          )}
        </div>
        
        {/* Game Status */}
        <div className="game-status-2d">
          {gameOver ? (
            <div className="status-message winner">
              {winner ? `Player ${currentSymbols[winner] || winner} Wins!` : "It's a Draw!"}
            </div>
          ) : (
            <div className="status-message">
              {frozenTurns > 0 ? (
                <span className="frozen">❄️ Frozen for {frozenTurns} turns</span>
              ) : (
                <span>
                  Next: {currentSymbols[currentPlayer] || currentPlayer} 
                  {doubleMoveActive && <span className="double-move">⚡ Double Move Active</span>}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Power-ups Panel */}
      <div className="powerups-panel-2d">
        <h3>Power-ups - {currentSymbols[currentPlayer] || currentPlayer}</h3>
        <div className="powerups-grid-2d">
          {Object.entries(POWER_UPS).slice(0, 5).map(([key, powerUp]) => {
            const playerPowerUp = currentPlayerPowerUps[key.toLowerCase()];
            const available = playerPowerUp.available && playerPowerUp.cooldown === 0;
            
            return (
              <button
                key={key}
                className={`powerup-btn-2d ${available ? 'available' : 'cooldown'} ${activePowerUp === key ? 'active' : ''}`}
                onClick={() => available && setActivePowerUp(activePowerUp === key ? null : key)}
                disabled={!available}
                title={`${powerUp.description}${!available ? ` (Cooldown: ${playerPowerUp.cooldown}s)` : ''}`}
              >
                <div className="powerup-icon">{powerUp.icon}</div>
                <div className="powerup-name">{powerUp.name}</div>
                {playerPowerUp.cooldown > 0 && (
                  <div className="cooldown-timer">{playerPowerUp.cooldown}s</div>
                )}
              </button>
            );
          })}
        </div>
        
        {activePowerUp && (
          <div className="powerup-instructions">
            <p>🎯 {POWER_UPS[activePowerUp].description}</p>
            <p>Click on the board to use {POWER_UPS[activePowerUp].name}</p>
          </div>
        )}
      </div>

      {/* Game Controls */}
      <div className="game-controls-2d">
        <button onClick={resetGame} className="game-button">
          🔄 New Game
        </button>
      </div>
    </div>
  );

  // Helper function to determine line direction for CSS
  function getLineDirection(line) {
    const [a, b, c] = line;
    
    // Check if it's a row
    if (Math.floor(a / 3) === Math.floor(b / 3)) return 'horizontal';
    
    // Check if it's a column
    if (a % 3 === b % 3) return 'vertical';
    
    // Check diagonal direction
    if ((a === 0 && c === 8) || (a === 8 && c === 0)) return 'diagonal-main';
    if ((a === 2 && c === 6) || (a === 6 && c === 2)) return 'diagonal-anti';
    
    return 'horizontal';
  }
};

export default Game2D;

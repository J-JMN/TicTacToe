'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { GAME_MODES, POWER_UPS, DIFFICULTY_LEVELS } from '../lib/gameTypes.js';
import { statsManager } from '../lib/statsManager.js';

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
  const [moveCount, setMoveCount] = useState(0);
  const [showGameResultModal, setShowGameResultModal] = useState(false);
  const [gameStartTime, setGameStartTime] = useState(Date.now());
  const [moveHistory, setMoveHistory] = useState([]);

  // Power-ups state - availability depends on difficulty and loss count
  const getInitialPowerUps = () => {
    const stats = JSON.parse(localStorage.getItem('tic_tac_toe_stats') || '{}');
    const hardLosses = stats?.gamesByDifficulty?.hard?.played - stats?.gamesByDifficulty?.hard?.won || 0;
    const nightmareLosses = stats?.gamesByDifficulty?.nightmare?.played - stats?.gamesByDifficulty?.nightmare?.won || 0;
    
    // Nightmare: No powerups
    if (difficulty === DIFFICULTY_LEVELS.NIGHTMARE) {
      // Unlock one powerup after losing 500 times in nightmare
      const unlockSpecialPowerup = nightmareLosses >= 500;
      return {
        X: {
          freeze: { available: unlockSpecialPowerup, cooldown: 0 },
          double_move: { available: false, cooldown: 0 },
          steal: { available: false, cooldown: 0 },
          bomb: { available: false, cooldown: 0 },
          shield: { available: false, cooldown: 0 }
        },
        O: {
          freeze: { available: false, cooldown: 0 },
          double_move: { available: false, cooldown: 0 },
          steal: { available: false, cooldown: 0 },
          bomb: { available: false, cooldown: 0 },
          shield: { available: false, cooldown: 0 }
        }
      };
    }
    
    // Hard: Only one selected powerup after losing 15 times
    if (difficulty === DIFFICULTY_LEVELS.HARD) {
      const unlockPowerup = hardLosses >= 15;
      return {
        X: {
          freeze: { available: unlockPowerup, cooldown: 0 },
          double_move: { available: false, cooldown: 0 },
          steal: { available: false, cooldown: 0 },
          bomb: { available: false, cooldown: 0 },
          shield: { available: false, cooldown: 0 }
        },
        O: {
          freeze: { available: false, cooldown: 0 },
          double_move: { available: false, cooldown: 0 },
          steal: { available: false, cooldown: 0 },
          bomb: { available: false, cooldown: 0 },
          shield: { available: false, cooldown: 0 }
        }
      };
    }
    
    // Easy and Medium: All powerups available
    return {
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
    };
  };
  
  const [powerUps, setPowerUps] = useState(getInitialPowerUps());
  
  const [activePowerUp, setActivePowerUp] = useState(null);
  const [shieldedCells, setShieldedCells] = useState(new Set());
  const [frozenTurns, setFrozenTurns] = useState(0);
  const [doubleMoveActive, setDoubleMoveActive] = useState(false);
  const [usedPowerUps, setUsedPowerUps] = useState([]);

  // AI timeout ref
  const aiMoveTimeout = useRef(null);

  // Report game state changes for tutorial synchronization
  useEffect(() => {
    if (onGameStateChange) {
      const gameState = {
        board: board,
        isXNext: isXNext,
        winner: winner,
        moveCount: board.filter(cell => cell !== '').length,
        gameOver: gameOver,
        powerupSelected: activePowerUp !== null,
        powerupUsed: usedPowerUps.length > 0,
        activePowerUp: activePowerUp,
        usedPowerUps: usedPowerUps
      };
      
      onGameStateChange(gameState);
    }
  }, [board, isXNext, winner, gameOver, activePowerUp, usedPowerUps, onGameStateChange]);

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

  // Use power-up
  const usePowerUp = useCallback((powerUpId, targetCell = null) => {
    const currentPlayer = isXNext ? 'X' : 'O';
    const powerUp = powerUps[currentPlayer]?.[powerUpId];
    
    if (!powerUp || !powerUp.available || powerUp.cooldown > 0) return;

    let newBoard = [...board];
    let newUsedPowerUps = [...usedPowerUps, powerUpId];

    switch (powerUpId) {
      case 'freeze':
        // Skip the opponent's turn immediately
        setIsXNext(true); // Keep player's turn
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

  // Handle power-up button clicks
  const handlePowerUpClick = useCallback((powerUpId) => {
    // Some power-ups activate immediately, others require targeting
    const immediateActivationPowerUps = ['freeze', 'double_move'];
    
    if (immediateActivationPowerUps.includes(powerUpId)) {
      // Use power-up immediately
      usePowerUp(powerUpId);
    } else {
      // Set as active for targeting
      setActivePowerUp(activePowerUp === powerUpId ? null : powerUpId);
    }
  }, [activePowerUp, usePowerUp]);

  // Get bomb area cells
  const getBombArea = useCallback((centerCell) => {
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
  }, []);

  // Handle cell clicks
  const handleCellClick = useCallback((index) => {
    // If a power-up is active and this is a valid target
    if (activePowerUp) {
      usePowerUp(activePowerUp, index);
      setActivePowerUp(null); // Clear the active powerup after use
      return;
    }

    // Normal move logic
    if (board[index] || gameOver || (isAgainstAI && !isXNext)) return;

    const currentPlayer = isXNext ? 'X' : 'O';
    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    setMoveCount(prev => prev + 1);
    setMoveHistory(prev => [...prev, index]);

    // Record move for heat map
    statsManager.recordMove(index);

    if (soundEnabled && playSound) {
      playSound('move');
    }

    // Check for win/draw
    const { winner: gameWinner, line } = checkWinner(newBoard);
    const isDraw = checkDraw(newBoard);

    if (gameWinner || isDraw) {
      handleGameEnd(gameWinner, line);
    } else {
      // Handle double move power-up
      if (doubleMoveActive) {
        setDoubleMoveActive(false);
        // Stay as current player's turn for another move
      } else {
        setIsXNext(!isXNext); // Switch turns (works for both AI and local multiplayer)
      }
    }
  }, [board, gameOver, isXNext, frozenTurns, shieldedCells, activePowerUp, doubleMoveActive, checkWinner, checkDraw, soundEnabled, playSound, usePowerUp]);

  // Handle game end
  const handleGameEnd = useCallback((gameWinner, cells) => {
    setGameOver(true);
    setWinner(gameWinner);
    setWinningLine(cells || []);

    const duration = Date.now() - gameStartTime;
    
    // Determine win pattern if there's a winner
    let winPattern = null;
    if (gameWinner && cells) {
      // Check if horizontal (rows 0-2, 3-5, 6-8)
      if (cells.every(c => Math.floor(c / 3) === Math.floor(cells[0] / 3))) {
        winPattern = 'horizontal';
      }
      // Check if vertical (columns 0,3,6 / 1,4,7 / 2,5,8)
      else if (cells.every(c => c % 3 === cells[0] % 3)) {
        winPattern = 'vertical';
      }
      // Otherwise diagonal
      else {
        winPattern = 'diagonal';
      }
    }
    
    // Check if center was controlled by winner
    const centerControlled = gameWinner && board[4] === gameWinner;
    
    // Check if this is a final move win (board was nearly full)
    const filledCells = board.filter(cell => cell !== null).length;
    const finalMove = gameWinner && filledCells >= 8;
    
    // Check for flawless victory (opponent has no marks)
    const opponentSymbol = gameWinner === 'X' ? 'O' : 'X';
    const flawlessVictory = gameWinner && !board.includes(opponentSymbol);
    
    // Get first move position (for corner tracking)
    const firstMove = moveHistory && moveHistory.length > 0 ? moveHistory[0] : null;
    
    // Check for comeback win (would need to track if opponent was close to winning)
    // This is simplified - ideally track if opponent had 2 in a row at some point
    const comebackWin = false; // TODO: Implement proper comeback detection
    
    const result = {
      winner: gameWinner,
      draw: !gameWinner,
      gameMode: GAME_MODES.TICTACTOE,
      difficulty,
      duration,
      moves: moveCount,
      powerUpsUsed: usedPowerUps,
      isPlayerWin: gameWinner === 'X', // Assuming X is always player
      isAgainstAI: true,
      winPattern,
      finalMove,
      comebackWin,
      firstMove,
      centerControlled,
      flawlessVictory
    };

    if (onGameEnd) {
      onGameEnd(result);
    }

    // Play end game sound
    if (soundEnabled && playSound) {
      if (gameWinner) {
        playSound('win');
        setTimeout(() => playSound('line'), 300);
        
        // Add screen shake effect on win
        const gameContainer = document.querySelector('.tic-tac-toe-enhanced');
        if (gameContainer) {
          gameContainer.classList.add('screen-shake');
          setTimeout(() => {
            gameContainer.classList.remove('screen-shake');
          }, 600);
        }
      } else {
        playSound('draw');
      }
    }
    
    // Show game result modal
    setTimeout(() => {
      setShowGameResultModal(true);
    }, 800);
  }, [gameStartTime, moveCount, usedPowerUps, difficulty, onGameEnd, soundEnabled, playSound]);

  // AI Move Logic with proper difficulty implementation
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
        // Random move - player should win most of the time
        move = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        break;
        
      case DIFFICULTY_LEVELS.MEDIUM:
        // Balanced gameplay - 50/50 win rate
        if (Math.random() < 0.5) {
          move = getBestMove(board, 'O', 'X') || emptyIndices[0];
        } else {
          move = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        }
        break;
        
      case DIFFICULTY_LEVELS.HARD:
        // Player has 5% chance to win - AI plays very well but makes occasional mistakes
        if (Math.random() < 0.05) {
          // 5% chance to make a random move
          move = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        } else {
          // 95% chance to make the best move
          move = getBestMove(board, 'O', 'X') || emptyIndices[0];
        }
        break;
        
      case DIFFICULTY_LEVELS.NIGHTMARE:
      default:
        // Player has 1% chance to win - AI plays almost perfectly
        if (Math.random() < 0.01) {
          // 1% chance to make a slightly suboptimal move
          const bestMove = getBestMove(board, 'O', 'X');
          const otherMoves = emptyIndices.filter(i => i !== bestMove);
          if (otherMoves.length > 0) {
            move = otherMoves[Math.floor(Math.random() * otherMoves.length)];
          } else {
            move = bestMove || emptyIndices[0];
          }
        } else {
          // 99% chance to make the perfect move
          move = getBestMove(board, 'O', 'X') || emptyIndices[0];
        }
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

  // Minimax algorithm with alpha-beta pruning for perfect AI play
  const minimax = useCallback((board, depth, isMaximizing, alpha, beta, aiPlayer, humanPlayer) => {
    const result = checkWinner(board);
    
    // Base cases - return score if game is over
    if (result.winner === aiPlayer) return { score: 10 - depth };
    if (result.winner === humanPlayer) return { score: depth - 10 };
    if (checkDraw(board)) return { score: 0 };
    
    const emptyIndices = board.reduce((acc, cell, index) => {
      if (!cell) acc.push(index);
      return acc;
    }, []);
    
    if (isMaximizing) {
      let bestScore = -Infinity;
      let bestMove = -1;
      
      for (const index of emptyIndices) {
        const newBoard = [...board];
        newBoard[index] = aiPlayer;
        const { score } = minimax(newBoard, depth + 1, false, alpha, beta, aiPlayer, humanPlayer);
        
        if (score > bestScore) {
          bestScore = score;
          bestMove = index;
        }
        
        alpha = Math.max(alpha, bestScore);
        if (beta <= alpha) break; // Beta cut-off
      }
      
      return { score: bestScore, index: bestMove };
    } else {
      let bestScore = Infinity;
      let bestMove = -1;
      
      for (const index of emptyIndices) {
        const newBoard = [...board];
        newBoard[index] = humanPlayer;
        const { score } = minimax(newBoard, depth + 1, true, alpha, beta, aiPlayer, humanPlayer);
        
        if (score < bestScore) {
          bestScore = score;
          bestMove = index;
        }
        
        beta = Math.min(beta, bestScore);
        if (beta <= alpha) break; // Alpha cut-off
      }
      
      return { score: bestScore, index: bestMove };
    }
  }, [checkWinner, checkDraw]);

  // Get the best move using minimax
  const getBestMove = useCallback((board, aiPlayer, humanPlayer) => {
    // For the first move, take center or corner for optimal play
    const emptyCount = board.filter(cell => cell === '').length;
    if (emptyCount === 9) {
      // First move - take center or corner
      return [4, 0, 2, 6, 8][Math.floor(Math.random() * 5)];
    }
    
    // For the second move if center is taken
    if (emptyCount === 8 && board[4] !== '') {
      // Take a corner if center is taken by opponent
      const corners = [0, 2, 6, 8];
      return corners[Math.floor(Math.random() * corners.length)];
    }
    
    // Use minimax for all other moves
    const { index } = minimax([...board], 0, true, -Infinity, Infinity, aiPlayer, humanPlayer);
    return index;
  }, [minimax]);

  // Handle AI moves
  useEffect(() => {
    if (isAgainstAI && !isXNext && !gameOver && frozenTurns === 0) {
      aiMoveTimeout.current = setTimeout(() => {
        const emptyIndices = board.reduce((acc, cell, index) => {
          if (!cell && !shieldedCells.has(index)) acc.push(index);
          return acc;
        }, []);
        
        if (emptyIndices.length === 0) return;
        
        let move;
        
        switch (difficulty) {
          case DIFFICULTY_LEVELS.EASY:
            // Random move
            move = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
            break;
            
          case DIFFICULTY_LEVELS.MEDIUM: {
            // 85% chance to make a smart move, 15% random
            if (Math.random() < 0.85) {
              // Use minimax with strategic play
              const { index } = minimax(
                [...board],
                0,
                true,
                -Infinity,
                Infinity,
                'O',
                'X'
              );
              move = index;
              
              // 20% chance to make a slightly suboptimal move
              if (Math.random() < 0.2 && emptyIndices.length > 1) {
                const otherMoves = emptyIndices.filter(i => i !== move);
                if (otherMoves.length > 0) {
                  // Prioritize corners, then center, then edges for suboptimal moves
                  const corners = otherMoves.filter(i => [0, 2, 6, 8].includes(i));
                  const center = otherMoves.filter(i => i === 4);
                  const edges = otherMoves.filter(i => [1, 3, 5, 7].includes(i));
                  
                  const bestMoves = corners.length > 0 ? corners :
                                  center.length > 0 ? center :
                                  edges;
                  
                  if (bestMoves.length > 0) {
                    move = bestMoves[Math.floor(Math.random() * bestMoves.length)];
                  }
                }
              }
            } else {
              // 15% chance to make a semi-random move (but still strategic)
              const corners = emptyIndices.filter(i => [0, 2, 6, 8].includes(i));
              const center = emptyIndices.filter(i => i === 4);
              const edges = emptyIndices.filter(i => [1, 3, 5, 7].includes(i));
              
              // 70% chance to choose from corners/center, 30% from edges
              if ((corners.length > 0 || center.length > 0) && Math.random() < 0.7) {
                const goodMoves = [...corners, ...center];
                move = goodMoves[Math.floor(Math.random() * goodMoves.length)];
              } else if (edges.length > 0) {
                move = edges[Math.floor(Math.random() * edges.length)];
              } else {
                move = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
              }
            }
            break;
          }
            
          case DIFFICULTY_LEVELS.HARD:
            // Always make the best move
            move = getBestMove(board, 'O', 'X');
            break;
            
          case DIFFICULTY_LEVELS.NIGHTMARE:
          default:
            // Perfect play - always optimal move
            move = getBestMove(board, 'O', 'X');
            break;
        }
        
        // Update the board directly
        const newBoard = [...board];
        newBoard[move] = 'O';
        setBoard(newBoard);
        
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
          setIsXNext(true); // Switch back to player's turn
        }
      }, 500);
    }
    
    return () => {
      if (aiMoveTimeout.current) {
        clearTimeout(aiMoveTimeout.current);
        aiMoveTimeout.current = null;
      }
    };
  }, [isAgainstAI, isXNext, gameOver, frozenTurns, board, difficulty, soundEnabled, playSound, minimax, getBestMove, checkWinner, checkDraw, handleGameEnd]);

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
    setMoveHistory([]);
    setActivePowerUp(null);
    setShieldedCells(new Set());
    setFrozenTurns(0);
    setDoubleMoveActive(false);
    setUsedPowerUps([]);
    setShowGameResultModal(false);

    // Reset power-ups based on difficulty
    setPowerUps(getInitialPowerUps());
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
                onClick={() => handleCellClick(index)}
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
                className={`powerup-btn-2d ${available ? 'available' : 'cooldown'} ${activePowerUp === key.toLowerCase() ? 'active' : ''}`}
                onClick={() => available && handlePowerUpClick(key.toLowerCase())}
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
            <p>🎯 {POWER_UPS[activePowerUp.toUpperCase()]?.description}</p>
            <p>Click on the board to use {POWER_UPS[activePowerUp.toUpperCase()]?.name}</p>
          </div>
        )}
      </div>

      {/* Game Controls */}
      <div className="game-controls-2d">
        <button onClick={resetGame} className="game-button">
          🔄 New Game
        </button>
      </div>

      {/* Game Result Modal */}
      {showGameResultModal && (
        <div className="game-result-modal-overlay">
          <div className="game-result-modal">
            <div className="result-content">
              <div className="result-emoji">
                {winner ? (winner === 'X' ? '🎉' : '😞') : '🤝'}
              </div>
              <h2 className="result-message">
                {winner 
                  ? (winner === 'X' ? 'You Win!' : 'You Lose!') 
                  : 'It\'s a Draw!'
                }
              </h2>
              <div className="result-details">
                <p>Moves: {moveCount}</p>
                <p>Difficulty: {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</p>
                {usedPowerUps.length > 0 && (
                  <p>Power-ups used: {usedPowerUps.length}</p>
                )}
              </div>
              <div className="result-actions">
                <button 
                  className="result-button primary"
                  onClick={() => {
                    setShowGameResultModal(false);
                    resetGame();
                  }}
                >
                  🔄 New Game
                </button>
                <button 
                  className="result-button secondary"
                  onClick={() => setShowGameResultModal(false)}
                >
                  ✕ Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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

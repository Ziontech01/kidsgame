/* ============================================================
   js/game.js — Complete Game Controller
   MUST be loaded LAST (after board, players, cards, ai, animations)
   ============================================================ */

'use strict';

// ─── Game State ───────────────────────────────────────────────────────────────
const GameState = {
  players:          [],       // Array of Player instances
  gameTiles:        [],       // Cloned tile state with ownedBy info
  currentPlayerIdx: 0,
  round:            1,
  maxRounds:        15,
  gameOver:         false,
  rolling:          false,    // Prevents double-rolling
  muted:            false,
  reduceMotion:     false
};

// ─── init() ───────────────────────────────────────────────────────────────────
/**
 * Called on page load. Attaches all event listeners and shows the setup screen.
 */
function init() {
  // ── Top bar controls ──
  const muteBtn   = document.getElementById('mute-btn');
  const motionBtn = document.getElementById('motion-btn');
  if (muteBtn)   muteBtn.addEventListener('click', toggleMute);
  if (motionBtn) motionBtn.addEventListener('click', toggleReduceMotion);

  // ── Player count buttons ──
  const countBtns = document.querySelectorAll('.count-btn');
  countBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      countBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      updatePlayerRowsVisibility(parseInt(btn.dataset.count));
    });
  });

  // ── Token pickers (each player row) ──
  document.querySelectorAll('.player-row').forEach(row => {
    row.querySelectorAll('.token-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        row.querySelectorAll('.token-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
      });
    });
  });

  // ── Start button ──
  const startBtn = document.getElementById('start-btn');
  if (startBtn) startBtn.addEventListener('click', onStartButtonClick);

  // ── Roll button ──
  const rollBtn = document.getElementById('roll-btn');
  if (rollBtn) rollBtn.addEventListener('click', handleRoll);

  // ── Play Again button ──
  const playAgainBtn = document.getElementById('play-again-btn');
  if (playAgainBtn) playAgainBtn.addEventListener('click', () => showScreen('setup-screen'));

  // Show setup screen
  showScreen('setup-screen');
}

// ─── Screen Management ────────────────────────────────────────────────────────
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(screenId);
  if (target) target.classList.add('active');
}

function updatePlayerRowsVisibility(count) {
  document.querySelectorAll('.player-row').forEach(row => {
    const playerIdx = parseInt(row.dataset.player);
    row.style.display = playerIdx < count ? 'flex' : 'none';
  });
}

// ─── onStartButtonClick() ────────────────────────────────────────────────────
function onStartButtonClick() {
  // Gather setup data from the form
  const activeCountBtn = document.querySelector('.count-btn.active');
  const count          = activeCountBtn ? parseInt(activeCountBtn.dataset.count) : 2;

  const playersSetup = [];
  for (let i = 0; i < count; i++) {
    const row        = document.querySelector(`.player-row[data-player="${i}"]`);
    if (!row) continue;

    const nameInput  = row.querySelector('.player-name-input');
    const selectedToken = row.querySelector('.token-btn.selected');
    const aiToggle   = row.querySelector('.ai-toggle');

    playersSetup.push({
      name:     nameInput ? nameInput.value.trim() || `Player ${i + 1}` : `Player ${i + 1}`,
      tokenIdx: selectedToken ? parseInt(selectedToken.dataset.token) : i,
      isAI:     aiToggle ? aiToggle.checked : false
    });
  }

  startGame({ count, players: playersSetup });
}

// ─── startGame() ─────────────────────────────────────────────────────────────
/**
 * Initializes a new game from setup data.
 * @param {object} setupData - { count, players[] }
 */
function startGame(setupData) {
  // Reset state
  GameState.round            = 1;
  GameState.gameOver         = false;
  GameState.rolling          = false;
  GameState.currentPlayerIdx = 0;

  // Clone tiles (don't mutate the global TILES array)
  GameState.gameTiles = Board.TILES.map(t => Object.assign({}, t, { ownedBy: null }));

  // Create players
  GameState.players = Players.createPlayers(setupData);

  // Render board
  Board.renderBoard();

  // Render player panels
  Players.renderPlayerPanels(GameState.players);

  // Create tokens on board for each player
  GameState.players.forEach(p => Players.createTokenOnBoard(p));

  // Switch to game screen
  showScreen('game-screen');

  // Update all panels
  GameState.players.forEach(p => Players.updatePlayerPanel(p, GameState.gameTiles));

  // Short delay before first turn
  setTimeout(() => startTurn(0), 400);
}

// ─── startTurn() ─────────────────────────────────────────────────────────────
/**
 * Begins a player's turn.
 * @param {number} playerIdx
 */
async function startTurn(playerIdx) {
  if (GameState.gameOver) return;

  GameState.currentPlayerIdx = playerIdx;
  const player = GameState.players[playerIdx];

  // Update active status on all panels
  GameState.players.forEach((p, i) => {
    p.isActive = (i === playerIdx);
    Players.updatePlayerPanel(p, GameState.gameTiles);
  });

  // Skip turn if needed (Silly Bench / bad card)
  if (player.skipTurns > 0) {
    player.skipTurns--;
    await Animations.showMessage(
      `${player.token} ${player.name} is taking a rest... 😴 (${player.skipTurns + 1} turn skipped)`,
      2000
    );
    await Animations.delay(600);
    nextTurn();
    return;
  }

  // Show whose turn it is
  await Animations.showMessage(`${player.token} ${player.name}'s turn!`, 1500);

  if (player.isAI) {
    // AI: auto-roll after a short "thinking" delay
    await AI.aiTakeTurn(player, GameState.players, GameState.gameTiles);
    await handleRollForPlayer(player);
  } else {
    // Human: enable Roll button
    const rollBtn = document.getElementById('roll-btn');
    if (rollBtn) {
      rollBtn.disabled = false;
      rollBtn.textContent = '🎲 Roll Dice!';
    }
  }
}

// ─── handleRoll() ─────────────────────────────────────────────────────────────
/**
 * Called when the Roll Dice button is clicked by a human player.
 */
async function handleRoll() {
  if (GameState.rolling || GameState.gameOver) return;
  const player = GameState.players[GameState.currentPlayerIdx];
  if (!player || player.isAI) return;

  // Disable the button
  const rollBtn = document.getElementById('roll-btn');
  if (rollBtn) rollBtn.disabled = true;

  await handleRollForPlayer(player);
}

// ─── handleRollForPlayer() ────────────────────────────────────────────────────
/**
 * Performs the dice roll, moves the player, and resolves the tile.
 * Used for both human and AI players.
 * @param {object}  player      - The active Player instance
 * @param {boolean} [isReroll]  - True when triggered by a "roll again" effect
 */
async function handleRollForPlayer(player, isReroll = false) {
  GameState.rolling = true;

  // Roll 1–6
  const roll = Math.floor(Math.random() * 6) + 1;

  if (!isReroll) {
    await Animations.showMessage(`${player.token} ${player.name} rolled a ${roll}! 🎲`, 1200);
  }

  // Animate dice
  await Animations.rollDiceAnimation(roll);

  // Move token step-by-step
  await Players.moveTokenAnimated(player, roll, onPassStart);

  // Resolve the tile the player landed on
  const tileId   = player.position;
  const tileData = GameState.gameTiles[tileId];

  // Highlight the landed tile briefly
  await Animations.tileGlowAnimation(tileId);

  // Handle the tile
  await resolveTile(player, tileData);

  // Update panels after tile resolution
  GameState.players.forEach(p => Players.updatePlayerPanel(p, GameState.gameTiles));

  GameState.rolling = false;

  // Check win condition
  if (checkWinCondition()) {
    endGame();
    return;
  }

  // Move to next turn (unless a "roll again" effect is pending — handled inside resolveTile)
}

// ─── onPassStart() ────────────────────────────────────────────────────────────
/**
 * Called each time a player passes through tile 0 (Start).
 * Awards +2 coins.
 * @param {object} player
 */
async function onPassStart(player) {
  player.coins += 2;
  await Animations.showMessage(`${player.token} Passed Start! +2 coins! 🏁`, 1500);
  Animations.coinBurstAnimation(0, 2);
  Players.updatePlayerPanel(player, GameState.gameTiles);
}

// ─── resolveTile() ────────────────────────────────────────────────────────────
/**
 * Handles the effect of landing on a tile.
 * @param {object} player   - The active Player
 * @param {object} tileData - The tile from gameTiles
 */
async function resolveTile(player, tileData) {
  switch (tileData.type) {
    case 'corner':
      await handleCorner(player, tileData);
      break;
    case 'property':
      await handleProperty(player, tileData);
      break;
    case 'special':
      await handleSpecial(player, tileData);
      break;
    default:
      await nextTurn();
  }
}

// ─── handleCorner() ───────────────────────────────────────────────────────────
async function handleCorner(player, tile) {
  switch (tile.id) {
    case 0: // Start — already handled by onPassStart, but landing gives coins too
      player.coins += 2;
      await Animations.showMessage(`${player.token} Back at Start! +2 coins! 🏁`, 1800);
      Animations.coinBurstAnimation(0, 2);
      Players.updatePlayerPanel(player, GameState.gameTiles);
      break;

    case 5: // Snack Break — nothing happens
      await Animations.showMessage(`${player.token} Time for a snack! 🍎 Rest here!`, 2000);
      break;

    case 10: // Free Coins — all players get +2
      await Animations.showMessage(`⭐ FREE COINS! Everyone gets +2 coins!`, 1000);
      GameState.players.forEach(p => {
        p.coins += 2;
        Animations.coinBurstAnimation(10, 2);
      });
      GameState.players.forEach(p => Players.updatePlayerPanel(p, GameState.gameTiles));
      await Animations.delay(1200);
      await Animations.showMessage(`⭐ ${player.token} ${player.name} landed on Free Coins! Everyone gains +2! 🎉`, 2000);
      break;

    case 15: // Silly Bench — sit out one turn
      player.skipTurns = 1;
      await Animations.showMessage(`${player.token} ${player.name} is sitting on the Silly Bench! 😴 Miss 1 turn!`, 2200);
      Players.updatePlayerPanel(player, GameState.gameTiles);
      break;

    default:
      break;
  }

  await Animations.delay(400);
  nextTurn();
}

// ─── handleProperty() ─────────────────────────────────────────────────────────
async function handleProperty(player, tile) {
  if (tile.ownedBy === null) {
    // Unowned: offer to buy
    if (player.isAI) {
      const willBuy = await AI.aiBuyDecision(player, tile, GameState.gameTiles);
      if (willBuy) {
        await executeBuy(player, tile);
        await Animations.showMessage(`🤖 ${player.name} bought ${tile.emoji} ${tile.name}!`, 1800);
      } else {
        await Animations.showMessage(`🤖 ${player.name} passed on ${tile.emoji} ${tile.name}.`, 1500);
        nextTurn();
      }
    } else {
      // Show buy popup for human
      showBuyPopup(player, tile);
      // (nextTurn is called from handleBuy / handleSkip)
    }
  } else if (tile.ownedBy === player.id) {
    // Player's own property
    await Animations.showMessage(`${player.token} Your place! 🏡 ${tile.emoji} ${tile.name}`, 1800);
    nextTurn();
  } else {
    // Owned by another player — pay rent
    const owner = GameState.players[tile.ownedBy];
    await payRent(player, owner, tile);
  }
}

// ─── payRent() ────────────────────────────────────────────────────────────────
async function payRent(player, owner, tile) {
  const rentAmount = tile.rent;

  // If player can't afford rent, apply helper bonus first
  if (player.coins < rentAmount) {
    player.coins += 2;
    Players.showHelperBonus(player);
    Players.updatePlayerPanel(player, GameState.gameTiles);
    await Animations.delay(1200);
  }

  const actualRent = Math.min(rentAmount, player.coins);
  player.coins -= actualRent;
  owner.coins  += actualRent;

  await Animations.showMessage(
    `${player.token} ${player.name} pays 🪙${actualRent} rent to ${owner.token} ${owner.name}!`,
    2200
  );

  Animations.coinBurstAnimation(tile.id, actualRent);
  GameState.players.forEach(p => Players.updatePlayerPanel(p, GameState.gameTiles));

  await Animations.delay(800);
  nextTurn();
}

// ─── handleSpecial() ──────────────────────────────────────────────────────────
async function handleSpecial(player, tile) {
  switch (tile.action) {
    case 'treasure': {
      player.coins += 3;
      await Animations.showMessage(`${tile.emoji} Treasure Chest! ${player.name} gets +3 coins! 💰`, 2000);
      Animations.coinBurstAnimation(tile.id, 3);
      Animations.sparkleAnimation(tile.id);
      Players.updatePlayerPanel(player, GameState.gameTiles);
      await Animations.delay(600);
      nextTurn();
      break;
    }

    case 'bonus': {
      player.coins += 2;
      await Animations.showMessage(`${tile.emoji} Bonus Coins! ${player.name} gets +2 coins! 💰`, 2000);
      Animations.coinBurstAnimation(tile.id, 2);
      Players.updatePlayerPanel(player, GameState.gameTiles);
      await Animations.delay(600);
      nextTurn();
      break;
    }

    case 'card': {
      const card   = Cards.drawCard();
      const result = Cards.applySurpriseCard(card, player, GameState.players);

      // Show the card popup, then resolve
      if (player.isAI) {
        await Animations.showMessage(`🎴 ${player.name} draws: "${card.text}"`, 2500);
        await Animations.delay(600);
        await applyCardResult(result, player);
      } else {
        await showCardPopup(card, result, player);
        // applyCardResult called after user dismisses popup
      }
      break;
    }

    case 'spin': {
      const result = Cards.applyLuckySpin(player, GameState.players);

      if (player.isAI) {
        await Animations.showMessage(`🎡 ${player.name} spins: "${result.message}"`, 2500);
        await Animations.delay(600);
        await applyCardResult(result, player);
      } else {
        await showSpinPopup(result, player);
      }
      break;
    }

    case 'moveagain': {
      await Animations.showMessage(`⚡ Move Again! ${player.name} rolls again!`, 1800);
      await Animations.delay(800);
      // Roll again immediately
      await handleRollForPlayer(player, true);
      return; // Don't call nextTurn here, handleRollForPlayer will do it
    }

    case 'helper': {
      // Find player with fewest coins
      const poorest = GameState.players.reduce((min, p) =>
        p.coins < min.coins ? p : min,
        GameState.players[0]
      );
      poorest.coins += 2;
      await Animations.showMessage(
        `🤝 Happy Helper! ${poorest.token} ${poorest.name} has fewest coins — gets +2! 🎉`,
        2500
      );
      Animations.coinBurstAnimation(tile.id, 2);
      GameState.players.forEach(p => Players.updatePlayerPanel(p, GameState.gameTiles));
      await Animations.delay(600);
      nextTurn();
      break;
    }

    default:
      nextTurn();
  }
}

// ─── applyCardResult() ────────────────────────────────────────────────────────
/**
 * Applies any secondary effects from a card (extra move, roll again).
 * @param {object} result  - Result from applySurpriseCard / applyLuckySpin
 * @param {object} player  - Active player
 */
async function applyCardResult(result, player) {
  // Extra movement
  if (result.extraMoveSteps) {
    const steps = result.extraMoveSteps;
    if (steps > 0) {
      await Players.moveTokenAnimated(player, steps, onPassStart);
    } else if (steps < 0) {
      // Move back: calculate new position manually
      const totalTiles = Board.TILES.length;
      const newPos = ((player.position + steps) % totalTiles + totalTiles) % totalTiles;
      player.position = newPos;
      Players.positionTokenOnTile(player, newPos);
      await Animations.delay(500);
    }
    // Resolve the new tile (but without further cascades)
    const newTile = GameState.gameTiles[player.position];
    await Animations.tileGlowAnimation(player.position);
    await resolveTile(player, newTile);
    return;
  }

  // Roll again
  if (result.rollAgain) {
    await Animations.showMessage(`🎲 Roll Again!`, 1200);
    await Animations.delay(600);
    await handleRollForPlayer(player, true);
    return;
  }

  // Update panels and move on
  GameState.players.forEach(p => Players.updatePlayerPanel(p, GameState.gameTiles));
  nextTurn();
}

// ─── executeBuy() ────────────────────────────────────────────────────────────
/**
 * Processes a purchase without the popup (used for AI).
 * @param {object} player - Buyer
 * @param {object} tile   - Tile data (from gameTiles)
 */
async function executeBuy(player, tile) {
  player.coins -= tile.cost;
  tile.ownedBy = player.id;
  player.ownedTiles.push(tile.id);

  Board.updateTileOwner(tile.id, player.id, player.color, player.token);
  await Animations.purchaseAnimation(tile.id, player.color);
  Players.updatePlayerPanel(player, GameState.gameTiles);
}

// ─── Popup Helpers ────────────────────────────────────────────────────────────

function showPopup(emoji, title, body, buttons) {
  const overlay = document.getElementById('action-popup');
  const emojiEl = document.getElementById('popup-emoji');
  const titleEl = document.getElementById('popup-title');
  const bodyEl  = document.getElementById('popup-body');
  const btnsEl  = document.getElementById('popup-buttons');

  if (!overlay) return;
  if (emojiEl) emojiEl.textContent = emoji;
  if (titleEl) titleEl.textContent = title;
  if (bodyEl)  bodyEl.innerHTML    = body;
  if (btnsEl)  btnsEl.innerHTML    = '';

  buttons.forEach(({ label, cls, onClick }) => {
    const btn = document.createElement('button');
    btn.className   = `big-btn ${cls || 'secondary-btn'}`;
    btn.textContent = label;
    btn.addEventListener('click', () => {
      hidePopup();
      onClick();
    });
    if (btnsEl) btnsEl.appendChild(btn);
  });

  overlay.classList.remove('hidden');
}

function hidePopup() {
  const overlay = document.getElementById('action-popup');
  if (overlay) overlay.classList.add('hidden');
}

// ─── showBuyPopup() ───────────────────────────────────────────────────────────
function showBuyPopup(player, tile) {
  const canAfford = player.coins >= tile.cost;
  const bodyText  = `
    <strong>${tile.emoji} ${tile.name}</strong><br>
    Cost: 🪙${tile.cost} &nbsp;|&nbsp; Rent: 🏷️${tile.rent}<br>
    Your coins: 🪙${player.coins}
    ${!canAfford ? '<br><em style="color:#ef4444">Not enough coins!</em>' : ''}
  `;

  const buttons = [];

  if (canAfford) {
    buttons.push({
      label: `🛒 Buy for 🪙${tile.cost}`,
      cls:   'success-btn',
      onClick: () => handleBuy(player.id, tile.id)
    });
  }

  buttons.push({
    label:   '⏭️ Skip',
    cls:     'secondary-btn',
    onClick: () => handleSkip()
  });

  showPopup(tile.emoji, `Buy ${tile.name}?`, bodyText, buttons);
}

// ─── handleBuy() ─────────────────────────────────────────────────────────────
async function handleBuy(playerIdx, tileId) {
  const player = GameState.players[playerIdx];
  const tile   = GameState.gameTiles[tileId];
  if (!player || !tile) return;

  await executeBuy(player, tile);
  await Animations.showMessage(`🎉 ${player.name} bought ${tile.emoji} ${tile.name}!`, 2000);
  nextTurn();
}

// ─── handleSkip() ────────────────────────────────────────────────────────────
function handleSkip() {
  nextTurn();
}

// ─── showCardPopup() ──────────────────────────────────────────────────────────
function showCardPopup(card, result, player) {
  return new Promise(resolve => {
    showPopup(
      '🎴',
      'Surprise Card!',
      `<strong>${card.text}</strong><br><em>${result.message}</em>`,
      [{
        label:   '✅ OK!',
        cls:     'primary-btn',
        onClick: async () => {
          await applyCardResult(result, player);
          resolve();
        }
      }]
    );
  });
}

// ─── showSpinPopup() ──────────────────────────────────────────────────────────
function showSpinPopup(result, player) {
  return new Promise(resolve => {
    showPopup(
      '🎡',
      'Lucky Spin!',
      `<strong>${result.message}</strong>`,
      [{
        label:   '🎉 Awesome!',
        cls:     'primary-btn',
        onClick: async () => {
          await applyCardResult(result, player);
          resolve();
        }
      }]
    );
  });
}

// ─── nextTurn() ───────────────────────────────────────────────────────────────
function nextTurn() {
  if (GameState.gameOver) return;

  // Advance to next player
  const nextIdx = (GameState.currentPlayerIdx + 1) % GameState.players.length;

  // Increment round counter when we wrap back to player 0
  if (nextIdx === 0) {
    GameState.round++;
  }

  // Check if we've hit the max round limit
  if (GameState.round > GameState.maxRounds) {
    endGame();
    return;
  }

  // Check all properties bought
  const allBought = GameState.gameTiles
    .filter(t => t.type === 'property')
    .every(t => t.ownedBy !== null);

  if (allBought) {
    endGame();
    return;
  }

  // Small delay before next turn starts
  setTimeout(() => startTurn(nextIdx), 600);
}

// ─── checkWinCondition() ─────────────────────────────────────────────────────
/**
 * Returns true if the game should end.
 */
function checkWinCondition() {
  if (GameState.round > GameState.maxRounds) return true;

  const allBought = GameState.gameTiles
    .filter(t => t.type === 'property')
    .every(t => t.ownedBy !== null);

  return allBought;
}

// ─── endGame() ────────────────────────────────────────────────────────────────
function endGame() {
  GameState.gameOver = true;

  // Calculate scores: coins + (sum of owned property costs × 0.5)
  const rankings = GameState.players.map(player => {
    const propValue = player.ownedTiles.reduce((sum, tileId) => {
      const tile = GameState.gameTiles[tileId];
      return sum + (tile ? tile.cost * 0.5 : 0);
    }, 0);

    return {
      player,
      score: Math.round(player.coins + propValue)
    };
  });

  // Sort by score descending
  rankings.sort((a, b) => b.score - a.score);

  showWinScreen(rankings);
}

// ─── showWinScreen() ─────────────────────────────────────────────────────────
function showWinScreen(rankings) {
  Animations.confettiAnimation();

  const titleEl    = document.getElementById('win-title');
  const subtitleEl = document.getElementById('win-subtitle');
  const rankingsEl = document.getElementById('win-rankings');

  const winner = rankings[0].player;
  if (titleEl)    titleEl.textContent    = `${winner.token} ${winner.name} Wins! 🏆`;
  if (subtitleEl) subtitleEl.textContent = 'What an amazing game!';

  if (rankingsEl) {
    rankingsEl.innerHTML = '';

    const medals   = ['🥇', '🥈', '🥉', '4️⃣'];
    const praises  = [
      ['Champion! 🏆', 'Super Star! ⭐', 'Amazing! 🎉'],
      ['Great job! 👏', 'Well played! 🎮', 'Awesome! 🌟'],
      ['Good try! 💪', 'Nice effort! 😊', 'Keep playing! 🎲'],
      ['You tried! 🤗', 'Better luck next time! 🍀', 'Fun game! 🎈']
    ];

    rankings.forEach((r, i) => {
      const praise = praises[i][Math.floor(Math.random() * 3)];
      const row    = document.createElement('div');
      row.className = 'ranking-row';
      row.style.borderColor = r.player.color;
      row.innerHTML = `
        <div class="ranking-place">${medals[i] || `#${i + 1}`}</div>
        <div class="ranking-token">${r.player.token}</div>
        <div class="ranking-name">${escapeHtmlSimple(r.player.name)}</div>
        <div>
          <div class="ranking-score">🪙 ${r.score}</div>
          <div class="ranking-praise">${praise}</div>
        </div>
      `;
      rankingsEl.appendChild(row);
    });
  }

  showScreen('win-screen');
}

// ─── Top bar: toggles ────────────────────────────────────────────────────────
function toggleMute() {
  GameState.muted = !GameState.muted;
  const btn = document.getElementById('mute-btn');
  if (btn) btn.textContent = GameState.muted ? '🔇' : '🔊';
}

function toggleReduceMotion() {
  GameState.reduceMotion = !GameState.reduceMotion;
  document.body.classList.toggle('reduce-motion', GameState.reduceMotion);
  const btn = document.getElementById('motion-btn');
  if (btn) btn.textContent = GameState.reduceMotion ? '🚫' : '✨';
}

// ─── Utility ─────────────────────────────────────────────────────────────────
function escapeHtmlSimple(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ─── Auto-init on DOM ready ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);

// ─── Global export ────────────────────────────────────────────────────────────
window.Game = {
  GameState,
  init,
  startGame,
  startTurn,
  handleRoll,
  nextTurn,
  endGame
};

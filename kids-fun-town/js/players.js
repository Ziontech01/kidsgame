/* ============================================================
   js/players.js — Player data, rendering, and token movement
   ============================================================ */

'use strict';

// ─── Token Definitions ────────────────────────────────────────────────────────
const TOKENS = [
  { emoji: '🧸', name: 'Teddy'   },
  { emoji: '🐰', name: 'Bunny'   },
  { emoji: '🤖', name: 'Robot'   },
  { emoji: '🦄', name: 'Unicorn' },
  { emoji: '🐕', name: 'Puppy'   },
  { emoji: '🦖', name: 'Dino'    },
  { emoji: '🚗', name: 'Racer'   },
  { emoji: '👾', name: 'Alien'   }
];

// ─── Player Colors ────────────────────────────────────────────────────────────
const PLAYER_COLORS = ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b'];

// ─── Player Class ─────────────────────────────────────────────────────────────
class Player {
  /**
   * @param {object} opts
   * @param {number}  opts.id         - 0-indexed player ID
   * @param {string}  opts.name       - Display name
   * @param {number}  opts.tokenIdx   - Index into TOKENS array
   * @param {boolean} opts.isAI       - Whether controlled by AI
   */
  constructor({ id, name, tokenIdx, isAI = false }) {
    this.id         = id;
    this.name       = name;
    this.tokenIdx   = tokenIdx;
    this.token      = TOKENS[tokenIdx].emoji;
    this.tokenName  = TOKENS[tokenIdx].name;
    this.color      = PLAYER_COLORS[id];
    this.coins      = 20;           // Starting coins
    this.position   = 0;            // Tile index
    this.ownedTiles = [];           // Array of tile IDs this player owns
    this.isAI       = isAI;
    this.skipTurns  = 0;            // Turns to skip (Silly Bench)
    this.isActive   = false;        // Highlighted when it's their turn
  }
}

// ─── createPlayers() ─────────────────────────────────────────────────────────
/**
 * Creates an array of Player instances from setup form data.
 * @param {object} setupData
 * @param {number}   setupData.count     - Number of players (2-4)
 * @param {object[]} setupData.players   - Array of { name, tokenIdx, isAI }
 * @returns {Player[]}
 */
function createPlayers(setupData) {
  const players = [];
  for (let i = 0; i < setupData.count; i++) {
    const pd = setupData.players[i];
    players.push(new Player({
      id:       i,
      name:     pd.name  || `Player ${i + 1}`,
      tokenIdx: pd.tokenIdx,
      isAI:     pd.isAI || false
    }));
  }
  return players;
}

// ─── renderPlayerPanels() ─────────────────────────────────────────────────────
/**
 * Renders all player panels into the left and right side containers.
 * Players 0 and 2 go on the left, players 1 and 3 go on the right.
 * @param {Player[]} players
 */
function renderPlayerPanels(players) {
  const leftEl  = document.getElementById('player-panels-left');
  const rightEl = document.getElementById('player-panels-right');
  if (!leftEl || !rightEl) return;

  leftEl.innerHTML  = '';
  rightEl.innerHTML = '';

  players.forEach((player, idx) => {
    const panel = buildPlayerPanel(player);
    // Alternate: 0,2 → left; 1,3 → right
    if (idx % 2 === 0) {
      leftEl.appendChild(panel);
    } else {
      rightEl.appendChild(panel);
    }
  });
}

// ─── buildPlayerPanel() ──────────────────────────────────────────────────────
/**
 * Creates the DOM element for a single player panel.
 * @param {Player} player
 * @returns {HTMLElement}
 */
function buildPlayerPanel(player) {
  const panel = document.createElement('div');
  panel.className = 'player-panel';
  panel.id = `panel-${player.id}`;
  panel.style.setProperty('--player-color', player.color);
  panel.style.borderColor = player.isActive ? player.color : 'transparent';

  const aiBadge = player.isAI ? `<span class="panel-ai-badge">AI</span>` : '';

  panel.innerHTML = `
    <div class="panel-header">
      <div class="panel-token">${player.token}</div>
      <div class="panel-name">${escapeHtml(player.name)}</div>
      ${aiBadge}
    </div>
    <div class="panel-coins" id="panel-coins-${player.id}">🪙 ${player.coins}</div>
    <div class="panel-props-label">Properties</div>
    <div class="panel-props-list" id="panel-props-${player.id}"></div>
  `;

  return panel;
}

// ─── updatePlayerPanel() ─────────────────────────────────────────────────────
/**
 * Updates the coin count, owned properties, and active state of a player panel.
 * @param {Player} player
 * @param {object[]} gameTiles - The cloned tile state with ownedBy info
 */
function updatePlayerPanel(player, gameTiles) {
  const panel    = document.getElementById(`panel-${player.id}`);
  const coinsEl  = document.getElementById(`panel-coins-${player.id}`);
  const propsEl  = document.getElementById(`panel-props-${player.id}`);

  if (!panel || !coinsEl || !propsEl) return;

  // Update active state
  if (player.isActive) {
    panel.classList.add('active');
  } else {
    panel.classList.remove('active');
  }

  // Update coin display
  coinsEl.textContent = `🪙 ${player.coins}`;

  // Update owned properties
  propsEl.innerHTML = '';
  if (player.ownedTiles.length === 0) {
    propsEl.innerHTML = '<span style="color:#cbd5e1; font-size:0.65rem;">None yet</span>';
  } else {
    player.ownedTiles.forEach(tileId => {
      const tileData = Board.TILES[tileId];
      if (!tileData) return;
      const badge = document.createElement('div');
      badge.className = 'panel-prop-badge';
      badge.style.background = getGroupColor(tileData.group);
      badge.style.color = getTextColorForBg(tileData.group);
      badge.textContent = `${tileData.emoji} ${tileData.name}`;
      badge.title = `Cost: ${tileData.cost} | Rent: ${tileData.rent}`;
      propsEl.appendChild(badge);
    });
  }
}

// ─── getTokenElement() ───────────────────────────────────────────────────────
/**
 * Returns the DOM element for a player's token on the board.
 * @param {number} playerId
 * @returns {HTMLElement|null}
 */
function getTokenElement(playerId) {
  return document.getElementById(`token-p${playerId}`);
}

// ─── createTokenOnBoard() ────────────────────────────────────────────────────
/**
 * Creates and places a player's token on the board at tile 0.
 * @param {Player} player
 */
function createTokenOnBoard(player) {
  const container = document.getElementById('token-container');
  if (!container) return;

  // Remove any existing token for this player
  const existing = document.getElementById(`token-p${player.id}`);
  if (existing) existing.remove();

  const token = document.createElement('div');
  token.className   = 'player-token';
  token.id          = `token-p${player.id}`;
  token.textContent = player.token;
  token.style.background   = player.color;
  token.style.border        = `2.5px solid #fff`;

  // Position at tile 0, offset slightly per player to avoid overlap
  const offset = getTokenOffset(player.id);
  const pos = Board.getTileCenter(0);
  token.style.left = `${pos.x + offset.x}px`;
  token.style.top  = `${pos.y + offset.y}px`;

  container.appendChild(token);
}

// ─── positionTokenOnTile() ───────────────────────────────────────────────────
/**
 * Instantly snaps a player token to the center of a given tile.
 * @param {Player} player
 * @param {number} tileId
 */
function positionTokenOnTile(player, tileId) {
  const token = getTokenElement(player.id);
  if (!token) return;

  const pos    = Board.getTileCenter(tileId);
  const offset = getTokenOffset(player.id);
  token.style.left = `${pos.x + offset.x}px`;
  token.style.top  = `${pos.y + offset.y}px`;
}

// ─── moveTokenAnimated() ─────────────────────────────────────────────────────
/**
 * Moves a token step-by-step from its current position, one tile at a time.
 * Awards +2 coins for passing/landing on Start (tile 0).
 * @param {Player}   player      - The player to move
 * @param {number}   steps       - Number of steps (dice roll)
 * @param {Function} onPassStart - Callback when player passes tile 0
 * @returns {Promise<void>}
 */
async function moveTokenAnimated(player, steps, onPassStart) {
  const totalTiles = Board.TILES.length; // 20

  for (let i = 0; i < steps; i++) {
    const nextPos = (player.position + 1) % totalTiles;

    // Check if we pass/land on Start
    if (nextPos === 0 && player.position !== 0) {
      if (typeof onPassStart === 'function') {
        await onPassStart(player);
      }
    }

    player.position = nextPos;
    await Animations.tokenHopTo(player, nextPos);
  }
}

// ─── showHelperBonus() ───────────────────────────────────────────────────────
/**
 * Shows a floating "+2 Helper Coins!" message near the player's panel.
 * @param {Player} player
 */
function showHelperBonus(player) {
  Animations.showMessage(`🤝 ${player.name} gets a Helper Bonus! +2 coins!`, 2500);
}

// ─── Utility: getTokenOffset() ───────────────────────────────────────────────
/**
 * Returns a small positional offset per player so tokens on the same
 * tile don't completely overlap.
 * @param {number} playerId
 * @returns {{ x: number, y: number }}
 */
function getTokenOffset(playerId) {
  const offsets = [
    { x: -9, y: -9 },
    { x:  9, y: -9 },
    { x: -9, y:  9 },
    { x:  9, y:  9 }
  ];
  return offsets[playerId] || { x: 0, y: 0 };
}

// ─── Utility: getGroupColor() ────────────────────────────────────────────────
/**
 * Maps a property group name to its CSS hex color.
 * @param {string} group
 * @returns {string}
 */
function getGroupColor(group) {
  const map = {
    orange: '#fb923c',
    blue:   '#60a5fa',
    green:  '#4ade80',
    purple: '#c084fc',
    pink:   '#f472b6',
    yellow: '#fbbf24',
    gold:   '#f59e0b',
    gray:   '#94a3b8'
  };
  return map[group] || '#e2e8f0';
}

// ─── Utility: getTextColorForBg() ────────────────────────────────────────────
function getTextColorForBg(group) {
  // Darker groups get white text; lighter groups get dark
  const dark = ['purple'];
  return dark.includes(group) ? '#ffffff' : '#1e293b';
}

// ─── Utility: escapeHtml() ───────────────────────────────────────────────────
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ─── Export ───────────────────────────────────────────────────────────────────
window.Players = {
  TOKENS,
  PLAYER_COLORS,
  Player,
  createPlayers,
  renderPlayerPanels,
  updatePlayerPanel,
  getTokenElement,
  createTokenOnBoard,
  positionTokenOnTile,
  moveTokenAnimated,
  showHelperBonus,
  getTokenOffset,
  getGroupColor
};

/* ============================================================
   js/board.js — Board data and rendering
   Defines all 20 tiles, grid positions, and renders the board
   ============================================================ */

'use strict';

// ─── Tile Data ────────────────────────────────────────────────────────────────
// Each tile: { id, name, type, emoji, color, group, cost, rent, action, passBonus }
const TILES = [
  { id:  0, name: 'Start!',         type: 'corner',   emoji: '🏁', color: 'green',  group: 'green',  passBonus: 2 },
  { id:  1, name: 'Candy Corner',   type: 'property', emoji: '🍬', color: 'orange', group: 'orange', cost: 4, rent: 1 },
  { id:  2, name: 'Treasure Chest', type: 'special',  emoji: '📦', color: 'yellow', group: 'yellow', action: 'treasure' },
  { id:  3, name: 'Toy Shop',       type: 'property', emoji: '🎁', color: 'orange', group: 'orange', cost: 5, rent: 1 },
  { id:  4, name: 'Pet Palace',     type: 'property', emoji: '🐾', color: 'blue',   group: 'blue',   cost: 6, rent: 2 },
  { id:  5, name: 'Snack Break',    type: 'corner',   emoji: '🍎', color: 'pink',   group: 'pink' },
  { id:  6, name: 'Bonus Coins',    type: 'special',  emoji: '💰', color: 'yellow', group: 'yellow', action: 'bonus' },
  { id:  7, name: 'Dino Land',      type: 'property', emoji: '🦖', color: 'green',  group: 'green',  cost: 6, rent: 2 },
  { id:  8, name: 'Surprise Card',  type: 'special',  emoji: '🎴', color: 'purple', group: 'purple', action: 'card' },
  { id:  9, name: 'Water Park',     type: 'property', emoji: '🌊', color: 'blue',   group: 'blue',   cost: 7, rent: 2 },
  { id: 10, name: 'Free Coins!',    type: 'corner',   emoji: '⭐', color: 'gold',   group: 'gold',   passBonus: 2 },
  { id: 11, name: 'Lucky Spin',     type: 'special',  emoji: '🎡', color: 'pink',   group: 'pink',   action: 'spin' },
  { id: 12, name: 'Bubble Café',    type: 'property', emoji: '🧁', color: 'green',  group: 'green',  cost: 7, rent: 2 },
  { id: 13, name: 'Rocket World',   type: 'property', emoji: '🚀', color: 'purple', group: 'purple', cost: 8, rent: 3 },
  { id: 14, name: 'Magic Castle',   type: 'property', emoji: '🏰', color: 'pink',   group: 'pink',   cost: 8, rent: 3 },
  { id: 15, name: 'Silly Bench',    type: 'corner',   emoji: '😴', color: 'gray',   group: 'gray' },
  { id: 16, name: 'Move Again!',    type: 'special',  emoji: '⚡', color: 'yellow', group: 'yellow', action: 'moveagain' },
  { id: 17, name: 'Happy Helper',   type: 'special',  emoji: '🤝', color: 'green',  group: 'green',  action: 'helper' },
  { id: 18, name: 'Ice Cream Stop', type: 'property', emoji: '🍦', color: 'pink',   group: 'pink',   cost: 5, rent: 1 },
  { id: 19, name: 'Safari Park',    type: 'property', emoji: '🦁', color: 'purple', group: 'purple', cost: 9, rent: 3 }
];

// ─── Grid Positions ───────────────────────────────────────────────────────────
// [col, row] in 1-indexed CSS grid (column, row)
const GRID_POS = [
  [1, 6], // 0  - Start
  [2, 6], // 1  - Candy Corner
  [3, 6], // 2  - Treasure Chest
  [4, 6], // 3  - Toy Shop
  [5, 6], // 4  - Pet Palace
  [6, 6], // 5  - Snack Break
  [6, 5], // 6  - Bonus Coins
  [6, 4], // 7  - Dino Land
  [6, 3], // 8  - Surprise Card
  [6, 2], // 9  - Water Park
  [6, 1], // 10 - Free Coins!
  [5, 1], // 11 - Lucky Spin
  [4, 1], // 12 - Bubble Café
  [3, 1], // 13 - Rocket World
  [2, 1], // 14 - Magic Castle
  [1, 1], // 15 - Silly Bench
  [1, 2], // 16 - Move Again!
  [1, 3], // 17 - Happy Helper
  [1, 4], // 18 - Ice Cream Stop
  [1, 5]  // 19 - Safari Park
];

// ─── renderBoard() ────────────────────────────────────────────────────────────
/**
 * Creates all 20 tile divs and injects the center panel into #game-board.
 * Tiles are positioned using inline grid-column / grid-row styles.
 */
function renderBoard() {
  const board = document.getElementById('game-board');
  if (!board) return;

  // Remove any existing tiles (not center / token container)
  const existingTiles = board.querySelectorAll('.tile');
  existingTiles.forEach(t => t.remove());

  TILES.forEach((tile, idx) => {
    const [col, row] = GRID_POS[idx];
    const el = document.createElement('div');

    // Base classes
    el.className = `tile tile-${tile.type} tile-group-${tile.group}`;
    el.id = `tile-${tile.id}`;

    // Data attributes
    el.dataset.tileId   = tile.id;
    el.dataset.tileType = tile.type;
    el.dataset.group    = tile.group;
    if (tile.cost)   el.dataset.cost   = tile.cost;
    if (tile.rent)   el.dataset.rent   = tile.rent;
    if (tile.action) el.dataset.action = tile.action;

    // CSS grid placement
    el.style.gridColumn = col;
    el.style.gridRow    = row;

    // ── Inner HTML ──
    // Color band (only for property tiles)
    let colorBand = '';
    if (tile.type === 'property') {
      colorBand = `<div class="tile-color-band"></div>`;
    }

    // Cost badge
    let costBadge = '';
    if (tile.type === 'property') {
      costBadge = `<div class="tile-cost">💰${tile.cost} / 🏷️${tile.rent}</div>`;
    }

    el.innerHTML = `
      ${colorBand}
      <div class="tile-inner">
        <div class="tile-emoji">${tile.emoji}</div>
        <div class="tile-name">${tile.name}</div>
        ${costBadge}
      </div>
    `;

    board.appendChild(el);
  });

  // Make sure the center div and token container are still in the board
  // (they are in the HTML, but we re-append to ensure correct z-order)
  const center = document.getElementById('board-center');
  const tokenContainer = document.getElementById('token-container');
  if (center) board.appendChild(center);
  if (tokenContainer) board.appendChild(tokenContainer);
}

// ─── updateTileOwner() ────────────────────────────────────────────────────────
/**
 * Adds (or updates) an ownership badge on a tile showing player color + token.
 * @param {number} tileId     - The tile index 0-19
 * @param {number} playerIdx  - The player index (0-3), or null to remove
 * @param {string} playerColor - CSS hex color
 * @param {string} tokenEmoji  - The player's token emoji
 */
function updateTileOwner(tileId, playerIdx, playerColor, tokenEmoji) {
  const tile = document.getElementById(`tile-${tileId}`);
  if (!tile) return;

  // Remove existing badge
  const existing = tile.querySelector('.owner-badge');
  if (existing) existing.remove();

  if (playerIdx === null || playerIdx === undefined) return;

  const badge = document.createElement('div');
  badge.className = 'owner-badge';
  badge.style.background = playerColor;
  badge.title = `Owned by Player ${playerIdx + 1}`;
  badge.textContent = tokenEmoji;

  tile.appendChild(badge);
}

// ─── highlightTile() ─────────────────────────────────────────────────────────
/**
 * Adds the glowing animation class to a tile.
 * @param {number} tileId
 */
function highlightTile(tileId) {
  const tile = document.getElementById(`tile-${tileId}`);
  if (!tile) return;
  tile.classList.add('tile-glow');
}

// ─── clearHighlight() ────────────────────────────────────────────────────────
/**
 * Removes the glowing animation class from a tile.
 * @param {number} tileId
 */
function clearHighlight(tileId) {
  const tile = document.getElementById(`tile-${tileId}`);
  if (!tile) return;
  tile.classList.remove('tile-glow');
}

// ─── getTileCenter() ─────────────────────────────────────────────────────────
/**
 * Returns the center x,y coordinates of a tile relative to the game board.
 * Used by players.js / animations.js for token positioning.
 * @param {number} tileId
 * @returns {{ x: number, y: number }}
 */
function getTileCenter(tileId) {
  const board = document.getElementById('game-board');
  const tile  = document.getElementById(`tile-${tileId}`);
  if (!board || !tile) return { x: 0, y: 0 };

  const boardRect = board.getBoundingClientRect();
  const tileRect  = tile.getBoundingClientRect();

  return {
    x: tileRect.left - boardRect.left + tileRect.width  / 2,
    y: tileRect.top  - boardRect.top  + tileRect.height / 2
  };
}

// Export to global scope so other modules can access
window.Board = {
  TILES,
  GRID_POS,
  renderBoard,
  updateTileOwner,
  highlightTile,
  clearHighlight,
  getTileCenter
};

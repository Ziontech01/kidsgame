/* ============================================================
   js/animations.js — All animation helpers
   ============================================================ */

'use strict';

// ─── delay() ─────────────────────────────────────────────────────────────────
/**
 * Promise-based sleep / pause.
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise<void>}
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ─── rollDiceAnimation() ─────────────────────────────────────────────────────
/**
 * Shakes the dice display for ~600ms then shows the final number.
 * @param {number} resultNumber - The dice result (1–6)
 * @returns {Promise<void>}
 */
async function rollDiceAnimation(resultNumber) {
  const diceEl = document.getElementById('dice-display');
  if (!diceEl) return;

  // Dice face emojis for flavour
  const diceFaces = ['🎲', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

  // Rapid random numbers for 600ms
  diceEl.classList.add('shaking');
  const interval = setInterval(() => {
    const rnd = Math.floor(Math.random() * 6) + 1;
    diceEl.textContent = rnd;
  }, 80);

  await delay(640);
  clearInterval(interval);
  diceEl.classList.remove('shaking');
  diceEl.textContent = resultNumber;
}

// ─── tokenHopTo() ────────────────────────────────────────────────────────────
/**
 * Moves a player's token element to the target tile with a hop animation.
 * Uses CSS transitions + a brief 'hopping' class for the arc effect.
 *
 * @param {object} player   - Player instance (needs player.id)
 * @param {number} toTileId - Target tile ID
 * @returns {Promise<void>}
 */
async function tokenHopTo(player, toTileId) {
  const token = document.getElementById(`token-p${player.id}`);
  if (!token) return;

  const board = document.getElementById('game-board');
  if (!board) return;

  const toPos  = Board.getTileCenter(toTileId);
  const offset = Players.getTokenOffset(player.id);

  // Temporarily suppress idle bounce so the hop animation plays cleanly
  token.style.animation = 'none';
  token.classList.add('hopping');

  // Set the destination
  token.style.left = `${toPos.x + offset.x}px`;
  token.style.top  = `${toPos.y + offset.y}px`;

  // Wait for the hop animation + CSS transition to complete
  await delay(360);

  token.classList.remove('hopping');
  // Restore idle bounce
  token.style.animation = '';
}

// ─── coinBurstAnimation() ────────────────────────────────────────────────────
/**
 * Creates coin elements that fly outward from a tile center and fade out.
 * @param {number} tileId - Tile to burst from
 * @param {number} amount - Number of coins to show (clamped 1–5)
 */
function coinBurstAnimation(tileId, amount) {
  const board = document.getElementById('game-board');
  const tile  = document.getElementById(`tile-${tileId}`);
  if (!board || !tile) return;

  const boardRect = board.getBoundingClientRect();
  const tileRect  = tile.getBoundingClientRect();
  const cx = tileRect.left - boardRect.left + tileRect.width  / 2;
  const cy = tileRect.top  - boardRect.top  + tileRect.height / 2;

  const count = Math.min(Math.max(1, Math.abs(amount)), 5);

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'coin-burst';
    el.textContent = '🪙';

    const angle  = (360 / count) * i - 90; // evenly spread
    const rad    = (angle * Math.PI) / 180;
    const dist   = 45 + Math.random() * 20;
    const tx     = Math.cos(rad) * dist;
    const ty     = Math.sin(rad) * dist;

    el.style.setProperty('--tx', `${tx}px`);
    el.style.setProperty('--ty', `${ty}px`);
    el.style.left = `${cx}px`;
    el.style.top  = `${cy}px`;
    el.style.position = 'absolute';
    el.style.animationDelay = `${i * 60}ms`;

    // Append to the token container (which overlays the board)
    const container = document.getElementById('token-container');
    if (container) container.appendChild(el);

    // Remove after animation
    setTimeout(() => el.remove(), 1200);
  }
}

// ─── sparkleAnimation() ──────────────────────────────────────────────────────
/**
 * Creates sparkle star elements around a tile.
 * @param {number} tileId
 */
function sparkleAnimation(tileId) {
  const board = document.getElementById('game-board');
  const tile  = document.getElementById(`tile-${tileId}`);
  if (!board || !tile) return;

  const boardRect = board.getBoundingClientRect();
  const tileRect  = tile.getBoundingClientRect();
  const cx = tileRect.left - boardRect.left + tileRect.width  / 2;
  const cy = tileRect.top  - boardRect.top  + tileRect.height / 2;

  const stars = ['✨', '⭐', '🌟', '💫'];
  const count = 5;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'sparkle-el';
    el.textContent = stars[i % stars.length];

    const angle = (360 / count) * i;
    const rad   = (angle * Math.PI) / 180;
    const dist  = 30 + Math.random() * 20;

    el.style.left = `${cx + Math.cos(rad) * dist}px`;
    el.style.top  = `${cy + Math.sin(rad) * dist}px`;
    el.style.position = 'absolute';
    el.style.animationDelay = `${i * 80}ms`;

    const container = document.getElementById('token-container');
    if (container) container.appendChild(el);

    setTimeout(() => el.remove(), 1200);
  }
}

// ─── tileGlowAnimation() ─────────────────────────────────────────────────────
/**
 * Adds a glowing class to a tile then removes it after the animation completes.
 * @param {number} tileId
 * @returns {Promise<void>}
 */
async function tileGlowAnimation(tileId) {
  Board.highlightTile(tileId);
  await delay(1800); // ~3 pulses at 600ms each
  Board.clearHighlight(tileId);
}

// ─── confettiAnimation() ─────────────────────────────────────────────────────
/**
 * Creates 50 confetti divs that fall from the top of the screen.
 */
function confettiAnimation() {
  const container = document.getElementById('confetti-container');
  if (!container) return;

  container.innerHTML = ''; // Clear any previous

  const colors = ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#a855f7', '#ec4899', '#06b6d4'];
  const count  = 60;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.background    = colors[Math.floor(Math.random() * colors.length)];
    el.style.left          = `${Math.random() * 100}%`;
    el.style.setProperty('--duration', `${2 + Math.random() * 2.5}s`);
    el.style.setProperty('--delay',    `${Math.random() * 1.5}s`);
    el.style.width         = `${6 + Math.random() * 8}px`;
    el.style.height        = `${6 + Math.random() * 8}px`;
    el.style.borderRadius  = Math.random() > 0.5 ? '50%' : '2px';
    container.appendChild(el);
  }

  // Clean up after animations finish
  setTimeout(() => {
    container.innerHTML = '';
  }, 5000);
}

// ─── showMessage() ────────────────────────────────────────────────────────────
/**
 * Shows a message in the #message-bar with a fade in/out effect.
 * @param {string} text       - Message to display
 * @param {number} [duration] - How long to show (ms). Default: 2500
 * @returns {Promise<void>}
 */
async function showMessage(text, duration = 2500) {
  const bar = document.getElementById('message-bar');
  if (!bar) return;

  bar.style.opacity = '0';
  await delay(150);
  bar.textContent   = text;
  bar.style.opacity = '1';
  await delay(duration);
  bar.style.opacity = '0.7';
}

// ─── purchaseAnimation() ─────────────────────────────────────────────────────
/**
 * Flashes a tile with a purchase animation and triggers coin burst.
 * @param {number} tileId       - Tile that was purchased
 * @param {string} playerColor  - Buyer's color (hex)
 * @returns {Promise<void>}
 */
async function purchaseAnimation(tileId, playerColor) {
  const tile = document.getElementById(`tile-${tileId}`);
  if (!tile) return;

  // Flash the tile
  tile.classList.add('purchased-flash');
  tile.style.boxShadow = `0 0 0 4px ${playerColor}`;
  await delay(600);
  tile.classList.remove('purchased-flash');
  tile.style.boxShadow = '';

  // Sparkles
  sparkleAnimation(tileId);
}

// ─── Export ───────────────────────────────────────────────────────────────────
window.Animations = {
  delay,
  rollDiceAnimation,
  tokenHopTo,
  coinBurstAnimation,
  sparkleAnimation,
  tileGlowAnimation,
  confettiAnimation,
  showMessage,
  purchaseAnimation
};

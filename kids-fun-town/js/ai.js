/* ============================================================
   js/ai.js — AI player decision logic
   ============================================================ */

'use strict';

// ─── Difficulty Settings ──────────────────────────────────────────────────────
const AI_DIFFICULTY = {
  EASY:   'easy',
  NORMAL: 'normal',
  SMART:  'smart'
};

// Assign difficulty to each AI player by their index (can be customized)
const AI_DIFFICULTY_BY_PLAYER = {
  0: AI_DIFFICULTY.EASY,
  1: AI_DIFFICULTY.NORMAL,
  2: AI_DIFFICULTY.SMART,
  3: AI_DIFFICULTY.NORMAL
};

// ─── shouldBuy() ─────────────────────────────────────────────────────────────
/**
 * Decides whether an AI player should buy a property.
 *
 * @param {object}   player      - The AI Player instance
 * @param {object}   tile        - The tile data (from Board.TILES)
 * @param {object[]} gameTiles   - Cloned game tile state with ownedBy info
 * @param {string}   difficulty  - 'easy' | 'normal' | 'smart'
 * @returns {boolean}
 */
function shouldBuy(player, tile, gameTiles, difficulty) {
  if (!tile || tile.type !== 'property') return false;
  if (player.coins < tile.cost) return false;

  const diff = difficulty || AI_DIFFICULTY_BY_PLAYER[player.id] || AI_DIFFICULTY.NORMAL;

  switch (diff) {
    case AI_DIFFICULTY.EASY:
      // Easy: only buys cheap properties and keeps a big safety buffer
      return tile.cost <= 5 && player.coins >= tile.cost + 2;

    case AI_DIFFICULTY.NORMAL:
      // Normal: buys if can afford with a 2-coin safety margin
      return player.coins >= tile.cost + 2;

    case AI_DIFFICULTY.SMART: {
      // Smart: buys if affordable (1 coin buffer) AND the group isn't
      // already dominated by other players (fewer than 2 of this group owned by opponents)
      if (player.coins < tile.cost + 1) return false;

      const ownedByOthers = gameTiles.filter(t =>
        t.group === tile.group &&
        t.ownedBy !== null &&
        t.ownedBy !== player.id
      ).length;

      return ownedByOthers < 2;
    }

    default:
      return player.coins >= tile.cost + 2;
  }
}

// ─── aiTakeTurn() ────────────────────────────────────────────────────────────
/**
 * Simulates the AI deciding its turn. Resolves after a short delay so the
 * player can see the AI "thinking". The actual roll/resolve is handled by
 * game.js — this function just returns the AI's buy decision when prompted.
 *
 * @param {object}   player      - The AI Player instance
 * @param {object[]} allPlayers  - All Player instances
 * @param {object[]} gameTiles   - Cloned tile state
 * @returns {Promise<{ shouldRoll: boolean }>}
 */
function aiTakeTurn(player, allPlayers, gameTiles) {
  return new Promise(resolve => {
    // Simulate thinking delay
    setTimeout(() => {
      resolve({ shouldRoll: true });
    }, 800);
  });
}

/**
 * AI buy decision wrapper. Called by game.js when an AI lands on an unowned property.
 * @param {object}   player     - AI player
 * @param {object}   tile       - Tile data
 * @param {object[]} gameTiles  - Game tile state
 * @returns {Promise<boolean>}  - true = buy, false = skip
 */
function aiBuyDecision(player, tile, gameTiles) {
  return new Promise(resolve => {
    const diff    = AI_DIFFICULTY_BY_PLAYER[player.id] || AI_DIFFICULTY.NORMAL;
    const decision = shouldBuy(player, tile, gameTiles, diff);
    // Short "thinking" pause so it feels natural
    setTimeout(() => resolve(decision), 600);
  });
}

// ─── Export ───────────────────────────────────────────────────────────────────
window.AI = {
  AI_DIFFICULTY,
  AI_DIFFICULTY_BY_PLAYER,
  shouldBuy,
  aiTakeTurn,
  aiBuyDecision
};

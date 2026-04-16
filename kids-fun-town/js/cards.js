/* ============================================================
   js/cards.js — Surprise cards and Lucky Spin definitions
   ============================================================ */

'use strict';

// ─── Card Definitions ─────────────────────────────────────────────────────────
/**
 * Each card:
 *   text    - Display text shown in popup
 *   effect  - Action type: 'coins' | 'move' | 'rollagain' | 'skip' | 'allcoins' | 'nothing'
 *   value   - Numeric value for the effect (positive = gain, negative = lose)
 */
const CARDS = [
  {
    id: 0,
    text: 'You found hidden treasure! 🌟',
    effect: 'coins',
    value: 3
  },
  {
    id: 1,
    text: 'You helped clean the park! 🌿',
    effect: 'coins',
    value: 2
  },
  {
    id: 2,
    text: 'You won a drawing contest! 🎨',
    effect: 'move',
    value: 2
  },
  {
    id: 3,
    text: 'You found a shortcut! 🏃',
    effect: 'rollagain',
    value: 0
  },
  {
    id: 4,
    text: 'A friend shared their snack! 🍪',
    effect: 'coins',
    value: 1
  },
  {
    id: 5,
    text: 'You slipped on a banana peel! 🍌',
    effect: 'skip',
    value: 1
  },
  {
    id: 6,
    text: 'You bought too many sweets! 🍭',
    effect: 'coins',
    value: -1
  },
  {
    id: 7,
    text: 'You helped a lost puppy! 🐕',
    effect: 'coins',
    value: 2
  },
  {
    id: 8,
    text: 'You lost your piggy bank! 🐷',
    effect: 'coins',
    value: -1   // minimum 0 enforced in apply
  },
  {
    id: 9,
    text: 'Magic rainbow appeared! 🌈',
    effect: 'coins',
    value: 3
  },
  {
    id: 10,
    text: 'You did a backflip! 🤸',
    effect: 'move',
    value: -1
  },
  {
    id: 11,
    text: 'Everyone gives you a coin! 👫',
    effect: 'allcoins',
    value: 1   // +1 per other player
  },
  {
    id: 12,
    text: 'Ice cream melted! 🍦',
    effect: 'coins',
    value: -1
  },
  {
    id: 13,
    text: 'You found a star! ⭐',
    effect: 'move',
    value: 1
  },
  {
    id: 14,
    text: 'Balloon flew away! 🎈',
    effect: 'nothing',
    value: 0
  }
];

// ─── Lucky Spin Outcomes ──────────────────────────────────────────────────────
/**
 * Each spin outcome:
 *   text   - Display text
 *   effect - Action type
 *   value  - Numeric value
 */
const LUCKY_SPIN_OUTCOMES = [
  { text: '+3 coins! Lucky you! 🍀',              effect: 'coins',     value:  3 },
  { text: '+1 coin! Small win! 💰',               effect: 'coins',     value:  1 },
  { text: 'Move forward 2 spaces! 🏃',            effect: 'move',      value:  2 },
  { text: 'Roll again! ⚡',                       effect: 'rollagain', value:  0 },
  { text: 'Oops! Lose 1 coin! 😬',               effect: 'coins',     value: -1 },
  { text: 'Swap coins with richest player! 🔄',   effect: 'swaprich',  value:  0 }
];

// ─── drawCard() ───────────────────────────────────────────────────────────────
/**
 * Returns a random card from the CARDS array.
 * @returns {object} A card definition
 */
function drawCard() {
  const idx = Math.floor(Math.random() * CARDS.length);
  return CARDS[idx];
}

// ─── applySurpriseCard() ──────────────────────────────────────────────────────
/**
 * Applies a surprise card effect to the player.
 * Returns a result object with a message string and extra info.
 *
 * @param {object} card       - The card drawn
 * @param {object} player     - The active player (Player instance)
 * @param {object[]} allPlayers - All players
 * @returns {{ message: string, effect: string, value: number, extraMoveSteps?: number, rollAgain?: boolean }}
 */
function applySurpriseCard(card, player, allPlayers) {
  const result = { message: card.text, effect: card.effect, value: card.value };

  switch (card.effect) {
    case 'coins': {
      const change = card.value;
      player.coins = Math.max(0, player.coins + change);
      if (change > 0) {
        result.message = `${card.text} +${change} coins!`;
      } else if (change < 0) {
        result.message = `${card.text} ${change} coin!`;
      }
      break;
    }

    case 'move': {
      // Return extra steps — game.js handles actual movement
      result.extraMoveSteps = card.value;
      const dir = card.value > 0 ? `Forward ${card.value}` : `Back ${Math.abs(card.value)}`;
      result.message = `${card.text} ${dir} space${Math.abs(card.value) !== 1 ? 's' : ''}!`;
      break;
    }

    case 'rollagain': {
      result.rollAgain = true;
      result.message = `${card.text} Roll again!`;
      break;
    }

    case 'skip': {
      player.skipTurns = (player.skipTurns || 0) + card.value;
      result.message = `${card.text} Miss ${card.value} turn${card.value !== 1 ? 's' : ''}!`;
      break;
    }

    case 'allcoins': {
      // Each other player gives 1 coin
      const others = allPlayers.filter(p => p.id !== player.id);
      let totalGained = 0;
      others.forEach(other => {
        const give = Math.min(1, other.coins); // can't give what you don't have
        other.coins = Math.max(0, other.coins - give);
        totalGained += give;
      });
      player.coins += totalGained;
      result.message = `${card.text} +${totalGained} coins!`;
      break;
    }

    case 'nothing': {
      result.message = `${card.text} Nothing happened!`;
      break;
    }

    default:
      break;
  }

  return result;
}

// ─── applyLuckySpin() ────────────────────────────────────────────────────────
/**
 * Picks a random Lucky Spin outcome and applies it to the player.
 * Returns a result object similar to applySurpriseCard.
 *
 * @param {object}   player     - Active Player instance
 * @param {object[]} allPlayers - All Player instances
 * @returns {{ outcome: object, message: string, effect: string, extraMoveSteps?: number, rollAgain?: boolean }}
 */
function applyLuckySpin(player, allPlayers) {
  const idx     = Math.floor(Math.random() * LUCKY_SPIN_OUTCOMES.length);
  const outcome = LUCKY_SPIN_OUTCOMES[idx];
  const result  = { outcome, message: outcome.text, effect: outcome.effect, value: outcome.value };

  switch (outcome.effect) {
    case 'coins': {
      player.coins = Math.max(0, player.coins + outcome.value);
      break;
    }

    case 'move': {
      result.extraMoveSteps = outcome.value;
      break;
    }

    case 'rollagain': {
      result.rollAgain = true;
      break;
    }

    case 'swaprich': {
      // Find the richest other player
      const others  = allPlayers.filter(p => p.id !== player.id);
      const richest = others.reduce((max, p) => p.coins > max.coins ? p : max, others[0]);
      if (richest && richest.coins !== player.coins) {
        const myCoins    = player.coins;
        player.coins     = richest.coins;
        richest.coins    = myCoins;
        result.message   = `${outcome.text} Swapped with ${richest.name}!`;
        result.swappedWith = richest;
      } else {
        result.message = `${outcome.text} No swap needed!`;
      }
      break;
    }

    default:
      break;
  }

  return result;
}

// ─── Export ───────────────────────────────────────────────────────────────────
window.Cards = {
  CARDS,
  LUCKY_SPIN_OUTCOMES,
  drawCard,
  applySurpriseCard,
  applyLuckySpin
};

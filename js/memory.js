// ── Memory Flip-Card Game Engine ─────────────────────────────
// Categories: animals, numbers, flags, bible
// Find matching pairs by flipping cards!

(function () {
  'use strict';

  const CATEGORIES = {
    animals: {
      name: '🐾 Animal Pairs',
      emoji: '🐾',
      color: '#22c55e',
      description: 'Match each animal with its twin!',
      cards: [
        { id: 'cat',       display: '🐱', label: 'Cat' },
        { id: 'dog',       display: '🐶', label: 'Dog' },
        { id: 'elephant',  display: '🐘', label: 'Elephant' },
        { id: 'lion',      display: '🦁', label: 'Lion' },
        { id: 'rabbit',    display: '🐰', label: 'Rabbit' },
        { id: 'penguin',   display: '🐧', label: 'Penguin' },
        { id: 'monkey',    display: '🐵', label: 'Monkey' },
        { id: 'tiger',     display: '🐯', label: 'Tiger' },
        { id: 'giraffe',   display: '🦒', label: 'Giraffe' },
        { id: 'owl',       display: '🦉', label: 'Owl' },
        { id: 'frog',      display: '🐸', label: 'Frog' },
        { id: 'panda',     display: '🐼', label: 'Panda' },
      ]
    },
    numbers: {
      name: '🔢 Number Words',
      emoji: '🔢',
      color: '#667eea',
      description: 'Match each number with its word!',
      cards: [
        { id: '1',  display: '1',      matchDisplay: 'One',    label: '1' },
        { id: '2',  display: '2',      matchDisplay: 'Two',    label: '2' },
        { id: '3',  display: '3',      matchDisplay: 'Three',  label: '3' },
        { id: '4',  display: '4',      matchDisplay: 'Four',   label: '4' },
        { id: '5',  display: '5',      matchDisplay: 'Five',   label: '5' },
        { id: '6',  display: '6',      matchDisplay: 'Six',    label: '6' },
        { id: '7',  display: '7',      matchDisplay: 'Seven',  label: '7' },
        { id: '8',  display: '8',      matchDisplay: 'Eight',  label: '8' },
        { id: '9',  display: '9',      matchDisplay: 'Nine',   label: '9' },
        { id: '10', display: '10',     matchDisplay: 'Ten',    label: '10' },
        { id: '11', display: '11',     matchDisplay: 'Eleven', label: '11' },
        { id: '12', display: '12',     matchDisplay: 'Twelve', label: '12' },
      ]
    },
    flags: {
      name: '🌍 Flags & Countries',
      emoji: '🌍',
      color: '#f59e0b',
      description: 'Match each flag with its country!',
      cards: [
        { id: 'gb',  display: '🇬🇧', matchDisplay: 'UK',           label: 'United Kingdom' },
        { id: 'us',  display: '🇺🇸', matchDisplay: 'USA',          label: 'United States' },
        { id: 'fr',  display: '🇫🇷', matchDisplay: 'France',       label: 'France' },
        { id: 'de',  display: '🇩🇪', matchDisplay: 'Germany',      label: 'Germany' },
        { id: 'es',  display: '🇪🇸', matchDisplay: 'Spain',        label: 'Spain' },
        { id: 'it',  display: '🇮🇹', matchDisplay: 'Italy',        label: 'Italy' },
        { id: 'ng',  display: '🇳🇬', matchDisplay: 'Nigeria',      label: 'Nigeria' },
        { id: 'jp',  display: '🇯🇵', matchDisplay: 'Japan',        label: 'Japan' },
        { id: 'br',  display: '🇧🇷', matchDisplay: 'Brazil',       label: 'Brazil' },
        { id: 'cn',  display: '🇨🇳', matchDisplay: 'China',        label: 'China' },
        { id: 'au',  display: '🇦🇺', matchDisplay: 'Australia',    label: 'Australia' },
        { id: 'za',  display: '🇿🇦', matchDisplay: 'South Africa', label: 'South Africa' },
      ]
    },
    bible: {
      name: '✝️ Bible Characters',
      emoji: '✝️',
      color: '#a855f7',
      description: 'Match each Bible character with their famous story!',
      cards: [
        { id: 'noah',    display: '🚢 Noah',    matchDisplay: '40 Days of Rain',      label: 'Noah' },
        { id: 'david',   display: '🗿 David',   matchDisplay: 'Defeated Goliath',     label: 'David' },
        { id: 'moses',   display: '🌊 Moses',   matchDisplay: 'Parted the Red Sea',   label: 'Moses' },
        { id: 'jonah',   display: '🐋 Jonah',   matchDisplay: 'Swallowed by a Whale', label: 'Jonah' },
        { id: 'daniel',  display: '🦁 Daniel',  matchDisplay: 'Lions\' Den',          label: 'Daniel' },
        { id: 'esther',  display: '👑 Esther',  matchDisplay: 'Saved Her People',     label: 'Esther' },
        { id: 'joseph',  display: '🌈 Joseph',  matchDisplay: 'Coat of Many Colours', label: 'Joseph' },
        { id: 'samson',  display: '💪 Samson',  matchDisplay: 'Long Hair = Strength', label: 'Samson' },
        { id: 'ruth',    display: '🌾 Ruth',    matchDisplay: 'Loyal to Naomi',       label: 'Ruth' },
        { id: 'solomon', display: '💎 Solomon', matchDisplay: 'Wisest King',          label: 'Solomon' },
        { id: 'elijah',  display: '🔥 Elijah',  matchDisplay: 'Fire from Heaven',     label: 'Elijah' },
        { id: 'mary',    display: '⭐ Mary',    matchDisplay: 'Mother of Jesus',       label: 'Mary' },
      ]
    }
  };

  const BOARD_SIZES = { easy: 8, medium: 12, hard: 16 };

  let currentCategory = null;
  let difficulty = 'medium';
  let cards = [];
  let flipped = [];
  let matched = new Set();
  let moves = 0;
  let startTime = null;
  let timerInterval = null;
  let lockBoard = false;

  // ── Init ─────────────────────────────────────────────────────
  function init() {
    renderMenuScreen();
    hideLoading();
  }

  function hideLoading() {
    const ov = document.getElementById('loading-overlay');
    if (ov) ov.classList.add('hidden');
  }

  // ── Menu ─────────────────────────────────────────────────────
  function renderMenuScreen() {
    const root = document.getElementById('memory-root');
    root.innerHTML = `
      <div style="text-align:center;padding:32px 20px">
        <div style="font-size:3.5rem;margin-bottom:12px">🃏</div>
        <div style="font-family:'Fredoka One',cursive;font-size:2rem;color:#1A1A2E;margin-bottom:6px">Memory Game</div>
        <p style="color:#6B7280;font-weight:600;margin-bottom:20px">Flip cards to find matching pairs!</p>

        <div style="background:#fff;border-radius:16px;box-shadow:0 4px 20px rgba(0,0,0,.08);padding:16px;margin-bottom:24px;max-width:400px;margin-left:auto;margin-right:auto">
          <div style="font-weight:800;color:#1A1A2E;margin-bottom:10px">🎯 Choose Difficulty</div>
          <div style="display:flex;gap:8px;justify-content:center">
            ${['easy','medium','hard'].map(d => `
              <button class="btn ${d === difficulty ? 'btn-primary' : 'btn-ghost'}"
                      onclick="MemoryGame.setDifficulty('${d}')" id="mem-diff-${d}">
                ${d === 'easy' ? '😊 Easy (8)' : d === 'medium' ? '🤔 Medium (12)' : '😈 Hard (16)'}
              </button>`).join('')}
          </div>
        </div>

        <div class="matching-cat-grid">
          ${Object.entries(CATEGORIES).map(([key, cat]) => `
            <div class="matching-cat-card" onclick="MemoryGame.startGame('${key}')"
                 style="border-top:4px solid ${cat.color}">
              <div style="font-size:2.8rem;margin-bottom:10px">${cat.emoji}</div>
              <div style="font-family:'Fredoka One',cursive;font-size:1.05rem;color:#1A1A2E;margin-bottom:4px">${cat.name}</div>
              <div style="font-size:.8rem;color:#6B7280;font-weight:600">${cat.description}</div>
            </div>
          `).join('')}
        </div>
      </div>`;
  }

  function setDifficulty(d) {
    difficulty = d;
    ['easy','medium','hard'].forEach(opt => {
      const btn = document.getElementById(`mem-diff-${opt}`);
      if (btn) {
        btn.className = `btn ${opt === d ? 'btn-primary' : 'btn-ghost'}`;
      }
    });
    window.SFX?.play('click');
  }

  // ── Start Game ───────────────────────────────────────────────
  function startGame(catKey) {
    currentCategory = catKey;
    const cat = CATEGORIES[catKey];
    const pairCount = BOARD_SIZES[difficulty] / 2;

    // Build pairs: each card appears twice (as item and match)
    const chosenPairs = [...cat.cards].sort(() => Math.random() - 0.5).slice(0, pairCount);
    const rawCards = [];

    chosenPairs.forEach(pair => {
      if (pair.matchDisplay) {
        // Number/flag/bible: different display for item vs match
        rawCards.push({ pairId: pair.id, display: pair.display,      side: 'A' });
        rawCards.push({ pairId: pair.id, display: pair.matchDisplay, side: 'B' });
      } else {
        // Animals: same display (emoji pair)
        rawCards.push({ pairId: pair.id, display: pair.display, side: 'A' });
        rawCards.push({ pairId: pair.id, display: pair.display, side: 'B' });
      }
    });

    // Shuffle
    cards = rawCards.sort(() => Math.random() - 0.5).map((c, i) => ({ ...c, index: i }));
    flipped = [];
    matched = new Set();
    moves = 0;
    lockBoard = false;
    startTime = Date.now();

    window.SFX?.play('click');
    renderBoard();
    startTimer();
  }

  // ── Render Board ─────────────────────────────────────────────
  function renderBoard() {
    const cat = CATEGORIES[currentCategory];
    const pairCount = BOARD_SIZES[difficulty] / 2;
    const totalCards = pairCount * 2;
    const cols = totalCards <= 8 ? 4 : totalCards <= 12 ? 4 : 4;

    const root = document.getElementById('memory-root');
    root.innerHTML = `
      <div class="memory-wrap">
        <div class="matching-header">
          <button class="btn btn-outline" style="color:#667eea;border-color:#667eea;font-size:.8rem"
                  onclick="MemoryGame.backToMenu()">← Back</button>
          <div style="font-family:'Fredoka One',cursive;font-size:1.2rem;color:#1A1A2E">${cat.name}</div>
          <div style="display:flex;gap:16px;font-weight:800;font-size:.9rem">
            <span style="color:#22c55e">✅ <span id="mem-matched">0</span>/${pairCount}</span>
            <span style="color:#667eea">🔄 <span id="mem-moves">0</span></span>
            <span style="color:#f59e0b">⏱️ <span id="mem-timer">0:00</span></span>
          </div>
        </div>
        <div class="memory-grid" id="memory-grid" style="--cols:${cols}">
          ${cards.map(c => `
            <div class="memory-card" id="mc-${c.index}" onclick="MemoryGame.flipCard(${c.index})">
              <div class="memory-card-inner">
                <div class="memory-card-back">🃏</div>
                <div class="memory-card-front">${c.display}</div>
              </div>
            </div>`).join('')}
        </div>
      </div>`;
  }

  // ── Timer ─────────────────────────────────────────────────────
  function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      const el = document.getElementById('mem-timer');
      if (!el) { clearInterval(timerInterval); return; }
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      el.textContent = `${Math.floor(elapsed/60)}:${String(elapsed%60).padStart(2,'0')}`;
    }, 1000);
  }

  // ── Flip Logic ───────────────────────────────────────────────
  function flipCard(index) {
    if (lockBoard) return;
    if (matched.has(cards[index].pairId) && flipped.length < 2) return;
    if (flipped.includes(index)) return;
    if (flipped.length >= 2) return;

    const card = cards[index];
    const el = document.getElementById(`mc-${index}`);
    if (!el || el.classList.contains('flipped') || el.classList.contains('matched')) return;

    el.classList.add('flipped');
    flipped.push(index);
    window.SFX?.play('click');

    if (flipped.length === 2) {
      moves++;
      const movesEl = document.getElementById('mem-moves');
      if (movesEl) movesEl.textContent = moves;
      lockBoard = true;
      checkMatch();
    }
  }

  function checkMatch() {
    const [i1, i2] = flipped;
    const c1 = cards[i1], c2 = cards[i2];

    const hasDifferentSides = CATEGORIES[currentCategory].cards.some(p => p.matchDisplay);
    const isMatch = c1.pairId === c2.pairId && (hasDifferentSides ? c1.side !== c2.side : true);
    if (isMatch) {
      // Match!
      matched.add(c1.pairId);
      const pairCount = BOARD_SIZES[difficulty] / 2;

      setTimeout(() => {
        [i1, i2].forEach(i => {
          const el = document.getElementById(`mc-${i}`);
          if (el) { el.classList.add('matched'); el.onclick = null; }
        });
        flipped = [];
        lockBoard = false;
        window.SFX?.play('quiz_correct');
        const matchedEl = document.getElementById('mem-matched');
        if (matchedEl) matchedEl.textContent = matched.size;

        if (matched.size === pairCount) {
          setTimeout(endGame, 500);
        }
      }, 400);
    } else {
      // No match
      setTimeout(() => {
        [i1, i2].forEach(i => {
          const el = document.getElementById(`mc-${i}`);
          if (el) el.classList.remove('flipped');
        });
        flipped = [];
        lockBoard = false;
        window.SFX?.play('quiz_wrong');
      }, 900);
    }
  }

  // ── End Game ─────────────────────────────────────────────────
  async function endGame() {
    clearInterval(timerInterval);
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const timeStr = `${Math.floor(elapsed/60)}:${String(elapsed%60).padStart(2,'0')}`;
    const pairCount = BOARD_SIZES[difficulty] / 2;
    const cat = CATEGORIES[currentCategory];

    window.SFX?.play('win');

    // Calculate stars
    const maxMoves = pairCount * 2;
    const stars = moves <= maxMoves ? 3 : moves <= maxMoves * 1.5 ? 2 : 1;
    const starDisplay = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);

    const root = document.getElementById('memory-root');
    root.innerHTML = `
      <div style="text-align:center;padding:40px 24px;max-width:480px;margin:0 auto">
        <div style="font-size:4rem;margin-bottom:12px;animation:float 2s ease-in-out infinite">🎉</div>
        <div style="font-family:'Fredoka One',cursive;font-size:2.2rem;color:#1A1A2E;margin-bottom:6px">All Matched!</div>
        <div style="font-size:2rem;margin-bottom:20px">${starDisplay}</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:28px">
          <div class="quiz-stat"><div class="quiz-stat-val">${timeStr}</div><div class="quiz-stat-lbl">⏱️ Time</div></div>
          <div class="quiz-stat"><div class="quiz-stat-val">${moves}</div><div class="quiz-stat-lbl">🔄 Moves</div></div>
          <div class="quiz-stat"><div class="quiz-stat-val">${stars}/3</div><div class="quiz-stat-lbl">⭐ Stars</div></div>
        </div>
        <p style="color:#6B7280;font-weight:600;margin-bottom:24px">
          ${stars === 3 ? 'Perfect memory! Amazing! 🧠' : stars === 2 ? 'Great job! Keep practising! 💪' : 'Good try! Try for fewer moves! 🎯'}
        </p>
        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
          <button class="btn btn-primary btn-lg" onclick="MemoryGame.startGame('${currentCategory}')">🔄 Play Again</button>
          <button class="btn btn-secondary" onclick="MemoryGame.backToMenu()">🎯 New Category</button>
        </div>
      </div>`;

    try {
      await saveResult({
        gameType: 'memory',
        outcome:  'quiz',
        category: currentCategory,
        difficulty,
        level: 'all',
        score: stars,
        total: 3,
        percent: Math.round((stars / 3) * 100),
        duration: elapsed,
        timeStr,
        moves
      });
    } catch(e) {}
  }

  function backToMenu() {
    clearInterval(timerInterval);
    flipped = [];
    matched = new Set();
    lockBoard = false;
    window.SFX?.play('click');
    renderMenuScreen();
  }

  window.MemoryGame = { init, setDifficulty, startGame, flipCard, backToMenu };
})();

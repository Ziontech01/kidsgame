// ── Matching Game Engine ──────────────────────────────────────
// Categories: shapes, animals, objects, colours
// Each round: 8 pairs displayed as two columns (items → targets)
// Player clicks an item, then a target. Correct = green, Wrong = red flash

(function () {
  'use strict';

  const CATEGORIES = {
    animals: {
      name: '🐾 Animals & Their Homes',
      emoji: '🐾',
      color: '#22c55e',
      pairs: [
        { item: '🐝 Bee',       target: '🍯 Beehive',   hint: 'Bees live in a hive and make honey!' },
        { item: '🐦 Bird',      target: '🪹 Nest',      hint: 'Birds build nests from twigs and grass!' },
        { item: '🐟 Fish',      target: '🌊 Ocean',     hint: 'Fish swim in rivers and oceans!' },
        { item: '🐕 Dog',       target: '🏠 Kennel',    hint: 'Dogs sleep in a kennel outside!' },
        { item: '🐴 Horse',     target: '🐎 Stable',    hint: 'Horses are kept in a stable!' },
        { item: '🐸 Frog',      target: '🪷 Pond',      hint: 'Frogs live near ponds and rivers!' },
        { item: '🐇 Rabbit',    target: '🕳️ Burrow',   hint: 'Rabbits live in underground burrows!' },
        { item: '🦁 Lion',      target: '🌿 Den',       hint: 'Lions rest in dens on the savannah!' },
        { item: '🐻 Bear',      target: '🌲 Cave',      hint: 'Bears sleep in caves during winter!' },
        { item: '🐄 Cow',       target: '🏚️ Barn',     hint: 'Cows sleep in a barn on a farm!' },
        { item: '🦅 Eagle',     target: '⛰️ Eyrie',    hint: 'Eagles build eyries on high cliffs!' },
        { item: '🐠 Clownfish', target: '🌸 Anemone',  hint: 'Clownfish live among sea anemones!' },
      ]
    },
    shapes: {
      name: '🔷 Shapes & Names',
      emoji: '🔷',
      color: '#667eea',
      pairs: [
        { item: '⬜',   target: 'Square',     hint: 'A square has 4 equal sides and 4 right angles!' },
        { item: '⬛',   target: 'Rectangle',  hint: 'A rectangle has 2 long and 2 short sides!' },
        { item: '🔺',   target: 'Triangle',   hint: 'A triangle has 3 sides and 3 corners!' },
        { item: '⭕',   target: 'Circle',     hint: 'A circle is perfectly round with no corners!' },
        { item: '💎',   target: 'Diamond',    hint: 'A diamond is a square tilted on its side!' },
        { item: '⭐',   target: 'Star',       hint: 'A star has 5 points!' },
        { item: '🔷',   target: 'Pentagon',   hint: 'A pentagon has 5 sides!' },
        { item: '🔶',   target: 'Hexagon',    hint: 'A hexagon has 6 sides — like a honeycomb!' },
        { item: '🥚',   target: 'Oval',       hint: 'An oval is like a stretched circle!' },
        { item: '🔰',   target: 'Octagon',    hint: 'An octagon has 8 sides — like a stop sign!' },
        { item: '🩸',   target: 'Heart',      hint: 'A heart shape has a dip at the top!' },
        { item: '🌙',   target: 'Crescent',   hint: 'A crescent is a curved moon shape!' },
      ]
    },
    objects: {
      name: '🏠 Objects & Where They Belong',
      emoji: '🏠',
      color: '#f59e0b',
      pairs: [
        { item: '🪥 Toothbrush',  target: '🛁 Bathroom',   hint: 'We brush our teeth in the bathroom!' },
        { item: '📚 Books',        target: '📖 Library',    hint: 'Books are kept in a library!' },
        { item: '🍳 Frying Pan',   target: '🍽️ Kitchen',   hint: 'We cook in the kitchen!' },
        { item: '💊 Medicine',     target: '🏥 Hospital',   hint: 'Medicine is found in hospitals and pharmacies!' },
        { item: '🧸 Teddy Bear',   target: '🛏️ Bedroom',   hint: 'Teddy bears stay in the bedroom!' },
        { item: '⚽ Football',     target: '🏟️ Stadium',   hint: 'Football is played in a stadium!' },
        { item: '🎨 Paintbrush',   target: '🖼️ Art Room',  hint: 'We paint in the art room!' },
        { item: '🌱 Plant',        target: '🌳 Garden',     hint: 'Plants grow in the garden!' },
        { item: '🍎 Apple',        target: '🛒 Shop',       hint: 'We buy fruit at the shop!' },
        { item: '✈️ Aeroplane',    target: '🛫 Airport',   hint: 'Aeroplanes take off at airports!' },
        { item: '📝 Exercise Book',target: '🏫 School',     hint: 'Exercise books are used at school!' },
        { item: '🏋️ Weights',      target: '💪 Gym',       hint: 'We lift weights at the gym!' },
      ]
    },
    colours: {
      name: '🎨 Colour Mixing',
      emoji: '🎨',
      color: '#ec4899',
      pairs: [
        { item: '🔴 Red + 🔵 Blue',       target: '🟣 Purple',     hint: 'Mix red and blue paint to make purple!' },
        { item: '🔴 Red + 🟡 Yellow',      target: '🟠 Orange',     hint: 'Mix red and yellow paint to make orange!' },
        { item: '🔵 Blue + 🟡 Yellow',     target: '🟢 Green',      hint: 'Mix blue and yellow paint to make green!' },
        { item: '🔴 Red + ⬜ White',       target: '🩷 Pink',       hint: 'Mix red and white paint to make pink!' },
        { item: '⬛ Black + ⬜ White',     target: '🩶 Grey',       hint: 'Mix black and white to make grey!' },
        { item: '🔵 Blue + ⬜ White',      target: '🩵 Light Blue', hint: 'Mix blue and white to make a lighter blue!' },
        { item: '🟡 Yellow + ⬜ White',    target: '🌼 Cream',      hint: 'Mix yellow and white to make cream!' },
        { item: '🔴 Red + 🟠 Orange',      target: '🔶 Reddish Orange', hint: 'Mixing two warm colours makes a new warm colour!' },
        { item: '🟢 Green + 🔵 Blue',      target: '🌊 Teal',       hint: 'Mix green and blue to make teal!' },
        { item: '🟣 Purple + 🔴 Red',      target: '🍇 Magenta',    hint: 'Mix purple and red to make magenta!' },
        { item: '🟡 Yellow + 🟢 Green',    target: '💚 Lime',       hint: 'Mix yellow and green to make lime green!' },
        { item: '🟠 Orange + 🟡 Yellow',   target: '🌻 Golden',     hint: 'Mix orange and yellow to make golden!' },
      ]
    }
  };

  let currentCategory = null;
  let pairs = [];
  let selectedItem = null;
  let matchedCount = 0;
  let mistakes = 0;
  let startTime = null;
  let timerInterval = null;
  let score = 0;
  const PAIRS_PER_ROUND = 8;

  // ── Init ─────────────────────────────────────────────────────
  function init() {
    renderCategoryScreen();
    hideLoading();
  }

  function hideLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) overlay.classList.add('hidden');
  }

  // ── Category Selection ───────────────────────────────────────
  function renderCategoryScreen() {
    const root = document.getElementById('matching-root');
    root.innerHTML = `
      <div style="text-align:center;padding:32px 20px">
        <div style="font-size:3.5rem;margin-bottom:12px">🎯</div>
        <div style="font-family:'Fredoka One',cursive;font-size:2rem;color:#1A1A2E;margin-bottom:8px">Matching Game</div>
        <p style="color:#6B7280;font-weight:600;margin-bottom:32px">Pick a category and find all the matching pairs!</p>
        <div class="matching-cat-grid">
          ${Object.entries(CATEGORIES).map(([key, cat]) => `
            <div class="matching-cat-card" onclick="MatchingGame.startCategory('${key}')"
                 style="border-top:4px solid ${cat.color}">
              <div style="font-size:2.8rem;margin-bottom:10px">${cat.emoji}</div>
              <div style="font-family:'Fredoka One',cursive;font-size:1.1rem;color:#1A1A2E">${cat.name}</div>
            </div>
          `).join('')}
        </div>
      </div>`;
  }

  // ── Start Category ───────────────────────────────────────────
  function startCategory(catKey) {
    currentCategory = catKey;
    const cat = CATEGORIES[catKey];
    // Pick PAIRS_PER_ROUND random pairs
    const shuffled = [...cat.pairs].sort(() => Math.random() - 0.5);
    pairs = shuffled.slice(0, PAIRS_PER_ROUND).map((p, i) => ({ ...p, id: i, matched: false }));
    selectedItem = null;
    matchedCount = 0;
    mistakes = 0;
    score = 0;
    startTime = Date.now();
    renderGame();
    startTimer();
    window.SFX?.play('click');
  }

  // ── Render Game ──────────────────────────────────────────────
  function renderGame() {
    const cat = CATEGORIES[currentCategory];
    // Shuffle left items and right targets independently
    const leftItems  = [...pairs].sort(() => Math.random() - 0.5);
    const rightItems = [...pairs].sort(() => Math.random() - 0.5);

    const root = document.getElementById('matching-root');
    root.innerHTML = `
      <div class="matching-wrap">
        <div class="matching-header">
          <button class="btn btn-outline" style="color:#667eea;border-color:#667eea;font-size:.8rem"
                  onclick="MatchingGame.backToMenu()">← Back</button>
          <div style="font-family:'Fredoka One',cursive;font-size:1.3rem;color:#1A1A2E">${cat.name}</div>
          <div style="display:flex;gap:16px;font-weight:800;font-size:.9rem">
            <span style="color:#22c55e">✅ <span id="match-count">0</span>/${PAIRS_PER_ROUND}</span>
            <span style="color:#ef4444">❌ <span id="mistake-count">0</span></span>
            <span style="color:#667eea">⏱️ <span id="match-timer">0:00</span></span>
          </div>
        </div>
        <div class="matching-hint-bar" id="match-hint"> Click an item on the left, then its match on the right! 👇</div>
        <div class="matching-board">
          <div class="match-col">
            <div class="match-col-title">👈 Items</div>
            ${leftItems.map(p => `
              <div class="match-item" id="item-${p.id}" onclick="MatchingGame.selectItem(${p.id})">
                ${p.item}
              </div>`).join('')}
          </div>
          <div class="match-divider">
            <div class="match-divider-line"></div>
            <div class="match-divider-icon">🔗</div>
            <div class="match-divider-line"></div>
          </div>
          <div class="match-col">
            <div class="match-col-title">👉 Matches</div>
            ${rightItems.map(p => `
              <div class="match-item target" id="target-${p.id}" onclick="MatchingGame.selectTarget(${p.id})">
                ${p.target}
              </div>`).join('')}
          </div>
        </div>
      </div>`;
  }

  // ── Timer ────────────────────────────────────────────────────
  function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      const el = document.getElementById('match-timer');
      if (!el) { clearInterval(timerInterval); return; }
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const m = Math.floor(elapsed / 60);
      const s = elapsed % 60;
      el.textContent = `${m}:${s.toString().padStart(2,'0')}`;
    }, 1000);
  }

  // ── Item Selection ───────────────────────────────────────────
  function selectItem(id) {
    const pair = pairs.find(p => p.id === id);
    if (!pair || pair.matched) return;

    // Deselect previous item
    document.querySelectorAll('.match-item:not(.target)').forEach(el => el.classList.remove('selected'));
    selectedItem = id;
    const el = document.getElementById(`item-${id}`);
    if (el) { el.classList.add('selected'); }
    window.SFX?.play('click');
    showHint('Now click the matching item on the right! 👉');
  }

  function selectTarget(id) {
    if (selectedItem === null) {
      showHint('First click an item on the LEFT side! 👈');
      window.SFX?.play('error');
      return;
    }
    const pair = pairs.find(p => p.id === id);
    if (!pair || pair.matched) return;

    const itemEl   = document.getElementById(`item-${selectedItem}`);
    const targetEl = document.getElementById(`target-${id}`);

    if (selectedItem === id) {
      // Correct match!
      pair.matched = true;
      matchedCount++;
      score += Math.max(10, 20 - mistakes);
      if (itemEl)   { itemEl.classList.remove('selected'); itemEl.classList.add('matched'); itemEl.onclick = null; }
      if (targetEl) { targetEl.classList.add('matched'); targetEl.onclick = null; }
      document.getElementById('match-count').textContent = matchedCount;
      selectedItem = null;
      window.SFX?.play('quiz_correct');
      showHint(`✅ ${pair.hint}`);

      if (matchedCount === PAIRS_PER_ROUND) {
        setTimeout(endRound, 800);
      }
    } else {
      // Wrong match!
      mistakes++;
      document.getElementById('mistake-count').textContent = mistakes;
      if (itemEl)   itemEl.classList.add('wrong');
      if (targetEl) targetEl.classList.add('wrong');
      window.SFX?.play('quiz_wrong');
      showHint('❌ Not quite! Try a different match. 🤔');
      setTimeout(() => {
        if (itemEl)   itemEl.classList.remove('wrong');
        if (targetEl) targetEl.classList.remove('wrong');
      }, 600);
    }
  }

  function showHint(msg) {
    const el = document.getElementById('match-hint');
    if (el) { el.textContent = msg; el.style.opacity = '1'; }
  }

  // ── End Round ────────────────────────────────────────────────
  async function endRound() {
    clearInterval(timerInterval);
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const m = Math.floor(elapsed / 60);
    const s = elapsed % 60;
    const timeStr = `${m}:${s.toString().padStart(2,'0')}`;
    const accuracy = Math.round(((PAIRS_PER_ROUND / (PAIRS_PER_ROUND + mistakes)) * 100));
    const cat = CATEGORIES[currentCategory];

    window.SFX?.play('win');

    const root = document.getElementById('matching-root');
    root.innerHTML = `
      <div style="text-align:center;padding:40px 24px;max-width:480px;margin:0 auto">
        <div style="font-size:4rem;margin-bottom:14px;animation:float 2s ease-in-out infinite">🎉</div>
        <div style="font-family:'Fredoka One',cursive;font-size:2.2rem;color:#1A1A2E;margin-bottom:8px">Brilliant!</div>
        <p style="color:#6B7280;font-weight:600;margin-bottom:24px">You matched everything in ${cat.name}!</p>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:28px">
          <div class="quiz-stat"><div class="quiz-stat-val">${timeStr}</div><div class="quiz-stat-lbl">⏱️ Time</div></div>
          <div class="quiz-stat"><div class="quiz-stat-val">${mistakes}</div><div class="quiz-stat-lbl">❌ Mistakes</div></div>
          <div class="quiz-stat"><div class="quiz-stat-val">${accuracy}%</div><div class="quiz-stat-lbl">🎯 Accuracy</div></div>
        </div>
        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
          <button class="btn btn-primary btn-lg" onclick="MatchingGame.startCategory('${currentCategory}')">🔄 Play Again</button>
          <button class="btn btn-secondary" onclick="MatchingGame.backToMenu()">🎯 New Category</button>
        </div>
      </div>`;

    // Save to Firestore
    try {
      await saveResult({
        gameType: 'matching',
        outcome:  'quiz',
        category: currentCategory,
        level: 'all',
        score: PAIRS_PER_ROUND,
        total: PAIRS_PER_ROUND,
        percent: accuracy,
        duration: elapsed,
        timeStr,
        mistakes
      });
    } catch(e) {}
  }

  function backToMenu() {
    clearInterval(timerInterval);
    selectedItem = null;
    window.SFX?.play('click');
    renderCategoryScreen();
  }

  // Public API
  window.MatchingGame = { init, startCategory, selectItem, selectTarget, backToMenu };
})();

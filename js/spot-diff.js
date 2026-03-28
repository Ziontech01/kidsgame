// Happy Games – Spot the Difference
// Two side-by-side 5×5 emoji scenes; player clicks the 5 differences in the RIGHT panel.
'use strict';

const SpotDiff = (() => {

  /* ── Scene data ─────────────────────────────────────────────
     Each scene: original[25] and modified[25] (same except at diff indices)
     diffs: the 5 indices (0-24) that changed between original and modified
  ────────────────────────────────────────────────────────────── */
  const SCENES = [
    {
      name:'At the Beach 🏖️',
      original:['🌊','⛱️','🐚','🦀','⛵',
                '☀️','🐠','🦭','🪸','🌴',
                '🏄','🐙','🌊','🦈','🐡',
                '🚢','🪨','🏖️','🐚','🌊',
                '⭐','🦞','🌈','🐟','🌺'],
      modified: ['🌊','⛱️','🐚','🦞','⛵',   // idx 3: 🦀→🦞
                '☀️','🐠','🦭','🪸','🌵',    // idx 9: 🌴→🌵
                '🏄','🐙','🌊','🦈','🐡',
                '🚢','🪨','🏖️','🐚','⛈️',   // idx 19: 🌊→⛈️
                '⭐','🦞','🌙','🐟','🌺'],   // idx 22: 🌈→🌙
      diffs:[3, 9, 19, 22, 14],
      // idx 14: 🐡→🐠 (same as idx 6 — let's make it unique)
    },
    {
      name:'In the Garden 🌻',
      original:['🌸','🐝','🌿','🦋','🌻',
                '🐛','🌱','🐞','🌷','🍃',
                '🐦','🌼','🐌','🌾','🍄',
                '🌳','🐇','🌺','🦔','🌿',
                '🌻','🐸','🌈','🍁','🐦'],
      modified: ['🌸','🐝','🌿','🦋','🌻',
                '🐛','🌱','🐝','🌷','🍃',   // idx 7: 🐞→🐝
                '🐦','🌼','🐌','🌾','🍄',
                '🌳','🐇','🌺','🦔','🍀',   // idx 19: 🌿→🍀
                '🌼','🐸','🌈','🍂','🐦'],  // idx 20: 🌻→🌼, idx 23: 🍁→🍂
      diffs:[7, 19, 20, 23, 5],
      // idx 5: 🐛→🐜? Let me fix this
    },
    {
      name:'The Farmyard 🐄',
      original:['🐄','🌾','🐓','🐖','🐑',
                '🏠','🚜','🌳','🌻','🐕',
                '🐎','🐄','🌿','🐓','🌾',
                '🏚️','🐑','🐖','🌳','🚜',
                '🌻','🐕','🌞','🐎','🌾'],
      modified: ['🐄','🌾','🐓','🐖','🐑',
                '🏠','🚜','🌳','🌻','🐈',   // idx 9: 🐕→🐈
                '🐎','🐄','🌿','🐓','🌾',
                '🏚️','🐑','🐖','🌳','🚗',   // idx 19: 🚜→🚗
                '🌻','🐕','🌙','🐴','🌾'],  // idx 22: 🌞→🌙, idx 23: 🐎→🐴
      diffs:[9, 19, 22, 23, 3],
      // idx 3: 🐖→🐗? Let's simplify
    },
    {
      name:'Outer Space 🚀',
      original:['🌟','🚀','🪐','⭐','🌕',
                '☄️','🌍','🔭','🌟','🛸',
                '🌙','💫','🪐','🌟','🌠',
                '🚀','⭐','🌌','☄️','🌕',
                '🌟','🛸','💫','🔭','🌍'],
      modified: ['🌟','🚀','🪐','⭐','🌕',
                '☄️','🌍','🔭','🌟','🛸',
                '🌙','💫','🪐','🌟','⭐',    // idx 14: 🌠→⭐
                '🚀','🌟','🌌','☄️','🌕',   // idx 16: ⭐→🌟
                '🌟','🛸','🌕','🔭','🌍'],  // idx 22: 💫→🌕
      diffs:[14, 16, 22, 1, 8],
      // idx 1: 🚀→🛸? idx 8: 🌟→💫?
    },
    {
      name:'The Kitchen 🍳',
      original:['🍎','🥛','🍞','🥚','🧀',
                '🍳','🥕','🍌','🫖','🥦',
                '🍽️','🥄','🍋','🧂','🫙',
                '🥣','🍰','🥤','🧁','🍓',
                '🥑','🫐','🍇','🥝','🍊'],
      modified: ['🍎','🥛','🍞','🥚','🧀',
                '🍳','🥕','🍌','☕','🥦',   // idx 8: 🫖→☕
                '🍽️','🥄','🍋','🧂','🫙',
                '🥣','🎂','🥤','🧁','🍓',   // idx 16: 🍰→🎂
                '🥑','🫐','🍇','🍉','🍊'],  // idx 23: 🥝→🍉
      diffs:[8, 16, 23, 0, 19],
      // idx 0: 🍎→🍐? idx 19: 🍓→🍒?
    }
  ];

  // Patch up the diffs and modified arrays to be consistent
  // (some diffs above were hand-written, let me make them reliable by
  //  auto-patching modified[] based on the diffs[] array)
  SCENES.forEach(scene => {
    // Replace modified with a clean copy of original, then apply the FIRST 5 diffs
    const REPLACEMENTS = {
      '🦀':'🦞','🌴':'🌵','🌊':'⛈️','🌈':'🌙','🐡':'🐠',  // beach
      '🐞':'🐝','🌿':'🍀','🌻':'🌼','🍁':'🍂','🐛':'🐜',   // garden
      '🐕':'🐈','🚜':'🚗','🌞':'🌙','🐎':'🐴','🐖':'🐗',   // farm
      '🌠':'⭐','⭐':'🌟','💫':'🌕','🚀':'🛸','🌟':'💫',    // space
      '🫖':'☕','🍰':'🎂','🥝':'🍉','🍎':'🍐','🍓':'🍒'    // kitchen
    };
    scene.modified = [...scene.original];
    // Apply diffs reliably: at each diff index, replace original[i] with something different
    scene.diffs = [];
    let count = 0;
    for (let i = 0; i < 25 && count < 5; i++) {
      const orig = scene.original[i];
      if (REPLACEMENTS[orig]) {
        scene.modified[i] = REPLACEMENTS[orig];
        scene.diffs.push(i);
        count++;
      }
    }
    // If we couldn't find 5 replacements, just mark the first 5 available spots
    if (scene.diffs.length < 5) {
      const FALLBACK_SWAPS = ['🌟','⭐','💫','🌙','☀️','🌤️','🌈','🎯','🎪','🎨'];
      for (let i = 0; i < 25 && scene.diffs.length < 5; i++) {
        if (!scene.diffs.includes(i)) {
          scene.modified[i] = FALLBACK_SWAPS[scene.diffs.length];
          scene.diffs.push(i);
        }
      }
    }
  });

  /* ── State ─────────────────────────────────────────────────── */
  let state = {};
  const TIME_LIMIT = 120;  // seconds
  const MAX_HINTS  = 3;
  const WRONG_PENALTY = 10; // seconds deducted per wrong click

  /* ── Public init ───────────────────────────────────────────── */
  function init() {
    state = {};
    renderSceneSelect();
  }

  /* ── Scene selection ───────────────────────────────────────── */
  function renderSceneSelect() {
    getContainer().innerHTML = `
      <div style="max-width:700px;margin:0 auto;padding:24px 16px">
        <div class="page-header" style="padding-top:0">
          <div class="page-title">🔍 Spot the Difference</div>
          <div class="page-subtitle">Find all 5 differences in the right picture!</div>
        </div>
        <div class="sd-scene-select">
          ${SCENES.map((s, i) => `
            <button class="sd-scene-btn" onclick="SpotDiff._startScene(${i})">
              <span class="sd-scene-icon">${s.name.split(' ').pop()}</span>
              <div class="sd-scene-name">${s.name.replace(/[\u{1F3D6}\u{1F33B}\u{1F404}\u{1F680}\u{1F373}]/u, '').trim()}</div>
              <div class="sd-scene-sub">5 differences to find</div>
            </button>`).join('')}
        </div>
        <div style="text-align:center;margin-top:8px">
          <button class="btn btn-primary btn-lg" onclick="SpotDiff._startScene(${Math.floor(Math.random()*SCENES.length)})">
            🎲 Random Scene
          </button>
        </div>
      </div>`;
    hideLoading();
  }

  /* ── Start a scene ─────────────────────────────────────────── */
  function _startScene(idx) {
    window.SFX?.play('click');
    const scene = SCENES[idx];
    state = {
      scene, sceneIdx:idx,
      found: [],
      wrongClicks: 0,
      hints: MAX_HINTS,
      hintUsed: [],
      timeLeft: TIME_LIMIT,
      startTime: Date.now(),
      timerInterval: null,
      over: false
    };
    renderGame();
    startTimer();
  }

  /* ── Render game ───────────────────────────────────────────── */
  function renderGame() {
    const s = state.scene;
    getContainer().innerHTML = `
      <div class="sd-wrap">
        <div class="sd-header">
          <div>
            <div class="sd-title">🔍 ${s.name}</div>
            <div class="sd-found" id="sd-found">🔵🔵🔵🔵🔵</div>
          </div>
          <div class="sd-controls">
            <div class="sd-timer" id="sd-timer">⏱️ ${TIME_LIMIT}s</div>
            <button class="btn btn-secondary" id="sd-hint-btn"
              onclick="SpotDiff._useHint()" style="font-size:.82rem;padding:6px 12px">
              💡 Hint (${state.hints} left)
            </button>
          </div>
        </div>

        <div class="sd-panels">
          <!-- Left: original (non-clickable) -->
          <div class="sd-panel">
            <div class="sd-panel-label">🖼️ Original</div>
            <div class="sd-grid" id="sd-left">
              ${s.original.map((e, i) => `
                <div class="sd-cell sd-cell-orig" id="sl-${i}">${e}</div>`).join('')}
            </div>
          </div>

          <!-- Right: modified (clickable) -->
          <div class="sd-panel">
            <div class="sd-panel-label">🔍 Find the difference</div>
            <div class="sd-grid" id="sd-right">
              ${s.modified.map((e, i) => `
                <div class="sd-cell sd-cell-mod" id="sr-${i}"
                  onclick="SpotDiff._clickCell(${i})">${e}</div>`).join('')}
            </div>
          </div>
        </div>

        <div class="sd-msg" id="sd-msg">
          Click on any cell in the right picture that looks different from the left!
        </div>
      </div>`;

    updateFoundIndicator();
  }

  /* ── Cell click ────────────────────────────────────────────── */
  function _clickCell(idx) {
    if (state.over) return;
    if (state.found.includes(idx)) return; // already found

    if (state.scene.diffs.includes(idx)) {
      // Correct!
      state.found.push(idx);
      window.SFX?.play('quiz_correct');
      markCorrect(idx);
      updateFoundIndicator();
      setMsg(`🎉 Found one! ${state.scene.diffs.length - state.found.length} more to go!`);
      if (state.found.length === state.scene.diffs.length) {
        setTimeout(winGame, 400);
      }
    } else {
      // Wrong
      window.SFX?.play('quiz_wrong');
      state.wrongClicks++;
      state.timeLeft = Math.max(5, state.timeLeft - WRONG_PENALTY);
      flashWrong(idx);
      setMsg(`❌ Not there! -${WRONG_PENALTY}s penalty. Keep looking!`);
    }
  }

  /* ── Hint ──────────────────────────────────────────────────── */
  function _useHint() {
    if (state.over || state.hints <= 0) return;
    const unfound = state.scene.diffs.filter(i => !state.found.includes(i) && !state.hintUsed.includes(i));
    if (!unfound.length) return;
    state.hints--;
    const hintIdx = unfound[0];
    state.hintUsed.push(hintIdx);

    // Flash the cell in the right panel
    const cell = document.getElementById(`sr-${hintIdx}`);
    if (cell) {
      cell.classList.add('sd-hint-flash');
      setTimeout(() => cell.classList.remove('sd-hint-flash'), 1500);
    }
    // Also flash matching left cell
    const leftCell = document.getElementById(`sl-${hintIdx}`);
    if (leftCell) {
      leftCell.classList.add('sd-hint-flash');
      setTimeout(() => leftCell.classList.remove('sd-hint-flash'), 1500);
    }

    const btn = document.getElementById('sd-hint-btn');
    if (btn) btn.textContent = `💡 Hint (${state.hints} left)`;
    if (state.hints === 0 && btn) btn.disabled = true;

    setMsg(`💡 Hint: look at the flashing cell!`);
    window.SFX?.play('click');
  }

  /* ── Timer ─────────────────────────────────────────────────── */
  function startTimer() {
    clearInterval(state.timerInterval);
    state.timerInterval = setInterval(() => {
      if (state.over) { clearInterval(state.timerInterval); return; }
      state.timeLeft--;
      const el = document.getElementById('sd-timer');
      if (el) {
        el.textContent = `⏱️ ${state.timeLeft}s`;
        if (state.timeLeft <= 15) el.style.color = '#ef4444';
      }
      if (state.timeLeft <= 0) {
        clearInterval(state.timerInterval);
        loseGame();
      }
    }, 1000);
  }

  /* ── Win / Lose ────────────────────────────────────────────── */
  async function winGame() {
    state.over = true;
    clearInterval(state.timerInterval);
    const elapsed = Math.round((Date.now() - state.startTime) / 1000);
    const mm = Math.floor(elapsed/60), ss = String(elapsed%60).padStart(2,'0');
    const timeStr = `${mm}:${ss}`;
    window.SFX?.play('win');
    showEndOverlay(true, timeStr, elapsed);
    await saveResult({
      gameType: 'spot-diff',
      outcome:  'win',
      scene:    state.scene.name,
      level:    'all',
      score:    state.scene.diffs.length,
      total:    state.scene.diffs.length,
      percent:  100,
      duration: elapsed,
      timeStr,
      wrongClicks: state.wrongClicks
    });
  }

  async function loseGame() {
    state.over = true;
    // Reveal unfound differences
    state.scene.diffs.forEach(i => {
      if (!state.found.includes(i)) {
        const cell = document.getElementById(`sr-${i}`);
        if (cell) cell.classList.add('sd-reveal');
      }
    });
    window.SFX?.play('lose');
    const elapsed = Math.round((Date.now() - state.startTime) / 1000);
    const mm = Math.floor(elapsed/60), ss = String(elapsed%60).padStart(2,'0');
    const timeStr = `${mm}:${ss}`;
    showEndOverlay(false, timeStr, elapsed);
    await saveResult({
      gameType: 'spot-diff',
      outcome:  'lose',
      scene:    state.scene.name,
      level:    'all',
      score:    state.found.length,
      total:    state.scene.diffs.length,
      percent:  Math.round((state.found.length / state.scene.diffs.length) * 100),
      duration: elapsed,
      timeStr,
      wrongClicks: state.wrongClicks
    });
  }

  /* ── UI helpers ────────────────────────────────────────────── */
  function markCorrect(idx) {
    const cells = [document.getElementById(`sr-${idx}`), document.getElementById(`sl-${idx}`)];
    cells.forEach(c => { if (c) c.classList.add('sd-correct'); });
  }

  function flashWrong(idx) {
    const cell = document.getElementById(`sr-${idx}`);
    if (!cell) return;
    cell.classList.add('sd-wrong-flash');
    setTimeout(() => cell.classList.remove('sd-wrong-flash'), 600);
  }

  function updateFoundIndicator() {
    const el = document.getElementById('sd-found');
    if (!el) return;
    const total = state.scene.diffs.length;
    el.innerHTML = Array.from({length: total}, (_, i) =>
      `<span style="opacity:${i < state.found.length ? 1 : 0.25};font-size:1.3rem">🔵</span>`
    ).join('');
    el.innerHTML += ` <span style="font-size:.85rem;color:#666">${state.found.length}/${total} found</span>`;
  }

  function setMsg(msg) {
    const el = document.getElementById('sd-msg');
    if (el) el.textContent = msg;
  }

  function showEndOverlay(won, timeStr, elapsed) {
    const container = getContainer();
    const overlay = document.createElement('div');
    overlay.className = 'sl-end-overlay';
    overlay.style.cssText = 'display:flex;position:fixed;inset:0;z-index:999;align-items:center;justify-content:center;background:rgba(0,0,0,0.5)';
    overlay.innerHTML = `
      <div class="sl-end-card" style="max-width:400px;width:90%">
        <div class="sl-end-icon">${won ? '🏆' : '⏰'}</div>
        <div class="sl-end-title">${won ? 'Well Done!' : 'Time\'s Up!'}</div>
        <div class="sl-end-msg">${won
          ? `You found all ${state.scene.diffs.length} differences in ${timeStr}!`
          : `You found ${state.found.length} of ${state.scene.diffs.length} differences.`}</div>
        <div class="sl-end-stats">
          <span>Wrong clicks: ${state.wrongClicks}</span>
          <span>Time: ${timeStr}</span>
        </div>
        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:20px">
          <button class="btn btn-primary btn-lg" onclick="SpotDiff._startScene(${state.sceneIdx})">🔄 Try Again</button>
          <button class="btn btn-secondary" onclick="SpotDiff.init()">🔍 Choose Scene</button>
          <a href="../index.html" class="btn btn-outline">🏠 Home</a>
        </div>
      </div>`;
    document.body.appendChild(overlay);
  }

  function getContainer() { return document.getElementById('spot-diff-container'); }
  function hideLoading() {
    const ol = document.getElementById('loading-overlay');
    if (ol) ol.classList.add('hidden');
  }

  return { init, _startScene, _clickCell, _useHint };
})();

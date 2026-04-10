// Happy Games – Ludo  (multi-player: 1 vs CPU / 2P / 3P+CPU / 4P)
'use strict';

const LudoGame = (() => {

  /* ── Board track (56 cells) ──────────────────────────────────────
     [col, row] zero-indexed. Clockwise from Blue entry at bottom-left.
     All 56 transitions are orthogonally adjacent (no diagonal jumps).
     Includes 4 centre-corner cells [6,8],[6,6],[8,6],[8,8] where arms meet.

     COLOR_ENTRY = movement loop offset (piece position 0 in MAIN_TRACK)
     Blue   entry  0 → [6,13]  doorstep 54 → [7,14]  (adjacent to BLUE_HOME[0]=[7,13])
     Green  entry 14 → [1,6]   doorstep 12 → [0,7]   (adjacent to GREEN_HOME[0]=[1,7])
     Yellow entry 28 → [8,1]   doorstep 26 → [7,0]   (adjacent to YELLOW_HOME[0]=[7,1])
     Red    entry 42 → [13,8]  doorstep 40 → [14,7]  (adjacent to RED_HOME[0]=[13,7])

     All 4 entries are one cell inward from the arm tip corner, matching
     the physical board.  Rotationally symmetric under 90° CW around [7,7].
  ─────────────────────────────────────────────────────────────────*/
  const MAIN_TRACK = [
    [6,13],[6,12],[6,11],[6,10],[6,9],         //  0-4   Blue entry ★, going UP
    [6,8],                                      //  5     centre corner (BL)
    [5,8],[4,8],[3,8],[2,8],[1,8],[0,8],        //  6-11  left along row 8
    [0,7],[0,6],                                // 12-13  Green doorstep + tip corner
    [1,6],[2,6],[3,6],[4,6],[5,6],              // 14-18  Green entry ★ at 14, right along row 6
    [6,6],                                      // 19     centre corner (TL)
    [6,5],[6,4],[6,3],[6,2],[6,1],[6,0],        // 20-25  up col 6
    [7,0],[8,0],                                // 26-27  Yellow doorstep + tip corner
    [8,1],[8,2],[8,3],[8,4],[8,5],              // 28-32  Yellow entry ★ at 28, down col 8
    [8,6],                                      // 33     centre corner (TR)
    [9,6],[10,6],[11,6],[12,6],[13,6],[14,6],   // 34-39  right along row 6
    [14,7],[14,8],                              // 40-41  Red doorstep + tip corner
    [13,8],[12,8],[11,8],[10,8],[9,8],          // 42-46  Red entry ★ at 42, left along row 8
    [8,8],                                      // 47     centre corner (BR)
    [8,9],[8,10],[8,11],[8,12],[8,13],[8,14],   // 48-53  down col 8
    [7,14],[6,14]                               // 54-55  Blue doorstep + tip corner
  ];

  // Home columns — pieces advance from pos 55 (step 1) to 59 (step 5) then 60 = done
  const BLUE_HOME   = [[7,13],[7,12],[7,11],[7,10],[7,9]];  // col 7 going UP
  const YELLOW_HOME = [[7,1],[7,2],[7,3],[7,4],[7,5]];       // col 7 going DOWN
  const GREEN_HOME  = [[1,7],[2,7],[3,7],[4,7],[5,7]];       // row 7 going RIGHT
  const RED_HOME    = [[13,7],[12,7],[11,7],[10,7],[9,7]];   // row 7 going LEFT

  const HOME_COLS   = { blue: BLUE_HOME, yellow: YELLOW_HOME, green: GREEN_HOME, red: RED_HOME };
  // Movement loop offsets: COLOR_ENTRY defines where position 0 starts on MAIN_TRACK for each color.
  // This offset ensures the 56-cell loop ends cleanly at the home lane entrance.
  // Each colour's doorstep is at relative pos 54 = (entry + 54) % 56 in MAIN_TRACK.
  const COLOR_ENTRY = { blue: 0, green: 14, yellow: 28, red: 42 };

  // Centred in the middle 2×2 of each zone's 4×4 inner white area
  const PIECE_STARTS = {
    blue:   [[2,11],[3,11],[2,12],[3,12]],   // inner rows 10-13, cols 1-4 → centre = rows 11-12, cols 2-3
    yellow: [[11,2],[12,2],[11,3],[12,3]],   // inner rows 1-4, cols 10-13 → centre = rows 2-3, cols 11-12
    green:  [[2,2], [3,2], [2,3], [3,3] ],  // inner rows 1-4, cols 1-4   → centre = rows 2-3, cols 2-3
    red:    [[11,11],[12,11],[11,12],[12,12]] // inner rows 10-13,cols 10-13→ centre = rows 11-12, cols 11-12
  };

  // Safe squares — entry + doorstep for each colour (no captures allowed)
  //   Blue:   abs  0 → [6,13]  (entry)     abs 54 → [7,14]  (doorstep)
  //   Green:  abs 14 → [1,6]   (entry)     abs 12 → [0,7]   (doorstep)
  //   Yellow: abs 28 → [8,1]   (entry)     abs 26 → [7,0]   (doorstep)
  //   Red:    abs 42 → [13,8]  (entry)     abs 40 → [14,7]  (doorstep)
  const SAFE = new Set([0, 54, 12, 14, 26, 28, 40, 42]);

  // Visual entry markers — colour BOTH the entry square (where pieces first land)
  // AND the doorstep square (last main-track cell before the home column).
  // All 4 entries are one cell inward from arm tip, matching physical boards.
  //
  //   Blue:   entry  0 → [6,13]   doorstep 54 → [7,14]
  //   Green:  entry 14 → [1,6]    doorstep 12 → [0,7]
  //   Yellow: entry 28 → [8,1]    doorstep 26 → [7,0]
  //   Red:    entry 42 → [13,8]   doorstep 40 → [14,7]
  const ENTRY_CLASS = {
    0:'lc-entry-blue',                             // Blue   entry only
    14:'lc-entry-green',                           // Green  entry only
    28:'lc-entry-yellow',                          // Yellow entry only
    42:'lc-entry-red'                              // Red    entry only
  };

  const COLOR_CONFIG = {
    blue:   { emoji: '🔵', label: 'Blue',   css: '#1e40af' },
    yellow: { emoji: '🟡', label: 'Yellow', css: '#a16207' },
    green:  { emoji: '🟢', label: 'Green',  css: '#166534' },
    red:    { emoji: '🔴', label: 'Red',    css: '#991b1b' }
  };

  // Token icons — assigned by player slot index
  const TOKENS = ['🐻','🐰','🚗','🦖','🤖','🐕','🦄','👾'];

  /* ── State ──────────────────────────────────────────────────── */
  let state = {};

  /* ════════════════════════════════════════════════════════════
     SETUP SCREEN
  ════════════════════════════════════════════════════════════ */
  function init() {
    hideLoading();
    console.log('🎲 LUDO RUNTIME VERIFICATION:', COLOR_ENTRY);
    // Reset dice display
    const diceEl = document.getElementById('ludo-dice-val');
    if (diceEl) diceEl.textContent = '🎲';
    const diceEl2 = document.getElementById('ludo-dice-val-2');
    if (diceEl2) diceEl2.textContent = '🎲';
    renderSetup();
  }

  function renderSetup() {
    const setupEl = document.getElementById('ludo-setup');
    if (!setupEl) return;
    setupEl.style.display = 'block';

    const gameArea = document.getElementById('ludo-game-area');
    if (gameArea) gameArea.style.display = 'none';

    const loggedName = window.currentUser?.displayName || window.userName || '';

    setupEl.innerHTML = `
      <div class="ludo-setup-card">
        <div class="ludo-setup-title">🎲 Ludo</div>
        <div class="ludo-setup-sub">How many players?</div>

        <div class="ludo-mode-grid">
          <button class="ludo-mode-btn" id="ludo-mode-1" onclick="LudoGame._selectMode(1)">
            <div class="ludo-mode-icon">🤖</div>
            <div class="ludo-mode-label">1 Player</div>
            <div class="ludo-mode-desc">vs Computer</div>
          </button>
          <button class="ludo-mode-btn" id="ludo-mode-2" onclick="LudoGame._selectMode(2)">
            <div class="ludo-mode-icon">👥</div>
            <div class="ludo-mode-label">2 Players</div>
            <div class="ludo-mode-desc">Pass &amp; play</div>
          </button>
          <button class="ludo-mode-btn" id="ludo-mode-3" onclick="LudoGame._selectMode(3)">
            <div class="ludo-mode-icon">👨‍👩‍👧</div>
            <div class="ludo-mode-label">3 Players</div>
            <div class="ludo-mode-desc">+ Computer</div>
          </button>
          <button class="ludo-mode-btn" id="ludo-mode-4" onclick="LudoGame._selectMode(4)">
            <div class="ludo-mode-icon">🎉</div>
            <div class="ludo-mode-label">4 Players</div>
            <div class="ludo-mode-desc">Full game</div>
          </button>
        </div>

        <div style="margin-top:18px">
          <div class="ludo-setup-divider">Game Mode</div>
          <div class="ludo-gamemode-btns">
            <button class="ludo-gamemode-btn selected" id="ludo-gm-kids"
                    onclick="LudoGame._selectGameMode('kids')">
              <span class="ludo-gamemode-icon">🌟</span>
              <span class="ludo-gamemode-label">Kids Mode</span>
              <span class="ludo-gamemode-sub">✅ Enter on 1 or 6</span>
              <span class="ludo-gamemode-rec">Recommended ages 5–8!</span>
            </button>
            <button class="ludo-gamemode-btn" id="ludo-gm-classic"
                    onclick="LudoGame._selectGameMode('classic')">
              <span class="ludo-gamemode-icon">🎯</span>
              <span class="ludo-gamemode-label">Classic Mode</span>
              <span class="ludo-gamemode-sub">Enter on 6 only</span>
              <span class="ludo-gamemode-rec">&nbsp;</span>
            </button>
          </div>
        </div>

        <div id="ludo-name-section" style="display:none">
          <div class="ludo-setup-divider">Enter Player Names</div>
          <div id="ludo-name-inputs"></div>
          <button class="btn btn-primary btn-lg ludo-start-btn"
            onclick="LudoGame._startGame()">🎲 Start Game!</button>
        </div>

        <div style="margin-top:18px;padding-top:16px;border-top:2px dashed #e5e7eb;text-align:center">
          <div style="font-size:.78rem;color:#aaa;font-weight:700;margin-bottom:10px;
                      text-transform:uppercase;letter-spacing:.06em">— or play online —</div>
          <button onclick="LudoGame._startVsFriend()"
                  style="background:linear-gradient(135deg,#6366f1,#a855f7);color:#fff;border:none;
                         border-radius:14px;padding:14px 28px;font-size:1rem;font-weight:800;
                         cursor:pointer;font-family:'Fredoka One',cursive;width:100%;
                         transition:opacity .2s"
                  onmouseover="this.style.opacity='.85'" onmouseout="this.style.opacity='1'">
            🤝 vs Friend Online
          </button>
          <p style="font-size:.75rem;color:#aaa;margin-top:8px;font-weight:600">
            🔑 Sign in required for online play
          </p>
        </div>
      </div>`;

    // Store defaults
    setupEl._loggedName = loggedName;
    setupEl._gameMode   = 'kids';
  }

  function _selectGameMode(mode) {
    window.SFX?.play('click');
    const setupEl = document.getElementById('ludo-setup');
    if (setupEl) setupEl._gameMode = mode;

    const kBtn = document.getElementById('ludo-gm-kids');
    const cBtn = document.getElementById('ludo-gm-classic');
    if (kBtn) kBtn.classList.toggle('selected', mode === 'kids');
    if (cBtn) cBtn.classList.toggle('selected', mode === 'classic');
  }

  function _selectMode(mode) {
    window.SFX?.play('click');

    // Highlight selected button
    [1,2,3,4].forEach(m => {
      const b = document.getElementById(`ludo-mode-${m}`);
      if (b) b.classList.toggle('ludo-mode-selected', m === mode);
    });

    const section  = document.getElementById('ludo-name-section');
    const inputsEl = document.getElementById('ludo-name-inputs');
    if (!section || !inputsEl) return;
    section.style.display = 'block';

    const loggedName = document.getElementById('ludo-setup')?._loggedName || '';

    /* Slot definitions per mode
       Mode 1: P1 = Blue + Red, CPU = Green + Yellow
       Mode 2: P1 = Blue + Red, P2  = Green + Yellow
       Mode 3: P1 = Blue, P2 = Red, P3 = Green, CPU = Yellow
       Mode 4: P1 = Blue, P2 = Red, P3 = Green, P4  = Yellow  */
    const slotDefs = {
      1: [{ label:'Player 1', colors:['blue','red'],     prefill: loggedName }],
      2: [{ label:'Player 1', colors:['blue','red'],     prefill: loggedName },
          { label:'Player 2', colors:['green','yellow'], prefill: '' }],
      3: [{ label:'Player 1', colors:['blue'],  prefill: loggedName },
          { label:'Player 2', colors:['red'],   prefill: '' },
          { label:'Player 3', colors:['green'], prefill: '' }],
      4: [{ label:'Player 1', colors:['blue'],   prefill: loggedName },
          { label:'Player 2', colors:['red'],    prefill: '' },
          { label:'Player 3', colors:['green'],  prefill: '' },
          { label:'Player 4', colors:['yellow'], prefill: '' }]
    };

    const slots = slotDefs[mode];
    inputsEl.innerHTML = slots.map((s, i) => `
      <div class="ludo-name-row">
        <div class="ludo-name-chips">
          ${s.colors.map(c =>
            `<span class="ludo-chip ludo-chip-${c}">${COLOR_CONFIG[c].emoji} ${COLOR_CONFIG[c].label}</span>`
          ).join('')}
        </div>
        <div style="flex:1">
          <input type="text" class="ludo-name-input" id="ludo-inp-${i}"
            placeholder="${s.label}'s name"
            value="${s.prefill || ''}" maxlength="18" autocomplete="off"/>
          <div class="ludo-token-row" id="ludo-tok-${i}">
            ${TOKENS.map((t, ti) => `<button class="ludo-token-btn${ti === i % TOKENS.length ? ' active' : ''}"
              onclick="LudoGame._selectToken(${i},${ti})">${t}</button>`).join('')}
          </div>
        </div>
      </div>`).join('');

    // Store mode + slots for _startGame
    const setupEl2 = document.getElementById('ludo-setup');
    setupEl2._mode   = mode;
    setupEl2._slots  = slots;
    setupEl2._tokens = {};  // reset token choices on mode change
    // Set defaults: slot i → token at index i
    slots.forEach((_, i) => { setupEl2._tokens[i] = i % TOKENS.length; });
  }

  function _selectToken(slotIdx, tokenIdx) {
    window.SFX?.play('click');
    const setupEl = document.getElementById('ludo-setup');
    if (!setupEl._tokens) setupEl._tokens = {};
    setupEl._tokens[slotIdx] = tokenIdx;
    const row = document.getElementById(`ludo-tok-${slotIdx}`);
    if (row) {
      row.querySelectorAll('.ludo-token-btn').forEach((btn, i) => {
        btn.classList.toggle('active', i === tokenIdx);
      });
    }
  }

  function _startGame() {
    window.SFX?.play('click');
    const setupEl  = document.getElementById('ludo-setup');
    const mode     = setupEl?._mode;
    const slots    = setupEl?._slots;
    const gameMode = setupEl?._gameMode || 'kids';
    if (!mode || !slots) return;

    // Build player array
    const players = slots.map((s, i) => {
      const raw  = document.getElementById(`ludo-inp-${i}`)?.value.trim();
      const name = raw || s.label;
      return { name, colors: s.colors, isComputer: false };
    });

    // Add CPU player(s)
    if (mode === 1) players.push({ name: 'Computer', colors: ['green','yellow'], isComputer: true });
    if (mode === 3) players.push({ name: 'Computer', colors: ['yellow'],          isComputer: true });

    // Build playerTokens map: color → chosen token emoji
    const rawTokens = setupEl._tokens || {};
    const playerTokens = {};
    slots.forEach((s, i) => {
      const tokenIdx = rawTokens[i] !== undefined ? rawTokens[i] : i % TOKENS.length;
      s.colors.forEach(c => { playerTokens[c] = TOKENS[tokenIdx]; });
    });
    // CPU players get the next available token
    const cpuOffset = slots.length;
    players.filter(p => p.isComputer).forEach((cpuP, j) => {
      const tokenIdx = (cpuOffset + j) % TOKENS.length;
      cpuP.colors.forEach(c => { playerTokens[c] = TOKENS[tokenIdx]; });
    });

    // Update corner labels
    _updateLabels(players);

    // Switch views
    setupEl.style.display = 'none';
    const gameArea = document.getElementById('ludo-game-area');
    if (gameArea) gameArea.style.display = 'block';

    _startGameState(players, gameMode, playerTokens);
  }

  function _updateLabels(players) {
    const colorOwner = {};
    players.forEach(p => p.colors.forEach(c => { colorOwner[c] = p.name; }));

    const ids = { green:'ludo-label-green', yellow:'ludo-label-yellow',
                  blue:'ludo-label-blue',   red:'ludo-label-red' };
    Object.entries(ids).forEach(([color, id]) => {
      const el = document.getElementById(id);
      if (el) el.textContent = `${COLOR_CONFIG[color].emoji} ${colorOwner[color] || COLOR_CONFIG[color].label}`;
    });

    // Update player info bar
    const infoEl = document.getElementById('ludo-player-info');
    if (infoEl) {
      infoEl.innerHTML = players.map(p =>
        `<span class="ludo-pinfo-item">
          ${p.colors.map(c =>
            `<span class="ludo-pinfo-dot" style="background:${COLOR_CONFIG[c].css}"></span>`
          ).join('')}
          <span class="ludo-pinfo-name">${p.name}${p.isComputer ? ' 🤖' : ''}</span>
        </span>`
      ).join('');
    }
  }

  /* ════════════════════════════════════════════════════════════
     GAME STATE
  ════════════════════════════════════════════════════════════ */
  function _startGameState(players, gameMode, playerTokens) {
    const pieces = {};
    ['blue','yellow','green','red'].forEach(c => { pieces[c] = [-1,-1,-1,-1]; });

    state = {
      pieces,
      players,
      activeColors: players.flatMap(p => p.colors),
      turnIdx:      0,
      die:          null,
      rolled:       false,
      moving:       false,
      over:         false,
      startTime:    Date.now(),
      totalMoves:   0,
      gameMode:     gameMode || 'kids',
      placements:   [],   // finish order: [{ name, colors, isComputer, place }]
      playerTokens: playerTokens || {}
    };

    // Update mode badge and legend
    const badge = document.getElementById('ludo-mode-badge');
    if (badge) {
      badge.textContent = state.gameMode === 'kids' ? '🌟 Kids Mode' : '🎯 Classic';
    }
    const legendEntry = document.getElementById('ludo-legend-entry');
    if (legendEntry) {
      legendEntry.textContent = state.gameMode === 'kids'
        ? '🌟 Enter on 1 or 6!'
        : '🎯 Roll 6 to enter!';
    }

    buildBoard();
    renderPieces();
    enableRoll(false);
    updateFinishedDisplay();

    const cp = _cp();
    _setDiceColor(cp.colors[0]);
    _highlightActiveHome(cp.colors[0]);

    if (cp.isComputer) {
      setStatus('🤖 Computer is thinking…', 'gray');
      setTimeout(computerTurn, 900);
    } else {
      setStatus(`${_pEmoji(cp)} ${cp.name}'s turn — roll the dice!`, cp.colors[0]);
      enableRoll(true);
    }
  }

  // shorthand helpers
  function _cp()     { return state.players[state.turnIdx]; }
  function _pEmoji(p){ return p.colors.map(c => COLOR_CONFIG[c].emoji).join(''); }

  /* ════════════════════════════════════════════════════════════
     ACTIVE HOME HIGHLIGHT
  ════════════════════════════════════════════════════════════ */
  function _highlightActiveHome(color) {
    // Remove from all
    ['blue','yellow','green','red'].forEach(c => {
      document.querySelectorAll(`.lc-home-${c}`).forEach(el => el.classList.remove('lc-home-active'));
    });
    // Add to current
    if (color) {
      document.querySelectorAll(`.lc-home-${color}`).forEach(el => el.classList.add('lc-home-active'));
    }
  }

  /* ════════════════════════════════════════════════════════════
     BUILD 15×15 BOARD
  ════════════════════════════════════════════════════════════ */
  function buildBoard() {
    const board = document.getElementById('ludo-board');
    if (!board) return;
    board.innerHTML = '';

    const trackSet  = new Set(MAIN_TRACK.map(([c,r]) => `${c},${r}`));
    const homeColSet = {
      blue:   new Set(BLUE_HOME.map(([c,r])   => `${c},${r}`)),
      yellow: new Set(YELLOW_HOME.map(([c,r]) => `${c},${r}`)),
      green:  new Set(GREEN_HOME.map(([c,r])  => `${c},${r}`)),
      red:    new Set(RED_HOME.map(([c,r])    => `${c},${r}`))
    };

    const starterSet = new Set([
      '2,11','3,11','2,12','3,12',    // Blue   (middle of inner area)
      '11,2','12,2','11,3','12,3',    // Yellow
      '2,2', '3,2', '2,3', '3,3',    // Green
      '11,11','12,11','11,12','12,12' // Red
    ]);

    // Cross/plus pattern — centre 3×3 minus 4 corner cells that are track cells
    //   T Y T       (T = track cell [6,6],[8,6],[6,8],[8,8])
    //   G ★ R
    //   T B T
    const centerColorMap = {
      '7,6':'lc-center-yellow',
      '6,7':'lc-center-green',  '7,7':'lc-center-star',   '8,7':'lc-center-red',
      '7,8':'lc-center-blue'
    };

    for (let row = 0; row < 15; row++) {
      for (let col = 0; col < 15; col++) {
        const cell = document.createElement('div');
        cell.id    = `lc-${col}-${row}`;
        cell.className = 'lc';
        const key  = `${col},${row}`;

        // ── Centre 3×3 (cross pattern — skip corners that are track cells)
        if (row >= 6 && row <= 8 && col >= 6 && col <= 8 && !trackSet.has(key)) {
          cell.classList.add('lc-center');
          const cc = centerColorMap[key];
          if (cc) cell.classList.add(cc);
          if (row === 7 && col === 7) { cell.classList.add('lc-center-star'); cell.textContent = '⭐'; }

        // ── Home zones (6×6 corners)
        } else if (row >= 9 && row <= 14 && col >= 0 && col <= 5) {  // Blue  BL
          cell.classList.add('lc-home-blue');
          if (starterSet.has(key))                                         cell.classList.add('lc-starter');
          else if (row >= 10 && row <= 13 && col >= 1 && col <= 4)         cell.classList.add('lc-home-inner');

        } else if (row >= 9 && row <= 14 && col >= 9 && col <= 14) {  // Red   BR
          cell.classList.add('lc-home-red');
          if (starterSet.has(key))                                         cell.classList.add('lc-starter');
          else if (row >= 10 && row <= 13 && col >= 10 && col <= 13)       cell.classList.add('lc-home-inner');

        } else if (row >= 0 && row <= 5 && col >= 9 && col <= 14) {   // Yellow TR
          cell.classList.add('lc-home-yellow');
          if (starterSet.has(key))                                         cell.classList.add('lc-starter');
          else if (row >= 1 && row <= 4 && col >= 10 && col <= 13)         cell.classList.add('lc-home-inner');

        } else if (row >= 0 && row <= 5 && col >= 0 && col <= 5) {    // Green  TL
          cell.classList.add('lc-home-green');
          if (starterSet.has(key))                                         cell.classList.add('lc-starter');
          else if (row >= 1 && row <= 4 && col >= 1 && col <= 4)           cell.classList.add('lc-home-inner');

        // ── Home columns
        } else if (homeColSet.blue.has(key)) {
          cell.classList.add('lc-track', 'lc-homecol-blue');
        } else if (homeColSet.yellow.has(key)) {
          cell.classList.add('lc-track', 'lc-homecol-yellow');
        } else if (homeColSet.green.has(key)) {
          cell.classList.add('lc-track', 'lc-homecol-green');
        } else if (homeColSet.red.has(key)) {
          cell.classList.add('lc-track', 'lc-homecol-red');

        // ── Main track
        } else if (trackSet.has(key)) {
          const trackIdx = MAIN_TRACK.findIndex(([c,r]) => c === col && r === row);
          cell.classList.add('lc-track');
          // Colour entry + doorstep squares with their player's colour
          if (ENTRY_CLASS[trackIdx]) {
            cell.classList.add(ENTRY_CLASS[trackIdx]);
            cell.textContent = '★';   // safe-square star marker
          }

        // ── Empty (grey filler)
        } else {
          cell.classList.add('lc-empty');
        }

        board.appendChild(cell);
      }
    }
  }

  /* ════════════════════════════════════════════════════════════
     RENDER PIECES
  ════════════════════════════════════════════════════════════ */
  function renderPieces() {
    document.querySelectorAll('.lc-piece').forEach(el => el.remove());

    const cp = _cp();
    const isHumanReady = !cp.isComputer && state.rolled && !state.moving;

    state.activeColors.forEach(color => {
      state.pieces[color].forEach((pos, pi) => {
        if (pos === 60) return; // fully home
        let col, row;
        if (pos === -1) {
          [col, row] = PIECE_STARTS[color][pi];
        } else if (pos <= 54) {
          [col, row] = MAIN_TRACK[(COLOR_ENTRY[color] + pos) % 56];
        } else if (pos <= 59) {
          [col, row] = HOME_COLS[color][pos - 55];
        } else return;

        const clickable = isHumanReady &&
                          cp.colors.includes(color) &&
                          getMoveable(color, state.die).includes(pi);
        placePiece(col, row, color, pi, clickable);
      });
    });
  }

  function placePiece(col, row, color, pi, clickable) {
    const cell = document.getElementById(`lc-${col}-${row}`);
    if (!cell) return;
    const token = document.createElement('div');
    token.className = `lc-piece lc-piece-${color}`;
    // Show token icon inside piece (use player-chosen token if available)
    const tok = state.playerTokens?.[color] || TOKENS[Object.keys(COLOR_CONFIG).indexOf(color) % TOKENS.length];
    token.innerHTML = `<span style="font-size:.55em;line-height:1">${tok}</span>`;
    const owner = state.players?.find(p => p.colors.includes(color));
    token.title = `${owner?.name || color} — piece ${pi + 1}`;
    if (clickable) {
      token.classList.add('lc-piece-selectable');
      token.onclick = () => _selectPiece(color, pi);
    }
    cell.appendChild(token);
  }

  /* ════════════════════════════════════════════════════════════
     ROLL DICE  (human)
  ════════════════════════════════════════════════════════════ */
  async function rollDice() {
    const cp = _cp();
    if (cp.isComputer || state.rolled || state.moving || state.over) return;
    window.SFX?.play('click');
    enableRoll(false);

    const die = await animateDice();
    state.die    = die;
    state.rolled = true;
    state.totalMoves++;

    // Collect all moveable pieces across all of this player's colors
    const moveMap = {};
    let total = 0;
    cp.colors.forEach(color => {
      const m = getMoveable(color, die);
      moveMap[color] = m;
      total += m.length;
    });

    if (total === 0) {
      setStatus(`${_pEmoji(cp)} ${cp.name} rolled ${die} — no moves. Next player!`, cp.colors[0]);
      await pause(800);
      endTurn(die !== 6);
    } else if (total === 1) {
      const [autoColor] = Object.entries(moveMap).find(([,m]) => m.length > 0);
      await movePiece(autoColor, moveMap[autoColor][0], die);
    } else {
      setStatus(`${_pEmoji(cp)} ${cp.name} rolled ${die}! Tap a piece to move.`, cp.colors[0]);
      renderPieces();
    }
  }

  function _selectPiece(color, pi) {
    const cp = _cp();
    if (!state.rolled || state.moving || cp.isComputer) return;
    window.SFX?.play('click');
    movePiece(color, pi, state.die);
  }

  /* ════════════════════════════════════════════════════════════
     MOVE PIECE
  ════════════════════════════════════════════════════════════ */
  async function movePiece(color, pi, die) {
    state.moving = true;
    const pieces  = state.pieces[color];
    const pos     = pieces[pi];
    const cp      = _cp();
    const ce      = COLOR_CONFIG[color].emoji;

    const canEnter = state.gameMode === 'kids' ? (die === 1 || die === 6) : die === 6;

    if (pos === -1 && canEnter) {
      // Enter the board
      pieces[pi] = 0;
      renderPieces();
      setStatus(`${ce} ${cp.name} enters the board!`, color);
      window.SFX?.play('click');
      await pause(600);
      checkCapture(color, pi);

    } else if (pos >= 0) {
      const newPos = pos + die;
      if (newPos > 59) {
        // Would overshoot home column — skip
        setStatus(`${ce} ${cp.name} rolled ${die} — would overshoot! Stay.`, color);
        await pause(700);
      } else {
        // Animate step by step
        for (let step = 1; step <= die; step++) {
          pieces[pi] = pos + step;
          renderPieces();
          await pause(700);
        }
        if (newPos === 59) {
          pieces[pi] = 60;
          renderPieces();
          window.SFX?.play('win');
          setStatus(`${ce} ${cp.name} gets a piece home! 🏠`, color);
          await pause(600);
          if (checkWin()) { state.moving = false; return; }
        } else {
          checkCapture(color, pi);
        }
      }
    }

    state.moving = false;
    endTurn(die !== 6);
  }

  /* ════════════════════════════════════════════════════════════
     TURN MANAGEMENT
  ════════════════════════════════════════════════════════════ */
  function endTurn(switchPlayer) {
    state.rolled = false;
    state.die    = null;

    if (!switchPlayer) {
      // Rolled 6 — same player goes again
      const cp = _cp();
      _setDiceColor(cp.colors[0]);
      _highlightActiveHome(cp.colors[0]);
      if (cp.isComputer) {
        setStatus('🤖 Computer rolled 6 — goes again!', 'gray');
        setTimeout(computerTurn, 700);
      } else {
        setStatus(`${_pEmoji(cp)} ${cp.name} rolled 6 — roll again!`, cp.colors[0]);
        enableRoll(true);
      }
      return;
    }

    // Advance turn index — skip players who have already finished
    let attempts = 0;
    do {
      state.turnIdx = (state.turnIdx + 1) % state.players.length;
      attempts++;
    } while (
      state.placements.find(pl => pl.name === _cp().name && pl.colors[0] === _cp().colors[0]) &&
      attempts < state.players.length
    );

    if (state.over) return; // all players placed, game ended in recordPlacement

    const next = _cp();
    _setDiceColor(next.colors[0]);
    _highlightActiveHome(next.colors[0]);

    if (next.isComputer) {
      setStatus('🤖 Computer is thinking…', 'gray');
      setTimeout(computerTurn, 900);
    } else {
      setStatus(`${_pEmoji(next)} ${next.name}'s turn — roll the dice!`, next.colors[0]);
      enableRoll(true);
    }
  }

  /* ════════════════════════════════════════════════════════════
     COMPUTER AI
  ════════════════════════════════════════════════════════════ */
  async function computerTurn() {
    if (state.over) return;
    const cp = _cp();
    if (!cp.isComputer) return;

    const die = await animateDice();
    setStatus(`🤖 Computer rolled ${die}`, 'gray');
    await pause(400);

    // Score every possible move across all computer colors
    let best = null, bestScore = -Infinity;
    cp.colors.forEach(color => {
      getMoveable(color, die).forEach(pi => {
        const score = _aiScore(color, pi, die);
        if (score > bestScore) { bestScore = score; best = { color, pi }; }
      });
    });

    if (!best) {
      setStatus('🤖 Computer rolled ' + die + ' — no moves!', 'gray');
      await pause(700);
      endTurn(die !== 6);
      return;
    }

    await movePiece(best.color, best.pi, die);
  }

  function _aiScore(color, pi, die) {
    const pos   = state.pieces[color][pi];
    const after = pos === -1 ? 0 : pos + die;
    if (after > 54) return 100 + after; // entering home col = great

    const absAfter = (COLOR_ENTRY[color] + after) % 56;

    // Big bonus for capturing an enemy
    let bonus = 0;
    state.players.forEach(p => {
      if (p === _cp()) return; // skip own team
      p.colors.forEach(ec => {
        state.pieces[ec].forEach(ep => {
          if (ep < 0 || ep > 54) return;
          if ((COLOR_ENTRY[ec] + ep) % 56 === absAfter && !SAFE.has(absAfter)) bonus = 60;
        });
      });
    });

    return after + bonus;
  }

  /* ════════════════════════════════════════════════════════════
     CAPTURE LOGIC
  ════════════════════════════════════════════════════════════ */
  function checkCapture(moverColor, moverPi) {
    const pos = state.pieces[moverColor][moverPi];
    if (pos < 0 || pos > 54) return;
    const moverAbs = (COLOR_ENTRY[moverColor] + pos) % 56;
    if (SAFE.has(moverAbs)) return;

    const moverPlayer = state.players.find(p => p.colors.includes(moverColor));

    state.activeColors.forEach(victimColor => {
      if (victimColor === moverColor) return;
      // Skip teammates (same player owns both colors)
      if (state.players.find(p => p.colors.includes(victimColor)) === moverPlayer) return;

      state.pieces[victimColor].forEach((vp, vi) => {
        if (vp < 0 || vp > 54) return;
        if ((COLOR_ENTRY[victimColor] + vp) % 56 === moverAbs) {
          state.pieces[victimColor][vi] = -1;
          window.SFX?.play('opponent_move');

          // Enhanced capture message
          setStatus(
            `💥 ${COLOR_CONFIG[moverColor].emoji} got one! ${COLOR_CONFIG[victimColor].emoji} Back to home! 🏠`,
            moverColor
          );

          // Brief flash on the current cell
          const [flashCol, flashRow] = MAIN_TRACK[moverAbs];
          const flashCell = document.getElementById(`lc-${flashCol}-${flashRow}`);
          if (flashCell) {
            flashCell.classList.add('lc-capture-flash');
            setTimeout(() => flashCell.classList.remove('lc-capture-flash'), 600);
          }
        }
      });
    });
    renderPieces();
  }

  /* ════════════════════════════════════════════════════════════
     WIN DETECTION
  ════════════════════════════════════════════════════════════ */
  function checkWin() {
    for (const player of state.players) {
      // Skip already-placed players
      if (state.placements.find(pl => pl.name === player.name && pl.colors[0] === player.colors[0])) continue;
      if (player.colors.every(c => state.pieces[c].every(p => p === 60))) {
        recordPlacement(player);
        return true;
      }
    }
    return false;
  }

  function recordPlacement(player) {
    const place = state.placements.length + 1;
    state.placements.push({ name: player.name, colors: player.colors, isComputer: player.isComputer, place });

    const medals  = ['🥇','🥈','🥉','🏅'];
    const medal   = medals[place - 1] || `#${place}`;
    const colStr  = player.colors.map(c => COLOR_CONFIG[c].emoji).join('');
    const ordinal = place === 1 ? '1st' : place === 2 ? '2nd' : place === 3 ? '3rd' : place + 'th';
    window.SFX?.play('win');
    setStatus(`${medal} ${player.name} finished in ${ordinal} place! ${colStr} All pieces home!`, player.colors[0]);

    // Count unfinished players
    const unfinished = state.players.filter(p =>
      !state.placements.find(pl => pl.name === p.name && pl.colors[0] === p.colors[0])
    );

    if (unfinished.length === 0) {
      // All done
      state.over = true;
      confettiEffect();
      showFinalRankings();
    } else if (unfinished.length === 1) {
      // Last player gets last place automatically
      const last = unfinished[0];
      state.placements.push({ name: last.name, colors: last.colors, isComputer: last.isComputer, place: state.placements.length + 1 });
      state.over = true;
      confettiEffect();
      showFinalRankings();
    }
    // else: game continues — endTurn() will handle advancing to next player
  }

  async function showFinalRankings() {
    enableRoll(false);
    const elapsed = Math.round((Date.now() - state.startTime) / 1000);
    const mm = Math.floor(elapsed / 60), ss = String(elapsed % 60).padStart(2, '0');
    const timeStr = `${mm}:${ss}`;
    const medals  = ['🥇','🥈','🥉','🏅'];
    const winner  = state.placements[0];
    const colStr  = winner.colors.map(c => COLOR_CONFIG[c].emoji).join('');

    const overlay = document.getElementById('ludo-end');
    if (overlay) {
      overlay.style.display = 'flex';
      document.getElementById('ludo-end-icon').textContent  = colStr;
      document.getElementById('ludo-end-title').textContent = `🏆 ${winner.name} Wins!`;

      // Build rankings table
      const rankHtml = state.placements.map((pl, i) => {
        const plColStr = pl.colors.map(c => COLOR_CONFIG[c].emoji).join('');
        const tok = TOKENS[Object.keys(COLOR_CONFIG).indexOf(pl.colors[0]) % TOKENS.length];
        return `
          <div style="display:flex;align-items:center;gap:10px;padding:9px 14px;
               border-radius:12px;background:${i === 0 ? 'linear-gradient(135deg,#fef9c3,#fde68a)' : '#f9fafb'};
               margin-bottom:6px;border:2px solid ${i === 0 ? '#f59e0b' : '#e5e7eb'}">
            <span style="font-size:1.5rem">${medals[i] || '#' + (i + 1)}</span>
            <span style="font-size:1.3rem">${tok}</span>
            <span style="font-size:1.1rem">${plColStr}</span>
            <span style="font-weight:800;font-size:.95rem;flex:1">${pl.name}${pl.isComputer ? ' 🤖' : ''}</span>
            <span style="font-size:.8rem;color:#6b7280">${i === 0 ? '🏆 Winner!' : i === state.placements.length - 1 ? '😊 Good game!' : '👏 Well played!'}</span>
          </div>`;
      }).join('');

      document.getElementById('ludo-end-msg').innerHTML  = rankHtml;
      document.getElementById('ludo-end-stats').innerHTML = `<span>Moves: ${state.totalMoves}</span><span>Time: ${timeStr}</span>`;
    }

    // Save result for first human who placed
    const firstHuman = state.placements.find(pl => !pl.isComputer);
    if (firstHuman) {
      await saveResult({
        gameType: 'ludo',
        outcome:  firstHuman.place === 1 ? 'win' : 'lose',
        level:    'all',
        moves:    state.totalMoves,
        duration: elapsed,
        timeStr
      });
    }
  }

  function confettiEffect() {
    const colors = ['#ef4444','#3b82f6','#22c55e','#f59e0b','#a855f7','#ec4899'];
    for (let i = 0; i < 35; i++) {
      const el = document.createElement('div');
      el.style.cssText = `position:fixed;width:10px;height:10px;border-radius:2px;
        left:${Math.random()*100}vw;top:-10px;z-index:9999;pointer-events:none;
        background:${colors[Math.floor(Math.random()*colors.length)]};
        animation:ludoConfetti ${1.5+Math.random()*2}s linear ${Math.random()*1}s forwards`;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 4000);
    }
  }

  /* ════════════════════════════════════════════════════════════
     HELPERS
  ════════════════════════════════════════════════════════════ */
  function getMoveable(color, die) {
    return state.pieces[color].reduce((acc, pos, pi) => {
      if (pos === 60) return acc;
      // Enter board: Kids Mode allows 1 or 6, Classic allows only 6
      const canEnter = state.gameMode === 'kids' ? (die === 1 || die === 6) : die === 6;
      if (pos === -1 && canEnter) { acc.push(pi); return acc; }
      if (pos === -1) return acc;
      if (pos + die <= 59) acc.push(pi);
      return acc;
    }, []);
  }

  function updateFinishedDisplay() {
    const el = document.getElementById('ludo-finished');
    if (!el || !state.activeColors) return;
    el.innerHTML = state.activeColors.map(color => {
      const n = state.pieces[color].filter(p => p === 60).length;
      return `${COLOR_CONFIG[color].emoji} ${Array.from({length:4},(_,i)=>i<n?'🏠':'⬜').join('')}`;
    }).join(' &nbsp; ');
  }

  function animateDice() {
    return new Promise(resolve => {
      const el1    = document.getElementById('ludo-dice-val');
      const el2    = document.getElementById('ludo-dice-val-2');
      const faces  = ['⚀','⚁','⚂','⚃','⚄','⚅'];
      const result = Math.floor(Math.random() * 6) + 1;
      // Randomly 3 or 6 seconds
      const totalMs = Math.random() < 0.5 ? 3000 : 6000;
      const start   = Date.now();
      let   lastSound = Date.now();

      [el1, el2].forEach(el => { if (el) el.classList.add('dice-rolling'); });
      window.SFX?.play('click');

      function tick() {
        const elapsed  = Date.now() - start;
        const progress = Math.min(elapsed / totalMs, 1);

        if (progress >= 1) {
          [el1, el2].forEach(el => {
            if (el) { el.classList.remove('dice-rolling'); el.textContent = faces[result - 1]; }
          });
          resolve(result);
          return;
        }

        if (el1) el1.textContent = faces[Math.floor(Math.random() * 6)];
        if (el2) el2.textContent = faces[Math.floor(Math.random() * 6)];

        // Tap sound every ~380ms
        if (Date.now() - lastSound > 380) {
          window.SFX?.play('click');
          lastSound = Date.now();
        }

        // Ease-out: starts at 55ms, slows to 280ms
        const delay = Math.round(55 + progress * progress * 225);
        setTimeout(tick, delay);
      }

      tick();
    });
  }

  function _setDiceColor(color) {
    const split = document.getElementById('ludo-dice-split');
    if (!split) return;
    split.className = 'ludo-dice-split';
    if (color) split.classList.add(`ludo-dice-${color}`);
  }

  function setStatus(msg, colour) {
    const el = document.getElementById('ludo-status');
    if (!el) return;
    el.textContent = msg;
    el.style.color =
      colour === 'blue'   ? '#1e40af' :
      colour === 'yellow' ? '#a16207' :
      colour === 'green'  ? '#166534' :
      colour === 'red'    ? '#991b1b' : '#374151';
  }

  function enableRoll(on) {
    const btn = document.getElementById('ludo-roll-btn');
    if (btn) {
      btn.disabled = !on;
      btn.style.opacity = on ? '1' : '0.45';
      if (on) {
        const cp = _cp();
        btn.textContent = `🎲 ${cp ? cp.name + "'s Roll!" : 'Roll Dice!'}`;
      }
    }
  }

  function pause(ms) { return new Promise(r => setTimeout(r, ms)); }

  function hideLoading() {
    const ol = document.getElementById('loading-overlay');
    if (ol) ol.classList.add('hidden');
  }

  function restartGame() {
    window.SFX?.play('click');
    document.getElementById('ludo-end').style.display = 'none';
    const d1 = document.getElementById('ludo-dice-val');
    const d2 = document.getElementById('ludo-dice-val-2');
    if (d1) d1.textContent = '🎲';
    if (d2) d2.textContent = '🎲';
    _setDiceColor(null);
    init(); // back to setup screen
  }

  function _startVsFriend() {
    if (typeof firebase !== 'undefined' && firebase.auth().currentUser) {
      window.location.href = 'ludo-multi.html';
    } else {
      window.location.href = '../login.html';
    }
  }

  return { init, rollDice, restartGame, _selectPiece, _selectMode, _selectGameMode, _selectToken, _startGame, _startVsFriend, _setDiceColor };
})();

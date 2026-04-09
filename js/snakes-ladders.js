// Happy Games – Snakes & Ladders Adventure (multi-player rewrite)
'use strict';

const SnakesLadders = (() => {

  /* ── 5 board configurations ─────────────────────────────────── */
  const BOARD_CONFIGS = [
    {
      name: 'Classic', emoji: '🏁',
      snakes:  { 99:78, 95:75, 93:73, 87:24, 64:60, 62:19, 49:11, 47:26, 16:6 },
      ladders: { 4:14,  9:31, 20:38, 28:84, 40:59, 51:67, 63:81, 71:91 }
    },
    {
      name: 'Lucky', emoji: '🍀',
      snakes:  { 98:54, 92:68, 77:43, 55:34, 42:17, 31:5 },
      ladders: { 3:22,  8:30, 15:44, 25:76, 37:62, 47:83, 57:88, 68:93 }
    },
    {
      name: 'Snakefest', emoji: '🐍',
      snakes:  { 99:45, 96:72, 93:12, 88:30, 85:7, 74:51, 66:23, 53:18, 41:8, 27:3 },
      ladders: { 6:25, 19:60, 35:78, 58:91 }
    },
    {
      name: 'Zigzag', emoji: '⚡',
      snakes:  { 96:37, 82:58, 76:24, 69:46, 54:29, 43:9, 28:13 },
      ladders: { 5:18, 12:39, 21:56, 33:68, 44:72, 65:85, 75:92 }
    },
    {
      name: 'Easy Rider', emoji: '🌈',
      snakes:  { 97:75, 84:59, 63:37 },
      ladders: { 2:16, 7:23, 11:35, 18:46, 24:57, 32:65, 38:72, 52:83, 61:89, 70:95 }
    }
  ];

  // One distinct colour per snake — NO blue or red (reserved for player pieces)
  const SNAKE_COLORS = [
    '#38a169',  // forest green
    '#dd6b20',  // burnt orange
    '#805ad5',  // violet
    '#319795',  // teal
    '#d53f8c',  // hot pink
    '#d69e2e',  // golden
    '#0f766e',  // dark teal
    '#a16207',  // dark amber
    '#9d174d'   // deep magenta
  ];

  /* ── Vibrant cycling tile palette — NO blue or red ─────────── */
  const CELL_COLORS = [
    '#ffc0cb',  // pink
    '#ffd59e',  // peach
    '#fff176',  // yellow
    '#a8e6cf',  // mint green
    '#fde68a',  // warm amber
    '#ddb3ff',  // lavender
    '#d9f99d',  // lime green
    '#b3f0ee'   // aqua
  ];

  /* ── Token choices ──────────────────────────────────────────── */
  const TOKENS = ['🐒','🐯','🐰','🦖','🚗','🐻','🦄','🤖'];

  /* ── Player color slots ─────────────────────────────────────── */
  const PLAYER_COLORS = [
    { name: 'blue',   hex: '#3b82f6' },
    { name: 'red',    hex: '#ef4444' },
    { name: 'green',  hex: '#22c55e' },
    { name: 'purple', hex: '#a855f7' }
  ];

  /* ── Active board ───────────────────────────────────────────── */
  let SNAKES  = BOARD_CONFIGS[0].snakes;
  let LADDERS = BOARD_CONFIGS[0].ladders;
  let selectedBoardIdx = 0;

  /* ── Game state ─────────────────────────────────────────────── */
  let players         = [];  // { name, pos, token, isComputer, colorName, colorHex }
  let currentPlayerIdx = 0;
  let rolling         = false;
  let gameOver        = false;
  let startTime       = null;
  let totalMoves      = 0;

  /* ── Setup-screen transient state ───────────────────────────── */
  let _selectedMode   = null;   // '1cpu' | '2p' | '3cpu' | '4p'
  let _chosenTokens   = [];     // token emoji per slot
  let _numSlots       = 0;

  /* ═══════════════════════════════════════════════════════════════
     PUBLIC init
  ═══════════════════════════════════════════════════════════════ */
  function init() {
    hideLoading();
    _showSetup();
  }

  /* ═══════════════════════════════════════════════════════════════
     SETUP SCREEN
  ═══════════════════════════════════════════════════════════════ */
  function _showSetup() {
    // Reset game state
    players          = [];
    currentPlayerIdx = 0;
    rolling          = false;
    gameOver         = false;
    totalMoves       = 0;
    _selectedMode    = null;
    _chosenTokens    = [];

    const setupEl = document.getElementById('sl-setup');
    const gameEl  = document.getElementById('sl-game');
    if (setupEl) setupEl.style.display = 'block';
    if (gameEl)  gameEl.style.display  = 'none';

    _renderSetupCard();
  }

  function _renderSetupCard() {
    const setupEl = document.getElementById('sl-setup');
    if (!setupEl) return;

    // Board picker buttons
    const boardBtns = BOARD_CONFIGS.map((b, i) => `
      <button class="sl-board-pick-btn ${i === selectedBoardIdx ? 'active' : ''}"
              onclick="SnakesLadders._selectBoard(${i})">
        ${b.emoji} ${b.name}
      </button>`).join('');

    const board = BOARD_CONFIGS[selectedBoardIdx];
    const snakeCount  = Object.keys(board.snakes).length;
    const ladderCount = Object.keys(board.ladders).length;

    // Mode buttons
    const modes = [
      { id: '1cpu', icon: '🖥️', label: '1P vs CPU',     desc: 'Solo vs Computer' },
      { id: '2p',   icon: '👥', label: '2 Players',      desc: 'Two humans' },
      { id: '3cpu', icon: '🎮', label: '3 Players+CPU',  desc: 'Two humans + CPU' },
      { id: '4p',   icon: '🎉', label: '4 Players',      desc: 'Four humans' }
    ];
    const modeBtns = modes.map(m => `
      <button class="sl-mode-btn ${_selectedMode === m.id ? 'sl-mode-selected' : ''}"
              onclick="SnakesLadders._selectMode('${m.id}')">
        <span class="sl-mode-icon">${m.icon}</span>
        <span class="sl-mode-label">${m.label}</span>
        <span class="sl-mode-desc">${m.desc}</span>
      </button>`).join('');

    // Player name + token rows (only if mode selected)
    const playerRowsHtml = _selectedMode ? _buildPlayerRows() : '';

    setupEl.innerHTML = `
      <div class="sl-setup-wrap">
        <div class="sl-setup-card">

          <div class="sl-setup-title">🌈 Snakes &amp; Ladders Adventure</div>
          <div class="sl-setup-subtitle">Choose your board</div>

          <div class="sl-board-picker">${boardBtns}</div>
          <div class="sl-board-info">${snakeCount} snakes &bull; ${ladderCount} ladders</div>

          <div class="sl-setup-subtitle" style="margin-top:12px">How many players?</div>
          <div class="sl-mode-grid">${modeBtns}</div>

          ${playerRowsHtml ? `
          <div class="sl-name-section">
            <div class="sl-name-section-title">Set up your players</div>
            ${playerRowsHtml}
          </div>
          <button class="btn btn-primary btn-lg sl-start-btn"
                  onclick="SnakesLadders._startGame()">
            🎲 Start Adventure!
          </button>` : ''}

          <div class="sl-setup-divider" style="margin-top:${_selectedMode ? '20px' : '10px'}">or</div>
          <button onclick="SnakesLadders._startVsFriend()"
                  style="width:100%;padding:13px 20px;font-size:.95rem;font-weight:800;
                         background:linear-gradient(135deg,#6366f1,#a855f7);color:#fff;
                         border:none;border-radius:12px;cursor:pointer;
                         font-family:'Fredoka One',cursive;transition:opacity .2s"
                  onmouseover="this.style.opacity='.85'" onmouseout="this.style.opacity='1'">
            🤝 vs Friend Online
          </button>
          <p style="font-size:.75rem;color:#aaa;font-weight:600;margin:8px 0 0">
            🔑 Sign in required for online play
          </p>

        </div>
      </div>`;
  }

  function _buildPlayerRows() {
    if (!_selectedMode) return '';
    const slotDefs = _getSlotsForMode(_selectedMode);
    _numSlots = slotDefs.length;

    // Ensure _chosenTokens has defaults
    while (_chosenTokens.length < _numSlots) {
      _chosenTokens.push(TOKENS[_chosenTokens.length % TOKENS.length]);
    }

    return slotDefs.map((slot, i) => {
      const color = PLAYER_COLORS[i].hex;
      const tokenBtns = TOKENS.map(t => `
        <button class="sl-token-btn ${_chosenTokens[i] === t ? 'active' : ''}"
                onclick="SnakesLadders._selectToken(${i}, '${t}')">
          ${t}
        </button>`).join('');

      if (slot.isComputer) {
        return `
          <div class="sl-name-row">
            <div class="sl-name-color-dot" style="background:${color}"></div>
            <div style="flex:1;padding:10px 14px;border:2px solid #e5e7eb;border-radius:12px;
                        font-family:'Nunito',sans-serif;font-size:.92rem;font-weight:700;
                        color:#6b7280;background:#f9fafb">
              🤖 Computer
            </div>
            <div class="sl-token-row">${tokenBtns}</div>
          </div>`;
      }

      return `
        <div class="sl-name-row">
          <div class="sl-name-color-dot" style="background:${color}"></div>
          <input class="sl-name-input" id="sl-name-p${i}"
                 type="text" placeholder="${slot.placeholder}"
                 value="${slot.defaultName}" maxlength="14"/>
        </div>
        <div style="padding-left:28px;margin-bottom:10px">
          <div style="font-size:.75rem;font-weight:700;color:#6b7280;margin-bottom:4px">
            Choose token:
          </div>
          <div class="sl-token-row">${tokenBtns}</div>
        </div>`;
    }).join('');
  }

  function _getSlotsForMode(mode) {
    if (mode === '1cpu') return [
      { isComputer: false, placeholder: 'Your name',    defaultName: 'Player 1' },
      { isComputer: true }
    ];
    if (mode === '2p') return [
      { isComputer: false, placeholder: 'Player 1 name', defaultName: 'Player 1' },
      { isComputer: false, placeholder: 'Player 2 name', defaultName: 'Player 2' }
    ];
    if (mode === '3cpu') return [
      { isComputer: false, placeholder: 'Player 1 name', defaultName: 'Player 1' },
      { isComputer: false, placeholder: 'Player 2 name', defaultName: 'Player 2' },
      { isComputer: true }
    ];
    if (mode === '4p') return [
      { isComputer: false, placeholder: 'Player 1 name', defaultName: 'Player 1' },
      { isComputer: false, placeholder: 'Player 2 name', defaultName: 'Player 2' },
      { isComputer: false, placeholder: 'Player 3 name', defaultName: 'Player 3' },
      { isComputer: false, placeholder: 'Player 4 name', defaultName: 'Player 4' }
    ];
    return [];
  }

  function _selectMode(mode) {
    _selectedMode  = mode;
    _chosenTokens  = [];
    window.SFX?.play('click');
    _renderSetupCard();
  }

  function _selectBoard(idx) {
    selectedBoardIdx = idx;
    SNAKES  = BOARD_CONFIGS[idx].snakes;
    LADDERS = BOARD_CONFIGS[idx].ladders;
    window.SFX?.play('click');
    _renderSetupCard();
  }

  function _selectToken(slotIdx, tokenEmoji) {
    _chosenTokens[slotIdx] = tokenEmoji;
    window.SFX?.play('click');
    _renderSetupCard();
  }

  function _startGame() {
    if (!_selectedMode) return;
    const slotDefs = _getSlotsForMode(_selectedMode);

    players = slotDefs.map((slot, i) => {
      let name;
      if (slot.isComputer) {
        name = 'Computer';
      } else {
        const inp = document.getElementById(`sl-name-p${i}`);
        name = (inp && inp.value.trim()) ? inp.value.trim() : `Player ${i + 1}`;
      }
      return {
        name:       name,
        pos:        0,
        token:      _chosenTokens[i] || TOKENS[i % TOKENS.length],
        isComputer: !!slot.isComputer,
        colorName:  PLAYER_COLORS[i].name,
        colorHex:   PLAYER_COLORS[i].hex
      };
    });

    currentPlayerIdx = 0;
    rolling          = false;
    gameOver         = false;
    totalMoves       = 0;
    startTime        = Date.now();

    SNAKES  = BOARD_CONFIGS[selectedBoardIdx].snakes;
    LADDERS = BOARD_CONFIGS[selectedBoardIdx].ladders;

    // Switch screens
    const setupEl = document.getElementById('sl-setup');
    const gameEl  = document.getElementById('sl-game');
    if (setupEl) setupEl.style.display = 'none';
    if (gameEl)  gameEl.style.display  = 'block';

    renderBoard();
    _startTurn();
  }

  function _startVsFriend() {
    if (typeof firebase !== 'undefined' && firebase.auth().currentUser) {
      window.location.href = 'snakes-ladders-multi.html';
    } else {
      window.location.href = '../login.html';
    }
  }

  /* ═══════════════════════════════════════════════════════════════
     BOARD RENDERING
  ═══════════════════════════════════════════════════════════════ */
  function renderBoard() {
    const board = document.getElementById('sl-board');
    if (!board) return;
    board.innerHTML = '';

    for (let gridRow = 1; gridRow <= 10; gridRow++) {
      for (let gridCol = 1; gridCol <= 10; gridCol++) {
        const n    = squareNum(gridRow, gridCol);
        const cell = document.createElement('div');
        cell.id        = `sq-${n}`;
        cell.className = 'sl-cell';
        cell.style.background = CELL_COLORS[(n - 1) % CELL_COLORS.length];

        if (n === 1)   cell.style.background = '#e0f7fa';
        if (n === 100) cell.style.background = '#fef9c3';

        let extra = '';
        if (n === 1)   extra = `<div class="sl-start-label">START</div>`;
        if (n === 100) extra = `<div class="sl-win-label">WIN!</div>`;

        cell.innerHTML =
          `<span class="sl-num">${n}</span>` +
          extra +
          `<div class="sl-pieces" id="pieces-${n}"></div>`;
        board.appendChild(cell);
      }
    }

    updatePieces();
    requestAnimationFrame(() => requestAnimationFrame(drawOverlay));
  }

  /* ── Update pieces for all players ─────────────────────────── */
  function updatePieces() {
    document.querySelectorAll('.sl-pieces').forEach(el => el.innerHTML = '');
    players.forEach(p => {
      if (p.pos > 0 && p.pos <= 100) {
        const el = document.getElementById(`pieces-${p.pos}`);
        if (el) {
          el.innerHTML += `<span class="sl-piece"
            style="background:${p.colorHex};border:2.5px solid #1a1a2e"
            title="${p.name}">${p.token}</span>`;
        }
      }
    });
  }

  /* ═══════════════════════════════════════════════════════════════
     PLAYERS BAR
  ═══════════════════════════════════════════════════════════════ */
  function renderPlayersBar() {
    const bar = document.getElementById('sl-players-bar');
    if (!bar) return;
    bar.innerHTML = players.map((p, i) => {
      const isActive = (i === currentPlayerIdx) && !gameOver;
      const isWinner = p.pos === 100;
      let cls = 'sl-player-card';
      if (isActive) cls += ' sl-player-card--active';
      if (isWinner) cls += ' sl-player-card--winner';

      return `
        <div class="${cls}" id="sl-pcard-${i}" style="border-color:${isActive ? '#6366f1' : 'transparent'}">
          <div class="sl-player-token">${isWinner ? '👑' : p.token}</div>
          <div class="sl-player-name" style="color:${p.colorHex}">${p.name}</div>
          <div id="sl-dice-p${i}" class="sl-player-dice">🎲</div>
          <div class="sl-player-sq">Square: ${p.pos}</div>
        </div>`;
    }).join('');
  }

  /* ═══════════════════════════════════════════════════════════════
     TURN MANAGEMENT
  ═══════════════════════════════════════════════════════════════ */
  function _startTurn() {
    if (gameOver) return;
    renderPlayersBar();

    const p = players[currentPlayerIdx];
    const rollBtn = document.getElementById('sl-roll-btn');

    if (p.isComputer) {
      enableRoll(false);
      if (rollBtn) rollBtn.textContent = `🤖 ${p.name} is thinking…`;
      setStatus(`🤖 ${p.name}'s turn… rolling soon!`, p.colorHex);
      setTimeout(_computerTurn, 1000);
    } else {
      enableRoll(true);
      if (rollBtn) rollBtn.textContent = `🎲 ${p.name}'s Roll!`;
      setStatus(`🎲 ${p.name}'s turn — roll the dice!`, p.colorHex);
    }
  }

  function advanceTurn() {
    if (gameOver) return;
    currentPlayerIdx = (currentPlayerIdx + 1) % players.length;
    _startTurn();
  }

  /* ═══════════════════════════════════════════════════════════════
     ROLL DICE (human)
  ═══════════════════════════════════════════════════════════════ */
  async function rollDice() {
    if (rolling || gameOver) return;
    const p = players[currentPlayerIdx];
    if (!p || p.isComputer) return;

    window.SFX?.play('click');
    enableRoll(false);
    rolling = true;
    totalMoves++;

    const die = await animateDice(`sl-dice-p${currentPlayerIdx}`);
    await movePlayer(currentPlayerIdx, die);

    rolling = false;
    if (!gameOver) advanceTurn();
  }

  /* ── Computer turn ──────────────────────────────────────────── */
  async function _computerTurn() {
    if (gameOver) return;
    const p = players[currentPlayerIdx];
    rolling = true;
    totalMoves++;

    const die = await animateDice(`sl-dice-p${currentPlayerIdx}`);
    await movePlayer(currentPlayerIdx, die);

    rolling = false;
    if (!gameOver) advanceTurn();
  }

  /* ═══════════════════════════════════════════════════════════════
     MOVE PLAYER
  ═══════════════════════════════════════════════════════════════ */
  async function movePlayer(playerIdx, die) {
    const p      = players[playerIdx];
    const curPos = p.pos;
    const newPos = curPos + die;

    // Overshoot — can't go past 100
    if (newPos > 100) {
      const needed = 100 - curPos;
      setStatus(`🎲 ${p.name} needs ${needed} to win! Stay put!`, p.colorHex);
      await pause(700);
      return;
    }

    // Step-by-step movement
    for (let i = 1; i <= die; i++) {
      p.pos = curPos + i;
      updatePieces();
      renderPlayersBar();
      highlightSquare(p.pos);
      await pause(700);
    }
    clearHighlight();

    let finalPos = newPos;

    // Snake?
    if (SNAKES[newPos]) {
      finalPos = SNAKES[newPos];
      window.SFX?.play('lose');
      highlightSquare(newPos);
      setStatus(`😱 ${p.name} slid down! Silly snake! 🐍`, '#ef4444');
      await pause(900);
      clearHighlight();
      p.pos = finalPos;
      updatePieces();
      renderPlayersBar();
      await pause(400);
    } else if (LADDERS[newPos]) {
      finalPos = LADDERS[newPos];
      window.SFX?.play('win');
      highlightSquare(newPos);
      setStatus(`🎉 ${p.name} climbed up! Great move! 🪜`, '#22c55e');
      await pause(900);
      clearHighlight();
      p.pos = finalPos;
      updatePieces();
      renderPlayersBar();
      await pause(400);
    } else {
      setStatus(`${p.token} ${p.name} rolled ${die} → Square ${finalPos}.`, p.colorHex);
    }

    if (finalPos === 100) {
      await endGame(playerIdx);
    }
  }

  /* ═══════════════════════════════════════════════════════════════
     END GAME
  ═══════════════════════════════════════════════════════════════ */
  async function endGame(winnerIdx) {
    gameOver = true;
    enableRoll(false);
    const p       = players[winnerIdx];
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    const mm      = Math.floor(elapsed / 60);
    const ss      = String(elapsed % 60).padStart(2, '0');
    const timeStr = `${mm}:${ss}`;

    window.SFX?.play('win');
    setStatus(`🏆 ${p.name} wins! Congratulations! 🎉`, p.colorHex);

    // Mark winner on players bar
    renderPlayersBar();
    const winCard = document.getElementById(`sl-pcard-${winnerIdx}`);
    if (winCard) winCard.classList.add('sl-player-card--winner');

    // Confetti
    confettiEffect();

    // End overlay
    const overlay = document.getElementById('sl-end');
    if (overlay) {
      overlay.style.display = 'flex';
      const iconEl  = document.getElementById('sl-end-icon');
      const titleEl = document.getElementById('sl-end-title');
      const msgEl   = document.getElementById('sl-end-msg');
      const statsEl = document.getElementById('sl-end-stats');

      if (iconEl)  iconEl.textContent  = p.token;
      if (titleEl) titleEl.textContent = `🏆 ${p.name} Wins!`;
      if (msgEl)   msgEl.textContent   = `Amazing adventure! ${p.name} reached square 100 first!`;
      if (statsEl) statsEl.innerHTML   =
        `<span>Moves: ${totalMoves}</span><span>Time: ${timeStr}</span>`;
    }

    // Determine outcome for saving (win if first non-computer player wins, else lose)
    const firstHuman = players.find(pl => !pl.isComputer);
    const humanWon   = firstHuman && p.name === firstHuman.name;

    await saveResult({
      gameType: 'snakes-ladders',
      outcome:  humanWon ? 'win' : 'lose',
      level:    'all',
      moves:    totalMoves,
      duration: elapsed,
      timeStr
    });
  }

  /* ── Confetti burst ─────────────────────────────────────────── */
  function confettiEffect() {
    const colors = ['#f59e0b','#6366f1','#22c55e','#ef4444','#a855f7','#3b82f6','#ec4899','#10b981'];
    for (let i = 0; i < 30; i++) {
      const el = document.createElement('div');
      el.className = 'sl-confetti-piece';
      el.style.cssText = `
        left: ${Math.random() * 100}vw;
        top: -20px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        width: ${6 + Math.random() * 8}px;
        height: ${6 + Math.random() * 8}px;
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        animation-duration: ${2 + Math.random() * 2.5}s;
        animation-delay: ${Math.random() * 0.8}s;
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 5000);
    }
  }

  /* ═══════════════════════════════════════════════════════════════
     DICE ANIMATION  (keep exactly: 3s or 6s with easing + SFX)
  ═══════════════════════════════════════════════════════════════ */
  function animateDice(elId) {
    return new Promise(resolve => {
      const diceEl  = document.getElementById(elId);
      const faces   = ['⚀','⚁','⚂','⚃','⚄','⚅'];
      const final   = Math.floor(Math.random() * 6) + 1;
      // Randomly 3 or 6 seconds
      const totalMs = Math.random() < 0.5 ? 3000 : 6000;
      const start   = Date.now();
      let   lastSound = Date.now();

      if (diceEl) diceEl.classList.add('dice-rolling');
      window.SFX?.play('click');

      function tick() {
        const elapsed  = Date.now() - start;
        const progress = Math.min(elapsed / totalMs, 1);

        if (progress >= 1) {
          if (diceEl) {
            diceEl.classList.remove('dice-rolling');
            diceEl.textContent = faces[final - 1];
          }
          resolve(final);
          return;
        }

        if (diceEl) diceEl.textContent = faces[Math.floor(Math.random() * 6)];

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

  /* ═══════════════════════════════════════════════════════════════
     SVG OVERLAY — real snakes & ladders drawn across the board
  ═══════════════════════════════════════════════════════════════ */
  function getSquareCenter(n) {
    const board = document.getElementById('sl-board');
    const cell  = document.getElementById(`sq-${n}`);
    if (!board || !cell) return null;
    const br = board.getBoundingClientRect();
    const cr = cell.getBoundingClientRect();
    return {
      x: cr.left - br.left + cr.width  / 2,
      y: cr.top  - br.top  + cr.height / 2
    };
  }

  function drawOverlay() {
    const board = document.getElementById('sl-board');
    if (!board) return;

    // Remove old overlay if any
    const old = document.getElementById('sl-svg-overlay');
    if (old) old.remove();

    const br  = board.getBoundingClientRect();
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.id = 'sl-svg-overlay';
    svg.setAttribute('style',
      `position:absolute;top:0;left:0;width:${br.width}px;height:${br.height}px;` +
      `pointer-events:none;z-index:2;overflow:visible`);

    // Ladders first (drawn under snakes)
    Object.entries(LADDERS).forEach(([from, to]) => {
      drawLadder(svg, +from, +to);
    });

    // Snakes on top
    Object.entries(SNAKES).forEach(([from, to], i) => {
      drawSnake(svg, +from, +to, SNAKE_COLORS[i % SNAKE_COLORS.length]);
    });

    board.appendChild(svg);
  }

  /* ── Draw one snake as a curvy bezier with proper SVG head ──── */
  function drawSnake(svg, head, tail, color) {
    const p1 = getSquareCenter(head);
    const p2 = getSquareCenter(tail);
    if (!p1 || !p2) return;

    const dx  = p2.x - p1.x;
    const dy  = p2.y - p1.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    const nx  = -dy / len;
    const ny  =  dx / len;
    const amp = Math.min(len * 0.22, 28);

    // S-curve control points
    const cp1x = p1.x + dx * 0.33 + nx * amp;
    const cp1y = p1.y + dy * 0.33 + ny * amp;
    const cp2x = p1.x + dx * 0.67 - nx * amp;
    const cp2y = p1.y + dy * 0.67 - ny * amp;
    const d    = `M${p1.x},${p1.y} C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;

    // Drop shadow
    const shadow = mkPath(d, 'rgba(0,0,0,.22)', '15', 'none');
    shadow.setAttribute('stroke-linecap', 'round');
    svg.appendChild(shadow);

    // Body — thicker (11px)
    const body = mkPath(d, color, '11', 'none');
    body.setAttribute('stroke-linecap', 'round');
    svg.appendChild(body);

    // Scale-stripe highlight
    const highlight = mkPath(d, 'rgba(255,255,255,.32)', '4', 'none');
    highlight.setAttribute('stroke-linecap', 'round');
    highlight.setAttribute('stroke-dasharray', '8 13');
    svg.appendChild(highlight);

    // Tail taper
    const tailD = `M${cp2x},${cp2y} C${cp2x},${cp2y} ${p2.x},${p2.y} ${p2.x},${p2.y}`;
    const tailTaper = mkPath(tailD, 'rgba(0,0,0,.15)', '4', 'none');
    tailTaper.setAttribute('stroke-linecap', 'round');
    svg.appendChild(tailTaper);

    // ── Proper SVG snake head ──────────────────────────────────
    const hDx  = p1.x - cp1x;
    const hDy  = p1.y - cp1y;
    const hLen = Math.sqrt(hDx * hDx + hDy * hDy) || 1;
    const hAng = Math.atan2(hDy, hDx);
    const deg  = hAng * 180 / Math.PI;
    const fx   = Math.cos(hAng);
    const fy   = Math.sin(hAng);
    const px2  = -fy;
    const py2  =  fx;

    const headColor = shadeColor(color, -25);

    const headEl = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    headEl.setAttribute('cx', p1.x + fx * 3);
    headEl.setAttribute('cy', p1.y + fy * 3);
    headEl.setAttribute('rx', '13');
    headEl.setAttribute('ry', '9');
    headEl.setAttribute('fill', headColor);
    headEl.setAttribute('transform', `rotate(${deg}, ${p1.x + fx*3}, ${p1.y + fy*3})`);
    svg.appendChild(headEl);

    const snoutX = p1.x + fx * 14;
    const snoutY = p1.y + fy * 14;
    const snout  = mkCircle(snoutX, snoutY, 5, headColor, 'none', '0');
    svg.appendChild(snout);

    const eyeFwdDist  = 7;
    const eyeSideDist = 5;
    [1, -1].forEach(side => {
      const ex = p1.x + fx * eyeFwdDist + px2 * eyeSideDist * side;
      const ey = p1.y + fy * eyeFwdDist + py2 * eyeSideDist * side;
      svg.appendChild(mkCircle(ex, ey, 3.2, '#fff', 'none', '0'));
      svg.appendChild(mkCircle(ex + fx * 0.5, ey + fy * 0.5, 1.8, '#1a1a2e', 'none', '0'));
      svg.appendChild(mkCircle(
        ex + fx * 0.8 - px2 * 0.6 * side,
        ey + fy * 0.8 - py2 * 0.6 * side,
        0.8, '#fff', 'none', '0'));
    });

    const tongueBaseX = p1.x + fx * 16;
    const tongueBaseY = p1.y + fy * 16;
    const tongueTipX  = p1.x + fx * 22;
    const tongueTipY  = p1.y + fy * 22;
    const fork = 3.5;
    const tonguePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    tonguePath.setAttribute('d',
      `M${tongueBaseX},${tongueBaseY} L${tongueTipX + px2*fork},${tongueTipY + py2*fork}` +
      ` M${tongueBaseX},${tongueBaseY} L${tongueTipX - px2*fork},${tongueTipY - py2*fork}`
    );
    tonguePath.setAttribute('stroke', '#e53e3e');
    tonguePath.setAttribute('stroke-width', '1.8');
    tonguePath.setAttribute('fill', 'none');
    tonguePath.setAttribute('stroke-linecap', 'round');
    svg.appendChild(tonguePath);
  }

  // Darken a hex colour by `amount` (0-100)
  function shadeColor(hex, amount) {
    const num = parseInt(hex.slice(1), 16);
    const r   = Math.max(0, Math.min(255, (num >> 16) + amount));
    const g   = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + amount));
    const b   = Math.max(0, Math.min(255, (num & 0xff) + amount));
    return `rgb(${r},${g},${b})`;
  }

  /* ── Draw one ladder as rails + rungs ───────────────────────── */
  function drawLadder(svg, bottom, top) {
    const p1 = getSquareCenter(bottom);
    const p2 = getSquareCenter(top);
    if (!p1 || !p2) return;

    const dx  = p2.x - p1.x;
    const dy  = p2.y - p1.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    const nx  = -dy / len * 9;
    const ny  =  dx / len * 9;

    const RAIL  = '#92400e';
    const RUNG  = '#f59e0b';

    // Rail shadows
    mkLine(svg, p1.x-nx+1.5, p1.y-ny+1.5, p2.x-nx+1.5, p2.y-ny+1.5, 'rgba(0,0,0,.22)', '11');
    mkLine(svg, p1.x+nx+1.5, p1.y+ny+1.5, p2.x+nx+1.5, p2.y+ny+1.5, 'rgba(0,0,0,.22)', '11');

    // Left rail
    mkLine(svg, p1.x-nx, p1.y-ny, p2.x-nx, p2.y-ny, RAIL, '7');
    // Right rail
    mkLine(svg, p1.x+nx, p1.y+ny, p2.x+nx, p2.y+ny, RAIL, '7');

    // 6 evenly-spaced rungs
    for (let i = 1; i <= 6; i++) {
      const t  = i / 7;
      const rx = p1.x + dx * t;
      const ry = p1.y + dy * t;
      mkLine(svg, rx - nx * 1.6, ry - ny * 1.6, rx + nx * 1.6, ry + ny * 1.6, RUNG, '5');
    }

    // Foot marker
    const fc = mkCircle(p1.x, p1.y, 7, '#fef3c7', RAIL, '2');
    svg.appendChild(fc);

    // Top marker
    const tc = mkCircle(p2.x, p2.y, 7, '#fef3c7', RAIL, '2');
    svg.appendChild(tc);
  }

  /* ── SVG helpers ────────────────────────────────────────────── */
  function mkPath(d, stroke, width, fill) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    el.setAttribute('d', d);
    el.setAttribute('stroke', stroke);
    el.setAttribute('stroke-width', width);
    el.setAttribute('fill', fill);
    return el;
  }
  function mkLine(svg, x1, y1, x2, y2, stroke, width) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    el.setAttribute('x1', x1); el.setAttribute('y1', y1);
    el.setAttribute('x2', x2); el.setAttribute('y2', y2);
    el.setAttribute('stroke', stroke);
    el.setAttribute('stroke-width', width);
    el.setAttribute('stroke-linecap', 'round');
    svg.appendChild(el);
  }
  function mkCircle(cx, cy, r, fill, stroke, sw) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    el.setAttribute('cx', cx); el.setAttribute('cy', cy);
    el.setAttribute('r', r);   el.setAttribute('fill', fill);
    el.setAttribute('stroke', stroke); el.setAttribute('stroke-width', sw);
    return el;
  }

  /* ── Redraw overlay on resize ───────────────────────────────── */
  window.addEventListener('resize', () => {
    if (document.getElementById('sl-board') &&
        document.getElementById('sl-game') &&
        document.getElementById('sl-game').style.display !== 'none') {
      drawOverlay();
    }
  });

  /* ── Square numbering ───────────────────────────────────────── */
  // Row 1 (top of CSS grid) = squares 91-100
  // Row 10 (bottom of CSS grid) = squares 1-10
  function squareNum(gridRow, gridCol) {
    const boardRow = 10 - gridRow;
    const col = (boardRow % 2 === 0) ? (gridCol - 1) : (9 - (gridCol - 1));
    return boardRow * 10 + col + 1;
  }

  /* ═══════════════════════════════════════════════════════════════
     UI HELPERS
  ═══════════════════════════════════════════════════════════════ */
  function setStatus(msg, colour) {
    const el = document.getElementById('sl-status');
    if (!el) return;
    el.textContent = msg;
    if (colour && colour.startsWith('#')) {
      el.style.color = colour;
    } else {
      el.style.color = colour === 'blue' ? 'var(--primary)'
                     : colour === 'red'  ? '#ef4444'
                     : '#374151';
    }
  }

  function enableRoll(on) {
    const btn = document.getElementById('sl-roll-btn');
    if (btn) {
      btn.disabled     = !on;
      btn.style.opacity = on ? '1' : '0.5';
    }
  }

  function highlightSquare(n) {
    const el = document.getElementById(`sq-${n}`);
    if (el) el.classList.add('sl-highlight');
  }

  function clearHighlight() {
    document.querySelectorAll('.sl-highlight').forEach(el => el.classList.remove('sl-highlight'));
  }

  function pause(ms) { return new Promise(r => setTimeout(r, ms)); }

  function hideLoading() {
    const ol = document.getElementById('loading-overlay');
    if (ol) ol.classList.add('hidden');
  }

  /* ═══════════════════════════════════════════════════════════════
     RESTART
  ═══════════════════════════════════════════════════════════════ */
  function restartGame() {
    window.SFX?.play('click');
    const overlay = document.getElementById('sl-end');
    if (overlay) overlay.style.display = 'none';
    _showSetup();
  }

  /* ═══════════════════════════════════════════════════════════════
     PUBLIC API
  ═══════════════════════════════════════════════════════════════ */
  return {
    init,
    rollDice,
    restartGame,
    _startVsFriend,
    _selectBoard,
    _selectMode,
    _selectToken,
    _startGame
  };

})();

// Happy Games – Snakes & Ladders (single-player vs computer)
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

  // Active board (set by board picker, defaults to Classic)
  let SNAKES  = BOARD_CONFIGS[0].snakes;
  let LADDERS = BOARD_CONFIGS[0].ladders;

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

  /* ── State ─────────────────────────────────────────────────── */
  let playerPos   = 0;
  let compPos     = 0;
  let myTurn      = true;
  let rolling     = false;
  let gameOver    = false;
  let startTime   = null;
  let totalMoves  = 0;
  let selectedBoardIdx = 0;

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

  /* ── Public init ───────────────────────────────────────────── */
  function init() {
    playerPos = 0; compPos = 0;
    myTurn = true; rolling = false; gameOver = false;
    totalMoves = 0;
    hideLoading();
    enableRoll(false);
    _showModeSelect();
  }

  function _showModeSelect() {
    const board = document.getElementById('sl-board');
    if (!board) return;

    const boardBtns = BOARD_CONFIGS.map((b, i) => `
      <button id="sl-board-btn-${i}"
        onclick="SnakesLadders._selectBoard(${i})"
        style="padding:9px 14px;border:2px solid ${i === selectedBoardIdx ? '#6366f1' : '#d1d5db'};
               border-radius:12px;background:${i === selectedBoardIdx ? '#ede9fe' : '#fff'};
               font-weight:800;font-size:.82rem;cursor:pointer;transition:all .18s;
               font-family:'Nunito',sans-serif;color:${i === selectedBoardIdx ? '#4f46e5' : '#374151'}">
        ${b.emoji} ${b.name}
      </button>`).join('');

    board.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;
                  height:100%;min-height:380px;gap:16px;padding:28px;text-align:center">
        <div style="font-size:2.6rem">🐍🪜</div>
        <div style="font-family:'Fredoka One',cursive;font-size:1.35rem;color:#1a1a2e">
          Choose a Board
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;max-width:320px">
          ${boardBtns}
        </div>
        <div style="font-size:.75rem;color:#6b7280;font-weight:600;margin:-4px 0 4px">
          ${BOARD_CONFIGS[selectedBoardIdx].snakes ? Object.keys(BOARD_CONFIGS[selectedBoardIdx].snakes).length : 0} snakes •
          ${BOARD_CONFIGS[selectedBoardIdx].ladders ? Object.keys(BOARD_CONFIGS[selectedBoardIdx].ladders).length : 0} ladders
        </div>
        <button class="btn btn-primary sl-roll-btn"
                onclick="SnakesLadders._startVsComputer()"
                style="width:200px;padding:13px 20px;font-size:.95rem">
          🖥️ vs Computer
        </button>
        <button onclick="SnakesLadders._startVsFriend()"
                style="width:200px;padding:13px 20px;font-size:.95rem;font-weight:800;
                       background:linear-gradient(135deg,#6366f1,#a855f7);color:#fff;
                       border:none;border-radius:12px;cursor:pointer;
                       font-family:'Fredoka One',cursive;transition:opacity .2s"
                onmouseover="this.style.opacity='.85'" onmouseout="this.style.opacity='1'">
          🤝 vs Friend Online
        </button>
        <p style="font-size:.75rem;color:#aaa;font-weight:600;margin:0">
          🔑 Sign in required for online play
        </p>
      </div>`;

    setStatus('');
  }

  function _selectBoard(idx) {
    selectedBoardIdx = idx;
    SNAKES  = BOARD_CONFIGS[idx].snakes;
    LADDERS = BOARD_CONFIGS[idx].ladders;
    _showModeSelect();
  }

  function _startVsComputer() {
    const board = document.getElementById('sl-board');
    if (board) board.innerHTML = '';
    // Apply selected board config
    SNAKES  = BOARD_CONFIGS[selectedBoardIdx].snakes;
    LADDERS = BOARD_CONFIGS[selectedBoardIdx].ladders;
    startTime = Date.now();
    renderBoard();
    setStatus(`🎲 Your turn! Roll the dice to move. (${BOARD_CONFIGS[selectedBoardIdx].emoji} ${BOARD_CONFIGS[selectedBoardIdx].name})`, 'blue');
    enableRoll(true);
  }

  function _startVsFriend() {
    if (typeof firebase !== 'undefined' && firebase.auth().currentUser) {
      window.location.href = 'snakes-ladders-multi.html';
    } else {
      window.location.href = '../login.html';
    }
  }

  /* ── Board rendering ───────────────────────────────────────── */
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

    // Draw SVG overlay after the browser has laid out the grid
    requestAnimationFrame(() => requestAnimationFrame(drawOverlay));
  }

  /* ═══════════════════════════════════════════════════════════
     SVG OVERLAY — real snakes & ladders drawn across the board
  ═══════════════════════════════════════════════════════════ */
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

    // Tail taper — thinner line over the last bit to look like a tail
    const tailD = `M${cp2x},${cp2y} C${cp2x},${cp2y} ${p2.x},${p2.y} ${p2.x},${p2.y}`;
    const tailTaper = mkPath(tailD, 'rgba(0,0,0,.15)', '4', 'none');
    tailTaper.setAttribute('stroke-linecap', 'round');
    svg.appendChild(tailTaper);

    // ── Proper SVG snake head ──────────────────────────────────
    // The head "looks" away from the body — direction from cp1 back to p1
    const hDx  = p1.x - cp1x;
    const hDy  = p1.y - cp1y;
    const hLen = Math.sqrt(hDx * hDx + hDy * hDy) || 1;
    const hAng = Math.atan2(hDy, hDx); // radians — direction head faces
    const deg  = hAng * 180 / Math.PI;
    const fx   = Math.cos(hAng);  // forward unit vector
    const fy   = Math.sin(hAng);
    const px2  = -fy;             // perpendicular unit vector
    const py2  =  fx;

    // Darker shade for head
    const headColor = shadeColor(color, -25);

    // Head body — rounded ellipse pointing forward
    const headEl = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    headEl.setAttribute('cx', p1.x + fx * 3);
    headEl.setAttribute('cy', p1.y + fy * 3);
    headEl.setAttribute('rx', '13');
    headEl.setAttribute('ry', '9');
    headEl.setAttribute('fill', headColor);
    headEl.setAttribute('transform', `rotate(${deg}, ${p1.x + fx*3}, ${p1.y + fy*3})`);
    svg.appendChild(headEl);

    // Snout bump at the very tip
    const snoutX = p1.x + fx * 14;
    const snoutY = p1.y + fy * 14;
    const snout  = mkCircle(snoutX, snoutY, 5, headColor, 'none', '0');
    svg.appendChild(snout);

    // Eyes — two white circles with dark pupils, offset sideways on the head
    const eyeFwdDist = 7;
    const eyeSideDist = 5;
    [1, -1].forEach(side => {
      const ex = p1.x + fx * eyeFwdDist + px2 * eyeSideDist * side;
      const ey = p1.y + fy * eyeFwdDist + py2 * eyeSideDist * side;
      // White sclera
      svg.appendChild(mkCircle(ex, ey, 3.2, '#fff', 'none', '0'));
      // Dark pupil
      svg.appendChild(mkCircle(ex + fx * 0.5, ey + fy * 0.5, 1.8, '#1a1a2e', 'none', '0'));
      // Shine dot
      svg.appendChild(mkCircle(ex + fx * 0.8 - px2 * 0.6 * side, ey + fy * 0.8 - py2 * 0.6 * side, 0.8, '#fff', 'none', '0'));
    });

    // Forked tongue — two thin lines from snout tip
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
    const nx  = -dy / len * 9;  // wider rail spacing
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

    // Foot marker — small gold circle at the base
    const fc = mkCircle(p1.x, p1.y, 7, '#fef3c7', RAIL, '2');
    svg.appendChild(fc);

    // Top marker — small circle at the top
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

  /* ── Redraw overlay if window is resized ────────────────────── */
  window.addEventListener('resize', () => {
    if (document.getElementById('sl-board')) drawOverlay();
  });

  /* ── Square numbering ───────────────────────────────────────── */
  // Row 1 (top of CSS grid) = squares 91-100
  // Row 10 (bottom of CSS grid) = squares 1-10
  function squareNum(gridRow, gridCol) {
    const boardRow = 10 - gridRow;
    const col = (boardRow % 2 === 0) ? (gridCol - 1) : (9 - (gridCol - 1));
    return boardRow * 10 + col + 1;
  }

  /* ── Update player pieces ───────────────────────────────────── */
  function updatePieces() {
    document.querySelectorAll('.sl-pieces').forEach(el => el.innerHTML = '');
    if (playerPos > 0 && playerPos <= 100) {
      const el = document.getElementById(`pieces-${playerPos}`);
      if (el) el.innerHTML += `<span class="sl-piece sl-piece-you" title="You">🔵</span>`;
    }
    if (compPos > 0 && compPos <= 100) {
      const el = document.getElementById(`pieces-${compPos}`);
      if (el) el.innerHTML += `<span class="sl-piece sl-piece-comp" title="Computer">🔴</span>`;
    }
  }

  /* ── Roll dice ─────────────────────────────────────────────── */
  async function rollDice() {
    if (!myTurn || rolling || gameOver) return;
    window.SFX?.play('click');
    enableRoll(false);
    rolling = true;
    totalMoves++;

    const die = await animateDice('sl-dice-you');
    setLastRoll('you', die);
    await movePlayer('player', die);

    if (!gameOver) {
      myTurn = false;
      setTimeout(computerTurn, 1000);
    }
    rolling = false;
  }

  async function computerTurn() {
    if (gameOver) return;
    setStatus('🤖 Computer\'s turn…', 'red');
    const die = await animateDice('sl-dice-comp');
    setLastRoll('comp', die);
    await movePlayer('computer', die);
    if (!gameOver) {
      myTurn = true;
      setStatus('🎲 Your turn! Roll the dice.', 'blue');
      enableRoll(true);
    }
  }

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

  function setLastRoll(who, val) {
    const faces = ['','⚀','⚁','⚂','⚃','⚄','⚅'];
    const el = document.getElementById(who === 'you' ? 'sl-you-roll' : 'sl-comp-roll');
    if (el) el.textContent = `${faces[val]} ${val}`;
  }

  /* ── Move a player ─────────────────────────────────────────── */
  async function movePlayer(who, die) {
    const isPlayer = who === 'player';
    let pos = isPlayer ? playerPos : compPos;
    const newPos = pos + die;

    // Can't overshoot 100
    if (newPos > 100) {
      setStatus(
        `${isPlayer ? '🔵 You' : '🔴 Computer'} rolled ${die} — need ${100 - pos} to win! Stay.`,
        isPlayer ? 'blue' : 'red'
      );
      await pause(600);
      return;
    }

    // Step-by-step movement
    for (let i = 1; i <= die; i++) {
      const step = pos + i;
      if (isPlayer) playerPos = step; else compPos = step;
      updatePieces();
      highlightSquare(step);
      await pause(700);
    }
    clearHighlight();

    let finalPos = newPos;
    let extra    = '';

    if (SNAKES[newPos]) {
      finalPos = SNAKES[newPos];
      extra = `🐍 Snake! Slid down to ${finalPos}.`;
      window.SFX?.play('lose');
      highlightSquare(newPos);
      await pause(900);
      clearHighlight();
      if (isPlayer) playerPos = finalPos; else compPos = finalPos;
      updatePieces();
    } else if (LADDERS[newPos]) {
      finalPos = LADDERS[newPos];
      extra = `🪜 Ladder! Climbed up to ${finalPos}!`;
      window.SFX?.play('win');
      highlightSquare(newPos);
      await pause(900);
      clearHighlight();
      if (isPlayer) playerPos = finalPos; else compPos = finalPos;
      updatePieces();
    }

    if (finalPos === 100) {
      await endGame(who);
      return;
    }

    const baseMsg = `${isPlayer ? '🔵 You' : '🔴 Computer'} rolled ${die} → Square ${finalPos}.`;
    setStatus(extra ? `${baseMsg} ${extra}` : baseMsg, isPlayer ? 'blue' : 'red');
  }

  /* ── End game ──────────────────────────────────────────────── */
  async function endGame(winner) {
    gameOver = true;
    enableRoll(false);
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    const mm = Math.floor(elapsed / 60), ss = String(elapsed % 60).padStart(2, '0');
    const timeStr = `${mm}:${ss}`;

    if (winner === 'player') {
      window.SFX?.play('win');
      setStatus('🏆 YOU WIN! You reached square 100!', 'blue');
    } else {
      window.SFX?.play('lose');
      setStatus('😔 Computer wins this time! Try again!', 'red');
    }

    const overlay = document.getElementById('sl-end');
    if (overlay) {
      overlay.style.display = 'flex';
      document.getElementById('sl-end-icon').textContent  = winner === 'player' ? '🏆' : '🤖';
      document.getElementById('sl-end-title').textContent = winner === 'player' ? 'You Win!' : 'Computer Wins!';
      document.getElementById('sl-end-msg').textContent   = winner === 'player'
        ? 'Amazing! You reached square 100 first!'
        : 'Better luck next time! You can do it!';
      document.getElementById('sl-end-stats').innerHTML =
        `<span>Moves: ${totalMoves}</span><span>Time: ${timeStr}</span>`;
    }

    await saveResult({
      gameType: 'snakes-ladders',
      outcome:  winner === 'player' ? 'win' : 'lose',
      level:    'all',
      moves:    totalMoves,
      duration: elapsed,
      timeStr
    });
  }

  /* ── UI helpers ────────────────────────────────────────────── */
  function setStatus(msg, colour) {
    const el = document.getElementById('sl-status');
    if (!el) return;
    el.textContent = msg;
    el.style.color = colour === 'blue' ? 'var(--primary)' : colour === 'red' ? '#ef4444' : '#374151';
  }
  function enableRoll(on) {
    const btn = document.getElementById('sl-roll-btn');
    if (btn) { btn.disabled = !on; btn.style.opacity = on ? '1' : '0.5'; }
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

  function restartGame() {
    window.SFX?.play('click');
    const overlay = document.getElementById('sl-end');
    if (overlay) overlay.style.display = 'none';
    ['sl-dice-you','sl-dice-comp'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = '🎲';
    });
    ['sl-you-roll','sl-comp-roll'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = '—';
    });
    _startVsComputer();
  }

  return { init, rollDice, restartGame, _startVsComputer, _startVsFriend, _selectBoard };
})();

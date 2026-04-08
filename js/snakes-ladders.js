// Happy Games – Snakes & Ladders (single-player vs computer)
'use strict';

const SnakesLadders = (() => {

  /* ── Board data (classic balanced positions) ───────────────── */
  // Snakes: head (high) → tail (low)
  const SNAKES  = { 99:78, 95:75, 93:73, 87:24, 64:60, 62:19, 49:11, 47:26, 16:6 };
  // Ladders: foot (low) → top (high)
  const LADDERS = { 4:14, 9:31, 20:38, 28:84, 40:59, 51:67, 63:81, 71:91 };

  // One distinct colour per snake
  const SNAKE_COLORS = [
    '#ef4444','#f97316','#a855f7','#ec4899',
    '#06b6d4','#84cc16','#f59e0b','#6366f1','#10b981'
  ];

  /* ── State ─────────────────────────────────────────────────── */
  let playerPos  = 0;
  let compPos    = 0;
  let myTurn     = true;
  let rolling    = false;
  let gameOver   = false;
  let startTime  = null;
  let totalMoves = 0;

  /* ── Bright cycling tile palette (8 colours) ───────────────── */
  const CELL_COLORS = [
    '#ffd6e7','#ffecd1','#fff9c4','#d4f4dd',
    '#cce8ff','#ead4ff','#ffd6d6','#d4f0f0'
  ];

  /* ── Public init ───────────────────────────────────────────── */
  function init() {
    playerPos = 0; compPos = 0;
    myTurn = true; rolling = false; gameOver = false;
    totalMoves = 0; startTime = Date.now();
    renderBoard();
    setStatus('🎲 Your turn! Roll the dice to move.', 'blue');
    enableRoll(true);
    hideLoading();
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

  /* ── Draw one snake as a curvy bezier ───────────────────────── */
  function drawSnake(svg, head, tail, color) {
    const p1 = getSquareCenter(head);
    const p2 = getSquareCenter(tail);
    if (!p1 || !p2) return;

    const dx  = p2.x - p1.x;
    const dy  = p2.y - p1.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    const nx  = -dy / len;  // unit perpendicular
    const ny  =  dx / len;
    const amp = Math.min(len * 0.22, 28); // wiggle amplitude

    // S-curve: two control points on opposite sides
    const cp1x = p1.x + dx * 0.33 + nx * amp;
    const cp1y = p1.y + dy * 0.33 + ny * amp;
    const cp2x = p1.x + dx * 0.67 - nx * amp;
    const cp2y = p1.y + dy * 0.67 - ny * amp;
    const d    = `M${p1.x},${p1.y} C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;

    // Drop shadow
    const shadow = mkPath(d, 'rgba(0,0,0,.18)', '11', 'none');
    shadow.setAttribute('stroke-linecap', 'round');
    svg.appendChild(shadow);

    // Body
    const body = mkPath(d, color, '7', 'none');
    body.setAttribute('stroke-linecap', 'round');
    svg.appendChild(body);

    // Dashed highlight (scale pattern)
    const highlight = mkPath(d, 'rgba(255,255,255,.38)', '3', 'none');
    highlight.setAttribute('stroke-linecap', 'round');
    highlight.setAttribute('stroke-dasharray', '6 10');
    svg.appendChild(highlight);

    // Head circle
    const hc = mkCircle(p1.x, p1.y, 11, color, '#fff', '2');
    svg.appendChild(hc);

    // Snake emoji on head
    const he = mkText(p1.x, p1.y + 5, '🐍', '13');
    svg.appendChild(he);

    // Tail dot
    const tc = mkCircle(p2.x, p2.y, 5, color, 'none', '0');
    tc.setAttribute('opacity', '0.7');
    svg.appendChild(tc);
  }

  /* ── Draw one ladder as rails + rungs ───────────────────────── */
  function drawLadder(svg, bottom, top) {
    const p1 = getSquareCenter(bottom);
    const p2 = getSquareCenter(top);
    if (!p1 || !p2) return;

    const dx  = p2.x - p1.x;
    const dy  = p2.y - p1.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    const nx  = -dy / len * 5.5;  // perpendicular offset for the two rails
    const ny  =  dx / len * 5.5;

    const RAIL  = '#92400e';
    const RUNG  = '#f59e0b';

    // Rail shadows
    mkLine(svg, p1.x-nx+1, p1.y-ny+1, p2.x-nx+1, p2.y-ny+1, 'rgba(0,0,0,.18)', '7');
    mkLine(svg, p1.x+nx+1, p1.y+ny+1, p2.x+nx+1, p2.y+ny+1, 'rgba(0,0,0,.18)', '7');

    // Left rail
    mkLine(svg, p1.x-nx, p1.y-ny, p2.x-nx, p2.y-ny, RAIL, '4');
    // Right rail
    mkLine(svg, p1.x+nx, p1.y+ny, p2.x+nx, p2.y+ny, RAIL, '4');

    // 5 evenly-spaced rungs
    for (let i = 1; i <= 5; i++) {
      const t  = i / 6;
      const rx = p1.x + dx * t;
      const ry = p1.y + dy * t;
      mkLine(svg, rx - nx * 1.5, ry - ny * 1.5, rx + nx * 1.5, ry + ny * 1.5, RUNG, '3');
    }

    // Foot marker circle
    const fc = mkCircle(p1.x, p1.y, 10, '#fef3c7', RAIL, '2');
    svg.appendChild(fc);
    svg.appendChild(mkText(p1.x, p1.y + 5, '🪜', '12'));
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
  function mkText(x, y, txt, size) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    el.setAttribute('x', x); el.setAttribute('y', y);
    el.setAttribute('text-anchor', 'middle');
    el.setAttribute('font-size', size);
    el.textContent = txt;
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
      const diceEl = document.getElementById(elId);
      const faces  = ['⚀','⚁','⚂','⚃','⚄','⚅'];
      let count = 0;
      const final  = Math.floor(Math.random() * 6) + 1;
      const iv = setInterval(() => {
        if (diceEl) diceEl.textContent = faces[Math.floor(Math.random() * 6)];
        count++;
        if (count >= 8) {
          clearInterval(iv);
          if (diceEl) diceEl.textContent = faces[final - 1];
          resolve(final);
        }
      }, 80);
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
      await pause(400);
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
    init();
  }

  return { init, rollDice, restartGame };
})();

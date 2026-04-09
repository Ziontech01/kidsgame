// ── Ludo Multiplayer ────────────────────────────────────────────────
// Real-time 2-player Ludo via Firestore. Blue vs Red.
'use strict';

// ── Board constants (from ludo.js) ─────────────────────────────────
const LM_MAIN_TRACK = [
  [6,13],[6,12],[6,11],[6,10],[6,9],
  [6,8],
  [5,8],[4,8],[3,8],[2,8],[1,8],[0,8],
  [0,7],[0,6],
  [1,6],[2,6],[3,6],[4,6],[5,6],
  [6,6],
  [6,5],[6,4],[6,3],[6,2],[6,1],[6,0],
  [7,0],[8,0],
  [8,1],[8,2],[8,3],[8,4],[8,5],
  [8,6],
  [9,6],[10,6],[11,6],[12,6],[13,6],[14,6],
  [14,7],[14,8],
  [13,8],[12,8],[11,8],[10,8],[9,8],
  [8,8],
  [8,9],[8,10],[8,11],[8,12],[8,13],[8,14],
  [7,14],[6,14]
];
const LM_BLUE_HOME   = [[7,13],[7,12],[7,11],[7,10],[7,9]];
const LM_RED_HOME    = [[13,7],[12,7],[11,7],[10,7],[9,7]];
const LM_COLOR_ENTRY = { blue: 0, red: 42 };
const LM_PIECE_STARTS = {
  blue: [[2,11],[3,11],[2,12],[3,12]],
  red:  [[11,11],[12,11],[11,12],[12,12]]
};
const LM_HOME_COLS = { blue: LM_BLUE_HOME, red: LM_RED_HOME };
const LM_SAFE = new Set([0, 54, 12, 14, 26, 28, 40, 42]);
const LM_ENTRY_CLASS = { 0:'lc-entry-blue', 14:'lc-entry-green', 28:'lc-entry-yellow', 42:'lc-entry-red' };
const LM_COLORS = { blue: { emoji:'🔵', label:'Blue' }, red: { emoji:'🔴', label:'Red' } };

// ── Firestore state ─────────────────────────────────────────────────
let lmGameId = null, lmRef = null, lmUnsub = null, lmState = null;
let lmUid = null, lmName = null;
let lmResultSaved   = false;
let lmLastRenderKey = '';
let lmPrevStatus    = null;
let lmHbInt         = null;
let lmStaleInt      = null;
let lmIsHbRunning   = false;

requireAuth((user, profile) => {
  lmUid  = user.uid;
  lmName = profile?.name || profile?.username || 'Player';
  renderLMLobby();
});

// ── Helpers ─────────────────────────────────────────────────────────
function lmGenCode() { return Math.random().toString(36).substr(2,6).toUpperCase(); }

function lmGetPlayerIndex() {
  return lmState?.players?.findIndex(p => p?.uid === lmUid) ?? -1;
}

function lmMyColor() {
  const idx = lmGetPlayerIndex();
  return idx === 0 ? 'blue' : 'red';
}

function lmFreshPieces() {
  return { blue: [-1,-1,-1,-1], red: [-1,-1,-1,-1] };
}

function lmGetMoveable(pieces, color, die) {
  const moveable = [];
  pieces[color].forEach((pos, i) => {
    if (pos === 60) return; // already done
    if (pos === -1) { if (die === 6) moveable.push(i); return; }
    const newPos = pos + die;
    if (newPos <= 60) moveable.push(i);
  });
  return moveable;
}

function lmApplyMove(pieces, color, pieceIdx, die) {
  const newPieces = { blue: [...pieces.blue], red: [...pieces.red] };
  const pos = newPieces[color][pieceIdx];

  if (pos === -1) {
    // Enter board
    newPieces[color][pieceIdx] = 0;
  } else {
    newPieces[color][pieceIdx] = Math.min(pos + die, 60);
  }

  // Check capture (only on main track, non-safe squares)
  const newPos = newPieces[color][pieceIdx];
  if (newPos <= 54) {
    const absPos = (LM_COLOR_ENTRY[color] + newPos) % 56;
    if (!LM_SAFE.has(absPos)) {
      const oppColor = color === 'blue' ? 'red' : 'blue';
      newPieces[oppColor] = newPieces[oppColor].map(p => {
        if (p <= 0 || p > 54) return p;
        const oppAbs = (LM_COLOR_ENTRY[oppColor] + p) % 56;
        return oppAbs === absPos ? -1 : p;
      });
    }
  }

  return newPieces;
}

function lmIsWinner(pieces, color) {
  return pieces[color].every(p => p === 60);
}

// ── Lobby ───────────────────────────────────────────────────────────
function renderLMLobby() {
  lmStopHeartbeat();
  hideStaleBannerLM();
  if (lmUnsub) { lmUnsub(); lmUnsub = null; }
  lmGameId = null; lmRef = null; lmState = null;
  lmResultSaved = false; lmLastRenderKey = ''; lmPrevStatus = null;

  document.getElementById('multi-root').innerHTML = `
    <div class="multi-lobby card">
      <div style="font-size:3.2rem;margin-bottom:6px">🎲🏁</div>
      <div class="multi-lobby-title">Ludo vs Friend</div>
      <p class="multi-lobby-sub">Race your pieces home! First to get<br>all 4 pieces to the centre wins. (2 players)</p>
      <div class="multi-lobby-actions">
        <button class="btn btn-primary btn-lg" onclick="lmCreate()">🏠 Create Room</button>
        <div class="multi-or">— or —</div>
        <div class="multi-join-row">
          <input type="text" id="lm-join-code" class="form-input multi-code-input"
            placeholder="ABC123" maxlength="6"
            oninput="this.value=this.value.toUpperCase().replace(/[^A-Z0-9]/g,'')"
            onkeydown="if(event.key==='Enter')lmJoin()"/>
          <button class="btn btn-secondary" onclick="lmJoin()">🚀 Join</button>
        </div>
        <p id="lm-err" class="multi-err"></p>
      </div>
      <a href="ludo.html" class="btn btn-ghost multi-back-btn">← Play vs Computer</a>
    </div>`;
  hideLoading();
}

// ── Create Room ─────────────────────────────────────────────────────
async function lmCreate() {
  const code = lmGenCode();
  try {
    const ref = await db.collection('ludo_games').add({
      code,
      players: [{ uid: lmUid, name: lmName, color: 'blue' }],
      pieces: lmFreshPieces(),
      currentPlayerIdx: 0,
      diceRoll: null,
      diceRolled: false,
      status: 'waiting',
      winner: null,
      p1Heartbeat: null,
      p2Heartbeat: null,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    lmGameId = ref.id;
    lmRef    = db.collection('ludo_games').doc(lmGameId);
    renderLMWaiting(code);
    lmListen();
  } catch(e) { console.error('lmCreate:', e); }
}

// ── Waiting Screen ──────────────────────────────────────────────────
function renderLMWaiting(code) {
  document.getElementById('multi-root').innerHTML = `
    <div class="multi-waiting card">
      <div class="multi-waiting-icon">🎲</div>
      <div class="multi-waiting-title">Room Created!</div>
      <p class="multi-lobby-sub">Share this code with your friend:</p>
      <div class="room-code-display" id="lm-room-code">${code}</div>
      <p style="color:#888;font-size:.82rem;font-weight:700;margin-bottom:12px">You play as 🔵 Blue</p>
      <button class="btn btn-outline multi-copy-btn" onclick="lmCopy('${code}')">📋 Copy Code</button>
      <div class="multi-waiting-spinner">
        <div class="spinner" style="margin:0 auto 10px"></div>
        <p style="color:#999;font-weight:700;font-size:.9rem">Waiting for 1 more player…</p>
      </div>
      <button class="btn btn-ghost multi-back-btn" onclick="lmCancel()">✖ Cancel Room</button>
    </div>`;
}

function lmCopy(code) {
  navigator.clipboard.writeText(code).catch(()=>{});
  const el = document.getElementById('lm-room-code');
  if (el) { const o=el.textContent; el.textContent='✅ Copied!'; setTimeout(()=>el.textContent=o,1500); }
}

// ── Join Room ────────────────────────────────────────────────────────
async function lmJoin() {
  const code  = (document.getElementById('lm-join-code')?.value||'').trim().toUpperCase();
  const errEl = document.getElementById('lm-err');
  if (!code) { if(errEl) errEl.textContent='Enter the 6-character room code.'; return; }
  try {
    const snap = await db.collection('ludo_games')
      .where('code','==',code).where('status','==','waiting').limit(1).get();
    if (snap.empty) {
      if(errEl) errEl.textContent='Room not found — check the code and try again.'; return;
    }
    const doc  = snap.docs[0];
    const data = doc.data();
    if (data.players.some(p => p.uid === lmUid)) {
      if(errEl) errEl.textContent="You're already in this room!"; return;
    }
    if (data.players.length >= 2) {
      if(errEl) errEl.textContent='Room is full (2 players max).'; return;
    }
    lmGameId = doc.id;
    lmRef    = db.collection('ludo_games').doc(lmGameId);
    await lmRef.update({
      players: [...data.players, { uid: lmUid, name: lmName, color: 'red' }],
      status: 'playing'
    });
    lmListen();
  } catch(e) {
    console.error('lmJoin:', e);
    if(errEl) errEl.textContent='Could not join — please try again.';
  }
}

// ── Cancel ───────────────────────────────────────────────────────────
async function lmCancel() {
  lmStopHeartbeat();
  if (lmUnsub) { lmUnsub(); lmUnsub = null; }
  if (lmRef)   await lmRef.delete().catch(()=>{});
  renderLMLobby();
}

// ── Real-time Listener ───────────────────────────────────────────────
function lmListen() {
  if (lmUnsub) lmUnsub();
  lmUnsub = db.collection('ludo_games').doc(lmGameId).onSnapshot(snap => {
    if (!snap.exists) { renderLMLobby(); return; }
    lmState = snap.data();
    const s    = lmState.status;
    const prev = lmPrevStatus;
    lmPrevStatus = s;

    if (s === 'waiting') {
      renderLMWaitingWithList();
    } else if (s === 'playing') {
      lmStartHeartbeat();
      lmStartStaleCheck();
      if (prev !== 'playing') window.SFX?.play(prev === 'finished' ? 'rematch' : 'join');
      const rk = JSON.stringify([lmState.pieces, lmState.currentPlayerIdx, lmState.diceRoll, lmState.diceRolled]);
      if (rk !== lmLastRenderKey) {
        lmLastRenderKey = rk;
        renderLMBoard(lmState, false);
      }
    } else if (s === 'finished') {
      lmStopHeartbeat();
      hideStaleBannerLM();
      if (!lmResultSaved) {
        lmResultSaved = true;
        lmSaveMyResult(lmState);
        if (lmState.winner === lmUid) window.SFX?.play('win');
        else window.SFX?.play('lose');
      }
      lmLastRenderKey = '';
      renderLMBoard(lmState, true);
    }
  });
}

function renderLMWaitingWithList() {
  const code = lmState?.code || '';
  const myColor = lmGetPlayerIndex() === 0 ? '🔵 Blue' : '🔴 Red';
  document.getElementById('multi-root').innerHTML = `
    <div class="multi-waiting card">
      <div class="multi-waiting-icon">🎲</div>
      <div class="multi-waiting-title">Waiting for Opponent</div>
      <p style="color:#888;font-size:.82rem;font-weight:700;margin:12px 0">
        Room Code: <strong>${code}</strong></p>
      <p style="color:#666;font-size:.9rem;margin-bottom:12px">You play as ${myColor}</p>
      <div class="multi-waiting-spinner">
        <div class="spinner" style="margin:0 auto 10px"></div>
        <p style="color:#999;font-weight:700;font-size:.9rem">Waiting for 1 more player…</p>
      </div>
      <button class="btn btn-ghost multi-back-btn" onclick="lmCancel()">✖ Leave Room</button>
    </div>`;
}

// ── Save result ──────────────────────────────────────────────────────
async function lmSaveMyResult(data) {
  const outcome = data.winner === lmUid ? 'win' : 'lose';
  const oppNames = data.players.filter(p => p.uid !== lmUid).map(p => p.name).join(', ');
  await saveResult({
    gameType: 'ludo-multi',
    outcome,
    moves: 0,
    opponent: oppNames,
    mode: 'multiplayer'
  });
}

// ── Heartbeat ────────────────────────────────────────────────────────
function lmStartHeartbeat() {
  if (lmIsHbRunning) return;
  lmIsHbRunning = true;
  const myIdx = lmGetPlayerIndex();
  const field = ['p1Heartbeat','p2Heartbeat'][myIdx] || 'p1Heartbeat';
  const beat = () => {
    if (!lmRef || lmState?.status !== 'playing') { lmStopHeartbeat(); return; }
    lmRef.update({ [field]: firebase.firestore.FieldValue.serverTimestamp() }).catch(()=>{});
  };
  beat();
  lmHbInt = setInterval(beat, 15000);
}

function lmStopHeartbeat() {
  if (lmHbInt)    { clearInterval(lmHbInt);    lmHbInt    = null; }
  if (lmStaleInt) { clearInterval(lmStaleInt); lmStaleInt = null; }
  lmIsHbRunning = false;
}

function lmStartStaleCheck() {
  if (lmStaleInt) return;
  lmStaleInt = setInterval(lmCheckStale, 10000);
}

function lmCheckStale() {
  if (!lmState || lmState.status !== 'playing') return;
  const hbs = [lmState.p1Heartbeat, lmState.p2Heartbeat];
  let anyStale = false;
  for (const hb of hbs) {
    if (!hb) continue;
    const ms = hb.toDate ? hb.toDate().getTime() : hb.seconds * 1000;
    if (Date.now() - ms > 35000) { anyStale = true; break; }
  }
  const banner = document.getElementById('stale-banner-lm');
  if (!banner) return;
  if (anyStale) {
    if (banner.style.display === 'none') {
      banner.style.display = 'flex';
      window.SFX?.play('disconnect');
    }
  } else {
    banner.style.display = 'none';
  }
}

function hideStaleBannerLM() {
  const el = document.getElementById('stale-banner-lm');
  if (el) el.style.display = 'none';
}

async function claimWinLM() {
  lmStopHeartbeat();
  hideStaleBannerLM();
  if (lmRef) await lmRef.update({ status: 'finished', winner: lmUid }).catch(()=>{});
}

// ── Board Render ─────────────────────────────────────────────────────
function renderLMBoard(state, isFinished) {
  const myIdx    = lmGetPlayerIndex();
  const isMyTurn = state.currentPlayerIdx === myIdx;
  const myColor  = myIdx === 0 ? 'blue' : 'red';
  const oppColor = myColor === 'blue' ? 'red' : 'blue';
  const oppPlayer = state.players.find(p => p.uid !== lmUid);
  const mePlayer  = state.players.find(p => p.uid === lmUid);

  // Build sets for board rendering
  const trackSet = new Set(LM_MAIN_TRACK.map(([c,r]) => `${c},${r}`));
  const blueHomeSet  = new Set(LM_BLUE_HOME.map(([c,r]) => `${c},${r}`));
  const redHomeSet   = new Set(LM_RED_HOME.map(([c,r])  => `${c},${r}`));
  const starterSet = new Set([
    '2,11','3,11','2,12','3,12',    // Blue
    '11,11','12,11','11,12','12,12' // Red
  ]);
  const centerColorMap = {
    '7,6':'lc-center-yellow',
    '6,7':'lc-center-green','7,7':'lc-center-star','8,7':'lc-center-red',
    '7,8':'lc-center-blue'
  };

  // Map grid positions to pieces
  const pieceMap = {};
  const addPiece = (col, row, color, pi, isMoveable) => {
    const key = `${col},${row}`;
    if (!pieceMap[key]) pieceMap[key] = [];
    pieceMap[key].push({ color, pi, isMoveable });
  };

  const showMoveable = isMyTurn && !isFinished && state.diceRolled && state.diceRoll !== null;
  const moveable = showMoveable ? lmGetMoveable(state.pieces, myColor, state.diceRoll) : [];

  ['blue','red'].forEach(color => {
    (state.pieces[color] || [-1,-1,-1,-1]).forEach((pos, pi) => {
      if (pos === 60) return;
      let col, row;
      if (pos === -1) {
        [col, row] = LM_PIECE_STARTS[color][pi];
      } else if (pos <= 54) {
        [col, row] = LM_MAIN_TRACK[(LM_COLOR_ENTRY[color] + pos) % 56];
      } else if (pos <= 59) {
        [col, row] = LM_HOME_COLS[color][pos - 55];
      } else return;
      const isM = color === myColor && moveable.includes(pi);
      addPiece(col, row, color, pi, isM);
    });
  });

  // Build board HTML
  let boardCells = '';
  for (let row = 0; row < 15; row++) {
    for (let col = 0; col < 15; col++) {
      const key = `${col},${row}`;
      let cls = 'lc';
      let inner = '';

      if (row >= 6 && row <= 8 && col >= 6 && col <= 8 && !trackSet.has(key)) {
        cls += ' lc-center';
        const cc = centerColorMap[key];
        if (cc) cls += ' ' + cc;
        if (row === 7 && col === 7) { cls += ' lc-center-star'; inner = '⭐'; }

      } else if (row >= 9 && row <= 14 && col >= 0 && col <= 5) {
        cls += ' lc-home-blue';
        if (starterSet.has(key)) cls += ' lc-starter';
        else if (row >= 10 && row <= 13 && col >= 1 && col <= 4) cls += ' lc-home-inner';

      } else if (row >= 9 && row <= 14 && col >= 9 && col <= 14) {
        cls += ' lc-home-red';
        if (starterSet.has(key)) cls += ' lc-starter';
        else if (row >= 10 && row <= 13 && col >= 10 && col <= 13) cls += ' lc-home-inner';

      } else if (row >= 0 && row <= 5 && col >= 9 && col <= 14) {
        cls += ' lc-home-yellow';
        if (row >= 1 && row <= 4 && col >= 10 && col <= 13) cls += ' lc-home-inner';

      } else if (row >= 0 && row <= 5 && col >= 0 && col <= 5) {
        cls += ' lc-home-green';
        if (row >= 1 && row <= 4 && col >= 1 && col <= 4) cls += ' lc-home-inner';

      } else if (blueHomeSet.has(key)) {
        cls += ' lc-track lc-homecol-blue';
      } else if (redHomeSet.has(key)) {
        cls += ' lc-track lc-homecol-red';
      } else if (trackSet.has(key)) {
        cls += ' lc-track';
        const trackIdx = LM_MAIN_TRACK.findIndex(([c,r]) => c === col && r === row);
        if (LM_ENTRY_CLASS[trackIdx]) {
          cls += ' ' + LM_ENTRY_CLASS[trackIdx];
          inner = '★';
        }
      } else {
        cls += ' lc-empty';
      }

      // Pieces on this cell
      const pieces = pieceMap[key] || [];
      const pieceHtml = pieces.map(({color, pi, isMoveable}) => {
        const moveStyle = isMoveable
          ? 'cursor:pointer;outline:3px solid #f59e0b;outline-offset:1px;'
          : '';
        const onclick = isMoveable
          ? `onclick="lmPickPiece('${color}',${pi})" `
          : '';
        return `<div class="lc-piece lc-piece-${color}${isMoveable?' lc-piece-selectable':''}" ${onclick}style="${moveStyle}">${pi+1}</div>`;
      }).join('');

      if (pieceHtml) inner = pieceHtml;

      boardCells += `<div class="${cls}">${inner}</div>`;
    }
  }

  // Player info
  const bluePiecesDone = (state.pieces.blue || []).filter(p => p === 60).length;
  const redPiecesDone  = (state.pieces.red  || []).filter(p => p === 60).length;

  const bluePlayer = state.players.find(p => p.color === 'blue');
  const redPlayer  = state.players.find(p => p.color === 'red');

  const blueActive = state.currentPlayerIdx === 0 && !isFinished;
  const redActive  = state.currentPlayerIdx === 1 && !isFinished;

  const winnerPlayer = isFinished && state.winner
    ? state.players.find(p => p.uid === state.winner) : null;
  const winnerName = winnerPlayer?.name || 'Someone';

  let statusMsg;
  if (isFinished) {
    statusMsg = `🏆 ${winnerName} wins! All pieces home!`;
  } else if (isMyTurn) {
    if (!state.diceRolled) statusMsg = `👉 Your turn (${myColor === 'blue' ? '🔵' : '🔴'}) — roll the dice!`;
    else statusMsg = `👆 Rolled ${state.diceRoll}! Tap a highlighted piece to move.`;
  } else {
    const oppName = oppPlayer?.name || 'Opponent';
    statusMsg = `⏳ Waiting for ${oppName} (${oppColor === 'blue' ? '🔵' : '🔴'})…`;
  }

  document.getElementById('multi-root').innerHTML = `
    <div style="width:100%;max-width:500px;margin:0 auto">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
        <div style="text-align:center;padding:10px;border-radius:8px;background:${blueActive?'#dbeafe':'#f0f0f0'};border:2px solid ${blueActive?'#3b82f6':'transparent'}">
          <div style="font-size:1.4rem">🔵</div>
          <div style="font-size:.82rem;font-weight:700;color:#1e40af">${bluePlayer?.name||'Blue'}${bluePlayer?.uid===lmUid?' (You)':''}</div>
          <div style="font-size:.75rem;color:#666">${bluePiecesDone}/4 home</div>
        </div>
        <div style="text-align:center;padding:10px;border-radius:8px;background:${redActive?'#fee2e2':'#f0f0f0'};border:2px solid ${redActive?'#ef4444':'transparent'}">
          <div style="font-size:1.4rem">🔴</div>
          <div style="font-size:.82rem;font-weight:700;color:#991b1b">${redPlayer?.name||'Red'}${redPlayer?.uid===lmUid?' (You)':''}</div>
          <div style="font-size:.75rem;color:#666">${redPiecesDone}/4 home</div>
        </div>
      </div>

      <div style="background:#f5f5f5;padding:10px 14px;border-radius:8px;text-align:center;
                  font-weight:700;font-size:.9rem;margin-bottom:12px;min-height:38px;
                  display:flex;align-items:center;justify-content:center">
        ${statusMsg}
      </div>

      ${isMyTurn && !isFinished && !state.diceRolled ? `
        <div style="text-align:center;margin-bottom:10px">
          <button class="btn btn-primary btn-lg" onclick="lmRollDice()">🎲 Roll Dice</button>
        </div>` : ''}
      ${state.diceRolled && state.diceRoll !== null && isMyTurn && !isFinished ? `
        <div style="text-align:center;margin-bottom:10px">
          <span style="font-size:2rem">${['','1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣'][state.diceRoll]||state.diceRoll}</span>
          <span style="font-size:.85rem;color:#666;display:block;font-weight:600">Tap a glowing piece to move</span>
        </div>` : ''}

      <div class="ludo-board" id="lm-board-grid" style="margin-bottom:12px">
        ${boardCells}
      </div>

      <div class="ludo-legend">
        <span>🔵 Blue — bottom-left base</span>
        <span>🔴 Red — bottom-right base</span>
        <span>Roll 6 to enter!</span>
      </div>

      ${isFinished ? `
        <div style="text-align:center;margin-top:16px;display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
          <button class="btn btn-primary" onclick="lmRematch()">🔄 Play Again</button>
          <a href="ludo.html" class="btn btn-secondary">🏠 Home</a>
        </div>` : ''}
    </div>`;
}

// ── Roll Dice ────────────────────────────────────────────────────────
async function lmRollDice() {
  if (!lmState || lmState.status !== 'playing') return;
  if (lmState.currentPlayerIdx !== lmGetPlayerIndex()) return;
  if (lmState.diceRolled) return;

  window.SFX?.play('click');
  const die = Math.floor(Math.random() * 6) + 1;
  const myColor = lmMyColor();
  const moveable = lmGetMoveable(lmState.pieces, myColor, die);

  if (moveable.length === 0) {
    // No moves — skip turn immediately
    window.SFX?.play('lose');
    const nextIdx = (lmState.currentPlayerIdx + 1) % 2;
    await lmRef.update({
      currentPlayerIdx: nextIdx,
      diceRoll: null,
      diceRolled: false
    }).catch(()=>{});
  } else if (moveable.length === 1) {
    // Auto-move only piece
    await lmRef.update({ diceRoll: die, diceRolled: true }).catch(()=>{});
    await lmPickPieceServer(myColor, moveable[0], die);
  } else {
    // Player must choose
    await lmRef.update({ diceRoll: die, diceRolled: true }).catch(()=>{});
  }
}

// Called when player clicks a piece token (local click, updates Firestore)
async function lmPickPiece(color, pieceIdx) {
  if (!lmState || lmState.status !== 'playing') return;
  if (lmState.currentPlayerIdx !== lmGetPlayerIndex()) return;
  if (!lmState.diceRolled) return;
  if (color !== lmMyColor()) return;
  window.SFX?.play('click');
  await lmPickPieceServer(color, pieceIdx, lmState.diceRoll);
}

async function lmPickPieceServer(color, pieceIdx, die) {
  const newPieces = lmApplyMove(lmState.pieces, color, pieceIdx, die);
  const won = lmIsWinner(newPieces, color);
  const gotBonus = die === 6;
  const nextIdx = (won || gotBonus) ? lmState.currentPlayerIdx : (lmState.currentPlayerIdx + 1) % 2;

  await lmRef.update({
    pieces: newPieces,
    currentPlayerIdx: nextIdx,
    diceRoll: null,
    diceRolled: false,
    status: won ? 'finished' : 'playing',
    winner: won ? lmUid : null
  }).catch(()=>{});
}

// ── Rematch ──────────────────────────────────────────────────────────
async function lmRematch() {
  if (!lmRef) return;
  await lmRef.update({
    pieces: lmFreshPieces(),
    currentPlayerIdx: 0,
    diceRoll: null,
    diceRolled: false,
    status: 'playing',
    winner: null,
    p1Heartbeat: null,
    p2Heartbeat: null
  }).catch(()=>{});
}

function hideLoading() {
  const el = document.getElementById('loading-overlay');
  if (el) el.style.display = 'none';
}

window.addEventListener('beforeunload', () => {
  if (lmRef && lmState?.status === 'playing') {
    const isP1 = lmState.players[0]?.uid === lmUid;
    lmRef.update({
      status: 'finished',
      winner: lmState.players[isP1 ? 1 : 0]?.uid || null
    }).catch(()=>{});
  }
});

// ── Snakes & Ladders Multiplayer ───────────────────────────────────
// Real-time 2-4 player Snakes & Ladders game via Firestore.

const SNAKES_SL = { 99:78, 95:75, 93:73, 87:24, 64:60, 62:19, 54:34, 17:7 };
const LADDERS_SL = { 4:14, 9:31, 20:38, 28:84, 40:59, 51:67, 63:81, 71:91 };
const PLAYER_COLORS = ['🔵', '🔴', '🟡', '🟢'];
const CELL_COLORS = ['#ffd6e7','#ffecd1','#fff9c4','#d4f4dd','#cce8ff','#ead4ff'];

let slGameId = null, slRef = null, slUnsub = null, slState = null;
let slUid = null, slName = null;

let slResultSaved   = false;
let slLastRenderKey = '';
let slPrevStatus    = null;
let slHbInt         = null;
let slStaleInt      = null;
let slIsHbRunning   = false;

requireAuth((user, profile) => {
  slUid  = user.uid;
  slName = profile?.name || profile?.username || 'Player';
  renderSLLobby();
});

// ── Helpers ────────────────────────────────────────────────────────
function slGenCode() { return Math.random().toString(36).substr(2,6).toUpperCase(); }

function slSquareNum(gridRow, gridCol) {
  const boardRow = 10 - gridRow;
  const col = (boardRow % 2 === 0) ? (gridCol - 1) : (9 - (gridCol - 1));
  return boardRow * 10 + col + 1;
}

function slGetGridPos(n) {
  const boardRow = Math.floor((n - 1) / 10);
  const col = (boardRow % 2 === 0) ? ((n - 1) % 10) : (9 - ((n - 1) % 10));
  return { gridRow: 10 - boardRow, gridCol: col + 1 };
}

function slGetPlayerIndex() {
  return slState?.players?.findIndex(p => p?.uid === slUid) ?? -1;
}

// ── Lobby ──────────────────────────────────────────────────────────
function renderSLLobby() {
  slStopHeartbeat();
  hideStaleBannerSL();
  if (slUnsub) { slUnsub(); slUnsub = null; }
  slGameId = null; slRef = null; slState = null;
  slResultSaved = false; slLastRenderKey = ''; slPrevStatus = null;

  document.getElementById('multi-root').innerHTML = `
    <div class="multi-lobby card">
      <div style="font-size:3.2rem;margin-bottom:6px">🐍🪜</div>
      <div class="multi-lobby-title">Snakes & Ladders vs Friends</div>
      <p class="multi-lobby-sub">Race to 100! Roll dice and climb ladders,<br>
        watch out for snakes! (2-4 players)</p>
      <div class="multi-lobby-actions">
        <button class="btn btn-primary btn-lg" onclick="slCreate()">🏠 Create Room</button>
        <div class="multi-or">— or —</div>
        <div class="multi-join-row">
          <input type="text" id="sl-join-code" class="form-input multi-code-input"
            placeholder="ABC123" maxlength="6"
            oninput="this.value=this.value.toUpperCase().replace(/[^A-Z0-9]/g,'')"
            onkeydown="if(event.key==='Enter')slJoin()"/>
          <button class="btn btn-secondary" onclick="slJoin()">🚀 Join</button>
        </div>
        <p id="sl-err" class="multi-err"></p>
      </div>
      <a href="snakes-ladders.html" class="btn btn-ghost multi-back-btn">← Play vs Computer</a>
    </div>`;
}

// ── Create Room ────────────────────────────────────────────────────
async function slCreate() {
  const code = slGenCode();
  try {
    const ref = await db.collection('snakes_ladders_games').add({
      code,
      players: [
        { uid: slUid, name: slName, position: 0, lastRoll: null, color: 0 }
      ],
      currentPlayerIdx: 0,
      diceState: null,
      status: 'waiting',
      winner: null,
      p1Heartbeat: null,
      p2Heartbeat: null,
      p3Heartbeat: null,
      p4Heartbeat: null,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    slGameId = ref.id;
    slRef    = db.collection('snakes_ladders_games').doc(slGameId);
    renderSLWaiting(code);
    slListen();
  } catch(e) { console.error('slCreate:', e); }
}

// ── Waiting Screen ─────────────────────────────────────────────────
function renderSLWaiting(code) {
  document.getElementById('multi-root').innerHTML = `
    <div class="multi-waiting card">
      <div class="multi-waiting-icon">🐍</div>
      <div class="multi-waiting-title">Room Created!</div>
      <p class="multi-lobby-sub">Share this code with your friends:</p>
      <div class="room-code-display" id="sl-room-code">${code}</div>
      <p style="color:#888;font-size:.82rem;font-weight:700;margin-bottom:12px">
        Waiting for 1-3 more players (2-4 total)</p>
      <button class="btn btn-outline multi-copy-btn" onclick="slCopy('${code}')">
        📋 Copy Code</button>
      <div class="multi-waiting-spinner">
        <div class="spinner" style="margin:0 auto 10px"></div>
        <p style="color:#999;font-weight:700;font-size:.9rem">
          Waiting for players to join…</p>
      </div>
      <button class="btn btn-ghost multi-back-btn" onclick="slCancel()">✖ Cancel Room</button>
    </div>`;
}

function slCopy(code) {
  navigator.clipboard.writeText(code).catch(()=>{});
  const el = document.getElementById('sl-room-code');
  if (el) { const o=el.textContent; el.textContent='✅ Copied!'; setTimeout(()=>el.textContent=o,1500); }
}

// ── Join Room ──────────────────────────────────────────────────────
async function slJoin() {
  const code  = (document.getElementById('sl-join-code')?.value||'').trim().toUpperCase();
  const errEl = document.getElementById('sl-err');
  if (!code) { if(errEl) errEl.textContent='Enter the 6-character room code.'; return; }
  try {
    const snap = await db.collection('snakes_ladders_games')
      .where('code','==',code).where('status','==','waiting').limit(1).get();
    if (snap.empty) {
      if(errEl) errEl.textContent='Room not found — check the code and try again.'; return;
    }
    const doc = snap.docs[0];
    const data = doc.data();
    if (data.players.some(p => p.uid === slUid)) {
      if(errEl) errEl.textContent="You're already in this room!"; return;
    }
    if (data.players.length >= 4) {
      if(errEl) errEl.textContent='Room is full (4 players max).'; return;
    }
    slGameId = doc.id;
    slRef    = db.collection('snakes_ladders_games').doc(slGameId);
    const newPlayers = [...data.players, { uid: slUid, name: slName, position: 0, lastRoll: null, color: data.players.length }];
    await slRef.update({
      players: newPlayers,
      status: newPlayers.length >= 2 ? 'playing' : 'waiting'
    });
    slListen();
  } catch(e) {
    console.error('slJoin:', e);
    if(errEl) errEl.textContent='Could not join — please try again.';
  }
}

// ── Cancel ─────────────────────────────────────────────────────────
async function slCancel() {
  slStopHeartbeat();
  if (slUnsub) { slUnsub(); slUnsub = null; }
  if (slRef)   await slRef.delete().catch(()=>{});
  renderSLLobby();
}

// ── Real-time Listener ─────────────────────────────────────────────
function slListen() {
  if (slUnsub) slUnsub();
  slUnsub = db.collection('snakes_ladders_games').doc(slGameId).onSnapshot(snap => {
    if (!snap.exists) { renderSLLobby(); return; }
    slState = snap.data();
    const s    = slState.status;
    const prev = slPrevStatus;
    slPrevStatus = s;

    if (s === 'waiting') {
      renderSLWaitingWithList();

    } else if (s === 'playing') {
      slStartHeartbeat();
      slStartStaleCheck();

      if (prev !== 'playing') {
        window.SFX?.play(prev === 'finished' ? 'rematch' : 'join');
      }

      const rk = JSON.stringify([slState.players.map(p => p.position), slState.currentPlayerIdx]);
      if (rk !== slLastRenderKey) {
        slLastRenderKey = rk;
        renderSLBoard(slState, false);
      }

    } else if (s === 'finished') {
      slStopHeartbeat();
      hideStaleBannerSL();

      if (!slResultSaved) {
        slResultSaved = true;
        slSaveMyResult(slState);
        if (slState.winner === slUid) window.SFX?.play('win');
        else window.SFX?.play('lose');
      }

      slLastRenderKey = '';
      renderSLBoard(slState, true);
    }
  });
}

// ── Waiting list render ────────────────────────────────────────────
function renderSLWaitingWithList() {
  const playerList = (slState?.players || [])
    .map((p, i) => `<div style="padding:6px 0;color:#666;font-weight:600">
      ${PLAYER_COLORS[p.color]} ${p.name}${p.uid === slUid ? ' (You)' : ''}</div>`)
    .join('');

  document.getElementById('multi-root').innerHTML = `
    <div class="multi-waiting card">
      <div class="multi-waiting-icon">🐍</div>
      <div class="multi-waiting-title">Waiting for Players</div>
      <div style="background:#f5f5f5;padding:12px;border-radius:8px;margin:12px 0;font-size:.85rem">
        ${playerList}
      </div>
      <p style="color:#888;font-size:.82rem;font-weight:700;margin:12px 0">
        Room Code: <strong>${slState?.code || ''}</strong></p>
      <p style="color:#999;font-weight:700;font-size:.9rem">
        ${slState?.players?.length || 0}/4 players — Starting game…</p>
      <button class="btn btn-ghost multi-back-btn" onclick="slCancel()">✖ Leave Room</button>
    </div>`;
}

// ── Save result ────────────────────────────────────────────────────
async function slSaveMyResult(data) {
  const myIdx = data.players.findIndex(p => p.uid === slUid);
  const outcome = data.winner === slUid ? 'win' : 'lose';
  const oppNames = data.players.filter(p => p.uid !== slUid).map(p => p.name).join(', ');

  await saveResult({
    gameType: 'snakes-ladders-multi',
    outcome,
    moves: 0,
    opponent: oppNames,
    mode: 'multiplayer'
  });
}

// ── Heartbeat ──────────────────────────────────────────────────────
function slStartHeartbeat() {
  if (slIsHbRunning) return;
  slIsHbRunning = true;

  const players = slState?.players || [];
  const myIdx = players.findIndex(p => p?.uid === slUid);
  const field = ['p1Heartbeat','p2Heartbeat','p3Heartbeat','p4Heartbeat'][myIdx];

  const beat = () => {
    if (!slRef || slState?.status !== 'playing') { slStopHeartbeat(); return; }
    slRef.update({ [field]: firebase.firestore.FieldValue.serverTimestamp() }).catch(()=>{});
  };
  beat();
  slHbInt = setInterval(beat, 15000);
}

function slStopHeartbeat() {
  if (slHbInt)    { clearInterval(slHbInt);    slHbInt    = null; }
  if (slStaleInt) { clearInterval(slStaleInt); slStaleInt = null; }
  slIsHbRunning = false;
}

// ── Staleness check ────────────────────────────────────────────────
function slStartStaleCheck() {
  if (slStaleInt) return;
  slStaleInt = setInterval(slCheckStale, 10000);
}

function slCheckStale() {
  if (!slState || slState.status !== 'playing') return;
  const hbs = [slState.p1Heartbeat, slState.p2Heartbeat, slState.p3Heartbeat, slState.p4Heartbeat];
  let anyStale = false;

  for (const hb of hbs) {
    if (!hb) continue;
    const ms = hb.toDate ? hb.toDate().getTime() : hb.seconds * 1000;
    const age = Date.now() - ms;
    if (age > 35000) { anyStale = true; break; }
  }

  const banner = document.getElementById('stale-banner-sl');
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

// ── Stale banner helpers ───────────────────────────────────────────
function hideStaleBannerSL() {
  const el = document.getElementById('stale-banner-sl');
  if (el) el.style.display = 'none';
}

async function claimWinSL() {
  slStopHeartbeat();
  hideStaleBannerSL();
  if (slRef) {
    await slRef.update({ status: 'finished', winner: slUid }).catch(()=>{});
  }
}

// ── Game board render ──────────────────────────────────────────────
function renderSLBoard(state, isFinished) {
  const isMyTurn = state.currentPlayerIdx === slGetPlayerIndex();
  const currentPlayer = state.players[state.currentPlayerIdx];

  const playerInfo = state.players.map((p, i) => {
    const isCurrent = i === state.currentPlayerIdx;
    return `<div style="text-align:center;padding:8px;border-radius:6px;
              ${isCurrent ? 'background:#fff9c4;border:2px solid #f59e0b;' : 'background:#f0f0f0;border:2px solid transparent;'}
              font-weight:${isCurrent ? '800' : '600'}">
      <div style="font-size:1.2rem">${PLAYER_COLORS[p.color]}</div>
      <div style="font-size:0.75rem;color:#666">${p.name}</div>
      <div style="font-size:1rem;color:#333">Pos: ${p.position}</div>
    </div>`;
  }).join('');

  const boardCells = [];
  for (let gridRow = 1; gridRow <= 10; gridRow++) {
    for (let gridCol = 1; gridCol <= 10; gridCol++) {
      const n = slSquareNum(gridRow, gridCol);
      const hasSnake = n in SNAKES_SL;
      const hasLadder = n in LADDERS_SL;
      const bgColor = hasSnake ? '#fee2e2' : hasLadder ? '#dcfce7' : CELL_COLORS[(n - 1) % CELL_COLORS.length];
      const pieces = state.players.filter(p => p.position === n).map(p => `<span style="font-size:0.7rem">${PLAYER_COLORS[p.color]}</span>`).join('');

      let cellHtml = `<div class="sl-cell" style="background:${bgColor};border:${hasSnake ? '2px solid #dc2626' : hasLadder ? '2px solid #16a34a' : '1px solid rgba(0,0,0,.08)'};">
        <span class="sl-num">${n}</span>`;
      if (hasSnake) cellHtml += `<span class="sl-icon">🐍</span>`;
      if (hasLadder) cellHtml += `<span class="sl-icon">🪜</span>`;
      if (n === 1) cellHtml += `<span class="sl-icon">🏁</span>`;
      if (n === 100) cellHtml += `<span class="sl-icon">🏆</span>`;
      cellHtml += `<div style="font-size:0.85rem">${pieces}</div></div>`;
      boardCells.push(cellHtml);
    }
  }

  const status = isFinished
    ? `🏆 Game Over! ${state.players[state.players.findIndex(p => p.uid === state.winner)]?.name || 'Winner'} reached 100!`
    : `${isMyTurn ? '👉 Your turn! Roll the dice.' : `⏳ Waiting for ${currentPlayer?.name || 'opponent'}...`}`;

  document.getElementById('multi-root').innerHTML = `
    <div style="width:100%;">
      <div style="display:grid;grid-template-columns:repeat(${state.players.length}, 1fr);gap:8px;margin-bottom:16px">
        ${playerInfo}
      </div>
      <div style="background:#f5f5f5;padding:12px;border-radius:8px;text-align:center;
                  font-weight:700;margin-bottom:16px;min-height:40px;display:flex;align-items:center;justify-content:center">
        ${status}</div>
      <div style="display:grid;grid-template-columns:repeat(10, 1fr);gap:2px;margin-bottom:16px">
        ${boardCells.join('')}
      </div>
      ${isMyTurn && !isFinished ? `
        <div style="text-align:center">
          <button class="btn btn-primary btn-lg" onclick="slRollDice()">🎲 Roll Dice</button>
        </div>
      ` : ''}
      ${isFinished ? `
        <div style="text-align:center">
          <button class="btn btn-primary" onclick="slRematch()">🔄 Play Again</button>
          <a href="snakes-ladders.html" class="btn btn-secondary" style="display:inline-block;margin-left:8px">🏠 Home</a>
        </div>
      ` : ''}
    </div>`;
}

// ── Roll dice ──────────────────────────────────────────────────────
async function slRollDice() {
  if (!slState || slState.status !== 'playing') return;
  if (slState.currentPlayerIdx !== slGetPlayerIndex()) return;

  window.SFX?.play('click');
  const die = Math.floor(Math.random() * 6) + 1;

  const newPlayers = [...slState.players];
  let newPos = newPlayers[slState.currentPlayerIdx].position + die;

  // Overshoot: bounce back
  if (newPos > 100) {
    newPos = slState.players[slState.currentPlayerIdx].position;
    window.SFX?.play('lose');
  } else {
    window.SFX?.play('win');

    // Check for snake or ladder
    if (newPos in SNAKES_SL) {
      newPos = SNAKES_SL[newPos];
      window.SFX?.play('lose');
    } else if (newPos in LADDERS_SL) {
      newPos = LADDERS_SL[newPos];
      window.SFX?.play('win');
    }
  }

  newPlayers[slState.currentPlayerIdx].position = newPos;
  newPlayers[slState.currentPlayerIdx].lastRoll = die;

  const nextPlayerIdx = newPos === 100 ? slState.currentPlayerIdx : (slState.currentPlayerIdx + 1) % slState.players.length;
  const gameStatus = newPos === 100 ? 'finished' : 'playing';
  const gameWinner = newPos === 100 ? slUid : null;

  await slRef.update({
    players: newPlayers,
    currentPlayerIdx: nextPlayerIdx,
    status: gameStatus,
    winner: gameWinner
  }).catch(()=>{});
}

// ── Rematch ────────────────────────────────────────────────────────
async function slRematch() {
  if (!slRef) return;
  const newPlayers = slState.players.map(p => ({ ...p, position: 0, lastRoll: null }));

  await slRef.update({
    players: newPlayers,
    currentPlayerIdx: 0,
    status: 'playing',
    winner: null,
    p1Heartbeat: null,
    p2Heartbeat: null,
    p3Heartbeat: null,
    p4Heartbeat: null
  }).catch(()=>{});
}

function hideLoading() {
  const el = document.getElementById('loading-overlay');
  if (el) el.style.display = 'none';
}

window.addEventListener('beforeunload', () => {
  if (slRef && slState?.status === 'playing') {
    const isP1 = slState.players[0].uid === slUid;
    slRef.update({ status: 'finished', winner: slState.players[isP1 ? 1 : 0]?.uid || null }).catch(()=>{});
  }
});

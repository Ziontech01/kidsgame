// ── Matching Game Multiplayer ──────────────────────────────────────
// Real-time 2-4 player Matching via Firestore.
// Players match pairs from left column to right column, turn-based.

const MATCH_PAIRS = [
  { id: 0, label: '🍎', emoji: '🍎' },
  { id: 1, label: '🍌', emoji: '🍌' },
  { id: 2, label: '🍊', emoji: '🍊' },
  { id: 3, label: '🍓', emoji: '🍓' },
  { id: 4, label: '🍉', emoji: '🍉' },
  { id: 5, label: '🥝', emoji: '🥝' },
  { id: 6, label: '🍇', emoji: '🍇' },
  { id: 7, label: '🥕', emoji: '🥕' }
];

let mxGameId = null, mxRef = null, mxUnsub = null, mxState = null;
let mxUid = null, mxName = null;

let mxResultSaved   = false;
let mxLastRenderKey = '';
let mxPrevStatus    = null;
let mxHbInt         = null;
let mxStaleInt      = null;
let mxIsHbRunning   = false;

requireAuth((user, profile) => {
  mxUid  = user.uid;
  mxName = profile?.name || profile?.username || 'Player';
  renderMXLobby();
});

// ── Helpers ────────────────────────────────────────────────────────
function mxGenCode() { return Math.random().toString(36).substr(2,6).toUpperCase(); }

function mxShufflePairs() {
  const left = [...MATCH_PAIRS].sort(() => Math.random() - 0.5);
  const right = [...MATCH_PAIRS].sort(() => Math.random() - 0.5);
  return { left, right };
}

function mxGetPlayerIndex() {
  return mxState?.players?.findIndex(p => p?.uid === mxUid) ?? -1;
}

// ── Lobby ──────────────────────────────────────────────────────────
function renderMXLobby() {
  mxStopHeartbeat();
  hideStaleBannerMX();
  if (mxUnsub) { mxUnsub(); mxUnsub = null; }
  mxGameId = null; mxRef = null; mxState = null;
  mxResultSaved = false; mxLastRenderKey = ''; mxPrevStatus = null;

  document.getElementById('multi-root').innerHTML = `
    <div class="multi-lobby card">
      <div style="font-size:3.2rem;margin-bottom:6px">🎯🎯</div>
      <div class="multi-lobby-title">Play Matching vs Friends</div>
      <p class="multi-lobby-sub">Match items from left to right!<br>Create a room and share the code.</p>
      <div class="multi-lobby-actions">
        <button class="btn btn-primary btn-lg" onclick="mxCreate()">🏠 Create Room</button>
        <div class="multi-or">— or —</div>
        <div class="multi-join-row">
          <input type="text" id="mx-join-code" class="form-input multi-code-input"
            placeholder="ABC123" maxlength="6"
            oninput="this.value=this.value.toUpperCase().replace(/[^A-Z0-9]/g,'')"
            onkeydown="if(event.key==='Enter')mxJoin()"/>
          <button class="btn btn-secondary" onclick="mxJoin()">🚀 Join</button>
        </div>
        <p id="mx-err" class="multi-err"></p>
      </div>
      <a href="matching.html" class="btn btn-ghost multi-back-btn">← Play Solo instead</a>
    </div>`;
}

// ── Create Room ────────────────────────────────────────────────────
async function mxCreate() {
  const code = mxGenCode();
  try {
    const { left, right } = mxShufflePairs();
    const ref = await db.collection('matching_games').add({
      code,
      players: [
        { uid: mxUid, name: mxName, score: 0, mistakes: 0 }
      ],
      left,
      right,
      matched: [],
      currentPlayerIdx: 0,
      status: 'waiting',
      winner: null,
      p1Heartbeat: null,
      p2Heartbeat: null,
      p3Heartbeat: null,
      p4Heartbeat: null,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    mxGameId = ref.id;
    mxRef    = db.collection('matching_games').doc(mxGameId);
    renderMXWaiting(code);
    mxListen();
  } catch(e) { console.error('mxCreate:', e); }
}

// ── Waiting Screen ─────────────────────────────────────────────────
function renderMXWaiting(code) {
  document.getElementById('multi-root').innerHTML = `
    <div class="multi-waiting card">
      <div class="multi-waiting-icon">🎯</div>
      <div class="multi-waiting-title">Room Created!</div>
      <p class="multi-lobby-sub">Share this code with your friends:</p>
      <div class="room-code-display" id="mx-room-code">${code}</div>
      <p style="color:#888;font-size:.82rem;font-weight:700;margin-bottom:12px">
        Waiting for 1-3 more players (2-4 total)</p>
      <button class="btn btn-outline multi-copy-btn" onclick="mxCopy('${code}')">
        📋 Copy Code</button>
      <div class="multi-waiting-spinner">
        <div class="spinner" style="margin:0 auto 10px"></div>
        <p style="color:#999;font-weight:700;font-size:.9rem">
          Waiting for players to join…</p>
      </div>
      <button class="btn btn-ghost multi-back-btn" onclick="mxCancel()">✖ Cancel Room</button>
    </div>`;
}

function mxCopy(code) {
  navigator.clipboard.writeText(code).catch(()=>{});
  const el = document.getElementById('mx-room-code');
  if (el) { const o=el.textContent; el.textContent='✅ Copied!'; setTimeout(()=>el.textContent=o,1500); }
}

// ── Join Room ──────────────────────────────────────────────────────
async function mxJoin() {
  const code  = (document.getElementById('mx-join-code')?.value||'').trim().toUpperCase();
  const errEl = document.getElementById('mx-err');
  if (!code) { if(errEl) errEl.textContent='Enter the 6-character room code.'; return; }
  try {
    const snap = await db.collection('matching_games')
      .where('code','==',code).where('status','==','waiting').limit(1).get();
    if (snap.empty) {
      if(errEl) errEl.textContent='Room not found — check the code and try again.'; return;
    }
    const doc = snap.docs[0];
    const data = doc.data();
    if (data.players.some(p => p.uid === mxUid)) {
      if(errEl) errEl.textContent="You're already in this room!"; return;
    }
    if (data.players.length >= 4) {
      if(errEl) errEl.textContent='Room is full (4 players max).'; return;
    }
    mxGameId = doc.id;
    mxRef    = db.collection('matching_games').doc(mxGameId);
    const newPlayers = [...data.players, { uid: mxUid, name: mxName, score: 0, mistakes: 0 }];
    await mxRef.update({
      players: newPlayers,
      status: newPlayers.length >= 2 ? 'playing' : 'waiting'
    });
    mxListen();
  } catch(e) {
    console.error('mxJoin:', e);
    if(errEl) errEl.textContent='Could not join — please try again.';
  }
}

// ── Cancel ─────────────────────────────────────────────────────────
async function mxCancel() {
  mxStopHeartbeat();
  if (mxUnsub) { mxUnsub(); mxUnsub = null; }
  if (mxRef)   await mxRef.delete().catch(()=>{});
  renderMXLobby();
}

// ── Real-time Listener ─────────────────────────────────────────────
function mxListen() {
  if (mxUnsub) mxUnsub();
  mxUnsub = db.collection('matching_games').doc(mxGameId).onSnapshot(snap => {
    if (!snap.exists) { renderMXLobby(); return; }
    mxState = snap.data();
    const s    = mxState.status;
    const prev = mxPrevStatus;
    mxPrevStatus = s;

    if (s === 'waiting') {
      renderMXWaitingWithList();

    } else if (s === 'playing') {
      mxStartHeartbeat();
      mxStartStaleCheck();

      if (prev !== 'playing') {
        window.SFX?.play(prev === 'finished' ? 'rematch' : 'join');
      }

      const rk = JSON.stringify([mxState.matched, mxState.currentPlayerIdx]);
      if (rk !== mxLastRenderKey) {
        mxLastRenderKey = rk;
        renderMXBoard(mxState, false);
      }

    } else if (s === 'finished') {
      mxStopHeartbeat();
      hideStaleBannerMX();

      if (!mxResultSaved) {
        mxResultSaved = true;
        mxSaveMyResult(mxState);
        if (mxState.winner === mxUid) window.SFX?.play('win');
        else window.SFX?.play('lose');
      }

      mxLastRenderKey = '';
      renderMXBoard(mxState, true);
    }
  });
}

// ── Waiting list render ────────────────────────────────────────────
function renderMXWaitingWithList() {
  const playerList = (mxState?.players || [])
    .map((p, i) => `<div style="padding:6px 0;color:#666;font-weight:600">
      ${i + 1}. ${p.name}${p.uid === mxUid ? ' (You)' : ''}</div>`)
    .join('');

  document.getElementById('multi-root').innerHTML = `
    <div class="multi-waiting card">
      <div class="multi-waiting-icon">🎯</div>
      <div class="multi-waiting-title">Waiting for Players</div>
      <div style="background:#f5f5f5;padding:12px;border-radius:8px;margin:12px 0;
                  font-size:.85rem">
        ${playerList}
      </div>
      <p style="color:#888;font-size:.82rem;font-weight:700;margin:12px 0">
        Room Code: <strong>${mxState?.code || ''}</strong></p>
      <p style="color:#999;font-weight:700;font-size:.9rem">
        ${mxState?.players?.length || 0}/4 players joined — Starting game…</p>
      <button class="btn btn-ghost multi-back-btn" onclick="mxCancel()">✖ Leave Room</button>
    </div>`;
}

// ── Save result ────────────────────────────────────────────────────
async function mxSaveMyResult(data) {
  const myIdx = data.players.findIndex(p => p.uid === mxUid);
  const myScore = data.players[myIdx]?.score || 0;
  const maxScore = Math.max(...data.players.map(p => p.score || 0));

  const outcome = myScore === maxScore ? 'win' : 'lose';
  const oppNames = data.players
    .filter(p => p.uid !== mxUid)
    .map(p => p.name)
    .join(', ');

  await saveResult({
    gameType: 'matching-multi',
    outcome,
    moves: data.matched.length,
    opponent: oppNames,
    mode: 'multiplayer'
  });
}

// ── Heartbeat ──────────────────────────────────────────────────────
function mxStartHeartbeat() {
  if (mxIsHbRunning) return;
  mxIsHbRunning = true;

  const players = mxState?.players || [];
  const myIdx = players.findIndex(p => p?.uid === mxUid);
  const field = ['p1Heartbeat','p2Heartbeat','p3Heartbeat','p4Heartbeat'][myIdx];

  const beat = () => {
    if (!mxRef || mxState?.status !== 'playing') { mxStopHeartbeat(); return; }
    mxRef.update({ [field]: firebase.firestore.FieldValue.serverTimestamp() }).catch(()=>{});
  };
  beat();
  mxHbInt = setInterval(beat, 15000);
}

function mxStopHeartbeat() {
  if (mxHbInt)    { clearInterval(mxHbInt);    mxHbInt    = null; }
  if (mxStaleInt) { clearInterval(mxStaleInt); mxStaleInt = null; }
  mxIsHbRunning = false;
}

// ── Staleness check ────────────────────────────────────────────────
function mxStartStaleCheck() {
  if (mxStaleInt) return;
  mxStaleInt = setInterval(mxCheckStale, 10000);
}

function mxCheckStale() {
  if (!mxState || mxState.status !== 'playing') return;
  const hbs = [mxState.p1Heartbeat, mxState.p2Heartbeat, mxState.p3Heartbeat, mxState.p4Heartbeat];
  let anyStale = false;

  for (const hb of hbs) {
    if (!hb) continue;
    const ms = hb.toDate ? hb.toDate().getTime() : hb.seconds * 1000;
    const age = Date.now() - ms;
    if (age > 35000) { anyStale = true; break; }
  }

  const banner = document.getElementById('stale-banner-x');
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
function hideStaleBannerMX() {
  const el = document.getElementById('stale-banner-x');
  if (el) el.style.display = 'none';
}

async function claimWinMX() {
  mxStopHeartbeat();
  hideStaleBannerMX();
  if (mxRef) {
    await mxRef.update({ status: 'finished', winner: mxUid }).catch(()=>{});
  }
}

// ── Game board render ──────────────────────────────────────────────
function renderMXBoard(state, isFinished) {
  const isMyTurn = state.currentPlayerIdx === mxGetPlayerIndex();
  const currentPlayer = state.players[state.currentPlayerIdx];

  const playerScores = state.players
    .map((p, i) => {
      const isCurrent = i === state.currentPlayerIdx;
      return `<div style="padding:8px 12px;border-radius:6px;
                ${isCurrent ? 'background:#ffd700;font-weight:bold' : 'background:#f0f0f0'}
                ;text-align:center;flex:1">
        <div style="font-size:0.75rem;color:#666">${p.name}</div>
        <div style="font-size:1.2rem;color:#333">${p.score}</div>
      </div>`;
    }).join('');

  const leftItems = state.left
    .map((item, idx) => {
      const matched = state.matched.includes(idx);
      return `<button class="match-item ${matched ? 'match-matched' : ''}"
                onclick="mxSelectLeft(${idx})" ${isFinished || !isMyTurn || matched ? 'disabled' : ''}>
        ${item.emoji}</button>`;
    }).join('');

  const rightItems = state.right
    .map((item, idx) => {
      const matched = state.matched.includes(idx + 100);
      return `<button class="match-item ${matched ? 'match-matched' : ''}"
                onclick="mxSelectRight(${idx})" ${isFinished || !isMyTurn || matched ? 'disabled' : ''}>
        ${item.emoji}</button>`;
    }).join('');

  const status = isFinished
    ? `🏆 Game Over! ${state.players[state.players.findIndex(p => p.uid === state.winner)]?.name || 'Winner'} wins!`
    : `${isMyTurn ? '👉 Your turn!' : `⏳ Waiting for ${currentPlayer?.name || 'opponent'}...`}`;

  document.getElementById('multi-root').innerHTML = `
    <div style="width:100%;max-width:600px;">
      <div style="margin-bottom:16px">${playerScores}</div>
      <div style="background:#fff8e1;padding:12px;border-radius:8px;text-align:center;
                  font-weight:700;margin-bottom:16px;min-height:40px;display:flex;align-items:center;justify-content:center">
        ${status}</div>
      <div style="display:flex;gap:16px;margin-bottom:16px">
        <div style="flex:1;display:grid;grid-template-columns:repeat(2, 1fr);gap:8px">
          ${leftItems}
        </div>
        <div style="flex:1;display:grid;grid-template-columns:repeat(2, 1fr);gap:8px">
          ${rightItems}
        </div>
      </div>
      ${isFinished ? `
        <div style="text-align:center">
          <button class="btn btn-primary" onclick="mxRematch()">🔄 Play Again</button>
          <a href="matching.html" class="btn btn-secondary" style="display:inline-block;margin-left:8px">🏠 Home</a>
        </div>
      ` : ''}
    </div>`;
}

let mxSelectedLeft = null;

async function mxSelectLeft(idx) {
  if (!mxState || mxState.status !== 'playing') return;
  if (mxState.currentPlayerIdx !== mxGetPlayerIndex()) return;
  mxSelectedLeft = idx;
  renderMXBoard(mxState, false);
}

async function mxSelectRight(idx) {
  if (!mxState || mxState.status !== 'playing') return;
  if (mxState.currentPlayerIdx !== mxGetPlayerIndex()) return;
  if (mxSelectedLeft === null) return;

  const leftId = mxState.left[mxSelectedLeft].id;
  const rightId = mxState.right[idx].id;

  mxSelectedLeft = null;

  if (leftId === rightId) {
    // Match!
    window.SFX?.play('win');
    await new Promise(resolve => setTimeout(resolve, 400));

    const newMatched = [...mxState.matched, mxSelectedLeft, idx + 100];
    const newPlayers = [...mxState.players];
    newPlayers[mxState.currentPlayerIdx].score += 1;

    const allMatched = newMatched.length === mxState.left.length * 2;
    const gameStatus = allMatched ? 'finished' : 'playing';
    const gameWinner = allMatched ? newPlayers.reduce((a, b) => a.score >= b.score ? a : b).uid : null;

    await mxRef.update({
      matched: newMatched,
      players: newPlayers,
      status: gameStatus,
      winner: gameWinner
    }).catch(()=>{});
  } else {
    // No match
    window.SFX?.play('lose');
    await new Promise(resolve => setTimeout(resolve, 600));

    const newPlayers = [...mxState.players];
    newPlayers[mxState.currentPlayerIdx].mistakes += 1;
    const nextPlayerIdx = (mxState.currentPlayerIdx + 1) % mxState.players.length;

    await mxRef.update({
      players: newPlayers,
      currentPlayerIdx: nextPlayerIdx
    }).catch(()=>{});
  }
}

// ── Rematch ────────────────────────────────────────────────────────
async function mxRematch() {
  if (!mxRef) return;
  const { left, right } = mxShufflePairs();
  const newPlayers = mxState.players.map(p => ({ ...p, score: 0, mistakes: 0 }));

  await mxRef.update({
    left,
    right,
    matched: [],
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

// ── Hide loading ───────────────────────────────────────────────────
function hideLoading() {
  const el = document.getElementById('loading-overlay');
  if (el) el.style.display = 'none';
}

window.addEventListener('beforeunload', () => {
  if (mxRef && mxState?.status === 'playing') {
    const isP1 = mxState.players[0].uid === mxUid;
    mxRef.update({ status: 'finished', winner: mxState.players[isP1 ? 1 : 0]?.uid || null }).catch(()=>{});
  }
});

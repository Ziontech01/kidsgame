// ── Spot the Difference Multiplayer ─────────────────────────────────
// Race mode: both players see the same scene, first to find all 5 wins.
'use strict';

// ── Scene data (mirrored from spot-diff.js) ──────────────────────────
const SDM_SCENES_RAW = [
  { name:'At the Beach 🏖️',
    original:['🌊','⛱️','🐚','🦀','⛵','☀️','🐠','🦭','🪸','🌴',
              '🏄','🐙','🌊','🦈','🐡','🚢','🪨','🏖️','🐚','🌊',
              '⭐','🦞','🌈','🐟','🌺'] },
  { name:'In the Garden 🌻',
    original:['🌸','🐝','🌿','🦋','🌻','🐛','🌱','🐞','🌷','🍃',
              '🐦','🌼','🐌','🌾','🍄','🌳','🐇','🌺','🦔','🌿',
              '🌻','🐸','🌈','🍁','🐦'] },
  { name:'The Farmyard 🐄',
    original:['🐄','🌾','🐓','🐖','🐑','🏠','🚜','🌳','🌻','🐕',
              '🐎','🐄','🌿','🐓','🌾','🏚️','🐑','🐖','🌳','🚜',
              '🌻','🐕','🌞','🐎','🌾'] },
  { name:'Outer Space 🚀',
    original:['🌟','🚀','🪐','⭐','🌕','☄️','🌍','🔭','🌟','🛸',
              '🌙','💫','🪐','🌟','🌠','🚀','⭐','🌌','☄️','🌕',
              '🌟','🛸','💫','🔭','🌍'] },
  { name:'The Kitchen 🍳',
    original:['🍎','🥛','🍞','🥚','🧀','🍳','🥕','🍌','🫖','🥦',
              '🍽️','🥄','🍋','🧂','🫙','🥣','🍰','🥤','🧁','🍓',
              '🥑','🫐','🍇','🥝','🍊'] }
];

const SDM_REPLACEMENTS = {
  '🦀':'🦞','🌴':'🌵','🌊':'⛈️','🌈':'🌙','🐡':'🐠',
  '🐞':'🐝','🌿':'🍀','🌻':'🌼','🍁':'🍂','🐛':'🐜',
  '🐕':'🐈','🚜':'🚗','🌞':'🌙','🐎':'🐴','🐖':'🐗',
  '🌠':'⭐','⭐':'🌟','💫':'🌕','🚀':'🛸','🌟':'💫',
  '🫖':'☕','🍰':'🎂','🥝':'🍉','🍎':'🍐','🍓':'🍒'
};
const SDM_FALLBACK = ['🌟','⭐','💫','🌙','☀️'];

const SDM_SCENES = SDM_SCENES_RAW.map(s => {
  const modified = [...s.original];
  const diffs = [];
  for (let i = 0; i < 25 && diffs.length < 5; i++) {
    if (SDM_REPLACEMENTS[s.original[i]]) {
      modified[i] = SDM_REPLACEMENTS[s.original[i]];
      diffs.push(i);
    }
  }
  if (diffs.length < 5) {
    for (let i = 0; i < 25 && diffs.length < 5; i++) {
      if (!diffs.includes(i)) {
        modified[i] = SDM_FALLBACK[diffs.length];
        diffs.push(i);
      }
    }
  }
  return { name: s.name, original: s.original, modified, diffs };
});

// ── Firestore state ──────────────────────────────────────────────────
let sdmGameId = null, sdmRef = null, sdmUnsub = null, sdmState = null;
let sdmUid = null, sdmName = null;
let sdmResultSaved   = false;
let sdmLastRenderKey = '';
let sdmPrevStatus    = null;
let sdmHbInt         = null;
let sdmStaleInt      = null;
let sdmIsHbRunning   = false;

requireAuth((user, profile) => {
  sdmUid  = user.uid;
  sdmName = profile?.name || profile?.username || 'Player';
  renderSDMLobby();
});

// ── Helpers ──────────────────────────────────────────────────────────
function sdmGenCode() { return Math.random().toString(36).substr(2,6).toUpperCase(); }

function sdmGetPlayerIndex() {
  return sdmState?.players?.findIndex(p => p?.uid === sdmUid) ?? -1;
}

function sdmMyFound() {
  const idx = sdmGetPlayerIndex();
  return sdmState?.players?.[idx]?.found ?? [];
}

// ── Lobby ─────────────────────────────────────────────────────────────
function renderSDMLobby() {
  sdmStopHeartbeat();
  hideStaleBannerSDM();
  if (sdmUnsub) { sdmUnsub(); sdmUnsub = null; }
  sdmGameId = null; sdmRef = null; sdmState = null;
  sdmResultSaved = false; sdmLastRenderKey = ''; sdmPrevStatus = null;

  document.getElementById('multi-root').innerHTML = `
    <div class="multi-lobby card">
      <div style="font-size:3.2rem;margin-bottom:6px">🔍🏆</div>
      <div class="multi-lobby-title">Spot the Difference vs Friend</div>
      <p class="multi-lobby-sub">Same scene for both players —<br>first to find all 5 differences wins!</p>
      <div class="multi-lobby-actions">
        <button class="btn btn-primary btn-lg" onclick="sdmCreate()">🏠 Create Room</button>
        <div class="multi-or">— or —</div>
        <div class="multi-join-row">
          <input type="text" id="sdm-join-code" class="form-input multi-code-input"
            placeholder="ABC123" maxlength="6"
            oninput="this.value=this.value.toUpperCase().replace(/[^A-Z0-9]/g,'')"
            onkeydown="if(event.key==='Enter')sdmJoin()"/>
          <button class="btn btn-secondary" onclick="sdmJoin()">🚀 Join</button>
        </div>
        <p id="sdm-err" class="multi-err"></p>
      </div>
      <a href="spot-diff.html" class="btn btn-ghost multi-back-btn">← Play Solo</a>
    </div>`;
  hideLoading();
}

// ── Create Room ───────────────────────────────────────────────────────
async function sdmCreate() {
  const code = sdmGenCode();
  try {
    const ref = await db.collection('spot_diff_games').add({
      code,
      players: [{ uid: sdmUid, name: sdmName, found: [] }],
      sceneIdx: Math.floor(Math.random() * SDM_SCENES.length),
      status: 'waiting',
      winner: null,
      p1Heartbeat: null,
      p2Heartbeat: null,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    sdmGameId = ref.id;
    sdmRef    = db.collection('spot_diff_games').doc(sdmGameId);
    renderSDMWaiting(code);
    sdmListen();
  } catch(e) { console.error('sdmCreate:', e); }
}

// ── Waiting Screen ────────────────────────────────────────────────────
function renderSDMWaiting(code) {
  document.getElementById('multi-root').innerHTML = `
    <div class="multi-waiting card">
      <div class="multi-waiting-icon">🔍</div>
      <div class="multi-waiting-title">Room Created!</div>
      <p class="multi-lobby-sub">Share this code with your friend:</p>
      <div class="room-code-display" id="sdm-room-code">${code}</div>
      <p style="color:#888;font-size:.82rem;font-weight:700;margin-bottom:12px">
        A random scene will start when your friend joins</p>
      <button class="btn btn-outline multi-copy-btn" onclick="sdmCopy('${code}')">📋 Copy Code</button>
      <div class="multi-waiting-spinner">
        <div class="spinner" style="margin:0 auto 10px"></div>
        <p style="color:#999;font-weight:700;font-size:.9rem">Waiting for 1 more player…</p>
      </div>
      <button class="btn btn-ghost multi-back-btn" onclick="sdmCancel()">✖ Cancel Room</button>
    </div>`;
}

function sdmCopy(code) {
  navigator.clipboard.writeText(code).catch(()=>{});
  const el = document.getElementById('sdm-room-code');
  if (el) { const o=el.textContent; el.textContent='✅ Copied!'; setTimeout(()=>el.textContent=o,1500); }
}

// ── Join Room ─────────────────────────────────────────────────────────
async function sdmJoin() {
  const code  = (document.getElementById('sdm-join-code')?.value||'').trim().toUpperCase();
  const errEl = document.getElementById('sdm-err');
  if (!code) { if(errEl) errEl.textContent='Enter the 6-character room code.'; return; }
  try {
    const snap = await db.collection('spot_diff_games')
      .where('code','==',code).where('status','==','waiting').limit(1).get();
    if (snap.empty) {
      if(errEl) errEl.textContent='Room not found — check the code and try again.'; return;
    }
    const doc  = snap.docs[0];
    const data = doc.data();
    if (data.players.some(p => p.uid === sdmUid)) {
      if(errEl) errEl.textContent="You're already in this room!"; return;
    }
    if (data.players.length >= 2) {
      if(errEl) errEl.textContent='Room is full (2 players max).'; return;
    }
    sdmGameId = doc.id;
    sdmRef    = db.collection('spot_diff_games').doc(sdmGameId);
    await sdmRef.update({
      players: [...data.players, { uid: sdmUid, name: sdmName, found: [] }],
      status: 'playing'
    });
    sdmListen();
  } catch(e) {
    console.error('sdmJoin:', e);
    if(errEl) errEl.textContent='Could not join — please try again.';
  }
}

// ── Cancel ────────────────────────────────────────────────────────────
async function sdmCancel() {
  sdmStopHeartbeat();
  if (sdmUnsub) { sdmUnsub(); sdmUnsub = null; }
  if (sdmRef)   await sdmRef.delete().catch(()=>{});
  renderSDMLobby();
}

// ── Real-time Listener ────────────────────────────────────────────────
function sdmListen() {
  if (sdmUnsub) sdmUnsub();
  sdmUnsub = db.collection('spot_diff_games').doc(sdmGameId).onSnapshot(snap => {
    if (!snap.exists) { renderSDMLobby(); return; }
    sdmState = snap.data();
    const s    = sdmState.status;
    const prev = sdmPrevStatus;
    sdmPrevStatus = s;

    if (s === 'waiting') {
      renderSDMWaitingWithList();
    } else if (s === 'playing') {
      sdmStartHeartbeat();
      sdmStartStaleCheck();
      if (prev !== 'playing') window.SFX?.play(prev === 'finished' ? 'rematch' : 'join');
      const rk = JSON.stringify(sdmState.players.map(p => p.found));
      if (rk !== sdmLastRenderKey) {
        sdmLastRenderKey = rk;
        renderSDMGame(false);
      }
    } else if (s === 'finished') {
      sdmStopHeartbeat();
      hideStaleBannerSDM();
      if (!sdmResultSaved) {
        sdmResultSaved = true;
        sdmSaveMyResult(sdmState);
        if (sdmState.winner === sdmUid) window.SFX?.play('win');
        else window.SFX?.play('lose');
      }
      sdmLastRenderKey = '';
      renderSDMGame(true);
    }
  });
}

function renderSDMWaitingWithList() {
  const code = sdmState?.code || '';
  document.getElementById('multi-root').innerHTML = `
    <div class="multi-waiting card">
      <div class="multi-waiting-icon">🔍</div>
      <div class="multi-waiting-title">Waiting for Opponent</div>
      <p style="color:#888;font-size:.82rem;font-weight:700;margin:12px 0">
        Room Code: <strong>${code}</strong></p>
      <div class="multi-waiting-spinner">
        <div class="spinner" style="margin:0 auto 10px"></div>
        <p style="color:#999;font-weight:700;font-size:.9rem">Waiting for 1 more player…</p>
      </div>
      <button class="btn btn-ghost multi-back-btn" onclick="sdmCancel()">✖ Leave Room</button>
    </div>`;
}

// ── Save result ───────────────────────────────────────────────────────
async function sdmSaveMyResult(data) {
  const outcome = data.winner === sdmUid ? 'win' : 'lose';
  const oppNames = data.players.filter(p => p.uid !== sdmUid).map(p => p.name).join(', ');
  await saveResult({
    gameType: 'spot-diff-multi',
    outcome,
    moves: 0,
    opponent: oppNames,
    mode: 'multiplayer'
  });
}

// ── Heartbeat ─────────────────────────────────────────────────────────
function sdmStartHeartbeat() {
  if (sdmIsHbRunning) return;
  sdmIsHbRunning = true;
  const myIdx = sdmGetPlayerIndex();
  const field = ['p1Heartbeat','p2Heartbeat'][myIdx] || 'p1Heartbeat';
  const beat = () => {
    if (!sdmRef || sdmState?.status !== 'playing') { sdmStopHeartbeat(); return; }
    sdmRef.update({ [field]: firebase.firestore.FieldValue.serverTimestamp() }).catch(()=>{});
  };
  beat();
  sdmHbInt = setInterval(beat, 15000);
}

function sdmStopHeartbeat() {
  if (sdmHbInt)    { clearInterval(sdmHbInt);    sdmHbInt    = null; }
  if (sdmStaleInt) { clearInterval(sdmStaleInt); sdmStaleInt = null; }
  sdmIsHbRunning = false;
}

function sdmStartStaleCheck() {
  if (sdmStaleInt) return;
  sdmStaleInt = setInterval(sdmCheckStale, 10000);
}

function sdmCheckStale() {
  if (!sdmState || sdmState.status !== 'playing') return;
  const hbs = [sdmState.p1Heartbeat, sdmState.p2Heartbeat];
  let anyStale = false;
  for (const hb of hbs) {
    if (!hb) continue;
    const ms = hb.toDate ? hb.toDate().getTime() : hb.seconds * 1000;
    if (Date.now() - ms > 35000) { anyStale = true; break; }
  }
  const banner = document.getElementById('stale-banner-sdm');
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

function hideStaleBannerSDM() {
  const el = document.getElementById('stale-banner-sdm');
  if (el) el.style.display = 'none';
}

async function claimWinSDM() {
  sdmStopHeartbeat();
  hideStaleBannerSDM();
  if (sdmRef) await sdmRef.update({ status: 'finished', winner: sdmUid }).catch(()=>{});
}

// ── Game Render ───────────────────────────────────────────────────────
function renderSDMGame(isFinished) {
  const state     = sdmState;
  const sceneIdx  = state.sceneIdx ?? 0;
  const scene     = SDM_SCENES[sceneIdx];
  const myIdx     = sdmGetPlayerIndex();
  const oppIdx    = myIdx === 0 ? 1 : 0;
  const me        = state.players[myIdx];
  const opp       = state.players[oppIdx];
  const myFound   = me?.found  || [];
  const oppFound  = opp?.found || [];

  const winnerPlayer = isFinished && state.winner
    ? state.players.find(p => p.uid === state.winner) : null;

  // Build grids
  const leftGrid = scene.original.map((e, i) => {
    const isFoundByMe = myFound.includes(i) && scene.diffs.includes(i);
    return `<div class="sd-cell sd-cell-orig${isFoundByMe?' sd-cell-found':''}">${e}</div>`;
  }).join('');

  const rightGrid = scene.modified.map((e, i) => {
    const isFoundByMe  = myFound.includes(i);
    const isFoundByOpp = oppFound.includes(i);
    let cls = 'sd-cell sd-cell-mod';
    if (isFoundByMe)  cls += ' sd-cell-found';
    if (isFoundByOpp && !isFoundByMe) cls += ' sd-cell-opp-found';
    const clickable = !isFinished && !isFoundByMe;
    return `<div class="${cls}" id="sdm-r-${i}"${clickable ? ` onclick="sdmClickCell(${i})"` : ''}>${e}</div>`;
  }).join('');

  // Status
  let statusMsg = '';
  if (isFinished) {
    if (state.winner === sdmUid) statusMsg = `🏆 You win! You found all 5 differences first!`;
    else statusMsg = `😔 ${winnerPlayer?.name || 'Opponent'} found all 5 first. Better luck next time!`;
  } else {
    statusMsg = `🔍 You: ${myFound.length}/5 found &nbsp;|&nbsp; ${opp?.name||'Opponent'}: ${oppFound.length}/5 found`;
  }

  // Progress dots
  const myDots   = '🔵'.repeat(myFound.length)  + '⚪'.repeat(5 - myFound.length);
  const oppDots  = '🔴'.repeat(oppFound.length) + '⚪'.repeat(5 - oppFound.length);

  document.getElementById('multi-root').innerHTML = `
    <div style="width:100%;max-width:700px;margin:0 auto">
      <div style="text-align:center;margin-bottom:10px">
        <div style="font-size:1rem;font-weight:700;color:#444;margin-bottom:4px">
          🔍 ${scene.name}
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px">
        <div style="text-align:center;padding:8px;background:#dbeafe;border-radius:8px">
          <div style="font-size:.8rem;font-weight:700;color:#1e40af">${me?.name||'You'} (You)</div>
          <div style="font-size:1.2rem;letter-spacing:2px">${myDots}</div>
          <div style="font-size:.75rem;color:#555">${myFound.length}/5</div>
        </div>
        <div style="text-align:center;padding:8px;background:#fee2e2;border-radius:8px">
          <div style="font-size:.8rem;font-weight:700;color:#991b1b">${opp?.name||'Opponent'}</div>
          <div style="font-size:1.2rem;letter-spacing:2px">${oppDots}</div>
          <div style="font-size:.75rem;color:#555">${oppFound.length}/5</div>
        </div>
      </div>

      <div style="background:#f5f5f5;padding:10px;border-radius:8px;text-align:center;
                  font-weight:700;font-size:.88rem;margin-bottom:12px">
        ${statusMsg}
      </div>

      <div class="sd-panels" style="gap:8px">
        <div class="sd-panel">
          <div class="sd-panel-label">🖼️ Original</div>
          <div class="sd-grid">${leftGrid}</div>
        </div>
        <div class="sd-panel">
          <div class="sd-panel-label">🔍 Find differences${isFinished?'':' (click to spot!)'}</div>
          <div class="sd-grid">${rightGrid}</div>
        </div>
      </div>

      ${!isFinished ? `
        <div style="text-align:center;margin-top:10px;font-size:.82rem;color:#888;font-weight:600">
          Click any cell in the right picture that looks different!<br>
          <span style="color:#1d4ed8">🔵 Blue = you found it &nbsp; <span style="color:#dc2626">🔴 Red outline = opponent found it</span>
        </div>` : ''}

      ${isFinished ? `
        <div style="text-align:center;margin-top:20px;display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
          <button class="btn btn-primary" onclick="sdmRematch()">🔄 Next Scene</button>
          <a href="spot-diff.html" class="btn btn-secondary">🏠 Home</a>
        </div>` : ''}
    </div>`;
}

// ── Click cell ────────────────────────────────────────────────────────
async function sdmClickCell(idx) {
  if (!sdmState || sdmState.status !== 'playing') return;
  const myIdx   = sdmGetPlayerIndex();
  const myFound = sdmState.players[myIdx]?.found || [];
  if (myFound.includes(idx)) return;

  const scene = SDM_SCENES[sdmState.sceneIdx ?? 0];

  if (scene.diffs.includes(idx)) {
    // Correct!
    window.SFX?.play('quiz_correct');
    const newFound = [...myFound, idx];
    const newPlayers = sdmState.players.map((p, i) =>
      i === myIdx ? { ...p, found: newFound } : p
    );
    const won = newFound.length >= scene.diffs.length;
    await sdmRef.update({
      players: newPlayers,
      status: won ? 'finished' : 'playing',
      winner: won ? sdmUid : null
    }).catch(()=>{});
    // Flash correct
    const cell = document.getElementById(`sdm-r-${idx}`);
    if (cell) { cell.style.background='#bbf7d0'; }
  } else {
    // Wrong — flash red briefly (local only)
    window.SFX?.play('quiz_wrong');
    const cell = document.getElementById(`sdm-r-${idx}`);
    if (cell) {
      cell.style.background = '#fecaca';
      setTimeout(() => { if (cell) cell.style.background = ''; }, 600);
    }
  }
}

// ── Rematch ───────────────────────────────────────────────────────────
async function sdmRematch() {
  if (!sdmRef) return;
  const newSceneIdx = Math.floor(Math.random() * SDM_SCENES.length);
  const newPlayers = sdmState.players.map(p => ({ ...p, found: [] }));
  await sdmRef.update({
    players: newPlayers,
    sceneIdx: newSceneIdx,
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
  if (sdmRef && sdmState?.status === 'playing') {
    const isP1 = sdmState.players[0]?.uid === sdmUid;
    sdmRef.update({
      status: 'finished',
      winner: sdmState.players[isP1 ? 1 : 0]?.uid || null
    }).catch(()=>{});
  }
});

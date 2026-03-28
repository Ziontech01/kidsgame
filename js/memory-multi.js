// ── Memory Game Multiplayer ────────────────────────────────────────
// Real-time 2-4 player Memory via Firestore onSnapshot.
// Players take turns flipping cards, matching pairs earns points.
//
// Disconnect strategy:
//   • Each active player writes a heartbeat timestamp every 15 s.
//   • A separate 10-s timer checks opponent heartbeats.
//   • If opponent hasn't written in > 35 s, offer "Claim Win".

const CARD_EMOJIS = ['🌟','🎈','🎁','🎉','🎨','🎭','🎪','🎲',
                     '🎸','🎬','🎤','🎮','🎯','🎳','⚽','🏀'];

let mmGameId = null, mmRef = null, mmUnsub = null, mmState = null;
let mmUid = null, mmName = null;

let mmResultSaved   = false;
let mmLastRenderKey = '';
let mmPrevStatus    = null;
let mmHbInt         = null;
let mmStaleInt      = null;
let mmIsHbRunning   = false;
let mmFlipped       = [];  // local flip state for animations

requireAuth((user, profile) => {
  mmUid  = user.uid;
  mmName = profile?.name || profile?.username || 'Player';
  renderMMLobby();
});

// ── Helpers ────────────────────────────────────────────────────────
function mmGenCode() { return Math.random().toString(36).substr(2,6).toUpperCase(); }

function mmShuffleCards(count) {
  const pairs = count / 2;
  const cards = [];
  for (let i = 0; i < pairs; i++) {
    const emoji = CARD_EMOJIS[i % CARD_EMOJIS.length];
    cards.push({ pairId: i, emoji, flipped: false, matched: false });
    cards.push({ pairId: i, emoji, flipped: false, matched: false });
  }
  return cards.sort(() => Math.random() - 0.5);
}

function mmOppNames() {
  if (!mmState?.players) return ['Friend'];
  const myIdx = mmState.players.findIndex(p => p?.uid === mmUid);
  return mmState.players
    .map((p, i) => i === myIdx ? null : p?.name)
    .filter(n => n);
}

function mmGetPlayerIndex() {
  return mmState?.players?.findIndex(p => p?.uid === mmUid) ?? -1;
}

// ── Lobby ──────────────────────────────────────────────────────────
function renderMMLobby() {
  mmStopHeartbeat();
  hideStaleBannerMM();
  if (mmUnsub) { mmUnsub(); mmUnsub = null; }
  mmGameId = null; mmRef = null; mmState = null;
  mmResultSaved = false; mmLastRenderKey = ''; mmPrevStatus = null;

  document.getElementById('multi-root').innerHTML = `
    <div class="multi-lobby card">
      <div style="font-size:3.2rem;margin-bottom:6px">🃏🃏</div>
      <div class="multi-lobby-title">Play Memory vs Friends</div>
      <p class="multi-lobby-sub">Create a room and share the code,<br>
        or enter a friend's code to join! (2-4 players)</p>
      <div class="multi-lobby-actions">
        <button class="btn btn-primary btn-lg" onclick="mmCreate(8)">🏠 Create Room (8 pairs)</button>
        <button class="btn btn-primary btn-lg" onclick="mmCreate(12)">🏠 Create Room (12 pairs)</button>
        <div class="multi-or">— or —</div>
        <div class="multi-join-row">
          <input type="text" id="mm-join-code" class="form-input multi-code-input"
            placeholder="ABC123" maxlength="6"
            oninput="this.value=this.value.toUpperCase().replace(/[^A-Z0-9]/g,'')"
            onkeydown="if(event.key==='Enter')mmJoin()"/>
          <button class="btn btn-secondary" onclick="mmJoin()">🚀 Join</button>
        </div>
        <p id="mm-err" class="multi-err"></p>
      </div>
      <a href="memory.html" class="btn btn-ghost multi-back-btn">← Play Solo instead</a>
    </div>`;
}

// ── Create Room ────────────────────────────────────────────────────
async function mmCreate(pairCount) {
  const code = mmGenCode();
  try {
    const cards = mmShuffleCards(pairCount * 2);
    const ref = await db.collection('memory_games').add({
      code,
      players: [
        { uid: mmUid, name: mmName, score: 0, lastFlip: null }
      ],
      cards,
      currentPlayerIdx: 0,
      status: 'waiting',
      winner: null,
      p1Heartbeat: null,
      p2Heartbeat: null,
      p3Heartbeat: null,
      p4Heartbeat: null,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    mmGameId = ref.id;
    mmRef    = db.collection('memory_games').doc(mmGameId);
    renderMMWaiting(code);
    mmListen();
  } catch(e) { console.error('mmCreate:', e); }
}

// ── Waiting Screen ─────────────────────────────────────────────────
function renderMMWaiting(code) {
  document.getElementById('multi-root').innerHTML = `
    <div class="multi-waiting card">
      <div class="multi-waiting-icon">🃏</div>
      <div class="multi-waiting-title">Room Created!</div>
      <p class="multi-lobby-sub">Share this code with your friends:</p>
      <div class="room-code-display" id="mm-room-code">${code}</div>
      <p style="color:#888;font-size:.82rem;font-weight:700;margin-bottom:12px">
        Waiting for 1-3 more players to join (2-4 total)</p>
      <button class="btn btn-outline multi-copy-btn" onclick="mmCopy('${code}')">
        📋 Copy Code</button>
      <div class="multi-waiting-spinner">
        <div class="spinner" style="margin:0 auto 10px"></div>
        <p style="color:#999;font-weight:700;font-size:.9rem">
          Waiting for players to join…</p>
      </div>
      <button class="btn btn-ghost multi-back-btn" onclick="mmCancel()">✖ Cancel Room</button>
    </div>`;
}

function mmCopy(code) {
  navigator.clipboard.writeText(code).catch(()=>{});
  const el = document.getElementById('mm-room-code');
  if (el) { const o=el.textContent; el.textContent='✅ Copied!'; setTimeout(()=>el.textContent=o,1500); }
}

// ── Join Room ──────────────────────────────────────────────────────
async function mmJoin() {
  const code  = (document.getElementById('mm-join-code')?.value||'').trim().toUpperCase();
  const errEl = document.getElementById('mm-err');
  if (!code) { if(errEl) errEl.textContent='Enter the 6-character room code.'; return; }
  try {
    const snap = await db.collection('memory_games')
      .where('code','==',code).where('status','==','waiting').limit(1).get();
    if (snap.empty) {
      if(errEl) errEl.textContent='Room not found — check the code and try again.'; return;
    }
    const doc = snap.docs[0];
    const data = doc.data();
    if (data.players.some(p => p.uid === mmUid)) {
      if(errEl) errEl.textContent="You're already in this room!"; return;
    }
    if (data.players.length >= 4) {
      if(errEl) errEl.textContent='Room is full (4 players max).'; return;
    }
    mmGameId = doc.id;
    mmRef    = db.collection('memory_games').doc(mmGameId);
    const newPlayers = [...data.players, { uid: mmUid, name: mmName, score: 0, lastFlip: null }];
    await mmRef.update({
      players: newPlayers,
      status: newPlayers.length >= 2 ? 'playing' : 'waiting'
    });
    mmListen();
  } catch(e) {
    console.error('mmJoin:', e);
    if(errEl) errEl.textContent='Could not join — please try again.';
  }
}

// ── Cancel ─────────────────────────────────────────────────────────
async function mmCancel() {
  mmStopHeartbeat();
  if (mmUnsub) { mmUnsub(); mmUnsub = null; }
  if (mmRef)   await mmRef.delete().catch(()=>{});
  renderMMLobby();
}

// ── Real-time Listener ─────────────────────────────────────────────
function mmListen() {
  if (mmUnsub) mmUnsub();
  mmUnsub = db.collection('memory_games').doc(mmGameId).onSnapshot(snap => {
    if (!snap.exists) { renderMMLobby(); return; }
    mmState = snap.data();
    const s    = mmState.status;
    const prev = mmPrevStatus;
    mmPrevStatus = s;

    if (s === 'waiting') {
      // stay on waiting screen, show player list
      renderMMWaitingWithList();

    } else if (s === 'playing') {
      mmStartHeartbeat();
      mmStartStaleCheck();

      if (prev !== 'playing') {
        window.SFX?.play(prev === 'finished' ? 'rematch' : 'join');
      }

      const rk = JSON.stringify([mmState.cards.map(c => [c.matched, c.flipped]), mmState.currentPlayerIdx]);
      if (rk !== mmLastRenderKey) {
        mmLastRenderKey = rk;
        renderMMBoard(mmState, false);
      }

    } else if (s === 'finished') {
      mmStopHeartbeat();
      hideStaleBannerMM();

      if (!mmResultSaved) {
        mmResultSaved = true;
        mmSaveMyResult(mmState);
        if (mmState.winner === mmUid) window.SFX?.play('win');
        else window.SFX?.play('lose');
      }

      mmLastRenderKey = '';
      renderMMBoard(mmState, true);
    }
  });
}

// ── Waiting list render ────────────────────────────────────────────
function renderMMWaitingWithList() {
  const playerList = (mmState?.players || [])
    .map((p, i) => `<div style="padding:6px 0;color:#666;font-weight:600">
      ${i + 1}. ${p.name}${p.uid === mmUid ? ' (You)' : ''}</div>`)
    .join('');

  document.getElementById('multi-root').innerHTML = `
    <div class="multi-waiting card">
      <div class="multi-waiting-icon">🃏</div>
      <div class="multi-waiting-title">Waiting for Players</div>
      <div style="background:#f5f5f5;padding:12px;border-radius:8px;margin:12px 0;
                  font-size:.85rem">
        ${playerList}
      </div>
      <p style="color:#888;font-size:.82rem;font-weight:700;margin:12px 0">
        Room Code: <strong>${mmState?.code || ''}</strong></p>
      <p style="color:#999;font-weight:700;font-size:.9rem">
        ${mmState?.players?.length || 0}/4 players joined — Starting game when ready…</p>
      <button class="btn btn-ghost multi-back-btn" onclick="mmCancel()">✖ Leave Room</button>
    </div>`;
}

// ── Save result ────────────────────────────────────────────────────
async function mmSaveMyResult(data) {
  const myIdx = data.players.findIndex(p => p.uid === mmUid);
  const myScore = data.players[myIdx]?.score || 0;
  const maxScore = Math.max(...data.players.map(p => p.score || 0));

  const outcome = myScore === maxScore ? 'win' : 'lose';
  await saveResult({
    gameType: 'memory-multi',
    outcome,
    moves: data.cards.filter(c => c.matched).length,
    opponent: mmOppNames().join(', '),
    mode: 'multiplayer'
  });
}

// ── Heartbeat ──────────────────────────────────────────────────────
function mmStartHeartbeat() {
  if (mmIsHbRunning) return;
  mmIsHbRunning = true;

  const players = mmState?.players || [];
  const myIdx = players.findIndex(p => p?.uid === mmUid);
  const field = ['p1Heartbeat','p2Heartbeat','p3Heartbeat','p4Heartbeat'][myIdx];

  const beat = () => {
    if (!mmRef || mmState?.status !== 'playing') { mmStopHeartbeat(); return; }
    mmRef.update({ [field]: firebase.firestore.FieldValue.serverTimestamp() }).catch(()=>{});
  };
  beat();
  mmHbInt = setInterval(beat, 15000);
}

function mmStopHeartbeat() {
  if (mmHbInt)    { clearInterval(mmHbInt);    mmHbInt    = null; }
  if (mmStaleInt) { clearInterval(mmStaleInt); mmStaleInt = null; }
  mmIsHbRunning = false;
}

// ── Staleness check ────────────────────────────────────────────────
function mmStartStaleCheck() {
  if (mmStaleInt) return;
  mmStaleInt = setInterval(mmCheckStale, 10000);
}

function mmCheckStale() {
  if (!mmState || mmState.status !== 'playing') return;
  const hbs = [mmState.p1Heartbeat, mmState.p2Heartbeat, mmState.p3Heartbeat, mmState.p4Heartbeat];
  let anyStale = false;

  for (const hb of hbs) {
    if (!hb) continue;
    const ms = hb.toDate ? hb.toDate().getTime() : hb.seconds * 1000;
    const age = Date.now() - ms;
    if (age > 35000) { anyStale = true; break; }
  }

  const banner = document.getElementById('stale-banner-m');
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
function hideStaleBannerMM() {
  const el = document.getElementById('stale-banner-m');
  if (el) el.style.display = 'none';
}

async function claimWinMM() {
  mmStopHeartbeat();
  hideStaleBannerMM();
  if (mmRef) {
    await mmRef.update({ status: 'finished', winner: mmUid }).catch(()=>{});
  }
}

// ── Game board render ──────────────────────────────────────────────
function renderMMBoard(state, isFinished) {
  const isMyTurn = state.currentPlayerIdx === mmGetPlayerIndex();
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

  const cardGrid = state.cards
    .map((card, idx) => {
      const isFlipped = card.matched || card.flipped;
      return `<button class="mem-card ${isFlipped ? 'mem-card-open' : ''}"
                onclick="mmFlipCard(${idx})" ${isFinished || !isMyTurn ? 'disabled' : ''}>
        ${isFlipped ? card.emoji : '?'}</button>`;
    }).join('');

  const status = isFinished
    ? `🏆 Game Over! ${state.players[state.players.findIndex(p => p.uid === state.winner)]?.name || 'Winner'} wins!`
    : `${isMyTurn ? '👉 Your turn!' : `⏳ Waiting for ${currentPlayer?.name || 'opponent'}...`}`;

  document.getElementById('multi-root').innerHTML = `
    <div style="width:100%;max-width:600px;">
      <div style="margin-bottom:16px">${playerScores}</div>
      <div style="background:#f5f5f5;padding:12px;border-radius:8px;text-align:center;
                  font-weight:700;margin-bottom:16px;min-height:40px;display:flex;align-items:center;justify-content:center">
        ${status}</div>
      <div style="display:grid;grid-template-columns:repeat(4, 1fr);gap:8px;margin-bottom:16px">
        ${cardGrid}
      </div>
      ${isFinished ? `
        <div style="text-align:center">
          <button class="btn btn-primary" onclick="mmRematch()">🔄 Play Again</button>
          <a href="memory.html" class="btn btn-secondary" style="display:inline-block;margin-left:8px">🏠 Home</a>
        </div>
      ` : ''}
    </div>`;
}

// ── Flip card ──────────────────────────────────────────────────────
async function mmFlipCard(idx) {
  if (!mmState || mmState.status !== 'playing') return;
  if (mmState.currentPlayerIdx !== mmGetPlayerIndex()) return;

  const card = mmState.cards[idx];
  if (card.matched || card.flipped) return;

  // Check how many cards are flipped this turn
  const flipped = mmState.cards.filter((c, i) => c.flipped && !c.matched).length;
  if (flipped >= 2) return;

  // Flip the card
  const newCards = [...mmState.cards];
  newCards[idx].flipped = true;

  await mmRef.update({ cards: newCards }).catch(()=>{});

  // Check if we have 2 flipped cards
  const newFlipped = newCards.filter((c, i) => c.flipped && !c.matched);
  if (newFlipped.length === 2) {
    // Check if they match
    if (newFlipped[0].pairId === newFlipped[1].pairId) {
      // Match!
      window.SFX?.play('win');
      await new Promise(resolve => setTimeout(resolve, 600));

      const matchedCards = newCards.map(c => {
        if (c.pairId === newFlipped[0].pairId) c.matched = true;
        c.flipped = false;
        return c;
      });

      const newPlayers = [...mmState.players];
      newPlayers[mmState.currentPlayerIdx].score += 1;

      const allMatched = matchedCards.every(c => c.matched);
      const gameStatus = allMatched ? 'finished' : 'playing';
      const gameWinner = allMatched ? newPlayers.reduce((a, b) => a.score >= b.score ? a : b).uid : null;

      await mmRef.update({
        cards: matchedCards,
        players: newPlayers,
        status: gameStatus,
        winner: gameWinner
      }).catch(()=>{});
    } else {
      // No match, flip back and switch turn
      window.SFX?.play('lose');
      await new Promise(resolve => setTimeout(resolve, 1200));

      const flippedBackCards = newCards.map(c => ({ ...c, flipped: false }));
      const nextPlayerIdx = (mmState.currentPlayerIdx + 1) % mmState.players.length;

      await mmRef.update({
        cards: flippedBackCards,
        currentPlayerIdx: nextPlayerIdx
      }).catch(()=>{});
    }
  }
}

// ── Rematch ────────────────────────────────────────────────────────
async function mmRematch() {
  if (!mmRef) return;
  const pairCount = Math.round(mmState.cards.length / 2 / 4) * 4;
  const newCards = mmShuffleCards(pairCount * 2);
  const newPlayers = mmState.players.map(p => ({ ...p, score: 0 }));

  await mmRef.update({
    cards: newCards,
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
  if (mmRef && mmState?.status === 'playing') {
    const isP1 = mmState.players[0].uid === mmUid;
    mmRef.update({ status: 'finished', winner: mmState.players[isP1 ? 1 : 0]?.uid || null }).catch(()=>{});
  }
});

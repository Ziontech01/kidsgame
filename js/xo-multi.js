// ── XO Multiplayer ─────────────────────────────────────────────
// Real-time two-player Tic Tac Toe via Firestore onSnapshot.
// Player 1 = ❌ X (creates room), Player 2 = ⭕ O (joins room).
//
// Disconnect strategy:
//   • Each active player writes a heartbeat timestamp every 15 s.
//   • A separate 10-s timer checks the opponent's last heartbeat.
//   • If the opponent hasn't written in > 35 s a banner offers
//     "Claim Win" or "Keep Waiting".
//   • beforeunload is kept as a fast-path best-effort on desktop.

const WINS_M = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

let xmGameId = null, xmRef = null, xmUnsub = null, xmState = null;
let xmUid = null, xmName = null;

// ── Flags / intervals ─────────────────────────────────────────────
let xmResultSaved   = false;  // prevents saving the same result twice
let xmLastRenderKey = '';     // skips board re-render on heartbeat-only snapshots
let xmPrevStatus    = null;   // tracks status transitions for sound cues
let xmHbInt         = null;   // heartbeat setInterval id
let xmStaleInt      = null;   // staleness-check setInterval id
let xmIsHbRunning   = false;  // guard – prevents duplicate heartbeat starts

requireAuth((user, profile) => {
  xmUid  = user.uid;
  xmName = profile?.name || profile?.username || 'Player';
  renderXMLobby();
});

// ── Tiny helpers ──────────────────────────────────────────────────
function xmGenCode() { return Math.random().toString(36).substr(2,6).toUpperCase(); }

function xmWinner(board) {
  for (const [a,b,c] of WINS_M)
    if (board[a] && board[a]===board[b] && board[a]===board[c]) return board[a];
  return null;
}
function xmWinCombo(board) {
  for (const combo of WINS_M) {
    const [a,b,c] = combo;
    if (board[a] && board[a]===board[b] && board[a]===board[c]) return combo;
  }
  return null;
}
function xmMySymbol() {
  return xmState?.player1?.uid === xmUid ? 'X' : 'O';
}
function xmOppName() {
  if (!xmState) return 'Friend';
  return xmState.player1.uid === xmUid
    ? (xmState.player2?.name || 'Friend')
    : xmState.player1.name;
}

// ── Lobby ─────────────────────────────────────────────────────────
function renderXMLobby() {
  xmStopHeartbeat();
  hideStaleBanner();
  if (xmUnsub) { xmUnsub(); xmUnsub = null; }
  xmGameId = null; xmRef = null; xmState = null;
  xmResultSaved = false; xmLastRenderKey = ''; xmPrevStatus = null;

  document.getElementById('multi-root').innerHTML = `
    <div class="multi-lobby card">
      <div style="font-size:3.2rem;margin-bottom:6px">❌⭕</div>
      <div class="multi-lobby-title">Play XO vs Friend</div>
      <p class="multi-lobby-sub">Create a room and share the code,<br>
        or enter a friend's code to join!</p>
      <div class="multi-lobby-actions">
        <button class="btn btn-primary btn-lg" onclick="xmCreate()">🏠 Create Room</button>
        <div class="multi-or">— or —</div>
        <div class="multi-join-row">
          <input type="text" id="xm-join-code" class="form-input multi-code-input"
            placeholder="ABC123" maxlength="6"
            oninput="this.value=this.value.toUpperCase().replace(/[^A-Z0-9]/g,'')"
            onkeydown="if(event.key==='Enter')xmJoin()"/>
          <button class="btn btn-secondary" onclick="xmJoin()">🚀 Join</button>
        </div>
        <p id="xm-err" class="multi-err"></p>
      </div>
      <a href="xo.html" class="btn btn-ghost multi-back-btn">← Play vs Computer instead</a>
    </div>`;
}

// ── Create Room ───────────────────────────────────────────────────
async function xmCreate() {
  const code = xmGenCode();
  try {
    const ref = await db.collection('xo_games').add({
      code,
      player1:     { uid: xmUid, name: xmName },
      player2:     null,
      board:       Array(9).fill(''),
      currentTurn: xmUid,
      status:      'waiting',
      winner:      null,
      p1Heartbeat: null,   // written by xmStartHeartbeat() when game begins
      p2Heartbeat: null,
      createdAt:   firebase.firestore.FieldValue.serverTimestamp()
    });
    xmGameId = ref.id;
    xmRef    = db.collection('xo_games').doc(xmGameId);
    renderXMWaiting(code);
    xmListen();
  } catch(e) { console.error('xmCreate:', e); }
}

// ── Waiting Screen ────────────────────────────────────────────────
function renderXMWaiting(code) {
  document.getElementById('multi-root').innerHTML = `
    <div class="multi-waiting card">
      <div class="multi-waiting-icon">🏠</div>
      <div class="multi-waiting-title">Room Created!</div>
      <p class="multi-lobby-sub">Share this code with your friend:</p>
      <div class="room-code-display" id="xm-room-code">${code}</div>
      <p style="color:#888;font-size:.82rem;font-weight:700;margin-bottom:12px">
        You will play as ❌ X</p>
      <button class="btn btn-outline multi-copy-btn" onclick="xmCopy('${code}')">
        📋 Copy Code</button>
      <div class="multi-waiting-spinner">
        <div class="spinner" style="margin:0 auto 10px"></div>
        <p style="color:#999;font-weight:700;font-size:.9rem">
          Waiting for your friend to join…</p>
      </div>
      <button class="btn btn-ghost multi-back-btn" onclick="xmCancel()">✖ Cancel Room</button>
    </div>`;
}
function xmCopy(code) {
  navigator.clipboard.writeText(code).catch(()=>{});
  const el = document.getElementById('xm-room-code');
  if (el) { const o=el.textContent; el.textContent='✅ Copied!'; setTimeout(()=>el.textContent=o,1500); }
}

// ── Join Room ─────────────────────────────────────────────────────
async function xmJoin() {
  const code  = (document.getElementById('xm-join-code')?.value||'').trim().toUpperCase();
  const errEl = document.getElementById('xm-err');
  if (!code) { if(errEl) errEl.textContent='Enter the 6-character room code.'; return; }
  try {
    const snap = await db.collection('xo_games')
      .where('code','==',code).where('status','==','waiting').limit(1).get();
    if (snap.empty) {
      if(errEl) errEl.textContent='Room not found — check the code and try again.'; return;
    }
    const doc = snap.docs[0];
    if (doc.data().player1.uid === xmUid) {
      if(errEl) errEl.textContent="That's your own room! Share the code with a friend."; return;
    }
    xmGameId = doc.id;
    xmRef    = db.collection('xo_games').doc(xmGameId);
    await xmRef.update({
      player2: { uid: xmUid, name: xmName },
      status:  'playing'
    });
    xmListen();
  } catch(e) {
    console.error('xmJoin:', e);
    const errEl = document.getElementById('xm-err');
    if(errEl) errEl.textContent='Could not join — please try again.';
  }
}

// ── Cancel ────────────────────────────────────────────────────────
async function xmCancel() {
  xmStopHeartbeat();
  if (xmUnsub) { xmUnsub(); xmUnsub = null; }
  if (xmRef)   await xmRef.delete().catch(()=>{});
  renderXMLobby();
}

// ── Real-time Listener ────────────────────────────────────────────
function xmListen() {
  if (xmUnsub) xmUnsub();
  xmUnsub = db.collection('xo_games').doc(xmGameId).onSnapshot(snap => {
    if (!snap.exists) { renderXMLobby(); return; }
    xmState = snap.data();
    const s    = xmState.status;
    const prev = xmPrevStatus;
    xmPrevStatus = s;   // update before any async work

    if (s === 'waiting') {
      /* stay on waiting screen */

    } else if (s === 'playing') {
      xmStartHeartbeat();   // idempotent — only starts once per session
      xmStartStaleCheck();  // idempotent

      // ── Transition sounds ──────────────────────────────────────
      if (prev !== 'playing') {
        // null/'waiting' → 'playing'  : game starting for first time
        // 'finished'     → 'playing'  : rematch starting
        window.SFX?.play(prev === 'finished' ? 'rematch' : 'join');
      }

      // Skip re-render if only heartbeat timestamps changed
      const rk = JSON.stringify([xmState.board, xmState.currentTurn]);
      if (rk !== xmLastRenderKey) {
        // ── Opponent-move sound ─────────────────────────────────
        // My turn now + board has at least one move + this is not
        // the first render → opponent just placed a piece.
        const opponentMoved = xmLastRenderKey !== ''
          && xmState.currentTurn === xmUid
          && xmState.board.some(c => c !== '');
        if (opponentMoved) window.SFX?.play('opponent_move');

        xmLastRenderKey = rk;
        renderXMBoard(xmState, false);
      }

    } else if (s === 'finished') {
      xmStopHeartbeat();
      hideStaleBanner();

      // ── Save result for BOTH players ──────────────────────────
      // This fires for both the winner and the loser via their
      // individual onSnapshot listeners.
      if (!xmResultSaved) {
        xmResultSaved = true;
        xmSaveMyResult(xmState);
        // Outcome sound (gated by xmResultSaved — plays exactly once)
        if      (xmState.winner === xmUid)   window.SFX?.play('win');
        else if (xmState.winner === 'draw')  window.SFX?.play('draw');
        else                                 window.SFX?.play('lose');
      }

      xmLastRenderKey = '';  // always re-render the finished state
      renderXMBoard(xmState, true);
    }
  });
}

// ── Save result: each player saves their OWN outcome ─────────────
async function xmSaveMyResult(data) {
  const outcome = data.winner === 'draw' ? 'draw'
                : data.winner === xmUid  ? 'win'
                :                          'lose';
  await saveResult({
    gameType: 'xo-multi',
    outcome,
    moves:    data.board.filter(c => c !== '').length,
    opponent: xmOppName(),
    mode:     'multiplayer'
  });
}

// ── Heartbeat ────────────────────────────────────────────────────
// Writes a fresh Firestore timestamp every 15 s so the opponent
// can detect if we go offline.
function xmStartHeartbeat() {
  if (xmIsHbRunning) return;
  xmIsHbRunning = true;

  const isP1  = xmState?.player1?.uid === xmUid;
  const field = isP1 ? 'p1Heartbeat' : 'p2Heartbeat';

  const beat = () => {
    if (!xmRef || xmState?.status !== 'playing') { xmStopHeartbeat(); return; }
    xmRef.update({ [field]: firebase.firestore.FieldValue.serverTimestamp() }).catch(()=>{});
  };
  beat();                            // write immediately on game start
  xmHbInt = setInterval(beat, 15000);
}

function xmStopHeartbeat() {
  if (xmHbInt)    { clearInterval(xmHbInt);    xmHbInt    = null; }
  if (xmStaleInt) { clearInterval(xmStaleInt); xmStaleInt = null; }
  xmIsHbRunning = false;
}

// ── Staleness check ───────────────────────────────────────────────
// Runs every 10 s; reads opponent heartbeat from the most recent
// Firestore snapshot (kept fresh by onSnapshot).
function xmStartStaleCheck() {
  if (xmStaleInt) return;
  xmStaleInt = setInterval(xmCheckStale, 10000);
}

function xmCheckStale() {
  if (!xmState || xmState.status !== 'playing') return;
  const isP1  = xmState.player1.uid === xmUid;
  const oppHb = isP1 ? xmState.p2Heartbeat : xmState.p1Heartbeat;
  if (!oppHb) return;  // no heartbeat yet — grace period, don't flag

  const oppMs = oppHb.toDate ? oppHb.toDate().getTime() : oppHb.seconds * 1000;
  const age   = Date.now() - oppMs;

  const banner = document.getElementById('stale-banner');
  if (!banner) return;
  if (age > 35000) {
    if (banner.style.display === 'none') {
      banner.style.display = 'flex';
      window.SFX?.play('disconnect'); // alert sound once when banner first appears
    }
  } else {
    banner.style.display = 'none';
  }
}

// ── Stale-banner helpers ──────────────────────────────────────────
function hideStaleBanner() {
  const b = document.getElementById('stale-banner');
  if (b) b.style.display = 'none';
}

async function claimWinXM() {
  hideStaleBanner();
  if (!xmRef || !xmState || xmState.status !== 'playing') return;
  // Award the win to me — the other player's onSnapshot (if they ever
  // reconnect) will record a 'lose' result for them automatically.
  await xmRef.update({ status: 'finished', winner: xmUid }).catch(()=>{});
}

// ── Game Board ────────────────────────────────────────────────────
function renderXMBoard(data, finished) {
  const sym     = xmMySymbol();
  const oppName = xmOppName();
  const myDisp  = sym==='X' ? '❌' : '⭕';
  const oppDisp = sym==='X' ? '⭕' : '❌';
  const myTurn  = data.currentTurn === xmUid && !finished;
  const combo   = xmWinCombo(data.board);

  let statusText='', statusCls='';
  if (finished) {
    if      (data.winner==='draw') { statusText="🤝 It's a Draw!";      statusCls='draw'; }
    else if (data.winner===xmUid)  { statusText='🎉 You Win! 🏆';       statusCls='win'; }
    else                           { statusText=`😢 ${oppName} Wins!`;  statusCls='lose'; }
  } else {
    if (myTurn) { statusText=`😊 Your turn! (${myDisp})`;             statusCls='player-turn'; }
    else        { statusText=`⏳ Waiting for ${oppName}… (${oppDisp})`; statusCls='cpu-turn'; }
  }

  const cells = data.board.map((cell,i) => {
    const win  = combo?.includes(i);
    const disp = cell==='X'?'❌': cell==='O'?'⭕':'';
    return `<div class="xo-cell${cell?' taken':''}${win?' winning':''}"
                 id="xmc${i}" onclick="xmCell(${i})">
              <span class="cell-sym${cell?' show '+cell.toLowerCase():''}">${disp}</span>
            </div>`;
  }).join('');

  document.getElementById('multi-root').innerHTML = `
    <div style="width:100%;max-width:460px;margin:0 auto">
      <div class="multi-players-bar">
        <div class="multi-player${myTurn?' active':''}">
          <div class="multi-player-sym">${myDisp}</div>
          <div class="multi-player-name">${HG.profile?.name||'You'}</div>
          <div class="multi-player-label">You</div>
        </div>
        <div class="multi-vs">VS</div>
        <div class="multi-player${(!myTurn&&!finished)?' active':''}">
          <div class="multi-player-sym">${oppDisp}</div>
          <div class="multi-player-name">${oppName}</div>
          <div class="multi-player-label">Friend</div>
        </div>
      </div>
      <div class="xo-status-bar">
        <div class="xo-status ${statusCls}">${statusText}</div>
      </div>
      <div class="xo-board">${cells}</div>
      <div class="xo-controls" style="margin-top:16px">
        ${finished ? `
          <button class="btn btn-primary"   onclick="xmRematch()">🔄 Rematch</button>
          <a href="history.html" class="btn btn-secondary">📊 History</a>
          <button class="btn btn-ghost"     onclick="xmLeave()">🚪 Leave</button>
        ` : `
          <button class="btn btn-ghost" onclick="xmLeave()">🚪 Leave Game</button>
        `}
      </div>
    </div>`;

  if (finished && data.winner===xmUid) xmConfetti();
}

// ── Cell Click ────────────────────────────────────────────────────
// saveResult is NOT called here — it is called in xmListen() for
// both players when the snapshot arrives with status:'finished'.
async function xmCell(i) {
  if (!xmRef || !xmState)             return;
  if (xmState.status   !== 'playing') return;
  if (xmState.currentTurn !== xmUid)  { window.SFX?.play('error'); return; } // not my turn
  if (xmState.board[i] !== '')        { window.SFX?.play('error'); return; } // cell taken
  window.SFX?.play('click'); // immediate local feedback before Firestore write

  const sym      = xmMySymbol();
  const newBoard = [...xmState.board];
  newBoard[i]    = sym;

  const w    = xmWinner(newBoard);
  const draw = !w && newBoard.every(c=>c!=='');
  const opp  = xmState.player1.uid===xmUid ? xmState.player2?.uid : xmState.player1.uid;

  const update = { board: newBoard };
  if (w || draw) {
    update.status = 'finished';
    update.winner = w ? xmUid : 'draw';
  } else {
    update.currentTurn = opp;
  }

  try {
    await xmRef.update(update);
    // ↑ When this write reaches Firestore, both players' onSnapshot
    //   listeners fire. If status is 'finished', xmSaveMyResult() is
    //   called on each client independently, recording the correct
    //   outcome (win / lose / draw) for each player.
  } catch(e) { console.error('xmCell:', e); }
}

// ── Rematch ───────────────────────────────────────────────────────
async function xmRematch() {
  if (!xmRef || !xmState) return;
  xmResultSaved   = false;  // allow saving for the new game
  xmLastRenderKey = '';
  xmPrevStatus    = xmState.status; // will be 'finished' → triggers 'rematch' sound in listener
  const firstUid  = xmState.player2?.uid || xmState.player1.uid; // O goes first
  await xmRef.update({
    board:       Array(9).fill(''),
    currentTurn: firstUid,
    status:      'playing',
    winner:      null,
    p1Heartbeat: null,  // reset so stale-check grace-period resets
    p2Heartbeat: null
  });
}

// ── Leave ─────────────────────────────────────────────────────────
async function xmLeave() {
  xmStopHeartbeat();
  hideStaleBanner();
  if (xmUnsub) { xmUnsub(); xmUnsub = null; }
  if (xmRef && xmState?.status==='playing') {
    const opp = xmState.player1.uid===xmUid ? xmState.player2?.uid : xmState.player1.uid;
    if (opp) await xmRef.update({ status:'finished', winner:opp }).catch(()=>{});
  }
  renderXMLobby();
}

// ── Confetti ──────────────────────────────────────────────────────
function xmConfetti() {
  const wrap = document.getElementById('confetti-wrap'); if(!wrap) return;
  wrap.innerHTML='';
  const cols=['#FF6B6B','#4ECDC4','#FFE66D','#A855F7','#3B82F6','#22C55E','#f97316'];
  for(let i=0;i<80;i++){
    const p=document.createElement('div'); p.className='confetti-piece';
    p.style.cssText=`left:${Math.random()*100}vw;background:${cols[~~(Math.random()*cols.length)]};
      width:${Math.random()*8+6}px;height:${Math.random()*8+6}px;
      border-radius:${Math.random()>.5?'50%':'2px'};
      animation-duration:${Math.random()*2+2}s;animation-delay:${Math.random()*.5}s`;
    wrap.appendChild(p);
  }
  setTimeout(()=>wrap.innerHTML='',4000);
}

// ── beforeunload: fast-path forfeit on desktop tab close ──────────
// Not reliable on mobile — the heartbeat mechanism handles that case.
window.addEventListener('beforeunload', ()=>{
  if (xmRef && xmState?.status==='playing') {
    const opp = xmState.player1.uid===xmUid ? xmState.player2?.uid : xmState.player1.uid;
    if (opp) xmRef.update({ status:'finished', winner:opp });
  }
});

// ── Chess Multiplayer ───────────────────────────────────────────
// Real-time two-player Chess via Firestore onSnapshot + chess.js.
// Player 1 creates the room → plays White (♔).
// Player 2 joins          → plays Black (♚).
// Colors swap on each rematch.
//
// Disconnect strategy:
//   • Each active player writes a heartbeat every 15 s.
//   • A 10-s timer checks the opponent's heartbeat age.
//   • If > 35 s stale a banner offers "Claim Win" or "Keep Waiting".
//   • beforeunload is kept as a best-effort fast-path on desktop.

const CM_PIECES = {
  wK:'♔',wQ:'♕',wR:'♖',wB:'♗',wN:'♘',wP:'♙',
  bK:'♚',bQ:'♛',bR:'♜',bB:'♝',bN:'♞',bP:'♟'
};
const CM_INIT_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

let cmGameId=null, cmRef=null, cmUnsub=null, cmState=null;
let cmUid=null, cmName=null;
let cmChess=null, cmSelSq=null, cmLegal=[];

// ── Flags / intervals ─────────────────────────────────────────────
let cmResultSaved   = false;
let cmLastRenderKey = '';
let cmPrevStatus    = null;  // tracks status transitions for sound cues
let cmHbInt         = null;
let cmStaleInt      = null;
let cmIsHbRunning   = false;

requireAuth((user, profile)=>{
  cmUid  = user.uid;
  cmName = profile?.name || profile?.username || 'Player';
  renderCMLobby();
});

// ── Helpers ──────────────────────────────────────────────────────
function cmGenCode(){ return Math.random().toString(36).substr(2,6).toUpperCase(); }

// Color is stored in Firestore so rematch color-swaps propagate
// to both clients via onSnapshot.
function cmMyColor(){
  if (!cmState) return 'w';
  return cmState.player1.uid===cmUid ? cmState.player1.color : (cmState.player2?.color||'b');
}
function cmOppName(){
  if (!cmState) return 'Friend';
  return cmState.player1.uid===cmUid
    ? (cmState.player2?.name||'Friend') : cmState.player1.name;
}

// ── Lobby ─────────────────────────────────────────────────────────
function renderCMLobby(){
  cmStopHeartbeat();
  hideStaleBannerC();
  if (cmUnsub){ cmUnsub(); cmUnsub=null; }
  cmGameId=null; cmRef=null; cmState=null; cmChess=null; cmSelSq=null; cmLegal=[];
  cmResultSaved=false; cmLastRenderKey=''; cmPrevStatus=null;

  document.getElementById('multi-root').innerHTML=`
    <div class="multi-lobby card" style="background:#1e293b;border:1px solid #334155">
      <div style="font-size:3.2rem;margin-bottom:6px">♟️</div>
      <div class="multi-lobby-title" style="color:#e2e8f0">Play Chess vs Friend</div>
      <p class="multi-lobby-sub" style="color:#94a3b8">
        Create a room (you play ♔ White) or enter a friend's code to join!
      </p>
      <div class="multi-lobby-actions">
        <button class="btn btn-primary btn-lg" onclick="cmCreate()">🏠 Create Room</button>
        <div class="multi-or" style="color:#475569">— or —</div>
        <div class="multi-join-row">
          <input type="text" id="cm-join-code" class="form-input multi-code-input"
            placeholder="ABC123" maxlength="6"
            style="background:#0f172a;color:#e2e8f0;border-color:#334155"
            oninput="this.value=this.value.toUpperCase().replace(/[^A-Z0-9]/g,'')"
            onkeydown="if(event.key==='Enter')cmJoin()"/>
          <button class="btn btn-secondary" onclick="cmJoin()">🚀 Join</button>
        </div>
        <p id="cm-err" class="multi-err"></p>
      </div>
      <a href="chess.html" class="btn btn-ghost multi-back-btn"
         style="color:#94a3b8;border-color:#334155">← Play vs Computer instead</a>
    </div>`;
}

// ── Create Room ───────────────────────────────────────────────────
async function cmCreate(){
  const code=cmGenCode();
  try {
    const ref=await db.collection('chess_games').add({
      code,
      player1:     { uid:cmUid, name:cmName, color:'w' },
      player2:     null,
      fen:         CM_INIT_FEN,
      currentTurn: 'w',
      status:      'waiting',
      winner:      null,
      moves:       [],
      p1Heartbeat: null,   // written by cmStartHeartbeat() when game begins
      p2Heartbeat: null,
      createdAt:   firebase.firestore.FieldValue.serverTimestamp()
    });
    cmGameId=ref.id;
    cmRef=db.collection('chess_games').doc(cmGameId);
    renderCMWaiting(code);
    cmListen();
  } catch(e){ console.error('cmCreate:',e); }
}

// ── Waiting Screen ────────────────────────────────────────────────
function renderCMWaiting(code){
  document.getElementById('multi-root').innerHTML=`
    <div class="multi-waiting card" style="background:#1e293b;border:1px solid #334155">
      <div class="multi-waiting-icon">🏠</div>
      <div class="multi-waiting-title" style="color:#e2e8f0">Room Created!</div>
      <p class="multi-lobby-sub" style="color:#94a3b8">Share this code with your friend:</p>
      <div class="room-code-display" id="cm-room-code"
           style="background:#0f172a;color:#e2e8f0;border-color:#334155">${code}</div>
      <p style="color:#64748b;font-size:.82rem;font-weight:700;margin-bottom:12px">
        You will play as ♔ White</p>
      <button class="btn btn-outline multi-copy-btn"
              style="border-color:#667eea;color:#667eea"
              onclick="cmCopy('${code}')">📋 Copy Code</button>
      <div class="multi-waiting-spinner">
        <div class="spinner" style="margin:0 auto 10px"></div>
        <p style="color:#64748b;font-weight:700;font-size:.9rem">
          Waiting for your friend to join…</p>
      </div>
      <button class="btn btn-ghost multi-back-btn"
              style="color:#94a3b8;border-color:#334155" onclick="cmCancel()">✖ Cancel</button>
    </div>`;
}
function cmCopy(code){
  navigator.clipboard.writeText(code).catch(()=>{});
  const el=document.getElementById('cm-room-code');
  if(el){ const o=el.textContent; el.textContent='✅ Copied!'; setTimeout(()=>el.textContent=o,1500); }
}

// ── Join Room ─────────────────────────────────────────────────────
async function cmJoin(){
  const code=(document.getElementById('cm-join-code')?.value||'').trim().toUpperCase();
  const errEl=document.getElementById('cm-err');
  if(!code){ if(errEl) errEl.textContent='Enter the 6-character room code.'; return; }
  try {
    const snap=await db.collection('chess_games')
      .where('code','==',code).where('status','==','waiting').limit(1).get();
    if(snap.empty){ if(errEl) errEl.textContent='Room not found — check the code!'; return; }
    const doc=snap.docs[0];
    if(doc.data().player1.uid===cmUid){ if(errEl) errEl.textContent="That's your own room!"; return; }
    cmGameId=doc.id;
    cmRef=db.collection('chess_games').doc(cmGameId);
    await cmRef.update({
      player2: { uid:cmUid, name:cmName, color:'b' },
      status:  'playing'
    });
    cmListen();
  } catch(e){
    console.error('cmJoin:',e);
    const errEl=document.getElementById('cm-err');
    if(errEl) errEl.textContent='Could not join — please try again.';
  }
}

// ── Cancel ────────────────────────────────────────────────────────
async function cmCancel(){
  cmStopHeartbeat();
  if(cmUnsub){ cmUnsub(); cmUnsub=null; }
  if(cmRef) await cmRef.delete().catch(()=>{});
  renderCMLobby();
}

// ── Real-time Listener ────────────────────────────────────────────
function cmListen(){
  if(cmUnsub) cmUnsub();
  cmUnsub=db.collection('chess_games').doc(cmGameId).onSnapshot(snap=>{
    if(!snap.exists){ renderCMLobby(); return; }
    cmState=snap.data();
    const s    = cmState.status;
    const prev = cmPrevStatus;
    cmPrevStatus = s;   // update before any async work

    if (s==='waiting') {
      /* stay on waiting screen */

    } else if (s==='playing') {
      cmStartHeartbeat();   // idempotent
      cmStartStaleCheck();  // idempotent

      // ── Transition sounds ──────────────────────────────────────
      if (prev !== 'playing') {
        window.SFX?.play(prev === 'finished' ? 'rematch' : 'join');
      }

      // Skip re-render if only heartbeat timestamps changed
      const rk = `${cmState.fen}|${cmState.currentTurn}`;
      if (rk !== cmLastRenderKey) {
        // ── Opponent-move sound ─────────────────────────────────
        // My color's turn now + FEN changed + not the first render
        // → opponent just moved.
        const myCol = cmMyColor();
        const opponentMoved = cmLastRenderKey !== ''
          && cmState.currentTurn === myCol
          && cmState.moves?.length > 0;
        if (opponentMoved) window.SFX?.play('opponent_move');

        cmLastRenderKey = rk;
        renderCMGame(cmState, false);
      }

    } else if (s==='finished') {
      cmStopHeartbeat();
      hideStaleBannerC();

      // ── Save result for BOTH players ──────────────────────────
      // Fires for the winner AND the loser via their own listener.
      if (!cmResultSaved) {
        cmResultSaved = true;
        cmSaveMyResult(cmState);
        // Outcome sound (gated — plays exactly once per game)
        if      (cmState.winner === cmUid)   window.SFX?.play('win');
        else if (cmState.winner === 'draw')  window.SFX?.play('draw');
        else                                 window.SFX?.play('lose');
      }

      cmLastRenderKey = '';
      renderCMGame(cmState, true);
    }
  });
}

// ── Save result: each player saves their OWN outcome ─────────────
async function cmSaveMyResult(data) {
  const outcome = data.winner === 'draw' ? 'draw'
                : data.winner === cmUid  ? 'win'
                :                          'lose';
  await saveResult({
    gameType: 'chess-multi',
    outcome,
    moves:    data.moves?.length || 0,
    mode:     'multiplayer'
  });
}

// ── Heartbeat ─────────────────────────────────────────────────────
function cmStartHeartbeat(){
  if(cmIsHbRunning) return;
  cmIsHbRunning = true;

  const isP1  = cmState?.player1?.uid === cmUid;
  const field = isP1 ? 'p1Heartbeat' : 'p2Heartbeat';

  const beat = () => {
    if(!cmRef || cmState?.status !== 'playing'){ cmStopHeartbeat(); return; }
    cmRef.update({ [field]: firebase.firestore.FieldValue.serverTimestamp() }).catch(()=>{});
  };
  beat();                              // write immediately on game start
  cmHbInt = setInterval(beat, 15000);
}

function cmStopHeartbeat(){
  if(cmHbInt)    { clearInterval(cmHbInt);    cmHbInt    = null; }
  if(cmStaleInt) { clearInterval(cmStaleInt); cmStaleInt = null; }
  cmIsHbRunning = false;
}

// ── Staleness check ───────────────────────────────────────────────
function cmStartStaleCheck(){
  if(cmStaleInt) return;
  cmStaleInt = setInterval(cmCheckStale, 10000);
}

function cmCheckStale(){
  if(!cmState || cmState.status !== 'playing') return;
  const isP1  = cmState.player1.uid === cmUid;
  const oppHb = isP1 ? cmState.p2Heartbeat : cmState.p1Heartbeat;
  if(!oppHb) return;  // grace period — heartbeat not yet written

  const oppMs = oppHb.toDate ? oppHb.toDate().getTime() : oppHb.seconds * 1000;
  const age   = Date.now() - oppMs;

  const banner = document.getElementById('stale-banner-c');
  if(!banner) return;
  if(age > 35000) {
    if(banner.style.display === 'none'){
      banner.style.display = 'flex';
      window.SFX?.play('disconnect'); // alert sound once when banner first appears
    }
  } else {
    banner.style.display = 'none';
  }
}

// ── Stale-banner helpers ──────────────────────────────────────────
function hideStaleBannerC(){
  const b = document.getElementById('stale-banner-c');
  if(b) b.style.display = 'none';
}

async function claimWinCM(){
  hideStaleBannerC();
  if(!cmRef || !cmState || cmState.status !== 'playing') return;
  await cmRef.update({ status:'finished', winner:cmUid }).catch(()=>{});
}

// ── Render Chess Game ─────────────────────────────────────────────
function renderCMGame(data, finished){
  cmChess = new Chess();
  if(data.fen && data.fen !== CM_INIT_FEN) cmChess.load(data.fen);

  const myCol         = cmMyColor();
  const oppName       = cmOppName();
  const myTurnActive  = data.currentTurn===myCol && !finished;
  const oppTurnActive = data.currentTurn!==myCol && !finished;
  const myDisp        = myCol==='w' ? '♔ White' : '♚ Black';
  const opDisp        = myCol==='w' ? '♚ Black' : '♔ White';

  let status='', statusCls='';
  if(finished){
    if      (data.winner==='draw') { status="🤝 It's a Draw!"; statusCls='draw'; }
    else if (data.winner===cmUid)  { status='🏆 You Win!';     statusCls='win'; }
    else                           { status=`😢 ${oppName} Wins!`; statusCls='lose'; }
  } else {
    if(myTurnActive){ status=`😊 Your turn (${myDisp})`;        statusCls='player-turn'; }
    else            { status=`⏳ ${oppName}'s turn (${opDisp})`; statusCls='cpu-turn'; }
  }

  document.getElementById('multi-root').innerHTML=`
    <div style="width:100%;max-width:600px;margin:0 auto">

      <div class="multi-players-bar" style="background:#1e293b;border-color:#334155">
        <div class="multi-player${myTurnActive?' active':''}">
          <div class="multi-player-sym" style="color:#e2e8f0">${myCol==='w'?'♔':'♚'}</div>
          <div class="multi-player-name" style="color:#e2e8f0">${HG.profile?.name||'You'}</div>
          <div class="multi-player-label" style="color:#64748b">${myDisp}</div>
        </div>
        <div class="multi-vs" style="color:#94a3b8">VS</div>
        <div class="multi-player${oppTurnActive?' active':''}">
          <div class="multi-player-sym" style="color:#e2e8f0">${myCol==='w'?'♚':'♔'}</div>
          <div class="multi-player-name" style="color:#e2e8f0">${oppName}</div>
          <div class="multi-player-label" style="color:#64748b">${opDisp}</div>
        </div>
      </div>

      <div class="chess-status-bar" style="background:#1e293b;box-shadow:none">
        <div class="chess-status ${statusCls}" id="cm-status" style="color:#e2e8f0">${status}</div>
      </div>

      <div style="display:flex;align-items:center;gap:4px;justify-content:center;margin:8px 0">
        <div id="cm-rank-lbl" class="chess-rank-labels"></div>
        <div>
          <div id="cm-board" class="chessboard"></div>
          <div id="cm-file-lbl" class="chess-file-labels"></div>
        </div>
      </div>

      <div style="padding:0 8px 4px">
        <div style="color:#64748b;font-size:.78rem;font-weight:700;margin-bottom:4px">
          Move history:</div>
        <div class="move-history" id="cm-history"
             style="background:#0f172a;color:#94a3b8;max-height:80px">
          ${cmBuildHistory(data.moves)}
        </div>
      </div>

      <div class="chess-controls">
        ${finished ? `
          <button class="btn btn-primary" onclick="cmRematch()">🔄 Rematch</button>
          <a href="history.html" class="btn btn-ghost"
             style="background:#1e293b;color:#e2e8f0;border-color:#334155">📊 History</a>
          <button class="btn btn-ghost"
                  style="background:#1e293b;color:#94a3b8;border-color:#334155"
                  onclick="cmLeave()">🚪 Leave</button>
        ` : `
          <button class="btn btn-ghost"
                  style="background:#1e293b;color:#94a3b8;border-color:#334155"
                  onclick="cmLeave()">🚪 Leave Game</button>
        `}
      </div>
    </div>`;

  cmSelSq=null; cmLegal=[];
  cmDrawBoard();
}

function cmBuildHistory(moves){
  if(!moves||!moves.length)
    return '<div style="color:#64748b;font-style:italic">No moves yet</div>';
  const pairs=[];
  for(let i=0;i<moves.length;i+=2){
    pairs.push(`<div class="move-pair">
      <span class="move-num">${Math.floor(i/2)+1}.</span>
      <span class="move-w">${moves[i]||''}</span>
      <span class="move-b">${moves[i+1]||''}</span>
    </div>`);
  }
  return pairs.join('');
}

// ── Draw Board ────────────────────────────────────────────────────
function cmDrawBoard(){
  const board=document.getElementById('cm-board');
  const rl=document.getElementById('cm-rank-lbl');
  const fl=document.getElementById('cm-file-lbl');
  if(!board||!cmChess) return;
  board.innerHTML=''; if(rl) rl.innerHTML=''; if(fl) fl.innerHTML='';

  const myCol    = cmMyColor();
  const ranks    = myCol==='w' ? [8,7,6,5,4,3,2,1] : [1,2,3,4,5,6,7,8];
  const files    = myCol==='w' ? ['a','b','c','d','e','f','g','h'] : ['h','g','f','e','d','c','b','a'];
  const isMyTurn = cmState?.currentTurn===myCol && cmState?.status==='playing';

  ranks.forEach((rank,ri)=>{
    if(rl){ const l=document.createElement('div'); l.className='rank-label'; l.textContent=rank; rl.appendChild(l); }
    const row=document.createElement('div'); row.className='board-row';
    files.forEach((file,fi)=>{
      const sqName=file+rank;
      const sq=document.createElement('div');
      sq.className='chess-sq '+((fi+ri)%2===0?'light':'dark');
      sq.dataset.sq=sqName;

      if(cmLegal.includes(sqName)){
        const p=cmChess.get(sqName);
        sq.classList.add(p&&p.color!==myCol?'legal-capture':'legal-move');
      }
      if(cmSelSq===sqName) sq.classList.add('selected');

      const piece=cmChess.get(sqName);
      if(piece){
        const key=piece.color+piece.type.toUpperCase();
        sq.textContent=CM_PIECES[key]||'';
        sq.style.color=piece.color==='w'?'#fff':'#1a1a2e';
        sq.style.textShadow=piece.color==='w'
          ?'0 1px 3px rgba(0,0,0,.8),0 0 8px rgba(0,0,0,.4)'
          :'0 1px 3px rgba(255,255,255,.3)';
      }
      if(isMyTurn) sq.addEventListener('click',()=>cmSqClick(sqName));
      row.appendChild(sq);
    });
    board.appendChild(row);
  });

  if(fl) files.forEach(f=>{
    const l=document.createElement('div'); l.className='file-label'; l.textContent=f; fl.appendChild(l);
  });
}

// ── Square Click ─────────────────────────────────────────────────
function cmSqClick(sq){
  const myCol=cmMyColor();
  if(!cmChess||cmChess.game_over()) return;
  if(cmChess.turn()!==myCol) return;

  if(cmSelSq && cmLegal.includes(sq)){ cmMakeMove(cmSelSq,sq); return; }

  const piece=cmChess.get(sq);
  if(piece&&piece.color===myCol){
    cmSelSq=sq;
    cmLegal=cmChess.moves({square:sq,verbose:true}).map(m=>m.to);
  } else { cmSelSq=null; cmLegal=[]; }
  cmDrawBoard();
}

// ── Make Move & Sync to Firestore ────────────────────────────────
// saveResult is NOT called here — it is called in cmListen() for
// both players when the snapshot arrives with status:'finished'.
async function cmMakeMove(from, to){
  if(!cmChess||!cmRef) return;
  window.SFX?.play('click'); // immediate local feedback
  const myCol=cmMyColor();
  const promoRank=myCol==='w'?'8':'1';
  const piece=cmChess.get(from);
  const isPromo=piece&&piece.type==='p'&&to.endsWith(promoRank);
  const move=cmChess.move({from,to,promotion:isPromo?'q':undefined});
  if(!move) return;

  cmSelSq=null; cmLegal=[];
  const newFen   = cmChess.fen();
  const newMoves = [...(cmState.moves||[]), move.san];
  const nextTurn = myCol==='w'?'b':'w';

  const update={fen:newFen, moves:newMoves, currentTurn:nextTurn};
  if(cmChess.game_over()){
    update.status = 'finished';
    update.winner = cmChess.in_checkmate() ? cmUid : 'draw';
  }

  try {
    await cmRef.update(update);
    // ↑ When status becomes 'finished', both players' onSnapshot
    //   listeners fire and cmSaveMyResult() is called on each client.
  } catch(e){ console.error('cmMakeMove:',e); }
}

// ── Rematch ───────────────────────────────────────────────────────
async function cmRematch(){
  if(!cmRef||!cmState) return;
  cmResultSaved   = false;
  cmLastRenderKey = '';
  cmPrevStatus    = cmState.status; // 'finished' → triggers 'rematch' sound in listener
  const p1WasWhite = cmState.player1.color==='w';
  await cmRef.update({
    fen:             CM_INIT_FEN,
    currentTurn:     'w',
    status:          'playing',
    winner:          null,
    moves:           [],
    p1Heartbeat:     null,  // reset grace-period
    p2Heartbeat:     null,
    'player1.color': p1WasWhite ? 'b' : 'w',
    'player2.color': p1WasWhite ? 'w' : 'b'
  });
}

// ── Leave ─────────────────────────────────────────────────────────
async function cmLeave(){
  cmStopHeartbeat();
  hideStaleBannerC();
  if(cmUnsub){ cmUnsub(); cmUnsub=null; }
  if(cmRef&&cmState?.status==='playing'){
    const myCol  = cmMyColor();
    const oppUid = myCol==='w' ? cmState.player2?.uid : cmState.player1.uid;
    if(oppUid) await cmRef.update({status:'finished',winner:oppUid}).catch(()=>{});
  }
  renderCMLobby();
}

// ── beforeunload: fast-path forfeit on desktop tab close ──────────
window.addEventListener('beforeunload',()=>{
  if(cmRef&&cmState?.status==='playing'){
    const myCol  = cmMyColor();
    const oppUid = myCol==='w' ? cmState.player2?.uid : cmState.player1.uid;
    if(oppUid) cmRef.update({status:'finished',winner:oppUid});
  }
});

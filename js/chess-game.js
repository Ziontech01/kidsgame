// ── Chess Game (requires auth, uses chess.js for logic) ───────

requireAuth(() => { newChessGame(); });

const PIECES = {
  wK:'♔',wQ:'♕',wR:'♖',wB:'♗',wN:'♘',wP:'♙',
  bK:'♚',bQ:'♛',bR:'♜',bB:'♝',bN:'♞',bP:'♟'
};
const PIECE_VALUES = { p:1,n:3,b:3,r:5,q:9,k:0 };

let chess, selectedSq=null, legalMoves=[], playerColor='w';
let chessDiff='easy', chessStartTime=null, chessTimerInt=null;
let chessMoves=0, sessW=0, sessL=0, sessD=0;

function setChessDiff(d) {
  chessDiff=d;
  ['easy','medium','hard'].forEach(x=>{
    const btn=document.getElementById('cd-'+x);
    if(btn){
      btn.classList.toggle('active',x===d);
      btn.style.borderColor = x===d ? '#667eea':'#334155';
      btn.style.color = x===d ? '#667eea':'#e2e8f0';
    }
  });
  if(chess && !chess.game_over()) newChessGame();
}

function setChessSide(s) {
  playerColor=s;
  ['w','b'].forEach(x=>{
    const btn=document.getElementById('csy-'+x);
    if(btn){
      btn.classList.toggle('active',x===s);
      btn.style.borderColor = x===s?'#667eea':'#334155';
      btn.style.color = x===s?'#667eea':'#e2e8f0';
    }
  });
  newChessGame();
}

function newChessGame() {
  chess = new Chess();
  selectedSq=null; legalMoves=[]; chessMoves=0;
  clearInterval(chessTimerInt); chessStartTime=null;
  document.getElementById('chs-m').textContent='0';
  document.getElementById('chs-t').textContent='00:00';
  document.getElementById('chess-result').classList.remove('show');
  document.getElementById('move-history').innerHTML='<div style="color:#64748b;font-style:italic">No moves yet</div>';
  document.getElementById('captured-by-player').innerHTML='';
  document.getElementById('captured-by-cpu').innerHTML='';
  renderBoard();
  setChessStatus(playerColor==='w'?'♔ Your turn (White)':'♚ Your turn (Black)');
  if(playerColor==='b') setTimeout(cpuChessMove,600);
}

// ── Board Rendering ─────────────────────────────────────────
function renderBoard() {
  const board = document.getElementById('chessboard');
  const rankLbls = document.getElementById('rank-labels');
  const fileLbls = document.getElementById('file-labels');
  if(!board) return;
  board.innerHTML = '';
  if(rankLbls) rankLbls.innerHTML='';
  if(fileLbls) fileLbls.innerHTML='';

  const ranks = playerColor==='w' ? [8,7,6,5,4,3,2,1] : [1,2,3,4,5,6,7,8];
  const files = playerColor==='w' ? ['a','b','c','d','e','f','g','h'] : ['h','g','f','e','d','c','b','a'];

  ranks.forEach((rank,ri) => {
    if(rankLbls){
      const lbl=document.createElement('div'); lbl.className='rank-label';
      lbl.textContent=rank; rankLbls.appendChild(lbl);
    }
    const row=document.createElement('div'); row.className='board-row';
    files.forEach((file,fi) => {
      const sqName = file+rank;
      const isLight = (fi+ri)%2===0;
      const sq = document.createElement('div');
      sq.className = 'chess-sq '+(isLight?'light':'dark');
      sq.dataset.sq = sqName;
      // Legal move indicator
      if(legalMoves.includes(sqName)) {
        const piece = chess.get(sqName);
        sq.classList.add(piece && piece.color !== playerColor ? 'legal-capture' : 'legal-move');
      }
      // Selected square
      if(selectedSq===sqName) sq.classList.add('selected');
      // Piece
      const piece = chess.get(sqName);
      if(piece) {
        const key = piece.color + piece.type.toUpperCase();
        sq.textContent = PIECES[key] || '';
        sq.style.color = piece.color==='w' ? '#fff' : '#1a1a2e';
        sq.style.textShadow = piece.color==='w'
          ? '0 1px 3px rgba(0,0,0,.8),0 0 8px rgba(0,0,0,.4)'
          : '0 1px 3px rgba(255,255,255,.3)';
      }
      sq.addEventListener('click', () => handleSqClick(sqName));
      row.appendChild(sq);
    });
    board.appendChild(row);
  });

  if(fileLbls) files.forEach(f=>{
    const lbl=document.createElement('div'); lbl.className='file-label';
    lbl.textContent=f; fileLbls.appendChild(lbl);
  });
}

// ── Square Click ────────────────────────────────────────────
function handleSqClick(sq) {
  if(chess.game_over()) return;
  if(chess.turn() !== playerColor) return;

  if(selectedSq && legalMoves.includes(sq)) {
    makeMove(selectedSq, sq);
    return;
  }

  const piece = chess.get(sq);
  if(piece && piece.color===playerColor) {
    selectedSq = sq;
    legalMoves = chess.moves({square: sq, verbose:true}).map(m=>m.to);
  } else {
    selectedSq=null; legalMoves=[];
  }
  renderBoard();
}

function makeMove(from, to) {
  if(!chessStartTime) {
    chessStartTime=Date.now();
    chessTimerInt=setInterval(()=>{
      const e=Math.floor((Date.now()-chessStartTime)/1000);
      document.getElementById('chs-t').textContent=fmtT(e);
    },1000);
  }
  // Pawn promotion auto-queen
  const promoRank = playerColor==='w' ? '8':'1';
  const piece = chess.get(from);
  const isPromo = piece && piece.type==='p' && to.endsWith(promoRank);
  const move = chess.move({from, to, promotion: isPromo ? 'q' : undefined});
  if(!move) return;
  window.SFX?.play('click');
  chessMoves++;
  document.getElementById('chs-m').textContent=chessMoves;
  selectedSq=null; legalMoves=[];
  updateHistory(move);
  updateCaptured(move);
  renderBoard();
  if(checkGameEnd()) return;
  setChessStatus('🤖 Computer is thinking…');
  setTimeout(cpuChessMove, 300 + Math.random()*400);
}

// ── CPU Move ────────────────────────────────────────────────
function cpuChessMove() {
  if(chess.game_over()) return;
  const cpuColor = playerColor==='w'?'b':'w';
  if(chess.turn()!==cpuColor) return;

  const moves = chess.moves({verbose:true});
  if(!moves.length) return;

  let chosen;
  if(chessDiff==='easy') {
    chosen = moves[Math.floor(Math.random()*moves.length)];
  } else if(chessDiff==='medium') {
    chosen = bestMoveSimple(moves, cpuColor) || moves[Math.floor(Math.random()*moves.length)];
  } else {
    chosen = minimaxRoot(moves, cpuColor, 2);
  }

  const move = chess.move(chosen);
  if(!move) return;
  window.SFX?.play('opponent_move');
  chessMoves++;
  document.getElementById('chs-m').textContent=chessMoves;
  updateHistory(move);
  updateCaptured(move);
  renderBoard();
  if(checkGameEnd()) return;
  setChessStatus(playerColor==='w'?'♔ Your turn (White)':'♚ Your turn (Black)');
}

// Simple greedy: prioritise captures, then central moves
function bestMoveSimple(moves, color) {
  const captures = moves.filter(m=>m.captured);
  if(captures.length) {
    captures.sort((a,b)=>(PIECE_VALUES[b.captured]||0)-(PIECE_VALUES[a.captured]||0));
    return captures[0];
  }
  const center = ['e4','e5','d4','d5','c4','c5','f4','f5'];
  const central = moves.filter(m=>center.includes(m.to));
  if(central.length) return central[Math.floor(Math.random()*central.length)];
  return null;
}

// Simple 2-ply minimax for hard mode
function minimaxRoot(moves, color, depth) {
  let best=null, bestScore=-Infinity;
  for(const m of moves) {
    chess.move(m);
    const score = -minimaxChess(depth-1, -Infinity, Infinity, color==='w'?'b':'w');
    chess.undo();
    if(score>bestScore){ bestScore=score; best=m; }
  }
  return best || moves[0];
}
function minimaxChess(depth, alpha, beta, color) {
  if(depth===0||chess.game_over()) return evalBoard(color);
  const moves = chess.moves({verbose:true});
  let score = -Infinity;
  for(const m of moves) {
    chess.move(m);
    score = Math.max(score, -minimaxChess(depth-1,-beta,-alpha, color==='w'?'b':'w'));
    chess.undo();
    alpha = Math.max(alpha, score);
    if(alpha>=beta) break;
  }
  return score;
}
function evalBoard(forColor) {
  let score=0;
  const board = chess.board();
  board.forEach(row=>row.forEach(sq=>{
    if(!sq) return;
    const v = PIECE_VALUES[sq.type]||0;
    score += sq.color===forColor ? v : -v;
  }));
  return score;
}

// ── History & Captured ──────────────────────────────────────
function updateHistory(move) {
  const hist = chess.history();
  const el = document.getElementById('move-history');
  if(!el) return;
  if(hist.length===1) el.innerHTML='';
  const pairs = [];
  for(let i=0;i<hist.length;i+=2){
    pairs.push(`<div class="move-pair">
      <span class="move-num">${Math.floor(i/2)+1}.</span>
      <span class="move-w">${hist[i]||''}</span>
      <span class="move-b">${hist[i+1]||''}</span>
    </div>`);
  }
  el.innerHTML = pairs.join('');
  el.scrollTop = el.scrollHeight;
}

function updateCaptured(move) {
  if(!move.captured) return;
  const byPlayer = document.getElementById('captured-by-player');
  const byCpu    = document.getElementById('captured-by-cpu');
  const color = move.color===playerColor ? 'captured-by-player' : 'captured-by-cpu';
  const el = document.getElementById(color);
  if(el){
    const oppColor = move.color==='w'?'b':'w';
    const key = oppColor + move.captured.toUpperCase();
    el.innerHTML += (PIECES[key]||'');
  }
}

// ── Game End ────────────────────────────────────────────────
function checkGameEnd() {
  if(!chess.game_over()) return false;
  clearInterval(chessTimerInt);
  const elapsed = chessStartTime ? Math.floor((Date.now()-chessStartTime)/1000) : 0;
  const timeStr = fmtT(elapsed);
  let outcome, emoji, title, msg, cls;

  if(chess.in_checkmate()) {
    const winner = chess.turn(); // the side that is checkmated is the one whose turn it is
    if(winner !== playerColor) {
      outcome='win'; emoji='🏆'; title='You Win!'; cls='win'; msg='Checkmate! Amazing game!';
      sessW++; document.getElementById('chs-w').textContent=sessW;
    } else {
      outcome='lose'; emoji='😢'; title='Checkmate!'; cls='lose'; msg='The computer got your king. Try again!';
      sessL++; document.getElementById('chs-l').textContent=sessL;
    }
  } else {
    outcome='draw'; emoji='🤝'; title='Draw!'; cls='draw';
    msg = chess.in_stalemate() ? 'Stalemate! No legal moves.' :
          chess.in_threefold_repetition() ? 'Draw by repetition.' :
          chess.insufficient_material() ? 'Insufficient material.' : 'Draw!';
    sessD++; document.getElementById('chs-d').textContent=sessD;
  }
  if      (outcome==='win')  window.SFX?.play('win');
  else if (outcome==='lose') window.SFX?.play('lose');
  else                       window.SFX?.play('draw');
  saveResult({ gameType:'chess', outcome, moves:chessMoves, duration:elapsed, timeStr, difficulty:chessDiff });

  document.getElementById('cr-emoji').textContent=emoji;
  const t=document.getElementById('cr-title'); t.textContent=title; t.className='result-title '+cls;
  document.getElementById('cr-msg').textContent=msg;
  document.getElementById('cr-moves').textContent=chessMoves;
  document.getElementById('cr-time').textContent=timeStr;
  setTimeout(()=>document.getElementById('chess-result').classList.add('show'),600);
  return true;
}

function undoMove() {
  if(!chess||chessMoves<2) return;
  chess.undo(); chess.undo(); // undo player + cpu move
  chessMoves = Math.max(0, chessMoves-2);
  document.getElementById('chs-m').textContent=chessMoves;
  selectedSq=null; legalMoves=[];
  updateHistory({});
  renderBoard();
  setChessStatus(playerColor==='w'?'♔ Your turn (White)':'♚ Your turn (Black)');
}

function setChessStatus(t) {
  const el=document.getElementById('chess-status');
  if(el) el.textContent=t;
}
function fmtT(s){return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');}

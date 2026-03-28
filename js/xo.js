// ── XO Game (requires auth) ───────────────────────────────────

requireAuth(() => { /* page ready */ });

const WINS = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

let board=Array(9).fill(''), pSym='X', cSym='O', diff='easy';
let active=false, moves=0, startTime=null, timerInt=null;
let sW=0, sL=0, sD=0;

function setDiff(d) {
  diff = d;
  ['easy','medium','hard'].forEach(x => document.getElementById('diff-'+x).classList.toggle('active', x===d));
  document.getElementById('st-diff').textContent = d.charAt(0).toUpperCase()+d.slice(1);
  if (active) newGame();
}
function setSym(s) {
  pSym = s; cSym = s==='X'?'O':'X';
  document.getElementById('sym-x').classList.toggle('active', s==='X');
  document.getElementById('sym-o').classList.toggle('active', s==='O');
  if (active) newGame();
}

function newGame() {
  board = Array(9).fill(''); active=true; moves=0;
  document.getElementById('result-overlay').classList.remove('show');
  document.getElementById('st-moves').textContent='0';
  document.getElementById('st-timer').textContent='00:00';
  clearInterval(timerInt); startTime=null;
  for(let i=0;i<9;i++){
    document.getElementById('c'+i).classList.remove('taken','winning');
    const s=document.getElementById('s'+i); s.textContent=''; s.className='cell-sym';
  }
  if(pSym==='O'){setStatus('🤖 Computer is thinking…','cpu-turn');setTimeout(cpuMove,500);}
  else setStatus('😊 Your turn! You are ❌','player-turn');
}

function setStatus(t,cls){
  const el=document.getElementById('xo-status'); el.textContent=t; el.className='xo-status '+cls;
}

function cellClick(i){
  if(!active||board[i]!==''){
    // Cell is already taken — give the player an error sound
    if(active && board[i]!=='') window.SFX?.play('error');
    return;
  }
  if(!startTime){startTime=Date.now();timerInt=setInterval(()=>{
    const e=Math.floor((Date.now()-startTime)/1000);
    document.getElementById('st-timer').textContent=fmt(e);
  },1000);}
  place(i,pSym); moves++;
  window.SFX?.play('click');
  document.getElementById('st-moves').textContent=moves;
  const r=check(); if(r){end(r);return;}
  active=false; setStatus('🤖 Thinking…','cpu-turn');
  setTimeout(cpuMove,400);
}

function place(i,sym){
  board[i]=sym;
  const c=document.getElementById('c'+i), s=document.getElementById('s'+i);
  s.textContent=sym==='X'?'❌':'⭕';
  s.className='cell-sym show '+sym.toLowerCase();
  c.classList.add('taken');
}

function cpuMove(){
  const i = diff==='easy' ? rndMove() : diff==='medium' ? midMove() : hardMove();
  if(i<0) return;
  place(i,cSym); moves++;
  window.SFX?.play('opponent_move');
  document.getElementById('st-moves').textContent=moves;
  const r=check(); if(r){end(r);return;}
  active=true;
  setStatus('😊 Your turn! ('+(pSym==='X'?'❌':'⭕')+')','player-turn');
}

function rndMove(){
  const e=board.map((v,i)=>v===''?i:-1).filter(i=>i>=0);
  return e.length?e[Math.floor(Math.random()*e.length)]:-1;
}
function midMove(){
  const w=findWin(cSym); if(w>=0) return w;
  const b=findWin(pSym); if(b>=0) return b;
  if(board[4]==='') return 4;
  return rndMove();
}
function findWin(s){
  for(const [a,b,c] of WINS){
    const line=[board[a],board[b],board[c]];
    if(line.filter(v=>v===s).length===2&&line.includes('')){
      if(board[a]==='') return a;
      if(board[b]==='') return b;
      return c;
    }
  }
  return -1;
}
function hardMove(){
  let best=-Infinity,idx=-1;
  for(let i=0;i<9;i++) if(board[i]===''){
    board[i]=cSym;
    const s=minimax(board,0,false);
    board[i]='';
    if(s>best){best=s;idx=i;}
  }
  return idx;
}
function minimax(b,d,max){
  const w=winner(b);
  if(w===cSym) return 10-d;
  if(w===pSym) return d-10;
  if(b.every(c=>c!=='')) return 0;
  if(max){
    let best=-Infinity;
    for(let i=0;i<9;i++) if(b[i]===''){b[i]=cSym;best=Math.max(best,minimax(b,d+1,false));b[i]='';}
    return best;
  } else {
    let best=Infinity;
    for(let i=0;i<9;i++) if(b[i]===''){b[i]=pSym;best=Math.min(best,minimax(b,d+1,true));b[i]='';}
    return best;
  }
}

function check(){ const w=winner(board); if(w) return w; if(board.every(c=>c!=='')) return 'draw'; return null; }
function winner(b){ for(const [a,c,d] of WINS) if(b[a]&&b[a]===b[c]&&b[a]===b[d]) return b[a]; return null; }
function winCombo(b){ for(const combo of WINS){ const[a,c,d]=combo; if(b[a]&&b[a]===b[c]&&b[a]===b[d]) return combo; } return null; }

async function end(result){
  active=false; clearInterval(timerInt);
  const elapsed=startTime?Math.floor((Date.now()-startTime)/1000):0;
  const timeStr=fmt(elapsed);
  let outcome,emoji,title,cls,msg;
  if(result==='draw'){
    outcome='draw';emoji='🤝';title="It's a Draw!";cls='draw';msg='So close! Try again!';
    sD++;document.getElementById('sc-d').textContent=sD;
  } else if(result===pSym){
    outcome='win';emoji='🎉';title='You Win! 🏆';cls='win';
    msg='Amazing! You beat the computer!';
    sW++;document.getElementById('sc-w').textContent=sW;
    winCombo(board)?.forEach(i=>document.getElementById('c'+i).classList.add('winning'));
    confetti();
  } else {
    outcome='lose';emoji='😢';title='Computer Wins!';cls='lose';
    msg="Don't give up! Try again!";
    sL++;document.getElementById('sc-l').textContent=sL;
    winCombo(board)?.forEach(i=>document.getElementById('c'+i).classList.add('winning'));
  }
  if      (outcome==='win')  window.SFX?.play('win');
  else if (outcome==='lose') window.SFX?.play('lose');
  else                       window.SFX?.play('draw');
  await saveResult({gameType:'xo',outcome,moves,duration:elapsed,timeStr,difficulty:diff,playerSymbol:pSym});
  document.getElementById('r-emoji').textContent=emoji;
  const t=document.getElementById('r-title'); t.textContent=title; t.className='result-title '+cls;
  document.getElementById('r-msg').textContent=msg;
  document.getElementById('r-time').textContent=timeStr;
  document.getElementById('r-moves').textContent=moves;
  document.getElementById('r-diff').textContent=diff.charAt(0).toUpperCase()+diff.slice(1);
  document.getElementById('r-date').textContent=new Date().toLocaleDateString('en-GB',{day:'numeric',month:'short'});
  setTimeout(()=>document.getElementById('result-overlay').classList.add('show'), outcome!=='draw'?600:200);
}

function fmt(s){return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');}

function confetti(){
  const wrap=document.getElementById('confetti-wrap'); wrap.innerHTML='';
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

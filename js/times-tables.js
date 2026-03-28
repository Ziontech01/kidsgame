// ── Times Tables Quiz Game ────────────────────────────────────
// Select a table (1-12), answer 10 questions, visual dot-group feedback

(function () {
  'use strict';

  const QUESTIONS_PER_ROUND = 10;

  let selectedTable = 3;
  let questions = [];
  let current = 0;
  let score = 0;
  let startTime = null;
  let qStartTime = null;
  let timerInterval = null;
  let answered = false;
  const TIME_PER_Q = 15;

  // ── Init ─────────────────────────────────────────────────────
  function init() {
    renderTableSelector();
    hideLoading();
  }

  function hideLoading() {
    const ov = document.getElementById('loading-overlay');
    if (ov) ov.classList.add('hidden');
  }

  // ── Difficulty Groups ──────────────────────────────────────
  const DIFFICULTY_GROUPS = [
    { label:'🌱 Beginner',      color:'#16a34a', bg:'#f0fdf4', border:'#bbf7d0', range:[1,2,3,4,5] },
    { label:'🔥 Intermediate',  color:'#d97706', bg:'#fffbeb', border:'#fde68a', range:[6,7,8,9,10,11,12] },
    { label:'🚀 Advanced',      color:'#7c3aed', bg:'#faf5ff', border:'#ddd6fe', range:[13,14,15,16,17,18,19,20] }
  ];

  // ── Table Selector Screen ────────────────────────────────────
  function renderTableSelector() {
    const root = document.getElementById('tt-root');
    root.innerHTML = `
      <div style="text-align:center;padding:36px 20px;max-width:720px;margin:0 auto">
        <div style="font-size:3.5rem;margin-bottom:12px">✖️</div>
        <div style="font-family:'Fredoka One',cursive;font-size:2.2rem;color:#1A1A2E;margin-bottom:8px">Times Tables Quiz</div>
        <p style="color:#6B7280;font-weight:600;margin-bottom:28px">Choose your times table — tables go all the way to 20×!</p>

        <div style="background:#fff;border-radius:20px;box-shadow:0 4px 20px rgba(0,0,0,.08);padding:24px;margin-bottom:28px">
          <div style="font-weight:800;color:#1A1A2E;margin-bottom:20px;font-size:1.05rem">🎯 Choose Your Table</div>
          ${DIFFICULTY_GROUPS.map(g => `
            <div class="tt-difficulty-group" style="background:${g.bg};border:2px solid ${g.border};border-radius:14px;padding:14px 12px;margin-bottom:14px">
              <div style="font-weight:800;color:${g.color};margin-bottom:12px;font-size:.95rem">${g.label}</div>
              <div class="tt-selector">
                ${g.range.map(n => `
                  <button class="tt-table-btn ${n === selectedTable ? 'active' : ''}"
                          id="tt-btn-${n}" onclick="TimesTablesGame.selectTable(${n})">
                    ${n}×
                  </button>`).join('')}
              </div>
            </div>`).join('')}
        </div>

        <div style="background:#f0f4ff;border-radius:16px;padding:16px;margin-bottom:24px;max-width:460px;margin-left:auto;margin-right:auto">
          <div style="font-weight:800;color:#667eea;margin-bottom:8px">📋 Preview: ${selectedTable}× Table</div>
          <div id="tt-preview" style="display:grid;grid-template-columns:repeat(4,1fr);gap:4px 8px;font-size:.85rem;font-weight:700;color:#1A1A2E;text-align:left">
            ${Array.from({length:20},(_,i)=>i+1).map(n =>
              `<span style="color:${n<=5?'#16a34a':n<=12?'#d97706':'#7c3aed'}">${selectedTable} × ${n} = ${selectedTable * n}</span>`
            ).join('')}
          </div>
        </div>

        <button class="btn btn-primary btn-lg" onclick="TimesTablesGame.startQuiz()">
          🚀 Start Quiz — ${selectedTable}× Table
        </button>
      </div>`;
  }

  function selectTable(n) {
    selectedTable = n;
    // Update button styles
    for (let i = 1; i <= 20; i++) {
      const btn = document.getElementById(`tt-btn-${i}`);
      if (btn) btn.className = `tt-table-btn ${i === n ? 'active' : ''}`;
    }
    // Update preview
    const preview = document.getElementById('tt-preview');
    if (preview) {
      preview.innerHTML = Array.from({length:20},(_,i)=>i+1).map(m =>
        `<span style="color:${m<=5?'#16a34a':m<=12?'#d97706':'#7c3aed'}">${n} × ${m} = ${n * m}</span>`
      ).join('');
    }
    // Update button text
    const startBtn = document.querySelector('.btn-primary.btn-lg');
    if (startBtn) startBtn.textContent = `🚀 Start Quiz — ${n}× Table`;
    window.SFX?.play('click');
  }

  // ── Generate Questions ────────────────────────────────────────
  function generateQuestions() {
    // Pick QUESTIONS_PER_ROUND multipliers from 1-20 (no repeats if possible)
    const multipliers = [];
    const pool = Array.from({length:20},(_,i)=>i+1).sort(() => Math.random() - 0.5);
    for (let i = 0; i < QUESTIONS_PER_ROUND; i++) {
      multipliers.push(pool[i % pool.length]);
    }

    return multipliers.map(m => {
      const correct = selectedTable * m;
      // Generate 3 wrong answers nearby
      const wrongs = new Set();
      while (wrongs.size < 3) {
        const offset = [-2,-1,1,2,3,-3][Math.floor(Math.random()*6)];
        const wrong = correct + offset * selectedTable;
        if (wrong !== correct && wrong > 0) wrongs.add(wrong);
      }
      const wrongArr = [...wrongs];
      const allAnswers = [correct, ...wrongArr].sort(() => Math.random() - 0.5);
      return {
        a: selectedTable,
        b: m,
        correct,
        answers: allAnswers,
        correctIndex: allAnswers.indexOf(correct)
      };
    });
  }

  // ── Start Quiz ────────────────────────────────────────────────
  function startQuiz() {
    questions = generateQuestions();
    current = 0;
    score = 0;
    startTime = Date.now();
    answered = false;
    window.SFX?.play('click');
    renderQuizFrame();
    showQuestion();
  }

  function renderQuizFrame() {
    const root = document.getElementById('tt-root');
    root.innerHTML = `
      <div class="tt-wrap">
        <div class="quiz-header-bar">
          <div style="font-size:1.4rem">✖️</div>
          <div class="quiz-progress-wrap">
            <div class="quiz-progress-label">Question <span id="tt-num">1</span> of ${QUESTIONS_PER_ROUND}</div>
            <div class="quiz-progress-bar"><div class="quiz-progress-fill" id="tt-progress" style="width:0%"></div></div>
          </div>
          <div class="quiz-score-display">⭐ <span id="tt-score">0</span></div>
        </div>
        <div class="quiz-timer-bar">
          <div class="quiz-timer-label"><span>⏱️ Time left</span><span id="tt-timer-text">${TIME_PER_Q}s</span></div>
          <div class="quiz-timer-track"><div class="quiz-timer-fill" id="tt-timer-fill" style="width:100%"></div></div>
        </div>
        <div id="tt-question-area"></div>
      </div>`;
  }

  function showQuestion() {
    clearTimers();
    if (current >= QUESTIONS_PER_ROUND) { endQuiz(); return; }
    const q = questions[current];
    answered = false;
    document.getElementById('tt-num').textContent = current + 1;
    document.getElementById('tt-score').textContent = score;
    document.getElementById('tt-progress').style.width = (current / QUESTIONS_PER_ROUND * 100) + '%';

    document.getElementById('tt-question-area').innerHTML = `
      <div class="question-card" style="text-align:center">
        <div class="question-number">Question ${current + 1} / ${QUESTIONS_PER_ROUND} — ${selectedTable}× Table</div>
        <div style="font-family:'Fredoka One',cursive;font-size:3.2rem;color:#1A1A2E;margin:16px 0">
          ${q.a} × ${q.b} = ?
        </div>
        <div style="font-size:.9rem;color:#6B7280;font-weight:600">${q.a} groups of ${q.b}</div>
      </div>
      <div class="answers-grid" style="margin-bottom:16px">
        ${q.answers.map((ans, i) => `
          <button class="answer-btn" id="tt-ans-${i}" onclick="TimesTablesGame.answer(${i})">
            <span class="answer-letter">${'ABCD'[i]}</span> ${ans}
          </button>`).join('')}
      </div>
      <div class="feedback-bar" id="tt-feedback"></div>
      <div class="tt-visual" id="tt-visual" style="display:none"></div>`;

    startQuestionTimer();
  }

  function startQuestionTimer() {
    let remaining = TIME_PER_Q;
    const fill = document.getElementById('tt-timer-fill');
    const txt = document.getElementById('tt-timer-text');
    timerInterval = setInterval(() => {
      remaining--;
      if (fill) {
        const pct = (remaining / TIME_PER_Q) * 100;
        fill.style.width = pct + '%';
        fill.className = 'quiz-timer-fill' + (remaining <= 4 ? ' danger' : remaining <= 8 ? ' warning' : '');
      }
      if (txt) txt.textContent = remaining + 's';
      if (remaining <= 0) { clearInterval(timerInterval); if (!answered) timeUp(); }
    }, 1000);
  }

  function clearTimers() {
    clearInterval(timerInterval);
  }

  // ── Answer ────────────────────────────────────────────────────
  function answer(idx) {
    if (answered) return;
    answered = true;
    clearTimers();
    const q = questions[current];
    const correct = idx === q.correctIndex;
    if (correct) score++;

    document.getElementById('tt-score').textContent = score;

    // Style buttons
    document.querySelectorAll('[id^="tt-ans-"]').forEach(btn => btn.disabled = true);
    const chosenBtn = document.getElementById(`tt-ans-${idx}`);
    const correctBtn = document.getElementById(`tt-ans-${q.correctIndex}`);
    if (chosenBtn) chosenBtn.classList.add(correct ? 'correct' : 'wrong');
    if (!correct && correctBtn) correctBtn.classList.add('correct');

    // Feedback
    const fb = document.getElementById('tt-feedback');
    if (fb) {
      fb.className = 'feedback-bar show ' + (correct ? 'correct' : 'wrong');
      fb.style.display = 'flex';
      fb.style.alignItems = 'center';
      fb.style.flexWrap = 'wrap';
      fb.style.gap = '8px';
      fb.innerHTML =
        `<span style="flex:1;min-width:0">` +
        (correct
          ? `🎉 Correct! <strong>${q.a} × ${q.b} = ${q.correct}</strong>`
          : `❌ Not quite! <strong>${q.a} × ${q.b} = ${q.correct}</strong>`) +
        `<div class="tt-explain">💡 Think: <em>${q.a} groups of ${q.b} objects = ${q.correct} total</em></div></span>` +
        `<button onclick="TimesTablesGame._next()" ` +
        `style="flex-shrink:0;padding:8px 22px;border:none;border-radius:22px;` +
        `background:rgba(255,255,255,.3);color:inherit;font-weight:800;` +
        `font-size:.95rem;cursor:pointer;letter-spacing:.02em;white-space:nowrap">` +
        `Next ➜</button>`;
    }

    window.SFX?.play(correct ? 'quiz_correct' : 'quiz_wrong');

    // Show visual dot groups
    showDotVisual(q.a, q.b);
  }

  function timeUp() {
    answered = true;
    const q = questions[current];
    const fb = document.getElementById('tt-feedback');
    if (fb) {
      fb.className = 'feedback-bar show wrong';
      fb.style.display = 'flex';
      fb.style.alignItems = 'center';
      fb.style.flexWrap = 'wrap';
      fb.style.gap = '8px';
      fb.innerHTML =
        `<span style="flex:1;min-width:0">⏰ Time's up! <strong>${q.a} × ${q.b} = ${q.correct}</strong>` +
        `<div class="tt-explain">💡 Think: <em>${q.a} groups of ${q.b} objects = ${q.correct} total</em></div></span>` +
        `<button onclick="TimesTablesGame._next()" ` +
        `style="flex-shrink:0;padding:8px 22px;border:none;border-radius:22px;` +
        `background:rgba(255,255,255,.3);color:inherit;font-weight:800;` +
        `font-size:.95rem;cursor:pointer;letter-spacing:.02em;white-space:nowrap">` +
        `Next ➜</button>`;
    }
    document.querySelectorAll('[id^="tt-ans-"]').forEach(btn => btn.disabled = true);
    const correctBtn = document.getElementById(`tt-ans-${q.correctIndex}`);
    if (correctBtn) correctBtn.classList.add('correct');
    window.SFX?.play('quiz_timeout');
    showDotVisual(q.a, q.b);
  }

  // ── Visual Dot Groups ─────────────────────────────────────────
  function showDotVisual(a, b) {
    const visual = document.getElementById('tt-visual');
    if (!visual) return;
    visual.style.display = 'block';
    const dotColor = '#667eea';
    const groups = [];
    for (let g = 0; g < a; g++) {
      const dotsHtml = Array(b).fill(`<span class="tt-dot" style="background:${dotColor}"></span>`).join('');
      groups.push(`<div class="tt-dot-group">${dotsHtml}</div>`);
    }
    visual.innerHTML = `
      <div style="font-size:.85rem;font-weight:800;color:#667eea;margin-bottom:8px">
        ${a} groups of ${b} dots = ${a * b}
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center">
        ${groups.join('')}
      </div>`;
  }

  function nextQuestion() {
    current++;
    showQuestion();
  }

  // ── End Quiz ──────────────────────────────────────────────────
  async function endQuiz() {
    clearTimers();
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const timeStr = `${Math.floor(elapsed/60)}:${String(elapsed%60).padStart(2,'0')}`;
    const pct = Math.round((score / QUESTIONS_PER_ROUND) * 100);
    const msgs = [
      { min:90, emoji:'🏆', title:'Outstanding!',   msg:'You\'ve mastered the ' + selectedTable + '× table!' },
      { min:70, emoji:'🎉', title:'Brilliant!',      msg:'Nearly there! A little more practice!' },
      { min:50, emoji:'😊', title:'Good effort!',    msg:'Keep going — you\'re getting there!' },
      { min:0,  emoji:'💪', title:'Keep practising!',msg:'Every attempt makes you better. Try again!' }
    ];
    const m = msgs.find(x => pct >= x.min);

    window.SFX?.play(pct >= 70 ? 'win' : pct >= 50 ? 'draw' : 'lose');

    const root = document.getElementById('tt-root');
    root.innerHTML = `
      <div class="quiz-end">
        <span class="quiz-end-emoji">${m.emoji}</span>
        <div class="quiz-end-title">${m.title}</div>
        <div class="quiz-end-message">${m.msg}</div>
        <div class="score-circle">
          <div class="score-num">${score}/${QUESTIONS_PER_ROUND}</div>
          <div class="score-lbl">${pct}% correct</div>
        </div>
        <div class="quiz-stats-grid">
          <div class="quiz-stat"><div class="quiz-stat-val">${score}</div><div class="quiz-stat-lbl">✅ Correct</div></div>
          <div class="quiz-stat"><div class="quiz-stat-val">${QUESTIONS_PER_ROUND - score}</div><div class="quiz-stat-lbl">❌ Wrong</div></div>
          <div class="quiz-stat"><div class="quiz-stat-val">${timeStr}</div><div class="quiz-stat-lbl">⏱️ Time</div></div>
        </div>

        <div style="background:#f0f4ff;border-radius:14px;padding:16px;margin-bottom:24px">
          <div style="font-weight:800;color:#667eea;margin-bottom:10px">📋 Full ${selectedTable}× Table (1–20)</div>
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:4px 8px;font-size:.82rem;font-weight:700;color:#1A1A2E;text-align:left">
            ${Array.from({length:20},(_,i)=>i+1).map(n =>
              `<span style="color:${n<=5?'#16a34a':n<=12?'#d97706':'#7c3aed'}">${selectedTable} × ${n} = ${selectedTable * n}</span>`
            ).join('')}
          </div>
        </div>

        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
          <button class="btn btn-primary btn-lg" onclick="TimesTablesGame.startQuiz()">🔄 Try Again</button>
          <button class="btn btn-secondary" onclick="TimesTablesGame.backToSelector()">🎯 Change Table</button>
          <a href="history.html" class="btn btn-ghost">📊 My Results</a>
        </div>
      </div>`;

    try {
      await saveResult({
        gameType: 'times-tables',
        outcome:  'quiz',
        level: 'table-' + selectedTable,
        score,
        total: QUESTIONS_PER_ROUND,
        percent: pct,
        duration: elapsed,
        timeStr,
        table: selectedTable
      });
    } catch(e) {}
  }

  function backToSelector() {
    clearTimers();
    window.SFX?.play('click');
    renderTableSelector();
  }

  window.TimesTablesGame = { init, selectTable, startQuiz, answer, backToSelector, _next: nextQuestion };
})();

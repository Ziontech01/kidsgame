// ── Reusable Quiz Engine ──────────────────────────────────────
// Usage: call QuizEngine.init(config) after page load
//   config = { gameType, getQuestions(level), containerId, onComplete }

const QuizEngine = (() => {
  const QUESTION_COUNT = 10;
  const TIME_PER_Q    = 20; // seconds

  let state = {};

  function init(config) {
    state = {
      config,
      questions:   [],
      current:     0,
      score:       0,
      startTime:   null,
      qStartTime:  null,
      timers:      [],
      answered:    false,
      level:       getUserLevel()
    };
    renderLevelSelect();
  }

  // ── Level Selection Screen ──────────────────────────────────
  function renderLevelSelect() {
    const levels = [
      { id:'reception', name:'Reception', age:'Age 4–5', emoji:'🌱' },
      { id:'year1',     name:'Year 1',    age:'Age 5–6', emoji:'⭐' },
      { id:'year2',     name:'Year 2',    age:'Age 6–7', emoji:'🌟' },
      { id:'year3',     name:'Year 3',    age:'Age 7–8', emoji:'🔥' },
      { id:'year4',     name:'Year 4',    age:'Age 8–9', emoji:'💡' },
      { id:'year5',     name:'Year 5',    age:'Age 9–10',emoji:'🚀' },
      { id:'year6',     name:'Year 6',    age:'Age 10–11',emoji:'🏆' },
    ];
    const container = document.getElementById(state.config.containerId);
    container.innerHTML = `
      <div class="level-content">
        <div class="level-header">
          <div class="level-title">${state.config.icon} ${state.config.title}</div>
          <div class="level-subtitle">First, choose your year group!</div>
        </div>
        <div class="levels-grid">
          ${levels.map(l => `
            <button class="level-btn ${l.id === state.level ? 'active' : ''}"
              data-level="${l.id}"
              onclick="QuizEngine._selectLevel('${l.id}')">
              <span class="level-emoji">${l.emoji}</span>
              <div class="level-name">${l.name}</div>
              <div class="level-age">${l.age}</div>
            </button>`).join('')}
        </div>
        <div style="text-align:center">
          <button class="btn btn-primary btn-lg" onclick="QuizEngine._startQuiz()">
            🚀 Start Quiz!
          </button>
        </div>
      </div>`;
  }

  function _selectLevel(level) {
    state.level = level;
    saveUserLevel(level);
    // Use data-level attribute to identify the button — no global event dependency
    document.querySelectorAll('.level-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-level') === level);
    });
  }

  // ── Start Quiz ──────────────────────────────────────────────
  function _startQuiz() {
    state.questions  = shuffle(state.config.getQuestions(state.level)).slice(0, QUESTION_COUNT);
    state.current    = 0;
    state.score      = 0;
    state.startTime  = Date.now();
    state.answered   = false;
    renderQuiz();
    showQuestion();
  }

  function renderQuiz() {
    const container = document.getElementById(state.config.containerId);
    container.innerHTML = `
      <div class="quiz-body">
        <div class="quiz-header-bar">
          <div style="font-size:1.4rem">${state.config.icon}</div>
          <div class="quiz-progress-wrap">
            <div class="quiz-progress-label">
              Question <span id="q-num">1</span> of ${QUESTION_COUNT}
            </div>
            <div class="quiz-progress-bar">
              <div class="quiz-progress-fill" id="q-progress" style="width:0%"></div>
            </div>
          </div>
          <div class="quiz-score-display">⭐ <span id="q-score">0</span></div>
        </div>
        <div class="quiz-timer-bar">
          <div class="quiz-timer-label">
            <span>⏱️ Time left</span><span id="timer-text">${TIME_PER_Q}s</span>
          </div>
          <div class="quiz-timer-track">
            <div class="quiz-timer-fill" id="timer-fill" style="width:100%"></div>
          </div>
        </div>
        <div id="question-area"></div>
      </div>`;
  }

  function showQuestion() {
    clearTimers();
    const q         = state.questions[state.current];
    // Normalise: some question banks use {q:'...'} instead of {question:'...'}
    if (!q.question && q.q) q.question = q.q;
    state.answered  = false;
    const pct       = (state.current / QUESTION_COUNT) * 100;

    document.getElementById('q-num').textContent      = state.current + 1;
    document.getElementById('q-score').textContent    = state.score;
    document.getElementById('q-progress').style.width = pct + '%';

    const area = document.getElementById('question-area');
    const isTyped = q.type === 'typed';
    const answerHTML = isTyped
      ? `<div class="typed-answer-wrap">
           <input type="text" id="typed-input" class="typed-input" placeholder="Type your answer…"
             autocomplete="off" onkeydown="if(event.key==='Enter')QuizEngine._submitTyped()"/>
           <button class="btn btn-primary" onclick="QuizEngine._submitTyped()">Submit</button>
         </div>`
      : `<div class="answers-grid ${q.answers.length <= 2 ? 'single-col' : ''}">
           ${q.answers.map((a, i) => `
             <button class="answer-btn" onclick="QuizEngine._answer(${i})" id="ans-${i}">
               <span class="answer-letter">${'ABCD'[i]}</span> ${a}
             </button>`).join('')}
         </div>`;

    area.innerHTML = `
      <div class="question-card">
        <div class="question-number">Question ${state.current + 1} / ${QUESTION_COUNT}</div>
        <div class="question-text">${q.question}</div>
        ${q.emoji ? `<div class="question-image">${q.emoji}</div>` : ''}
      </div>
      ${answerHTML}
      <div class="feedback-bar" id="feedback"></div>`;

    if (isTyped) {
      setTimeout(() => { const inp = document.getElementById('typed-input'); if (inp) inp.focus(); }, 50);
    }
    startTimer();
  }

  // ── Timer ───────────────────────────────────────────────────
  function startTimer() {
    state.qStartTime  = Date.now();
    let remaining     = TIME_PER_Q;
    const fill        = document.getElementById('timer-fill');
    const txt         = document.getElementById('timer-text');

    const interval = setInterval(() => {
      remaining--;
      const pct = (remaining / TIME_PER_Q) * 100;
      if (fill) { fill.style.width = pct + '%';
        fill.className = 'quiz-timer-fill' + (remaining <= 5 ? ' danger' : remaining <= 10 ? ' warning' : '');
      }
      if (txt) txt.textContent = remaining + 's';
      if (remaining <= 0) { clearInterval(interval); if (!state.answered) _timeUp(); }
    }, 1000);
    state.timers.push(interval);
  }

  function clearTimers() { state.timers.forEach(clearInterval); state.timers = []; }

  function _timeUp() {
    state.answered = true;
    window.SFX?.play('quiz_timeout');
    const tq = state.questions[state.current];
    const explainT = tq.explanation ? ` &nbsp;💡 ${tq.explanation}` : '';
    showFeedback(false, `⏰ Time's up! The answer was: <strong>${getCorrectText()}</strong>${explainT}`);
    disableAnswers();
  }

  // ── Answer Handling ─────────────────────────────────────────
  function _answer(idx) {
    if (state.answered) return;
    state.answered = true;
    clearTimers();
    const q       = state.questions[state.current];
    const correct = idx === q.correct;
    if (correct) state.score++;
    document.getElementById('q-score').textContent = state.score;

    const btn = document.getElementById('ans-' + idx);
    if (btn) btn.classList.add(correct ? 'correct' : 'wrong');
    if (!correct) {
      const correctBtn = document.getElementById('ans-' + q.correct);
      if (correctBtn) correctBtn.classList.add('correct');
    }
    disableAnswers();
    window.SFX?.play(correct ? 'quiz_correct' : 'quiz_wrong');
    const correctAns = q.answers[q.correct];
    const explainPart = q.explanation ? ` &nbsp;💡 ${q.explanation}` : '';
    const _correctMsg = q.explanation ? `🎉 Correct! &nbsp;💡 ${q.explanation}` : '🎉 Correct! Well done!';
    const _wrongMsg   = `❌ Wrong! The correct answer was: <strong>${correctAns}</strong>${explainPart}`;
    showFeedback(correct, correct ? _correctMsg : _wrongMsg);
  }

  function _submitTyped() {
    if (state.answered) return;
    const input = document.getElementById('typed-input');
    if (!input) return;
    const val   = input.value.trim().toLowerCase();
    const q     = state.questions[state.current];
    const correct = q.acceptedAnswers
      ? q.acceptedAnswers.some(a => a.toLowerCase() === val)
      : val === q.answers[q.correct].toLowerCase();
    state.answered = true;
    clearTimers();
    if (correct) state.score++;
    document.getElementById('q-score').textContent = state.score;
    input.disabled = true;
    window.SFX?.play(correct ? 'quiz_correct' : 'quiz_wrong');
    const correctAns2 = q.answers[q.correct];
    const explainPart2 = q.explanation ? ` &nbsp;💡 ${q.explanation}` : '';
    const msg2 = correct
      ? (q.explanation ? `🎉 Correct! &nbsp;💡 ${q.explanation}` : '🎉 Correct! Well done!')
      : `❌ Wrong! The answer was: <strong>${correctAns2}</strong>${explainPart2}`;
    showFeedback(correct, msg2);
  }

  function getCorrectText() {
    const q = state.questions[state.current];
    return q.answers ? q.answers[q.correct] : '';
  }

  function disableAnswers() {
    document.querySelectorAll('.answer-btn').forEach(b => b.disabled = true);
  }

  function showFeedback(correct, msg) {
    const fb = document.getElementById('feedback');
    if (!fb) return;
    fb.className = 'feedback-bar show ' + (correct ? 'correct' : 'wrong');
    fb.style.display = 'flex';
    fb.style.alignItems = 'center';
    fb.style.flexWrap = 'wrap';
    fb.style.gap = '8px';
    fb.innerHTML =
      `<span style="flex:1;min-width:0">${msg}</span>` +
      `<button onclick="QuizEngine._next()" ` +
      `style="flex-shrink:0;padding:8px 22px;border:none;border-radius:22px;` +
      `background:rgba(255,255,255,.3);color:inherit;font-weight:800;` +
      `font-size:.95rem;cursor:pointer;letter-spacing:.02em;white-space:nowrap">` +
      `Next ➜</button>`;
  }

  // ── Next Question ───────────────────────────────────────────
  function nextQuestion() {
    state.current++;
    if (state.current >= QUESTION_COUNT) { endQuiz(); return; }
    showQuestion();
  }

  // ── End Quiz ────────────────────────────────────────────────
  async function endQuiz() {
    clearTimers();
    const totalTime = Math.floor((Date.now() - state.startTime) / 1000);
    const pct       = Math.round((state.score / QUESTION_COUNT) * 100);
    const msgs = [
      { min:90, emoji:'🏆', title:'Outstanding!',   msg:'You\'re a superstar! Amazing score!' },
      { min:70, emoji:'🎉', title:'Brilliant!',      msg:'Great work! You really know your stuff!' },
      { min:50, emoji:'😊', title:'Good effort!',    msg:'Not bad at all! Keep practising!' },
      { min:30, emoji:'🌱', title:'Keep going!',     msg:'Every go makes you better! Try again!' },
      { min:0,  emoji:'💪', title:'Don\'t give up!', msg:'Practise makes perfect! Have another go!' }
    ];
    const m = msgs.find(x => pct >= x.min);

    const container = document.getElementById(state.config.containerId);
    container.innerHTML = `
      <div class="quiz-end">
        <span class="quiz-end-emoji">${m.emoji}</span>
        <div class="quiz-end-title">${m.title}</div>
        <div class="quiz-end-message">${m.msg}</div>
        <div class="score-circle">
          <div class="score-num">${state.score}/${QUESTION_COUNT}</div>
          <div class="score-lbl">${pct}% correct</div>
        </div>
        <div class="quiz-stats-grid">
          <div class="quiz-stat"><div class="quiz-stat-val">${state.score}</div><div class="quiz-stat-lbl">✅ Correct</div></div>
          <div class="quiz-stat"><div class="quiz-stat-val">${QUESTION_COUNT - state.score}</div><div class="quiz-stat-lbl">❌ Wrong</div></div>
          <div class="quiz-stat"><div class="quiz-stat-val">${formatTime(totalTime)}</div><div class="quiz-stat-lbl">⏱️ Time</div></div>
        </div>
        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
          <button class="btn btn-primary btn-lg" onclick="QuizEngine._startQuiz()">🔄 Play Again</button>
          <button class="btn btn-secondary" onclick="QuizEngine._changeLevel()">🎯 Change Level</button>
          <a href="history.html" class="btn btn-ghost">📊 My Results</a>
        </div>
      </div>`;

    // Save to Firebase
    await saveResult({
      gameType:  state.config.gameType,
      outcome:   'quiz',
      level:     state.level,
      score:     state.score,
      total:     QUESTION_COUNT,
      percent:   pct,
      duration:  totalTime,
      timeStr:   formatTime(totalTime)
    });
  }

  function _changeLevel() { init(state.config); }

  // ── Helpers ─────────────────────────────────────────────────
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function formatTime(s) { return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0'); }

  return { init, _selectLevel, _startQuiz, _answer, _submitTyped, _changeLevel, _next: nextQuestion };
})();

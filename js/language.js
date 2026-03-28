// Happy Games – Language Game Engine
// Flow: Language select → Category select → Flashcard (see & say) → MCQ quiz → Results
'use strict';

const LanguageGame = (() => {

  const PHRASES_PER_ROUND = 8;

  let state = {};

  const CATEGORIES = [
    { id:'greetings', name:'Greetings & Phrases', emoji:'👋' },
    { id:'numbers',   name:'Numbers 1–10',         emoji:'🔢' },
    { id:'food',      name:'Food & Drink',          emoji:'🍎' },
    { id:'colours',   name:'Colours',               emoji:'🎨' },
    { id:'family',    name:'Family',                emoji:'👨‍👩‍👧' },
    { id:'school',    name:'School',                emoji:'🎒' }
  ];

  // Accent colour per language (used in buttons, headers, badges)
  const LANG_COLORS = {
    spanish:  '#dc2626',   // Spanish red
    french:   '#2563eb',   // French blue
    mandarin: '#b91c1c',   // Mandarin red
    yoruba:   '#15803d'    // Nigerian green
  };

  /* ── Public init ───────────────────────────────────────────── */
  function init() {
    state = { step:'language', lang:null, cat:null, phrases:[], idx:0,
              phase:'flash', score:0, startTime:null, showingAnswer:false };
    renderLanguageSelect();
  }

  /* ─────────────────────────────────────────────────────────────
     SCREEN 1 — Language selection
  ───────────────────────────────────────────────────────────── */
  function renderLanguageSelect() {
    const keys = Object.keys(LANGUAGE_DATA);
    getContainer().innerHTML = `
      <div style="max-width:680px;margin:0 auto;padding:0 16px 48px">

        <!-- Header -->
        <div style="text-align:center;padding:36px 16px 28px">
          <div style="font-size:4rem;margin-bottom:12px">🌍</div>
          <div style="font-family:'Fredoka One',cursive;font-size:2.4rem;color:#1a1a2e;margin-bottom:8px">
            Language Game
          </div>
          <div style="color:#6b7280;font-size:1rem;font-weight:600">
            Choose a language to start learning!
          </div>
        </div>

        <!-- Language cards -->
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:16px">
          ${keys.map(k => {
            const l = LANGUAGE_DATA[k];
            const col = LANG_COLORS[k] || '#667eea';
            return `
            <button onclick="LanguageGame._selectLang('${k}')"
              style="background:#fff;border:3px solid ${col};border-radius:20px;
                     padding:24px 12px;text-align:center;cursor:pointer;
                     box-shadow:0 4px 16px rgba(0,0,0,.1);transition:all .22s;
                     font-family:'Nunito',sans-serif;width:100%"
              onmouseover="this.style.transform='translateY(-6px)';this.style.boxShadow='0 10px 28px rgba(0,0,0,.18)';this.style.background='${col}';this.querySelector('.lg-lname').style.color='#fff';this.querySelector('.lg-lnative').style.color='rgba(255,255,255,.8)'"
              onmouseout="this.style.transform='';this.style.boxShadow='0 4px 16px rgba(0,0,0,.1)';this.style.background='#fff';this.querySelector('.lg-lname').style.color='#1a1a2e';this.querySelector('.lg-lnative').style.color='#6b7280'">
              <div style="font-size:3.2rem;margin-bottom:8px">${l.flag}</div>
              <div style="font-family:'Fredoka One',cursive;font-size:1.6rem;color:${col};margin-bottom:4px">
                ${k.substring(0,2).toUpperCase()}
              </div>
              <div class="lg-lname" style="font-weight:800;font-size:1rem;color:#1a1a2e;margin-bottom:3px">
                ${l.name}
              </div>
              <div class="lg-lnative" style="font-size:.8rem;color:#6b7280">${l.nativeName}</div>
            </button>`;
          }).join('')}
        </div>
      </div>`;
    hideLoading();
  }

  /* ─────────────────────────────────────────────────────────────
     SCREEN 2 — Category selection
  ───────────────────────────────────────────────────────────── */
  function _selectLang(langId) {
    window.SFX?.play('click');
    state.lang = langId;
    const lang = LANGUAGE_DATA[langId];
    const col  = LANG_COLORS[langId] || '#667eea';
    getContainer().innerHTML = `
      <div style="max-width:680px;margin:0 auto;padding:0 16px 48px">

        <!-- Language header banner -->
        <div style="background:${col};color:#fff;padding:24px 20px;border-radius:0 0 20px 20px;
                    margin-bottom:24px;text-align:center">
          <div style="font-size:3rem;margin-bottom:8px">${lang.flag}</div>
          <div style="font-family:'Fredoka One',cursive;font-size:2rem;margin-bottom:4px">${lang.name}</div>
          <div style="font-size:.88rem;opacity:.9;max-width:440px;margin:0 auto">${lang.funFact}</div>
        </div>

        <div style="font-weight:800;font-size:1rem;color:#1a1a2e;text-align:center;margin-bottom:16px">
          Choose a category to practise:
        </div>

        <!-- Category grid -->
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;margin-bottom:24px">
          ${CATEGORIES.map(c => {
            const phrases = lang.categories[c.id] || [];
            if (!phrases.length) return '';
            return `
            <button onclick="LanguageGame._selectCat('${c.id}')"
              style="background:#fff;border:2px solid #e5e7eb;border-radius:16px;
                     padding:18px 10px;text-align:center;cursor:pointer;
                     box-shadow:0 2px 10px rgba(0,0,0,.06);transition:all .2s;
                     font-family:'Nunito',sans-serif;width:100%"
              onmouseover="this.style.borderColor='${col}';this.style.transform='translateY(-4px)';this.style.boxShadow='0 6px 18px rgba(0,0,0,.14)'"
              onmouseout="this.style.borderColor='#e5e7eb';this.style.transform='';this.style.boxShadow='0 2px 10px rgba(0,0,0,.06)'">
              <div style="font-size:2rem;margin-bottom:8px">${c.emoji}</div>
              <div style="font-weight:800;font-size:.92rem;color:#1a1a2e;margin-bottom:4px">${c.name}</div>
              <div style="background:${col};color:#fff;border-radius:20px;padding:2px 10px;
                          font-size:.75rem;font-weight:700;display:inline-block">
                ${phrases.length} phrases
              </div>
            </button>`;
          }).join('')}
        </div>

        <div style="text-align:center">
          <button onclick="LanguageGame.init()"
            style="background:#f3f4f6;color:#374151;border:none;border-radius:50px;
                   padding:10px 22px;font-family:'Nunito',sans-serif;font-size:.92rem;
                   font-weight:800;cursor:pointer">
            ← Back to Languages
          </button>
        </div>
      </div>`;
  }

  /* ── Start session ─────────────────────────────────────────── */
  function _selectCat(catId) {
    window.SFX?.play('click');
    state.cat = catId;
    const lang = LANGUAGE_DATA[state.lang];
    const pool = [...(lang.categories[catId] || [])].sort(() => Math.random() - 0.5);
    state.phrases = pool.slice(0, PHRASES_PER_ROUND);
    state.idx = 0;
    state.phase = 'flash';
    state.score = 0;
    state.startTime = Date.now();
    renderFlashcard();
  }

  /* ─────────────────────────────────────────────────────────────
     SCREEN 3 — Flashcard (learn first, then quiz)
  ───────────────────────────────────────────────────────────── */
  function renderFlashcard() {
    state.showingAnswer = false;
    const p    = state.phrases[state.idx];
    const lang = LANGUAGE_DATA[state.lang];
    const cat  = CATEGORIES.find(c => c.id === state.cat);
    const col  = LANG_COLORS[state.lang] || '#667eea';
    const pct  = ((state.idx + 1) / state.phrases.length) * 100;

    getContainer().innerHTML = `
      <div style="max-width:600px;margin:0 auto;padding:0 16px 48px">

        <!-- Header -->
        <div style="display:flex;align-items:center;justify-content:space-between;
                    padding:16px 0 12px;gap:12px;flex-wrap:wrap">
          <div style="display:flex;align-items:center;gap:10px">
            <span style="font-size:1.8rem">${lang.flag}</span>
            <div>
              <div style="font-weight:800;color:#1a1a2e;font-size:.95rem">
                ${lang.name} — ${cat.emoji} ${cat.name}
              </div>
              <div style="font-size:.78rem;color:#6b7280">
                Flashcard ${state.idx + 1} of ${state.phrases.length}
              </div>
            </div>
          </div>
          <button onclick="LanguageGame.init()"
            style="background:#f3f4f6;color:#374151;border:none;border-radius:50px;
                   padding:8px 16px;font-family:'Nunito',sans-serif;font-size:.82rem;
                   font-weight:800;cursor:pointer;flex-shrink:0">
            ← Back
          </button>
        </div>

        <!-- Progress bar -->
        <div style="background:#e5e7eb;border-radius:99px;height:7px;margin-bottom:20px">
          <div style="background:${col};border-radius:99px;height:7px;
                      width:${pct}%;transition:width .35s"></div>
        </div>

        <!-- Flashcard -->
        <div style="background:#fff;border-radius:20px;box-shadow:0 6px 24px rgba(0,0,0,.1);
                    padding:32px 24px;text-align:center;margin-bottom:20px">

          <!-- English -->
          <div style="font-size:.72rem;text-transform:uppercase;letter-spacing:.08em;
                      color:#9ca3af;font-weight:700;margin-bottom:8px">🇬🇧 English</div>
          <div style="font-size:2.2rem;font-weight:900;color:#1a1a2e;margin-bottom:24px;
                      line-height:1.2">
            ${p.en}
          </div>

          <!-- Reveal button -->
          <div id="reveal-hint">
            <button onclick="LanguageGame._revealFlash()"
              style="background:linear-gradient(135deg,${col},${col}cc);color:#fff;
                     border:none;border-radius:50px;padding:14px 28px;
                     font-family:'Nunito',sans-serif;font-size:1rem;font-weight:800;
                     cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.2)">
              👀 Show ${lang.name} Translation
            </button>
          </div>

          <!-- Translation (hidden until revealed) -->
          <div id="lang-target" style="display:none">
            <div style="border-top:2px dashed #e5e7eb;margin:20px 0 16px"></div>
            <div style="font-size:.72rem;text-transform:uppercase;letter-spacing:.08em;
                        color:#9ca3af;font-weight:700;margin-bottom:8px">
              ${lang.flag} ${lang.name}
            </div>
            <div style="font-size:2.6rem;font-weight:900;color:${col};margin-bottom:12px;
                        word-break:break-word;line-height:1.2">
              ${p.target}
            </div>
            <div style="background:#f0f4ff;border-radius:12px;padding:10px 18px;
                        display:inline-block;font-size:1rem;color:#374151">
              🔊 <strong>Say it:</strong> <em>${p.phonetic}</em>
            </div>
          </div>
        </div>

        <!-- Nav button (hidden until answer revealed) -->
        <div id="flash-nav" style="display:none;text-align:center">
          <button onclick="LanguageGame._nextFlash()"
            style="background:linear-gradient(135deg,${col},${col}cc);color:#fff;
                   border:none;border-radius:50px;padding:14px 32px;
                   font-family:'Nunito',sans-serif;font-size:1.05rem;font-weight:800;
                   cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,.2)">
            ${state.idx + 1 < state.phrases.length ? 'Next Card →' : '🎯 Start Quiz!'}
          </button>
        </div>
      </div>`;
  }

  function _revealFlash() {
    window.SFX?.play('click');
    document.getElementById('reveal-hint').style.display = 'none';
    document.getElementById('lang-target').style.display = '';
    document.getElementById('flash-nav').style.display = '';
  }

  function _nextFlash() {
    window.SFX?.play('click');
    state.idx++;
    if (state.idx < state.phrases.length) {
      renderFlashcard();
    } else {
      state.idx = 0;
      state.phase = 'quiz';
      renderQuizQuestion();
    }
  }

  /* ─────────────────────────────────────────────────────────────
     SCREEN 4 — MCQ Quiz
  ───────────────────────────────────────────────────────────── */
  function renderQuizQuestion() {
    const p    = state.phrases[state.idx];
    const lang = LANGUAGE_DATA[state.lang];
    const cat  = CATEGORIES.find(c => c.id === state.cat);
    const col  = LANG_COLORS[state.lang] || '#667eea';
    const pct  = (state.idx / state.phrases.length) * 100;

    // Build distractors
    const allInCat   = LANGUAGE_DATA[state.lang].categories[state.cat] || [];
    const distractors = allInCat
      .filter(x => x.target !== p.target)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(x => x.target);

    while (distractors.length < 3) {
      const other = Object.values(lang.categories).flat()
        .filter(x => x.target !== p.target && !distractors.includes(x.target))
        .sort(() => Math.random() - 0.5);
      distractors.push(other.length ? other[0].target : '???');
    }

    const opts       = shuffle([p.target, ...distractors.slice(0, 3)]);
    const correctIdx = opts.indexOf(p.target);

    getContainer().innerHTML = `
      <div style="max-width:600px;margin:0 auto;padding:0 16px 48px">

        <!-- Header -->
        <div style="display:flex;align-items:center;gap:10px;padding:16px 0 12px;flex-wrap:wrap">
          <span style="font-size:1.8rem">${lang.flag}</span>
          <div>
            <div style="font-weight:800;color:#1a1a2e;font-size:.95rem">
              ${lang.name} — ${cat.emoji} Quiz
            </div>
            <div style="font-size:.78rem;color:#6b7280">
              Question ${state.idx + 1} / ${state.phrases.length} &nbsp;·&nbsp; ⭐ ${state.score} pts
            </div>
          </div>
        </div>

        <!-- Progress bar -->
        <div style="background:#e5e7eb;border-radius:99px;height:7px;margin-bottom:20px">
          <div style="background:${col};border-radius:99px;height:7px;
                      width:${pct}%;transition:width .35s"></div>
        </div>

        <!-- Question card -->
        <div style="background:#fff;border-radius:20px;box-shadow:0 6px 24px rgba(0,0,0,.1);
                    padding:24px 20px;text-align:center;margin-bottom:16px">
          <div style="font-size:.75rem;text-transform:uppercase;letter-spacing:.08em;
                      color:#9ca3af;font-weight:700;margin-bottom:10px">
            What is the ${lang.name} translation?
          </div>
          <div style="font-size:2rem;font-weight:900;color:#1a1a2e">🇬🇧 ${p.en}</div>
        </div>

        <!-- Answer options -->
        <div style="display:flex;flex-direction:column;gap:10px">
          ${opts.map((o, i) => `
            <button id="lang-ans-${i}"
              onclick="LanguageGame._answerQuiz(${i}, ${correctIdx})"
              style="display:flex;align-items:center;gap:14px;padding:15px 16px;
                     border-radius:14px;border:2px solid #e5e7eb;background:#fff;
                     cursor:pointer;text-align:left;font-family:'Nunito',sans-serif;
                     font-size:1rem;font-weight:700;color:#1a1a2e;
                     box-shadow:0 2px 8px rgba(0,0,0,.05);transition:all .18s;width:100%"
              onmouseover="this.style.borderColor='${col}';this.style.transform='translateX(4px)'"
              onmouseout="if(!this.disabled){this.style.borderColor='#e5e7eb';this.style.transform=''}">
              <span style="width:34px;height:34px;border-radius:50%;background:${col};
                           color:#fff;font-size:.88rem;font-weight:800;display:flex;
                           align-items:center;justify-content:center;flex-shrink:0">
                ${'ABCD'[i]}
              </span>
              <span style="flex:1;font-size:1.05rem">${o}</span>
            </button>`).join('')}
        </div>

        <div id="lang-feedback" style="display:none;margin-top:14px"></div>
      </div>`;
  }

  function _answerQuiz(chosen, correctIdx) {
    for (let i = 0; i < 4; i++) {
      const b = document.getElementById(`lang-ans-${i}`);
      if (b) { b.disabled = true; b.onmouseover = null; b.onmouseout = null; }
    }
    const correct = chosen === correctIdx;
    if (correct) { state.score++; window.SFX?.play('quiz_correct'); }
    else          { window.SFX?.play('quiz_wrong'); }

    const p    = state.phrases[state.idx];
    const lang = LANGUAGE_DATA[state.lang];
    const col  = LANG_COLORS[state.lang] || '#667eea';

    // Colour correct and wrong buttons inline
    const correctBtn = document.getElementById(`lang-ans-${correctIdx}`);
    if (correctBtn) {
      correctBtn.style.borderColor = '#22c55e';
      correctBtn.style.background  = '#f0fdf4';
    }
    if (!correct) {
      const wrongBtn = document.getElementById(`lang-ans-${chosen}`);
      if (wrongBtn) {
        wrongBtn.style.borderColor = '#ef4444';
        wrongBtn.style.background  = '#fff1f2';
      }
    }

    const fb = document.getElementById('lang-feedback');
    fb.style.display = '';
    fb.innerHTML = `
      <div style="padding:16px;border-radius:14px;
                  background:${correct ? '#f0fdf4' : '#fff1f2'};
                  border:2px solid ${correct ? '#bbf7d0' : '#fecdd3'}">
        <div style="font-weight:800;font-size:.97rem;margin-bottom:8px;color:#1a1a2e">
          ${correct ? '🎉 Correct!' : '❌ The answer was: <strong>' + p.target + '</strong>'}
        </div>
        <div style="font-size:.92rem;color:#374151">
          ${lang.flag} <strong style="font-size:1.1rem;color:${col}">${p.target}</strong>
          &nbsp; 🔊 <em>${p.phonetic}</em>
        </div>
      </div>
      <div style="text-align:center;margin-top:14px">
        <button onclick="LanguageGame._nextQuiz()"
          style="background:linear-gradient(135deg,${col},${col}cc);color:#fff;
                 border:none;border-radius:50px;padding:12px 28px;
                 font-family:'Nunito',sans-serif;font-size:1rem;font-weight:800;
                 cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.2)">
          ${state.idx + 1 < state.phrases.length ? 'Next →' : '🏆 See Results'}
        </button>
      </div>`;
  }

  function _nextQuiz() {
    window.SFX?.play('click');
    state.idx++;
    if (state.idx < state.phrases.length) {
      renderQuizQuestion();
    } else {
      endGame();
    }
  }

  /* ─────────────────────────────────────────────────────────────
     SCREEN 5 — Results
  ───────────────────────────────────────────────────────────── */
  async function endGame() {
    const elapsed  = Math.round((Date.now() - state.startTime) / 1000);
    const mm       = Math.floor(elapsed / 60), ss = String(elapsed % 60).padStart(2, '0');
    const timeStr  = `${mm}:${ss}`;
    const pct      = Math.round((state.score / state.phrases.length) * 100);
    const lang     = LANGUAGE_DATA[state.lang];
    const cat      = CATEGORIES.find(c => c.id === state.cat);
    const col      = LANG_COLORS[state.lang] || '#667eea';

    const grade = pct >= 90 ? '🏆 Language Star!' :
                  pct >= 70 ? '⭐ Brilliant!'       :
                  pct >= 50 ? '👍 Good effort!'     : '📚 Keep practising!';
    const msg   = pct >= 70 ? `You really know your ${lang.name}!` :
                  pct >= 50 ? 'Good effort — keep using the flashcards!' :
                              'Try the flashcards again then take the quiz!';

    window.SFX?.play(pct >= 70 ? 'win' : pct >= 50 ? 'draw' : 'lose');

    getContainer().innerHTML = `
      <div style="max-width:540px;margin:0 auto;padding:32px 20px 48px;text-align:center">

        <!-- Coloured banner -->
        <div style="background:${col};border-radius:20px 20px 0 0;padding:28px 20px;color:#fff">
          <div style="font-size:3.5rem;margin-bottom:8px">${lang.flag}</div>
          <div style="font-family:'Fredoka One',cursive;font-size:2rem;margin-bottom:4px">${grade}</div>
          <div style="font-size:.88rem;opacity:.9">${lang.name} — ${cat.emoji} ${cat.name}</div>
        </div>

        <!-- Score card -->
        <div style="background:#fff;border-radius:0 0 20px 20px;
                    box-shadow:0 8px 24px rgba(0,0,0,.12);padding:24px;margin-bottom:20px">
          <div style="font-family:'Fredoka One',cursive;font-size:3.5rem;color:${col}">
            ${state.score}<span style="font-size:1.6rem;color:#aaa"> / ${state.phrases.length}</span>
          </div>
          <div style="font-size:1.2rem;font-weight:800;color:#6b7280;margin-bottom:6px">
            ${pct}% correct
          </div>
          <div style="color:#6b7280;font-size:.9rem;margin-bottom:20px">${msg}</div>

          <!-- Stats -->
          <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
            ${[
              ['✅', state.score,                    'Correct'],
              ['❌', state.phrases.length - state.score, 'Missed'],
              ['⏱️', timeStr,                         'Time']
            ].map(([icon, val, lab]) => `
              <div style="background:#f9fafb;border-radius:12px;padding:12px 16px;min-width:80px">
                <div style="font-size:1.3rem">${icon}</div>
                <div style="font-size:1.3rem;font-weight:800;color:#1a1a2e">${val}</div>
                <div style="font-size:.72rem;color:#9ca3af;font-weight:600;text-transform:uppercase">
                  ${lab}
                </div>
              </div>`).join('')}
          </div>
        </div>

        <!-- Action buttons -->
        <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
          <button onclick="LanguageGame._selectCat('${state.cat}')"
            style="background:${col};color:#fff;border:none;border-radius:50px;
                   padding:12px 22px;font-family:'Nunito',sans-serif;font-size:.95rem;
                   font-weight:800;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.2)">
            🔄 Try Again
          </button>
          <button onclick="LanguageGame._selectLang('${state.lang}')"
            style="background:#4ecdc4;color:#fff;border:none;border-radius:50px;
                   padding:12px 22px;font-family:'Nunito',sans-serif;font-size:.95rem;
                   font-weight:800;cursor:pointer;box-shadow:0 4px 14px rgba(78,205,196,.4)">
            📂 New Category
          </button>
          <button onclick="LanguageGame.init()"
            style="background:#f3f4f6;color:#374151;border:none;border-radius:50px;
                   padding:12px 22px;font-family:'Nunito',sans-serif;font-size:.95rem;
                   font-weight:800;cursor:pointer">
            🌍 Change Language
          </button>
        </div>
      </div>`;

    await saveResult({
      gameType:  'language',
      outcome:   'quiz',
      language:  state.lang,
      category:  state.cat,
      level:     state.lang,
      score:     state.score,
      total:     state.phrases.length,
      percent:   pct,
      duration:  elapsed,
      timeStr
    });
  }

  /* ── Helpers ───────────────────────────────────────────────── */
  function getContainer() { return document.getElementById('lang-container'); }
  function hideLoading() {
    const ol = document.getElementById('loading-overlay');
    if (ol) ol.classList.add('hidden');
  }
  function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

  return { init, _selectLang, _selectCat, _revealFlash, _nextFlash, _answerQuiz, _nextQuiz };
})();

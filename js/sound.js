// ── Happy Games Sound System ─────────────────────────────────────
// All sounds are synthesised via the Web Audio API — no audio files
// are needed. The AudioContext is created lazily on the first play()
// call, which guarantees it always follows a user gesture (required
// by Chrome, Safari, and mobile browsers).
//
// Usage (in any game file):
//   window.SFX?.play('click')     — safe even if sound.js not loaded
//
// Sounds:
//   click           short piece-placement tap
//   opponent_move   softer tap when the opponent moves
//   win             ascending cheerful arpeggio
//   lose            descending sad tones
//   draw            neutral two-tone chord
//   error           dissonant buzz (invalid action)
//   join            doorbell "ding-dong" (player joined room)
//   disconnect      double alert beep (stale-opponent banner)
//   rematch         ascending two-tone jingle (new round)
//   quiz_correct    high happy ding
//   quiz_wrong      low buzz
//   quiz_timeout    descending timer-expire sweep

window.SFX = (() => {
  'use strict';

  let ctx   = null;    // AudioContext — created lazily on first play()
  let muted = localStorage.getItem('hg_muted') === '1';

  // Per-sound last-played timestamps for anti-spam throttling
  const _last = {};
  const _throttle = {
    click:         80,
    opponent_move: 80,
    error:         400,
    disconnect:    6000,   // don't repeat the alert sound too often
    _default:      50
  };

  // ── AudioContext initialisation ───────────────────────────────
  function _init() {
    if (ctx) return;
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('SFX: Web Audio API unavailable');
    }
  }

  // ── Primitive: schedule one tone ─────────────────────────────
  // freq  – Hz; type – oscillator waveform; when – ctx time;
  // dur   – duration in seconds; vol – peak gain (0–1)
  function _tone(freq, type, when, dur, vol = 0.24) {
    if (!ctx) return;
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, when);
    gain.gain.setValueAtTime(vol, when);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    osc.start(when);
    osc.stop(when + dur + 0.02);
  }

  // ── Sound catalogue ───────────────────────────────────────────
  const _sounds = {

    // Short crisp tap — piece placed / chess move made
    click() {
      const t = ctx.currentTime;
      _tone(520, 'sine', t, 0.06, 0.20);
    },

    // Softer, lower tap — opponent's move
    opponent_move() {
      const t = ctx.currentTime;
      _tone(340, 'sine', t, 0.07, 0.14);
    },

    // Cheerful ascending arpeggio: C5 E5 G5 C6
    win() {
      const t = ctx.currentTime;
      [523, 659, 784, 1047].forEach((f, i) =>
        _tone(f, 'sine', t + i * 0.11, 0.20, 0.28));
    },

    // Sad descending: G4 E4 C4
    lose() {
      const t = ctx.currentTime;
      [392, 330, 262].forEach((f, i) =>
        _tone(f, 'triangle', t + i * 0.14, 0.22, 0.22));
    },

    // Neutral unresolved two-note chord
    draw() {
      const t = ctx.currentTime;
      _tone(440, 'sine', t,        0.18, 0.20);
      _tone(554, 'sine', t + 0.14, 0.14, 0.20);
    },

    // Dissonant buzz — invalid action
    error() {
      const t = ctx.currentTime;
      _tone(100, 'sawtooth', t, 0.14, 0.22);
      _tone(108, 'sawtooth', t, 0.14, 0.22);
    },

    // Doorbell "ding-dong" — opponent joined the room
    join() {
      const t = ctx.currentTime;
      _tone(880, 'sine', t,        0.28, 0.28);
      _tone(660, 'sine', t + 0.34, 0.32, 0.28);
    },

    // Double alert beep — stale / disconnect warning banner
    disconnect() {
      const t = ctx.currentTime;
      [800, 800].forEach((f, i) =>
        _tone(f, 'square', t + i * 0.24, 0.10, 0.18));
    },

    // Ready jingle — rematch is starting
    rematch() {
      const t = ctx.currentTime;
      _tone(660, 'sine', t,        0.12, 0.24);
      _tone(880, 'sine', t + 0.16, 0.16, 0.24);
    },

    // High happy ding — quiz correct answer
    quiz_correct() {
      const t = ctx.currentTime;
      _tone(880,  'sine', t,        0.09, 0.28);
      _tone(1109, 'sine', t + 0.09, 0.14, 0.28);
    },

    // Low buzz — quiz wrong answer
    quiz_wrong() {
      const t = ctx.currentTime;
      _tone(180, 'sawtooth', t, 0.20, 0.24);
    },

    // Descending sweep — timer expired
    quiz_timeout() {
      const t = ctx.currentTime;
      [500, 380, 260].forEach((f, i) =>
        _tone(f, 'triangle', t + i * 0.09, 0.10, 0.20));
    }
  };

  // ── Public: play a named sound ────────────────────────────────
  // Safe to call from onSnapshot flows — if the AudioContext hasn't
  // been initialised yet (no user gesture), the call is silently
  // skipped. After the user's first click, all subsequent sounds
  // (including multiplayer opponent-move events) will work.
  function play(name) {
    if (muted || !_sounds[name]) return;

    // Lazy init — succeeds only after a user gesture
    try { _init(); } catch (e) { return; }
    if (!ctx) return;

    // Some browsers suspend the context after inactivity
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});

    // Throttle: same sound can't play again within N ms
    const gap = _throttle[name] ?? _throttle._default;
    const now = Date.now();
    if (_last[name] && now - _last[name] < gap) return;
    _last[name] = now;

    try { _sounds[name](); } catch (e) { /* silently ignore */ }
  }

  // ── Public: toggle mute ───────────────────────────────────────
  function toggle() {
    muted = !muted;
    localStorage.setItem('hg_muted', muted ? '1' : '0');
    _updateBtn();
  }

  function isMuted() { return muted; }

  // ── Mute button — injected into the navbar automatically ──────
  // Appended to .nav-links so it shows on every page that loads
  // sound.js. The button is inserted once and persists across nav
  // re-renders because it's appended to the static HTML container.
  function _insertBtn() {
    if (document.getElementById('sfx-toggle')) return; // already present
    const nav = document.querySelector('.nav-links');
    if (!nav) return;
    const btn = document.createElement('button');
    btn.id        = 'sfx-toggle';
    btn.className = 'btn btn-outline';
    btn.title     = 'Toggle sound on/off';
    btn.style.cssText = 'font-size:.9rem;padding:6px 13px;min-width:42px';
    btn.onclick   = toggle;
    nav.appendChild(btn);
    _updateBtn();
  }

  function _updateBtn() {
    const btn = document.getElementById('sfx-toggle');
    if (btn) btn.textContent = muted ? '🔇' : '🔊';
  }

  // Scripts are at end of <body> — DOM is ready immediately.
  // Use a zero-delay timeout so nav.js auth callbacks (which may
  // inject login/logout buttons) have finished first.
  setTimeout(_insertBtn, 0);

  return { play, toggle, isMuted };
})();

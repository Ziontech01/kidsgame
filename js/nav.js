// ── Shared navigation & auth-guard helpers ──────────────────
// Include this on every page (after firebase-config.js)

let HG = { user: null, profile: null };  // global app state

function logout() { auth.signOut().then(() => window.location.href = rootPath() + 'index.html'); }

function rootPath() {
  // Returns relative path back to root based on current page depth
  const depth = (window.location.pathname.match(/\//g) || []).length;
  if (window.location.pathname.includes('/pages/')) return '../';
  return '';
}

function updateNavUI(user, profile) {
  const userEl = document.getElementById('nav-username');
  const loginBtn = document.getElementById('nav-login-btn');
  const logoutBtn = document.getElementById('nav-logout-btn');
  if (!userEl) return;
  if (user) {
    userEl.textContent  = '👤 ' + (profile?.name || user.displayName || 'Player');
    userEl.style.display = 'inline-flex';
    if (loginBtn) loginBtn.style.display  = 'none';
    if (logoutBtn) logoutBtn.style.display = 'inline-flex';
  } else {
    userEl.style.display = 'none';
    if (loginBtn) loginBtn.style.display  = 'inline-flex';
    if (logoutBtn) logoutBtn.style.display = 'none';
  }
}

// requireAuth: call on protected pages — redirects to login if no user
function requireAuth(callback) {
  auth.onAuthStateChanged(async user => {
    const overlay = document.getElementById('loading-overlay');
    if (!user) {
      window.location.href = rootPath() + 'login.html?next=' + encodeURIComponent(window.location.href);
      return;
    }
    try {
      const doc = await db.collection('users').doc(user.uid).get();
      HG.profile = doc.exists ? doc.data() : { name: user.displayName, username: '' };
    } catch { HG.profile = { name: user.displayName || 'Player', username: '' }; }
    HG.user = user;
    updateNavUI(user, HG.profile);
    if (overlay) overlay.classList.add('hidden');
    if (callback) callback(user, HG.profile);
  });
}

// softAuth: call on public pages — shows nav user if logged in but doesn't redirect
function softAuth(callback) {
  auth.onAuthStateChanged(async user => {
    const overlay = document.getElementById('loading-overlay');
    if (user) {
      try {
        const doc = await db.collection('users').doc(user.uid).get();
        HG.profile = doc.exists ? doc.data() : { name: user.displayName, username: '' };
      } catch { HG.profile = { name: user.displayName || 'Player', username: '' }; }
      HG.user = user;
    }
    updateNavUI(user, HG.profile);
    if (overlay) overlay.classList.add('hidden');
    if (callback) callback(user, HG.profile);
  });
}

// ── Auth Modal (shown when guest clicks a locked game) ───────
function showAuthModal(gameName) {
  const modal = document.getElementById('auth-modal');
  const msg   = document.getElementById('auth-modal-msg');
  if (msg) msg.textContent = `Sign in to play ${gameName}! It's free and fun. 🎉`;
  if (modal) modal.classList.add('show');
}
function closeAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (modal) modal.classList.remove('show');
}
function goToLogin() { window.location.href = rootPath() + 'login.html'; }

// ── Save game result to Firestore ────────────────────────────
async function saveResult(data) {
  if (!HG.user) return;
  try {
    await db.collection('results').add({
      uid:       HG.user.uid,
      username:  HG.profile?.username || '',
      name:      HG.profile?.name || HG.user.displayName || 'Player',
      ...data,
      date: firebase.firestore.FieldValue.serverTimestamp()
    });
  } catch (e) { console.error('saveResult:', e); }
}

// ── Save / get user level ────────────────────────────────────
async function saveUserLevel(level) {
  localStorage.setItem('hg_level', level);
  if (!HG.user) return;
  try { await db.collection('users').doc(HG.user.uid).update({ level }); } catch {}
}

function getUserLevel() {
  return HG.profile?.level || localStorage.getItem('hg_level') || 'year1';
}

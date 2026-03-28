// ── Auth helpers — loaded only by login.html ─────────────────

// ── UI helpers ───────────────────────────────────────────────
function hideLoading() {
  // Hide the loading overlay
  const overlay   = document.getElementById('loading-overlay');
  if (overlay) overlay.classList.add('hidden');
  // Show the auth form container (only present on login.html)
  const container = document.getElementById('auth-container');
  if (container) container.style.display = 'block';
}

function setBtn(id, loading, label) {
  const btn = document.getElementById(id);
  if (!btn) return;
  btn.disabled    = loading;
  btn.textContent = loading ? '⏳ Please wait…' : label;
}

function showAlert(id, text, type) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = text;
  el.className   = `alert alert-${type} show`;
}
function clearAlert(id) {
  const el = document.getElementById(id);
  if (el) { el.className = 'alert'; el.textContent = ''; }
}
function clearErrors() {
  document.querySelectorAll('.form-error').forEach(e => { e.classList.remove('show'); e.textContent = ''; });
  document.querySelectorAll('.form-input').forEach(e => e.classList.remove('error'));
}
function fieldErr(id, msg) {
  const err = document.getElementById(id + '-error');
  const inp = document.getElementById(id);
  if (err) { err.textContent = msg; err.classList.add('show'); }
  if (inp) inp.classList.add('error');
}

// ── Auth state ────────────────────────────────────────────────
// If already logged in → go to intended destination or home
// If not logged in   → reveal the login form
auth.onAuthStateChanged(user => {
  if (user) {
    // Support ?next= parameter so protected pages redirect back correctly
    try {
      const params  = new URLSearchParams(window.location.search);
      const nextRaw = params.get('next');
      if (nextRaw) {
        const nextUrl = new URL(nextRaw, window.location.href);
        // Only redirect to same origin — blocks open-redirect attacks
        if (nextUrl.origin === window.location.origin) {
          window.location.href = nextUrl.href;
          return;
        }
      }
    } catch (_) { /* malformed URL — fall through to default */ }
    window.location.href = 'index.html';
  } else {
    hideLoading(); // shows the form
  }
});

// ── Logout (safe fallback — nav.js provides the main version) ─
function logout() {
  auth.signOut().then(() => window.location.href = 'index.html');
}

// ── Tab switching ─────────────────────────────────────────────
function switchTab(tab) {
  clearErrors();
  clearAlert('auth-alert');
  document.getElementById('login-form').style.display  = tab === 'login'  ? 'block' : 'none';
  document.getElementById('signup-form').style.display = tab === 'signup' ? 'block' : 'none';
  document.getElementById('tab-login').classList.toggle('active',  tab === 'login');
  document.getElementById('tab-signup').classList.toggle('active', tab === 'signup');
}

// ── Login ─────────────────────────────────────────────────────
async function handleLogin(e) {
  e.preventDefault();
  clearErrors(); clearAlert('auth-alert');
  const username = document.getElementById('login-username').value.trim().toLowerCase();
  const password = document.getElementById('login-password').value;
  if (!username) { fieldErr('login-username', 'Please enter your username.'); return; }
  if (!password) { fieldErr('login-password', 'Please enter your password.'); return; }

  setBtn('login-btn', true, '🚀 Let\'s Play!');
  try {
    await auth.signInWithEmailAndPassword(`${username}@happygames.app`, password);
    // onAuthStateChanged above handles the redirect
  } catch (err) {
    setBtn('login-btn', false, '🚀 Let\'s Play!');
    const notFound = ['auth/user-not-found', 'auth/invalid-credential', 'auth/invalid-email'];
    if (notFound.includes(err.code))
      fieldErr('login-username', 'Username not found. Did you sign up?');
    else if (err.code === 'auth/wrong-password')
      fieldErr('login-password', 'Wrong password. Try again!');
    else
      showAlert('auth-alert', 'Something went wrong. Please try again!', 'error');
  }
}

// ── Sign Up ───────────────────────────────────────────────────
async function handleSignup(e) {
  e.preventDefault();
  clearErrors(); clearAlert('auth-alert');
  const name     = document.getElementById('signup-name').value.trim();
  const username = document.getElementById('signup-username').value.trim().toLowerCase();
  const password = document.getElementById('signup-password').value;
  const confirm  = document.getElementById('signup-confirm').value;
  let ok = true;
  if (!name)                               { fieldErr('signup-name',     'Please enter your name.');                   ok = false; }
  if (!username)                           { fieldErr('signup-username', 'Please choose a username.');                 ok = false; }
  else if (username.length < 3)            { fieldErr('signup-username', 'At least 3 characters.');                   ok = false; }
  else if (!/^[a-z0-9_]+$/.test(username)) { fieldErr('signup-username', 'Letters, numbers and underscores only.');   ok = false; }
  if (!password)                           { fieldErr('signup-password', 'Please create a password.');                ok = false; }
  else if (password.length < 6)            { fieldErr('signup-password', 'At least 6 characters.');                   ok = false; }
  if (confirm !== password)                { fieldErr('signup-confirm',  'Passwords do not match!');                  ok = false; }
  if (!ok) return;

  setBtn('signup-btn', true, '🎉 Create Account!');
  try {
    // Check username availability first
    const taken = await db.collection('usernames').doc(username).get();
    if (taken.exists) {
      fieldErr('signup-username', 'That username is already taken!');
      setBtn('signup-btn', false, '🎉 Create Account!');
      return;
    }
    const cred = await auth.createUserWithEmailAndPassword(`${username}@happygames.app`, password);
    await cred.user.updateProfile({ displayName: name });
    const batch = db.batch();
    batch.set(db.collection('users').doc(cred.user.uid), {
      username, name, level: 'year1',
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    batch.set(db.collection('usernames').doc(username), { uid: cred.user.uid });
    await batch.commit();
    // onAuthStateChanged above handles the redirect
  } catch (err) {
    setBtn('signup-btn', false, '🎉 Create Account!');
    if (err.code === 'auth/email-already-in-use')
      fieldErr('signup-username', 'That username is already taken!');
    else
      showAlert('auth-alert', err.message, 'error');
  }
}

// =======================================================
//  🔥 PASTE YOUR FIREBASE CONFIG HERE
//  1. Go to https://console.firebase.google.com
//  2. Create project → Add Web App → Copy config below
//  3. Enable Authentication → Email/Password
//  4. Create Firestore Database → Start in TEST MODE
// =======================================================
const firebaseConfig = {
  apiKey: "AIzaSyCO5tLK42bECDTpedE0VK6R0TPipBOH-Nw",
  authDomain: "happygames-57232.firebaseapp.com",
  projectId: "happygames-57232",
  storageBucket: "happygames-57232.firebasestorage.app",
  messagingSenderId: "925431954830",
  appId: "1:925431954830:web:442c58fd561640f63bb8df"
};

if (firebaseConfig.apiKey === "YOUR_API_KEY") {
  document.body.innerHTML = `
    <div style="min-height:100vh;background:linear-gradient(135deg,#667eea,#764ba2);
      display:flex;align-items:center;justify-content:center;font-family:sans-serif;padding:20px;">
      <div style="background:#fff;border-radius:24px;padding:40px;max-width:500px;
        width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.2);">
        <div style="font-size:3rem;margin-bottom:12px;">🔥</div>
        <h2 style="font-size:1.5rem;margin-bottom:12px;color:#1A1A2E;">Firebase Setup Needed</h2>
        <p style="color:#666;line-height:1.7;margin-bottom:20px;">
          Open <strong>js/firebase-config.js</strong> and replace the placeholder values
          with your Firebase project config.<br><br>
          <strong>Quick steps:</strong><br>
          1. <a href="https://console.firebase.google.com" target="_blank" style="color:#667eea;">
            console.firebase.google.com</a><br>
          2. Create project → Add Web App<br>
          3. Enable Authentication → Email/Password<br>
          4. Create Firestore Database (Test Mode)<br>
          5. Paste config into js/firebase-config.js
        </p>
        <a href="https://console.firebase.google.com" target="_blank"
          style="display:inline-block;background:linear-gradient(135deg,#667eea,#764ba2);
          color:#fff;padding:12px 28px;border-radius:50px;text-decoration:none;font-weight:800;">
          Open Firebase Console →
        </a>
      </div>
    </div>`;
  throw new Error("Firebase not configured.");
}

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db   = firebase.firestore();

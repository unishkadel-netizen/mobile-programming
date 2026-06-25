/* ─────────────────────────────────────
   GymApp — script.js  (Firebase Realtime Database integrated)
   DB: https://mobile-6e51c-default-rtdb.firebaseio.com/
   ───────────────────────────────────── */

/* ── Firebase Config ── */
const FIREBASE_URL = 'https://mobile-6e51c-default-rtdb.firebaseio.com';

/* Helper: GET from Firebase */
async function fbGet(path) {
  const res = await fetch(`${FIREBASE_URL}/${path}.json`);
  if (!res.ok) throw new Error(`Firebase GET failed: ${res.status}`);
  return res.json();
}

/* Helper: PUT to Firebase (overwrites) */
async function fbPut(path, data) {
  const res = await fetch(`${FIREBASE_URL}/${path}.json`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Firebase PUT failed: ${res.status}`);
  return res.json();
}

/* Helper: POST to Firebase (push / auto-key) */
async function fbPost(path, data) {
  const res = await fetch(`${FIREBASE_URL}/${path}.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Firebase POST failed: ${res.status}`);
  return res.json();
}

/* ─────────────────────────────────────
   MEMBERSHIP STATE
   Stored at: /membership
   ───────────────────────────────────── */
const MEMBERSHIP_FULL_TERM = 90;
const membership = { daysLeft: 55 }; // local cache; synced with Firebase

/* Load membership from Firebase; fall back to default if absent */
async function loadMembership() {
  try {
    const data = await fbGet('membership');
    if (data && typeof data.daysLeft === 'number') {
      membership.daysLeft = data.daysLeft;
    } else {
      // First run — seed the database with defaults
      await fbPut('membership', { daysLeft: membership.daysLeft });
    }
  } catch (err) {
    console.warn('Could not load membership from Firebase:', err);
  }
  updateMembershipDisplay();
}

/* Save membership to Firebase */
async function saveMembership() {
  try {
    await fbPut('membership', { daysLeft: membership.daysLeft });
  } catch (err) {
    console.warn('Could not save membership to Firebase:', err);
  }
}

/* ─────────────────────────────────────
   MEMBERS DATA
   Stored at: /members  (array-like object keyed by push-ID or index)
   ───────────────────────────────────── */

/* Default seed data */
const DEFAULT_MEMBERS = [
  { initials: 'UK', name: 'Unish Kadel',     tag: 'Gym • Zumba • Active',    status: 'Active',   color: '#2ecc71' },
  { initials: 'RK', name: 'Rushal Karki',    tag: 'Aerobic • 12 days left',  status: 'Expiring', color: '#3498db' },
  { initials: 'AS', name: 'Aayush Subedi',   tag: 'Gym • Active',            status: 'Active',   color: '#2ecc71' },
  { initials: 'EY', name: 'Eren Yeger',      tag: 'All packages • Active',   status: 'Active',   color: '#2ecc71' },
  { initials: 'NS', name: 'Nitesh Shrestha', tag: 'Expired • Renew',         status: 'Expired',  color: '#e74c3c' },
];

let members = [...DEFAULT_MEMBERS]; // local cache

/* Load members from Firebase */
async function loadMembers() {
  try {
    const data = await fbGet('members');
    if (data) {
      // Firebase returns an object when using .push(); convert to array
      members = Array.isArray(data) ? data : Object.values(data);
    } else {
      // First run — seed the database
      await fbPut('members', DEFAULT_MEMBERS);
    }
  } catch (err) {
    console.warn('Could not load members from Firebase:', err);
  }
  renderMembers(members);
}

/* ─────────────────────────────────────
   SCAN / ACCESS LOG
   Stored at: /scanLogs  (push-keyed records)
   Each record: { user, timestamp, result }
   ───────────────────────────────────── */
async function logScanAccess(result) {
  try {
    await fbPost('scanLogs', {
      user: 'Unish Kadel',
      timestamp: new Date().toISOString(),
      result: result, // 'granted' | 'denied'
    });
  } catch (err) {
    console.warn('Could not log scan to Firebase:', err);
  }
}

/* ─────────────────────────────────────
   NAVIGATION
   ───────────────────────────────────── */
function go(screenName) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + screenName).classList.add('active');

  if (screenName !== 'members') {
    const searchInput = document.getElementById('member-search');
    if (searchInput) searchInput.value = '';
    renderMembers(members);
  }

  if (screenName !== 'scan') {
    resetScanner();
  }
}

/* ─────────────────────────────────────
   PASSWORD EYE TOGGLE
   ───────────────────────────────────── */
function toggleEye() {
  const inp  = document.getElementById('si-password');
  const icon = document.getElementById('eye-icon');
  if (inp.type === 'password') {
    inp.type = 'text';
    icon.classList.remove('fa-eye');
    icon.classList.add('fa-eye-slash');
  } else {
    inp.type = 'password';
    icon.classList.remove('fa-eye-slash');
    icon.classList.add('fa-eye');
  }
}

/* ─────────────────────────────────────
   CHECKBOX TOGGLE
   ───────────────────────────────────── */
function toggleCheck(row) {
  row.querySelector('.checkbox').classList.toggle('checked');
}

/* ─────────────────────────────────────
   MEMBERSHIP DISPLAY & RENEWAL
   ───────────────────────────────────── */
const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function updateMembershipDisplay() {
  const homeDays = document.getElementById('home-days-left');
  if (homeDays) homeDays.textContent = `${membership.daysLeft} Days Left`;

  const profileExpires = document.getElementById('profile-expires');
  if (profileExpires) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + membership.daysLeft);
    const day   = expiryDate.getDate();
    const month = monthNames[expiryDate.getMonth()];
    const year  = expiryDate.getFullYear();
    profileExpires.innerHTML = `${day} ${month} ${year} &bull; ${membership.daysLeft} days left`;
  }

  const progressFill = document.getElementById('home-progress-fill');
  if (progressFill) {
    const pct = Math.max(0, Math.min(100, (membership.daysLeft / MEMBERSHIP_FULL_TERM) * 100));
    progressFill.style.width = pct + '%';
  }
}

async function renewMembership() {
  membership.daysLeft = MEMBERSHIP_FULL_TERM;
  updateMembershipDisplay();
  await saveMembership(); // ← persist to Firebase

  const btn = document.querySelector('#screen-profile .btn-green');
  if (btn) {
    const original = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-check" style="margin-right:8px"></i>Renewed! 90 days left';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = original;
      btn.disabled = false;
      go('home');
    }, 1200);
  } else {
    go('home');
  }
}

/* ─────────────────────────────────────
   MEMBERS RENDER & FILTER
   ───────────────────────────────────── */
function renderMembers(list) {
  const el = document.getElementById('member-list');
  if (!el) return;
  el.innerHTML = list.map(m => `
    <div class="member-row" onclick="go('profile')">
      <div class="avatar" style="background:${m.color}">
        <span>${m.initials}</span>
      </div>
      <div class="member-info">
        <p class="member-name">${m.name}</p>
        <p class="member-tag">${m.tag}</p>
      </div>
      <span class="badge badge-${m.status}">${m.status}</span>
    </div>
  `).join('');
}

function filterMembers(q) {
  renderMembers(members.filter(m =>
    m.name.toLowerCase().includes(q.toLowerCase())
  ));
}

/* ─────────────────────────────────────
   SCHEDULE WEEK DAYS
   ───────────────────────────────────── */
const weekLetters = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const dateNames   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
let activeDay = 3; // start on Wednesday

function buildWeek() {
  const el = document.getElementById('week-days');
  if (!el) return;
  el.innerHTML = weekLetters.map((d, i) => `
    <button class="sched-day ${i === activeDay ? 'active' : ''}" onclick="selectDay(${i})">${d}</button>
  `).join('');
}

function selectDay(i) {
  activeDay = i;
  const now    = new Date();
  const diff   = i - now.getDay();
  const target = new Date(now);
  target.setDate(now.getDate() + diff);
  const label = document.getElementById('date-label');
  if (label) {
    label.textContent = `${dateNames[i]}, ${target.getDate()} ${monthNames[target.getMonth()]}`;
  }
  buildWeek();
}

/* ─────────────────────────────────────
   QR SCAN / DOOR UNLOCK SIMULATION
   Logs each scan result to Firebase at /scanLogs
   ───────────────────────────────────── */
let scanTimeoutId = null;

function resetScanner() {
  if (scanTimeoutId) {
    clearTimeout(scanTimeoutId);
    scanTimeoutId = null;
  }
  const viewport = document.getElementById('scanner-viewport');
  const status   = document.getElementById('scan-status');
  const btn      = document.getElementById('scan-btn');
  if (viewport) viewport.classList.remove('scanning', 'success');
  if (status)   status.textContent = 'Tap below to start scanning';
  if (btn) {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-qrcode" style="margin-right:8px"></i>Scan QR Code';
  }
}

function startScan() {
  const viewport = document.getElementById('scanner-viewport');
  const status   = document.getElementById('scan-status');
  const btn      = document.getElementById('scan-btn');
  if (!viewport || !status || !btn) return;

  if (viewport.classList.contains('scanning') || viewport.classList.contains('success')) return;

  viewport.classList.remove('success');
  viewport.classList.add('scanning');
  status.textContent = 'Scanning QR code…';
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin" style="margin-right:8px"></i>Scanning…';

  scanTimeoutId = setTimeout(async () => {
    viewport.classList.remove('scanning');
    viewport.classList.add('success');
    status.textContent = 'Access granted';
    btn.innerHTML = '<i class="fa-solid fa-qrcode" style="margin-right:8px"></i>Scan Again';
    btn.disabled = false;

    // ← Log this access event to Firebase
    await logScanAccess('granted');
  }, 2000);
}

/* ─────────────────────────────────────
   INIT ON DOM READY
   ───────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  buildWeek();
  loadMembership(); // fetches from Firebase, then calls updateMembershipDisplay()
  loadMembers();    // fetches from Firebase, then calls renderMembers()
});
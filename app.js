/* ===== Tudelü AI Operations Portal — app.js ===== */

// Employee roster — validated emails
const EMPLOYEES = {
  'patrick.may@tudelu.com':    { name: 'Patrick May',       role: 'Sales — Texas' },
  'shlomo.h@tudelu.com':       { name: 'Shlomo Horowitz',   role: 'Sales' },
  'jadalyn.gaines@tudelu.com': { name: 'Jadalyn Gaines',    role: 'Distributor Sales' },
  'ben@tudelu.com':            { name: 'Ben Bixenspan',     role: 'Sales' },
  'abe@tudelu.com':            { name: 'Abe Straus',        role: 'Sales' },
  'yehuda@tudelu.com':         { name: 'Yehuda Kahan',      role: 'Sales' },
  'stephanie@tudelu.com':      { name: 'Stephanie Acosta',  role: 'Sales' },
  'jessica@tudelu.com':        { name: 'Jessica Rigolosi',  role: 'Sales / Bids' },
  'mendy@tudelu.com':          { name: 'Mendy Rubinstein',  role: 'COO' },
  'angel.almonte@tudelu.com':  { name: 'Angel Almonte',     role: 'CRM Developer' },
  'angelrepublic24@gmail.com': { name: 'Angel Almonte',     role: 'CRM Developer' },
  'tyler.k@tudelu.com':        { name: 'Tyler K',           role: 'Structural Engineer' },
  'viviana.perez@tudelu.com':  { name: 'Viviana Perez',     role: 'Project Management' },
  'moshy.f@tudelu.com':        { name: 'Moshy',             role: 'Engineering / Design' },
  'jimmy@tudelu.com':          { name: 'Jimmy',             role: 'Manufacturing' },
  'flora@tudelu.com':          { name: 'Flora',             role: 'Sourcing — China' },
  'marivic@tudelu.com':        { name: 'Marivic',           role: 'Admin' },
  'accounting@tudelu.com':     { name: 'Marivic',           role: 'Admin / Accounting' },
  'sruly.kahan@tudelu.com':    { name: 'Sruly Kahan',       role: 'Accounting' },
  'pessy@tudelu.com':          { name: 'Pessy',             role: 'Admin' },
  'shreya.singh@tudelu.com':   { name: 'Shreya Singh',      role: 'Content' },
  'chaim.fischer@tudelu.com':  { name: 'Chaim Fischer',     role: 'Founder' },
};

// ---- State ----
let currentUser = null;

// ---- Init ----
(function init() {
  const saved = localStorage.getItem('tudelu_user');
  if (saved) {
    try {
      currentUser = JSON.parse(saved);
      showDashboard();
    } catch (e) {
      localStorage.removeItem('tudelu_user');
    }
  }
})();

// ---- Login ----
function handleLogin(e) {
  e.preventDefault();
  const emailInput = document.getElementById('login-email');
  const errorEl = document.getElementById('login-error');
  const email = emailInput.value.trim().toLowerCase();

  // Allow any @tudelu.com or known emails
  const employee = EMPLOYEES[email];
  const isTudeluDomain = email.endsWith('@tudelu.com');

  if (!employee && !isTudeluDomain) {
    emailInput.classList.add('login-card__input--error');
    errorEl.classList.add('visible');
    errorEl.textContent = 'Please use your @tudelu.com email address.';
    return false;
  }

  currentUser = {
    email: email,
    name: employee ? employee.name : email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    role: employee ? employee.role : 'Team Member',
  };

  localStorage.setItem('tudelu_user', JSON.stringify(currentUser));
  showDashboard();
  return false;
}

function showDashboard() {
  document.getElementById('landing').style.display = 'none';
  document.getElementById('dashboard').classList.add('active');

  document.getElementById('welcome-name').textContent = 'Welcome, ' + currentUser.name.split(' ')[0];
  document.getElementById('welcome-email').textContent = currentUser.email + ' · ' + currentUser.role;

  document.getElementById('info-name').value = currentUser.name;
  document.getElementById('info-email').value = currentUser.email;
  document.getElementById('info-role').value = currentUser.role;

  // Load saved preferences
  const prefs = JSON.parse(localStorage.getItem('tudelu_prefs_' + currentUser.email) || '{}');
  if (prefs.preferredName) {
    document.getElementById('info-preferred-name').value = prefs.preferredName;
  }

  // Load saved feedback history
  loadFeedbackHistory();

  window.scrollTo(0, 0);
}

function handleSignOut() {
  currentUser = null;
  localStorage.removeItem('tudelu_user');
  document.getElementById('landing').style.display = '';
  document.getElementById('dashboard').classList.remove('active');
  document.getElementById('login-email').value = '';
  window.scrollTo(0, 0);
}

// ---- Preferences ----
function savePreferences() {
  if (!currentUser) return;
  const preferredName = document.getElementById('info-preferred-name').value.trim();
  const prefs = { preferredName };
  localStorage.setItem('tudelu_prefs_' + currentUser.email, JSON.stringify(prefs));

  const confirm = document.getElementById('save-confirm');
  confirm.classList.add('visible');
  setTimeout(() => confirm.classList.remove('visible'), 3000);
}

// ---- Feedback ----
function submitFeedback() {
  const textarea = document.getElementById('feedback-text');
  const text = textarea.value.trim();
  if (!text) {
    textarea.focus();
    return;
  }

  // Store feedback locally
  const key = 'tudelu_feedback';
  const existing = JSON.parse(localStorage.getItem(key) || '[]');
  existing.push({
    user: currentUser ? currentUser.email : 'anonymous',
    name: currentUser ? currentUser.name : 'Unknown',
    text: text,
    timestamp: new Date().toISOString(),
  });
  localStorage.setItem(key, JSON.stringify(existing));

  // Show confirmation
  const confirm = document.getElementById('feedback-confirm');
  confirm.classList.add('visible');
  textarea.value = '';
  setTimeout(() => confirm.classList.remove('visible'), 5000);

  // Refresh history
  loadFeedbackHistory();
}

function loadFeedbackHistory() {
  // This is a static site — feedback is stored in localStorage per browser
  // In v2, this will sync to the backend
}

// ---- Fade-in on scroll ----
(function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.fade-in').forEach(el => {
    el.style.animationPlayState = 'paused';
    observer.observe(el);
  });
})();

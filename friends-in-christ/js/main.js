// Contact form goes to the hogwild-forms Cloudflare Worker (c:/Programming/hogwild-forms).
const FORMS_ENDPOINT = 'https://hogwild-forms.bandicoot3111.workers.dev';

// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// --- Live-now indicator -----------------------------------------------
// Recurring confirmed livestream: "Motivation Monday" on Facebook,
// Mondays 8:00-8:30 AM Central Time with Pastor Emil Woerner.
// Shown here so visitors know at a glance whether it's on right now.
function getCentralParts() {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago',
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false
  });
  const parts = fmt.formatToParts(new Date());
  const map = {};
  parts.forEach(p => { map[p.type] = p.value; });
  return { weekday: map.weekday, hour: Number(map.hour), minute: Number(map.minute) };
}

function isMotivationMondayLive() {
  const { weekday, hour, minute } = getCentralParts();
  if (weekday !== 'Mon') return false;
  const minutesNow = hour * 60 + minute;
  return minutesNow >= 8 * 60 && minutesNow < 8 * 60 + 30; // 8:00-8:30 AM CT
}

function updateLiveBadge() {
  const badge = document.getElementById('live-badge');
  const label = document.getElementById('live-badge-label');
  const sub = document.getElementById('live-badge-sub');
  if (!badge) return;

  if (isMotivationMondayLive()) {
    badge.classList.add('is-live');
    label.textContent = 'LIVE NOW — Motivation Monday';
    sub.textContent = 'Pastor Emil is live on Facebook right now. Tap "Watch on Facebook" to join in.';
  } else {
    badge.classList.remove('is-live');
    label.textContent = 'Not live right now';
    sub.textContent = 'Next scheduled livestream: Motivation Monday at 8:00 AM (Central) on our Facebook page.';
  }
}
updateLiveBadge();
setInterval(updateLiveBadge, 30000);

// --- Contact form -------------------------------------------------------
const form = document.getElementById('contact-form');
if (form) {
  const statusBox = document.getElementById('form-status');
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    statusBox.className = 'form-status';

    try {
      const res = await fetch(FORMS_ENDPOINT + '/fic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();

      statusBox.textContent = result.message || (result.success ? 'Message sent!' : 'Something went wrong.');
      statusBox.classList.add('show', result.success ? 'ok' : 'err');

      if (result.success) form.reset();
    } catch (err) {
      statusBox.textContent = 'Network error — please try again or call the church office.';
      statusBox.classList.add('show', 'err');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }
  });
}

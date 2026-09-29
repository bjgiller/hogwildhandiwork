// Order requests go to the hogwild-forms Cloudflare Worker (c:/Programming/hogwild-forms).
const FORMS_ENDPOINT = 'https://hogwild-forms.WORKERS_SUBDOMAIN.workers.dev';

// =============================================
// NAVIGATION
// =============================================

const navHeader  = document.getElementById('nav-header');
const navToggle  = document.getElementById('nav-toggle');
const navLinks   = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
  navHeader.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

function closeMenu() {
  navLinks.classList.remove('open');
  navToggle.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

// Close mobile menu on outside click
document.addEventListener('click', e => {
  if (navLinks.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      !navToggle.contains(e.target)) {
    closeMenu();
  }
});

// =============================================
// CAROUSELS — fetch image lists, build slideshows
// =============================================

async function initCarousels() {
  let imageMap = {};
  try {
    const res = await fetch('/images/manifest.json');
    imageMap = await res.json();
  } catch {
    return;
  }

  document.querySelectorAll('.product-carousel').forEach(carousel => {
    const product = carousel.dataset.product;
    const images  = imageMap[product] || [];
    if (images.length === 0) return;

    const track       = carousel.querySelector('.carousel-track');
    const placeholder = carousel.querySelector('.carousel-placeholder');
    const dotsWrap    = carousel.querySelector('.carousel-dots');
    const cardName    = carousel.closest('.product-card').querySelector('.product-name').textContent;

    placeholder.style.display = 'none';

    if (images.length <= 1) {
      carousel.querySelector('.carousel-prev').style.display = 'none';
      carousel.querySelector('.carousel-next').style.display = 'none';
    }

    images.forEach((file, i) => {
      const slide = document.createElement('div');
      slide.className = 'carousel-slide';
      const img = document.createElement('img');
      img.src     = `/images/${product}/${encodeURIComponent(file)}`;
      img.alt     = `${cardName} — photo ${i + 1}`;
      img.loading = i === 0 ? 'eager' : 'lazy';
      slide.appendChild(img);
      track.appendChild(slide);

      if (images.length > 1) {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Photo ${i + 1}`);
        dot.addEventListener('click', () => { go(i); resetTimer(); });
        dotsWrap.appendChild(dot);
      }
    });

    let current = 0;
    let timer   = null;

    function go(index) {
      current = (index + images.length) % images.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      carousel.querySelectorAll('.carousel-dot').forEach((d, i) =>
        d.classList.toggle('active', i === current));
    }

    function resetTimer() {
      if (images.length <= 1) return;
      clearInterval(timer);
      timer = setInterval(() => go(current + 1), 4500);
    }

    carousel.querySelector('.carousel-prev')
      .addEventListener('click', () => { go(current - 1); resetTimer(); });
    carousel.querySelector('.carousel-next')
      .addEventListener('click', () => { go(current + 1); resetTimer(); });

    carousel.addEventListener('mouseenter', () => clearInterval(timer));
    carousel.addEventListener('mouseleave', resetTimer);

    resetTimer();
  });
}

initCarousels();

// =============================================
// HAT STYLE TABS
// =============================================

document.querySelectorAll('.hat-tab').forEach(tab => {
  tab.addEventListener('click', function () {
    document.querySelectorAll('.hat-tab').forEach(t => t.classList.remove('hat-tab-active'));
    document.querySelectorAll('.hat-panel').forEach(p => p.classList.add('hat-panel-hidden'));
    this.classList.add('hat-tab-active');
    document.getElementById('hat-panel-' + this.dataset.panel).classList.remove('hat-panel-hidden');
  });
});

// =============================================
// LIGHTBOX
// =============================================

(function () {
  const lb = document.createElement('div');
  lb.id = 'lightbox';
  lb.className = 'lightbox';
  lb.innerHTML =
    '<div class="lightbox-backdrop" id="lb-backdrop"></div>' +
    '<div class="lightbox-content">' +
      '<button class="lightbox-close" id="lb-close" aria-label="Close image">&times;</button>' +
      '<img class="lightbox-img" id="lb-img" src="" alt="">' +
      '<span class="lightbox-caption" id="lb-caption"></span>' +
    '</div>';
  document.body.appendChild(lb);

  function openLightbox(src, caption) {
    const fullSrc = src.includes('width=')
      ? src.replace(/width=\d+/, 'width=1400')
      : src + (src.includes('?') ? '&' : '?') + 'width=1400';
    document.getElementById('lb-img').src = fullSrc;
    document.getElementById('lb-caption').textContent = caption || '';
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lb.classList.remove('open');
    document.getElementById('lb-img').src = '';
    document.body.style.overflow = '';
  }

  document.getElementById('lb-backdrop').addEventListener('click', closeLightbox);
  document.getElementById('lb-close').addEventListener('click', closeLightbox);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

  document.addEventListener('click', e => {
    const card = e.target.closest('.hat-photo-card');
    if (!card) return;
    const img = card.querySelector('.hat-photo-img');
    if (img) openLightbox(img.src, img.alt);
  });
}());

// =============================================
// ORDER THIS — check product box + scroll to form
// =============================================

function orderThis(productId) {
  const checkbox = document.querySelector(`input[type="checkbox"][value="${productId}"]`);
  if (checkbox) {
    checkbox.checked = true;
    checkbox.closest('.checkbox-item').classList.add('is-checked');
  }

  const section = document.getElementById('contact');
  if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Sync visual checked state on direct checkbox interaction
document.querySelectorAll('.checkbox-item input[type="checkbox"]').forEach(cb => {
  cb.addEventListener('change', function () {
    this.closest('.checkbox-item').classList.toggle('is-checked', this.checked);
  });
});

// =============================================
// ORDER FORM SUBMISSION
// =============================================

const form       = document.getElementById('order-form');
const formStatus = document.getElementById('form-status');
const submitBtn  = document.getElementById('submit-btn');

if (form) form.addEventListener('submit', async e => {
  e.preventDefault();
  clearStatus();

  const name  = form.querySelector('#name').value.trim();
  const email = form.querySelector('#email').value.trim();

  if (!name || !email) {
    return showStatus('error', 'Please fill in your name and email address.');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return showStatus('error', 'Please enter a valid email address.');
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';

  try {
    const formData = new FormData(form);
    const body = {};
    const products = [];

    formData.forEach((val, key) => {
      if (key === 'products') products.push(val);
      else body[key] = val;
    });
    body.products = products;

    const res  = await fetch(FORMS_ENDPOINT + '/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();

    if (data.success) {
      showStatus('success', data.message || 'Order request sent! Brady will be in touch soon.');
      form.reset();
      document.querySelectorAll('.checkbox-item').forEach(el => el.classList.remove('is-checked'));
    } else {
      showStatus('error', data.message || 'Something went wrong. Please try again.');
    }
  } catch {
    showStatus('error', 'Unable to send your message. Please check your connection and try again.');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Order Request';
  }
});

function showStatus(type, msg) {
  formStatus.className = `form-status ${type}`;
  formStatus.textContent = msg;
  formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function clearStatus() {
  formStatus.className = 'form-status';
  formStatus.textContent = '';
}

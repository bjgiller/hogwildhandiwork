/* Hogwild Handiwork site script (index, business, hats). No dependencies. */
(function () {
	// Order requests go to the hogwild-forms Cloudflare Worker (c:/Programming/hogwild-forms).
	var FORMS_ENDPOINT = 'https://hogwild-forms.bandicoot3111.workers.dev';

	document.documentElement.classList.remove('no-js');

	/* ---------- Header + mobile nav ---------- */
	var header = document.querySelector('.site-header');
	function onScroll() { if (header) header.classList.toggle('scrolled', window.scrollY > 8); }
	onScroll();
	window.addEventListener('scroll', onScroll, { passive: true });

	var toggle = document.querySelector('.nav-toggle');
	function closeNav() { document.body.classList.remove('nav-open'); if (toggle) toggle.setAttribute('aria-expanded', 'false'); }
	if (toggle) {
		toggle.addEventListener('click', function () {
			var open = document.body.classList.toggle('nav-open');
			toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
		});
		document.querySelectorAll('.nav-links a').forEach(function (a) { a.addEventListener('click', closeNav); });
		document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNav(); });
	}

	/* ---------- Scroll reveal ---------- */
	var reveals = document.querySelectorAll('.reveal');
	if ('IntersectionObserver' in window) {
		var io = new IntersectionObserver(function (entries) {
			entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
		}, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
		reveals.forEach(function (el) { io.observe(el); });
	} else {
		reveals.forEach(function (el) { el.classList.add('in'); });
	}

	/* ---------- Lightbox ---------- */
	var box = null, boxImg, boxCap, gallery = [], gIndex = 0;
	function bigSrc(src) {
		// Lonestar/Shopify CDN images take a width param; ask for a larger one.
		return /[?&]width=\d+/.test(src) ? src.replace(/width=\d+/, 'width=1400') : src;
	}
	function ensureBox() {
		if (box || typeof HTMLDialogElement !== 'function') return !!box;
		box = document.createElement('dialog');
		box.className = 'lightbox';
		box.innerHTML = '<button class="lb-close" type="button" aria-label="Close">&times;</button><img alt=""><p></p>';
		document.body.appendChild(box);
		boxImg = box.querySelector('img');
		boxCap = box.querySelector('p');
		box.querySelector('.lb-close').addEventListener('click', function () { box.close(); });
		box.addEventListener('click', function (e) { if (e.target === box) box.close(); });
		box.addEventListener('keydown', function (e) {
			if (gallery.length < 2) return;
			if (e.key === 'ArrowRight') show(gIndex + 1);
			if (e.key === 'ArrowLeft') show(gIndex - 1);
		});
		return true;
	}
	function show(i) {
		gIndex = (i + gallery.length) % gallery.length;
		boxImg.src = bigSrc(gallery[gIndex].src);
		boxImg.alt = gallery[gIndex].cap || '';
		boxCap.textContent = gallery[gIndex].cap + (gallery.length > 1 ? '  ·  ' + (gIndex + 1) + ' / ' + gallery.length : '');
	}
	function openLightbox(items, start) {
		if (!ensureBox()) { window.open(items[start].src, '_blank'); return; }
		gallery = items; show(start || 0); box.showModal();
	}
	document.addEventListener('click', function (e) {
		var z = e.target.closest('[data-zoom]');
		if (!z) return;
		var img = z.querySelector('img') || z;
		openLightbox([{ src: img.currentSrc || img.src, cap: z.getAttribute('data-zoom') || img.alt }], 0);
	});

	/* ---------- Product photo carousels (images/manifest.json) ---------- */
	var ICON_L = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>';
	var ICON_R = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>';
	var carousels = document.querySelectorAll('.carousel[data-product]');
	if (carousels.length) {
		fetch('/images/manifest.json').then(function (r) { return r.json(); }).then(function (map) {
			carousels.forEach(function (c) { buildCarousel(c, map[c.getAttribute('data-product')] || []); });
		}).catch(function () {});
	}
	function buildCarousel(c, files) {
		if (!files.length) return;
		var key = c.getAttribute('data-product');
		var name = c.getAttribute('data-name') || '';
		var track = document.createElement('div');
		track.className = 'carousel-track';
		var items = files.map(function (f, i) {
			var src = '/images/' + key + '/' + encodeURIComponent(f);
			var img = document.createElement('img');
			img.src = src; img.alt = name + ' photo ' + (i + 1); img.loading = 'lazy'; img.decoding = 'async';
			track.appendChild(img);
			return { src: src, cap: name };
		});
		c.appendChild(track);
		c.classList.add('has-photos');
		var cur = 0, timer = null, dots = [];
		track.addEventListener('click', function () { openLightbox(items, cur); });
		if (files.length > 1) {
			var prev = document.createElement('button'), next = document.createElement('button'), dotWrap = document.createElement('div'), count = document.createElement('span');
			prev.className = 'carousel-nav prev'; prev.type = 'button'; prev.setAttribute('aria-label', 'Previous photo'); prev.innerHTML = ICON_L;
			next.className = 'carousel-nav next'; next.type = 'button'; next.setAttribute('aria-label', 'Next photo'); next.innerHTML = ICON_R;
			dotWrap.className = 'carousel-dots'; count.className = 'carousel-count';
			files.forEach(function (_, i) {
				var d = document.createElement('button'); d.type = 'button'; d.setAttribute('aria-label', 'Photo ' + (i + 1));
				d.addEventListener('click', function () { go(i); restart(); });
				dotWrap.appendChild(d); dots.push(d);
			});
			prev.addEventListener('click', function () { go(cur - 1); restart(); });
			next.addEventListener('click', function () { go(cur + 1); restart(); });
			c.appendChild(prev); c.appendChild(next); c.appendChild(dotWrap); c.appendChild(count);
			c.addEventListener('mouseenter', function () { clearInterval(timer); });
			c.addEventListener('mouseleave', restart);
			go(0); restart();
		}
		function go(i) {
			cur = (i + files.length) % files.length;
			track.style.transform = 'translateX(' + (-cur * 100) + '%)';
			dots.forEach(function (d, j) { d.classList.toggle('active', j === cur); });
			var cnt = c.querySelector('.carousel-count'); if (cnt) cnt.textContent = (cur + 1) + ' / ' + files.length;
		}
		function restart() { clearInterval(timer); timer = setInterval(function () { go(cur + 1); }, 5200); }
	}

	/* ---------- Hat style tabs ---------- */
	document.querySelectorAll('.seg').forEach(function (seg) {
		var tabs = seg.querySelectorAll('[role="tab"]');
		tabs.forEach(function (t) {
			t.addEventListener('click', function () {
				tabs.forEach(function (x) {
					var on = x === t;
					x.setAttribute('aria-selected', on ? 'true' : 'false');
					var panel = document.getElementById(x.getAttribute('aria-controls'));
					if (panel) panel.hidden = !on;
				});
			});
		});
	});

	/* ---------- Add to order (syncs product cards, form chips, and the floating pill) ---------- */
	var form = document.getElementById('order-form');
	var pill = document.querySelector('.order-pill');
	function boxFor(key) { return form ? form.querySelector('input[name="products"][value="' + key + '"]') : null; }
	function sync() {
		if (!form) return;
		var n = 0;
		form.querySelectorAll('input[name="products"]').forEach(function (cb) {
			if (cb.checked) n++;
			document.querySelectorAll('[data-add="' + cb.value + '"]').forEach(function (btn) {
				btn.setAttribute('aria-pressed', cb.checked ? 'true' : 'false');
				var card = btn.closest('.product, .pack');
				if (card) card.classList.toggle('is-added', cb.checked);
				var label = btn.querySelector('.lbl');
				if (label) label.textContent = cb.checked ? (btn.getAttribute('data-added') || 'Added') : (btn.getAttribute('data-label') || 'Add to order');
			});
		});
		if (pill) {
			pill.querySelector('.count').textContent = n;
			pill.classList.toggle('show', n > 0 && !formVisible);
		}
	}
	var formVisible = false;
	if (form && pill && 'IntersectionObserver' in window) {
		new IntersectionObserver(function (en) { formVisible = en[0].isIntersecting; sync(); }, { threshold: 0.15 }).observe(form);
	}
	document.addEventListener('click', function (e) {
		var btn = e.target.closest('[data-add]');
		if (!btn || !form) return;
		var cb = boxFor(btn.getAttribute('data-add'));
		if (!cb) return;
		cb.checked = !cb.checked;
		sync();
		if (btn.hasAttribute('data-go') && cb.checked) document.getElementById('order').scrollIntoView({ behavior: 'smooth' });
	});
	if (form) {
		form.addEventListener('change', function (e) { if (e.target.name === 'products') sync(); });
		// Links like /?add=custom-hats#order (from the hat catalog) pre-select a product.
		var pre = new URLSearchParams(location.search).get('add');
		if (pre && boxFor(pre)) boxFor(pre).checked = true;
		sync();
	}

	/* ---------- Order form submit ---------- */
	if (form) {
		var status = document.getElementById('form-status');
		var submit = form.querySelector('[type="submit"]');
		var submitText = submit.innerHTML;
		function setStatus(type, msg) { status.className = 'form-status ' + type; status.textContent = msg; status.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
		form.addEventListener('submit', function (e) {
			e.preventDefault();
			status.className = 'form-status'; status.textContent = '';
			var name = form.elements.name.value.trim(), email = form.elements.email.value.trim();
			if (!name || !email) return setStatus('error', 'Please fill in your name and email address.');
			if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setStatus('error', 'Please enter a valid email address.');
			var body = { products: [] };
			new FormData(form).forEach(function (v, k) { if (k === 'products') body.products.push(v); else body[k] = v; });
			submit.disabled = true; submit.textContent = 'Sending…';
			fetch(FORMS_ENDPOINT + '/order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
				.then(function (r) { return r.json(); })
				.then(function (d) {
					if (d.success) { setStatus('success', d.message || 'Request sent! Brady will be in touch soon.'); form.reset(); sync(); }
					else setStatus('error', d.message || 'Something went wrong. Please try again.');
				})
				.catch(function () { setStatus('error', 'Unable to send right now. Please check your connection and try again, or reach Brady on Discord.'); })
				.then(function () { submit.disabled = false; submit.innerHTML = submitText; });
		});
	}

	/* ---------- Footer year ---------- */
	document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();

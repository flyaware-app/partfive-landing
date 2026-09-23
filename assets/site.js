/* PartFive marketing site — shared behaviour. No dependencies. */
(function () {
  // Mobile menu
  var toggle = document.querySelector('.nav-toggle');
  var links = document.getElementById('nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.addEventListener('click', function (e) {
      if (e.target.closest('a')) { links.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
    });
  }

  // Scroll reveal. Content is visible by default; the .js class on <html> opts into the effect.
  // An element counts as seen once its top has entered the viewport, including when a fast
  // scroll or an anchor jump carries it past in a single frame (IntersectionObserver alone
  // never reports those, which left them invisible).
  var pending = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  function sweep() {
    var limit = window.innerHeight - 40;
    pending = pending.filter(function (el) {
      if (el.getBoundingClientRect().top < limit) { el.classList.add('in'); return false; }
      return true;
    });
    if (!pending.length) { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); }
  }
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { ticking = false; sweep(); });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  sweep();

  // Monthly / yearly toggle on pricing cards
  document.querySelectorAll('[data-bill-toggle]').forEach(function (group) {
    var scope = group.closest('[data-bill-scope]') || document;
    group.querySelectorAll('button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var mode = btn.getAttribute('data-mode');
        group.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
        scope.querySelectorAll('[data-show]').forEach(function (el) { el.hidden = el.getAttribute('data-show') !== mode; });
      });
    });
  });

  // Quickstart lead capture → capture-lead edge function
  var form = document.getElementById('lead-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var emailEl = document.getElementById('lead-email');
      var consentEl = document.getElementById('lead-consent');
      var btn = document.getElementById('lead-submit');
      var msg = document.getElementById('lead-msg');
      var email = (emailEl.value || '').trim();
      function show(text, color) { msg.style.display = 'block'; msg.style.color = color; msg.textContent = text; }
      if (!email || email.indexOf('@') < 1) { show('Please enter a valid email.', '#F5B544'); return; }
      if (!consentEl.checked) { show('Please tick the consent box.', '#F5B544'); return; }
      btn.disabled = true; btn.textContent = 'Sending…';
      fetch('https://sjqjljnsdyahsrxymeso.supabase.co/functions/v1/capture-lead', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email, consent: true,
          source: form.getAttribute('data-source') || 'landing',
          referrer: document.referrer || location.href,
          website: (document.getElementById('lead-website') || {}).value || ''
        })
      })
        .then(function (r) { return r.json().catch(function () { return {}; }); })
        .then(function (d) {
          if (d && d.ok) {
            if (window.PF_PIXEL_ON) { try { fbq('track', 'Lead'); } catch (_) {} }
            form.reset();
            show('Check your inbox. The Quickstart is on its way.', '#34D399');
          } else {
            show((d && d.error) || 'Something went wrong. Please try again.', '#F5B544');
          }
        })
        .catch(function () { show('Network error. Please try again.', '#F5B544'); })
        .then(function () { btn.disabled = false; btn.textContent = 'Send it'; });
    });
  }
})();

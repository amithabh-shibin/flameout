const menu = document.querySelector('.toggle');
const nav = document.querySelector('#nav');
menu.addEventListener('click', () => {
  menu.setAttribute('aria-expanded', String(nav.classList.toggle('open')));
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.classList.contains('open')) {
    nav.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    menu.focus();
  }
});

// Add official profile URLs here when available.
const profiles = { fb: '', ig: '', tt: '' };
const platformNames = { fb: 'Facebook', ig: 'Instagram', tt: 'TikTok' };
document.querySelectorAll('[data-platform]').forEach(icon => {
  const platform = icon.dataset.platform;
  if (!profiles[platform]) return;
  const link = document.createElement('a');
  link.href = profiles[platform];
  link.setAttribute('aria-label', 'FlameOut on ' + platformNames[platform]);
  link.innerHTML = icon.innerHTML;
  icon.replaceWith(link);
});

const hero = document.querySelector('.hero');
if (hero) {
  const slides = Array.from(hero.querySelectorAll('.slide'));
  const pause = document.querySelector('#pause');
  let current = 0;
  let playing = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let timer;
  function show(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === current);
      slide.setAttribute('aria-hidden', String(i !== current));
    });
    document.querySelector('#counter').firstChild.textContent = '0' + (current + 1) + ' ';
  }
  function schedule() {
    clearInterval(timer);
    pause.textContent = playing ? 'Ⅱ' : '▷';
    pause.setAttribute('aria-label', playing ? 'Pause slideshow' : 'Play slideshow');
    if (playing && !document.hidden && !hero.querySelector('.hero-copy:focus-within')) {
      timer = setInterval(() => show(current + 1), 7500);
    }
  }
  for (const [id, offset] of [['prev', -1], ['next', 1]]) {
    document.getElementById(id).addEventListener('click', () => { show(current + offset); schedule(); });
  }
  pause.addEventListener('click', () => { playing = !playing; schedule(); });
  hero.addEventListener('focusin', schedule);
  hero.addEventListener('focusout', () => setTimeout(schedule, 0));
  document.addEventListener('visibilitychange', schedule);
  schedule();
}

const dialog = document.querySelector('dialog');
if (dialog) {
  document.querySelectorAll('.tile').forEach(tile => tile.addEventListener('click', () => {
    const photo = dialog.querySelector('img');
    photo.src = tile.dataset.image;
    photo.alt = tile.dataset.caption;
    dialog.querySelector('p').textContent = tile.dataset.caption;
    dialog.showModal();
  }));
  dialog.querySelector('.close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
}

const enquiry = document.getElementById('enquiry');
if (enquiry) {
  const fields = enquiry.elements;
  const requested = new URLSearchParams(location.search).get('service');
  if (requested && Array.from(fields.service.options).some(option => option.value === requested)) fields.service.value = requested;
  enquiry.addEventListener('submit', event => {
    event.preventDefault();
    const service = fields.service.selectedOptions[0].textContent;
    const message = ['Hello FlameOut, I would like a quotation.', 'Name: ' + fields.customer.value.trim(), 'Service: ' + service, 'Site: ' + fields.location.value.trim(), 'Details: ' + fields.details.value.trim()].join('\n');
    location.href = 'https://wa.me/971509809255?text=' + encodeURIComponent(message);
  });
}

document.getElementById('year').textContent = new Date().getFullYear();
    const menuBtn = document.getElementById('menuBtn');
    const navLinks = document.getElementById('navLinks');
    menuBtn.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {threshold: 0.12});
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* Deep-space particle field: animated stars, constellation links, and cursor response. */
(() => {
  const canvas = document.getElementById('cosmos');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pointer = { x: -9999, y: -9999 };
  let width = 0, height = 0, stars = [], frame = 0;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const amount = Math.min(145, Math.max(55, Math.floor(width * height / 8500)));
    stars = Array.from({ length: amount }, () => ({
      x: Math.random() * width, y: Math.random() * height,
      r: Math.random() * 1.45 + .25,
      vx: (Math.random() - .5) * .24, vy: (Math.random() - .5) * .24,
      phase: Math.random() * Math.PI * 2, speed: Math.random() * .018 + .005
    }));
    render(true);
  }

  function render(still = false) {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < stars.length; i++) {
      const a = stars[i];
      if (!still && !reduceMotion) {
        a.x += a.vx; a.y += a.vy; a.phase += a.speed;
        if (a.x < -3) a.x = width + 3;
        if (a.x > width + 3) a.x = -3;
        if (a.y < -3) a.y = height + 3;
        if (a.y > height + 3) a.y = -3;
      }
      const twinkle = .28 + (Math.sin(a.phase) + 1) * .29;
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(192, 228, 255, ${twinkle})`;
      ctx.fill();

      for (let j = i + 1; j < stars.length; j++) {
        const b = stars[j], dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 105 * 105) {
          const d = Math.sqrt(d2);
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(91, 175, 255, ${(1 - d / 105) * .115})`;
          ctx.lineWidth = .65; ctx.stroke();
        }
      }
      const px = a.x - pointer.x, py = a.y - pointer.y;
      if (px * px + py * py < 150 * 150) {
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(pointer.x, pointer.y);
        ctx.strokeStyle = 'rgba(153, 139, 255, .19)';
        ctx.lineWidth = .8; ctx.stroke();
      }
    }
    if (!still && !reduceMotion) frame = requestAnimationFrame(() => render(false));
  }

  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('pointermove', e => { pointer.x = e.clientX; pointer.y = e.clientY; }, { passive: true });
  window.addEventListener('pointerleave', () => { pointer.x = -9999; pointer.y = -9999; });
  resize();
  if (!reduceMotion) render(false);
})();

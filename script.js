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

// Ambient particle field: lightweight, responsive, and disabled for reduced-motion users.
(() => {
  const canvas = document.getElementById('space-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let width = 0, height = 0, particles = [], raf = 0;
  const pointer = { x: -1000, y: -1000 };

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(100, Math.floor((width * height) / 14500));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width, y: Math.random() * height,
      r: Math.random() * 1.5 + .35,
      vx: (Math.random() - .5) * .22,
      vy: (Math.random() - .5) * .22,
      phase: Math.random() * Math.PI * 2
    }));
    if (reducedMotion) draw(true);
  }

  function draw(still = false) {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p, i) => {
      if (!still) {
        p.x += p.vx; p.y += p.vy; p.phase += .018;
        if (p.x < -5) p.x = width + 5;
        if (p.x > width + 5) p.x = -5;
        if (p.y < -5) p.y = height + 5;
        if (p.y > height + 5) p.y = -5;
      }
      const alpha = .35 + (Math.sin(p.phase) + 1) * .22;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(119, 232, 255, ${alpha})`;
      ctx.fill();

      // Connect nearby points for a subtle circuit/network effect.
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j], dx = p.x - q.x, dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 105) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(84, 229, 255, ${(1 - dist / 105) * .13})`;
          ctx.lineWidth = .7; ctx.stroke();
        }
      }
      const dx = p.x - pointer.x, dy = p.y - pointer.y;
      if (dx * dx + dy * dy < 125 * 125) {
        ctx.beginPath(); ctx.moveTo(p.x, p.y);
        ctx.lineTo(pointer.x, pointer.y);
        ctx.strokeStyle = 'rgba(99, 140, 255, .16)';
        ctx.lineWidth = .8; ctx.stroke();
      }
    });
    if (!still && !reducedMotion) raf = requestAnimationFrame(() => draw(false));
  }

  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('pointermove', e => {
    pointer.x = e.clientX; pointer.y = e.clientY;
  }, { passive: true });
  window.addEventListener('pointerleave', () => {
    pointer.x = -1000; pointer.y = -1000;
  });
  resize();
  if (!reducedMotion) draw(false);
})();

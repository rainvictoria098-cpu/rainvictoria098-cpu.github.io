// RAIN VICTORIA portfolio interactions: mobile navigation, theme, particles, and reveals.
const menuToggle = document.querySelector("#menu-toggle");
const navLinks = document.querySelector("#nav-links");
const themeToggle = document.querySelector("#theme-toggle");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    navLinks.classList.toggle("open", !isOpen);
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
      navLinks.classList.remove("open");
    });
  });
}

// Theme switch. Defaults to dark, as requested.
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const isLight = document.body.classList.toggle("light-theme");
    themeToggle.textContent = isLight ? "☼" : "◐";
    themeToggle.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
  });
}

// Scroll reveal animations; content remains visible if IntersectionObserver is unavailable.
const revealTargets = document.querySelectorAll(
  ".section-heading, .about-lead, .about-details, .skill-card, .project-card, .github-cta, .contact-grid"
);
if ("IntersectionObserver" in window) {
  revealTargets.forEach((el) => el.classList.add("reveal"));
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealTargets.forEach((el) => revealObserver.observe(el));
}

// Subtle 3D tilt for cards on pointer devices only.
const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
if (canHover && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.querySelectorAll(".skill-card, .project-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rotateY = (x - 0.5) * 5;
      const rotateX = (0.5 - y) * 5;
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
    });
    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
}

// Lightweight animated background particles; pauses when tab is hidden and respects reduced motion.
const canvas = document.querySelector("#particles");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (canvas && !reducedMotion) {
  const ctx = canvas.getContext("2d");
  let particles = [];
  let width = 0;
  let height = 0;
  let rafId = null;

  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(75, Math.max(24, Math.floor(width / 18)));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.5 + 0.4,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.45 + 0.12
    }));
  }

  function drawParticles() {
    ctx.clearRect(0, 0, width, height);
    const light = document.body.classList.contains("light-theme");
    particles.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = light ? `rgba(66,107,19,${p.alpha * 0.55})` : `rgba(168,240,106,${p.alpha})`;
      ctx.fill();
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = light
            ? `rgba(66,107,19,${0.07 * (1 - dist / 100)})`
            : `rgba(168,240,106,${0.10 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    });
    rafId = requestAnimationFrame(drawParticles);
  }

  function startParticles() {
    if (rafId === null && !document.hidden) rafId = requestAnimationFrame(drawParticles);
  }
  function stopParticles() {
    if (rafId !== null) cancelAnimationFrame(rafId);
    rafId = null;
  }
  resizeCanvas();
  startParticles();
  window.addEventListener("resize", resizeCanvas, { passive: true });
  document.addEventListener("visibilitychange", () => document.hidden ? stopParticles() : startParticles());
}

// Footer year updates automatically.
const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

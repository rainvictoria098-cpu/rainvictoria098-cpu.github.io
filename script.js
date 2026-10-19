// RAIN VICTORIA portfolio interactions: mobile navigation, theme, particles, and reveals.const menuToggle = document.querySelector("#menu-toggle");const navLinks = document.querySelector("#nav-links");const themeToggle = document.querySelector("#theme-toggle");if (menuToggle && navLinks) {  menuToggle.addEventListener("click", () => {    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";    menuToggle.setAttribute("aria-expanded", String(!isOpen));    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");    navLinks.classList.toggle("open", !isOpen);  });  navLinks.querySelectorAll("a").forEach((link) => {    link.addEventListener("click", () => {      menuToggle.setAttribute("aria-expanded", "false");      menuToggle.setAttribute("aria-label", "Open navigation");      navLinks.classList.remove("open");    });  });}// Theme switch. Defaults to dark, as requested.if (themeToggle) {  themeToggle.addEventListener("click", () => {    const isLight = document.body.classList.toggle("light-theme");    themeToggle.textContent = isLight ? "☼" : "◐";    themeToggle.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");  });}// Scroll reveal animations; content remains visible if IntersectionObserver is unavailable.const revealTargets = document.querySelectorAll(  ".section-heading, .about-lead, .about-details, .skill-card, .project-card, .github-cta, .contact-grid");if ("IntersectionObserver" in window) {  revealTargets.forEach((el) => el.classList.add("reveal"));  const revealObserver = new IntersectionObserver((entries, observer) => {    entries.forEach((entry) => {      if (entry.isIntersecting) {        entry.target.classList.add("is-visible");        observer.unobserve(entry.target);      }    });  }, { threshold: 0.12 });  revealTargets.forEach((el) => revealObserver.observe(el));}// Subtle 3D tilt for cards on pointer devices only.const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;if (canHover && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {  document.querySelectorAll(".skill-card, .project-card").forEach((card) => {    card.addEventListener("pointermove", (event) => {      const rect = card.getBoundingClientRect();      const x = (event.clientX - rect.left) / rect.width;      const y = (event.clientY - rect.top) / rect.height;      const rotateY = (x - 0.5) * 5;      const rotateX = (0.5 - y) * 5;      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;    });    card.addEventListener("pointerleave", () => {      card.style.transform = "";    });  });}// Lightweight animated background particles; pauses when tab is hidden and respects reduced motion.const canvas = document.querySelector("#particles");const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;if (canvas && !reducedMotion) {  const ctx = canvas.getContext("2d");  let particles = [];  let width = 0;  let height = 0;  let rafId = null;  function resizeCanvas() {    const dpr = Math.min(window.devicePixelRatio || 1, 2);    width = window.innerWidth;    height = window.innerHeight;    canvas.width = Math.floor(width * dpr);    canvas.height = Math.floor(height * dpr);    canvas.style.width = `${width}px`;    canvas.style.height = `${height}px`;    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);    const count = Math.min(75, Math.max(24, Math.floor(width / 18)));    particles = Array.from({ length: count }, () => ({      x: Math.random() * width,      y: Math.random() * height,      r: Math.random() * 1.5 + 0.4,      vx: (Math.random() - 0.5) * 0.25,      vy: (Math.random() - 0.5) * 0.25,      alpha: Math.random() * 0.45 + 0.12    }));  }  function drawParticles() {    ctx.clearRect(0, 0, width, height);    const light = document.body.classList.contains("light-theme");    particles.forEach((p, i) => {      p.x += p.vx; p.y += p.vy;      if (p.x < 0 || p.x > width) p.vx *= -1;      if (p.y < 0 || p.y > height) p.vy *= -1;      ctx.beginPath();      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);      ctx.fillStyle = light ? `rgba(66,107,19,${p.alpha * 0.55})` : `rgba(168,240,106,${p.alpha})`;      ctx.fill();      for (let j = i + 1; j < particles.length; j++) {        const q = particles[j];        const dx = p.x - q.x, dy = p.y - q.y;        const dist = Math.sqrt(dx * dx + dy * dy);        if (dist < 100) {          ctx.beginPath();          ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);          ctx.strokeStyle = light            ? `rgba(66,107,19,${0.07 * (1 - dist / 100)})`            : `rgba(168,240,106,${0.10 * (1 - dist / 100)})`;          ctx.lineWidth = 0.6;          ctx.stroke();        }      }    });    rafId = requestAnimationFrame(drawParticles);  }  function startParticles() {    if (rafId === null && !document.hidden) rafId = requestAnimationFrame(drawParticles);  }  function stopParticles() {    if (rafId !== null) cancelAnimationFrame(rafId);    rafId = null;  }  resizeCanvas();  startParticles();  window.addEventListener("resize", resizeCanvas, { passive: true });  document.addEventListener("visibilitychange", () => document.hidden ? stopParticles() : startParticles());}// Footer year updates automatically.const year = document.querySelector("#year");if (year) year.textContent = new Date().getFullYear();
Collapse file‎style.css‎Copy file name to clipboard+

// Live integration with the public GitHub account rainvictoria098-cpu.
(() => {
  const username = "rainvictoria098-cpu";
  const api = `https://api.github.com/users/${username}`;
  const byId = (id) => document.getElementById(id);

  async function getAllPublicRepos() {
    const all = [];
    for (let page = 1; page <= 10; page++) {
      const response = await fetch(`${api}/repos?sort=updated&per_page=100&page=${page}&type=owner`, {
        headers: { Accept: "application/vnd.github+json" }
      });
      if (!response.ok) throw new Error(`Repositories request failed: ${response.status}`);
      const batch = await response.json();
      all.push(...batch.filter(repo => !repo.private));
      if (batch.length < 100) break;
    }
    return all;
  }

  function buildRepositoryCard(repo, index) {
    const article = document.createElement("article");
    article.className = "project-card reveal is-visible";
    const visual = document.createElement("div");
    visual.className = `project-visual ${["visual-one", "visual-two", "visual-three"][index % 3]}`;
    const visualLabel = document.createElement("span");
    visualLabel.className = "visual-label";
    visualLabel.textContent = `GITHUB REPOSITORY / ${String(index + 1).padStart(2, "0")}`;
    const symbol = document.createElement("span");
    symbol.className = "placeholder-icon";
    symbol.textContent = repo.fork ? "⑂" : "</>";
    const caption = document.createElement("span");
    caption.className = "visual-caption";
    caption.textContent = repo.fork ? "PUBLIC FORK" : "PUBLIC PROJECT";
    visual.append(visualLabel, symbol, caption);

    const content = document.createElement("div");
    content.className = "project-content";
    const meta = document.createElement("div");
    meta.className = "project-meta";
    const kind = document.createElement("span");
    kind.textContent = repo.fork ? "FORKED REPOSITORY" : "PUBLIC REPOSITORY";
    const stars = document.createElement("span");
    stars.textContent = `★ ${repo.stargazers_count || 0} STARS`;
    meta.append(kind, stars);
    const title = document.createElement("h3");
    title.textContent = repo.name;
    const description = document.createElement("p");
    description.textContent = repo.description || "No description added yet. Visit the repository to explore its files and README.";
    const bottom = document.createElement("div");
    bottom.className = "project-bottom";
    const language = document.createElement("span");
    language.className = "tech-pill";
    language.textContent = repo.language || "Language not specified";
    bottom.append(language);
    const link = document.createElement("a");
    link.className = "project-link";
    link.href = repo.html_url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "OPEN REPOSITORY ↗";
    content.append(meta, title, description, bottom, link);
    article.append(visual, content);
    return article;
  }

  async function loadGitHubPortfolio() {
    const status = byId("github-project-status");
    const grid = byId("github-projects");
    const languagesGrid = byId("github-languages");
    try {
      const [profileResponse, repos] = await Promise.all([
        fetch(api, { headers: { Accept: "application/vnd.github+json" } }),
        getAllPublicRepos()
      ]);
      if (!profileResponse.ok) throw new Error(`Profile request failed: ${profileResponse.status}`);
      const profile = await profileResponse.json();
      const languages = [...new Set(repos.map(repo => repo.language).filter(Boolean))].sort();
      const stars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
      if (byId("github-repo-count")) byId("github-repo-count").textContent = profile.public_repos ?? repos.length;
      if (byId("github-star-count")) byId("github-star-count").textContent = stars;
      if (byId("github-follower-count")) byId("github-follower-count").textContent = profile.followers ?? 0;
      if (byId("github-language-count")) byId("github-language-count").textContent = languages.length;

      if (languagesGrid) {
        languagesGrid.replaceChildren();
        languages.forEach((name, i) => {
          const card = document.createElement("article");
          card.className = "skill-card reveal is-visible";
          const top = document.createElement("div"); top.className = "skill-top";
          const number = document.createElement("span"); number.className = "skill-number"; number.textContent = String(i + 1).padStart(2, "0");
          const icon = document.createElement("span"); icon.className = "skill-icon"; icon.textContent = "</>";
          top.append(number, icon);
          const title = document.createElement("h3"); title.textContent = name;
          const description = document.createElement("p");
          const count = repos.filter(repo => repo.language === name).length;
          description.textContent = `Detected in ${count} public ${count === 1 ? "repository" : "repositories"}.`;
          const tag = document.createElement("span"); tag.className = "skill-tag"; tag.textContent = "FROM GITHUB";
          card.append(top, title, description, tag); languagesGrid.append(card);
        });
        if (!languages.length) languagesGrid.textContent = "No language metadata is available yet.";
      }
      if (grid) {
        grid.replaceChildren();
        repos.forEach((repo, index) => grid.append(buildRepositoryCard(repo, index)));
      }
      if (status) status.textContent = `Loaded ${repos.length} public repositories from @${username}, sorted by recently updated.`;
    } catch (error) {
      console.error("GitHub portfolio integration failed:", error);
      if (status) status.textContent = "GitHub data could not load right now. You can still browse your profile directly.";
      if (grid && !grid.children.length) {
        const link = document.createElement("a"); link.className = "button button-outline";
        link.href = `https://github.com/${username}?tab=repositories`; link.target = "_blank"; link.rel = "noopener noreferrer";
        link.textContent = "Browse all repositories on GitHub ↗"; grid.append(link);
      }
    }
  }
  loadGitHubPortfolio();
})();

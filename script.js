// Small enhancement: highlight the active section link as you navigate.
const navLinks = [...document.querySelectorAll('nav a')];
const sections = navLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          const active = link.getAttribute('href') === `#${entry.target.id}`;
          link.style.color = active ? 'var(--cyan)' : '';
        });
      }
    });
  }, { rootMargin: '-25% 0px -60% 0px' });

  sections.forEach(section => observer.observe(section));
}

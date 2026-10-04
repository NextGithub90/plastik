const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
const overlay = document.querySelector('.nav-overlay');
const closeBtn = document.querySelector('.nav-close');
const navLinks = [...document.querySelectorAll('.nav-links > a')];

function openMenu() {
  nav.classList.add('open');
  overlay.classList.add('visible');
  document.body.classList.add('menu-open');
  menuButton.setAttribute('aria-expanded', 'true');
  menuButton.setAttribute('aria-label', 'Tutup menu');
  closeBtn.focus();
}

function closeMenu() {
  nav.classList.remove('open');
  overlay.classList.remove('visible');
  document.body.classList.remove('menu-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Buka menu');
}

menuButton.addEventListener('click', () => {
  const isOpen = nav.classList.contains('open');
  if (isOpen) {
    closeMenu();
  } else {
    openMenu();
  }
});

overlay.addEventListener('click', closeMenu);
closeBtn.addEventListener('click', closeMenu);
nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && nav.classList.contains('open')) {
    closeMenu();
    menuButton.focus();
  }
});

const observedSections = navLinks
  .map((link) => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#') && href.length > 1) {
      try {
        return document.querySelector(href);
      } catch (err) {
        return null;
      }
    }
    return null;
  })
  .filter(Boolean);

if (observedSections.length > 0) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach((link) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          link.classList.toggle('active', href === `#${visible.target.id}`);
        }
      });
    },
    { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.1, 0.5] },
  );

  observedSections.forEach((section) => sectionObserver.observe(section));
}

window.addEventListener('resize', () => {
  if (window.innerWidth > 820) closeMenu();
});

// Filter Kategori Portofolio
const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioCards = document.querySelectorAll('.portfolio-card');

if (filterButtons.length > 0 && portfolioCards.length > 0) {
  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      portfolioCards.forEach((card) => {
        if (filter === 'all') {
          card.classList.remove('hidden');
        } else {
          const category = card.getAttribute('data-category') || '';
          if (category.split(' ').includes(filter)) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        }
      });
    });
  });
}


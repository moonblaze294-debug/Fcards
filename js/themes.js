/*
 * THEMES.JS
 * Applies theme by setting data-theme attribute on <html>.
 * Theme list for the dropdown is defined here too.
 *
 * Each theme carries:
 *   id       – matches data-theme value in CSS
 *   name     – display label
 *   icon     – Font Awesome class
 *   palette  – 3 swatches [bg, surface, accent] for live previews in the dropdown
 *   mood     – one-line flavour text shown as a subtitle in richer UIs
 */

const THEMES = [
  {
    id: 'white-blue',
    name: 'Clean Slate',
    icon: 'fa-solid fa-droplet',
    palette: ['#ffffff', '#e8f0fe', '#3b5bdb'],
    mood: 'Clear head, clear cards.'
  },
  {
    id: 'notebook',
    name: 'Ruled Paper',
    icon: 'fa-solid fa-book-open',
    palette: ['#f9f7f0', '#e8e4d4', '#2c4a8c'],
    mood: 'Like the margins of a favourite notebook.'
  },
  {
    id: 'chalkboard',
    name: 'Chalkboard',
    icon: 'fa-solid fa-chalkboard',
    palette: ['#2d3a2e', '#3d4e3e', '#f0e68c'],
    mood: 'The classic classroom surface.'
  },
  {
    id: 'scroll',
    name: 'Parchment',
    icon: 'fa-solid fa-scroll',
    palette: ['#f4e9c9', '#e8d5a0', '#5c3d1e'],
    mood: 'Ancient wisdom, modern recall.'
  },
  {
    id: 'sepia',
    name: 'Sepia',
    icon: 'fa-solid fa-sun',
    palette: ['#f5ead3', '#ddc9a3', '#8b5e3c'],
    mood: 'Warm like an afternoon reading lamp.'
  },
  {
    id: 'dark',
    name: 'Midnight',
    icon: 'fa-solid fa-moon',
    palette: ['#0f1117', '#1a1d2e', '#818cf8'],
    mood: 'Study without disturbing the night.'
  },
  {
    id: 'academia',
    name: 'Academia',
    icon: 'fa-solid fa-graduation-cap',
    palette: ['#f2ede4', '#ddd5c8', '#7c3d11'],
    mood: 'Dark oak, coffee rings, highlighter.'
  },
  {
    id: 'forest',
    name: 'Forest',
    icon: 'fa-solid fa-tree',
    palette: ['#1e2d1e', '#2a3d2a', '#86efac'],
    mood: 'Focus as deep as old-growth quiet.'
  },
  {
    id: 'rose',
    name: 'Rose Quartz',
    icon: 'fa-solid fa-heart',
    palette: ['#fff1f3', '#ffd6db', '#be185d'],
    mood: 'Soft light, sharp memory.'
  },
  {
    id: 'blueprint',
    name: 'Blueprint',
    icon: 'fa-solid fa-drafting-compass',
    palette: ['#1a2744', '#1e3a8a', '#93c5fd'],
    mood: 'Precision-drafted, engineer-brained.'
  },
  {
    id: 'newsprint',
    name: 'Newsprint',
    icon: 'fa-solid fa-newspaper',
    palette: ['#e8e4dc', '#d4cfc4', '#1a1a1a'],
    mood: 'High-contrast, distraction-free.'
  }
];

/* ─── Core theme functions ──────────────────────────────────────────── */

function applyTheme(themeId) {
  const valid = THEMES.find(t => t.id === themeId);
  if (!valid) themeId = 'white-blue';
  document.documentElement.setAttribute('data-theme', themeId);
  setTheme(themeId);
}

function initTheme() {
  applyTheme(getTheme());
}

function getThemeMeta(themeId) {
  return THEMES.find(t => t.id === themeId) ?? THEMES[0];
}

/* ─── Dropdown builder ───────────────────────────────────────────────
 * Basic mode:   pass only selectEl  → plain <select> as before
 * Swatch mode:  pass a container div → renders a custom swatch picker
 * ──────────────────────────────────────────────────────────────────── */

function buildThemeDropdown(selectEl) {
  const current = getTheme();
  selectEl.innerHTML = '';
  THEMES.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t.id;
    opt.textContent = t.name;
    if (t.id === current) opt.selected = true;
    selectEl.appendChild(opt);
  });
  selectEl.addEventListener('change', function () {
    applyTheme(this.value);
  });
}

/*
 * buildThemeSwatchPicker(containerEl)
 *
 * Renders a visual swatch grid instead of a plain <select>.
 * Each card shows the 3-colour palette, icon, name, and mood line.
 * Drop this into any settings panel or modal that has enough room.
 *
 * Requires the .theme-swatch-* CSS classes defined in your stylesheet
 * (see recommended additions below in the comment block).
 */
function buildThemeSwatchPicker(containerEl) {
  const current = getTheme();
  containerEl.innerHTML = '';
  containerEl.className = 'theme-swatch-grid';

  THEMES.forEach(t => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'theme-swatch-card' + (t.id === current ? ' is-active' : '');
    card.dataset.themeId = t.id;
    card.setAttribute('aria-pressed', t.id === current ? 'true' : 'false');
    card.setAttribute('aria-label', `Apply ${t.name} theme`);
    card.title = t.mood;

    // Colour strip
    const strip = document.createElement('div');
    strip.className = 'theme-swatch-strip';
    t.palette.forEach(hex => {
      const swatch = document.createElement('span');
      swatch.className = 'theme-swatch-dot';
      swatch.style.background = hex;
      strip.appendChild(swatch);
    });

    // Label row
    const label = document.createElement('div');
    label.className = 'theme-swatch-label';
    label.innerHTML =
      `<i class="${t.icon}" aria-hidden="true"></i>` +
      `<span class="theme-swatch-name">${t.name}</span>`;

    card.appendChild(strip);
    card.appendChild(label);
    containerEl.appendChild(card);

    card.addEventListener('click', () => {
      containerEl.querySelectorAll('.theme-swatch-card').forEach(c => {
        c.classList.remove('is-active');
        c.setAttribute('aria-pressed', 'false');
      });
      card.classList.add('is-active');
      card.setAttribute('aria-pressed', 'true');
      applyTheme(t.id);
    });
  });
}

/*
 * ─── Suggested CSS for the swatch picker ────────────────────────────
 *
 * .theme-swatch-grid {
 *   display: grid;
 *   grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
 *   gap: 0.5rem;
 * }
 * .theme-swatch-card {
 *   display: flex;
 *   flex-direction: column;
 *   gap: 0.35rem;
 *   padding: 0.5rem;
 *   border: 2px solid transparent;
 *   border-radius: 8px;
 *   background: var(--surface);
 *   cursor: pointer;
 *   transition: border-color 0.15s;
 * }
 * .theme-swatch-card:hover       { border-color: var(--accent); }
 * .theme-swatch-card.is-active   { border-color: var(--accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 25%, transparent); }
 * .theme-swatch-strip {
 *   display: flex;
 *   gap: 3px;
 *   height: 24px;
 *   border-radius: 4px;
 *   overflow: hidden;
 * }
 * .theme-swatch-dot {
 *   flex: 1;
 * }
 * .theme-swatch-label {
 *   display: flex;
 *   align-items: center;
 *   gap: 0.35rem;
 *   font-size: 0.75rem;
 *   color: var(--text-muted);
 * }
 * .theme-swatch-name { font-weight: 600; color: var(--text); }
 *
 * ──────────────────────────────────────────────────────────────────── */


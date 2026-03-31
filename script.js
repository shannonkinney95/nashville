document.addEventListener('DOMContentLoaded', () => {

  // ---- Mobile nav ----
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  toggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // ---- Nav scroll state ----
  const nav = document.querySelector('.nav');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // ---- Active nav link ----
  const sections = document.querySelectorAll('.section');
  const navAnchors = document.querySelectorAll('.nav-links a');

  const updateActiveLink = () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 140) {
        current = s.id;
      }
    });
    navAnchors.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
  };

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

  // ---- Scroll reveal ----
  const revealTargets = [
    ...document.querySelectorAll('.photo-item'),
    ...document.querySelectorAll('.feature'),
    ...document.querySelectorAll('.day'),
    ...document.querySelectorAll('.style-day'),
    ...document.querySelectorAll('.cost-card'),
    ...document.querySelectorAll('.house-details'),
    ...document.querySelectorAll('.color-palette'),
    ...document.querySelectorAll('.total-card'),
    ...document.querySelectorAll('.rsvp-form'),
    ...document.querySelectorAll('.map-wrapper'),
    ...document.querySelectorAll('.girls-section'),
  ];

  revealTargets.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const parent = entry.target.parentElement;
          const siblings = Array.from(parent.querySelectorAll('.reveal'));
          const idx = siblings.indexOf(entry.target);
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, idx * 60);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
  );

  revealTargets.forEach(el => observer.observe(el));

  // ---- Hero parallax ----
  const heroBg = document.querySelector('.hero-bg img');

  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight) {
      heroBg.style.transform = `translateY(${window.scrollY * 0.25}px) scale(1.05)`;
    }
  }, { passive: true });

  // ---- Flight map ----
  const cityCoords = {
    'nashville':    { x: 540, y: 215 },
    'chicago':      { x: 480, y: 145 },
    'austin':       { x: 330, y: 295 },
    'new york':     { x: 710, y: 115 },
    'nyc':          { x: 710, y: 115 },
    'los angeles':  { x: 108, y: 235 },
    'la':           { x: 108, y: 235 },
    'san francisco':{ x: 98,  y: 185 },
    'sf':           { x: 98,  y: 185 },
    'denver':       { x: 260, y: 175 },
    'dallas':       { x: 340, y: 265 },
    'houston':      { x: 350, y: 305 },
    'miami':        { x: 610, y: 370 },
    'atlanta':      { x: 575, y: 250 },
    'seattle':      { x: 140, y: 90 },
    'portland':     { x: 130, y: 125 },
    'boston':        { x: 735, y: 105 },
    'philadelphia': { x: 690, y: 145 },
    'philly':       { x: 690, y: 145 },
    'phoenix':      { x: 165, y: 260 },
    'san diego':    { x: 115, y: 260 },
    'minneapolis':  { x: 420, y: 105 },
    'detroit':      { x: 530, y: 125 },
    'st louis':     { x: 445, y: 195 },
    'saint louis':  { x: 445, y: 195 },
    'kansas city':  { x: 380, y: 185 },
    'charlotte':    { x: 620, y: 220 },
    'raleigh':      { x: 650, y: 210 },
    'washington':   { x: 670, y: 170 },
    'dc':           { x: 670, y: 170 },
    'baltimore':    { x: 675, y: 160 },
    'orlando':      { x: 595, y: 320 },
    'tampa':        { x: 575, y: 330 },
    'indianapolis': { x: 510, y: 175 },
    'indy':         { x: 510, y: 175 },
    'columbus':     { x: 555, y: 165 },
    'pittsburgh':   { x: 600, y: 145 },
    'cincinnati':   { x: 535, y: 190 },
    'milwaukee':    { x: 475, y: 120 },
    'memphis':      { x: 470, y: 240 },
    'new orleans':  { x: 440, y: 300 },
    'oklahoma city':{ x: 350, y: 225 },
    'omaha':        { x: 360, y: 155 },
    'salt lake city':{ x: 195, y: 165 },
    'las vegas':    { x: 150, y: 220 },
    'tucson':       { x: 175, y: 275 },
    'albuquerque':  { x: 225, y: 250 },
    'boise':        { x: 185, y: 125 },
    'richmond':     { x: 660, y: 190 },
    'savannah':     { x: 600, y: 275 },
    'charleston':   { x: 620, y: 260 },
    'louisville':   { x: 520, y: 200 },
    'san antonio':  { x: 310, y: 310 },
    'jacksonville': { x: 590, y: 290 },
    'buffalo':      { x: 630, y: 110 },
    'cleveland':    { x: 565, y: 140 },
  };

  const NASHVILLE = cityCoords['nashville'];

  function parseCityInput(raw) {
    let city = raw.toLowerCase().trim()
      .replace(/,?\s*(tx|il|ny|ca|co|fl|ga|wa|or|ma|pa|oh|tn|mn|mi|mo|ar|la|wi|in|ky|nc|sc|va|wv|md|nj|de|ct|ri|nh|vt|me|az|nm|nv|ut|id|mt|wy|nd|sd|ne|ks|ok|ia|dc|d\.c\.)?\s*$/i, '')
      .replace(/[.]/g, '')
      .trim();
    return city;
  }

  // ---- Google Sheet data ----
  const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1WbChy0qZD6sQmIip-aoP7RwtClz8Zs2Ft4PX27z2KMA/gviz/tq?tqx=out:csv';

  function parseCSV(text) {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return [];

    const parseRow = (line) => {
      const cols = [];
      let current = '';
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') { inQuotes = !inQuotes; }
        else if (ch === ',' && !inQuotes) { cols.push(current.trim()); current = ''; }
        else { current += ch; }
      }
      cols.push(current.trim());
      return cols;
    };

    const headers = parseRow(lines[0]).map(h => h.toLowerCase());

    // Prefer the last (newest) column when duplicates exist
    const findLast = (keyword) => {
      let idx = -1;
      headers.forEach((h, i) => { if (h.includes(keyword)) idx = i; });
      return idx;
    };

    const nameIdx = findLast('name');
    const cityIdx = findLast('where');
    const connectionIdx = findLast('connection');
    const instagramIdx = findLast('instagram');

    return lines.slice(1).map(line => {
      const cols = parseRow(line);
      return {
        name: nameIdx >= 0 ? cols[nameIdx] || '' : '',
        city: cityIdx >= 0 ? cols[cityIdx] || '' : '',
        connection: connectionIdx >= 0 ? cols[connectionIdx] || '' : '',
        instagram: instagramIdx >= 0 ? cols[instagramIdx] || '' : '',
      };
    }).filter(r => r.name);
  }

  async function fetchTravelers() {
    try {
      const resp = await fetch(SHEET_CSV_URL);
      if (!resp.ok) return [];
      const text = await resp.text();
      return parseCSV(text);
    } catch { return []; }
  }

  // ---- Flight map rendering ----
  function createArcPath(from, to) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const curve = dist * 0.3;
    const mx = (from.x + to.x) / 2;
    const my = (from.y + to.y) / 2;
    const nx = -dy / dist;
    const ny = dx / dist;
    const cx = mx + nx * curve;
    const cy = my + ny * curve - curve * 0.3;
    return `M${from.x},${from.y} Q${cx},${cy} ${to.x},${to.y}`;
  }

  function renderFlightMap(travelers) {
    const arcsGroup = document.getElementById('flight-arcs');
    const legend = document.getElementById('map-legend');
    if (!arcsGroup || !legend) return;

    arcsGroup.innerHTML = '';

    if (!travelers || travelers.length === 0) {
      legend.innerHTML = '<p class="legend-empty">Submit the RSVP form to add your route to the map!</p>';
      return;
    }

    const svgNS = 'http://www.w3.org/2000/svg';
    let legendHTML = '';

    travelers.forEach((t, i) => {
      if (!t.city) return;
      const cityKey = parseCityInput(t.city);
      const coords = cityCoords[cityKey];
      if (!coords) return;

      const delay = i * 0.3;

      const path = document.createElementNS(svgNS, 'path');
      path.setAttribute('d', createArcPath(coords, NASHVILLE));
      path.setAttribute('class', 'flight-arc');
      path.setAttribute('style', `animation-delay: ${delay}s`);
      arcsGroup.appendChild(path);

      const dot = document.createElementNS(svgNS, 'circle');
      dot.setAttribute('r', '3');
      dot.setAttribute('class', 'flight-dot');
      const anim = document.createElementNS(svgNS, 'animateMotion');
      anim.setAttribute('dur', '2s');
      anim.setAttribute('begin', `${delay}s`);
      anim.setAttribute('fill', 'freeze');
      anim.setAttribute('path', createArcPath(coords, NASHVILLE));
      dot.appendChild(anim);
      arcsGroup.appendChild(dot);

      const marker = document.createElementNS(svgNS, 'circle');
      marker.setAttribute('cx', coords.x);
      marker.setAttribute('cy', coords.y);
      marker.setAttribute('r', '3');
      marker.setAttribute('class', 'origin-dot');
      marker.setAttribute('style', `animation-delay: ${delay}s`);
      arcsGroup.appendChild(marker);

      const label = document.createElementNS(svgNS, 'text');
      label.setAttribute('x', coords.x);
      label.setAttribute('y', coords.y - 10);
      label.setAttribute('class', 'map-city-label origin-label');
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('style', `animation-delay: ${delay}s`);
      label.textContent = t.city;
      arcsGroup.appendChild(label);

      const firstName = t.name.split(' ')[0];
      legendHTML += `<div class="legend-item"><span class="legend-dot"></span><span class="legend-name">${firstName}</span><span class="legend-route">from ${t.city}</span></div>`;
    });

    legend.innerHTML = legendHTML;
  }

  // ---- Girls grid rendering ----
  function renderGirlsGrid(travelers) {
    const grid = document.getElementById('girls-grid');
    if (!grid) return;

    if (!travelers || travelers.length === 0) {
      grid.innerHTML = '<p class="girls-empty">No one here yet — RSVP to join the crew!</p>';
      return;
    }

    grid.innerHTML = travelers.map((t) => {
      const initial = t.name.charAt(0).toUpperCase();
      const fromLine = t.city ? `From ${t.city}` : '';
      const connectionBadge = t.connection
        ? `<span class="girl-connection">${t.connection}</span>`
        : '';
      const photoEl = `<div class="girl-photo-placeholder">${initial}</div>`;
      const handle = t.instagram ? t.instagram.replace(/^@?/, '@') : '';
      const igEl = handle
        ? `<a class="girl-instagram" href="https://instagram.com/${handle.replace('@', '')}" target="_blank" rel="noopener">${handle}</a>`
        : '';

      return `
        <div class="girl-card">
          ${photoEl}
          <p class="girl-name">${t.name}</p>
          ${igEl}
          ${fromLine ? `<p class="girl-from">${fromLine}</p>` : ''}
          ${connectionBadge}
        </div>
      `;
    }).join('');
  }

  // ---- Load data from sheet and render ----
  renderFlightMap([]);
  renderGirlsGrid([]);

  fetchTravelers().then(travelers => {
    renderFlightMap(travelers);
    renderGirlsGrid(travelers);
  });

  // ---- Spotify widget toggle ----
  const spotifyToggle = document.getElementById('spotify-toggle');
  const spotifyWidget = document.getElementById('spotify-widget');

  if (spotifyToggle && spotifyWidget) {
    spotifyToggle.addEventListener('click', () => {
      spotifyWidget.classList.toggle('open');
    });
  }

  // ---- RSVP form → Google Forms ----
  const form = document.getElementById('rsvp-form');
  const successEl = document.getElementById('form-success');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('.form-submit');
      btn.textContent = 'Sending...';
      btn.disabled = true;

      const formData = new FormData(form);
      const url = 'https://docs.google.com/forms/d/e/1FAIpQLSelatd0CWxQg13PVsEb8vSERQ8WBFs1b1oxV5JEIQLa1XbVHg/formResponse';

      try {
        await fetch(url, {
          method: 'POST',
          body: formData,
          mode: 'no-cors',
        });
        form.style.display = 'none';
        successEl.style.display = 'block';
      } catch {
        form.style.display = 'none';
        successEl.style.display = 'block';
      }

      // Re-fetch after a delay so the new entry appears
      setTimeout(async () => {
        const travelers = await fetchTravelers();
        renderFlightMap(travelers);
        renderGirlsGrid(travelers);
      }, 3000);
    });
  }

  // ---- MySpace-style Music Player ----
  const PLAYLIST_ID = '2tEEViE1bCd3LXAStk8mfR';
  const playerToggle = document.getElementById('player-toggle');
  const playerDrawer = document.getElementById('player-drawer');
  const playerClose = document.getElementById('player-close');
  const spotifyEmbed = document.getElementById('spotify-embed');
  let playerLoaded = false;

  if (playerToggle && playerDrawer) {
    playerToggle.addEventListener('click', () => {
      playerDrawer.classList.toggle('open');
      playerToggle.classList.toggle('open');
      // Load playlist on first open with autoplay
      if (!playerLoaded) {
        spotifyEmbed.src = `https://open.spotify.com/embed/playlist/${PLAYLIST_ID}?utm_source=generator&theme=0&autoplay=1`;
        playerLoaded = true;
      }
    });

    playerClose.addEventListener('click', () => {
      playerDrawer.classList.remove('open');
      playerToggle.classList.remove('open');
    });
  }

});

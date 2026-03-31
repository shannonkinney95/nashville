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
          // Stagger siblings
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
  // City coordinates mapped to the SVG viewBox (approximate US positions)
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
    // Normalize: lowercase, strip state abbreviations and punctuation
    let city = raw.toLowerCase().trim()
      .replace(/,?\s*(tx|il|ny|ca|co|fl|ga|wa|or|ma|pa|oh|tn|mn|mi|mo|ar|la|wi|in|ky|nc|sc|va|wv|md|nj|de|ct|ri|nh|vt|me|az|nm|nv|ut|id|mt|wy|nd|sd|ne|ks|ok|ia|dc|d\.c\.)?\s*$/i, '')
      .replace(/[.]/g, '')
      .trim();
    return city;
  }

  const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1WbChy0qZD6sQmIip-aoP7RwtClz8Zs2Ft4PX27z2KMA/gviz/tq?tqx=out:csv';

  function getLocalTravelers() {
    try {
      return JSON.parse(localStorage.getItem('nashBashTravelers') || '[]');
    } catch { return []; }
  }

  function getTravelers() {
    return getLocalTravelers();
  }

  function parseCSV(text) {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return [];
    // Parse header
    const headers = lines[0].match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g)
      .map(h => h.replace(/^"|"$/g, '').trim().toLowerCase());
    const nameIdx = headers.findIndex(h => h.includes('name'));

    return lines.slice(1).map(line => {
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
      return { name: nameIdx >= 0 ? cols[nameIdx] || '' : '' };
    }).filter(r => r.name);
  }

  async function fetchSheetTravelers() {
    try {
      const resp = await fetch(SHEET_CSV_URL);
      if (!resp.ok) return [];
      const text = await resp.text();
      return parseCSV(text);
    } catch { return []; }
  }

  // Merge sheet data (shared names) with localStorage (photos, instagram, etc.)
  function mergeTravelers(sheetData, localData) {
    const merged = [];
    const localMap = {};
    localData.forEach(t => { localMap[t.name.toLowerCase()] = t; });
    const seen = new Set();

    // Sheet entries first (shared source of truth for who's attending)
    sheetData.forEach(s => {
      const key = s.name.toLowerCase();
      seen.add(key);
      const local = localMap[key] || {};
      merged.push({
        name: s.name,
        city: local.city || '',
        connection: local.connection || '',
        instagram: local.instagram || '',
        photo: local.photo || '',
      });
    });

    // Add any local-only entries (submitted on this device but not yet in sheet)
    localData.forEach(t => {
      if (!seen.has(t.name.toLowerCase())) {
        merged.push(t);
      }
    });

    return merged;
  }

  async function loadAllTravelers() {
    const sheetData = await fetchSheetTravelers();
    const localData = getLocalTravelers();
    return mergeTravelers(sheetData, localData);
  }

  function saveTraveler(name, city, connection, photo, instagram) {
    const travelers = getTravelers();
    // Avoid duplicates by name
    const existing = travelers.findIndex(t => t.name.toLowerCase() === name.toLowerCase());
    if (existing >= 0) travelers.splice(existing, 1);
    travelers.push({ name, city, connection: connection || '', photo: photo || '', instagram: instagram || '' });
    localStorage.setItem('nashBashTravelers', JSON.stringify(travelers));
  }

  function createArcPath(from, to) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    // Arc curvature proportional to distance
    const curve = dist * 0.3;
    // Control point perpendicular to midpoint
    const mx = (from.x + to.x) / 2;
    const my = (from.y + to.y) / 2;
    // Perpendicular offset (always curve upward)
    const nx = -dy / dist;
    const ny = dx / dist;
    const cx = mx + nx * curve;
    const cy = my + ny * curve - curve * 0.3;
    return `M${from.x},${from.y} Q${cx},${cy} ${to.x},${to.y}`;
  }

  function renderFlightMap(travelersOverride) {
    const arcsGroup = document.getElementById('flight-arcs');
    const legend = document.getElementById('map-legend');
    if (!arcsGroup || !legend) return;

    const travelers = travelersOverride || getTravelers();
    arcsGroup.innerHTML = '';

    if (travelers.length === 0) {
      legend.innerHTML = '<p class="legend-empty">Submit the RSVP form to add your route to the map!</p>';
      return;
    }

    const svgNS = 'http://www.w3.org/2000/svg';
    let legendHTML = '';

    travelers.forEach((t, i) => {
      const cityKey = parseCityInput(t.city);
      const coords = cityCoords[cityKey];
      if (!coords) return;

      const delay = i * 0.3;

      // Arc path
      const path = document.createElementNS(svgNS, 'path');
      path.setAttribute('d', createArcPath(coords, NASHVILLE));
      path.setAttribute('class', 'flight-arc');
      path.setAttribute('style', `animation-delay: ${delay}s`);
      arcsGroup.appendChild(path);

      // Animated dot traveling along the arc
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

      // Origin city marker
      const marker = document.createElementNS(svgNS, 'circle');
      marker.setAttribute('cx', coords.x);
      marker.setAttribute('cy', coords.y);
      marker.setAttribute('r', '3');
      marker.setAttribute('class', 'origin-dot');
      marker.setAttribute('style', `animation-delay: ${delay}s`);
      arcsGroup.appendChild(marker);

      // Origin label
      const label = document.createElementNS(svgNS, 'text');
      label.setAttribute('x', coords.x);
      label.setAttribute('y', coords.y - 10);
      label.setAttribute('class', 'map-city-label origin-label');
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('style', `animation-delay: ${delay}s`);
      label.textContent = t.city;
      arcsGroup.appendChild(label);

      // Legend entry
      const firstName = t.name.split(' ')[0];
      legendHTML += `<div class="legend-item"><span class="legend-dot"></span><span class="legend-name">${firstName}</span><span class="legend-route">from ${t.city}</span></div>`;
    });

    legend.innerHTML = legendHTML;
  }

  // ---- Drag and drop state ----
  let dragSrcIndex = null;

  function handleDragStart(e) {
    const card = e.target.closest('.girl-card');
    if (!card) return;
    dragSrcIndex = parseInt(card.dataset.index);
    card.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', dragSrcIndex);
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const card = e.target.closest('.girl-card');
    if (card) card.classList.add('drag-over');
  }

  function handleDragLeave(e) {
    const card = e.target.closest('.girl-card');
    if (card) card.classList.remove('drag-over');
  }

  function handleDrop(e) {
    e.preventDefault();
    const card = e.target.closest('.girl-card');
    if (!card) return;
    card.classList.remove('drag-over');
    const dropIndex = parseInt(card.dataset.index);
    if (dragSrcIndex === null || dragSrcIndex === dropIndex) return;

    const travelers = getTravelers();
    const [moved] = travelers.splice(dragSrcIndex, 1);
    travelers.splice(dropIndex, 0, moved);
    localStorage.setItem('nashBashTravelers', JSON.stringify(travelers));
    renderGirlsGrid();
  }

  function handleDragEnd(e) {
    dragSrcIndex = null;
    document.querySelectorAll('.girl-card').forEach(c => {
      c.classList.remove('dragging', 'drag-over');
    });
  }

  // ---- Edit card ----
  function startEdit(index) {
    const travelers = getTravelers();
    const t = travelers[index];
    if (!t) return;

    const card = document.querySelector(`.girl-card[data-index="${index}"]`);
    if (!card) return;

    const photoSrc = t.photo || '';
    const previewHTML = photoSrc
      ? `<img src="${photoSrc}" alt="Preview" />`
      : `<span class="photo-upload-icon">+</span>`;

    card.classList.add('girl-card-editing');
    card.setAttribute('draggable', 'false');
    card.innerHTML = `
      <div class="edit-form">
        <div class="edit-photo-upload">
          <input type="file" class="edit-photo-input" accept="image/*" />
          <div class="edit-photo-preview">${previewHTML}</div>
        </div>
        <input type="text" class="edit-input" value="${t.name}" placeholder="Name" data-field="name" />
        <input type="text" class="edit-input" value="${t.instagram || ''}" placeholder="@instagram" data-field="instagram" />
        <input type="text" class="edit-input" value="${t.city || ''}" placeholder="City, State" data-field="city" />
        <input type="text" class="edit-input" value="${t.connection || ''}" placeholder="How you know Shannon" data-field="connection" />
        <div class="edit-actions">
          <button class="edit-save" data-index="${index}">Save</button>
          <button class="edit-cancel" data-index="${index}">Cancel</button>
          <button class="edit-delete" data-index="${index}">Remove</button>
        </div>
      </div>
    `;

    // Photo change handler
    const fileInput = card.querySelector('.edit-photo-input');
    const preview = card.querySelector('.edit-photo-preview');
    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        preview.innerHTML = `<img src="${ev.target.result}" alt="Preview" />`;
        preview.dataset.newPhoto = ev.target.result;
      };
      reader.readAsDataURL(file);
    });

    // Save
    card.querySelector('.edit-save').addEventListener('click', async () => {
      const inputs = card.querySelectorAll('.edit-input');
      const vals = {};
      inputs.forEach(inp => { vals[inp.dataset.field] = inp.value.trim(); });

      const travelers = getTravelers();
      travelers[index].name = vals.name || travelers[index].name;
      travelers[index].instagram = vals.instagram || '';
      travelers[index].city = vals.city || '';
      travelers[index].connection = vals.connection || '';

      // Handle new photo
      const newPhotoData = preview.dataset.newPhoto;
      if (newPhotoData) {
        travelers[index].photo = await resizeImage(newPhotoData, 150);
      }

      localStorage.setItem('nashBashTravelers', JSON.stringify(travelers));
      renderGirlsGrid();
      renderFlightMap();
    });

    // Cancel
    card.querySelector('.edit-cancel').addEventListener('click', () => {
      renderGirlsGrid();
    });

    // Delete
    card.querySelector('.edit-delete').addEventListener('click', () => {
      const travelers = getTravelers();
      travelers.splice(index, 1);
      localStorage.setItem('nashBashTravelers', JSON.stringify(travelers));
      renderGirlsGrid();
      renderFlightMap();
    });
  }

  function renderGirlsGrid(travelersOverride) {
    const grid = document.getElementById('girls-grid');
    if (!grid) return;

    const travelers = travelersOverride || getTravelers();

    if (travelers.length === 0) {
      grid.innerHTML = '<p class="girls-empty">No one here yet — RSVP to join the crew!</p>';
      return;
    }

    grid.innerHTML = travelers.map((t, i) => {
      const initial = t.name.charAt(0).toUpperCase();
      const fromLine = t.city ? `From ${t.city}` : '';
      const connectionBadge = t.connection
        ? `<span class="girl-connection">${t.connection}</span>`
        : '';
      const photoEl = t.photo
        ? `<img class="girl-photo" src="${t.photo}" alt="${t.name}" />`
        : `<div class="girl-photo-placeholder">${initial}</div>`;
      const handle = t.instagram ? t.instagram.replace(/^@?/, '@') : '';
      const igEl = handle
        ? `<a class="girl-instagram" href="https://instagram.com/${handle.replace('@', '')}" target="_blank" rel="noopener">${handle}</a>`
        : '';

      return `
        <div class="girl-card" data-index="${i}" draggable="true">
          <button class="card-edit-btn" data-index="${i}" title="Edit">✎</button>
          ${photoEl}
          <p class="girl-name">${t.name}</p>
          ${igEl}
          ${fromLine ? `<p class="girl-from">${fromLine}</p>` : ''}
          ${connectionBadge}
          <p class="card-drag-hint">Hold to drag</p>
        </div>
      `;
    }).join('');

    // Attach edit handlers
    grid.querySelectorAll('.card-edit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        startEdit(parseInt(btn.dataset.index));
      });
    });

    // Attach drag handlers
    grid.querySelectorAll('.girl-card').forEach(card => {
      card.addEventListener('dragstart', handleDragStart);
      card.addEventListener('dragover', handleDragOver);
      card.addEventListener('dragleave', handleDragLeave);
      card.addEventListener('drop', handleDrop);
      card.addEventListener('dragend', handleDragEnd);
    });
  }

  // Render on load — show local data immediately, then merge with sheet
  renderFlightMap();
  renderGirlsGrid();

  // Fetch shared data from Google Sheet and re-render
  loadAllTravelers().then(merged => {
    renderFlightMap(merged);
    renderGirlsGrid(merged);
  });

  // ---- Photo upload preview ----
  const photoInput = document.getElementById('photo');
  const photoPreview = document.getElementById('photo-preview');

  if (photoInput && photoPreview) {
    photoInput.addEventListener('change', () => {
      const file = photoInput.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        photoPreview.innerHTML = `<img src="${e.target.result}" alt="Preview" />`;
        document.querySelector('.photo-upload-label').textContent = file.name;
      };
      reader.readAsDataURL(file);
    });
  }

  // Helper: resize image to a small thumbnail before storing
  function resizeImage(dataUrl, maxSize) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let w = img.width;
        let h = img.height;
        if (w > h) { h = (maxSize / w) * h; w = maxSize; }
        else { w = (maxSize / h) * w; h = maxSize; }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.src = dataUrl;
    });
  }

  // ---- RSVP form → Google Sheets ----
  const form = document.getElementById('rsvp-form');
  const successEl = document.getElementById('form-success');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('.form-submit');
      btn.textContent = 'Sending...';
      btn.disabled = true;

      // Save traveler data for the flight map and girls grid
      const nameVal = document.getElementById('name').value.trim();
      const cityVal = document.getElementById('coming-from').value.trim();
      const connectionVal = document.getElementById('connection').value;
      const instagramVal = document.getElementById('instagram').value.trim();
      const photoFile = document.getElementById('photo').files[0];

      let photoData = '';
      if (photoFile) {
        const rawData = await new Promise((resolve) => {
          const r = new FileReader();
          r.onload = (ev) => resolve(ev.target.result);
          r.readAsDataURL(photoFile);
        });
        photoData = await resizeImage(rawData, 150);
      }

      if (nameVal) {
        saveTraveler(nameVal, cityVal, connectionVal, photoData, instagramVal);
        renderFlightMap();
        renderGirlsGrid();
      }

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
        // no-cors means we can't read the response, but Google still receives the data
        form.style.display = 'none';
        successEl.style.display = 'block';
      }
    });
  }

});

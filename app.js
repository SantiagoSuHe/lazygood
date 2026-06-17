// LazyGood — guided workout app. No backend: all state lives in localStorage.

const STORE_KEY = 'lazygood_history_v1';
const app = document.getElementById('app');

// ---------- storage ----------

function loadHistory() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; }
  catch { return []; }
}

function saveHistory(history) {
  localStorage.setItem(STORE_KEY, JSON.stringify(history));
}

function nextSessionType() {
  const history = loadHistory();
  const last = history[history.length - 1];
  return last && last.type === 'A' ? 'B' : 'A';
}

function lastPerformance(exerciseId) {
  const history = loadHistory();
  for (let i = history.length - 1; i >= 0; i--) {
    const found = history[i].exercises.find(e => e.id === exerciseId);
    if (found && found.sets.length) return { date: history[i].date, sets: found.sets };
  }
  return null;
}

// Load unit: the Forma machines have no kg readout — you log the pin level
// ("palito"), a whole number stepping by 1. Free weights stay in kg (step 2.5).
function unitInfo(ex) {
  if (ex && ex.unit === 'nivel') return {
    inputLabel: 'Nivel (palito)',
    inputMode: 'numeric',
    defaultStart: 4,
    short: 'niveles',
    round: x => Math.max(0, Math.round(x))
  };
  return {
    inputLabel: 'Peso (kg)',
    inputMode: 'decimal',
    defaultStart: 20,
    short: 'kg',
    round: x => Math.max(0, Math.round(x / 2.5) * 2.5)
  };
}

// Double progression: if every set of the last session hit the top of the
// rep range, suggest adding load; otherwise suggest beating last numbers.
function suggestionFor(ex) {
  const isLevel = ex.unit === 'nivel';
  const last = lastPerformance(ex.id);
  if (!last) {
    const start = isLevel
      ? `Empieza en un <strong>nivel bajo</strong> (prueba ${unitInfo(ex).defaultStart}-${unitInfo(ex).defaultStart + 1})`
      : `Empieza <strong>liviano</strong>`;
    return { type: 'new', weight: null,
      html: `Primera vez con este ejercicio. ${start}, aprende el movimiento y deja 1-2 reps en reserva.` };
  }
  const maxWeight = Math.max(...last.sets.map(s => s.weight));
  const allTopped = last.sets.every(s => s.reps >= ex.repMax);
  if (allTopped) {
    const next = maxWeight + ex.increment;
    const action = isLevel ? `<strong>Sube al nivel ${next}</strong>` : `<strong>Sube a ${next} kg</strong>`;
    return { type: 'up', weight: next,
      html: `La vez pasada llegaste al tope (${formatSets(last.sets, ex.unit)}). ${action} y vuelve a ${ex.repMin}-${ex.repMin + 1} reps.` };
  }
  const action = isLevel ? 'Iguala el nivel y supera las reps' : 'Iguala el peso y supera las reps';
  return { type: 'beat', weight: maxWeight,
    html: `La vez pasada: ${formatSets(last.sets, ex.unit)}. <strong>${action}</strong>, aunque sea por una.` };
}

function formatSets(sets, unit) {
  const fmt = unit === 'nivel' ? (w => `N${w}`) : (w => `${w}kg`);
  return sets.map(s => `${fmt(s.weight)}×${s.reps}`).join(' · ');
}

// ---------- muscle diagrams (wger.de SVGs, CC-BY-SA) ----------

const FRONT_MUSCLES = new Set([1, 2, 4, 6, 10, 13, 14, 3]);

function muscleMapsHTML(ex) {
  const views = [];
  for (const side of ['front', 'back']) {
    const isFront = side === 'front';
    const main = (ex.muscleIdsMain || []).filter(id => FRONT_MUSCLES.has(id) === isFront);
    const sup = (ex.muscleIdsSupport || []).filter(id => FRONT_MUSCLES.has(id) === isFront);
    if (!main.length && !sup.length) continue;
    views.push(`
      <div class="muscle-map">
        <img src="img/muscles/body_${side}.svg" alt="">
        ${main.map(id => `<img class="overlay" src="img/muscles/main-${id}.svg" alt="">`).join('')}
        ${sup.map(id => `<img class="overlay" src="img/muscles/sec-${id}.svg" alt="">`).join('')}
      </div>`);
  }
  return views.join('');
}

// ---------- warm-up sets (first exercise of the session only) ----------

const WARMUPS = [
  { pct: 0.5, reps: 8, label: '~50% del peso de trabajo' },
  { pct: 0.75, reps: 4, label: '~75% del peso de trabajo' }
];
const WARMUP_REST_SEC = 60;

function inWarmup(state) {
  return state.exIndex === 0 && state.setIndex === 0 && (state.warmupIndex || 0) < WARMUPS.length;
}

function todayStr() {
  return new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' });
}

// ---------- workout state (survives reloads mid-session) ----------

const SESSION_KEY = 'lazygood_active_session_v1';

function loadActive() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)); }
  catch { return null; }
}
function saveActive(state) { localStorage.setItem(SESSION_KEY, JSON.stringify(state)); }
function clearActive() { localStorage.removeItem(SESSION_KEY); }

// ---------- image animation ----------

let animTimer = null;
function animateDemo(imgEl, frames) {
  let i = 0;
  clearInterval(animTimer);
  animTimer = setInterval(() => {
    i = 1 - i;
    imgEl.src = frames[i];
  }, 900);
}

// ---------- demo carousel (video → gif → gym machine photo) ----------

// Swipeable carousel: slide 1 the YouTube Short (controls on so it can be
// paused/scrubbed), slide 2 the cross-fading start/end gif (#demo, animated by
// animateDemo), slide 3 a photo of the actual machine in the building's gym.
// Slides with no source are skipped. Wired up by wireDemoCarousel().
function demoCarouselHTML(ex) {
  const slides = [];
  if (ex.youtubeId) {
    slides.push({ label: 'Video', html: `
      <iframe class="demo-iframe"
        src="https://www.youtube-nocookie.com/embed/${ex.youtubeId}?autoplay=1&mute=1&loop=1&playlist=${ex.youtubeId}&controls=1&playsinline=1&modestbranding=1&rel=0"
        title="Demostración de ${ex.name}" loading="lazy"
        allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>` });
  }
  slides.push({ label: 'Animación', html: `<img class="demo-img" id="demo" src="${ex.imgs[0]}" alt="Animación de ${ex.name}">` });
  if (ex.machineImg) {
    slides.push({ label: 'Tu máquina', html: `<img class="demo-img demo-machine" src="${ex.machineImg}" alt="Máquina del gym para ${ex.name}">` });
  }

  return `
    <div class="demo-carousel">
      <div class="demo-track" id="demo-track">
        ${slides.map(s => `<div class="demo-slide"><span class="demo-cap">${s.label}</span>${s.html}</div>`).join('')}
      </div>
      ${slides.length > 1 ? `<div class="demo-dots" id="demo-dots">
        ${slides.map((s, i) => `<button class="dot${i === 0 ? ' active' : ''}" data-i="${i}" aria-label="${s.label}"></button>`).join('')}
      </div>` : ''}
    </div>`;
}

let demoResizeHandler = null;

function wireDemoCarousel() {
  const track = document.getElementById('demo-track');
  if (!track) return;
  const slides = [...track.querySelectorAll('.demo-slide')];
  const dots = [...document.querySelectorAll('#demo-dots .dot')];

  // The track adapts its height to the slide you're on: the portrait Short
  // fills a tall 9:16 box, while a landscape gif / gym photo fills the full
  // width at its natural shape (no letterboxing). Capped so the controls below
  // stay visible.
  const maxH = () => Math.min(window.innerHeight * 0.54, 470);
  const sizeFor = (i) => {
    const media = slides[i] && slides[i].querySelector('img, iframe');
    if (media && media.tagName === 'IMG' && media.naturalWidth) {
      const ar = media.naturalWidth / media.naturalHeight;   // >1 landscape, <1 portrait
      return Math.max(180, Math.min(maxH(), Math.round(track.clientWidth / ar)));
    }
    return maxH();   // video, or image not loaded yet → full portrait height
  };
  const current = () => Math.round(track.scrollLeft / track.clientWidth);
  const applyHeight = () => { track.style.height = sizeFor(current()) + 'px'; };

  // images may not be measured at first paint — resize once they load
  slides.forEach((s, i) => {
    const img = s.querySelector('img');
    if (img && !img.complete) img.addEventListener('load', () => { if (current() === i) applyHeight(); }, { once: true });
  });

  const onScroll = () => {
    const i = current();
    dots.forEach((d, di) => d.classList.toggle('active', di === i));
    applyHeight();
  };
  let t;
  track.addEventListener('scroll', () => { clearTimeout(t); t = setTimeout(onScroll, 60); });
  dots.forEach(d => d.onclick = () => track.scrollTo({ left: (+d.dataset.i) * track.clientWidth, behavior: 'smooth' }));

  if (demoResizeHandler) window.removeEventListener('resize', demoResizeHandler);
  demoResizeHandler = applyHeight;
  window.addEventListener('resize', demoResizeHandler);

  applyHeight();
}

// ---------- audio / haptics ----------

function notifyRestOver() {
  if (navigator.vibrate) navigator.vibrate([300, 100, 300]);
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [0, 0.25, 0.5].forEach(t => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.4, ctx.currentTime + t);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.2);
      osc.start(ctx.currentTime + t); osc.stop(ctx.currentTime + t + 0.2);
    });
  } catch { /* audio blocked until user interaction — vibration still works */ }
}

// ---------- screens ----------

function render(html) {
  clearInterval(animTimer);
  app.innerHTML = html;
}

const HOME_ICON = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/></svg>';

// Top navigation bar shared by the exercise and rest screens: a home icon
// (returns to the home screen, keeping the session so it can be resumed) and
// an optional "back one step" button. Handlers are wired by the caller.
function navBarHTML(showBack) {
  return `
    <div class="ex-topbar">
      <button class="icon-btn" id="go-home" aria-label="Ir al inicio" title="Inicio">${HOME_ICON}</button>
      ${showBack ? '<button class="icon-btn back-step" id="back-step">‹ Atrás</button>' : ''}
    </div>`;
}

// Step back one move in the session and revert it: from a rest, undo the set
// (or warm-up) that triggered it and reopen that set; the caller decides when
// to use it. Keeps the saved log consistent so progression stays correct.
function backToPreviousSet(state) {
  clearInterval(restInterval);
  if (state.rest && state.rest.fromWarmup) {
    state.warmupIndex = Math.max(0, (state.warmupIndex || 0) - 1);
  } else {
    if (state.rest && state.rest.change) {
      // The rest followed the last set of the previous exercise.
      state.exIndex = Math.max(0, state.exIndex - 1);
      state.setIndex = ROUTINE[state.type].exercises[state.exIndex].sets - 1;
    } else {
      state.setIndex = Math.max(0, state.setIndex - 1);
    }
    const entry = state.log[state.exIndex];
    if (entry && entry.sets.length) entry.sets.pop();   // un-log it so it can be redone
  }
  delete state.rest;
  saveActive(state);
  showExercise(state);
}

// Which session the home screen is previewing. Defaults to the A/B
// alternation pick, but the user can override it with the toggle.
let selectedType = null;

function showHome() {
  const nextType = nextSessionType();
  const active = loadActive();
  // The toggle always wins; otherwise default to the active session's type, or
  // the alternation pick. previewingActive = the previewed list IS the running
  // session, so jump/highlight apply; otherwise the rows just start a new one.
  const displayType = selectedType || (active ? active.type : nextType);
  const previewingActive = !!active && active.type === displayType;
  const session = ROUTINE[displayType];
  const history = loadHistory();
  const last = history[history.length - 1];

  let progressDesc = '';
  if (active) {
    const curEx = ROUTINE[active.type].exercises[active.exIndex];
    if (inWarmup(active)) {
      progressDesc = `Calentamiento ${(active.warmupIndex || 0) + 1} de ${WARMUPS.length} · ${curEx.name}`;
    } else {
      progressDesc = `${curEx.name} · Serie ${active.setIndex + 1} de ${curEx.sets}`;
    }
  }

  render(`
    <div class="screen">
      <div class="logo">LazyGood</div>
      <div>
        <div class="seg-control" role="tablist" aria-label="Elegir sesión">
          <button class="seg${displayType === 'A' ? ' active' : ''}" id="seg-A" role="tab" aria-selected="${displayType === 'A'}">Sesión A</button>
          <button class="seg${displayType === 'B' ? ' active' : ''}" id="seg-B" role="tab" aria-selected="${displayType === 'B'}">Sesión B</button>
        </div>
        <div class="home-sub">${todayStr()}${last ? ` · última: ${new Date(last.date).toLocaleDateString('es-CO')}` : ''} · recomendada hoy: <strong>Sesión ${nextType}</strong></div>
      </div>
      ${active ? `
        <div class="card session-progress">
          <div class="sp-session">${ROUTINE[active.type].label} en curso</div>
          <div class="sp-step">${progressDesc}</div>
        </div>
      ` : ''}
      <details class="info-box">
        <summary>¿Cómo elijo el peso y las reps?</summary>
        <div class="info-content">
          <p><strong>El rango de reps define tu ciclo de progresión</strong>, no es un número al azar:</p>
          <ul>
            <li>Elige un peso e intenta llegar al <strong>tope del rango</strong> (ej. 8 reps).</li>
            <li>Si solo llegas a 5, bien — la próxima sesión intenta 6, luego 7, luego 8.</li>
            <li>Cuando logres 8 en <strong>todas</strong> las series → la próxima sesión sube el peso.</li>
            <li>Con el peso nuevo probablemente llegues a 4-5 → y vuelves a subir rep a rep.</li>
          </ul>
          <p><strong>Peso correcto:</strong> las últimas 2-3 reps se sienten duras pero controladas. Podrías hacer 1-2 más si quisieras, pero no más.</p>
        </div>
      </details>
      <div class="exercise-list">
        <div class="exercise-row warmup-card tappable" id="row-warmup" role="button" tabindex="0">
          <div class="warmup-thumb"></div>
          <div>
            <div class="ex-name">Calentamiento</div>
            <div class="ex-scheme">2 series de aproximación · ${session.exercises[0].name}</div>
          </div>
        </div>
        ${session.exercises.map((ex, i) => `
          <div class="exercise-row tappable${previewingActive && active.exIndex === i && !inWarmup(active) ? ' current-ex' : ''}" id="row-${i}" role="button" tabindex="0">
            <img src="${ex.imgs[0]}" alt="">
            <div>
              <div class="ex-name">${ex.name}</div>
              <div class="ex-scheme">${ex.sets} × ${ex.repMin}-${ex.repMax} reps${ex.unilateral ? ' por pierna' : ''}</div>
            </div>
            <span class="row-go" aria-hidden="true">›</span>
          </div>`).join('')}
      </div>
      <div class="list-hint">${previewingActive ? 'Toca un ejercicio para saltar a él' : 'Toca un ejercicio para empezar ahí'}</div>
      <div class="spacer"></div>
      ${active ? `
        <button class="btn btn-primary btn-big" id="resume">Retomar ${ROUTINE[active.type].label}</button>
        <button class="btn btn-secondary" id="start">Empezar ${session.label} nueva</button>
        <button class="btn btn-ghost" id="cancel">Cancelar sesión actual</button>
      ` : `
        <button class="btn btn-primary btn-big" id="start">Empezar ${session.label}</button>
      `}
      <button class="btn btn-ghost" id="history">Ver historial · Exportar</button>
      <div class="credits">Fotos: <a href="https://github.com/yuhonas/free-exercise-db">free-exercise-db</a> (dominio público) · Diagramas musculares: <a href="https://wger.de">wger.de</a> (CC-BY-SA)</div>
    </div>
  `);

  // A/B toggle — always available, even mid-session (it only previews; it
  // doesn't touch the running session until you choose to start a new one).
  document.getElementById('seg-A').onclick = () => { selectedType = 'A'; showHome(); };
  document.getElementById('seg-B').onclick = () => { selectedType = 'B'; showHome(); };

  // Starting fresh discards any in-progress session — confirm first.
  const startFresh = (index, skipWarmup) => {
    if (active && !confirm('Tienes una sesión en curso. ¿Empezar una nueva y descartar el progreso?')) return;
    startWorkout(displayType, index, skipWarmup);
  };

  document.getElementById('start').onclick = () => startFresh(0, false);
  document.getElementById('history').onclick = showHistory;

  if (active) {
    document.getElementById('resume').onclick = () => {
      const st = loadActive();
      if (st.rest) showRest(st); else showExercise(st);
    };
    document.getElementById('cancel').onclick = () => {
      if (!confirm('¿Cancelar la sesión actual? Se perderá el progreso.')) return;
      clearActive();
      showHome();
    };
  }

  // Tappable rows: jump within the running session (only when the previewed
  // list IS that session), otherwise start a new session at that exercise.
  const onRow = (handler) => (el) => {
    if (!el) return;
    el.onclick = handler;
    el.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); } };
  };
  onRow(() => previewingActive ? jumpToExercise(0) : startFresh(0, false))(document.getElementById('row-warmup'));
  session.exercises.forEach((ex, i) => {
    onRow(() => previewingActive ? jumpToExercise(i) : startFresh(i, true))(document.getElementById('row-' + i));
  });
}

function startWorkout(type, startExIndex = 0, skipWarmup = false) {
  const state = {
    type,
    startedAt: new Date().toISOString(),
    exIndex: startExIndex,
    setIndex: 0,
    // warm-ups only ever precede the first exercise; jumping straight into
    // any exercise (or starting past the first) skips them.
    warmupIndex: skipWarmup || startExIndex > 0 ? WARMUPS.length : 0,
    log: ROUTINE[type].exercises.map(ex => ({ id: ex.id, name: ex.name, unit: ex.unit || 'kg', sets: [] }))
  };
  saveActive(state);
  showExercise(state);
}

// Manual override from the home screen: jump to any exercise of the
// in-progress session, resuming at the next unlogged set. Drops any
// pending rest and the warm-up (warm-ups belong to the start only).
function jumpToExercise(exIndex) {
  const state = loadActive();
  if (!state) return;
  state.exIndex = exIndex;
  state.setIndex = state.log[exIndex].sets.length;
  state.warmupIndex = WARMUPS.length;
  delete state.rest;
  saveActive(state);
  showExercise(state);
}

function showExercise(state) {
  const session = ROUTINE[state.type];
  const ex = session.exercises[state.exIndex];
  const sug = suggestionFor(ex);
  const u = unitInfo(ex);
  const warmup = inWarmup(state) ? WARMUPS[state.warmupIndex || 0] : null;
  const workWeight = sug.weight || u.defaultStart;
  const prevSet = state.log[state.exIndex].sets[state.setIndex - 1];
  const defaultWeight = warmup ? u.round(workWeight * warmup.pct)
    : (prevSet ? prevSet.weight : workWeight);
  const defaultReps = warmup ? warmup.reps : ex.repMin;
  const doneSets = (state.warmupIndex || 0) + state.log.reduce((n, e) => n + e.sets.length, 0);

  // One progress segment per set; each exercise gets its own color so the bar
  // shows at a glance which exercise you're on. Warm-ups share one color.
  const segments = [];
  for (let i = 0; i < WARMUPS.length; i++) segments.push({ wu: true });
  session.exercises.forEach((e, ei) => { for (let s = 0; s < e.sets; s++) segments.push({ ex: ei }); });

  render(`
    <div class="screen workout${warmup ? ' warmup-active' : ''}">
      ${navBarHTML(!!state.rest)}
      <div class="progress-bar">
        ${segments.map((seg, i) => {
          const color = seg.wu ? 'wu' : 'ex' + (seg.ex % 6);
          const status = i < doneSets ? ' done' : i === doneSets ? ' current' : '';
          return `<span class="${color}${status}"></span>`;
        }).join('')}
      </div>
      <div class="ex-header">
        <div class="machine">${ex.machine}</div>
        <h2>${ex.name}</h2>
        <div class="pattern">${ex.pattern} · ejercicio ${state.exIndex + 1} de ${session.exercises.length}</div>
      </div>
      ${demoCarouselHTML(ex)}
      ${warmup ? `
      <div class="set-info">
        <span class="set-label warmup-label">Calentamiento ${(state.warmupIndex || 0) + 1} de ${WARMUPS.length}</span>
        <span class="rep-target">${warmup.reps} reps ligeras</span>
      </div>
      <div class="suggestion warmup">Serie de aproximación: <strong>${warmup.label}</strong> (~${defaultWeight} ${u.short}). Sirve para calentar y ensayar la técnica — no cuenta para el registro.</div>` : `
      <div class="set-info">
        <span class="set-label">Serie ${state.setIndex + 1} de ${ex.sets}</span>
        <span class="rep-target">${ex.repMin}-${ex.repMax} reps${ex.unilateral ? ' /pierna' : ''}</span>
      </div>
      ${sug.type === 'new' ? '' : `<div class="suggestion ${sug.type === 'up' ? 'up' : ''}">${sug.html}</div>`}`}
      <details class="cues-box">
        <summary>Cómo se hace</summary>
        <ul class="cues">${ex.cues.map(c => `<li>${c}</li>`).join('')}</ul>
      </details>
      <div class="inputs">
        <div class="input-group">
          <label>${u.inputLabel}</label>
          <div class="stepper">
            <button id="w-minus">−</button>
            <input id="weight" type="number" inputmode="${u.inputMode}" step="${ex.increment}" value="${defaultWeight}">
            <button id="w-plus">+</button>
          </div>
        </div>
        <div class="input-group">
          <label>Reps</label>
          <div class="stepper">
            <button id="r-minus">−</button>
            <input id="reps" type="number" inputmode="numeric" value="${defaultReps}">
            <button id="r-plus">+</button>
          </div>
        </div>
      </div>
      <button class="btn btn-primary btn-big" id="done-set">${warmup ? 'Calentamiento hecho' : 'Serie hecha'}</button>
      <div class="muscles-bottom">
        <div class="muscle-maps">${muscleMapsHTML(ex)}</div>
        <div class="muscles">
          <div><strong>${ex.musclesMain}</strong></div>
          <div class="support">apoyo: ${ex.musclesSupport}</div>
          <div class="legend"><span class="dot main"></span> principal <span class="dot sec"></span> apoyo</div>
        </div>
      </div>
    </div>
  `);

  const demoImg = document.getElementById('demo');
  if (demoImg) animateDemo(demoImg, ex.imgs);   // animates the "gif" slide
  wireDemoCarousel();

  const weightInput = document.getElementById('weight');
  const repsInput = document.getElementById('reps');
  document.getElementById('w-minus').onclick = () => weightInput.value = Math.max(0, parseFloat(weightInput.value || 0) - ex.increment);
  document.getElementById('w-plus').onclick = () => weightInput.value = parseFloat(weightInput.value || 0) + ex.increment;
  document.getElementById('r-minus').onclick = () => repsInput.value = Math.max(0, parseInt(repsInput.value || 0) - 1);
  document.getElementById('r-plus').onclick = () => repsInput.value = parseInt(repsInput.value || 0) + 1;

  document.getElementById('done-set').onclick = () => {
    if (warmup) {
      state.warmupIndex = (state.warmupIndex || 0) + 1;
      startRest(state, WARMUP_REST_SEC, false, true);
      return;
    }

    const weight = parseFloat(weightInput.value);
    const reps = parseInt(repsInput.value);
    if (isNaN(weight) || isNaN(reps) || reps <= 0) { alert('Registra peso y reps válidos.'); return; }

    state.log[state.exIndex].sets.push({ weight, reps });

    const isLastSet = state.setIndex + 1 >= ex.sets;
    const isLastExercise = state.exIndex + 1 >= session.exercises.length;

    if (isLastSet && isLastExercise) {
      finishWorkout(state);
    } else if (isLastSet) {
      state.exIndex += 1;
      state.setIndex = 0;
      startRest(state, ex.restSec, true);
    } else {
      state.setIndex += 1;
      startRest(state, ex.restSec, false);
    }
  };

  document.getElementById('go-home').onclick = () => showHome();

  // Back from an exercise → the rest that preceded it (restart it if it had
  // already run out, otherwise resume the remaining time).
  const backStep = document.getElementById('back-step');
  if (backStep) backStep.onclick = () => {
    if (state.rest.endAt <= Date.now()) {
      state.rest.endAt = Date.now() + state.rest.total * 1000;
      saveActive(state);
    }
    showRest(state);
  };
}

let restInterval = null;

// Rest state is stored on the session so the exercise screen can return to it
// (e.g. after skipping by mistake) and so a reload mid-rest keeps the timer.
function startRest(state, seconds, isExerciseChange, fromWarmup) {
  state.rest = { endAt: Date.now() + seconds * 1000, total: seconds, change: !!isExerciseChange, fromWarmup: !!fromWarmup };
  saveActive(state);
  showRest(state);
}

function showRest(state) {
  const session = ROUTINE[state.type];
  const nextEx = session.exercises[state.exIndex];

  render(`
    <div class="screen rest-screen">
      ${navBarHTML(true)}
      <div class="rest-body">
      <div class="rest-title">${state.rest.change ? 'Descansa antes del siguiente ejercicio' : 'Descansa'}</div>
      <div class="rest-clock" id="clock">--:--</div>
      <div class="rest-ring"><div id="ring" style="width:100%"></div></div>
      <div class="rest-hint">Camina mientras tanto — suma pasos</div>
      <div class="rest-next">Sigue: <strong>${nextEx.name}</strong> · ${inWarmup(state) ? `Calentamiento ${(state.warmupIndex || 0) + 1} de ${WARMUPS.length}` : `Serie ${state.setIndex + 1} de ${nextEx.sets}`}</div>
      <div class="rest-note">Al llegar a 0 pasa solo al siguiente ejercicio</div>
      <div class="rest-actions">
        <button class="btn btn-secondary" id="minus30">−30 s</button>
        <button class="btn btn-primary" id="skip">Saltar descanso</button>
      </div>
      </div>
    </div>
  `);

  document.getElementById('go-home').onclick = () => { clearInterval(restInterval); showHome(); };
  document.getElementById('back-step').onclick = () => backToPreviousSet(state);

  const clock = document.getElementById('clock');
  const ring = document.getElementById('ring');

  function tick() {
    const remaining = Math.round((state.rest.endAt - Date.now()) / 1000);
    if (remaining <= 0) {
      clearInterval(restInterval);
      notifyRestOver();
      showExercise(state);
      return;
    }
    const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
    const ss = String(remaining % 60).padStart(2, '0');
    clock.textContent = `${mm}:${ss}`;
    ring.style.width = Math.max(0, Math.min(100, (remaining / state.rest.total) * 100)) + '%';
  }

  clearInterval(restInterval);
  restInterval = setInterval(tick, 1000);
  tick();

  document.getElementById('minus30').onclick = () => {
    state.rest.endAt -= 30 * 1000;
    state.rest.total = Math.max(1, state.rest.total - 30);
    saveActive(state);
    tick();
  };
  document.getElementById('skip').onclick = () => { clearInterval(restInterval); showExercise(state); };
}

function finishWorkout(state) {
  clearInterval(restInterval);
  const history = loadHistory();
  history.push({
    date: new Date().toISOString(),
    type: state.type,
    exercises: state.log
  });
  saveHistory(history);
  clearActive();

  render(`
    <div class="screen center">
      <div class="spacer"></div>
      <div class="done-emoji">✓</div>
      <h2>${ROUTINE[state.type].label} completada</h2>
      <p class="muted">Próxima vez: Sesión ${state.type === 'A' ? 'B' : 'A'}</p>
      <div class="card">
        <table class="summary">
          <tr><th>Ejercicio</th><th style="text-align:right">Series</th></tr>
          ${state.log.map(e => `<tr><td>${e.name}</td><td class="sets">${formatSets(e.sets, e.unit)}</td></tr>`).join('')}
        </table>
      </div>
      <div class="spacer"></div>
      <button class="btn btn-primary" id="home">Listo</button>
    </div>
  `);
  document.getElementById('home').onclick = showHome;
}

function showHistory() {
  const history = loadHistory().slice().reverse();

  render(`
    <div class="screen">
      <div class="topbar">
        <button class="back" id="back">← Volver</button>
        <button class="back" id="export">Exportar JSON</button>
      </div>
      <h2>Historial</h2>
      ${history.length === 0 ? '<p class="muted">Todavía no hay sesiones registradas.</p>' : ''}
      ${history.map(s => `
        <div class="card history-item">
          <div class="h-date">${ROUTINE[s.type].label} — ${new Date(s.date).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
          <div class="h-sets">${s.exercises.map(e => `${e.name}: ${formatSets(e.sets, e.unit) || '—'}`).join('<br>')}</div>
        </div>`).join('')}
    </div>
  `);

  document.getElementById('back').onclick = showHome;
  document.getElementById('export').onclick = () => {
    const blob = new Blob([JSON.stringify(loadHistory(), null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `lazygood-historial-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };
}

// ---------- boot ----------
showHome();

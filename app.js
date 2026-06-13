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

// Double progression: if every set of the last session hit the top of the
// rep range, suggest adding weight; otherwise suggest beating last numbers.
function suggestionFor(ex) {
  const last = lastPerformance(ex.id);
  if (!last) {
    return { type: 'new', weight: null,
      html: `Primera vez con este ejercicio. Empieza <strong>liviano</strong>, aprende el movimiento y deja 1-2 reps en reserva.` };
  }
  const maxWeight = Math.max(...last.sets.map(s => s.weight));
  const allTopped = last.sets.every(s => s.reps >= ex.repMax);
  if (allTopped) {
    const next = maxWeight + ex.increment;
    return { type: 'up', weight: next,
      html: `La vez pasada llegaste al tope (${formatSets(last.sets)}). <strong>Sube a ${next} kg</strong> y vuelve a ${ex.repMin}-${ex.repMin + 1} reps.` };
  }
  return { type: 'beat', weight: maxWeight,
    html: `La vez pasada: ${formatSets(last.sets)}. <strong>Iguala el peso y supera las reps</strong>, aunque sea por una.` };
}

function formatSets(sets) {
  return sets.map(s => `${s.weight}kg×${s.reps}`).join(' · ');
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

function round25(x) {
  return Math.max(0, Math.round(x / 2.5) * 2.5);
}

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

function showHome() {
  const type = nextSessionType();
  const session = ROUTINE[type];
  const history = loadHistory();
  const last = history[history.length - 1];
  const active = loadActive();

  render(`
    <div class="screen">
      <div class="logo">LazyGood</div>
      <div>
        <div class="home-session">Hoy toca:<br>${session.label}</div>
        <div class="home-sub">${todayStr()}${last ? ` · última sesión: ${new Date(last.date).toLocaleDateString('es-CO')}` : ''}</div>
      </div>
      <div class="exercise-list">
        ${session.exercises.map(ex => `
          <div class="exercise-row">
            <img src="${ex.imgs[0]}" alt="">
            <div>
              <div class="ex-name">${ex.name}</div>
              <div class="ex-scheme">${ex.sets} × ${ex.repMin}-${ex.repMax} reps${ex.unilateral ? ' por pierna' : ''}</div>
            </div>
          </div>`).join('')}
      </div>
      <div class="spacer"></div>
      ${active ? `<button class="btn btn-secondary" id="resume">Continuar sesión en curso</button>` : ''}
      <button class="btn btn-primary btn-big" id="start">Empezar ${session.label}</button>
      <button class="btn btn-ghost" id="history">Ver historial · Exportar</button>
      <div class="credits">Fotos: <a href="https://github.com/yuhonas/free-exercise-db">free-exercise-db</a> (dominio público) · Diagramas musculares: <a href="https://wger.de">wger.de</a> (CC-BY-SA)</div>
    </div>
  `);

  document.getElementById('start').onclick = () => startWorkout(type);
  document.getElementById('history').onclick = showHistory;
  const resume = document.getElementById('resume');
  if (resume) resume.onclick = () => { const st = loadActive(); showExercise(st); };
}

function startWorkout(type) {
  if (loadActive() && !confirm('Hay una sesión sin terminar. ¿Empezar una nueva y descartarla?')) {
    return;
  }
  const state = {
    type,
    startedAt: new Date().toISOString(),
    exIndex: 0,
    setIndex: 0,
    warmupIndex: 0,
    log: ROUTINE[type].exercises.map(ex => ({ id: ex.id, name: ex.name, sets: [] }))
  };
  saveActive(state);
  showExercise(state);
}

function showExercise(state) {
  const session = ROUTINE[state.type];
  const ex = session.exercises[state.exIndex];
  const sug = suggestionFor(ex);
  const warmup = inWarmup(state) ? WARMUPS[state.warmupIndex || 0] : null;
  const workWeight = sug.weight || 20;
  const prevSet = state.log[state.exIndex].sets[state.setIndex - 1];
  const defaultWeight = warmup ? round25(workWeight * warmup.pct)
    : (prevSet ? prevSet.weight : workWeight);
  const defaultReps = warmup ? warmup.reps : ex.repMin;
  const totalSets = WARMUPS.length + session.exercises.reduce((n, e) => n + e.sets, 0);
  const doneSets = (state.warmupIndex || 0) + state.log.reduce((n, e) => n + e.sets.length, 0);

  render(`
    <div class="screen">
      <div class="progress-bar">
        ${Array.from({ length: totalSets }, (_, i) =>
          `<span class="${i < WARMUPS.length ? 'wu ' : ''}${i < doneSets ? 'done' : i === doneSets ? 'current' : ''}"></span>`).join('')}
      </div>
      <div class="ex-header">
        <div class="machine">${ex.machine}</div>
        <h2>${ex.name}</h2>
        <div class="pattern">${ex.pattern} · ejercicio ${state.exIndex + 1} de ${session.exercises.length}</div>
      </div>
      <img class="demo" id="demo" src="${ex.imgs[0]}" alt="Demostración de ${ex.name}">
      <div class="muscles-block">
        <div class="muscle-maps">${muscleMapsHTML(ex)}</div>
        <div class="muscles">
          <div><strong>${ex.musclesMain}</strong></div>
          <div class="support">apoyo: ${ex.musclesSupport}</div>
          <div class="legend"><span class="dot main"></span> principal <span class="dot sec"></span> apoyo</div>
        </div>
      </div>
      ${warmup ? `
      <div class="set-info">
        <span class="set-label warmup-label">🔥 Calentamiento ${(state.warmupIndex || 0) + 1} de ${WARMUPS.length}</span>
        <span class="rep-target">${warmup.reps} reps ligeras</span>
      </div>
      <div class="suggestion warmup">Serie de aproximación: <strong>${warmup.label}</strong> (~${defaultWeight} kg). Sirve para calentar y ensayar la técnica — no cuenta para el registro.</div>` : `
      <div class="set-info">
        <span class="set-label">Serie ${state.setIndex + 1} de ${ex.sets}</span>
        <span class="rep-target">${ex.repMin}-${ex.repMax} reps${ex.unilateral ? ' /pierna' : ''}</span>
      </div>
      <div class="suggestion ${sug.type === 'up' ? 'up' : ''}">${sug.html}</div>`}
      <details class="cues-box">
        <summary>Cómo se hace</summary>
        <ul class="cues">${ex.cues.map(c => `<li>${c}</li>`).join('')}</ul>
      </details>
      <div class="inputs">
        <div class="input-group">
          <label>Peso (kg)</label>
          <div class="stepper">
            <button id="w-minus">−</button>
            <input id="weight" type="number" inputmode="decimal" step="2.5" value="${defaultWeight}">
            <button id="w-plus">+</button>
          </div>
        </div>
        <div class="input-group">
          <label>Reps hechas</label>
          <div class="stepper">
            <button id="r-minus">−</button>
            <input id="reps" type="number" inputmode="numeric" value="${defaultReps}">
            <button id="r-plus">+</button>
          </div>
        </div>
      </div>
      <button class="btn btn-primary btn-big" id="done-set">${warmup ? '✓ Calentamiento hecho' : '✓ Serie hecha'}</button>
      ${state.rest ? '<button class="btn btn-ghost" id="back-rest">↩ Volver al descanso</button>' : ''}
      <button class="btn btn-ghost" id="abort">Salir de la sesión</button>
    </div>
  `);

  animateDemo(document.getElementById('demo'), ex.imgs);

  const weightInput = document.getElementById('weight');
  const repsInput = document.getElementById('reps');
  document.getElementById('w-minus').onclick = () => weightInput.value = Math.max(0, parseFloat(weightInput.value || 0) - 2.5);
  document.getElementById('w-plus').onclick = () => weightInput.value = parseFloat(weightInput.value || 0) + 2.5;
  document.getElementById('r-minus').onclick = () => repsInput.value = Math.max(0, parseInt(repsInput.value || 0) - 1);
  document.getElementById('r-plus').onclick = () => repsInput.value = parseInt(repsInput.value || 0) + 1;

  document.getElementById('done-set').onclick = () => {
    if (warmup) {
      state.warmupIndex = (state.warmupIndex || 0) + 1;
      startRest(state, WARMUP_REST_SEC, false);
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

  const backRest = document.getElementById('back-rest');
  if (backRest) backRest.onclick = () => {
    // If the original rest already expired, restart it full; otherwise resume.
    if (state.rest.endAt <= Date.now()) {
      state.rest.endAt = Date.now() + state.rest.total * 1000;
      saveActive(state);
    }
    showRest(state);
  };

  document.getElementById('abort').onclick = () => {
    if (confirm('¿Salir? La sesión quedará guardada para continuar después.')) showHome();
  };
}

let restInterval = null;

// Rest state is stored on the session so the exercise screen can return to it
// (e.g. after skipping by mistake) and so a reload mid-rest keeps the timer.
function startRest(state, seconds, isExerciseChange) {
  state.rest = { endAt: Date.now() + seconds * 1000, total: seconds, change: !!isExerciseChange };
  saveActive(state);
  showRest(state);
}

function showRest(state) {
  const session = ROUTINE[state.type];
  const nextEx = session.exercises[state.exIndex];

  render(`
    <div class="screen rest-screen">
      <div class="rest-title">${state.rest.change ? 'Descansa antes del siguiente ejercicio' : 'Descansa'}</div>
      <div class="rest-clock" id="clock">--:--</div>
      <div class="rest-ring"><div id="ring" style="width:100%"></div></div>
      <div class="rest-hint">🚶 Camina mientras tanto — suma pasos</div>
      <div class="rest-next">Sigue: <strong>${nextEx.name}</strong> · ${inWarmup(state) ? `Calentamiento ${(state.warmupIndex || 0) + 1} de ${WARMUPS.length}` : `Serie ${state.setIndex + 1} de ${nextEx.sets}`}</div>
      <div class="rest-note">Al llegar a 0 pasa solo al siguiente ejercicio</div>
      <div class="spacer"></div>
      <div class="rest-actions">
        <button class="btn btn-secondary" id="plus30">+30 s</button>
        <button class="btn btn-primary" id="skip">Saltar descanso →</button>
      </div>
    </div>
  `);

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

  document.getElementById('plus30').onclick = () => {
    state.rest.endAt += 30 * 1000;
    state.rest.total += 30;
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
      <div class="done-emoji">💪</div>
      <h2>${ROUTINE[state.type].label} completada</h2>
      <p class="muted">Próxima vez: Sesión ${state.type === 'A' ? 'B' : 'A'}</p>
      <div class="card">
        <table class="summary">
          <tr><th>Ejercicio</th><th style="text-align:right">Series</th></tr>
          ${state.log.map(e => `<tr><td>${e.name}</td><td class="sets">${formatSets(e.sets)}</td></tr>`).join('')}
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
          <div class="h-sets">${s.exercises.map(e => `${e.name}: ${formatSets(e.sets) || '—'}`).join('<br>')}</div>
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

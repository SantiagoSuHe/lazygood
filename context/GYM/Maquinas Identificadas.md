# Máquinas Identificadas — Gym del Conjunto

> Identificación de las fotos de esta carpeta para corregir las máquinas que la app muestra mal.
> Patrón: `[EV]` empuje vertical · `[EH]` empuje horizontal · `[TV]` tracción vertical · `[TH]` tracción horizontal · `[R]` dominante de rodilla · `[C]` dominante de cadera · `[U]` unilateral.
> Confianza: ✅ seguro · ⚠️ probable, confirmar.

---

## Máquina 1 — Hammer Strength blanca, de discos (carpeta `maquina 1/`)

Máquina de palanca cargada con discos (plate-loaded), marca **Hammer Strength**, color blanco/crema. Estructura **vertical** con almohadillas para los hombros (de pie), plataforma para los pies y soportes de discos. **No tiene asiento ni respaldo inclinado.**

| Foto | Identificación | Patrón | Ejercicios y músculos | Confianza |
|------|----------------|--------|------------------------|-----------|
| [IMG_6784](maquina%201/IMG_6784.jpeg), [IMG_6785](maquina%201/IMG_6785.jpeg) | **Elevación de talones de pie (standing calf raise)** | pantorrilla (aislamiento) | **Ejercicio:** elevación de talones de pie (plantarflexión del tobillo); rotar las puntas hacia dentro/fuera cambia el énfasis hacia la cabeza interna o externa del gemelo, y se puede hacer a una pierna. **Principal:** gastrocnemio (gemelo). **Secundario:** sóleo. Movimiento de **aislamiento** (solo articula el tobillo). | ✅ confirmado por el usuario |

> **Corrección importante:** antes la identifiqué como V-Squat/Hack Squat. Es un error. Es una máquina de **pantorrillas de pie**.
>
> **Consecuencia para la app:** [app/routine.js](../app/routine.js) usa la "Máquina Hammer blanca" para el `hack_squat` (V-Squat). Eso está mal — esta máquina **no hace sentadilla**. Hay que decidir qué hacer con la sentadilla (ver "Resumen para la app"). Además, la elevación de talones es un ejercicio de **aislamiento**, así que según la filosofía minimalista (compuestos 80/20) no debería ser un ejercicio principal de la rutina.

---

## Máquina 2 — Multiestación de 4 lados, marca Forma (carpeta `maquina 2/`)

Una sola estructura tipo **"4-Station Jungle Gym"** con placas de peso seleccionables (pin) y **una función por lado**. Es lo que la app llama genéricamente "multigym". El layout coincide con el estándar de estas máquinas: *multi press + lat pulldown/remo + extensión-curl de pierna + estación de brazos*.

| Foto | Ubicación | Lado / estación | Patrón | Ejercicios y músculos | Confianza |
|------|-----------|-----------------|--------|------------------------|-----------|
| [IMG_6790](maquina%202/IMG_6790.jpeg) | Costado izquierdo | **Polea alta y baja**: jalón dorsal (arriba) + remo sentado (abajo), con soportes de rodilla | `[TV]` + `[TH]` | **Jalón dorsal** (compuesto): principal dorsal ancho, redondo mayor y romboides; agarre amplio → más espalda alta, agarre estrecho/supino → más asistencia de bíceps. **Remo sentado** (compuesto): principal dorsal ancho y romboides; sec. bíceps, deltoides posterior, lumbares. **Extra:** de pie en la polea alta se puede hacer extensión de tríceps (jalón hacia abajo, aísla tríceps). | ✅ confirmado por el usuario |
| [IMG_6793](maquina%202/IMG_6793.jpeg) | Costado derecho | **Press de pecho** sentado (brazos convergentes, agarres naranja) | `[EH]` | **Press de pecho / hombro** (empuje guiado, compuesto): según la altura del asiento y el ángulo de los brazos → **press inclinado** (porción superior/clavicular del pectoral + deltoides anterior + tríceps) o **press de hombro vertical** (deltoides anterior y medio + tríceps). | ✅ confirmado por el usuario |
| [IMG_6792](maquina%202/IMG_6792.jpeg) | Parte trasera | **Contractora de pecho** (pec deck / aperturas; también deltoides posterior, respaldo vertical marca Forma) | pecho (aislamiento) | **Aperturas / flyes** de frente al respaldo (aislamiento): zona central y externa del pectoral mayor, evitando que ayuden los tríceps. **Vuelo invertido** sentándose al revés: deltoides posterior + trapecio medio + romboides. | ✅ confirmado por el usuario |
| [IMG_6791](maquina%202/IMG_6791.jpeg) | Frente | **Extensión y flexión de pierna** (cuádriceps e isquiotibiales, rodillo en las espinillas) | pierna (aislamiento) | **Extensión** (estirar la rodilla sentado, aislamiento): aísla los cuatro cuádriceps (vasto interno, externo, intermedio y recto femoral) sin reclutar glúteos ni isquios por la cadera fija. **Flexión/curl** (llevar el talón al glúteo, aislamiento): isquiotibiales; sec. gemelos como estabilizadores. | ✅ confirmado por el usuario |

> Los 4 lados quedan confirmados: poleas (jalón + remo), press de pecho, contractora de pecho y pierna.
> Para la app, el empuje compuesto es el **press** (IMG_6793). La **contractora** ([IMG_6792](maquina%202/IMG_6792.jpeg)) es aislamiento → opcional según la filosofía minimalista.

---

## Cardio

| Foto | Máquina | Uso | Músculos e impacto | Confianza |
|------|---------|-----|---------------------|-----------|
| [IMG_6783](IMG_6783.jpeg) | **Caminadora / trotadora** (treadmill) | Cardio: caminar, trotar o correr; ajusta velocidad e inclinación | Cuádriceps, isquiotibiales y gemelos en plano; **con inclinación elevada** la carga se transfiere mucho más a glúteos y pantorrillas (extensión de cadera). Caminar = bajo impacto; correr = alto impacto (carga rodillas/tobillos). | ✅ |
| [IMG_6787](IMG_6787.jpeg) | **Elíptica** (elliptical trainer) | Cardio sin impacto; trabaja tren superior e inferior a la vez | Cuerpo completo: cuádriceps, isquiotibiales, glúteos y pantorrillas abajo + pectorales, dorsales, bíceps y tríceps con el empuje/tracción de los bastones. Pedaleo en reversa → más glúteos e isquiotibiales. **Bajo impacto**, ideal para rodillas/caderas sensibles. | ✅ |
| [IMG_6788](IMG_6788.jpeg) | **Bicicleta de spinning** (Tomahawk) | Cardio de alta intensidad enfocado en piernas | Tren inferior: sentado en resistencia baja/media → cuádriceps y pantorrillas; **de pie o en "escaladas" con alta resistencia** → maximiza glúteos, isquiotibiales y core estabilizador. **Bajo impacto**. | ✅ |

---

## Peso libre y accesorios

| Foto | Qué es | Ejercicios y músculos | Confianza |
|------|--------|------------------------|-----------|
| [IMG_6789](IMG_6789.jpeg) | **Barra Z/EZ con discos + banco plano** (EZ bar & flat bench) | **Barra Z:** curl de bíceps de pie (bíceps braquial + braquial anterior, el agarre angulado alivia las muñecas), press francés tumbado (aísla las tres cabezas del tríceps) y remo inclinado con agarre supino o prono (dorsal ancho y romboides). **Banco plano:** habilita press de banca, remo a una mano, aperturas y pullover → empuje (pectoral, deltoides anterior, tríceps) o tirón (dorsal ancho, romboides, trapecio); core estabilizador. | ✅ confirmado por el usuario |
| [IMG_6786](IMG_6786.jpeg) | **5 Minute Shaper** (placa roja en el panel) — deslizador plegable de abdomen/core | **Ejercicio:** crunch invertido (deslizar las rodillas por el riel inclinado hacia el pecho); el cojín gira a los lados para enfatizar oblicuos. **Principal:** recto abdominal (sobre todo la porción inferior) y flexores de cadera (psoas ilíaco). **Secundario:** oblicuos, y como estabilizadores la zona lumbar, brazos y hombros. Aislamiento de core (activa el abdomen menos que un crunch tradicional, según ACE). | ✅ confirmado por el usuario |
| [IMG_6794](IMG_6794.jpeg) | **Ejercitador de abdominales de rodillo (ab roller)** — estructura de balanceo asistido | **Ejercicio:** encogimiento abdominal (crunch) **guiado**, con una almohadilla superior que apoya la cabeza/cuello y neutraliza la tensión cervical típica del abdominal libre. **Principal:** recto abdominal (zona frontal, "six pack"). Aislamiento de core. *(Nota: NO es un ab-wheel/rollout — es una estructura de balanceo asistido para crunches.)* | ✅ confirmado por el usuario |
| [IMG_6795](IMG_6795.jpeg) | **Barras paralelas portátiles para fondos** (push-up / dip bars) | **Ejercicios:** fondos con torso inclinado adelante (pectoral inferior + deltoides anterior + tríceps), fondos con torso recto (aíslan tríceps), flexiones profundas agarrando la base (pectoral mayor + tríceps con más rango que en el piso) y elevaciones de piernas / L-sits (recto abdominal isométrico + flexores de cadera dinámicos). **Fondos = compuesto de empuje** (pecho/tríceps/hombro). | ✅ confirmado por el usuario |
| [IMG_6796](IMG_6796.jpeg) | **Discos de peso estándar** (hierro fundido, hueco de 2.5 cm) | **Inventario limitado:** solo unos pocos de 5 lb y dos de 20 lb (~25 kg en total). Principalmente lastre para barras/mancuernas. **Por sí solos** permiten: giros rusos sentado (oblicuos y core), elevaciones frontales de pie (deltoides anterior) y sentadilla goblet abrazando el disco (cuádriceps, glúteos y erectores espinales). | ✅ |
| [IMG_6797](IMG_6797.jpeg) | **Par de mancuernas armables + disco olímpico** con seguros de mariposa (discos repartidos → ~12-13 kg por mano máx.) | **Ejercicios (a una mano/lado):** remo apoyado en banco (dorsal ancho, trapecio, romboides), curl alterno o concentrado (bíceps braquial), extensión de tríceps tras nuca (cabeza larga del tríceps), press de hombro a una mano (deltoides + tríceps), y zancadas sosteniendo el peso (cuádriceps y glúteos). El trabajo **unilateral** corrige desequilibrios entre lados y activa más el core. | ✅ confirmado por el usuario |

---

## Resumen para la app

Lo que la app puede prescribir con seguridad:

1. **Jalón al pecho** → Máquina 2, lado de poleas (parte alta) — `[TV]`
2. **Remo sentado** → Máquina 2, lado de poleas (parte baja) — `[TH]`
3. **Press de pecho** → Máquina 2, lado reclinado (IMG_6793) — `[EH]`
4. **Fondos en paralelas (dips)** → barras portátiles (IMG_6795) — `[EH]`/empuje, compuesto de pecho/tríceps/hombro
5. **Peso muerto, RDL, remo con barra, overhead press, búlgaras, sentadilla** → zona de peso libre (barras + discos + banco)
6. **Contractora de pecho** → Máquina 2, lado pec deck — *aislamiento, opcional*
7. **Extensión/curl de pierna** → Máquina 2, lado de pierna — *aislamiento, opcional*
8. **Elevación de talones** → Máquina 1 (Hammer blanca) — pantorrilla, *aislamiento, opcional*
9. **Abdomen/core** → 5 Minute Shaper (IMG_6786) o ab roller (IMG_6794) — *accesorio, opcional*

**Problema a resolver — la sentadilla:** la rutina actual hace el patrón de pierna (rodilla) en la "Máquina Hammer blanca", pero esa máquina es de pantorrillas. No hay máquina de sentadilla en el gym. Opciones:
- Hacer sentadilla / búlgara con **barra o mancuerna** (peso libre).
- Cambiar el ejercicio de pierna por algo de peso libre que ya esté en la rutina.

**Inventario completo y confirmado.** Las 15 fotos quedaron identificadas.

---

## Fuentes (ejercicios y músculos)

Información de ejercicios y músculos verificada en fuentes de referencia:

- [Healthline — Lat pulldown](https://www.healthline.com/health/fitness/lat-pulldown), [Bench press muscles](https://www.healthline.com/health/exercise-fitness/bench-press-muscles-worked), [Ab wheel](https://www.healthline.com/health/fitness-exercise/exercise-wheel), [Weighted dips](https://www.healthline.com/health/fitness-exercise/weighted-dips.html), [Elliptical vs treadmill](https://www.healthline.com/health/fitness-exercise/elliptical-vs-treadmill), [Spin class](https://www.healthline.com/health/benefits-of-a-spin-class)
- [ACE Fitness — Seated chest press](https://www.acefitness.org/resources/everyone/exercise-library/188/seated-chest-press/), [Unilateral training](https://www.acefitness.org/resources/pros/expert-articles/7035/the-benefits-of-unilateral-training/)
- [ExRx — Pec deck fly](https://exrx.net/WeightExercises/PectoralSternal/LVPecDeckFly), [Leg/hip raise](https://exrx.net/WeightExercises/RectusAbdominis/SLLegHipRaise)
- [StrengthLog — Seated leg curl](https://www.strengthlog.com/seated-leg-curl/), [EZ curl](https://www.strengthlog.com/ez-curl/)
- [Cleveland Clinic — Elliptical benefits](https://health.clevelandclinic.org/elliptical-machine-benefits)
- [Gravitus](https://gravitus.com/guides/exercises/standing-calf-raise/) y [Muscle & Strength — Standing calf raise](https://www.muscleandstrength.com/articles/standing-calf-raise-seated-bigger-calves)

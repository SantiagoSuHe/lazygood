// Routine definition — 2-day full-body program (A/B alternation).
// Based on: compound lifts, 1-3 sets, 4-10 reps, long rests.
// Images: free-exercise-db (public domain) — start/end position pairs.

const ROUTINE = {
  A: {
    label: 'Sesión A',
    exercises: [
      {
        id: 'hack_squat',
        muscleIdsMain: [10, 8],
        muscleIdsSupport: [11, 6],
        musclesMain: 'Cuádriceps y glúteos',
        musclesSupport: 'isquios, aductores, core',
        name: 'V-Squat / Hack Squat',
        machine: 'Máquina Hammer blanca',
        pattern: 'Pierna · empuje de rodilla',
        sets: 3,
        repMin: 4,
        repMax: 8,
        restSec: 240,
        increment: 5,
        unilateral: false,
        imgs: ['img/Hack_Squat_0.jpg', 'img/Hack_Squat_1.jpg'],
        cues: [
          'Hombros bajo las almohadillas, espalda pegada al respaldo.',
          'Baja controlado hasta muslos paralelos o un poco más.',
          'Empuja con toda la planta del pie, sin despegar talones.'
        ]
      },
      {
        id: 'chest_press',
        muscleIdsMain: [4],
        muscleIdsSupport: [2, 5],
        musclesMain: 'Pecho',
        musclesSupport: 'hombro frontal, tríceps',
        name: 'Press de pecho',
        machine: 'Multigym (o banca con barra)',
        pattern: 'Empuje horizontal',
        sets: 3,
        repMin: 4,
        repMax: 8,
        restSec: 240,
        increment: 2.5,
        unilateral: false,
        imgs: ['img/Leverage_Chest_Press_0.jpg', 'img/Leverage_Chest_Press_1.jpg'],
        cues: [
          'Ajusta el asiento: agarres a la altura del pecho.',
          'Saca el pecho y junta ligeramente las escápulas.',
          'Empuja hasta extender sin bloquear los codos de golpe.'
        ]
      },
      {
        id: 'lat_pulldown',
        muscleIdsMain: [12],
        muscleIdsSupport: [1, 9],
        musclesMain: 'Dorsales (espalda ancha)',
        musclesSupport: 'espalda alta, bíceps, antebrazos',
        name: 'Jalón al pecho',
        machine: 'Polea alta del multigym',
        pattern: 'Tracción vertical',
        sets: 3,
        repMin: 6,
        repMax: 10,
        restSec: 180,
        increment: 2.5,
        unilateral: false,
        imgs: ['img/Wide-Grip_Lat_Pulldown_0.jpg', 'img/Wide-Grip_Lat_Pulldown_1.jpg'],
        cues: [
          'Agarre más ancho que los hombros.',
          'Lleva la barra hacia la parte alta del pecho, codos hacia abajo.',
          'Sube controlado hasta estirar los brazos del todo.'
        ]
      },
      {
        id: 'rdl',
        muscleIdsMain: [11, 8],
        muscleIdsSupport: [9],
        musclesMain: 'Isquios y glúteos',
        musclesSupport: 'lumbares, agarre, trapecio',
        name: 'Peso muerto rumano (RDL)',
        machine: 'Barra recta',
        pattern: 'Cadera · bisagra',
        sets: 2,
        repMin: 6,
        repMax: 10,
        restSec: 180,
        increment: 5,
        unilateral: false,
        imgs: ['img/Romanian_Deadlift_0.jpg', 'img/Romanian_Deadlift_1.jpg'],
        cues: [
          'Rodillas apenas flexionadas, espalda recta siempre.',
          'Empuja la cadera hacia atrás; la barra baja rozando las piernas.',
          'Baja hasta sentir el estirón en los femorales y vuelve apretando glúteo.'
        ]
      }
    ]
  },
  B: {
    label: 'Sesión B',
    exercises: [
      {
        id: 'deadlift',
        muscleIdsMain: [8, 11],
        muscleIdsSupport: [10, 9, 6],
        musclesMain: 'Glúteos, isquios y lumbares',
        musclesSupport: 'cuádriceps, trapecio, core, agarre',
        name: 'Peso muerto convencional',
        machine: 'Barra recta',
        pattern: 'Cadera · cadena posterior',
        sets: 3,
        repMin: 4,
        repMax: 6,
        restSec: 300,
        increment: 5,
        unilateral: false,
        imgs: ['img/Barbell_Deadlift_0.jpg', 'img/Barbell_Deadlift_1.jpg'],
        cues: [
          'Barra sobre la mitad del pie, espinillas casi tocándola.',
          'Pecho arriba, espalda recta, brazos como ganchos.',
          'Empuja el piso con las piernas y termina erguido apretando glúteos.'
        ]
      },
      {
        id: 'ohp',
        muscleIdsMain: [2],
        muscleIdsSupport: [5, 9, 6],
        musclesMain: 'Hombros (3 cabezas)',
        musclesSupport: 'tríceps, trapecio, core',
        name: 'Overhead press de pie',
        machine: 'Barra recta',
        pattern: 'Empuje vertical',
        sets: 3,
        repMin: 4,
        repMax: 8,
        restSec: 240,
        increment: 2.5,
        unilateral: false,
        imgs: ['img/Standing_Military_Press_0.jpg', 'img/Standing_Military_Press_1.jpg'],
        cues: [
          'Sube la barra al pecho con un clean ligero.',
          'Aprieta glúteos y abdomen: nada de arquear la espalda.',
          'Empuja vertical y mete la cabeza al final, brazos extendidos.'
        ]
      },
      {
        id: 'row',
        muscleIdsMain: [12, 9],
        muscleIdsSupport: [1],
        musclesMain: 'Dorsales y espalda media',
        musclesSupport: 'bíceps, hombro posterior, lumbares',
        name: 'Remo con barra',
        machine: 'Barra recta (o mancuerna a una mano)',
        pattern: 'Tracción horizontal',
        sets: 3,
        repMin: 6,
        repMax: 10,
        restSec: 180,
        increment: 2.5,
        unilateral: false,
        imgs: ['img/Bent_Over_Barbell_Row_0.jpg', 'img/Bent_Over_Barbell_Row_1.jpg'],
        cues: [
          'Torso inclinado ~45°, espalda recta, rodillas suaves.',
          'Jala la barra hacia el ombligo, codos pegados al cuerpo.',
          'Baja controlado sin soltar la tensión de la espalda.'
        ]
      },
      {
        id: 'bulgarian',
        muscleIdsMain: [10, 8],
        muscleIdsSupport: [11, 6],
        musclesMain: 'Cuádriceps y glúteo',
        musclesSupport: 'isquios, core, estabilidad de cadera',
        name: 'Bulgarian split squat',
        machine: 'Mancuerna armable + banco',
        pattern: 'Pierna · unilateral',
        sets: 2,
        repMin: 6,
        repMax: 8,
        restSec: 150,
        increment: 2.5,
        unilateral: true,
        imgs: ['img/Split_Squat_with_Dumbbells_0.jpg', 'img/Split_Squat_with_Dumbbells_1.jpg'],
        cues: [
          'Empeine del pie trasero apoyado en el banco.',
          'Baja vertical hasta que el muslo delantero quede paralelo.',
          'Haz todas las reps con una pierna y cambia: eso cuenta como 1 serie.'
        ]
      }
    ]
  }
};

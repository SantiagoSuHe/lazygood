// Routine definition — 2-day full-body program (A/B alternation).
// Tuned to the building's gym: upper body on the Forma multi-station
// (own weight stack, unlimited progression); legs on dumbbells
// (only ~25 kg of plates → unilateral / goblet so the light load counts).
// Images: free-exercise-db (public domain) — start/end position pairs.

const ROUTINE = {
  A: {
    label: 'Sesión A',
    exercises: [
      {
        id: 'goblet_squat',
        youtubeId: 'eLX_dyvooKQ',
        muscleIdsMain: [10, 8],
        muscleIdsSupport: [11, 6],
        musclesMain: 'Cuádriceps y glúteos',
        musclesSupport: 'isquios, aductores, core',
        name: 'Sentadilla goblet',
        machine: 'Mancuerna cargada (a 2 manos)',
        pattern: 'Pierna · dominante de rodilla',
        sets: 3,
        repMin: 6,
        repMax: 10,
        restSec: 210,
        increment: 2.5,
        unilateral: false,
        imgs: ['img/Goblet_Squat_0.jpg', 'img/Goblet_Squat_1.jpg'],
        cues: [
          'Abraza una mancuerna contra el pecho, codos apuntando al suelo.',
          'Baja entre los pies hasta que los muslos queden paralelos o más.',
          'Empuja con toda la planta y mantén el pecho arriba todo el rato.'
        ]
      },
      {
        id: 'chest_press',
        youtubeId: 'VHIlmOPMWWs',
        muscleIdsMain: [4],
        muscleIdsSupport: [2, 5],
        musclesMain: 'Pecho',
        musclesSupport: 'hombro frontal, tríceps',
        name: 'Press de pecho',
        machine: 'Máquina Forma · press de pecho (lado derecho)',
        pattern: 'Empuje horizontal',
        sets: 3,
        repMin: 4,
        repMax: 8,
        restSec: 240,
        increment: 1,
        unilateral: false,
        unit: 'nivel',
        imgs: ['img/Leverage_Chest_Press_0.jpg', 'img/Leverage_Chest_Press_1.jpg'],
        cues: [
          'Ajusta el asiento: agarres a la altura del pecho.',
          'Saca el pecho y junta ligeramente las escápulas.',
          'Empuja hasta extender sin bloquear los codos de golpe.'
        ]
      },
      {
        id: 'lat_pulldown',
        youtubeId: '3q1Zsi3vkjo',
        muscleIdsMain: [12],
        muscleIdsSupport: [1, 9],
        musclesMain: 'Dorsales (espalda ancha)',
        musclesSupport: 'espalda alta, bíceps, antebrazos',
        name: 'Jalón al pecho',
        machine: 'Máquina Forma · polea alta (lado izquierdo)',
        pattern: 'Tracción vertical',
        sets: 3,
        repMin: 6,
        repMax: 10,
        restSec: 180,
        increment: 1,
        unilateral: false,
        unit: 'nivel',
        imgs: ['img/Wide-Grip_Lat_Pulldown_0.jpg', 'img/Wide-Grip_Lat_Pulldown_1.jpg'],
        cues: [
          'Fija los muslos bajo los soportes; agarre más ancho que los hombros.',
          'Lleva la barra hacia la parte alta del pecho, codos hacia abajo.',
          'Sube controlado hasta estirar los brazos del todo.'
        ]
      },
      {
        id: 'single_leg_rdl',
        youtubeId: 'JNivi_Nnj7E',
        muscleIdsMain: [11, 8],
        muscleIdsSupport: [9],
        musclesMain: 'Isquios y glúteos',
        musclesSupport: 'lumbares, core, estabilidad de cadera',
        name: 'Peso muerto rumano a una pierna',
        machine: 'Mancuerna',
        pattern: 'Cadera · bisagra unilateral',
        sets: 2,
        repMin: 8,
        repMax: 10,
        restSec: 150,
        increment: 2.5,
        unilateral: true,
        imgs: ['img/Kettlebell_One-Legged_Deadlift_0.jpg', 'img/Kettlebell_One-Legged_Deadlift_1.jpg'],
        cues: [
          'Mancuerna en la mano contraria a la pierna que trabaja.',
          'Empuja la cadera atrás y deja que la pierna libre suba detrás.',
          'Baja hasta sentir el estirón en el femoral y sube apretando glúteo. Cambia de pierna: cuenta como 1 serie.'
        ]
      }
    ]
  },
  B: {
    label: 'Sesión B',
    exercises: [
      {
        id: 'bulgarian',
        youtubeId: 'o7yFuIR9XVU',
        muscleIdsMain: [10, 8],
        muscleIdsSupport: [11, 6],
        musclesMain: 'Cuádriceps y glúteo',
        musclesSupport: 'isquios, core, estabilidad de cadera',
        name: 'Bulgarian split squat',
        machine: 'Par de mancuernas + banco',
        pattern: 'Pierna · unilateral',
        sets: 2,
        repMin: 6,
        repMax: 8,
        restSec: 180,
        increment: 2.5,
        unilateral: true,
        imgs: ['img/Split_Squat_with_Dumbbells_0.jpg', 'img/Split_Squat_with_Dumbbells_1.jpg'],
        cues: [
          'Empeine del pie trasero apoyado en el banco, una mancuerna en cada mano.',
          'Baja vertical hasta que el muslo delantero quede paralelo.',
          'Haz todas las reps con una pierna y cambia: eso cuenta como 1 serie.'
        ]
      },
      {
        id: 'shoulder_press',
        youtubeId: 'PM1hB_2xNBU',
        muscleIdsMain: [2],
        muscleIdsSupport: [5, 9, 6],
        musclesMain: 'Hombros (3 cabezas)',
        musclesSupport: 'tríceps, trapecio, core',
        name: 'Press de hombro',
        machine: 'Máquina Forma · press en modo vertical',
        pattern: 'Empuje vertical',
        sets: 3,
        repMin: 4,
        repMax: 8,
        restSec: 240,
        increment: 1,
        unilateral: false,
        unit: 'nivel',
        imgs: ['img/Leverage_Shoulder_Press_0.jpg', 'img/Leverage_Shoulder_Press_1.jpg'],
        cues: [
          'Ajusta el asiento para que los agarres queden a la altura de los hombros.',
          'Aprieta abdomen y glúteos: nada de arquear la espalda.',
          'Empuja vertical hasta extender los brazos y baja controlado.'
        ]
      },
      {
        id: 'seated_row',
        youtubeId: '8QuMq1GMMng',
        muscleIdsMain: [12, 9],
        muscleIdsSupport: [1],
        musclesMain: 'Dorsales y espalda media',
        musclesSupport: 'bíceps, hombro posterior, lumbares',
        name: 'Remo sentado',
        machine: 'Máquina Forma · polea baja (lado izquierdo)',
        pattern: 'Tracción horizontal',
        sets: 3,
        repMin: 6,
        repMax: 10,
        restSec: 180,
        increment: 1,
        unilateral: false,
        unit: 'nivel',
        imgs: ['img/Seated_Cable_Rows_0.jpg', 'img/Seated_Cable_Rows_1.jpg'],
        cues: [
          'Pecho arriba, espalda recta, rodillas algo flexionadas.',
          'Jala el agarre hacia el abdomen, codos pegados al cuerpo.',
          'Junta las escápulas al final y baja sin soltar la tensión.'
        ]
      },
      {
        id: 'rdl',
        youtubeId: 'wqMYwk_-P14',
        muscleIdsMain: [11, 8],
        muscleIdsSupport: [9],
        musclesMain: 'Isquios y glúteos',
        musclesSupport: 'lumbares, agarre, trapecio',
        name: 'Peso muerto rumano (RDL)',
        machine: 'Par de mancuernas',
        pattern: 'Cadera · bisagra',
        sets: 2,
        repMin: 8,
        repMax: 10,
        restSec: 150,
        increment: 2.5,
        unilateral: false,
        imgs: ['img/Stiff-Legged_Dumbbell_Deadlift_0.jpg', 'img/Stiff-Legged_Dumbbell_Deadlift_1.jpg'],
        cues: [
          'Una mancuerna en cada mano frente a los muslos, rodillas apenas flexionadas.',
          'Empuja la cadera hacia atrás; las mancuernas bajan rozando las piernas.',
          'Baja hasta sentir el estirón en los femorales y vuelve apretando glúteo.'
        ]
      }
    ]
  }
};

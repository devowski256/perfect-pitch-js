export const SOLFEGE = ['Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Ti'];
const MAJOR_SCALE_OFFSETS = [0, 2, 4, 5, 7, 9, 11]; // C, D, E, F, G, A, B

const A4Frequency = 440; // Hz
const A4Offset = 9;

export const NOTES = MAJOR_SCALE_OFFSETS.map(
  (n) => A4Frequency * Math.pow(2, (n - A4Offset) / 12)
);

export const NOTES_FIRST = NOTES[0];
export const NOTES_LAST = NOTES[NOTES.length - 1];

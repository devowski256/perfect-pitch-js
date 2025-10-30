export const SOLFEGE = ['Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Ti'];
const SEMITONES = [0, 2, 4, 5, 7, 9, 11]; // C, D, E, F, G, A, B

const A4 = 440; // reference
const A4Note = 9; // A = 9th semitone in octave (C=0)

export const NOTES = SEMITONES.map((n) => A4 * Math.pow(2, (n - A4Note) / 12));

export const NOTES_FIRST = NOTES[0];
export const NOTES_LAST = NOTES[NOTES.length - 1];

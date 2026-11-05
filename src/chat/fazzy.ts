// Fazzy, the Fazed mascot: hand-designed pixel art kept as text rows (from the #08 PLAIN TEXT site's brand/fazzy.ts).
// The head is the lime F-mark with a dark visor and two LED eyes; black suit with lime stripes.
const PAL: Record<string, string> = { H: '--fazzy-bevel', L: '--lime', l: '--fazzy-shade', V: '--fazzy-visor', E: '--fazzy-led', K: '--fazzy-suit', S: '--lime', B: '--fazzy-boot' };

export const HEAD = [
  '...HHHHHHHHHHHH...',
  '..LLLLLLLLLLLLLl..',
  '..LVVVVVVVVVVVVl..',
  '..LLLLLLLLLLLLLl..',
  '..LLLVVVVVVVVVVl..',
  '..LLLLLVVVVVVVVl..',
  '..LLLLLVEEVVEEVl..',
  '..LLLLLVVVVVVVVl..',
  '..LLLLLLLLLLLLLl..',
  '...llllllllllll...',
];
const BODY = [
  '.......KKKK.......',
  '.....KKKKKKKK.....',
  '....KKKSSSSKKK....',
  '...KKKKKSSKKKKK...',
  '..KK.KKKKKKKK.KK..',
  '..KK.KKKKKKKK.KK..',
  '..SS.KKKKKKKK.SS..',
  '..KK..KKKKKK..KK..',
];
const LEGS = ['......KK..KK......', '......SS..SS......', '......KK..KK......', '.....BBB..BBB.....', '.....SSS..SSS.....'];
const WALK_A = ['......KK..KK......', '......SS..SS......', '......KK...KK.....', '.....BBB...BBB....', '.....SSS..........'];
const WALK_B = ['......KK..KK......', '......SS..SS......', '.....KK...KK......', '....BBB...BBB.....', '..........SSS.....'];

const put = (row: string, col: number, chars: string) => row.slice(0, col) + chars + row.slice(col + chars.length);
// rows are padded to 22 wide so raised arms clear the head by a pixel
const pad = (rows: string[]) => rows.map((r) => `..${r}..`);
function armUp(rows: string[], side: 'L' | 'R', handRow: number) {
  const r = [...rows], arm = side === 'L' ? 4 : 16, c = side === 'L' ? 0 : 20;
  for (let y = 14; y <= 17; y++) r[y] = put(r[y], arm, '..');
  for (let y = handRow; y <= 10; y++) r[y] = put(r[y], c, y === handRow + 1 ? 'SS' : 'KK');
  r[11] = side === 'L' ? put(r[11], 1, 'KKKK') : put(r[11], 17, 'KKKK');
  r[12] = side === 'L' ? put(r[12], 3, 'KKK') : put(r[12], 16, 'KKK');
  return r;
}

export type Pose = 'wave' | 'hype' | 'walk';
/** Rows for a pose; frame 1 is the other half of the wave or the step. */
export function fazzyRows(pose: Pose, frame = 0): string[] {
  const rows = pad([...HEAD, ...BODY, ...(pose === 'walk' ? (frame ? WALK_A : WALK_B) : LEGS)]);
  if (pose === 'hype') return armUp(armUp(rows, 'R', 0), 'L', 0);
  if (pose !== 'wave') return rows;
  const r = armUp(rows, 'R', 2);
  if (frame) { r[2] = put(r[2], 20, '.K'); r[3] = put(r[3], 20, 'SK'); }
  return r;
}

/** The rows as one small SVG: a path per colour, runs of pixels merged. Eyes get a class so CSS can blink them. */
export function sprite(rows: string[], cls = ''): string {
  const paths = new Map<string, string>();
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; ) {
      const c = row[x];
      let end = x + 1;
      while (row[end] === c) end++;
      if (PAL[c]) paths.set(c, `${paths.get(c) ?? ''}M${x} ${y}h${end - x}v1h${x - end}z`);
      x = end;
    }
  });
  const body = [...paths].map(([c, d]) => `<path ${c === 'E' ? 'class="fzy-e" ' : ''}fill="var(${PAL[c]})" d="${d}"/>`).join('');
  return `<svg class="fzy ${cls}" viewBox="0 0 ${rows[0].length} ${rows.length}" shape-rendering="crispEdges" aria-hidden="true">${body}</svg>`;
}

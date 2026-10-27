// Dot-matrix jack-o'-lantern for the Halloween takeover (/halloween, its OG and the IG kit).
// Pure geometry in a 100×100 box: returns dots with a role so callers can colour them (body, face, stem).
const inEl = (x, y, cx, cy, rx, ry) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1;
const inTri = (x, y, [ax, ay], [bx, by], [cx, cy]) => {
  const d = (bx - ax) * (cy - ay) - (by - ay) * (cx - ax);
  const s = ((bx - ax) * (y - ay) - (by - ay) * (x - ax)) / d, t = ((x - ax) * (cy - ay) - (y - ay) * (cx - ax)) / d;
  return s >= 0 && t >= 0 && s + t <= 1;
};
const body = (x, y) => inEl(x, y, 50, 60, 31, 27) || inEl(x, y, 33, 61, 18, 25) || inEl(x, y, 67, 61, 18, 25);
const face = (x, y) =>
  inTri(x, y, [28, 56], [45, 56], [36.5, 42]) || inTri(x, y, [55, 56], [72, 56], [63.5, 42]) || // eyes
  inTri(x, y, [45.5, 64], [54.5, 64], [50, 57.5]) || // nose
  (y >= 67 && y <= 78 && x >= 28 && x <= 72 && inEl(x, y, 50, 66, 23, 12.5) && // grin band…
    !((y < 71 && ((x > 37 && x < 41.5) || (x > 58.5 && x < 63))) || (y > 74 && x > 47.5 && x < 52.5))); // …with three teeth
const stem = (x, y) => y >= 24 && y <= 36 && x >= 46 + (36 - y) * 0.25 && x <= 54 + (36 - y) * 0.25;

/** @returns {{x:number,y:number,role:'body'|'face'|'stem',shade:number}[]} */
export function pumpkinDots(step = 2.2) {
  const out = [];
  for (let y = 22; y <= 90; y += step) for (let x = 12; x <= 88; x += step) {
    const role = stem(x, y) ? 'stem' : face(x, y) ? 'face' : body(x, y) ? 'body' : null;
    if (!role) continue;
    // ribs: shade by distance to the nearest of 5 vertical rib lines, curved with the body
    const rib = Math.abs(Math.cos(((x - 50) / 31) * Math.PI * 2.4 * (1 - ((y - 60) / 40) ** 2 * 0.3)));
    out.push({ x: +x.toFixed(2), y: +y.toFixed(2), role, shade: +(0.35 + 0.65 * rib).toFixed(2) });
  }
  return out;
}

// Header illustration: Maastricht along the Maas, seen past the Sint-Servaasbrug, with the red
// Sint-Janstoren, the Sint-Servaas and Onze-Lieve-Vrouwe basilicas and the Bonnefanten dome.
// Only shapes live here; the colours are the --sk-* tokens in styles.css, so dark mode turns it into night.

const W = 1600;
const H = 440;
const TOP = -420; // extra sky above the city: phones show the headline in it
const BASE = 320; // buildings stop here, behind the bridge
const WATER = 352; // water line: the bridge piers stand on it
const DECK = 290; // top of the bridge parapet

// Deterministic pseudo-random numbers, so the houses and stars look the same on every visit.
function random(seed) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

const r1 = (n) => Math.round(n * 10) / 10;

// One house front with a stepped gable (trapgevel), a pointed gable or a mansard roof.
function house(x, w, top, kind) {
  if (kind === "step") {
    const s = w / 7;
    const rise = (w * 0.5) / 4;
    let d = `M${r1(x)} ${BASE}`;
    for (let i = 1; i <= 4; i++) d += `V${r1(top - i * rise)}H${r1(x + i * s)}`;
    for (let i = 3; i >= 1; i--) d += `V${r1(top - i * rise)}H${r1(x + (8 - i) * s)}`;
    return d + `V${BASE}Z`;
  }
  if (kind === "gable") {
    return `M${r1(x)} ${BASE}V${r1(top)}L${r1(x + w / 2)} ${r1(top - w * 0.5)}L${r1(x + w)} ${r1(top)}V${BASE}Z`;
  }
  return `M${r1(x)} ${BASE}V${r1(top)}L${r1(x + w * 0.2)} ${r1(top - w * 0.28)}H${r1(x + w * 0.8)}L${r1(x + w)} ${r1(top)}V${BASE}Z`;
}

// A row of houses from x = from to x = to, with their windows (some lit at night).
function row(from, to, seed, high, low) {
  const rnd = random(seed);
  const kinds = ["step", "gable", "mansard"];
  let houses = "";
  let lit = "";
  let dark = "";
  for (let x = from; x < to; ) {
    let w = 20 + rnd() * 22;
    if (to - x - w < 14) w = to - x;
    const top = high + rnd() * (low - high);
    houses += house(x, w, top, kinds[Math.floor(rnd() * 3)]);
    const cols = Math.max(1, Math.floor((w - 6) / 9));
    const left = x + (w - (cols * 4 + (cols - 1) * 5)) / 2;
    for (let y = top + 7; y < DECK - 8; y += 12) {
      for (let c = 0; c < cols; c++) {
        const win = `M${r1(left + c * 9)} ${r1(y)}h4v6h-4z`;
        if (rnd() < 0.45) lit += win;
        else dark += win;
      }
    }
    x += w;
  }
  return { houses, lit, dark };
}

const HILLS = "M0 262C160 236 330 250 480 242S760 214 940 230S1250 222 1400 236S1560 240 1600 246V320H0Z";
// Sint-Martinuskerk in Wyck, in the distance.
const FAR_SPIRE = "M1052 320V222H1068V320Z M1050 222L1060 178L1070 222Z";
const OLV =
  "M498 320V196H534V320Z M498 196L516 184L534 196Z M488 320V182H500V320Z M487 182L494 160L501 182Z " +
  "M532 320V182H544V320Z M531 182L538 160L545 182Z M544 320V246L556 232H612V320Z";
const SERVAAS =
  "M660 320V214H736V320Z M672 214L698 192L724 214Z M696 194V178H700V194Z M652 320V192H672V320Z " +
  "M650 192L662 158L674 192Z M724 320V192H744V320Z M722 192L734 158L746 192Z M744 320V246L756 232H811V320Z";
const JAN_NAVE = "M849 320V250L862 236H926L936 250V320Z";
const JAN_TOWER =
  "M811 320V196H849V320Z M815 196V156H845V196Z M819 156V128H841V156Z M823 128V112H837V128Z " +
  "M822 112L830 82L838 112Z M829.3 82V73H830.7V82Z M811 196L813 184L815 196Z M845 196L847 184L849 196Z " +
  "M815 156L817 146L819 156Z M841 156L843 146L845 156Z";
const JAN_OPENINGS = "M823 212h5v24h-5z M832 212h5v24h-5z M826 164h8v20h-8z M827 134h6v14h-6z";
const BONNEFANTEN =
  "M1322 320V266H1500V320Z M1404 320V214H1436V320Z M1404 214C1404 186 1414 168 1420 156C1426 168 1436 186 1436 214Z";
const LANDMARK_WINDOWS =
  "M681 236h6v14h-6z M695 236h6v14h-6z M709 236h6v14h-6z M510 210h4v12h-4z M518 210h4v12h-4z " +
  "M868 256h5v14h-5z M884 256h5v14h-5z M900 256h5v14h-5z M916 256h5v14h-5z " +
  "M1334 274h4v6h-4z M1346 274h4v6h-4z M1358 274h4v6h-4z M1370 274h4v6h-4z M1452 274h4v6h-4z M1464 274h4v6h-4z M1476 274h4v6h-4z";
const TREES = [
  [470, 302, 14], [628, 296, 18], [646, 302, 14], [965, 300, 16], [985, 294, 20],
  [1290, 298, 18], [1310, 303, 14], [1515, 300, 16],
];
const LAMPS = [200, 600, 1000, 1400];

const BIKE =
  `<circle cx="-7" cy="-5" r="5"/><circle cx="8" cy="-5" r="5"/>` +
  `<path d="M-7 -5L-1 -5L-3 -12L-7 -5M-1 -5L5 -12L8 -5M-3 -12H5M5 -12L6 -15M-3 -13L-1 -22L6 -15M-3 -13L2 -9L-1 -5"/>` +
  `<circle class="sk-head" cx="0" cy="-25.5" r="2.7"/>`;
const rider = (x) => `<g transform="translate(${x} ${DECK})">${BIKE}</g>`;

const cloud = (x, y, s) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><ellipse rx="56" ry="10"/><circle cx="-20" cy="-8" r="16"/><circle cx="6" cy="-14" r="21"/><circle cx="30" cy="-5" r="13"/></g>`;

function stars() {
  const rnd = random(5);
  let out = "";
  for (let i = 0; i < 80; i++) {
    const x = r1(rnd() * W);
    const y = r1(TOP + 20 + rnd() * (200 - TOP));
    const r = r1(0.6 + rnd() * 1.1);
    const twinkle = i % 3 === 0 ? ` class="sk-twinkle" style="animation-delay:${r1(-rnd() * 5)}s"` : "";
    out += `<circle cx="${x}" cy="${y}" r="${r}"${twinkle}/>`;
  }
  return out;
}

function shimmer() {
  const rnd = random(19);
  let out = "";
  for (let i = 0; i < 64; i++) {
    const x = r1(rnd() * W);
    const y = r1(WATER + 6 + rnd() * 52);
    const len = r1(12 + rnd() * 40);
    out += `<path d="M${x} ${y}h${len}" style="animation-delay:${r1(-rnd() * 6)}s"/>`;
  }
  return out;
}

function draw() {
  const back = row(0, W, 7, 206, 244);
  const rows = [row(0, 488, 11, 238, 268), row(936, 1322, 37, 236, 266), row(1500, W, 41, 240, 266)];
  const houses = rows.map((r) => r.houses).join("");
  const lit = rows.map((r) => r.lit).join("") + LANDMARK_WINDOWS;
  // Three sets of windows that brighten and dim out of step at night.
  const litSets = ["", "", ""];
  lit.split(/(?=M)/).forEach((d, i) => (litSets[i % 3] += d));
  const dark = rows.map((r) => r.dark).join("");

  let bridge = `M-10 ${DECK + 8}H${W + 10}V${WATER}H-10Z`;
  let rings = "";
  for (let cx = 100; cx < W; cx += 200) {
    bridge += `M${cx - 70} ${WATER}A70 30 0 0 1 ${cx + 70} ${WATER}Z`;
    rings += `M${cx - 76} ${WATER}A76 35 0 0 1 ${cx + 76} ${WATER}`;
  }
  const posts = LAMPS.map((x) => `M${x - 1} ${DECK}V258h2v${DECK - 258}z M${x - 5} 250l5-4 5 4z`).join(" ");
  // Each lamp glows on its own beat: the lantern, its halo and its streak on the water together.
  const lamps = LAMPS.map((x, n) => {
    const beat = `style="animation-delay:${-n * 1.7}s"`;
    const streak = [0, 1, 2, 3, 4].map((i) => `M${x - 9 + 2 * i} ${WATER + 6 + i * 7}h${18 - 4 * i}`).join("");
    return `<path class="sk-lantern" ${beat} d="M${x - 4} 250h8v8h-8z"/>` +
      `<g class="sk-night sk-lamplight" ${beat}><circle cx="${x}" cy="254" r="26" fill="url(#sk-halo)"/><path class="sk-streak" d="${streak}"/></g>`;
  }).join("");

  return `<svg viewBox="0 ${TOP} ${W} ${H - TOP}" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
  <defs>
    <linearGradient id="sk-sky" gradientUnits="userSpaceOnUse" x1="0" y1="-160" x2="0" y2="${WATER}"><stop offset="0" class="sk-s1"/><stop offset=".6" class="sk-s2"/><stop offset="1" class="sk-s3"/></linearGradient>
    <linearGradient id="sk-water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="sk-w1"/><stop offset="1" class="sk-w2"/></linearGradient>
    <linearGradient id="sk-under" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="sk-u1"/><stop offset="1" class="sk-w1"/></linearGradient>
    <linearGradient id="sk-fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="sk-fade" stop-opacity="0"/><stop offset="1" class="sk-fade"/></linearGradient>
    <radialGradient id="sk-halo"><stop offset="0" class="sk-halo" stop-opacity=".6"/><stop offset="1" class="sk-halo" stop-opacity="0"/></radialGradient>
    <radialGradient id="sk-sunhalo"><stop offset=".4" class="sk-sun-stop" stop-opacity=".45"/><stop offset="1" class="sk-sun-stop" stop-opacity="0"/></radialGradient>
    <radialGradient id="sk-moonhalo"><stop offset=".2" class="sk-moon-stop" stop-opacity=".25"/><stop offset="1" class="sk-moon-stop" stop-opacity="0"/></radialGradient>
  </defs>
  <rect y="${TOP}" width="${W}" height="${WATER - TOP}" fill="url(#sk-sky)"/>
  <g class="sk-day">
    <circle class="sk-sunglow" cx="970" cy="214" r="120" fill="url(#sk-sunhalo)"/><circle class="sk-sun" cx="970" cy="214" r="46"/>
    <g class="sk-cloud sk-drift">${cloud(250, 118, 1)}${cloud(620, 128, 0.8)}${cloud(1450, 104, 1.1)}</g>
  </g>
  <g class="sk-night">
    <circle cx="970" cy="118" r="70" fill="url(#sk-moonhalo)"/><circle class="sk-moon" cx="970" cy="118" r="17"/>
    <g class="sk-star">${stars()}</g>
  </g>
  <path class="sk-far" d="${HILLS}"/>
  <path class="sk-back" d="${back.houses}${FAR_SPIRE}"/>
  <path class="sk-mid" d="${houses}${OLV}${SERVAAS}${JAN_NAVE}${BONNEFANTEN}"/>
  <path class="sk-jan" d="${JAN_TOWER}"/>
  <path class="sk-jan-dark" d="${JAN_OPENINGS}"/>
  <g class="sk-win">${litSets.map((d, i) => `<path d="${d}" style="animation-delay:${-i * 2.3}s"/>`).join("")}</g>
  <path class="sk-win-off" d="${dark}"/>
  <g class="sk-tree">${TREES.map(([cx, cy, r]) => `<circle cx="${cx}" cy="${cy}" r="${r}"/>`).join("")}</g>
  <rect y="${BASE}" width="${W}" height="${H - BASE}" fill="url(#sk-water)"/>
  <rect y="${BASE}" width="${W}" height="${WATER - BASE}" fill="url(#sk-under)"/>
  <use href="#sk-bridge" class="sk-reflect" transform="matrix(1 0 0 -1 0 ${2 * WATER})"/>
  <g class="sk-shine">${shimmer()}</g>
  <path id="sk-bridge" class="sk-bridge" fill-rule="evenodd" d="${bridge}"/>
  <path class="sk-ring" d="${rings}"/>
  <path class="sk-parapet" d="M-10 ${DECK}H${W + 10}V${DECK + 8}H-10Z"/>
  <path class="sk-lamp" d="${posts}"/>
  ${lamps}
  <g class="sk-rider"><g class="sk-ride">${rider(0)}</g></g>
  <rect y="400" width="${W}" height="${H - 400}" fill="url(#sk-fade)"/>
</svg>`;
}

export const SKYLINE = draw();

// The night sky goes on beyond the drawing: stars across the whole header, placed in percentages so they
// keep their shape at any width. Shown in dark mode only.
function starfield() {
  const rnd = random(23);
  let out = "";
  for (let i = 0; i < 55; i++) {
    const x = r1(rnd() * 100);
    const y = r1(rnd() ** 1.4 * 100); // denser towards the top
    const r = r1(0.5 + rnd() * 0.9);
    const twinkle = i % 3 === 0 ? ` class="sk-twinkle" style="animation-delay:${r1(-rnd() * 6)}s"` : "";
    out += `<circle cx="${x}%" cy="${y}%" r="${r}"${twinkle}/>`;
  }
  return `<svg class="sk-star" width="100%" height="100%" aria-hidden="true" focusable="false">${out}</svg>`;
}

export const STARFIELD = starfield();

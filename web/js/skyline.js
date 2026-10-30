// Header illustration: a quiet silhouette of Maastricht along the Maas, seen past the Sint-Servaasbrug,
// with the Sint-Janstoren, the Sint-Servaas and Onze-Lieve-Vrouwe basilicas and the Bonnefanten dome.
// Shapes only; the colours are the --sk-* tokens in styles.css.

const W = 1600;
const BASE = 320; // buildings stop here, behind the bridge
const WATER = 352; // the bridge piers stand on this line
const DECK = 296; // top of the bridge

// Deterministic pseudo-random numbers, so the houses look the same on every visit.
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

// A row of house fronts from x = from to x = to.
function row(from, to, seed, high, low) {
  const rnd = random(seed);
  const kinds = ["step", "gable", "mansard"];
  let d = "";
  for (let x = from; x < to; ) {
    let w = 24 + rnd() * 22;
    if (to - x - w < 16) w = to - x;
    d += house(x, w, high + rnd() * (low - high), kinds[Math.floor(rnd() * 3)]);
    x += w;
  }
  return d;
}

// Sint-Martinuskerk in Wyck, in the distance.
const FAR_SPIRE = "M1052 320V222H1068V320Z M1050 222L1060 178L1070 222Z";
const OLV =
  "M498 320V196H534V320Z M498 196L516 184L534 196Z M488 320V182H500V320Z M487 182L494 160L501 182Z " +
  "M532 320V182H544V320Z M531 182L538 160L545 182Z M544 320V246L556 232H612V320Z";
const SERVAAS =
  "M660 320V214H736V320Z M672 214L698 192L724 214Z M696 194V178H700V194Z M652 320V192H672V320Z " +
  "M650 192L662 158L674 192Z M724 320V192H744V320Z M722 192L734 158L746 192Z M744 320V246L756 232H811V320Z";
const JAN =
  "M849 320V250L862 236H926L936 250V320Z M811 320V196H849V320Z M815 196V156H845V196Z M819 156V128H841V156Z " +
  "M823 128V112H837V128Z M822 112L830 82L838 112Z M829.3 82V73H830.7V82Z M811 196L813 184L815 196Z " +
  "M845 196L847 184L849 196Z M815 156L817 146L819 156Z M841 156L843 146L845 156Z";
const BONNEFANTEN =
  "M1322 320V266H1500V320Z M1404 320V214H1436V320Z M1404 214C1404 186 1414 168 1420 156C1426 168 1436 186 1436 214Z";

function draw() {
  const back = row(0, W, 7, 214, 248);
  const front = row(0, 488, 11, 244, 270) + row(936, 1322, 37, 242, 268) + row(1500, W, 41, 246, 268);
  // The bridge spans the whole view; two arches, under the Sint-Janstoren.
  let bridge = `M-10 ${DECK}H${W + 10}V${WATER}H-10Z`;
  for (const cx of [700, 900]) bridge += `M${cx - 70} ${WATER}A70 30 0 0 1 ${cx + 70} ${WATER}Z`;

  return `<svg viewBox="0 64 ${W} 300" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
  <defs>
    <linearGradient id="sk-fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="sk-fade" stop-opacity="0"/><stop offset="1" class="sk-fade"/></linearGradient>
  </defs>
  <path class="sk-back" d="${back}${FAR_SPIRE}"/>
  <path class="sk-mid" d="${front}${OLV}${SERVAAS}${JAN}${BONNEFANTEN}"/>
  <path class="sk-bridge" fill-rule="evenodd" d="${bridge}"/>
  <rect y="300" width="${W}" height="64" fill="url(#sk-fade)"/>
</svg>`;
}

export const SKYLINE = draw();

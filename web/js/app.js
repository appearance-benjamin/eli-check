import { QUESTIONS, CHILD_BANDS, visibleQuestions } from "./questions.js";
import { t, L, getLang, setLang, money, number } from "./i18n.js";
import { SCHEMES, STATIC_TIPS, HELP, CAUSE, CONDITION_TEXT, conditionPrefix } from "./benefits.js";
import { calculate } from "./api.js";
import { icon, chevron, check, external } from "./icons.js";
import { mountGradientWave } from "./gradient-wave.js";

const app = document.getElementById("app");
const progress = document.querySelector(".progress");
const progressBar = document.querySelector(".progress-bar");
const STORE = "elicheck.answers.v1";
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let answers = loadAnswers();
let lastIndex = -1;
let editingFromReview = false;
let cachedResult = null;

// ---------- state ----------

function loadAnswers() {
  try {
    return JSON.parse(sessionStorage.getItem(STORE)) || {};
  } catch {
    return {};
  }
}

function saveAnswers() {
  try {
    sessionStorage.setItem(STORE, JSON.stringify(answers));
  } catch {}
}

const isAnswered = (q) => answers[q.id] != null;
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

/** Parse "1.500", "1,500", "1500,50" or "€ 1 500" into a number. */
function parseAmount(raw) {
  let s = String(raw).replace(/[^\d.,]/g, "");
  if (!s) return null;
  const m = s.match(/[.,](\d{1,2})$/);
  let decimals = "";
  if (m) {
    decimals = "." + m[1];
    s = s.slice(0, -m[0].length);
  }
  const n = Number(s.replace(/[.,]/g, "") + decimals);
  return Number.isFinite(n) ? n : null;
}

// ---------- routing ----------

function go(hash) {
  if (location.hash === hash) route();
  else location.hash = hash;
}

function route() {
  const [view, id] = location.hash.replace(/^#\/?/, "").split("/");
  if (view === "q" && QUESTIONS.some((q) => q.id === id)) return renderQuestion(id);
  if (view === "review") return renderReview();
  if (view === "results") return renderResults();
  lastIndex = -1;
  renderHome();
}

function firstUnanswered() {
  return visibleQuestions(answers).find((q) => !isAnswered(q));
}

function next(fromId) {
  saveAnswers();
  cachedResult = null;
  const list = visibleQuestions(answers);
  if (editingFromReview) {
    const missing = firstUnanswered();
    return go(missing ? `#/q/${missing.id}` : "#/review");
  }
  const i = list.findIndex((q) => q.id === fromId);
  const following = list[i + 1];
  go(following ? `#/q/${following.id}` : "#/review");
}

function back(fromId) {
  const list = visibleQuestions(answers);
  const i = list.findIndex((q) => q.id === fromId);
  if (editingFromReview) return go("#/review");
  go(i > 0 ? `#/q/${list[i - 1].id}` : "#/");
}

// ---------- chrome ----------

function mount(html, { dir = "fwd" } = {}) {
  app.innerHTML = `<div class="screen ${dir === "back" ? "back" : ""}">${html}</div>`;
  window.scrollTo({ top: 0, behavior: "instant" });
}

function setProgress(fraction) {
  if (fraction == null) {
    progress.classList.remove("is-active");
    progressBar.style.width = "0";
    return;
  }
  progress.classList.add("is-active");
  progressBar.style.width = `${Math.max(3, fraction * 100)}%`;
}

function renderChrome() {
  document.documentElement.lang = getLang();
  document.title = t("title");
  document.querySelectorAll("[data-lang]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === getLang())));
  document.getElementById("footer-text").textContent = t("footer");
  document.getElementById("source-link").textContent = t("sourceCode");
  const label = t(document.documentElement.dataset.theme === "dark" ? "themeToLight" : "themeToDark");
  themeButton.setAttribute("aria-label", label);
  themeButton.title = label;
}

document.querySelectorAll("[data-lang]").forEach((b) =>
  b.addEventListener("click", () => {
    setLang(b.dataset.lang);
    renderChrome();
    route();
  }),
);

// ---------- theme ----------

const THEME_KEY = "elicheck.theme";
const themeButton = document.getElementById("theme-toggle");

function savedTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    return saved === "light" || saved === "dark" ? saved : null;
  } catch {
    return null;
  }
}

// Slow pastel wave behind the whole page; its colours are the --wave token of the current theme.
const waveColors = () => getComputedStyle(document.documentElement).getPropertyValue("--wave").trim().split(/\s+/);
const wave = mountGradientWave(document.querySelector(".backdrop"), {
  colors: waveColors(),
  noiseSpeed: 0.000004,
  deform: { incline: 0.2, noiseAmp: 200, noiseFlow: 3 },
  startTime: 6000,
});

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]').content = theme === "dark" ? "#000000" : "#fbfbfd";
  wave?.setColors(waveColors());
  renderChrome();
}

themeButton.addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch {}
  // Cross-fade the whole page where the browser supports it.
  if (document.startViewTransition && !reducedMotion) document.startViewTransition(() => applyTheme(next));
  else applyTheme(next);
});

// Follow the system setting until the visitor picks a theme themselves.
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
  if (!savedTheme()) applyTheme(e.matches ? "dark" : "light");
});

// ---------- home ----------

function renderHome() {
  setProgress(null);
  mount(`
    <div class="home">
      <section class="hero">
        <p class="eyebrow">${t("heroEyebrow")}</p>
        <h1>${t("heroTitleA")}<span class="bloom-text">${t("heroTitleB")}</span></h1>
        <p class="lead">${t("heroLead")}</p>
        <div class="hero-actions">
          <button type="button" class="btn btn-primary btn-large" data-action="start">${t("getStarted")}</button>
          <button type="button" class="btn btn-link" data-action="how">${t("howItWorks")} ${chevron}</button>
        </div>
        <p class="hero-meta">${t("heroMeta")}</p>
      </section>

      <section class="paths">
        <button type="button" class="path path-student" data-action="student">
          <span class="path-icon">${icon("student")}</span>
          <h2>${t("pathStudentTitle")}</h2>
          <p>${t("pathStudentText")}</p>
          <span class="path-cta">${t("start")} ${chevron}</span>
        </button>
        <button type="button" class="path path-everyone" data-action="everyone">
          <span class="path-icon">${icon("people")}</span>
          <h2>${t("pathEveryoneTitle")}</h2>
          <p>${t("pathEveryoneText")}</p>
          <span class="path-cta">${t("start")} ${chevron}</span>
        </button>
      </section>

      <section class="features">
        <div class="feature">${icon("lock")}<h3>${t("feat1Title")}</h3><p>${t("feat1Text")}</p></div>
        <div class="feature">${icon("code")}<h3>${t("feat2Title")}</h3><p>${t("feat2Text")}</p></div>
        <div class="feature">${icon("arrow")}<h3>${t("feat3Title")}</h3><p>${t("feat3Text")}</p></div>
      </section>

      <section class="steps" id="how">
        <h2>${t("stepsTitle")}</h2>
        <ol>
          <li><strong>${t("step1Title")}</strong><span>${t("step1Text")}</span></li>
          <li><strong>${t("step2Title")}</strong><span>${t("step2Text")}</span></li>
          <li><strong>${t("step3Title")}</strong><span>${t("step3Text")}</span></li>
        </ol>
      </section>
    </div>`);
}

// ---------- questions ----------

function renderQuestion(id) {
  const list = visibleQuestions(answers);
  const idx = list.findIndex((q) => q.id === id);
  if (idx === -1) return go(`#/q/${(firstUnanswered() || list[0]).id}`);

  const q = list[idx];
  const dir = idx < lastIndex ? "back" : "fwd";
  lastIndex = idx;
  setProgress(idx / list.length);

  const body = { choice: choiceBody, number: numberBody, money: moneyBody, children: childrenBody }[q.type](q);
  const showContinue = q.type !== "choice" || isAnswered(q);

  mount(
    `<section class="flow" data-qid="${q.id}">
      <div class="flow-nav">
        <button type="button" class="btn-link" data-action="back">${chevron}${t("back")}</button>
        <span class="step-count">${t("stepOf", { n: idx + 1, total: list.length })}</span>
      </div>
      <p class="q-section">${t(`sections.${q.section}`)}</p>
      <h1 class="q-title" id="q-title" tabindex="-1">${L(q.title)}</h1>
      ${q.help ? `<p class="q-help">${L(q.help)}</p>` : ""}
      <div class="q-body">${body}</div>
      <p class="q-error" role="alert"></p>
      <div class="q-actions">
        ${showContinue ? `<button type="button" class="btn btn-primary btn-large" data-action="continue">${t("continue")}</button>` : ""}
        ${q.allowUnknown ? `<button type="button" class="btn-link" data-action="unknown">${t("notSure")}</button>` : ""}
      </div>
    </section>`,
    { dir },
  );

  const input = app.querySelector("#q-input");
  if (input && window.matchMedia("(pointer: fine)").matches) input.focus({ preventScroll: true });
  else app.querySelector("#q-title").focus({ preventScroll: true });
}

function choiceBody(q) {
  const current = answers[q.id];
  return `<div class="options" role="radiogroup" aria-labelledby="q-title">
    ${q.options
      .map(
        (o, i) => `<button type="button" class="option" role="radio" aria-checked="${current === o.value}" data-action="choose" data-value="${o.value}" data-key="${i + 1}">
          <span class="option-text">
            <span class="option-label">${L(o.label)}</span>
            ${o.hint ? `<span class="option-hint">${L(o.hint)}</span>` : ""}
          </span>
          <span class="radio">${check}</span>
        </button>`,
      )
      .join("")}
  </div>`;
}

function chipsHtml(values, format, current) {
  if (!values) return "";
  return `<div class="chips">${values
    .map((v) => `<button type="button" class="chip" data-action="chip" data-value="${v}" aria-pressed="${current === v}">${format(v)}</button>`)
    .join("")}</div>`;
}

function numberBody(q) {
  const current = answers[q.id];
  return `<label class="field" for="q-input">
      <input id="q-input" type="text" inputmode="numeric" autocomplete="off" placeholder="0" value="${current ?? ""}" aria-describedby="q-title">
      ${q.suffix ? `<span class="suffix">${L(q.suffix)}</span>` : ""}
    </label>
    <div class="field-row">${chipsHtml(q.chips, (v) => number(v), current)}</div>`;
}

function moneyBody(q) {
  const current = answers[q.id];
  const per = current?.per || q.defaultPer || (q.period === "year" ? "year" : "month");
  const value = current && !current.unknown && current.amount != null ? number(current.amount) : "";
  const seg =
    q.period === "toggle"
      ? `<div class="seg" role="group" aria-label="${t("perMonth")} / ${t("perYear")}">
          <button type="button" data-action="per" data-per="month" aria-pressed="${per === "month"}">${t("perMonth")}</button>
          <button type="button" data-action="per" data-per="year" aria-pressed="${per === "year"}">${t("perYear")}</button>
        </div>`
      : "";
  const suffix = q.period === "month" ? t("monthShort") : q.period === "year" ? t("yearShort") : "";
  return `<label class="field" for="q-input" data-per="${per}">
      <span class="prefix">€</span>
      <input id="q-input" type="text" inputmode="decimal" autocomplete="off" placeholder="0" value="${value}" aria-describedby="q-title">
      ${suffix ? `<span class="suffix">${suffix}</span>` : ""}
    </label>
    <div class="field-row">${chipsHtml(q.chips, (v) => money(v), current?.amount)}${seg}</div>`;
}

function childrenBody(q) {
  const current = answers[q.id] || {};
  return `<div class="steppers">${CHILD_BANDS.map((band) => {
    const n = current[band.key] || 0;
    return `<div class="stepper-row" data-band="${band.key}">
        <span class="label">${L(band.label)}</span>
        <div class="stepper">
          <button type="button" data-action="dec" aria-label="−" ${n === 0 ? "disabled" : ""}>−</button>
          <output aria-live="polite">${n}</output>
          <button type="button" data-action="inc" aria-label="+" ${n >= 9 ? "disabled" : ""}>+</button>
        </div>
      </div>`;
  }).join("")}</div>`;
}

function currentQuestion() {
  const id = app.querySelector("[data-qid]")?.dataset.qid;
  return QUESTIONS.find((q) => q.id === id);
}

function showError(msg) {
  const el = app.querySelector(".q-error");
  if (el) el.textContent = msg;
}

/** Read the visible input into `answers`; returns false when invalid. */
function commit(q) {
  if (q.type === "choice") {
    if (!isAnswered(q)) return showError(t("required")), false;
    return true;
  }
  if (q.type === "children") {
    const counts = {};
    app.querySelectorAll("[data-band]").forEach((row) => (counts[row.dataset.band] = Number(row.querySelector("output").textContent)));
    answers[q.id] = counts;
    return true;
  }
  const raw = app.querySelector("#q-input").value;
  if (q.type === "number") {
    const n = parseAmount(raw);
    if (n == null || n < q.min || n > q.max) return showError(t("invalidNumber", { min: q.min, max: q.max })), false;
    answers[q.id] = Math.round(n);
    return true;
  }
  // money
  const amount = parseAmount(raw);
  if (amount == null) return showError(t("required")), false;
  const per = app.querySelector(".field").dataset.per;
  answers[q.id] = { amount, per: q.period === "none" ? "year" : q.period === "toggle" ? per : q.period };
  return true;
}

// ---------- review ----------

function formatAnswer(q) {
  const v = answers[q.id];
  if (v == null) return "—";
  switch (q.type) {
    case "choice":
      return L(q.options.find((o) => o.value === v)?.label) || v;
    case "number":
      return `${number(v)}${q.suffix ? " " + L(q.suffix) : ""}`;
    case "money":
      if (v.unknown) return t("unknown");
      return `${money(v.amount)}${q.period === "none" ? "" : " " + (v.per === "month" ? t("monthShort") : t("yearShort"))}`;
    case "children": {
      const parts = CHILD_BANDS.filter((b) => v[b.key]).map((b) => `${v[b.key]} × ${L(b.label)}`);
      return parts.length ? parts.join(", ") : t("none");
    }
  }
  return String(v);
}

function renderReview() {
  const missing = firstUnanswered();
  if (missing) return go(`#/q/${missing.id}`);
  editingFromReview = false;
  const list = visibleQuestions(answers);
  lastIndex = list.length;
  setProgress(1);
  mount(`
    <section class="flow">
      <div class="flow-nav">
        <button type="button" class="btn-link" data-action="back-last">${chevron}${t("back")}</button>
      </div>
      <h1 class="q-title" tabindex="-1">${t("reviewTitle")}</h1>
      <p class="q-help">${t("reviewHelp")}</p>
      <div class="review-list">
        ${list
          .map(
            (q) => `<button type="button" class="review-item" data-action="edit" data-qid-edit="${q.id}">
              <span class="k">${L(q.title)}</span>
              <span class="v">${esc(formatAnswer(q))}</span>
              ${chevron}
            </button>`,
          )
          .join("")}
      </div>
      <div class="q-actions">
        <button type="button" class="btn btn-primary btn-large" data-action="results">${t("seeResults")}</button>
      </div>
    </section>`);
}

// ---------- results ----------

function conditionReasons(scheme, result) {
  const prefix = conditionPrefix(scheme);
  return Object.keys(result.meta)
    .filter((n) => n.startsWith(prefix) && result.values[n] === false)
    .map((n) => {
      const key = n.slice(prefix.length);
      return L(scheme.conditionText?.[key] || CONDITION_TEXT[key]) || result.meta[n].label;
    });
}

const linkFor = (s) => (s.link ? L(typeof s.link === "function" ? s.link(answers) : s.link) : null);

function cardHtml(item, tone) {
  const s = item.scheme;
  let amountHtml = "";
  if (item.perk) {
    const worth = item.amount > 0 ? `<small>${t("worth", { amount: money(item.amount) })}</small>` : "";
    amountHtml = `<div class="amount">${L(s.perkLabel)}${worth}</div>`;
  } else if (item.amount > 0) {
    const unit = item.per === "year" ? t("yearShort") : t("monthShort");
    const prefix = item.upTo ? `<small class="up-to">${t("upTo")}</small>` : "";
    amountHtml = `<div class="amount">${prefix}${money(item.amount)}<small>${unit}</small></div>`;
  }
  const what = typeof s.what === "function" ? s.what(answers) : s.what;
  const note = L(s.note?.(answers, cachedResult?.result.values || {}) || null);
  const link = linkFor(s);
  return `<article class="card tone-${tone}">
    <div class="card-head">
      <div class="card-icon">${icon(s.icon)}</div>
      <div class="card-titles">
        <h3>${L(s.title)}${s.tag ? `<span class="tag">${s.tag}</span>` : ""}</h3>
        ${s.official ? `<p class="official">${s.official}</p>` : ""}
      </div>
    </div>
    ${amountHtml}
    <p class="why">${item.text || L(what)}</p>
    ${note ? `<p class="why">${note}</p>` : ""}
    ${link ? `<div class="card-actions"><a href="${link}" target="_blank" rel="noopener noreferrer">${tone === "good" ? t("checkApply") : t("learnMore")} ${external}</a></div>` : ""}
  </article>`;
}

function buildGroups(result) {
  const likely = [];
  const worth = [];
  const notNow = [];
  const { values, meta } = result;

  for (const s of SCHEMES) {
    const v = values[s.variable];
    if (v == null) continue; // not available or not computable on the server
    const bedrag = values[`${s.variable}_bedrag`];

    if (s.kind === "monthly") {
      if (v > 0.5) {
        const upTo = s.variable === "aanvullende_beurs" && answers.parents_income?.unknown;
        (upTo ? worth : likely).push({ scheme: s, amount: v, per: "month", upTo });
      } else if (s.relevant?.(answers)) {
        notNow.push({ scheme: s, reasons: conditionReasons(s, result) });
      }
    } else if (s.kind === "yearly" && v > 0.5) {
      likely.push({ scheme: s, amount: v, per: "year" });
    } else if (s.kind === "perk" && v === true) {
      likely.push({ scheme: s, perk: true, amount: values[s.valueVariable] });
    } else if (s.kind === "loan" && v > 0.5 && answers.role === "student") {
      worth.push({ scheme: s, amount: v, per: "month", upTo: true });
    } else if (s.kind === "local" && v === true) {
      worth.push({ scheme: s, amount: bedrag, per: s.bedragPer || "month" });
    }
  }

  if (result.whatIf && !(values.basisbeurs > 0) && result.whatIf.basisbeurs > 0) {
    const extra = (result.whatIf.basisbeurs || 0) + (result.whatIf.aanvullende_beurs || 0);
    worth.unshift({
      scheme: {
        icon: "sparkle",
        title: { en: "Work 32 hours a month, unlock student finance", nl: "Werk 32 uur per maand, krijg studiefinanciering" },
        official: "Studiefinanciering · DUO",
        link: SCHEMES.find((x) => x.variable === "basisbeurs").link,
      },
      amount: extra,
      per: "month",
      text: L({
        en: "As an EU student, working about 32 hours a month in the Netherlands usually gives you the same student finance as Dutch students — grants plus free public transport. DUO checks your payslips afterwards, and you can't combine it with study finance from home (such as German BAföG).",
        nl: "Als EU-student krijg je bij ongeveer 32 uur werk per maand in Nederland meestal dezelfde studiefinanciering als Nederlandse studenten — beurzen plus gratis openbaar vervoer. DUO controleert achteraf je loonstroken, en je kunt het niet combineren met studiefinanciering uit je thuisland (zoals het Duitse BAföG).",
      }),
    });
  }

  STATIC_TIPS.filter((tip) => tip.when(answers)).forEach((tip) => worth.push({ scheme: tip }));

  // Cash per month first (largest first), then yearly amounts and in-kind perks.
  const rank = (x) => (x.perk ? 2 : x.per === "month" ? 0 : 1);
  likely.sort((x, y) => rank(x) - rank(y) || (y.amount || 0) - (x.amount || 0));
  const total = likely.filter((x) => x.per === "month" && !x.upTo && !x.perk).reduce((sum, x) => sum + x.amount, 0);
  return { likely, worth, notNow, total };
}

function groupHtml(title, items, tone) {
  if (!items.length) return "";
  return `<section class="group">
    <div class="group-head"><h2>${title}</h2><span class="count">${items.length}</span></div>
    <div class="cards">${items.map((item, i) => cardHtml(item, tone).replace('class="card', `style="animation-delay:${i * 60}ms" class="card`)).join("")}</div>
  </section>`;
}

function notNowHtml(items) {
  if (!items.length) return "";
  const generic = { en: "Based on what you entered, the calculated amount is €0.", nl: "Op basis van je antwoorden is het berekende bedrag €0." };
  return `<section class="group">
    <div class="group-head"><h2>${t("notNow")}</h2><span class="count">${items.length}</span></div>
    <div class="not-list">
      ${items
        .map(
          (item) => `<div class="not-item">
            <div class="card-icon">${icon(item.scheme.icon)}</div>
            <div>
              <strong>${L(item.scheme.title)}</strong>
              <span>${esc(item.reasons.length ? item.reasons.join(" ") : L(generic))}</span>
              ${linkFor(item.scheme) ? ` <a href="${linkFor(item.scheme)}" target="_blank" rel="noopener noreferrer">${t("learnMore")} ${external}</a>` : ""}
            </div>
          </div>`,
        )
        .join("")}
    </div>
  </section>`;
}

function helpHtml() {
  const items = HELP.filter((h) => h.show(answers));
  if (!items.length) return "";
  return `<section class="group">
    <div class="group-head"><h2>${t("helpTitle")}</h2></div>
    <div class="not-list help-list">
      ${items
        .map(
          (h) => `<a class="not-item help-item" href="${L(h.link)}" target="_blank" rel="noopener noreferrer">
            <div class="card-icon">${icon("people")}</div>
            <div><strong>${L(h.title)} ${external}</strong><span>${L(h.what)}</span></div>
          </a>`,
        )
        .join("")}
    </div>
  </section>`;
}

/** Pay it forward; people with monthly support also see what they'd keep after giving. */
function giveHtml(total) {
  const amount = money(CAUSE.monthly);
  const fund = L(CAUSE.name);
  const gain =
    total > CAUSE.monthly ? `<p>${t("giveGain", { amount, left: `<strong>${money(total - CAUSE.monthly)}</strong>` })}</p>` : "";
  return `<aside class="give">
    <span class="give-icon">${icon("heart")}</span>
    <div>
      <p class="give-title">${t("giveTitle", { amount })}</p>
      ${gain}
      <p>${t("giveText", { fund })}</p>
      <a href="${L(CAUSE.link)}" target="_blank" rel="noopener noreferrer">${t("giveCta", { fund })} ${external}</a>
    </div>
  </aside>`;
}

function countUp(el, target) {
  if (reducedMotion || target <= 0) return;
  const start = performance.now();
  const duration = 900;
  const tick = (now) => {
    const p = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - p, 3);
    el.firstChild.nodeValue = money(target * eased);
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

async function renderResults() {
  const missing = firstUnanswered();
  if (missing) return go(`#/q/${missing.id}`);
  setProgress(null);

  const key = JSON.stringify(answers);
  if (!cachedResult || cachedResult.key !== key) {
    mount(`<div class="loading"><div class="spinner"></div><p>${t("calculating")}</p></div>`);
    try {
      cachedResult = { key, result: await calculate(answers) };
    } catch (e) {
      console.error("Eli Check calculation failed", e, e.body);
      mount(`<div class="error-box">
        <h1>${t("errorTitle")}</h1>
        <p>${t("errorText")}</p>
        <div class="q-actions">
          <button type="button" class="btn btn-primary" data-action="results">${t("tryAgain")}</button>
          <button type="button" class="btn btn-secondary" data-action="review">${t("changeAnswers")}</button>
        </div>
      </div>`);
      return;
    }
  }

  const result = cachedResult.result;
  const { likely, worth, notNow, total } = buildGroups(result);
  const monthName = new Intl.DateTimeFormat(getLang() === "nl" ? "nl-NL" : "en-GB", { month: "long", year: "numeric" }).format(new Date());

  const summary =
    total > 0
      ? `<p class="eyebrow">${t("resultsEyebrow", { month: monthName })}</p>
         <p class="sub" style="margin:0 0 10px">${t("couldReceive")}</p>
         <p class="big"><span id="total">${money(total)}</span><small>${t("perMonth")}</small></p>
         <p class="sub">${t("aYear", { amount: money(total * 12) })}</p>`
      : `<p class="eyebrow">${t("resultsEyebrow", { month: monthName })}</p>
         <h1 style="font-size:clamp(36px,6vw,56px)">${t("nothingTitle")}</h1>
         <p class="sub">${t("nothingText")}</p>`;

  mount(`
    <div class="results">
      <section class="summary">${summary}<p class="hint">${t("summaryHint")}</p></section>
      ${groupHtml(t("likely"), likely, "good")}
      ${groupHtml(t("check"), worth, "check")}
      ${notNowHtml(notNow)}
      ${helpHtml()}
      <p class="disclaimer">${t("disclaimer")}</p>
      <div class="results-actions">
        <button type="button" class="btn btn-secondary" data-action="review">${t("changeAnswers")}</button>
        <button type="button" class="btn btn-secondary" data-action="print">${t("print")}</button>
        <button type="button" class="btn btn-secondary" data-action="restart">${t("startOver")}</button>
      </div>
      ${giveHtml(total)}
    </div>`);

  const totalEl = document.getElementById("total");
  if (totalEl) countUp(totalEl, total);
}

// ---------- events ----------

// Home cards: a soft light follows the mouse and the card leans slightly towards it.
app.addEventListener("pointermove", (e) => {
  const card = e.target.closest(".path");
  if (!card || e.pointerType !== "mouse") return;
  const r = card.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width;
  const y = (e.clientY - r.top) / r.height;
  card.style.setProperty("--mx", `${x * 100}%`);
  card.style.setProperty("--my", `${y * 100}%`);
  if (reducedMotion) return;
  card.style.setProperty("--rx", `${(0.5 - y) * 6}deg`);
  card.style.setProperty("--ry", `${(x - 0.5) * 6}deg`);
});

app.addEventListener("click", (e) => {
  const el = e.target.closest("[data-action]");
  if (!el) return;
  const q = currentQuestion();
  const action = el.dataset.action;

  switch (action) {
    case "start":
      editingFromReview = false;
      return go(`#/q/${(firstUnanswered() || visibleQuestions(answers)[0]).id}`);
    case "student":
      answers.role = "student";
      saveAnswers();
      return next("role");
    case "everyone":
      if (answers.role === "student") delete answers.role;
      saveAnswers();
      return go("#/q/role");
    case "how":
      return document.getElementById("how").scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
    case "back":
      return back(q.id);
    case "back-last": {
      const list = visibleQuestions(answers);
      return go(`#/q/${list[list.length - 1].id}`);
    }
    case "choose": {
      answers[q.id] = el.dataset.value;
      app.querySelectorAll(".option").forEach((o) => o.setAttribute("aria-checked", String(o === el)));
      saveAnswers();
      setTimeout(() => next(q.id), reducedMotion ? 0 : 240);
      return;
    }
    case "chip": {
      const input = app.querySelector("#q-input");
      const v = Number(el.dataset.value);
      input.value = number(v);
      app.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", String(c === el)));
      if (commit(q)) next(q.id);
      return;
    }
    case "per": {
      app.querySelector(".field").dataset.per = el.dataset.per;
      app.querySelectorAll("[data-action=per]").forEach((b) => b.setAttribute("aria-pressed", String(b === el)));
      return;
    }
    case "inc":
    case "dec": {
      const out = el.closest(".stepper").querySelector("output");
      const n = Math.min(9, Math.max(0, Number(out.textContent) + (action === "inc" ? 1 : -1)));
      out.textContent = n;
      const [dec, inc] = el.closest(".stepper").querySelectorAll("button");
      dec.disabled = n === 0;
      inc.disabled = n >= 9;
      return;
    }
    case "unknown":
      answers[q.id] = { unknown: true };
      return next(q.id);
    case "continue":
      if (commit(q)) next(q.id);
      return;
    case "edit":
      editingFromReview = true;
      return go(`#/q/${el.dataset.qidEdit}`);
    case "results":
      return go("#/results");
    case "review":
      return go("#/review");
    case "print":
      return window.print();
    case "restart":
      answers = {};
      saveAnswers();
      cachedResult = null;
      return go("#/");
  }
});

app.addEventListener("input", (e) => {
  if (e.target.id === "q-input") {
    showError("");
    app.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", "false"));
  }
});

document.addEventListener("keydown", (e) => {
  const q = currentQuestion();
  if (!q || e.altKey || e.ctrlKey || e.metaKey) return;
  if (e.key === "Enter" && e.target.id === "q-input") {
    e.preventDefault();
    if (commit(q)) next(q.id);
  } else if (q.type === "choice" && /^[1-9]$/.test(e.key) && e.target.tagName !== "INPUT") {
    app.querySelector(`.option[data-key="${e.key}"]`)?.click();
  }
});

window.addEventListener("hashchange", route);

renderChrome();
route();

// Talks to the OpenFisca Web API mounted at ./api (see server.py).

import { CHILD_BANDS, visibleQuestions, yearly, monthly } from "./questions.js";
import { SCHEMES, conditionPrefix } from "./benefits.js";

const API = (window.ELICHECK_API || "api").replace(/\/$/, "");
const PLURAL = { persoon: "personen", huishouden: "huishoudens" };

const ONDERWIJS = { um: "wo", other_wo: "wo", zuyd: "hbo", other_hbo: "hbo", mbo_bol: "mbo_bol", mbo_bbl: "mbo_bbl", vo: "vo" };

let metaPromise = null;

async function getJSON(path, options) {
  const res = await fetch(`${API}/${path}`, options);
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const err = new Error(`OpenFisca ${res.status}`);
    err.body = body;
    throw err;
  }
  return body;
}

/**
 * Entity and period of every output we may want, read from the API so the
 * page keeps working when the country package adds or renames variables.
 */
export function loadMeta() {
  if (!metaPromise) {
    metaPromise = (async () => {
      const all = await getJSON("variables");
      const names = Object.keys(all);
      const wanted = new Set();
      for (const s of SCHEMES) {
        if (!all[s.variable]) continue;
        wanted.add(s.variable);
        if (all[`${s.variable}_bedrag`]) wanted.add(`${s.variable}_bedrag`);
        [s.valueVariable, ...(s.extra || [])].filter((n) => n && all[n]).forEach((n) => wanted.add(n));
        names.filter((n) => n.startsWith(conditionPrefix(s))).forEach((n) => wanted.add(n));
      }
      const details = await Promise.all([...wanted].map((n) => getJSON(`variable/${n}`)));
      const meta = {};
      details.forEach((d) => {
        meta[d.id] = {
          entity: PLURAL[d.entity] || d.entity,
          period: d.definitionPeriod,
          label: d.description,
        };
      });
      return meta;
    })().catch((e) => {
      metaPromise = null;
      throw e;
    });
  }
  return metaPromise;
}

function periods(now = new Date()) {
  const year = String(now.getFullYear());
  const month = `${year}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  return { month, year, peiljaar: String(now.getFullYear() - 2) };
}

function periodKey(definitionPeriod, p) {
  if (definitionPeriod === "MONTH") return p.month;
  if (definitionPeriod === "YEAR") return p.year;
  return "ETERNITY";
}

/** Only answers to questions that are still visible count. */
function effectiveAnswers(answers) {
  const visible = new Set(visibleQuestions(answers).map((q) => q.id));
  return Object.fromEntries(Object.entries(answers).filter(([k]) => visible.has(k)));
}

function nationaliteit(a) {
  if (a.nationality === "eu") return "eer";
  if (a.nationality === "non_eu") return a.permit === "permanent" ? "niet_eer_gelijkgesteld" : "niet_eer_overig";
  return "nederlands";
}

function onderwijs(a) {
  if (a.role !== "student") return "geen";
  // Part-time hbo/wo students can't get student finance; treat them as not in (funded) education.
  if (a.full_time === "no") return "geen";
  return ONDERWIJS[a.institution] || "geen";
}

export function buildSituation(rawAnswers, overrides = {}, p = periods()) {
  const a = { ...effectiveAnswers(rawAnswers), ...overrides };
  const { month, year, peiljaar } = p;
  const age = Number(a.age) || 18;
  const ownIncome = yearly(a.income) ?? 0;
  const earns = a.role === "student" || a.role === "working";

  const aanvrager = {
    leeftijd: { [month]: age },
    onderwijs: { [month]: onderwijs(a) },
    woont_bij_ouders: { [month]: a.housing === "parents" },
    nationaliteit: { ETERNITY: nationaliteit(a) },
    jaren_in_nederland: { ETERNITY: a.nationality === "eu" ? (a.years_nl === "yes" ? 5 : 0) : a.nationality === "dutch" ? 18 : 0 },
    inkomen_uit_arbeid: { [year]: earns ? ownIncome : 0 },
    overig_inkomen: { [year]: earns ? 0 : ownIncome },
    vermogen: { [year]: yearly(a.savings) ?? 0 },
    heeft_nederlandse_zorgverzekering: { [month]: a.nationality === "dutch" || a.insurance !== "no" },
    heeft_beperking: { [month]: a.disability === "yes" },
  };

  if (a.work_hours != null) aanvrager.werkuren_per_maand = { [month]: Number(a.work_hours) };
  if (a.months_worked != null) aanvrager.maanden_gewerkt = { [year]: Number(a.months_worked) };
  if (a.wage_tax && !a.wage_tax.unknown && a.wage_tax.amount != null) {
    aanvrager.ingehouden_loonheffing = { [year]: a.wage_tax.amount };
  }
  if (a.role === "student") {
    // "Don't know" → compute the maximum supplementary grant and label it "up to".
    const parents = yearly(a.parents_income) ?? 0;
    aanvrager.inkomen_ouders = { [year]: parents, [peiljaar]: parents };
    aanvrager.broers_zussen_met_studiefinanciering = { [month]: Number(a.siblings) || 0 };
  }

  const personen = { aanvrager };
  const partners = ["aanvrager"];

  if (a.partner === "yes") {
    personen.partner = {
      leeftijd: { [month]: Math.max(18, age) },
      inkomen_uit_arbeid: { [year]: yearly(a.partner_income) ?? 0 },
      vermogen: { [year]: 0 },
    };
    partners.push("partner");
  }

  const kinderen = [];
  CHILD_BANDS.forEach((band) => {
    const n = (a.children && a.children[band.key]) || 0;
    for (let i = 0; i < n; i++) {
      const id = `kind_${kinderen.length + 1}`;
      personen[id] = { leeftijd: { [month]: band.age } };
      kinderen.push(id);
    }
  });

  const huishouden = {
    partners,
    kinderen,
    huur_per_maand: { [month]: monthly(a.rent) ?? 0 },
    zelfstandige_woonruimte: { [month]: a.housing === "independent" },
    woont_in_maastricht: { [month]: a.city !== "other" },
  };

  return { personen, huishoudens: { huishouden } };
}

function request(situation, meta, names, p) {
  for (const name of names) {
    const m = meta[name];
    if (!m) continue;
    const target = m.entity === "huishoudens" ? situation.huishoudens.huishouden : situation.personen.aanvrager;
    target[name] = { ...(target[name] || {}), [periodKey(m.period, p)]: null };
  }
}

function read(response, meta, name, p) {
  const m = meta[name];
  const holder = m.entity === "huishoudens" ? response.huishoudens.huishouden : response.personen.aanvrager;
  return holder?.[name]?.[periodKey(m.period, p)];
}

async function evaluate(answers, overrides, meta, names, p) {
  const situation = buildSituation(answers, overrides, p);
  request(situation, meta, names, p);
  const response = await getJSON("calculate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(situation),
  });
  return Object.fromEntries(names.map((n) => [n, read(response, meta, n, p)]));
}

/** Run the calculation; returns {values: {name: value}, meta, whatIf}. */
export async function calculate(answers) {
  const meta = await loadMeta();
  const p = periods();
  const names = Object.keys(meta);

  let values;
  try {
    values = await evaluate(answers, {}, meta, names, p);
  } catch (error) {
    // One variable the server can't compute shouldn't hide all the others:
    // retry each output on its own and leave out the ones that fail.
    const parts = await Promise.allSettled(names.map((n) => evaluate(answers, {}, meta, [n], p)));
    values = {};
    parts.forEach((part, i) => {
      if (part.status === "fulfilled") Object.assign(values, part.value);
      else console.warn(`Eli Check: skipped ${names[i]}`, part.reason?.body ?? part.reason);
    });
    if (!Object.keys(values).length) throw error;
  }

  // EU students below DUO's 32-hour worker presumption: what would working 32 hours a month unlock?
  let whatIf = null;
  const a = effectiveAnswers(answers);
  if (a.role === "student" && a.nationality === "eu" && a.years_nl !== "yes" && Number(a.work_hours || 0) < 32 && meta.basisbeurs) {
    const altNames = ["basisbeurs", "aanvullende_beurs", "studentenreisproduct"].filter((n) => meta[n]);
    whatIf = await evaluate(answers, { work_hours: 32 }, meta, altNames, p).catch(() => null);
  }

  return { values, meta, whatIf, period: p };
}

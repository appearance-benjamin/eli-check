// The questionnaire. One question per screen; `when` decides whether a question applies.
// Types: choice (auto-advances), number, money, children.

const yesNo = [
  { value: "yes", label: { en: "Yes", nl: "Ja" } },
  { value: "no", label: { en: "No", nl: "Nee" } },
];

const isStudent = (a) => a.role === "student";
const rents = (a) => a.housing === "room" || a.housing === "independent";

export const CHILD_BANDS = [
  { key: "c0_5", age: 3, label: { en: "0 – 5 years", nl: "0 – 5 jaar" } },
  { key: "c6_11", age: 9, label: { en: "6 – 11 years", nl: "6 – 11 jaar" } },
  { key: "c12_15", age: 14, label: { en: "12 – 15 years", nl: "12 – 15 jaar" } },
  { key: "c16_17", age: 16, label: { en: "16 – 17 years", nl: "16 – 17 jaar" } },
];

export const QUESTIONS = [
  {
    id: "role",
    section: "about",
    type: "choice",
    title: { en: "What describes you best right now?", nl: "Wat past nu het best bij jou?" },
    options: [
      { value: "student", label: { en: "I'm a student", nl: "Ik studeer" }, hint: { en: "University, hogeschool or mbo", nl: "Universiteit, hogeschool of mbo" } },
      { value: "working", label: { en: "I work", nl: "Ik werk" }, hint: { en: "Employed or self-employed", nl: "In loondienst of als zelfstandige" } },
      { value: "looking", label: { en: "I'm looking for work", nl: "Ik zoek werk" } },
      { value: "retired", label: { en: "I'm retired", nl: "Ik ben met pensioen" }, hint: { en: "Receiving AOW or a pension", nl: "Ik krijg AOW of pensioen" } },
      { value: "other", label: { en: "Something else", nl: "Iets anders" }, hint: { en: "For example caring for family, or unable to work", nl: "Bijvoorbeeld mantelzorg, of niet in staat om te werken" } },
    ],
  },
  {
    id: "age",
    section: "about",
    type: "number",
    title: { en: "How old are you?", nl: "Hoe oud ben je?" },
    suffix: { en: "years", nl: "jaar" },
    min: 15,
    max: 110,
  },
  {
    id: "nationality",
    section: "about",
    type: "choice",
    title: { en: "What is your nationality?", nl: "Wat is je nationaliteit?" },
    help: { en: "This matters for student finance and some allowances.", nl: "Dit is van belang voor studiefinanciering en sommige toeslagen." },
    options: [
      { value: "dutch", label: { en: "Dutch", nl: "Nederlands" } },
      { value: "eu", label: { en: "EU, EEA or Swiss", nl: "EU, EER of Zwitsers" }, hint: { en: "For example German, Belgian or Italian", nl: "Bijvoorbeeld Duits, Belgisch of Italiaans" } },
      { value: "non_eu", label: { en: "Another nationality", nl: "Een andere nationaliteit" } },
    ],
  },
  {
    id: "permit",
    section: "about",
    type: "choice",
    when: (a) => a.nationality === "non_eu",
    title: { en: "Which residence permit do you have?", nl: "Welke verblijfsvergunning heb je?" },
    options: [
      { value: "permanent", label: { en: "Permanent, asylum or family permit", nl: "Permanent, asiel of gezin" }, hint: { en: "Permanent residence, refugee status, or living with a Dutch or EU partner", nl: "Duurzaam verblijf, vluchtelingenstatus, of samenwonend met Nederlandse of EU-partner" } },
      { value: "study", label: { en: "Residence permit for study", nl: "Verblijfsvergunning voor studie" } },
      { value: "work", label: { en: "Work or other temporary permit", nl: "Werk- of andere tijdelijke vergunning" } },
      { value: "unsure", label: { en: "Not sure", nl: "Weet ik niet" } },
    ],
  },
  {
    id: "years_nl",
    section: "about",
    type: "choice",
    when: (a) => isStudent(a) && a.nationality === "eu",
    title: { en: "Have you lived in the Netherlands for 5 years or more?", nl: "Woon je 5 jaar of langer in Nederland?" },
    help: { en: "Without long interruptions.", nl: "Zonder lange onderbrekingen." },
    options: yesNo,
  },
  {
    id: "institution",
    section: "study",
    type: "choice",
    when: isStudent,
    title: { en: "Where do you study?", nl: "Waar studeer je?" },
    options: [
      { value: "um", label: { en: "Maastricht University", nl: "Maastricht University" }, hint: { en: "University (wo)", nl: "Universiteit (wo)" } },
      { value: "zuyd", label: { en: "Zuyd Hogeschool", nl: "Zuyd Hogeschool" }, hint: { en: "University of applied sciences (hbo)", nl: "Hogeschool (hbo)" } },
      { value: "other_wo", label: { en: "Another university", nl: "Een andere universiteit" }, hint: { en: "wo", nl: "wo" } },
      { value: "other_hbo", label: { en: "Another hogeschool", nl: "Een andere hogeschool" }, hint: { en: "hbo", nl: "hbo" } },
      { value: "mbo_bol", label: { en: "MBO — school-based (bol)", nl: "Mbo — beroepsopleidende leerweg (bol)" }, hint: { en: "Mostly lessons at school, with internships", nl: "Vooral lessen op school, met stages" } },
      { value: "mbo_bbl", label: { en: "MBO — work-based (bbl)", nl: "Mbo — beroepsbegeleidende leerweg (bbl)" }, hint: { en: "You work and go to school one day a week", nl: "Je werkt en gaat één dag per week naar school" } },
      { value: "vo", label: { en: "Secondary school", nl: "Middelbare school" }, hint: { en: "vmbo, havo or vwo", nl: "vmbo, havo of vwo" } },
    ],
  },
  {
    id: "full_time",
    section: "study",
    type: "choice",
    when: (a) => isStudent(a) && ["um", "zuyd", "other_wo", "other_hbo"].includes(a.institution),
    title: { en: "Do you study full-time?", nl: "Studeer je voltijd?" },
    help: { en: "Student finance is for full-time and dual programmes.", nl: "Studiefinanciering is voor voltijd en duale opleidingen." },
    options: [
      { value: "yes", label: { en: "Full-time or dual", nl: "Voltijd of duaal" } },
      { value: "no", label: { en: "Part-time", nl: "Deeltijd" } },
    ],
  },
  {
    id: "work_hours",
    section: "study",
    type: "number",
    when: (a) => isStudent(a) && a.nationality === "eu" && a.years_nl !== "yes",
    title: { en: "How many hours a month do you work in the Netherlands?", nl: "Hoeveel uur per maand werk je in Nederland?" },
    help: {
      en: "EU students who work about 32 hours a month in the Netherlands (or earn around €700 net a month) can usually get Dutch student finance — including the grant.",
      nl: "EU-studenten die ongeveer 32 uur per maand in Nederland werken (of zo'n €700 netto per maand verdienen), kunnen meestal Nederlandse studiefinanciering krijgen — inclusief de beurs.",
    },
    suffix: { en: "hours / month", nl: "uur / maand" },
    min: 0,
    max: 300,
    chips: [0, 16, 24, 32, 48],
  },
  {
    id: "parents_income",
    section: "study",
    type: "money",
    when: isStudent,
    period: "year",
    allowUnknown: true,
    title: { en: "What do your parents earn together per year?", nl: "Wat verdienen je ouders samen per jaar?" },
    help: {
      en: "Gross, before tax. DUO uses this for the supplementary grant (aanvullende beurs). A rough guess is fine.",
      nl: "Bruto, voor belasting. DUO gebruikt dit voor de aanvullende beurs. Een ruwe schatting is prima.",
    },
    chips: [25000, 40000, 55000, 70000, 90000],
  },
  {
    id: "siblings",
    section: "study",
    type: "number",
    when: (a) => isStudent(a) && a.parents_income && !a.parents_income.unknown,
    title: { en: "How many of your brothers or sisters also get student finance?", nl: "Hoeveel broers of zussen krijgen ook studiefinanciering?" },
    help: { en: "Siblings who study can raise your supplementary grant.", nl: "Studerende broers of zussen kunnen je aanvullende beurs verhogen." },
    min: 0,
    max: 10,
    chips: [0, 1, 2, 3],
  },
  {
    id: "disability",
    section: "study",
    type: "choice",
    when: isStudent,
    title: {
      en: "Do you have a disability or chronic illness that makes it hard to work next to your studies?",
      nl: "Heb je een beperking of chronische ziekte waardoor werken naast je studie moeilijk is?",
    },
    help: { en: "Some cities, including Maastricht, offer a study allowance for this.", nl: "Sommige gemeenten, waaronder Maastricht, hebben hiervoor een studietoeslag." },
    options: [
      ...yesNo,
      { value: "skip", label: { en: "I'd rather not say", nl: "Zeg ik liever niet" } },
    ],
  },
  {
    id: "city",
    section: "home",
    type: "choice",
    title: { en: "Where do you live?", nl: "Waar woon je?" },
    options: [
      { value: "maastricht", label: { en: "Maastricht", nl: "Maastricht" } },
      { value: "other", label: { en: "Elsewhere in the Netherlands", nl: "Ergens anders in Nederland" } },
      { value: "moving", label: { en: "Not yet — I'm moving to Maastricht", nl: "Nog niet — ik verhuis naar Maastricht" } },
    ],
  },
  {
    id: "housing",
    section: "home",
    type: "choice",
    title: { en: "What kind of home do you live in?", nl: "In wat voor woning woon je?" },
    options: [
      { value: "room", label: { en: "A room", nl: "Een kamer" }, hint: { en: "You share a kitchen, bathroom or toilet", nl: "Je deelt keuken, badkamer of toilet" } },
      { value: "independent", label: { en: "A studio or apartment", nl: "Een studio of appartement" }, hint: { en: "Your own front door, kitchen, toilet and shower", nl: "Eigen voordeur, keuken, toilet en douche" } },
      { value: "parents", label: { en: "With my parents", nl: "Bij mijn ouders" } },
      { value: "owner", label: { en: "A home I own", nl: "Een koopwoning" } },
      { value: "other", label: { en: "Something else", nl: "Iets anders" } },
    ],
  },
  {
    id: "rent",
    section: "home",
    type: "money",
    when: rents,
    period: "month",
    title: { en: "How much rent do you pay per month?", nl: "Hoeveel huur betaal je per maand?" },
    help: {
      en: "Only the bare rent (kale huur) — without service costs, gas, water and electricity. You'll find it in your rental contract.",
      nl: "Alleen de kale huur — zonder servicekosten, gas, water en stroom. Je vindt het in je huurcontract.",
    },
  },
  {
    id: "partner",
    section: "household",
    type: "choice",
    title: { en: "Do you live with a partner?", nl: "Woon je samen met een partner?" },
    help: {
      en: "Married, registered partners, or living together at the same address.",
      nl: "Getrouwd, geregistreerd partner, of samenwonend op hetzelfde adres.",
    },
    options: yesNo,
  },
  {
    id: "partner_income",
    section: "household",
    type: "money",
    when: (a) => a.partner === "yes",
    period: "toggle",
    defaultPer: "month",
    title: { en: "What does your partner earn?", nl: "Wat verdient je partner?" },
    help: { en: "Gross, before tax. Include salary and benefits.", nl: "Bruto, voor belasting. Inclusief salaris en uitkeringen." },
    chips: [0],
  },
  {
    id: "children",
    section: "household",
    type: "children",
    title: { en: "Do you have children living with you?", nl: "Wonen er kinderen bij je?" },
    help: { en: "Add children under 18 by age group. Leave at zero if none.", nl: "Voeg kinderen onder de 18 toe per leeftijdsgroep. Laat op nul als je geen kinderen hebt." },
  },
  {
    id: "income",
    section: "money",
    type: "money",
    period: "toggle",
    defaultPer: "month",
    title: { en: "What is your own gross income?", nl: "Wat is je eigen bruto-inkomen?" },
    help: {
      en: "Before tax: salary, side jobs, or benefits like WW. Don't count student finance.",
      nl: "Voor belasting: salaris, bijbaan, of uitkeringen zoals WW. Tel studiefinanciering niet mee.",
    },
    chips: [0],
  },
  {
    id: "months_worked",
    section: "money",
    type: "number",
    when: (a) => (a.role === "student" || a.role === "working") && (yearly(a.income) ?? 0) > 0,
    title: { en: "How many months do you work this year?", nl: "Hoeveel maanden werk je dit jaar?" },
    help: {
      en: "A summer job is often taxed as if you earned that much all year — so you may get money back.",
      nl: "Over een vakantiebaan wordt vaak belasting ingehouden alsof je het hele jaar zoveel verdient — dus je krijgt misschien geld terug.",
    },
    suffix: { en: "months", nl: "maanden" },
    min: 1,
    max: 12,
    chips: [2, 3, 6, 12],
  },
  {
    id: "wage_tax",
    section: "money",
    type: "money",
    when: (a) => (a.role === "student" || a.role === "working") && (yearly(a.income) ?? 0) > 0,
    period: "none",
    allowUnknown: true,
    title: { en: "How much wage tax was withheld this year?", nl: "Hoeveel loonheffing is er dit jaar ingehouden?" },
    help: {
      en: "It's on your payslips or annual statement (jaaropgaaf), as 'loonheffing'. Students often get some of it back.",
      nl: "Dit staat op je loonstroken of jaaropgaaf als 'loonheffing'. Studenten krijgen vaak een deel terug.",
    },
    chips: [0, 250, 500, 1000],
  },
  {
    id: "insurance",
    section: "money",
    type: "choice",
    when: (a) => a.nationality && a.nationality !== "dutch",
    title: { en: "Do you have Dutch health insurance?", nl: "Heb je een Nederlandse zorgverzekering?" },
    help: {
      en: "If you work in the Netherlands — even a small side job — you usually must take Dutch basic insurance. You can then get healthcare allowance.",
      nl: "Werk je in Nederland — ook met een kleine bijbaan — dan moet je meestal een Nederlandse basisverzekering nemen. Dan kun je zorgtoeslag krijgen.",
    },
    options: [
      { value: "yes", label: { en: "Yes, Dutch basic insurance", nl: "Ja, een Nederlandse basisverzekering" } },
      { value: "no", label: { en: "No, I'm insured in my home country", nl: "Nee, ik ben verzekerd in mijn thuisland" }, hint: { en: "For example with an EHIC card", nl: "Bijvoorbeeld met een EHIC-pas" } },
      { value: "unsure", label: { en: "Not sure", nl: "Weet ik niet" } },
    ],
  },
  {
    id: "savings",
    section: "money",
    type: "money",
    period: "none",
    title: { en: "Roughly how much do you have in savings?", nl: "Hoeveel spaargeld heb je ongeveer?" },
    help: {
      en: "Together with your partner: savings and investments, minus debts. Many benefits have an asset limit.",
      nl: "Samen met je partner: spaargeld en beleggingen, min schulden. Veel regelingen hebben een vermogensgrens.",
    },
    chips: [0, 5000, 20000, 50000, 150000],
  },
];

export function visibleQuestions(answers) {
  return QUESTIONS.filter((q) => !q.when || q.when(answers));
}

/** A money answer as a yearly amount (or null if unknown/unanswered). */
export function yearly(answer) {
  if (!answer || answer.unknown || answer.amount == null) return null;
  return answer.per === "month" ? answer.amount * 12 : answer.amount;
}

/** A money answer as a monthly amount (or null if unknown/unanswered). */
export function monthly(answer) {
  if (!answer || answer.unknown || answer.amount == null) return null;
  return answer.per === "year" ? answer.amount / 12 : answer.amount;
}

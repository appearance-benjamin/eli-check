// What each result card says and where it sends people.
// `variable` names come from the OpenFisca package (openfisca_nl, see docs/api.md); the API decides
// amounts and eligibility, this file only decides presentation. Conditions follow `<variable>_voorwaarde_<naam>`.

// Checked 2026-10-29. Belastingdienst has no English pages for these, so both languages share the Dutch page.
const BD = "https://www.belastingdienst.nl/wps/wcm/connect/nl";
const MAASTRICHT = "https://www.gemeentemaastricht.nl";
const SZMH = "https://www.socialezaken-mh.nl";

export const LINKS = {
  zorgtoeslag: `${BD}/zorgtoeslag/content/kan-ik-zorgtoeslag-krijgen`,
  zorgtoeslagForeignStudent: `${BD}/zorgtoeslag/content/Zorgtoeslag-buitenlandse-student`,
  huurtoeslag: `${BD}/huurtoeslag/content/kan-ik-huurtoeslag-krijgen`,
  huurtoeslagStudentRoom: `${BD}/huurtoeslag/content/student-op-kamers-huurtoeslag`,
  kindgebonden_budget: `${BD}/kindgebonden-budget/content/kan-ik-kindgebonden-budget-krijgen`,
  belastingaangifte: `${BD}/belastingaangifte`,
  kinderbijslag: { en: "https://www.svb.nl/en/child-benefit", nl: "https://www.svb.nl/nl/kinderbijslag" },
  studiefinanciering: { en: "https://duo.nl/particulier/student-finance/", nl: "https://duo.nl/particulier/studiefinanciering/" },
  tegemoetkomingScholieren: "https://duo.nl/particulier/tegemoetkoming-scholieren/",
  bijstand: "https://www.rijksoverheid.nl/onderwerpen/bijstand",
  maastrichtBijstand: `${MAASTRICHT}/werk-en-inkomen/bijstandsuitkering`,
  maastrichtBijzondereBijstand: `${MAASTRICHT}/werk-en-inkomen/bijzondere-bijstand`,
  maastrichtInkomenstoeslag: `${MAASTRICHT}/werk-en-inkomen/individuele-inkomenstoeslag`,
  maastrichtKwijtschelding: `${MAASTRICHT}/werk-en-inkomen/kwijtschelding-belastingen`,
  maastrichtKindregelingen: `${MAASTRICHT}/onderwijs-en-jeugd/kindregelingen`,
  maastrichtVolwassenenfonds: `${MAASTRICHT}/werk-en-inkomen/volwassenenfonds-sport-cultuur-limburg`,
  maastrichtVroegsignalering: `${MAASTRICHT}/teamvroegsignalering`,
  maastrichtStudietoeslag: `${SZMH}/inkomen/studietoeslag`,
  collectieveZorgverzekering: `${SZMH}/kind-en-gezin/collectieve-zorgverzekering-vgz-zuid-limburg`,
  financialCoach: `${SZMH}/gratis-hulp-bij-geldzaken`,
  berekenJeRecht: `${SZMH}/bereken-je-recht`,
  huurteam: "https://huurteam-zuidlimburg.nl/",
  tooGoodToGo: { en: "https://www.toogoodtogo.com/en", nl: "https://www.toogoodtogo.com/nl" },
  maastrichtMarket: {
    en: "https://www.visitmaastricht.com/en/doing/shopping/shopping-at-the-market",
    nl: "https://www.visitmaastricht.com/nl/doen/shoppen/shoppen-op-de-markt",
  },
  kringloopZuid: "https://www.kringloopzuid.nl/",
  nibudStudent: "https://watkoststuderen.nibud.nl/",
  voedselbank: "https://voedselbankmaastricht.nl/",
  belastingTelefoon: {
    en: "https://www.belastingdienst.nl/wps/wcm/connect/bldcontenten/standaard_functies/individuals/contact/calling/tax_information_line_for_residents",
    nl: "https://www.belastingdienst.nl/wps/wcm/connect/nl/contact-met-dienst-toeslagen/content/bellen",
  },
  duoContact: { en: "https://duo.nl/particulier/contact-en/phone-us.jsp", nl: "https://www.rijksoverheid.nl/contact/contactgids/dienst-uitvoering-onderwijs-duo-studenten-en-scholieren" },
  szmhContact: `${SZMH}/contact`,
  bsgwContact: { en: "https://bsgw.nl/en/contact", nl: "https://bsgw.nl/contact" },
  geldfit: "https://www.geldfit.nl/",
  juridischLoket: "https://www.juridischloket.nl/",
  studentenrechtshulp: { en: "https://studentenrechtshulp.nl/en/", nl: "https://studentenrechtshulp.nl/" },
  umStudentSupport: "https://www.maastrichtuniversity.nl/study/admission-enrolment/financing-your-studies/financial-support-study-delays-um-student-support",
  umFunds: { en: "https://www.maastrichtuniversity.nl/funds-students", nl: "https://www.maastrichtuniversity.nl/nl/fondsen-voor-studenten" },
  // zuyd.nl blocks automated checks and has no confirmed profileringsfonds page; the homepage is the safe fallback.
  zuyd: "https://www.zuyd.nl/",
  // `concerns` pre-fills the fund as the goal of the donation.
  anneVanDenBan: {
    en: "https://www.wur.nl/en/about-wur/university-fund/how-donate/donate-now?concerns=Anne%20van%20den%20Ban",
    nl: "https://www.wur.nl/nl/over-wur/university-fund/doneren-aan-university-fund-wageningen/direct-doneren?concerns=Anne%20van%20den%20Ban",
  },
};

const isStudent = (a) => a.role === "student";
const rents = (a) => a.housing === "room" || a.housing === "independent";
const hasChildren = (a) => Object.values(a.children || {}).some((n) => n > 0);
const higherEd = (a) => ["um", "zuyd", "other_wo", "other_hbo"].includes(a.institution);
const inMaastricht = (a) => a.city === "maastricht" || a.city === "moving";

const GIFT_NOTE = {
  en: "Becomes a gift if you graduate within 10 years.",
  nl: "Wordt een gift als je binnen 10 jaar een diploma haalt.",
};
const MIGRANT_WORKER_NOTE = {
  en: "You qualify as an EU worker: DUO checks your payslips after each year and reclaims the grants (and charges for the travel product) if you worked too little. You can't combine it with study finance from home, such as BAföG.",
  nl: "Je komt in aanmerking als EU-werknemer: DUO controleert na elk jaar je loonstroken en vordert de beurzen terug (plus een bedrag voor het reisproduct) als je te weinig werkte. Je kunt het niet combineren met studiefinanciering uit je thuisland, zoals BAföG.",
};

/** Grant notes: the prestatiebeurs rule, plus the migrant-worker caveat when that's how you qualify. */
const grantNote = (a, v) => {
  const notes = [higherEd(a) && GIFT_NOTE, v.is_migrerend_werknemer && MIGRANT_WORKER_NOTE].filter(Boolean);
  return notes.length ? { en: notes.map((n) => n.en).join(" "), nl: notes.map((n) => n.nl).join(" ") } : null;
};

/** Prefix of a scheme's `_voorwaarde_` variables (`conditions` when it borrows another scheme's). */
export const conditionPrefix = (scheme) => `${scheme.conditions || scheme.variable}_voorwaarde_`;

/**
 * kind:
 *  monthly — € per month, counts towards the headline total
 *  yearly  — € once per year (shown, not added to the monthly total)
 *  perk    — in-kind benefit (boolean); `valueVariable` gives its monthly value
 * note(answers, values): optional extra line; `extra` lists further variables it reads.
 *  loan    — € per month you could borrow; never counted as income
 *  local   — boolean indicator for a municipal scheme (always "worth checking");
 *            `<variable>_bedrag` is shown per `bedragPer` (some are yearly amounts on a MONTH variable)
 * conditionText: per-scheme wording for unmet conditions, keyed like CONDITION_TEXT.
 */
export const SCHEMES = [
  {
    variable: "zorgtoeslag",
    kind: "monthly",
    icon: "heart",
    title: { en: "Healthcare allowance", nl: "Zorgtoeslag" },
    official: "Zorgtoeslag · Dienst Toeslagen",
    what: {
      en: "A monthly contribution towards your Dutch health insurance premium.",
      nl: "Een maandelijkse bijdrage aan de premie van je zorgverzekering.",
    },
    note: (a) => a.insurance === "unsure" && {
      en: "Only if you have Dutch basic health insurance — check this first.",
      nl: "Alleen als je een Nederlandse basisverzekering hebt — controleer dat eerst.",
    },
    link: (a) => (isStudent(a) && a.nationality !== "dutch" ? LINKS.zorgtoeslagForeignStudent : LINKS.zorgtoeslag),
    relevant: () => true,
  },
  {
    variable: "huurtoeslag",
    kind: "monthly",
    icon: "home",
    title: { en: "Rent allowance", nl: "Huurtoeslag" },
    official: "Huurtoeslag · Dienst Toeslagen",
    what: {
      en: "Help with the rent of a self-contained home with its own front door, kitchen, toilet and shower.",
      nl: "Een bijdrage in de huur van een zelfstandige woning met eigen voordeur, keuken, toilet en douche.",
    },
    link: (a) => (isStudent(a) && a.housing === "room" ? LINKS.huurtoeslagStudentRoom : LINKS.huurtoeslag),
    relevant: rents,
  },
  {
    variable: "kindgebonden_budget",
    kind: "monthly",
    icon: "family",
    title: { en: "Child budget", nl: "Kindgebonden budget" },
    official: "Kindgebonden budget · Dienst Toeslagen",
    what: {
      en: "Extra monthly support for parents with a lower or middle income.",
      nl: "Extra maandelijkse steun voor ouders met een lager of middeninkomen.",
    },
    link: LINKS.kindgebonden_budget,
    relevant: hasChildren,
  },
  {
    variable: "kinderbijslag",
    kind: "monthly",
    icon: "family",
    title: { en: "Child benefit", nl: "Kinderbijslag" },
    official: "Kinderbijslag · SVB",
    what: {
      en: "A contribution for every child under 18, paid each quarter — whatever your income.",
      nl: "Een bijdrage voor elk kind onder de 18, elk kwartaal uitbetaald — ongeacht je inkomen.",
    },
    link: LINKS.kinderbijslag,
    relevant: hasChildren,
  },
  {
    variable: "basisbeurs",
    conditions: "studiefinanciering",
    kind: "monthly",
    icon: "cap",
    title: { en: "Student grant", nl: "Basisbeurs" },
    official: "Studiefinanciering · DUO",
    what: {
      en: "A monthly grant from DUO for students in mbo, hbo or university.",
      nl: "Een maandelijkse beurs van DUO voor studenten in het mbo, hbo of wo.",
    },
    note: grantNote,
    extra: ["is_migrerend_werknemer"],
    conditionText: {
      nationaliteit: {
        en: "You need Dutch nationality or equal status. EU students qualify by working about 32 hours a month in the Netherlands, or after 5 years of living here.",
        nl: "Je hebt de Nederlandse nationaliteit of een gelijkgestelde status nodig. EU-studenten komen in aanmerking door ongeveer 32 uur per maand in Nederland te werken, of na 5 jaar hier wonen.",
      },
      onderwijs: {
        en: "Student finance is for full-time mbo (bol), hbo and university programmes.",
        nl: "Studiefinanciering is voor voltijd mbo (bol), hbo en wo.",
      },
      leeftijd: {
        en: "You must start before you turn 30 (and for mbo be 18 or older).",
        nl: "Je moet beginnen voor je 30e (en voor mbo 18 jaar of ouder zijn).",
      },
    },
    link: LINKS.studiefinanciering,
    relevant: (a) => isStudent(a) && a.institution !== "vo",
  },
  {
    variable: "aanvullende_beurs",
    kind: "monthly",
    icon: "cap",
    title: { en: "Supplementary grant", nl: "Aanvullende beurs" },
    official: "Studiefinanciering · DUO",
    what: {
      en: "An extra grant on top of the student grant when your parents have a lower income.",
      nl: "Een extra beurs bovenop de basisbeurs als je ouders een lager inkomen hebben.",
    },
    note: grantNote,
    extra: ["is_migrerend_werknemer"],
    link: LINKS.studiefinanciering,
  },
  {
    variable: "tegemoetkoming_scholieren",
    kind: "monthly",
    icon: "cap",
    title: { en: "Allowance for school students", nl: "Tegemoetkoming scholieren" },
    official: "Tegemoetkoming scholieren · DUO",
    what: {
      en: "A monthly allowance from DUO for secondary school students aged 18 or older. You don't have to pay it back.",
      nl: "Een maandelijkse bijdrage van DUO voor scholieren in het voortgezet onderwijs vanaf 18 jaar. Je hoeft het niet terug te betalen.",
    },
    link: LINKS.tegemoetkomingScholieren,
    relevant: (a) => isStudent(a) && a.institution === "vo",
  },
  {
    variable: "studentenreisproduct",
    valueVariable: "studentenreisproduct_waarde",
    kind: "perk",
    icon: "train",
    title: { en: "Free public transport", nl: "Studentenreisproduct" },
    official: "Studentenreisproduct · DUO",
    perkLabel: { en: "Free travel", nl: "Gratis reizen" },
    what: {
      en: "Travel free on Dutch trains, buses and trams on weekdays or weekends — and with a discount at other times.",
      nl: "Gratis reizen met trein, bus en tram door de week of in het weekend — en met korting op andere momenten.",
    },
    link: LINKS.studiefinanciering,
  },
  {
    variable: "bijstand",
    kind: "monthly",
    icon: "wallet",
    title: { en: "Social assistance", nl: "Bijstand" },
    official: "Bijstand · Gemeente",
    what: {
      en: "A monthly benefit from your municipality when your income is below the social minimum.",
      nl: "Een maandelijkse uitkering van je gemeente als je inkomen onder het sociaal minimum ligt.",
    },
    note: () => ({
      en: "This is an indication: the municipality looks at your full situation, including partner, housing costs and work obligations.",
      nl: "Dit is een indicatie: de gemeente kijkt naar je hele situatie, waaronder partner, woonkosten en arbeidsverplichtingen.",
    }),
    link: (a) => (inMaastricht(a) ? LINKS.maastrichtBijstand : LINKS.bijstand),
    // Students under 27 are excluded anyway; listing it for them is just noise.
    relevant: (a) => a.role !== "retired" && !(isStudent(a) && Number(a.age) < 27),
  },
  {
    variable: "belastingteruggave",
    kind: "yearly",
    icon: "receipt",
    title: { en: "Tax refund", nl: "Belasting terug" },
    official: "Aangifte inkomstenbelasting · Belastingdienst",
    what: {
      en: "Probably more wage tax is withheld this year than you owe. File a tax return for this year from 1 March next year to get the difference back.",
      nl: "Waarschijnlijk wordt er dit jaar meer loonheffing ingehouden dan je verschuldigd bent. Doe vanaf 1 maart volgend jaar aangifte over dit jaar om het verschil terug te krijgen.",
    },
    link: LINKS.belastingaangifte,
    relevant: () => false,
  },
  {
    variable: "maximale_lening",
    kind: "loan",
    icon: "loan",
    title: { en: "Student loan", nl: "Studielening" },
    official: "Lening · DUO",
    what: {
      en: "You can borrow at a low interest rate. It's a loan, not a gift — only borrow what you need.",
      nl: "Je kunt lenen tegen een lage rente. Het is een lening, geen gift — leen alleen wat je nodig hebt.",
    },
    link: LINKS.studiefinanciering,
  },
  {
    variable: "collegegeldkrediet",
    kind: "loan",
    icon: "loan",
    title: { en: "Tuition fee loan", nl: "Collegegeldkrediet" },
    official: "Collegegeldkrediet · DUO",
    what: {
      en: "Borrow the amount of your tuition fees, paid out monthly. Also open to EU students who don't qualify for other student finance.",
      nl: "Leen het bedrag van je collegegeld, maandelijks uitbetaald. Ook voor EU-studenten die geen andere studiefinanciering krijgen.",
    },
    link: LINKS.studiefinanciering,
  },
  {
    variable: "maastricht_individuele_studietoeslag",
    kind: "local",
    bedragPer: "month",
    icon: "city",
    tag: "Maastricht",
    title: { en: "Study allowance (disability)", nl: "Individuele studietoeslag" },
    official: "Sociale Zaken Maastricht-Heuvelland",
    what: {
      en: "Extra money each month when a disability or illness makes it impossible to earn alongside your studies. You need student finance and a medical assessment.",
      nl: "Extra geld per maand als een beperking of ziekte het onmogelijk maakt om naast je studie te verdienen. Je hebt studiefinanciering en een medisch advies nodig.",
    },
    link: LINKS.maastrichtStudietoeslag,
  },
  {
    variable: "maastricht_individuele_inkomenstoeslag",
    kind: "local",
    bedragPer: "year",
    icon: "city",
    tag: "Maastricht",
    title: { en: "Income supplement", nl: "Individuele inkomenstoeslag" },
    official: "Gemeente Maastricht",
    what: {
      en: "A yearly payment if you've lived on a low income for at least 3 years, without studying with student finance in that time.",
      nl: "Een jaarlijkse betaling als je al minstens 3 jaar van een laag inkomen leeft, zonder in die tijd met studiefinanciering te studeren.",
    },
    link: LINKS.maastrichtInkomenstoeslag,
  },
  {
    variable: "maastricht_kwijtschelding",
    kind: "local",
    icon: "receipt",
    tag: "Maastricht",
    title: { en: "Waiver of municipal taxes", nl: "Kwijtschelding gemeentelijke belastingen" },
    official: "Gemeente Maastricht · BsGW",
    what: {
      en: "With a low income you may not have to pay municipal taxes such as the waste and sewage charges. In Maastricht, BsGW handles this.",
      nl: "Met een laag inkomen hoef je gemeentelijke belastingen zoals afvalstoffen- en rioolheffing misschien niet te betalen. In Maastricht regelt BsGW dit.",
    },
    link: LINKS.maastrichtKwijtschelding,
  },
  {
    variable: "maastricht_collectieve_zorgverzekering",
    kind: "local",
    icon: "shield",
    tag: "Maastricht",
    title: { en: "Health insurance for low incomes", nl: "Collectieve zorgverzekering" },
    official: "VGZ Zuid-Limburgpakket · Gemeente Maastricht",
    what: {
      en: "A health insurance package arranged by the municipality with VGZ, with extra coverage (for example dental care and your deductible) at a lower cost.",
      nl: "Een zorgverzekering die de gemeente met VGZ regelt, met extra dekking (bijvoorbeeld tandarts en eigen risico) tegen lagere kosten.",
    },
    link: LINKS.collectieveZorgverzekering,
  },
  {
    variable: "maastricht_bijzondere_bijstand",
    kind: "local",
    icon: "wallet",
    tag: "Maastricht",
    title: { en: "Help with unexpected costs", nl: "Bijzondere bijstand" },
    official: "Gemeente Maastricht",
    what: {
      en: "For necessary costs you can't pay yourself — like a broken fridge, legal aid or medical costs your insurance doesn't cover.",
      nl: "Voor noodzakelijke kosten die je zelf niet kunt betalen — zoals een kapotte koelkast, rechtsbijstand of medische kosten die je verzekering niet dekt.",
    },
    link: LINKS.maastrichtBijzondereBijstand,
  },
  {
    variable: "maastricht_kindregelingen",
    kind: "local",
    bedragPer: "year",
    icon: "family",
    tag: "Maastricht",
    title: { en: "Support for your children", nl: "Regelingen voor kinderen" },
    official: "Gemeente Maastricht · Stichting Leergeld",
    what: {
      en: "A yearly allowance for school costs, plus help with sports, music and school trips through Stichting Leergeld and Jeugdfonds Sport & Cultuur.",
      nl: "Een jaarlijkse bijdrage voor schoolkosten, plus hulp bij sport, muziek en schoolreisjes via Stichting Leergeld en het Jeugdfonds Sport & Cultuur.",
    },
    link: LINKS.maastrichtKindregelingen,
  },
  {
    variable: "maastricht_volwassenenfonds",
    kind: "local",
    icon: "sparkle",
    tag: "Maastricht",
    title: { en: "Sport & culture fund", nl: "Volwassenenfonds Sport & Cultuur" },
    official: "Volwassenenfonds Sport & Cultuur Limburg",
    what: {
      en: "Up to €350 a year for sport or €550 for culture — think a gym or club membership, or music lessons.",
      nl: "Tot €350 per jaar voor sport of €550 voor cultuur — denk aan een sportclub of muziekles.",
    },
    link: LINKS.maastrichtVolwassenenfonds,
  },
];

/** Cards that depend only on the answers, not on the calculation. */
export const STATIC_TIPS = [
  {
    id: "rent_check",
    icon: "home",
    tag: "Maastricht",
    when: (a) => rents(a) && inMaastricht(a),
    title: { en: "Free rent check", nl: "Gratis huurcheck" },
    official: "Huurteam Zuid-Limburg",
    what: {
      en: "Many rooms and studios in Maastricht cost more than the legal maximum under the Affordable Rent Act. The Huurteam checks your rent for free and helps you get it lowered.",
      nl: "Veel kamers en studio's in Maastricht zijn duurder dan wettelijk mag onder de Wet betaalbare huur. Het Huurteam checkt gratis je huur en helpt je die te verlagen.",
    },
    link: LINKS.huurteam,
  },
  {
    id: "tax_years",
    icon: "receipt",
    when: (a) => a.role === "student" || a.role === "working",
    title: { en: "Claim tax back for earlier years", nl: "Belasting terugvragen over eerdere jaren" },
    official: "Belastingdienst",
    what: () => {
      const year = new Date().getFullYear();
      return {
        en: `Had a job in ${year - 5}–${year - 1}? You can still file a tax return for those years and often get wage tax back. ${year - 5} must be filed before 31 December ${year}.`,
        nl: `Had je een baan in ${year - 5}–${year - 1}? Je kunt over die jaren nog aangifte doen en krijgt vaak loonheffing terug. ${year - 5} moet vóór 31 december ${year} binnen zijn.`,
      };
    },
    link: LINKS.belastingaangifte,
  },
  {
    id: "um_support",
    icon: "sparkle",
    tag: "UM",
    when: (a) => a.institution === "um",
    title: { en: "UM Student Support Fund", nl: "UM Student Support Fund" },
    official: "Maastricht University",
    what: {
      en: "Delayed by illness, a disability, family circumstances, top-level sport or a board year? UM pays €345.50 for each month of delay, up to 12 months. For sudden money trouble there's also the UM Emergency Fund.",
      nl: "Vertraging door ziekte, een beperking, familieomstandigheden, topsport of een bestuursjaar? De UM betaalt €345,50 per maand vertraging, tot 12 maanden. Voor plotselinge geldnood is er ook het UM Noodfonds.",
    },
    link: LINKS.umStudentSupport,
  },
  {
    id: "zuyd_profiling",
    icon: "sparkle",
    tag: "Zuyd",
    when: (a) => a.institution === "zuyd",
    title: { en: "Zuyd Profiling Fund", nl: "Zuyd Profileringsfonds" },
    official: "Zuyd Hogeschool",
    what: {
      en: "Financial support if you're delayed in your studies because of special circumstances such as illness or a disability. Ask Zuyd's student counsellor (studentendecaan).",
      nl: "Financiële ondersteuning als je studievertraging oploopt door bijzondere omstandigheden zoals ziekte of een beperking. Vraag ernaar bij de studentendecaan van Zuyd.",
    },
    link: LINKS.zuyd,
  },
];

/** Free, local help — shown to people in (or moving to) Maastricht. */
export const HELP = [
  {
    when: () => true,
    title: { en: "Free financial coach", nl: "Gratis financieel coach" },
    what: {
      en: "Confidential help with budgeting, forms and debts from Sociale Zaken — email financialcoach@maastricht.nl.",
      nl: "Vertrouwelijke hulp bij budgetteren, formulieren en schulden van Sociale Zaken — mail financialcoach@maastricht.nl.",
    },
    link: LINKS.financialCoach,
  },
  {
    when: () => true,
    title: { en: "BerekenJeRecht", nl: "BerekenJeRecht" },
    what: {
      en: "The municipality's own detailed calculator for all national and local schemes.",
      nl: "De eigen, uitgebreide rekenhulp van de gemeente voor alle landelijke en lokale regelingen.",
    },
    link: LINKS.berekenJeRecht,
  },
  {
    when: isStudent,
    title: { en: "Studentenrechtsbureau Maastricht", nl: "Studentenrechtsbureau Maastricht" },
    what: {
      en: "Free legal advice for students — for example about your landlord, employer or deposit.",
      nl: "Gratis juridisch advies voor studenten — bijvoorbeeld over je verhuurder, werkgever of borg.",
    },
    link: LINKS.studentenrechtshulp,
  },
  {
    when: () => true,
    title: { en: "Behind on rent or bills?", nl: "Achter met huur of rekeningen?" },
    what: {
      en: "Team Vroegsignalering helps early, before payment arrears turn into debts.",
      nl: "Team Vroegsignalering helpt vroeg, voordat betalingsachterstanden schulden worden.",
    },
    link: LINKS.maastrichtVroegsignalering,
  },
].map((h) => ({ ...h, show: (a) => inMaastricht(a) && h.when(a) }));

/** Offices to call, checked on their own contact pages (October 2026). `local` ones are Maastricht-only. */
export const CALL = [
  {
    when: () => true,
    name: { en: "Belastingdienst — allowances and tax", nl: "Belastingdienst — toeslagen en belasting" },
    what: { en: "Questions about healthcare, rent and child allowances, or your tax return.", nl: "Vragen over zorg-, huur- en kindtoeslagen, of je aangifte." },
    number: "0800 0543",
    hours: { en: "Mon–Thu 8:00–20:00, Fri 8:00–17:00 · free", nl: "ma–do 8.00–20.00, vr 8.00–17.00 · gratis" },
    abroad: "+31 555 385 385",
    link: LINKS.belastingTelefoon,
  },
  {
    when: isStudent,
    name: { en: "DUO — student finance", nl: "DUO — studiefinanciering" },
    what: { en: "Questions about your grant, loan or student travel product.", nl: "Vragen over je beurs, lening of studentenreisproduct." },
    number: "050 599 7755",
    hours: { en: "Weekdays 9:00–17:00", nl: "Werkdagen 9.00–17.00" },
    abroad: "+31 50 599 7755",
    link: LINKS.duoContact,
  },
  {
    local: true,
    when: () => true,
    name: { en: "Gemeente Maastricht and Sociale Zaken", nl: "Gemeente Maastricht en Sociale Zaken" },
    what: { en: "Social assistance, the income supplement, special assistance and the city's other schemes.", nl: "Bijstand, de inkomenstoeslag, bijzondere bijstand en de andere regelingen van de gemeente." },
    number: "14 043",
    hours: { en: "Weekdays 8:30–16:30", nl: "Werkdagen 8.30–16.30" },
    abroad: "+31 43 350 4040",
    link: LINKS.szmhContact,
  },
  {
    local: true,
    when: () => true,
    name: { en: "BsGW — municipal tax waiver", nl: "BsGW — kwijtschelding" },
    what: { en: "Ask for the waiver form for waste and sewage charges.", nl: "Vraag het formulier voor kwijtschelding van afvalstoffen- en rioolheffing aan." },
    number: "088 842 0420",
    hours: { en: "Weekdays 9:00–17:00", nl: "Werkdagen 9.00–17.00" },
    link: LINKS.bsgwContact,
  },
  {
    when: () => true,
    name: { en: "Geldfit — money worries", nl: "Geldfit — geldzorgen" },
    what: { en: "Free, anonymous help when bills or debts pile up. They connect you with local help.", nl: "Gratis en anonieme hulp als rekeningen of schulden zich opstapelen. Ze brengen je in contact met hulp in de buurt." },
    number: "0800 8115",
    hours: { en: "Weekdays 9:00–21:00 · free", nl: "Werkdagen 9.00–21.00 · gratis" },
    link: LINKS.geldfit,
  },
  {
    when: () => true,
    name: { en: "Juridisch Loket — legal advice", nl: "Juridisch Loket — juridisch advies" },
    what: { en: "Free legal advice, for example when an allowance is refused or must be paid back.", nl: "Gratis juridisch advies, bijvoorbeeld als een toeslag wordt geweigerd of terugbetaald moet worden." },
    number: "0800 8020",
    hours: { en: "Weekdays 9:00–17:00 · free", nl: "Werkdagen 9.00–17.00 · gratis" },
    link: LINKS.juridischLoket,
  },
].map((c) => ({ ...c, tel: c.number.replace(/\s/g, ""), show: (a) => (!c.local || inMaastricht(a)) && c.when(a) }));

/** Everyday ways to spend less: food, furniture, rent and budgeting. `local` ones are Maastricht-only. */
export const SAVE = [
  {
    icon: "wallet",
    when: () => true,
    title: { en: "Too Good To Go", nl: "Too Good To Go" },
    what: {
      en: "Surprise bags of food that shops, bakeries and restaurants would otherwise throw away, for about a third of the price.",
      nl: "Verrassingspakketten met eten dat winkels, bakkers en restaurants anders weggooien, voor ongeveer een derde van de prijs.",
    },
    link: LINKS.tooGoodToGo,
  },
  {
    icon: "city",
    local: true,
    when: () => true,
    title: { en: "The market on the Markt", nl: "De markt op de Markt" },
    what: {
      en: "Fruit, vegetables, bread and cheese every Wednesday and Friday from 9:00 to 15:00, often cheaper than the supermarket.",
      nl: "Groente, fruit, brood en kaas elke woensdag en vrijdag van 9.00 tot 15.00 uur, vaak goedkoper dan in de supermarkt.",
    },
    link: LINKS.maastrichtMarket,
  },
  {
    icon: "home",
    local: true,
    when: () => true,
    title: { en: "Kringloop Zuid", nl: "Kringloop Zuid" },
    what: {
      en: "A big second-hand store at Watermolen 52 with furniture, kitchenware, lamps, clothes and bikes.",
      nl: "Een grote kringloopwinkel aan de Watermolen 52 met meubels, keukenspullen, lampen, kleding en fietsen.",
    },
    link: LINKS.kringloopZuid,
  },
  {
    icon: "receipt",
    when: isStudent,
    title: { en: "Plan your student budget", nl: "Maak je studentenbegroting" },
    what: {
      en: "Nibud's free tool shows what studying costs per month and where you can save.",
      nl: "De gratis tool van het Nibud laat zien wat studeren per maand kost en waar je kunt besparen.",
    },
    link: LINKS.nibudStudent,
  },
  {
    icon: "heart",
    local: true,
    when: () => true,
    title: { en: "Voedselbank Maastricht", nl: "Voedselbank Maastricht" },
    what: {
      en: "If your income doesn't cover your living costs, the food bank gives a free food package every week.",
      nl: "Is je inkomen te laag voor je vaste lasten? Dan geeft de voedselbank elke week een gratis voedselpakket.",
    },
    link: LINKS.voedselbank,
  },
].map((s) => ({ ...s, show: (a) => (!s.local || inMaastricht(a)) && s.when(a) }));

/**
 * The "pay it forward" cause at the end of the results: master's scholarships for students from
 * low-income countries (University Fund Wageningen, ANBI). `monthly` is the suggested gift in euros.
 */
export const CAUSE = {
  name: { en: "Anne van den Ban Fund", nl: "Anne van den Ban Fonds" },
  monthly: 10,
  link: LINKS.anneVanDenBan,
};

/** Plain-language reasons for unmet `<variable>_voorwaarde_<naam>` conditions, keyed by <naam>. */
export const CONDITION_TEXT = {
  leeftijd: { en: "Your age doesn't fit the age rules.", nl: "Je leeftijd past niet bij de leeftijdsregels." },
  verzekering: { en: "You need Dutch basic health insurance — a foreign (EHIC) or private student policy doesn't count.", nl: "Je hebt een Nederlandse basisverzekering nodig — een buitenlandse (EHIC) of particuliere studentenverzekering telt niet." },
  inkomen: { en: "Your (household) income is above the limit.", nl: "Je (huishoud)inkomen ligt boven de grens." },
  vermogen: { en: "Your savings are above the asset limit.", nl: "Je spaargeld ligt boven de vermogensgrens." },
  woonruimte: { en: "It's only for self-contained homes with their own front door, kitchen, toilet and shower.", nl: "Alleen voor zelfstandige woningen met eigen voordeur, keuken, toilet en douche." },
  huur: { en: "Your rent is lower than the part every household pays itself (basishuur).", nl: "Je huur is lager dan het deel dat elk huishouden zelf betaalt (basishuur)." },
  nationaliteit: { en: "Your nationality or residence permit doesn't qualify (yet).", nl: "Je nationaliteit of verblijfsvergunning geeft (nog) geen recht." },
  verblijf: { en: "Your residence status doesn't give access to it.", nl: "Je verblijfsstatus geeft er geen recht op." },
  onderwijs: { en: "It depends on the type of education you follow.", nl: "Het hangt af van het soort opleiding dat je volgt." },
  geen_studie: { en: "Students who can get student finance are excluded.", nl: "Studenten die studiefinanciering kunnen krijgen zijn uitgesloten." },
  studiefinanciering: { en: "You need to receive student finance.", nl: "Je moet studiefinanciering ontvangen." },
  beperking: { en: "It's for students whose disability or illness makes earning alongside study impossible.", nl: "Het is voor studenten die door een beperking of ziekte niet naast hun studie kunnen verdienen." },
  kinderen: { en: "You need children under 18 living with you.", nl: "Je moet kinderen onder de 18 hebben die bij je wonen." },
  woonplaats: { en: "This is a Maastricht scheme.", nl: "Dit is een regeling van de gemeente Maastricht." },
};

# Toeslagen and related reference values, 2026 (NL)

Researched 2026-10-29. Every value was checked against an official source: Belastingdienst/Dienst Toeslagen, wetten.overheid.nl, rijksoverheid.nl or volkshuisvestingnederland.nl.
Confidence labels:
- **VERIFIED**: the value is stated literally in the official source.
- **DERIVED**: the value is computed from VERIFIED values. It is not stated as such in a source.
- **UNVERIFIED**: no official statement was found.

Amounts are in EUR. "jaar" means per calendar year (berekeningsjaar) and "maand" means per month.

Main sources (short keys used in the tables):

| Key | URL |
|---|---|
| ZT-PDF | https://download.belastingdienst.nl/toeslagen/docs/berekening_zorgtoeslag_tg0821z61fd.pdf ("Berekening zorgtoeslag 2026", TG 082-1Z61FD, Jan 2026) |
| HT-PDF | https://download.belastingdienst.nl/toeslagen/docs/berekening_huurtoeslag_tg0831z61fd.pdf ("Berekening huurtoeslag 2026", TG 083-1Z61FD, Jan 2026) |
| KGB-PDF | https://download.belastingdienst.nl/toeslagen/docs/berekening_kindgebonden_budget_tg0811z61fd.pdf ("Berekening kindgebonden budget 2026", TG 081-1Z61FD, Jan 2026) |
| Wzt | https://wetten.overheid.nl/BWBR0018451/2026-01-01 (Wet op de zorgtoeslag) |
| Awir | https://wetten.overheid.nl/BWBR0018472/2026-01-01 (Algemene wet inkomensafhankelijke regelingen) |
| Wht | https://wetten.overheid.nl/BWBR0008659/2026-01-01 (Wet op de huurtoeslag) |
| WKB | https://wetten.overheid.nl/BWBR0022751/2026-01-01 (Wet op het kindgebonden budget) |
| PW-jan / PW-jul | https://wetten.overheid.nl/BWBR0015703/2026-01-01 and https://wetten.overheid.nl/BWBR0015703/2026-07-01 (Participatiewet) |
| NB-jan | https://www.rijksoverheid.nl/documenten/2025/12/04/normenbrief-1-januari-2026-informatie-voor-gemeenten (PDF: https://open.overheid.nl/documenten/8d75e6c2-7cc8-4fcb-9532-5bc8e7af6880/file) |
| WML | https://www.rijksoverheid.nl/onderwerpen/minimumloon/bedragen-minimumloon/bedragen-minimumloon-2026 |
| BD-ZT | https://www.belastingdienst.nl/wps/wcm/connect/nl/zorgtoeslag/content/kan-ik-zorgtoeslag-krijgen |
| BD-HT | https://www.belastingdienst.nl/wps/wcm/connect/nl/huurtoeslag/content/kan-ik-huurtoeslag-krijgen |
| BD-HT2026 | https://www.belastingdienst.nl/wps/wcm/connect/nl/huurtoeslag/content/huurtoeslag-verandert-vanaf-2026 |

---

## 0. Rules common to all toeslagen (Awir)

| Name | Value | Unit | Valid from | Source | Confidence |
|---|---|---|---|---|---|
| Minimum toeslag: not granted if the annual amount is below | 24 | EUR/jaar | 2026-01-01 | Awir art. 14 lid 5 | VERIFIED |
| Rounding of the annual tegemoetkoming | arithmetic, to whole euros | - | 2026-01-01 | Awir art. 14 lid 4 | VERIFIED |
| Rounding of the monthly voorschot | down (floor) to whole euros | maand | 2026-01-01 | HT-PDF stap 7 ("Bedrag afronden naar beneden op hele euro's"). All worked examples in ZT-PDF and KGB-PDF also floor. | VERIFIED |
| Toetsingsinkomen | the "inkomensgegeven" for the year, which is the verzamelinkomen. Non-NL-taxable income is added. | jaar | - | Awir art. 8 | VERIFIED |
| Default vermogensgrens (used by huurtoeslag) | 38.479 single / 76.958 with toeslagpartner | rendementsgrondslag on 1 Jan | 2026-01-01 | Awir art. 7 lid 3 | VERIFIED |
| Income exemption for co-resident children under 23 (huurtoeslag medebewoner) | only income above 6.218 counts | jaar | 2026-01-01 | Awir art. 7 lid 6; HT-PDF stap 5 | VERIFIED |
| Residence | The applicant must have rechtmatig verblijf (Vw 2000 art. 8 a-e, l). There is no entitlement if the partner, or a medebewoner aged 18+, lacks rechtmatig verblijf. | - | - | Awir art. 9 lid 2-3; BD zorgtoeslag-andere-nationaliteit page | VERIFIED |

Consistency check of the published income limits: with the €24 rule and arithmetic rounding of the annual amount, the Zorgtoeslag formula reproduces the official maximum toetsingsinkomen exactly. Single: €40.857 gives 23,53, which rounds to 24 and is paid. €40.858 gives 23,40, which rounds to 23 and is not paid. Partners: €51.142 gives 23,58 (paid) and €51.143 gives 23,44 (not paid). A formula that implements the €24 threshold therefore does not need a separate income-limit parameter.

---

## 1. Zorgtoeslag 2026

### Parameters

| Name | Value | Unit | Valid from | Source | Confidence |
|---|---|---|---|---|---|
| standaardpremie (single) | 2.119 | jaar | 2026-01-01 | ZT-PDF stap 1 | VERIFIED |
| standaardpremie (with toeslagpartner = 2x) | 4.238 | jaar | 2026-01-01 | ZT-PDF stap 1; Wzt art. 2 lid 1 | VERIFIED |
| drempelinkomen | 29.736 | jaar | 2026-01-01 | ZT-PDF stap 3 | VERIFIED |
| normpercentage op drempelinkomen, single | 1,912% | - | 2026-01-01 | ZT-PDF; Wzt art. 2 lid 3 | VERIFIED |
| normpercentage op drempelinkomen, with partner | 4,289% | - | 2026-01-01 | ZT-PDF; Wzt art. 2 lid 3 | VERIFIED |
| normpercentage on income above drempelinkomen (single and partner) | 13,73% (law: 13,730%) | - | 2026-01-01 | ZT-PDF; Wzt art. 2 lid 3 | VERIFIED |
| maximale zorgtoeslag, single | 1.550 (1.550,45 unrounded); 129 per month | jaar / maand | 2026-01-01 | ZT-PDF stap 3 and example 1; zorgtoeslag/content/hoeveel-zorgtoeslag | VERIFIED |
| maximale zorgtoeslag, with partner | 2.963 (2.962,62 unrounded); 246 per month | jaar / maand | 2026-01-01 | ZT-PDF stap 3; hoeveel-zorgtoeslag page (€246) | VERIFIED |
| maximum toetsingsinkomen, single | 40.857 | jaar | 2026-01-01 | ZT-PDF stap 2; BD-ZT | VERIFIED |
| maximum toetsingsinkomen, with partner (combined) | 51.142 | jaar | 2026-01-01 | ZT-PDF stap 2; BD-ZT | VERIFIED |
| vermogensgrens, single | 146.011 | on 1 Jan 2026 | 2026-01-01 | ZT-PDF; Wzt art. 3 lid 1; BD-ZT | VERIFIED |
| vermogensgrens, with partner | 184.633 | on 1 Jan 2026 | 2026-01-01 | ZT-PDF; Wzt art. 3 lid 1; BD-ZT | VERIFIED |
| factor when the partner is not a "verzekerde" | 50% | - | 2026-01-01 | Wzt art. 2 lid 4; ZT-PDF stap 4 | VERIFIED |

No change to these values during 2026 was found. The Wzt text is valid from 2026-01-01 with no amendment until 2027-01-01.

### Formula (ZT-PDF, Wzt art. 2)

```
standaardpremie_hh = 2.119            (single)
                   = 2 x 2.119 = 4.238 (with toeslagpartner)
inkomen            = toetsingsinkomen (single) | toetsingsinkomen aanvrager + toetsingsinkomen partner
Normpremie (single)  = 1,912% x drempelinkomen + 13,73% x max(0, toetsingsinkomen - drempelinkomen)
Normpremie (partner) = 4,289% x drempelinkomen + 13,73% x max(0, gezamenlijk toetsingsinkomen - drempelinkomen)
Zorgtoeslag (jaar)   = max(0, standaardpremie_hh - normpremie)
   x 50%  if the toeslagpartner is not a verzekerde (e.g. military)
not granted if vermogen > grens, or if the rounded annual amount < 24 (Awir 14 lid 5)
per maand (voorschot) = floor(jaar / 12)
```

For applicants living abroad, ZT-PDF stap 5 uses a woonlandfactor: (standaardpremie x woonlandfactor) - normpremie. This is out of scope for an NL-resident tool.

### Eligibility conditions

| Condition | Rule | Source | Confidence |
|---|---|---|---|
| Age | "verzekerde" status starts on the 1st day of the month after the month the person turns 18 | Wzt art. 1 lid 1 c; BD-ZT ("U bent 18 jaar of ouder") | VERIFIED |
| Health insurance | Must hold a Dutch basic zorgverzekering (Zvw) or be insured via the CAK. Not covered: a visitor or temporary insurance, a "verdragspolis", or a voluntary insurance for foreign students. Military personnel and gemoedsbezwaarden also get nothing. | Wzt art. 1 c; https://www.belastingdienst.nl/wps/wcm/connect/nl/zorgtoeslag/content/voor-welke-zorgverzekering-zorgtoeslag | VERIFIED |
| Residence | rechtmatig verblijf for the applicant, and also for the partner | Awir art. 9; https://www.belastingdienst.nl/wps/wcm/connect/nl/zorgtoeslag/content/zorgtoeslag-andere-nationaliteit | VERIFIED |
| Income and vermogen | see table above | | VERIFIED |

### Test cases (official worked examples, ZT-PDF)

| # | Inputs | Expected | Note |
|---|---|---|---|
| ZT-1 | single, toetsingsinkomen 19.000 | normpremie 568,55; zorgtoeslag 1.550,45/jaar; 129,20/maand, paid as **129** | Below the drempelinkomen the second term is 0 |
| ZT-2 | partners, incomes 7.000 + 26.200 = 33.200; the partner (military) is not a verzekerde | normpremie 1.750,98; 4.238 - 1.750,98 = 2.487,02; x 50% = **1.243,51/jaar**; paid as **103/maand** | The PDF prints "103,02" per month. The correct value is 1.243,51 / 12 = 103,63, and floor gives 103. This looks like a typo in the PDF. |
| ZT-3 | partners in Belgium, 12.000 + 11.000 = 23.000, woonlandfactor BE 0,8165, partner not insured | normpremie 1.275,37; (4.238 x 0,8165 - 1.275,37) x 50% = 1.092,48/jaar; **91/maand** | Abroad case, optional |
| ZT-4 | single, 0 income | 1.550,45/jaar, **129/maand** | Derived from the formula; matches the "€129" on the hoeveel-zorgtoeslag page |
| ZT-5 | partners, 0 income | 2.962,62/jaar, **246/maand** | Derived; matches "€246" on the hoeveel-zorgtoeslag page |
| ZT-6 | single 40.857 / 40.858 | 23,53 rounds to 24 (paid) / 23,40 rounds to 23 (not paid) | DERIVED; reproduces the official limit |

Note: the hoeveel-zorgtoeslag page also has a 500-euro income table. Its rows (e.g. "tot €35.000: €69") do not exactly reproduce the formula at the bin edge. The binning method is unknown, so do not use those rows as test cases.

---

## 2. Huurtoeslag 2026 (major reform since 1 Jan 2026)

### What changed vs 2025 (Wet van 18-12-2024, Stb. 2024, 425 "vereenvoudiging huurtoeslag", in force 2026-01-01)
- **The maximale huurgrens no longer bars entitlement.** In 2025 there was no huurtoeslag if the rent was above €900,07 (€477,20 for young people). From 2026 the rent is simply capped at the huurgrens (rekenhuur = min(kale huur, huurgrens)). Sources: BD-HT2026; Wht art. 21 lid 1 d.
- **Basishuur no longer depends on income.** It is now a fixed amount per household type. An *inkomensafhankelijke correctie* (linear phase-out) is applied instead (HT-PDF stap 2 and 6; Wht art. 21 lid 2). The old a*Y^2 + b*Y basishuur formula and the taakstellingsbedrag are gone (Wht art. 18-19 vervallen per 01-01-2026).
- **The youth age limit moves from 23 to 21.** In 2025 the under-23 rent cap was €477,20; in 2026 it is under-21 and €498,20 (BD-HT2026).
- **Servicekosten no longer count.** The rekenhuur is the kale huur. Up to 2025, 4 kinds of service costs counted, at up to €12 each (BD welke-huur-telt-mee page).
- **40% band**: in 2026 the band above the aftoppingsgrens is subsidised at 40% for every household where the 932,93 cap applies (HT-PDF stap 4).
- There is no separate income limit in 2026. Huurtoeslag runs out through the correction (see the derived break-even below). The Belastingdienst says the maximum income "verschilt per situatie" (maximaal-inkomen-huurtoeslag page).

### Parameters

| Name | Value | Unit | Valid from | Source | Confidence |
|---|---|---|---|---|---|
| maximale huurgrens (huurgrens), standard | 932,93 | maand | 2026-01-01 | HT-PDF stap 1; Wht art. 13 lid 1 a | VERIFIED |
| huurgrens, young people under 21 | 498,20 | maand | 2026-01-01 | HT-PDF stap 1; Wht art. 13 lid 1 b | VERIFIED |
| basishuur, 1-person household | 202,52 | maand | 2026-01-01 | HT-PDF stap 2 | VERIFIED |
| basishuur, 2+-person household | 200,71 | maand | 2026-01-01 | HT-PDF stap 2 | VERIFIED |
| kwaliteitskortingsgrens (everyone) | 498,20 | maand | 2026-01-01 | HT-PDF stap 3; Wht art. 20 lid 1 | VERIFIED |
| aftoppingsgrens, 1-2 persons | 713,02 | maand | 2026-01-01 | HT-PDF stap 4; Wht art. 20 lid 2 a | VERIFIED |
| aftoppingsgrens, 3+ persons | 764,14 | maand | 2026-01-01 | HT-PDF stap 4; Wht art. 20 lid 2 b | VERIFIED |
| subsidy %, basishuur up to kwaliteitskortingsgrens (deel A) | 100% | - | 2026-01-01 | HT-PDF; Wht art. 21 lid 1 a | VERIFIED |
| subsidy %, kwaliteitskortingsgrens up to aftoppingsgrens (deel B) | 65% | - | 2026-01-01 | HT-PDF stap 4 | VERIFIED |
| subsidy %, aftoppingsgrens up to huurgrens (deel C) | 40% | - | 2026-01-01 | HT-PDF stap 4 | VERIFIED |
| subsidy %, above huurgrens | 0% | - | 2026-01-01 | Wht art. 21 lid 1 d | VERIFIED |
| inkomensijkpunt (minimum-inkomensijkpunt), 1-person | 23.425 | jaar | 2026-01-01 | HT-PDF stap 6 | VERIFIED |
| inkomensijkpunt, 2+-person | 31.500 | jaar | 2026-01-01 | HT-PDF stap 6 | VERIFIED |
| afbouwpercentage, 1-person | 27% | per jaar (apply /12) | 2026-01-01 | HT-PDF stap 6; Wht art. 21 lid 2 a | VERIFIED |
| afbouwpercentage, 2+-person | 22% | per jaar (apply /12) | 2026-01-01 | HT-PDF stap 6; Wht art. 21 lid 2 b | VERIFIED |
| vermogensgrens, single applicant | 38.479 | on 1 Jan 2026 | 2026-01-01 | HT-PDF; BD-HT; Awir art. 7 lid 3 | VERIFIED |
| vermogensgrens, applicant + toeslagpartner | 76.958 | on 1 Jan 2026 | 2026-01-01 | HT-PDF; BD-HT; Awir art. 7 lid 3 | VERIFIED |
| vermogensgrens, per medebewoner | 38.479 | on 1 Jan 2026 | 2026-01-01 | HT-PDF; Awir art. 7 lid 4 | VERIFIED |
| income exemption for co-resident children < 23 at the start of the year | 6.218 | jaar | 2026-01-01 | HT-PDF stap 5; Awir art. 7 lid 6 | VERIFIED |
| minimum payout | < 24/jaar not granted | jaar | 2026-01-01 | Awir art. 14 lid 5 | VERIFIED |
| normhuur 2026 (basishuur = normhuur - 1,82 single / - 3,63 multi) | 204,34 | maand | 2026-01-01 | Wht art. 16-17 structure. The consolidated text still prints 252,49, which does not reproduce the PDF basishuur. | DERIVED / UNVERIFIED (not needed for the formula; use the basishuur values) |

No mid-2026 change was found. The Wht text has been valid from 2026-01-01 with no later amendment.

### Formula (HT-PDF stap 1-7, Wht art. 21)

```
huurgrens  = 498,20  if every member of the household (huurder, partner, medebewoners) is < 21
                     AND nobody has a handicap AND there is no (pleeg)kind in the home
           = 932,93  otherwise (Wht art. 13 lid 1; "we kijken naar de oudste bewoner")
rekenhuur  = min(kale huur [+ standplaatshuur for a woonwagen], huurgrens)      # servicekosten no longer count
basishuur  = 202,52 (1-person) | 200,71 (2+ persons)
KKG        = 498,20
aftop      = 713,02 (1-2 persons) | 764,14 (3+ persons)
rekeninkomen = sum of toetsingsinkomens of huurder + toeslagpartner + medebewoners
               (children < 23: only the part above 6.218; onderhuurders excluded; floor at 0)

A = max(0, min(rekenhuur, KKG) - basishuur)              # 100%  (no huurtoeslag at all if rekenhuur <= basishuur)
B = 65% x max(0, min(rekenhuur, aftop) - KKG)
C = 40% x max(0, rekenhuur - aftop)
D = max(0, rekeninkomen - ijkpunt) x (afbouwpercentage / 12)
      ijkpunt = 23.425 / 31.500 ; afbouwpercentage = 27% / 22%   (1-person / 2+ persons)
huurtoeslag per maand = floor(max(0, A + B + C - D))
not granted if any vermogensgrens is exceeded, or if the annual amount < 24
```

**Ambiguities to flag in the implementation:**
1. For a household of young people only (<21), HT-PDF stap 7 says to fill in "alleen onderdeel A" and that this is the huurtoeslag. Wht art. 21 lid 2 applies the correction D to **every** rekeninkomen above the ijkpunt, with no age exception. None of the official examples covers a youth household with income above the ijkpunt. Recommendation: apply D, following the law, and mark it as a test gap. *UNVERIFIED which reading the Belastingdienst applies.*
2. HT-PDF stap 4 says the aftoppingsgrens step applies only when everyone is older than 20 and should be skipped if there are "personen onder de 21". Wht art. 13 gives the 932,93 cap to an under-21 household with a child or a handicap. The generic formula above gives B and C > 0 in that case. *UNVERIFIED which reading applies.*

### Derived break-even income (huurtoeslag = 0; rent >= 932,93; not official)

| Household | max A+B+C per month | zero at rekeninkomen of about |
|---|---|---|
| 1 person, 21+ | 523,28 | 46.682 |
| 2 persons, 21+ | 525,09 | 60.141 |
| 3+ persons | 537,87 | 60.838 |

(DERIVED. With the €24/jaar rule, the effective limit is slightly lower.)

### Eligibility conditions

| Condition | Rule | Source | Confidence |
|---|---|---|---|
| Age | The huurder must be meerderjarig (18+). Under 18 only by exception (e.g. both parents deceased, or has a child). | Wht art. 8; BD page ".../huurtoeslag/ik-ben-jonger-dan-18-jaar" (legacy URL under bldcontentnl) | VERIFIED |
| Youth rent cap | under 21: huurgrens 498,20 (not 23 as in 2025) | HT-PDF; BD-HT2026 | VERIFIED |
| Dwelling | A *zelfstandige woonruimte* is required. That means its own lockable front door, its own kitchen (aanrecht, water supply/drain, connection point for a cooker), its own toilet with flush, and its own living/sleeping room. Since 1 March 2024 it must also have its own shower or bath. A shared front door, hall or stairwell is fine (onvrije etage). | https://www.belastingdienst.nl/wps/wcm/connect/nl/huurtoeslag/content/voor-welke-woningen-huurtoeslag ; BD-HT; Wht art. 11 | VERIFIED |
| Exceptions (onzelfstandig allowed) | Onzelfstandige units designated by Dienst Toeslagen for begeleid wonen or groepswonen ouderen (owned by a non-profit). **Student rooms only if designated for huurtoeslag before 1 July 1997.** Woonwagen on a recognised standplaats: yes. Woonboot: no. Recreatiewoning: usually no. | Wht art. 11; https://www.belastingdienst.nl/wps/wcm/connect/nl/huurtoeslag/content/student-op-kamers-huurtoeslag | VERIFIED |
| Registration | huurder, partner and medebewoners must be registered in the BRP at that address, and no other persons (except onderhuurders) | Wht art. 9 | VERIFIED |
| Residence | rechtmatig verblijf, including partner and medebewoners aged 18+ | Awir art. 9 | VERIFIED |
| Income limit | none as a separate parameter in 2026 (phase-out through D) | BD maximaal-inkomen-huurtoeslag page; HT-PDF | VERIFIED |

### Test cases (official worked examples, HT-PDF)

| # | Inputs | Expected (A / B / C / D) | Huurtoeslag per maand |
|---|---|---|---|
| HT-1 | single, age 20, kale huur 600, income 22.000 | rekenhuur 498,20; A 295,68; B 0; C 0; D 0 | 295,68, paid as **295** |
| HT-2 | partners 30 and 27 + child of 2 (3 persons), kale huur 1.200, incomes 26.000 + 8.000 = 34.000 | rekenhuur 932,93; A 297,49; B 172,86; C 67,51; D 45,83 | 492,03, paid as **492** |
| HT-3 | single, age 69, kale huur 710, income 29.000 | rekenhuur 710; A 295,68; B 137,67; C 0; D 125,44 | 307,91, paid as **307** |

Note: in HT-2, C = 40% x 168,79 = 67,516. The PDF truncates this to 67,51, so the rounding of intermediate values is unspecified. The total floors to 492 either way.

---

## 3. Kindgebonden budget 2026

### Parameters

| Name | Value | Unit | Valid from | Source | Confidence |
|---|---|---|---|---|---|
| bedrag per kind (each child, from the 1st) | 2.580 | jaar | 2026-01-01 | KGB-PDF stap 1; WKB art. 2 lid 2 | VERIFIED |
| max, 1 child, ouder with toeslagpartner | 2.580 | jaar | 2026-01-01 | KGB-PDF table | VERIFIED |
| max, 2 children, with toeslagpartner | 5.160 | jaar | 2026-01-01 | KGB-PDF table | VERIFIED |
| increase per child from the 3rd child | 2.580 | jaar | 2026-01-01 | KGB-PDF table | VERIFIED |
| alleenstaande-ouderkop (ouder without partner) | 3.416 | jaar | 2026-01-01 | WKB art. 2 lid 6; KGB-PDF (5.996 = 2.580 + 3.416) | VERIFIED |
| max, single parent, 1 child | 5.996 | jaar | 2026-01-01 | KGB-PDF table | VERIFIED |
| max, single parent, 2 children | 8.576 | jaar | 2026-01-01 | KGB-PDF table | VERIFIED |
| extra per child aged 12 to 15 | 724 | jaar | 2026-01-01 | KGB-PDF stap 2; WKB art. 2 lid 4 | VERIFIED |
| extra per child aged 16 to 17 | 964 | jaar | 2026-01-01 | KGB-PDF stap 2; WKB art. 2 lid 5 | VERIFIED |
| drempelinkomen (single parent: full amount up to and including) | 29.736 | jaar | 2026-01-01 | KGB-PDF stap 4; WKB art. 1 lid 1 d | VERIFIED |
| partner threshold = drempelinkomen + 9.405 | 39.141 | jaar | 2026-01-01 | KGB-PDF stap 4; WKB art. 2 lid 8 | VERIFIED |
| afbouwpercentage | 7,60% | - | 2026-01-01 | KGB-PDF; WKB art. 2 lid 7-8, art. 3 lid 5 | VERIFIED |
| vermogensgrens, single | 146.011 | on 1 Jan 2026 | 2026-01-01 | KGB-PDF; WKB art. 1 lid 4; BD kan-ik-kindgebonden-budget-krijgen | VERIFIED |
| vermogensgrens, with partner | 184.633 | on 1 Jan 2026 | 2026-01-01 | idem | VERIFIED |

Future values already in the law: afbouwpercentage 8,05% from 2027-01-01 and 8,50% from 2028-01-01 (WKB art. 3 lid 5). The per-child amount rises by €66 (2027) and €68 (2028) on top of indexation (art. 3 lid 7). WKB has a new version from 2026-07-01, but it changes only the wording of art. 3. **No amount changes mid-2026** (diff of the 2026-01-01 and 2026-07-01 texts).

2025 values for comparison (WKB 2025-01-01): 2.511 / 703 / 936 / 3.389 / 7,10% / +9.139 / vermogen 141.896 and 179.429.

### Formula (KGB-PDF stap 1-5, WKB art. 2)

```
max = 2.580 x n_children (children < 18 for whom the ouder receives kinderbijslag)
    + 724 x n_children_aged_12_15 + 964 x n_children_aged_16_17
    + 3.416 if ouder has no (toeslag)partner
single parent:  vermindering = 7,6% x max(0, toetsingsinkomen - 29.736)
with partner:   vermindering = 7,6% x max(0, gezamenlijk toetsingsinkomen - 39.141)
KGB (jaar) = max(0, max - vermindering);  per maand = floor(jaar / 12)
```

The law defines entitlement per calendar month (art. 2 lid 11). It starts in the month after birth and ends with the month in which the child turns 18. The 12+ and 16+ increases start in the month after the 12th or 16th birthday (art. 2 lid 1, 3, 5). For children outside the EU/EEA/Switzerland a woonlandfactor applies (KGB-PDF table). Not granted below €24/jaar (Awir 14 lid 5).

### Test cases (official worked examples, KGB-PDF)

| # | Inputs | Expected |
|---|---|---|
| KGB-1 | partners, 25.000 + 20.000 = 45.000; children 4 and 8 | max 5.160; vermindering 5.859 x 7,6% = 445,28; 4.714,72/jaar; 392,89/maand, paid as **392** |
| KGB-2 | partners, 16.000 + 29.000 = 45.000; children 16 and 13 | 5.160 + 1.688 - 445,28 = 6.402,72/jaar; 533,56/maand, paid as **533** (the PDF heading says "510 per maand", which is a typo in the PDF; its own table gives 533) |
| KGB-3 | single parent, 30.000; child 8 | 5.996 - 20,06 = 5.975,94/jaar; 497,99/maand, paid as **497** |
| KGB-4 | partners on Curacao, 36.000 + 10.000 = 46.000; 2 children < 12; woonlandfactor 90% | (5.160 - 521,28) x 90% = 4.174,84/jaar; **347/maand** (optional) |

---

## 4. Related reference values 2026

### 4a. Wettelijk minimumloon (bruto per hour). Since 2024 there are no official month/week/day amounts.

| Name | Value | Unit | Valid from | Source | Confidence |
|---|---|---|---|---|---|
| WML 21+ | 14,71 | per uur | 2026-01-01 | WML | VERIFIED |
| WML 21+ | 14,99 | per uur | 2026-07-01 | WML | VERIFIED |
| WML age 20 | 11,77 / 11,99 | per uur | 2026-01-01 / 2026-07-01 | WML | VERIFIED |
| WML age 19 | 8,83 / 8,99 | per uur | 2026-01-01 / 2026-07-01 | WML | VERIFIED |
| WML age 18 | 7,36 / 7,50 | per uur | 2026-01-01 / 2026-07-01 | WML (the page shows the July value with a stray "<" character) | VERIFIED |
| WML age 17 | 5,81 / 5,92 | per uur | 2026-01-01 / 2026-07-01 | WML | VERIFIED |
| WML age 16 | 5,07 / 5,17 | per uur | 2026-01-01 / 2026-07-01 | WML | VERIFIED |
| WML age 15 | 4,41 / 4,50 | per uur | 2026-01-01 / 2026-07-01 | WML | VERIFIED |
| Monthly WML 21+ | none (the page states there are no fixed month/week/day amounts since 2024) | - | - | WML | VERIFIED (absence) |
| referentiemaandloon (WML-related monthly amount, excl. vakantiegeld) | 2.294,40 | maand | 2026-01-01 | NB-jan p.1 | VERIFIED |

Consistency: 2.294,40 x 12 x 108% = 29.735,42, which is the drempelinkomen 29.736 (ZT/KGB).

### 4b. Bijstandsnormen (Participatiewet). These are net monthly norms, **including** the 5% vakantietoeslag (PW art. 19 lid 3), without kostendelende medebewoners.

| Name | 1 Jan 2026 | 1 Jul 2026 | Unit | Source | Confidence |
|---|---|---|---|---|---|
| Single 21 to AOW age (art. 21 a) | 1.401,50 | 1.419,46 | maand | PW-jan / PW-jul art. 21; NB-jan | VERIFIED |
| Single parent 21 to AOW age (same norm as single, art. 21 a) | 1.401,50 | 1.419,46 | maand | idem | VERIFIED |
| Married/couple, both 21 to AOW age (art. 21 b) | 2.002,13 | 2.027,79 | maand | idem | VERIFIED |
| Single 18-20, no children (art. 20 lid 1 a) | 345,99 | 350,42 | maand | PW art. 20; NB-jan | VERIFIED |
| Couple both 18-20, no children (art. 20 lid 1 b) | 691,98 | 700,84 | maand | idem | VERIFIED |
| Couple one 18-20 and one 21+, no children (art. 20 lid 1 c) | 1.347,06 | 1.364,32 | maand | idem | VERIFIED |
| Single parent 18-20 (art. 20 lid 2 a) | 345,99 | 350,42 | maand | idem | VERIFIED |
| Couple both 18-20 with children (art. 20 lid 2 b) | 1.092,41 | 1.106,40 | maand | idem | VERIFIED |
| Couple one 18-20 and one 21+ with children (art. 20 lid 2 c) | 1.747,49 | 1.769,88 | maand | idem | VERIFIED |
| Verhoging jongerennorm 18-20 when parents cannot contribute (art. 20 lid 3; capped at the 21+ norm, lid 4) | 746,45 | 762,24 | maand | idem. New in 2026 ("Participatiewet in balans"); NB-jan shows no 1 Jul 2025 value. | VERIFIED |
| Pensioengerechtigde single (art. 22 a), for reference | 1.564,69 | 1.587,34 | maand | idem | VERIFIED |
| Pensioengerechtigde couple (art. 22 b/c), for reference | 2.144,16 | 2.176,10 | maand | idem | VERIFIED |
| Vakantietoeslag share included in the norms | 5% | 5% | - | PW art. 19 lid 3; NB-jan | VERIFIED |

### 4c. Bijstand vermogensgrens (PW art. 34 lid 3)

| Name | Value | Valid from | Source | Confidence |
|---|---|---|---|---|
| single | 8.000 | 2026-01-01 (unchanged on 2026-07-01) | PW-jan / PW-jul art. 34 lid 3 a; NB-jan | VERIFIED |
| single parent | 16.000 | idem | art. 34 lid 3 b | VERIFIED |
| married/couple together | 16.000 | idem | art. 34 lid 3 c | VERIFIED |
| vermogen in the owner-occupied home left out of account up to | 67.500 | idem | art. 34 lid 2 d | VERIFIED |

(2025 H2 values for comparison: 7.770 / 15.540 / 15.540 / 65.500, from NB-jan.)

Student note: there is no algemene bijstand for someone under 27 who can follow publicly funded education and has a claim to studiefinanciering, or who could claim it but does not follow the education (PW art. 13 lid 2 c). VERIFIED.

---

## 5. Student-specific rules

| Question | Answer | Source | Confidence |
|---|---|---|---|
| Does studiefinanciering count as toetsingsinkomen? | **No.** The toetsingsinkomen is the verzamelinkomen (Awir art. 8). Grant ("gift") parts of studiefinanciering are tax-exempt (Wet IB 2001 art. 3.104 sub d), and the student loan is not income. Student-job wages and stage pay do count. | https://wetten.overheid.nl/BWBR0011353/2026-01-01 (art. 3.104 d); Awir art. 8 | VERIFIED (by law; no Belastingdienst page found that says it in one sentence) |
| Dutch student with studiefinanciering: zorgtoeslag? | **Yes**, under the normal conditions: 18+, a Dutch zorgverzekering, income and vermogen within the limits. Also yes if the parents pay the premium or the student stays on the parents' policy. | BD-ZT; https://www.belastingdienst.nl/wps/wcm/connect/nl/toeslagen-jongeren/content/ik-ben-18-geworden-heb-ik-recht-op-toeslagen | VERIFIED |
| Dutch student: huurtoeslag? | **Yes**, under the normal conditions, but only for a *zelfstandige woonruimte* (own lockable door, kitchen, toilet, and since 2024-03-01 own shower/bath). A student room (onzelfstandig) gets **no** huurtoeslag unless it was designated before 1 July 1997. Students renting a zelfstandige woning together: one applicant, the others are medebewoners, and all their incomes and vermogen count. Under 21: the rent cap is 498,20. | BD student-op-kamers-huurtoeslag; voor-welke-woningen-huurtoeslag | VERIFIED |
| EU/international student: zorgtoeslag? | **Only if they must take out a Dutch zorgverzekering.** Studying only (no job, or stage pay below WML): they stay insured in their home country (EHIC), have no Dutch Zvw obligation and get **no zorgtoeslag**. A paid side job means the Dutch zorgverzekering is mandatory, so **zorgtoeslag is possible**. A stage paid at least the Dutch WML: mandatory insurance and possible zorgtoeslag. A visitor/temporary insurance or a voluntary insurance for foreign students does **not** qualify. Rechtmatig verblijf and BRP registration (BSN) are also needed. | https://www.belastingdienst.nl/wps/wcm/connect/nl/zorgtoeslag/content/Zorgtoeslag-buitenlandse-student ; voor-welke-zorgverzekering-zorgtoeslag ; zorgtoeslag-andere-nationaliteit | VERIFIED |
| EU/international student: huurtoeslag? | Same housing and income rules as Dutch students, plus rechtmatig verblijf (EU citizens qualify through their EU residence status) and BRP registration at the address. | Awir art. 9; Wht art. 9; BD-HT | VERIFIED (general rules; no student-specific page) |

---

## 6. Open points / UNVERIFIED

1. Huurtoeslag: whether the income correction D applies to all-under-21 households (the PDF says "only part A"; the law says D applies to everyone).
2. Huurtoeslag: B and C for an under-21 household with a child or handicap (huurgrens 932,93). The PDF's stap 4 wording conflicts with Wht art. 13.
3. Huurtoeslag normhuur 2026 (204,34) is derived. The consolidated Wht text shows 252,49, which does not reproduce the official basishuur. Use the basishuur values directly.
4. Rounding of intermediate cents (e.g. HT deel C) is not specified. The final floor is not affected in the examples.
5. ZT-PDF example 2 prints a monthly amount of 103,02 where 103,63 is correct. KGB-PDF example 2 prints "510 per maand" where 533 is correct. Both are typos in the official PDFs. The test cases use the recomputed values.
6. The Staatscourant regulations (officielebekendmakingen.nl) could not be fetched (HTTP 403). All values are confirmed through the Belastingdienst PDFs and the consolidated law texts instead.

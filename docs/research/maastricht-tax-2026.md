# Maastricht local schemes, Dutch income tax 2026, UM/Zuyd support

Researched 2026-10-29 for the OpenFisca eligibility tool (students in Maastricht + general population).
Confidence labels:
- **VERIFIED**: the value is stated literally in an official source (gemeente/SZMH/BsGW/Belastingdienst/wetten.overheid.nl/Gemeenteblad/university).
- **DERIVED**: the value is computed from VERIFIED values. It is not stated as such in a source.
- **UNVERIFIED**: only secondary sources were found, the official page was not reachable, or nothing was found.

Amounts are in EUR. "SZMH" = Sociale Zaken Maastricht Heuvelland, which runs the income schemes for Maastricht, Meerssen, Vaals, Valkenburg aan de Geul and Gulpen-Wittem. The "Source" column uses short link keys; the full URLs are listed at the bottom of the file.

Context: Maastricht adopted a new poverty policy framework, "We zien je", on 2025-09-23. Its first changes took effect in 2026: IIT with simplified e-application (from 2026-04-01), free CVV transport for minima with a disability (from 2026-04-01), higher school-cost allowance (from 2026-01-01), and a kwijtschelding asset norm raised to the legal maximum (2026) [CV-2026] [RV-81].

---

## 0. Reference: bijstandsnormen 2026 (base for all "% of bijstandsnorm" limits)

Net amounts, 21 to AOW age, excluding vakantietoeslag, without the kostendelersnorm.

| Parameter | Value | Unit | Valid from | Source | Confidence |
|---|---|---|---|---|---|
| Norm, gehuwden/samenwonenden | 1,902.02 | EUR/month | 2026-01-01 | [NB-jan] | VERIFIED |
| Norm, alleenstaande (ouder) | 1,331.42 | EUR/month | 2026-01-01 | [NB-jan] | VERIFIED |
| Norm, gehuwden/samenwonenden | 1,926.40 | EUR/month | 2026-07-01 | [NB-jul] | VERIFIED |
| Norm, alleenstaande (ouder) | 1,348.49 | EUR/month | 2026-07-01 | [NB-jul] | VERIFIED |
| Vakantie-uitkering, gehuwden / alleenstaande | 101.39 / 70.97 | EUR/month | 2026-07-01 | [NB-jul] | VERIFIED |
| 110% norm, alleenstaande / gehuwden | 1,483.34 / 2,119.04 | EUR/month | 2026-07-01 | computed from [NB-jul] | DERIVED |
| 120% norm, alleenstaande / gehuwden | 1,618.19 / 2,311.68 | EUR/month | 2026-07-01 | computed from [NB-jul] | DERIVED |
| Vermogensgrens bijstand, alleenstaande | 8,000 | EUR | 2026-01-01 | [NB-jul] [SZ-BS] | VERIFIED |
| Vermogensgrens bijstand, gehuwden / alleenstaande ouder | 16,000 | EUR | 2026-01-01 | [NB-jul] [SZ-BS] | VERIFIED |
| Extra exemption, home equity (bijstand) | 67,500 | EUR | 2026-07-01 | [NB-jul] | VERIFIED |
| Minimum wage, 21+ | 14.71 (Jan) / 14.99 (Jul) | EUR/hour gross | 2026-01-01 / 2026-07-01 | [NB-jan] [NB-jul] | VERIFIED |

Note: the SZMH "bijstandsnormen" page [SZ-NORM] labels its table "2025", but its figures (1,348.49 / 1,926.40) equal the national norms per 2026-07-01. Use the national norms.

---

## 1. Gemeente Maastricht minima schemes 2026

### 1.1 Individuele inkomenstoeslag (IIT): long-term low-income supplement

| Parameter | Value or rule | Unit | Valid from | Source | Confidence |
|---|---|---|---|---|---|
| Amount, alleenstaande | 561 | EUR, once per 12 months | 2026 | [GM-IIT] | VERIFIED |
| Amount, alleenstaande ouder | 701 | EUR, once per 12 months | 2026 | [GM-IIT] | VERIFIED |
| Amount, gehuwd/samenwonend | 781 | EUR, once per 12 months | 2026 | [GM-IIT] | VERIFIED |
| Age | 21 to AOW age (not yet AOW) | years | 2026-04-01 | [GMB-IIT] Art. 1 | VERIFIED |
| Reference period | 36 consecutive months before the peildatum (application date) | months | 2026-04-01 | [GMB-IIT] Art. 2.1 | VERIFIED |
| Income limit | ≤ 100% of the applicable bijstandsnorm, excl. vakantietoeslag, excl. kostendelersnorm, during the whole reference period | % norm | 2026-04-01 | [GMB-IIT] Art. 2.1, [GM-IIT] | VERIFIED |
| Marginal income tolerated | ≤ 2% of the bijstandsnorm (incl. vakantietoeslag) per 1 January of each year | % norm | 2026-04-01 | [GMB-IIT] Art. 2.2 | VERIFIED |
| Wajong on peildatum | presumed to meet the long-term low-income test | rule | 2026-04-01 | [GMB-IIT] Art. 2.3 | VERIFIED |
| Assets | no assets counted under Pw art. 34; page states limit 8,000 (single) / 16,000 (single parent, couple) | EUR | 2026 | [GMB-IIT] Art. 1, [GM-IIT] | VERIFIED |
| No prospect of income improvement | required; presumed for: no active work obligations; completed an offered trajectory in the past 12 months; worked to capacity without more hours available; self-employed in the past 12 months; Wajong | rule | 2026-04-01 | [GMB-IIT] Art. 3 | VERIFIED |
| Residence | lives in Maastricht on application date; Dutch nationality or equivalent rights | rule | 2026 | [GM-IIT] | VERIFIED |
| **Students** | excluded if following WSF 2000 or WTOS education on the peildatum **or at any time in the 36-month reference period** | rule | 2026-04-01 | [GMB-IIT] Art. 5.2 | VERIFIED |
| Other exclusions | Pw art. 13(1) a-e, h (detention, >4 weeks abroad, etc.); a non-entitled partner → entitled partner can get the single amount | rule | 2026-04-01 | [GMB-IIT] Art. 5 | VERIFIED |
| Frequency | once per 12 months per household; reapply every year | rule | 2026-04-01 | [GMB-IIT] Art. 4.4, [SZ-LI] | VERIFIED |
| Apply (DigiD) | https://mijnaanvraag.maastricht.nl/IIT.html; paper form via socialezaken-mh.nl | URL | 2026 | [GM-IIT] | VERIFIED |

### 1.2 Studietoeslag: students with a disability or chronic illness (Pw art. 36b; national entitlement, amounts set by SZMH)

| Parameter | Value or rule | Unit | Valid from | Source | Confidence |
|---|---|---|---|---|---|
| Amount, age 15 / 16 / 17 | 117.03 / 134.58 / 154.08 | EUR/month net | 2026 | [SZ-ST] | VERIFIED |
| Amount, age 18 / 19 / 20 | 195.04 / 234.05 / 312.06 | EUR/month net | 2026 | [SZ-ST] | VERIFIED |
| Amount, age 21+ | 390.07 | EUR/month net | 2026 | [SZ-ST] | VERIFIED |
| Age | 15 or older | years | 2026 | [SZ-ST] | VERIFIED |
| Condition: disability | structurally unable to earn income alongside study, as a direct result of illness or disability; municipality asks for medical advice | rule | in force | [PW] art. 36b(1)-(2), [SZ-ST] | VERIFIED |
| Condition: study finance | receives WSF 2000 studiefinanciering (not levenlanglerenkrediet) or a WTOS ch. 4 allowance; entitlement ends when studiefinanciering ends | rule | in force | [PW] art. 36b(3), [SZ-ST] | VERIFIED |
| Condition: no Wajong | no Wajong entitlement | rule | in force | [PW] art. 36b(3)(b) | VERIFIED |
| Internship income disregarded | first 221.85/month of stage allowance; the excess is deducted | EUR/month | 2026 | [SZ-ST] | VERIFIED |
| Income/assets test | none mentioned on the page | rule | 2026 | [SZ-ST] | UNVERIFIED |
| Residence | registered in Maastricht, Meerssen, Vaals, Valkenburg a/d Geul or Gulpen-Wittem | rule | 2026 | [SZ-ST] | VERIFIED |
| Retroactivity | not retroactive; paid monthly after approval | rule | 2026 | [SZ-LI] | VERIFIED |
| Apply (DigiD) | https://www.e-inwoner.nl/prod/fr/Maastricht/AanvraagForm_Studietoeslag_0935/new.digid | URL | 2026 | [SZ-ST] | VERIFIED |

### 1.3 Bijzondere bijstand (special assistance)

| Parameter | Value or rule | Unit | Valid from | Source | Confidence |
|---|---|---|---|---|---|
| Conditions | necessary costs from special circumstances; cannot pay yourself; no other provision covers them; costs made in NL; normally not yet incurred, invoice never older than 1 year; lives in Maastricht | rule | 2026 | [GM-BB] [SZ-BB] | VERIFIED |
| Income | low income and few assets; income above the bijstandsnorm can still qualify (lower amount via draagkracht) | rule | 2026 | [GM-BB] | VERIFIED |
| Draagkracht threshold | no draagkracht up to 110% of norm (Beleidsregels bijzondere bijstand Maastricht 2018); current figure not found | % norm | 2018 | search snippet of 2018 rules | UNVERIFIED |
| Asset limit | not stated on page | EUR | n/a | [GM-BB] | UNVERIFIED |
| Gift vs loan | loan if: you could pay yourself, could have prevented it, it is a deposit (waarborgsom), or you did not save for durable goods | rule | 2026 | [GM-BB] | VERIFIED |
| WMO co-payments (CAK eigen bijdrage) | can be covered | rule | 2026 | [SZ-BB] | VERIFIED |
| **Students** | no student rule on the pages. Studiefinanciering is a primary provision (voorliggende voorziening) for living and study costs, so expect bijzondere bijstand only for costs outside the WSF budget | rule | n/a | [GM-BB] | UNVERIFIED |
| Apply, with SZMH benefit | https://www.e-inwoner.nl/prod/fr/Maastricht/AanvraagForm_Bijzondere_Bijstand_0935/new.digid | URL | 2026 | [GM-BB] | VERIFIED |
| Apply, without SZMH benefit | https://www.e-inwoner.nl/prod/fr/Maastricht/AanvraagForm_Bijzondere_Bijstand_OnbCl_0935/new.digid | URL | 2026 | [GM-BB] | VERIFIED |
| Decision term | 8 weeks (extendable once); objection within 6 weeks | rule | 2026 | [GM-BB] | VERIFIED |

### 1.4 Health insurance for minima

| Parameter | Value or rule | Unit | Valid from | Source | Confidence |
|---|---|---|---|---|---|
| Collective insurer | VGZ: "VGZ Zuid-Limburgpakket" (eigen risico fully insured) and "VGZ Zuid-Limburgpakket Compact" (eigen risico not insured; can be paid in instalments) | name | 2026 | [SZ-VGZ] [VGZ] | VERIFIED |
| Income limit | ≤ 150% of sociaal minimum (net) | % | 2026 | [SZ-VGZ] | VERIFIED |
| Limit, single 18-AOW / single AOW | 2,022.73 / 2,261.96 | EUR/month net | 2026 (equals 150% × July-2026 norm) | [SZ-VGZ] | VERIFIED |
| Limit, couple 18-AOW / couple with AOW | 2,889.60 / 3,100.94 | EUR/month net | 2026 | [SZ-VGZ] | VERIFIED |
| Premium Zuid-Limburgpakket / Compact | 232.15 / 178.85 | EUR/month | 2026 (inferred) | [VGZ] | UNVERIFIED (year not stated on page) |
| Students | not mentioned | rule | n/a | [SZ-VGZ] [VGZ] | UNVERIFIED |
| Sign up | www.vgz.nl/zuidlimburg; 0800 401 0105; switching possible each year until 31 Dec | URL | 2026 | [SZ-VGZ] | VERIFIED |
| Tegemoetkoming aanvullende zorgverzekering: amount | 80 to 100 depending on municipality (Maastricht figure not stated separately) | EUR/year | 2026 | [SZ-AZV] | VERIFIED (range) |
| Tegemoetkoming aanvullende zv: income limit Maastricht | ≤ 110% of bijstandsnorm | % norm | 2026 | [SZ-AZV] | VERIFIED |
| Tegemoetkoming aanvullende zv: conditions | has a supplementary insurance; automatic for benefit recipients with VGZ Zuid-Limburgpakket | rule | 2026 | [SZ-AZV] | VERIFIED |
| **Tegemoetkoming aanvullende zv: students** | excluded if following education with studiefinanciering | rule | 2026 | [SZ-AZV] | VERIFIED |
| Apply (Maastricht, no benefit) | https://www.e-inwoner.nl/prod/fr/Maastricht/AanvraagForm_Premie_AanvulVerz_OnbCl_0935/new.digid | URL | 2026 | [SZ-AZV] | VERIFIED |

### 1.5 Kwijtschelding gemeentelijke belastingen (municipal tax remission, run by BsGW)

| Parameter | Value or rule | Unit | Valid from | Source | Confidence |
|---|---|---|---|---|---|
| Executor | BsGW (Belastingsamenwerking Gemeenten en Waterschappen); also handles waterschapsbelasting (Waterschap Limburg) remission | org | 2026 | [GM-KW] [SZ-LI] | VERIFIED |
| Remittable taxes, Maastricht | rioolheffing gebruikersdeel, afvalstoffenheffing, hondenbelasting (1st dog only) | rule | 2026 | [RV-81] | VERIFIED |
| Not remittable | OZB, reinigingsrechten, precario, toeristen-/forensenbelasting, parkeren, leges, etc. | rule | 2025 (2026 text not found) | [KW-2025] Art. 1 | VERIFIED (2025) |
| Afvalstoffenheffing detail | per-volume tariffs remitted; bag-based homes: 20 bags of 50 L (1 person) / 30 bags (multi-person); chute/container homes: no remission of that part | rule | 2025 | [KW-2025] Art. 2 | VERIFIED (2025) / UNVERIFIED (2026) |
| Kosten van bestaan norm | 100% of the bijstandsnorm (AOW: 100% of net AOW) | % norm | 2025; BsGW says all affiliated municipalities use 100% | [KW-2025] Art. 3, [BsGW-V] | VERIFIED |
| Bank/savings limit (BsGW page) | single 3,700; single parent 4,500; couple 4,900; +3,350 if born before 1935 | EUR | current page (year not stated) | [BsGW-V] | VERIFIED (year UNVERIFIED) |
| Asset norm raised | Maastricht raised the vermogensnorm to the legal maximum: +1,500 to +2,000 depending on household | EUR | 2026 | [RV-81] | VERIFIED |
| Car | car value > 3,350 counts as an asset unless needed for work or illness/disability | EUR | current | [BsGW-V] | VERIFIED |
| Timing | only for assessments not yet paid, or paid no more than 3 months ago | rule | current | [BsGW-V] | VERIFIED |
| Legal basis | Leidraad invordering art. 26; Uitvoeringsregeling Invorderingswet 1990 | rule | in force | [BsGW-V] | VERIFIED |
| **Students** | may apply. Under the national Leidraad, income is set at a fixed normbudget = basisbeurs + max aanvullende beurs + **max basislening** (minus 80 for books in HE), whether or not the loan is taken | rule | 2024-01-01 (Leidraad 26.2.12) | [LI] 26.2.12 | VERIFIED (Rijksleidraad); UNVERIFIED that BsGW applies it identically |
| Practical effect for students | because the maximum loan counts as income, many students with full studiefinanciering will show betalingscapaciteit and be refused | rule | n/a | computed from [LI] | DERIVED / UNVERIFIED |
| Automatic remission | BsGW has "automatische kwijtschelding" for some households (FAQ title only) | rule | current | [BsGW-A] | UNVERIFIED (details) |
| Apply | Mijn BsGW (DigiD): https://mijn.bsgw.nl/view/LOGIN; phone 088-842 0420 | URL | current | [BsGW-A] | VERIFIED |

### 1.6 Participation, children and transport

| Scheme | Value or rule | Unit | Valid from | Source | Confidence |
|---|---|---|---|---|---|
| Volwassenenfonds Sport & Cultuur Limburg: eligibility | lives in Maastricht; 18+; household income ≤ 110% of bijstandsnorm; choose sport OR culture; via a recognised intermediary | rule | 2026 | [GM-VWF] | VERIFIED |
| Volwassenenfonds: amount | sport max 350 or culture max 550, plus a voucher up to 150 for gear (physical shops, valid 4 months) | EUR/year | 2026 | [GM-VWF] | VERIFIED |
| Volwassenenfonds: students | not mentioned | rule | n/a | [GM-VWF] | UNVERIFIED |
| Tegemoetkoming culturele en sociale activiteiten | replaced in Maastricht by the Volwassenenfonds; students with WSF excluded (other municipalities) | rule | 2026 | [SZ-CSA] | VERIFIED |
| Jeugdfonds Sport & Cultuur Limburg: eligibility | child 0-18 living in Maastricht (kindregelingen page says 4-18); income ≤ 110% of norm; via Leergeld, an intermediary or allekinderendoenmee.nl | rule | 2026 | [GM-JF] [GM-KR] | VERIFIED (age range inconsistent) |
| Jeugdfonds: amount | sport max 350 / culture max 550 per child, each incl. up to 150 for clothing/gear | EUR (period not stated, presumably per year) | 2026 | [GM-JF] | VERIFIED (period UNVERIFIED) |
| Declaratieregeling schoolgaande kinderen (school costs) | income ≤ 110% of norm (net, excl. vakantiegeld); child < 18; registered ≥ 6 months in Maastricht | rule | 2026-01-01 | [DR-2026] | VERIFIED |
| Declaratieregeling: amount | primary school 75; secondary school 300 (was 50 / 220) | EUR/child/year | 2026-01-01 | [DR-2026] [CV-2026] | VERIFIED |
| Declaratieregeling: students | applicant must not follow WSF education | rule | 2026 | [SZ-SK] | VERIFIED |
| Declaratieregeling: apply (no benefit) | https://www.e-inwoner.nl/prod/fr/Maastricht/AanvraagForm_Decl2_OnbCl_0935/new.digid | URL | 2026 | [SZ-SK] | VERIFIED |
| Stichting Leergeld Maastricht en Heuvelland | children 4-18 from low-income families: school, sport, culture, bicycle, laptop; home visit; reapply yearly | rule | 2026 | [SZ-LI] [LG] | VERIFIED |
| Leergeld: income limit | not stated | % norm | n/a | [LG] | UNVERIFIED |
| Other child help | Stichting Kindhulp Maastricht, Jarige Job, Nationaal Fonds Kinderhulp, Speelgoedbank Trajekt (referral), Quiet Maastricht, Stichting Babyspullen | names | 2026 | [GM-KR] | VERIFIED |
| "Kindpakket" | no scheme of that name in Maastricht; the "Kindregelingen" page bundles the items above | rule | 2026 | [GM-KR] | VERIFIED |
| Gratis CVV (Omnibuzz) for minima with a disability | Wmo CVV indication + income ≤ 110% of norm (no kostendelersnorm); mostly granted automatically; max 590 zones/year | rule | 2026-04-01 | [CVV] | VERIFIED |
| Dal Vrij Limburg (province + Arriva) | free off-peak travel on Arriva Limburg buses/trains for income ≤ 100% of social minimum; self-application portal (run by Qii) | rule | 2025 | NOS / provincial documents | UNVERIFIED (official URL and student rule not found) |

### 1.7 Algemene bijstand (Participatiewet)

| Parameter | Value or rule | Unit | Valid from | Source | Confidence |
|---|---|---|---|---|---|
| Apply | via Werk.nl with DigiD: https://www.werk.nl/werkzoekenden/ (info: https://www.gemeentemaastricht.nl/werk-en-inkomen/bijstandsuitkering) | URL | 2026 | [GM-BS] [SZ-BS] | VERIFIED |
| Age / residence | 18+; lives in one of the 5 SZMH municipalities | rule | 2026 | [SZ-BS] | VERIFIED |
| **Student exclusion** | no algemene bijstand for a person **under 27** who can follow state-funded education and (1) has a WSF 2000 entitlement for it, or (2) has no WSF entitlement and does not follow it | rule | 2026-07-01 text | [PW] art. 13(2)(c) | VERIFIED |
| Kostendelersnorm | students living in the same home do not count as kostendelers (among other exceptions) | rule | 2026 | [SZ-BS] | VERIFIED |

### 1.8 Free money and debt help (referrals)

| Service | What / contact | Source | Confidence |
|---|---|---|---|
| Financiële coaches SZMH | free, confidential help with budget, toeslagen, letters, arrears; financialcoach@maastricht.nl | [SZ-GH] | VERIFIED |
| Team Vroegsignalering (gemeente) | early debt help; (043) 350 41 93; https://www.gemeentemaastricht.nl/contactformulier-team-vroegsignalering | [GM-TV] | VERIFIED |
| Kredietbank Limburg (KBL) | runs schuldhulpverlening for Maastricht: https://www.kredietbanklimburg.nl/Diensten/schuldhulpverlening | [GM-TV] | VERIFIED |
| SchuldHulpMaatje Maastricht | volunteers: https://schuldhulpmaatje.nl/maastricht/ | [GM-TV] | VERIFIED |
| Humanitas Maastricht-Heuvelland | thuisadministratie; "Get a grip, Jongeren & Geld Zuid-Limburg" for young people (studiefinanciering, zorgverzekering) | [GM-TV] | VERIFIED |
| Trajekt / Quiet Maastricht / Nibud | social support; free Quiet membership; zelfjeschuldenregelen.nl | [GM-TV] | VERIFIED |
| Infopunt Advies & Hulp, Centre Céramique | Juridisch Loket, SVB, KBL and DUO at one desk | [SZ-HG] | VERIFIED |
| BerekenJeRecht (SZMH tool) | eligibility check for municipal schemes: https://www.socialezaken-mh.nl/bereken-je-recht | [SZ-BB] | VERIFIED |
| "Geldloket" / "Formulierenbrigade" Maastricht | no Maastricht service under these names found | n/a | UNVERIFIED (not found) |

### 1.9 Energy and one-off schemes 2026

| Scheme | Value or rule | Unit | Valid from | Source | Confidence |
|---|---|---|---|---|---|
| Municipal energietoeslag 2026 | none found (the last Maastricht energietoeslagen were 2022/2023) | n/a | n/a | [SZ-EN] [GM-EK] | UNVERIFIED (absence) |
| Witgoedregeling Maastricht 2025-2026 (Fase 2) | voucher up to 600 for an energy-efficient fridge/freezer/washing machine; invitation only; target: 3 yrs bijstand + IIT, bijzondere bijstand in the past 3 yrs, or the municipal minima group; until 2026-12-31 or budget (600k) runs out | EUR | 2025-09 | [WIT] | VERIFIED |
| Je Energiecoach (CNME) | free home energy advice for low incomes; 043-208 6136 | rule | 2026 | [SZ-EN] | VERIFIED |
| National Tijdelijk Noodfonds Energie 2026 | income ≤ 200% of social minimum; threshold 8% (≤ 130% SM) / 10% of income; pays half of the excess; expected to open winter 2026/27 | rule | 2026/27 | energievergelijk.nl (secondary) | UNVERIFIED |

### 1.10 Student exclusion summary (for eligibility logic)

| Scheme | Students with WSF/WTOS | Source | Confidence |
|---|---|---|---|
| Algemene bijstand | excluded if < 27 and WSF-entitled | [PW] | VERIFIED |
| IIT | excluded (also if studied in the past 36 months) | [GMB-IIT] | VERIFIED |
| Studietoeslag | **requires** WSF/WTOS | [PW] [SZ-ST] | VERIFIED |
| Tegemoetkoming aanvullende zorgverzekering | excluded | [SZ-AZV] | VERIFIED |
| Declaratieregeling schoolkosten (as a parent) | excluded | [SZ-SK] | VERIFIED |
| Kwijtschelding | allowed; max loan counted as income | [LI] | VERIFIED (Rijksleidraad) |
| Bijzondere bijstand, Volwassenenfonds, VGZ pakket, Dal Vrij | not stated | various | UNVERIFIED |

---

## 2. Dutch income tax, box 1, below AOW age

Students filing in late 2026 mostly file for 2025 (and 2021-2024), so the 2025 values are included as well.

### 2.1 Rates and brackets

| Parameter | Value | Unit | Valid from | Source | Confidence |
|---|---|---|---|---|---|
| 2026 bracket 1 | ≤ 38,883 at 35.75% | EUR / % | 2026-01-01 | [BD-IB] [BD-VA] | VERIFIED |
| 2026 bracket 2 | 38,883 to 78,426 at 37.56% | EUR / % | 2026-01-01 | [BD-IB] [BD-VA] | VERIFIED |
| 2026 bracket 3 | > 78,426 at 49.50% | EUR / % | 2026-01-01 | [BD-IB] [BD-VA] | VERIFIED |
| 2026 split of bracket 1 | 8.10% tax + 27.65% premie volksverzekeringen (AOW 17.90, Anw 0.10, Wlz 9.65) | % | 2026-01-01 | rendement.nl / Lindenhaeghe (secondary) | UNVERIFIED |
| 2025 bracket 1 / 2 / 3 | ≤ 38,441 at 35.82%; 38,441 to 76,817 at 37.48%; > 76,817 at 49.50% | EUR / % | 2025-01-01 | [KVK25] | VERIFIED (KVK) |

### 2.2 Algemene heffingskorting (AHK), based on verzamelinkomen

| Parameter | Value | Unit | Valid from | Source | Confidence |
|---|---|---|---|---|---|
| 2026 maximum | 3,115 | EUR/year | 2026-01-01 | [BD-VA] | VERIFIED |
| 2026 phase-out start | 29,736 | EUR | 2026-01-01 | [BD-VA] | VERIFIED |
| 2026 phase-out rate | 6.398% of (income − 29,736); 0 from 78,426 | % | 2026-01-01 | [BD-VA] | VERIFIED |
| 2025 maximum / start / rate / zero at | 3,068 / 28,406 / 6.337% / 76,817 | EUR, % | 2025-01-01 | [BD-AHK25] | VERIFIED |

### 2.3 Arbeidskorting (AK), based on arbeidsinkomen

| Year | Arbeidsinkomen bracket | Formula | Source | Confidence |
|---|---|---|---|---|
| 2026 | 0 to 11,965 | 8.324% × AI | [BD-VA] | VERIFIED |
| 2026 | 11,965 to 25,845 | 996 + 31.009% × (AI − 11,965) | [BD-VA] | VERIFIED |
| 2026 | 25,845 to 45,592 | 5,300 + 1.950% × (AI − 25,845) | [BD-VA] | VERIFIED |
| 2026 | 45,592 to 132,920 | 5,685 − 6.510% × (AI − 45,592) | [BD-VA] | VERIFIED |
| 2026 | ≥ 132,920 | 0 | [BD-VA] | VERIFIED |
| 2025 | 0 to 12,169 | 8.053% × AI | [BD-AK25] | VERIFIED |
| 2025 | 12,169 to 26,288 | 980 + 30.030% × (AI − 12,169) | [BD-AK25] | VERIFIED |
| 2025 | 26,288 to 43,071 | 5,220 + 2.258% × (AI − 26,288) | [BD-AK25] | VERIFIED |
| 2025 | 43,071 to 129,078 | 5,599 − 6.510% × (AI − 43,071) | [BD-AK25] | VERIFIED |
| 2025 | ≥ 129,078 | 0 | [BD-AK25] | VERIFIED |

Other 2026 credits (from [BD-VA], VERIFIED): IACK 11.45% × (AI − 6,239), max 3,032; jonggehandicaptenkorting 923.

### 2.4 Refund estimate and filing rules

| Parameter | Value or rule | Unit | Valid from | Source | Confidence |
|---|---|---|---|---|---|
| Who gets money back | students and young people in paid employment, or who worked only part of the year, often had too much loonheffing withheld; filing a return gets it back | rule | current | [BD-JONG] | VERIFIED |
| Years back | up to 5 years after the end of the tax year (e.g. tax year 2021: until 2026-12-31) | years | current | [BD-JONG] [BD-VERM] | VERIFIED |
| How to file | Belastingdienst app or Mijn Belastingdienst (DigiD): https://www.belastingdienst.nl/wps/wcm/connect/nl/jongeren/content/direct-aangifte-doen | URL | current | [BD-JONG] | VERIFIED |
| Credits are non-refundable | combined AHK + AK cannot exceed tax + premium due; refund = withheld loonheffing − final tax (≥ 0) | rule | current | general rule, not re-checked | UNVERIFIED |
| Zero-tax income (wage only), 2026 | ≈ 11,358 (0.3575·Y = 3,115 + 0.08324·Y) | EUR/year | 2026 | from [BD-VA] | DERIVED |
| Zero-tax income (wage only), 2025 | ≈ 11,049 (0.3582·Y = 3,068 + 0.08053·Y) | EUR/year | 2025 | from [KVK25] [BD-AHK25] [BD-AK25] | DERIVED |
| Example | 2026 wage 8,000, no loonheffingskorting applied, withholding ≈ 35.75% = 2,860 → final tax 0 → refund ≈ 2,860 (real withholding tables differ somewhat) | EUR | 2026 | from [BD-VA] | DERIVED |
| Minimum refund paid out | small refunds (< ~16) not paid out | EUR | n/a | not found | UNVERIFIED |

---

## 3. Maastricht University and Zuyd support

| Scheme | Value or rule | Unit | Valid from | Source | Confidence |
|---|---|---|---|---|---|
| UM Student Support Fund (StOF), formerly Profileringsfonds | renamed 2025-09-01; current regulation adopted 2026-06-02 | name | 2026-09-01 | [UM-REG] | VERIFIED |
| StOF categories | force majeure (illness, disability/chronic illness, pregnancy, special family circumstances incl. caring); administrative activities (board/council); top-level sport | rule | 2026-09-01 | [UM-REG] Art. 3, [UM-StOF] | VERIFIED |
| StOF general conditions | full-time bachelor or initial master's for the whole academic year (no pre-master); bachelor: not > 4 academic years enrolled at UM; master: within nominal duration. No nationality condition in Art. 4 | rule | 2026-09-01 | [UM-REG] Art. 4 | VERIFIED |
| StOF amount | 345.50 per month of study delay; 1 month = 5 ECTS of delay; delay must be > 5 ECTS | EUR/month | 2026-09-01 | [UM-REG] Art. 5 | VERIFIED |
| StOF maximum | 12 months over the whole UM enrolment (incl. old Profileringsfonds months) | months | 2026-09-01 | [UM-REG] Art. 5.1 | VERIFIED |
| StOF priority rule | not paid insofar as the student can get DUO's 1-year extension of the prestatiebeurs for disability/chronic illness (WSF art. 5.2b) | rule | 2026-09-01 | [UM-REG] Part II Art. 5.3 | VERIFIED |
| StOF pregnancy | delay fixed at 4 months (more with complications) | months | 2026-09-01 | [UM-REG] Part II | VERIFIED |
| StOF top sport | max 5 months/year (NOC*NSF status); 3 months/year (Regional Status) | months | 2026-09-01 | [UM-REG] Part IV | VERIFIED |
| StOF board | e.g. University Council 4 months (5 in some cases); full-time board 12 (else 9) months | months | 2026-09-01 | [UM-REG] Part III | VERIFIED |
| StOF procedure | report the circumstance to the study adviser within 2 months; apply via digital form (through the study adviser) within 6 months after the academic year ends (before 1 March); decision within 8 weeks | rule | 2026-09-01 | [UM-REG] Part II Art. 1, 4, 5 | VERIFIED |
| UM non-EU/EEA scholarships | part of StOF Part V for institutional-fee students | rule | 2026-09-01 | [UM-REG] Art. 7 | VERIFIED |
| UM Emergency Fund | one-off payment for acute financial distress that threatens continuing studies, when other funds don't help; not for tuition; discuss with your study adviser | rule | current | [UM-FUNDS] | VERIFIED |
| UM Emergency Fund amount | COVID-era 2020: max 1,500, interest-free loan converted to a gift on graduation/re-enrolment | EUR | 2020 | UM news 2020 | UNVERIFIED (current) |
| UM private funds / SWOL | private funds (letter from a student dean; studentdeans@maastrichtuniversity.nl), University Fund Limburg/SWOL, beursopener via wilweg.nl | names | current | [UM-FUNDS] | VERIFIED |
| UM help pages | Money matters / funds; student deans; study advisers; "Cost of studying & financial assistance" (points to bijzondere bijstand, studietoeslag, kwijtschelding, Huurteam) | URL | current | [UM-FUNDS] [UM-COST] [UM-DEAN] | VERIFIED |
| Zuyd: Regeling Financiële Ondersteuning Studenten 2025-2026 | three parts: Studentenondersteuningsfonds (formerly Profileringsfonds), Stimuleringsfonds, Noodfonds; for study delay from special circumstances, governance activity, or acute financial hardship; contact the studentendecaan first | rule | 2025-26 | [ZUYD-ST] (search snippet) | VERIFIED (structure) |
| Zuyd amounts, max months, Noodfonds terms | not found: zuyd.nl returns 403 to automated fetch | EUR | n/a | [ZUYD-ST] | UNVERIFIED |
| Zuyd related pages | Studeren met een functiebeperking; Studeren en topsport | URL | current | [ZUYD-FB] [ZUYD-TS] | VERIFIED (URLs) |

---

## 4. Rent and housing (students)

| Item | Value or rule | Unit | Valid from | Source | Confidence |
|---|---|---|---|---|---|
| Wet betaalbare huur | in force; points system (WWS) binding for social and middle segment; rooms (onzelfstandig) always regulated by WWSO points | rule | 2024-07-01 | [HC-WBH] [VHN-KAMER] | VERIFIED |
| Social rent upper limit (143 points) | 932.93 | EUR/month | 2026-01-01 | [VHN-GR] | VERIFIED |
| Middenhuur / liberalisatiegrens (144-186 points) | ≤ 1,228.07 | EUR/month | 2026-01-01 | [VHN-GR] | VERIFIED |
| 2027 limits (Aedes) | 959.71 / 1,263.32 | EUR/month | 2027-01-01 | aedes.nl (secondary) | UNVERIFIED |
| Room rent check | Huurcommissie huurprijscheck onzelfstandige woonruimte (free) | URL | current | [VHN-KAMER] [HC-CHECK] | VERIFIED |
| Starting-rent review (aanvangshuur) | file "Toetsing aanvangshuurprijs" via MijnHuurcommissie within 6 months after the lease starts (house or room); the new rent applies retroactively from the lease start; tenant reclaims overpaid rent from the landlord (Juridisch Loket can help) | rule | current | [HC-AH] | VERIFIED |
| Temporary contracts | signed before 2024-07-01: during the contract and up to 6 months after it ends | rule | current | [HC-AH] | VERIFIED |
| Tenant fee (leges) | historically 25, refunded if the tenant wins; current amount not on page | EUR | n/a | old Kamerstukken | UNVERIFIED |
| Landlord fines / municipal enforcement | from 2025-01-01 the municipality can fine landlords who charge too much; report to the municipal huurdersmeldpunt | rule | 2025-01-01 | [VHN-KAMER] | VERIFIED |
| Maastricht meldpunt | Meldpunt goed verhuurderschap Maastricht (meldpunt@goedverhuurderschapmaastricht.nl; 14 043) | contact | 2025 | search snippets | UNVERIFIED |
| Huurteam Zuid-Limburg | free: rent check incl. home puntentelling, contract check, deposit and service-charge help, mediation with the landlord, help with the Huurcommissie procedure; successor of the UM Housing Helpdesk; set up by ESZL, gemeente Maastricht and UM; online appointment; info@huurteam-zuidlimburg.nl | rule | current | [HT] [UM-HT] | VERIFIED (services) |
| Studentenrechtsbureau Maastricht | free advice by law students (tenancy, education, employment, consumer law); srb@maastrichtuniversity.nl; +31 43 388 53 46; walk-in Tue-Thu 10:00-13:00 | contact | current | [SRB] | VERIFIED |
| Het Juridisch Loket Maastricht | free first legal help; income check for further help | URL | current | [MM-LEGAL] | VERIFIED (page blocked fetch) |
| "Maastricht Housing" | housing provider for internationals, not a legal-advice desk; not researched | n/a | n/a | n/a | UNVERIFIED |

---

## Open points

- The text of the Maastricht 2026 kwijtschelding regulation was not found. 2026 scope comes from Raadsvoorstel 81-2025; details come from the 2025 regulation.
- Current draagkracht rules for bijzondere bijstand (Maastricht-Heuvelland) were not found.
- Zuyd fund amounts: zuyd.nl blocks automated fetching. Check https://www.zuyd.nl/sites/default/files/2026-01/Studentenstatuut%202025-2026.pdf manually.
- Dal Vrij Limburg official application URL and student eligibility were not found.
- Noodfonds Energie 2026 opening date and income limits: secondary sources only.
- Minimum refund threshold of the Belastingdienst and the 2026 premie/belasting split of bracket 1: not confirmed on belastingdienst.nl.

---

## Sources

[NB-jan]: https://open.overheid.nl/documenten/df696620-6a03-4333-94ce-58d216f48c5c/file
[NB-jul]: https://open.overheid.nl/overheid/openbaarmakingen/api/v0/attachment/4c6f2253-fa8b-4c01-9fe3-422904ae0b6f
[SZ-NORM]: https://www.socialezaken-mh.nl/bijstandsnormen
[SZ-BS]: https://www.socialezaken-mh.nl/bijstand-uitkering/bijstandsuitkering
[GM-BS]: https://www.gemeentemaastricht.nl/werk-en-inkomen/bijstandsuitkering
[PW]: https://wetten.overheid.nl/BWBR0015703/2026-07-01
[GM-IIT]: https://www.gemeentemaastricht.nl/werk-en-inkomen/individuele-inkomenstoeslag
[GMB-IIT]: https://repository.overheid.nl/frbr/officielepublicaties/gmb/2026/gmb-2026-40184/1/pdf/gmb-2026-40184.pdf
[SZ-ST]: https://www.socialezaken-mh.nl/inkomen/individuele-studietoeslag
[SZ-LI]: https://www.socialezaken-mh.nl/regelingen-voor-mensen-met-een-laag-inkomen
[GM-BB]: https://www.gemeentemaastricht.nl/werk-en-inkomen/bijzondere-bijstand
[SZ-BB]: https://www.socialezaken-mh.nl/inkomen/bijzondere-bijstand
[SZ-VGZ]: https://www.socialezaken-mh.nl/kind-en-gezin/collectieve-zorgverzekering-vgz-zuid-limburg
[VGZ]: https://www.vgz.nl/zuidlimburg
[SZ-AZV]: https://www.socialezaken-mh.nl/tegemoetkomingen-en-voorzieningen/tegemoetkoming-aanvullende-zorgverzekering
[GM-KW]: https://www.gemeentemaastricht.nl/werk-en-inkomen/kwijtschelding-belastingen
[BsGW-V]: https://bsgw.nl/nl/veel-gestelde-vragen/kwijtschelding/wat-zijn-de-voorwaarden-voor-kwijtschelding
[BsGW-A]: https://bsgw.nl/nl/veel-gestelde-vragen/kwijtschelding/hoe-vraag-ik-kwijtschelding-aan
[KW-2025]: https://lokaleregelgeving.overheid.nl/CVDR728643
[RV-81]: https://www.maastrichtbeleid.nl/beleidsinformatie/Raadsvoorstel/2025/Raadsvoorstel%2081-2025%20-%20Belastingverordeningen%20en%20tarieven%20Maastricht%202026/Raadsvoorstel%2081-2025%20-%20Belastingverordeningen%20en%20tarieven%20Maastricht%202026
[LI]: https://wetten.overheid.nl/BWBR0024096/2026-01-01
[GM-VWF]: https://www.gemeentemaastricht.nl/werk-en-inkomen/volwassenenfonds-sport-cultuur-limburg
[SZ-CSA]: https://www.socialezaken-mh.nl/tegemoetkomingen-en-voorzieningen/tegemoetkoming-de-kosten-van-culturele-en-sociale-activiteiten
[GM-JF]: https://www.gemeentemaastricht.nl/jeugdfonds-sport-en-cultuur
[GM-KR]: https://www.gemeentemaastricht.nl/onderwijs-en-jeugd/kindregelingen
[DR-2026]: https://lokaleregelgeving.overheid.nl/CVDR756041/1
[SZ-SK]: https://www.socialezaken-mh.nl/tegemoetkomingen-en-voorzieningen/tegemoetkoming-schoolkosten-voor-kinderen
[LG]: https://leergeldmaastrichtenheuvelland.nl/ouderinfo/aanvraag/
[CVV]: https://repository.overheid.nl/frbr/officielepublicaties/gmb/2026/gmb-2026-40163/1/pdf/gmb-2026-40163.pdf
[CV-2026]: https://www.maastrichtbeleid.nl/beleidsinformatie/Openbare%20besluiten/2026/Openbare%20besluiten%2020%20januari%202026/Armoederegelingen%20E-dienstverlening%20Individuele%20Inkomenstoeslag,%20gratis%20vervoer%20minima%20met%20een%20beperking,%20tegemoetkoming%20schoolkosten/Armoederegelingen%20E-dienstverlening%20Individuele%20Inkomenstoeslag,%20gratis%20vervoer%20minima%20met%20een%20beperking,%20tegemoetkoming%20schoolkosten%20-%20collegevoorstel.pdf
[WIT]: https://repository.overheid.nl/frbr/officielepublicaties/gmb/2025/gmb-2025-394863/1/pdf/gmb-2025-394863.pdf
[GM-TV]: https://www.gemeentemaastricht.nl/teamvroegsignalering
[SZ-GH]: https://www.socialezaken-mh.nl/gratis-hulp-bij-geldzaken
[SZ-HG]: https://www.socialezaken-mh.nl/hulp-bij-geldzorgen
[SZ-EN]: https://www.socialezaken-mh.nl/energiebesparen
[GM-EK]: https://www.gemeentemaastricht.nl/energiekosten
[BD-VA]: https://www.belastingdienst.nl/wps/wcm/connect/nl/voorlopige-aanslag/content/voorlopige-aanslag-tarieven-en-heffingskortingen
[BD-IB]: https://www.belastingdienst.nl/wps/wcm/connect/nl/werk-en-inkomen/content/hoeveel-inkomstenbelasting-betalen
[BD-AHK25]: https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/inkomstenbelasting/heffingskortingen_boxen_tarieven/heffingskortingen/algemene_heffingskorting/tabel-algemene-heffingskorting-2025
[BD-AK25]: https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/inkomstenbelasting/heffingskortingen_boxen_tarieven/heffingskortingen/arbeidskorting/tabel-arbeidskorting-2025
[KVK25]: https://www.kvk.nl/geldzaken/belastingtarieven-2025/
[BD-JONG]: https://www.belastingdienst.nl/wps/wcm/connect/nl/jongeren/content/kan-ik-belasting-terugvragen
[BD-VERM]: https://www.belastingdienst.nl/wps/wcm/connect/nl/bezwaar-en-beroep/content/verzoek-om-vermindering-van-aanslag-inkomstenbelasting
[UM-StOF]: https://www.maastrichtuniversity.nl/study/admission-enrolment/financing-your-studies/financial-support-study-delays-um-student-support
[UM-REG]: https://www.maastrichtuniversity.nl/file/student-support-fund-2026pdf
[UM-FUNDS]: https://www.maastrichtuniversity.nl/support/during-your-studies/money-matters/funds-students
[UM-COST]: https://www.maastrichtuniversity.nl/studeren/studentenleven/cost-studying-financial-assistance
[UM-DEAN]: https://www.maastrichtuniversity.nl/support/during-your-studies/student-guidance/um-student-deans
[ZUYD-ST]: https://www.zuyd.nl/sites/default/files/2026-01/Studentenstatuut%202025-2026.pdf
[ZUYD-FB]: https://www.zuyd.nl/studeren-bij/studiefaciliteiten/studeren-met-een-functiebeperking
[ZUYD-TS]: https://www.zuyd.nl/studeren-bij/studiefaciliteiten/studeren-en-topsport
[HC-WBH]: https://www.huurcommissie.nl/onderwerpen/wet--en-regelgeving/wet-betaalbare-huur
[HC-AH]: https://www.huurcommissie.nl/onderwerpen/huurder-sociale--en-middensector/huurprijs-punten-sociale-middensector-huurder/verlaging-aanvangshuurprijs-vragen
[HC-CHECK]: https://www.huurcommissie.nl/support/huurprijscheck/huurprijscheck-onzelfstandige-woonruimte
[VHN-KAMER]: https://www.volkshuisvestingnederland.nl/wat-betekent-de-wet-betaalbare-huur-voor-mij/situaties/ik-huur/ik-huur-een-kamer
[VHN-GR]: https://www.volkshuisvestingnederland.nl/onderwerpen/huren-en-wonen/inkomensgrenzen-huurprijsgrenzen-en-huurtoeslagparameters/maximale-huurprijsgrenzen
[HT]: https://huurteam-zuidlimburg.nl
[UM-HT]: https://www.maastrichtuniversity.nl/support/your-studies-begin/living-maastricht/housing-helpdesk
[SRB]: https://studentenrechtshulp.nl/en/
[MM-LEGAL]: https://mymaastricht.nl/housing/rights-and-obligations/legal-advice

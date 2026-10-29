"""Studiefinanciering (DUO), Wet studiefinanciering 2000 — mbo (bol) and higher education —
and the tegemoetkoming scholieren (Wtos) for secondary school students aged 18+.

Not modelled: single-parent or deceased-parent exemptions, other children at home (€363
deduction per child), parents repaying their own student debt, and peiljaarverlegging.
"""

from openfisca_core.model_api import MONTH, Variable, max_, select, where

from openfisca_nl.entities import Persoon
from openfisca_nl.enums import Nationaliteit, Onderwijs


def is_ho(onderwijs):
    return (onderwijs == Onderwijs.hbo) + (onderwijs == Onderwijs.wo)


def is_mbo_bol(onderwijs):
    return onderwijs == Onderwijs.mbo_bol


class onderwijs_met_studiefinanciering(Variable):
    value_type = bool
    entity = Persoon
    definition_period = MONTH
    label = "Follows education covered by the Wsf 2000 or Wtos (mbo bol, hbo, wo, secondary school)"

    def formula(persoon, period):
        onderwijs = persoon("onderwijs", period)
        return is_ho(onderwijs) + is_mbo_bol(onderwijs) + (onderwijs == Onderwijs.vo)


class studiefinanciering_voorwaarde_onderwijs(Variable):
    value_type = bool
    entity = Persoon
    definition_period = MONTH
    label = "Studiefinanciering: follows a full-time mbo (bol), hbo or wo programme"

    def formula(persoon, period):
        onderwijs = persoon("onderwijs", period)
        return is_ho(onderwijs) + is_mbo_bol(onderwijs)


class studiefinanciering_voorwaarde_leeftijd(Variable):
    value_type = bool
    entity = Persoon
    definition_period = MONTH
    label = "Studiefinanciering: under 30 (mbo also 18 or older)"

    def formula(persoon, period, parameters):
        p = parameters(period).studiefinanciering
        leeftijd = persoon("leeftijd", period)
        # Simplification: we ask the current age, not the age at the start of studiefinanciering.
        minimum = where(is_mbo_bol(persoon("onderwijs", period)), p.mbo.minimumleeftijd, 0)
        return (leeftijd >= minimum) * (leeftijd < p.maximumleeftijd)


class netto_arbeidsinkomen_per_gewerkte_maand(Variable):
    value_type = float
    entity = Persoon
    definition_period = MONTH
    label = "Average net earnings from work per month worked"
    unit = "currency-EUR"

    def formula(persoon, period):
        jaar = period.this_year
        maanden = persoon("maanden_gewerkt", jaar)
        loon = persoon("inkomen_uit_arbeid", jaar)
        aandeel_belasting = where(
            persoon("toetsingsinkomen", jaar) > 0,
            loon / max_(persoon("toetsingsinkomen", jaar), 1),
            0,
        )
        netto = loon - aandeel_belasting * persoon("inkomstenbelasting", jaar)
        return where(maanden > 0, netto / max_(maanden, 1), 0)


class is_migrerend_werknemer(Variable):
    value_type = bool
    entity = Persoon
    definition_period = MONTH
    label = "EU/EEA/Swiss citizen whom DUO presumes to be a migrant worker (works enough in NL)"
    reference = "https://wetten.overheid.nl/BWBR0049680/2024-05-09"
    documentation = """
    DUO presumes worker status (Beleidsregel migrerend werknemerschap, since 1 September 2023) when
    on average 32+ hours a month are worked, or more than 24 hours a month for at least 6 months,
    or average net earnings reach 50% of the bijstandsnorm. It is a starting point, not a hard limit.
    """

    def formula(persoon, period, parameters):
        p = parameters(period).studiefinanciering.migrerend_werknemer
        eer = persoon("nationaliteit", period) == Nationaliteit.eer
        uren = persoon("werkuren_per_maand", period)
        maanden = persoon("maanden_gewerkt", period.this_year)
        inkomensgrens = where(
            persoon("leeftijd", period) < 21,
            p.minimum_netto_maandinkomen.onder_21,
            p.minimum_netto_maandinkomen.vanaf_21,
        )
        genoeg_uren = uren >= p.minimum_uren_per_maand
        genoeg_uren_zes_maanden = (uren > p.minimum_uren_zes_maanden) * (maanden >= 6)
        genoeg_inkomen = persoon("netto_arbeidsinkomen_per_gewerkte_maand", period) >= inkomensgrens
        return eer * (genoeg_uren + genoeg_uren_zes_maanden + genoeg_inkomen)


class studiefinanciering_voorwaarde_nationaliteit(Variable):
    value_type = bool
    entity = Persoon
    definition_period = MONTH
    label = "Studiefinanciering: Dutch, or treated as Dutch (EU migrant worker, EU 5+ years in NL, equivalent permit)"

    def formula(persoon, period, parameters):
        p = parameters(period).studiefinanciering
        nationaliteit = persoon("nationaliteit", period)
        return select(
            [
                nationaliteit == Nationaliteit.nederlands,
                nationaliteit == Nationaliteit.niet_eer_gelijkgesteld,
                nationaliteit == Nationaliteit.eer,
            ],
            [
                True,
                True,
                persoon("is_migrerend_werknemer", period) + (persoon("jaren_in_nederland", period) >= p.eer_verblijfsjaren),
            ],
            False,
        )


class recht_op_studiefinanciering(Variable):
    value_type = bool
    entity = Persoon
    definition_period = MONTH
    label = "Has a right to studiefinanciering (grant, supplementary grant, loan, public transport)"

    def formula(persoon, period):
        return (
            persoon("studiefinanciering_voorwaarde_onderwijs", period)
            * persoon("studiefinanciering_voorwaarde_leeftijd", period)
            * persoon("studiefinanciering_voorwaarde_nationaliteit", period)
        )


class basisbeurs(Variable):
    value_type = float
    entity = Persoon
    definition_period = MONTH
    label = "Basisbeurs per month (becomes a gift if you graduate within 10 years)"
    unit = "currency-EUR"
    reference = "https://duo.nl/particulier/studiefinanciering/bedragen.jsp"

    def formula(persoon, period, parameters):
        p = parameters(period).studiefinanciering
        onderwijs = persoon("onderwijs", period)
        thuis = persoon("woont_bij_ouders", period)
        ho = where(thuis, p.ho.basisbeurs.thuiswonend, p.ho.basisbeurs.uitwonend)
        mbo = where(thuis, p.mbo.basisbeurs.thuiswonend, p.mbo.basisbeurs.uitwonend)
        bedrag = select([is_ho(onderwijs), is_mbo_bol(onderwijs)], [ho, mbo], 0)
        return persoon("recht_op_studiefinanciering", period) * bedrag


class aanvullende_beurs_maximum(Variable):
    value_type = float
    entity = Persoon
    definition_period = MONTH
    label = "Maximum aanvullende beurs per month for this type of education"
    unit = "currency-EUR"

    def formula(persoon, period, parameters):
        p = parameters(period).studiefinanciering
        onderwijs = persoon("onderwijs", period)
        thuis = persoon("woont_bij_ouders", period)
        mbo_ab = p.mbo.aanvullende_beurs
        # Lesgeld is due from age 18, so the lesgeld supplement applies to every mbo student with a grant.
        mbo = where(thuis, mbo_ab.maximum.thuiswonend, mbo_ab.maximum.uitwonend) + mbo_ab.lesgeld_toeslag
        return select([is_ho(onderwijs), is_mbo_bol(onderwijs)], [p.ho.aanvullende_beurs.maximum, mbo], 0)


class ouderbijdrage_per_maand(Variable):
    value_type = float
    entity = Persoon
    definition_period = MONTH
    label = "Expected parental contribution per month (veronderstelde ouderlijke bijdrage)"
    unit = "currency-EUR"
    documentation = """
    Wsf art. 3.9a and 3.13: per parent, a percentage of income above the vrije voet; the per-parent amounts
    are summed (one parent's negative amount offsets the other's) and divided over the children who
    receive the aanvullende beurs. With two parents this equals a percentage of the combined income
    above twice the vrije voet.
    """

    def formula(persoon, period, parameters):
        p = parameters(period).studiefinanciering
        onderwijs = persoon("onderwijs", period)
        ho_ab = p.ho.aanvullende_beurs
        mbo_ab = p.mbo.aanvullende_beurs
        pct = where(is_mbo_bol(onderwijs), mbo_ab.kortingspercentage, ho_ab.kortingspercentage)
        vrije_voet = where(is_mbo_bol(onderwijs), mbo_ab.vrije_voet_per_ouder, ho_ab.vrije_voet_per_ouder)
        inkomen = persoon("inkomen_ouders", period.this_year)
        kinderen_met_beurs = 1 + persoon("broers_zussen_met_studiefinanciering", period)
        return max_(0, pct * (inkomen - 2 * vrije_voet)) / kinderen_met_beurs / 12


class aanvullende_beurs(Variable):
    value_type = float
    entity = Persoon
    definition_period = MONTH
    label = "Aanvullende beurs per month (depends on parents' income; becomes a gift if you graduate)"
    unit = "currency-EUR"
    reference = "https://duo.nl/particulier/aanvullende-beurs-studiefinanciering/hoeveel-is-het.jsp"

    def formula(persoon, period):
        maximum = persoon("aanvullende_beurs_maximum", period)
        bedrag = max_(0, maximum - persoon("ouderbijdrage_per_maand", period))
        return persoon("recht_op_studiefinanciering", period) * bedrag


class maximale_lening(Variable):
    value_type = float
    entity = Persoon
    definition_period = MONTH
    label = "Maximum student loan per month: basislening plus the part of the aanvullende beurs you don't get"
    unit = "currency-EUR"
    reference = "https://duo.nl/particulier/studiefinanciering/bedragen.jsp"

    def formula(persoon, period, parameters):
        p = parameters(period).studiefinanciering
        onderwijs = persoon("onderwijs", period)
        basislening = select([is_ho(onderwijs), is_mbo_bol(onderwijs)], [p.ho.basislening, p.mbo.basislening], 0)
        aanvullende_lening = persoon("aanvullende_beurs_maximum", period) - persoon("aanvullende_beurs", period)
        return persoon("recht_op_studiefinanciering", period) * (basislening + aanvullende_lening)


class collegegeldkrediet(Variable):
    value_type = float
    entity = Persoon
    definition_period = MONTH
    label = "Tuition fee loan per month (hbo/wo). Also open to EU students who don't qualify for other student finance"
    unit = "currency-EUR"
    reference = "https://duo.nl/particulier/student-finance/tuition-fee-loan.jsp"

    def formula(persoon, period, parameters):
        p = parameters(period).studiefinanciering
        onderwijs = persoon("onderwijs", period)
        nationaliteit = persoon("nationaliteit", period)
        recht = is_ho(onderwijs) * persoon("studiefinanciering_voorwaarde_leeftijd", period) * (
            persoon("studiefinanciering_voorwaarde_nationaliteit", period) + (nationaliteit == Nationaliteit.eer)
        )
        return recht * p.ho.collegegeldkrediet


class studentenreisproduct(Variable):
    value_type = bool
    entity = Persoon
    definition_period = MONTH
    label = "Gets the studentenreisproduct (free public transport on weekdays or weekends)"
    reference = "https://duo.nl/particulier/studiefinanciering/ov.jsp"

    def formula(persoon, period):
        return persoon("recht_op_studiefinanciering", period)


class studentenreisproduct_waarde(Variable):
    value_type = float
    entity = Persoon
    definition_period = MONTH
    label = "Value of the studentenreisproduct per month (in kind, not paid out)"
    unit = "currency-EUR"

    def formula(persoon, period, parameters):
        waarde = parameters(period).studiefinanciering.studentenreisproduct_waarde
        return persoon("studentenreisproduct", period) * waarde


class tegemoetkoming_scholieren_voorwaarde_leeftijd(Variable):
    value_type = bool
    entity = Persoon
    definition_period = MONTH
    label = "Tegemoetkoming scholieren: 18 or older and under 30"

    def formula(persoon, period, parameters):
        p = parameters(period).studiefinanciering
        leeftijd = persoon("leeftijd", period)
        return (leeftijd >= p.tegemoetkoming_scholieren.minimumleeftijd) * (leeftijd < p.maximumleeftijd)


class tegemoetkoming_scholieren(Variable):
    value_type = float
    entity = Persoon
    definition_period = MONTH
    label = "Tegemoetkoming scholieren: basistoelage per month for secondary school students aged 18+ (gift)"
    unit = "currency-EUR"
    reference = "https://duo.nl/particulier/tegemoetkoming-scholieren/bedragen.jsp"

    def formula(persoon, period, parameters):
        p = parameters(period).studiefinanciering.tegemoetkoming_scholieren
        vo = persoon("onderwijs", period) == Onderwijs.vo
        recht = (
            vo
            * persoon("tegemoetkoming_scholieren_voorwaarde_leeftijd", period)
            * persoon("studiefinanciering_voorwaarde_nationaliteit", period)
        )
        thuis = persoon("woont_bij_ouders", period)
        return recht * where(thuis, p.basistoelage.thuiswonend, p.basistoelage.uitwonend)

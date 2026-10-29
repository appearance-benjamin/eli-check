"""Gemeente Maastricht (Sociale Zaken Maastricht Heuvelland) minima schemes and BsGW kwijtschelding.

These are indicators: the municipality assesses every application. Conditions we cannot ask in a
short questionnaire (36 months of low income for the IIT, medical advice for the studietoeslag,
special costs for bijzondere bijstand) are left to the result text.
"""

from openfisca_core.model_api import MONTH, Variable, select, where

from openfisca_nl.entities import Huishouden, Persoon
from openfisca_nl.enums import Onderwijs


def aanvrager(huishouden, variable, period):
    return huishouden.value_nth_person(0, huishouden.members(variable, period))


def alleen_kinderen(huishouden, period):
    """Without partner, with at least one child under 18."""
    return (huishouden("heeft_toeslagpartner", period) == 0) * huishouden("kindgebonden_budget_voorwaarde_kinderen", period)


# --- shared conditions -------------------------------------------------------


class maastricht_voorwaarde_woonplaats(Variable):
    value_type = bool
    entity = Huishouden
    definition_period = MONTH
    label = "Maastricht schemes: registered in Maastricht"

    def formula(huishouden, period):
        return huishouden("woont_in_maastricht", period)


class maastricht_voorwaarde_geen_studie(Variable):
    value_type = bool
    entity = Huishouden
    definition_period = MONTH
    label = "Maastricht schemes: applicant does not follow education with student finance (Wsf/Wtos)"

    def formula(huishouden, period):
        return aanvrager(huishouden, "onderwijs_met_studiefinanciering", period) == 0


# --- Individuele inkomenstoeslag ---------------------------------------------


class maastricht_individuele_inkomenstoeslag_voorwaarde_woonplaats(Variable):
    value_type = bool
    entity = Huishouden
    definition_period = MONTH
    label = "Individuele inkomenstoeslag: registered in Maastricht"

    def formula(huishouden, period):
        return huishouden("maastricht_voorwaarde_woonplaats", period)


class maastricht_individuele_inkomenstoeslag_voorwaarde_leeftijd(Variable):
    value_type = bool
    entity = Huishouden
    definition_period = MONTH
    label = "Individuele inkomenstoeslag: applicant aged 21 up to AOW age"

    def formula(huishouden, period, parameters):
        p = parameters(period)
        leeftijd = aanvrager(huishouden, "leeftijd", period)
        return (leeftijd >= p.maastricht.individuele_inkomenstoeslag.minimumleeftijd) * (leeftijd < p.algemeen.aow_leeftijd)


class maastricht_individuele_inkomenstoeslag_voorwaarde_inkomen(Variable):
    value_type = bool
    entity = Huishouden
    definition_period = MONTH
    label = "Individuele inkomenstoeslag: net income at most 100% of the bijstandsnorm (it must have been that low for 36 months)"

    def formula(huishouden, period, parameters):
        grens = parameters(period).maastricht.individuele_inkomenstoeslag.inkomensgrens_percentage
        return huishouden("inkomen_percentage_bijstandsnorm", period) <= grens


class maastricht_individuele_inkomenstoeslag_voorwaarde_vermogen(Variable):
    value_type = bool
    entity = Huishouden
    definition_period = MONTH
    label = "Individuele inkomenstoeslag: assets at most 8,000 single / 16,000 couple or single parent"

    def formula(huishouden, period):
        return huishouden("bijstand_voorwaarde_vermogen", period)


class maastricht_individuele_inkomenstoeslag_voorwaarde_geen_studie(Variable):
    value_type = bool
    entity = Huishouden
    definition_period = MONTH
    label = "Individuele inkomenstoeslag: not studying with student finance now (nor in the past 36 months)"

    def formula(huishouden, period):
        return huishouden("maastricht_voorwaarde_geen_studie", period)


class maastricht_individuele_inkomenstoeslag(Variable):
    value_type = bool
    entity = Huishouden
    definition_period = MONTH
    label = "Indication: may qualify for the Maastricht individuele inkomenstoeslag"
    reference = "https://www.gemeentemaastricht.nl/werk-en-inkomen/individuele-inkomenstoeslag"

    def formula(huishouden, period):
        return (
            huishouden("maastricht_individuele_inkomenstoeslag_voorwaarde_woonplaats", period)
            * huishouden("maastricht_individuele_inkomenstoeslag_voorwaarde_leeftijd", period)
            * huishouden("maastricht_individuele_inkomenstoeslag_voorwaarde_inkomen", period)
            * huishouden("maastricht_individuele_inkomenstoeslag_voorwaarde_vermogen", period)
            * huishouden("maastricht_individuele_inkomenstoeslag_voorwaarde_geen_studie", period)
            * huishouden("bijstand_voorwaarde_verblijf", period)
        )


class maastricht_individuele_inkomenstoeslag_bedrag(Variable):
    value_type = float
    entity = Huishouden
    definition_period = MONTH
    label = "Individuele inkomenstoeslag amount (paid once a year)"
    unit = "currency-EUR"

    def formula(huishouden, period, parameters):
        bedrag = parameters(period).maastricht.individuele_inkomenstoeslag.bedrag
        hoogte = select(
            [huishouden("heeft_toeslagpartner", period), alleen_kinderen(huishouden, period)],
            [bedrag.paar, bedrag.alleenstaande_ouder],
            bedrag.alleenstaand,
        )
        return huishouden("maastricht_individuele_inkomenstoeslag", period) * hoogte


# --- Individuele studietoeslag -----------------------------------------------


class maastricht_individuele_studietoeslag_voorwaarde_woonplaats(Variable):
    value_type = bool
    entity = Persoon
    definition_period = MONTH
    label = "Individuele studietoeslag: registered in Maastricht (or Meerssen, Vaals, Valkenburg, Gulpen-Wittem)"

    def formula(persoon, period):
        return persoon.huishouden("woont_in_maastricht", period)


class maastricht_individuele_studietoeslag_voorwaarde_beperking(Variable):
    value_type = bool
    entity = Persoon
    definition_period = MONTH
    label = "Individuele studietoeslag: a disability or chronic illness makes it impossible to earn alongside studying"

    def formula(persoon, period):
        return persoon("heeft_beperking", period)


class maastricht_individuele_studietoeslag_voorwaarde_studiefinanciering(Variable):
    value_type = bool
    entity = Persoon
    definition_period = MONTH
    label = "Individuele studietoeslag: receives studiefinanciering or tegemoetkoming scholieren"

    def formula(persoon, period):
        return persoon("recht_op_studiefinanciering", period) + (persoon("tegemoetkoming_scholieren", period) > 0)


class maastricht_individuele_studietoeslag(Variable):
    value_type = bool
    entity = Persoon
    definition_period = MONTH
    label = "Indication: may qualify for the individuele studietoeslag (students with a disability)"
    reference = "https://www.socialezaken-mh.nl/inkomen/individuele-studietoeslag"

    def formula(persoon, period, parameters):
        bedrag = parameters(period).maastricht.individuele_studietoeslag.calc(persoon("leeftijd", period))
        return (
            persoon("maastricht_individuele_studietoeslag_voorwaarde_woonplaats", period)
            * persoon("maastricht_individuele_studietoeslag_voorwaarde_beperking", period)
            * persoon("maastricht_individuele_studietoeslag_voorwaarde_studiefinanciering", period)
            * (bedrag > 0)
        )


class maastricht_individuele_studietoeslag_bedrag(Variable):
    value_type = float
    entity = Persoon
    definition_period = MONTH
    label = "Individuele studietoeslag per month (net, by age)"
    unit = "currency-EUR"

    def formula(persoon, period, parameters):
        bedrag = parameters(period).maastricht.individuele_studietoeslag.calc(persoon("leeftijd", period))
        return persoon("maastricht_individuele_studietoeslag", period) * bedrag


# --- Collectieve zorgverzekering (VGZ Zuid-Limburgpakket) --------------------


class maastricht_collectieve_zorgverzekering_voorwaarde_woonplaats(Variable):
    value_type = bool
    entity = Huishouden
    definition_period = MONTH
    label = "Collectieve zorgverzekering: registered in Maastricht"

    def formula(huishouden, period):
        return huishouden("maastricht_voorwaarde_woonplaats", period)


class maastricht_collectieve_zorgverzekering_voorwaarde_inkomen(Variable):
    value_type = bool
    entity = Huishouden
    definition_period = MONTH
    label = "Collectieve zorgverzekering: net income at most 150% of the social minimum"

    def formula(huishouden, period, parameters):
        grens = parameters(period).maastricht.collectieve_zorgverzekering.inkomensgrens_percentage
        return huishouden("inkomen_percentage_bijstandsnorm", period) <= grens


class maastricht_collectieve_zorgverzekering(Variable):
    value_type = bool
    entity = Huishouden
    definition_period = MONTH
    label = "Indication: may join the VGZ Zuid-Limburgpakket collective health insurance for minima"
    reference = "https://www.socialezaken-mh.nl/kind-en-gezin/collectieve-zorgverzekering-vgz-zuid-limburg"

    def formula(huishouden, period):
        return (
            huishouden("maastricht_collectieve_zorgverzekering_voorwaarde_woonplaats", period)
            * huishouden("maastricht_collectieve_zorgverzekering_voorwaarde_inkomen", period)
            * aanvrager(huishouden, "heeft_nederlandse_zorgverzekering", period)
        )


# --- Kwijtschelding gemeentelijke belastingen (BsGW) -------------------------


class kwijtschelding_inkomen_per_maand(Variable):
    value_type = float
    entity = Huishouden
    definition_period = MONTH
    label = "Income counted for kwijtschelding: net income, plus the full student normbudget for students"
    unit = "currency-EUR"
    documentation = """
    Leidraad Invordering art. 26.2.12: for students, the basisbeurs, the maximum aanvullende beurs and the
    maximum basislening count as income (minus 80 for books in higher education), even when not taken.
    """

    def formula(huishouden, period, parameters):
        boeken = parameters(period).maastricht.kwijtschelding.boekenaftrek_ho
        onderwijs = huishouden.members("onderwijs", period)
        ho = (onderwijs == Onderwijs.hbo) + (onderwijs == Onderwijs.wo)
        # The grants are already in netto_huishoudinkomen_per_maand. maximale_lening includes the part of
        # the aanvullende beurs not granted, so grants + maximale_lening = basisbeurs + max AB + basislening.
        lening = huishouden.members("recht_op_studiefinanciering", period) * (
            huishouden.members("maximale_lening", period) - ho * boeken
        )
        return huishouden("netto_huishoudinkomen_per_maand", period) + huishouden.sum(lening, role=Huishouden.PARTNER)


class maastricht_kwijtschelding_voorwaarde_woonplaats(Variable):
    value_type = bool
    entity = Huishouden
    definition_period = MONTH
    label = "Kwijtschelding: registered in Maastricht"

    def formula(huishouden, period):
        return huishouden("maastricht_voorwaarde_woonplaats", period)


class maastricht_kwijtschelding_voorwaarde_inkomen(Variable):
    value_type = bool
    entity = Huishouden
    definition_period = MONTH
    label = "Kwijtschelding: income (for students incl. the maximum student loan) at most the bijstandsnorm"

    def formula(huishouden, period, parameters):
        pct = parameters(period).maastricht.kwijtschelding.inkomensgrens_percentage
        return huishouden("kwijtschelding_inkomen_per_maand", period) <= pct / 100 * huishouden("bijstandsnorm", period)


class maastricht_kwijtschelding_voorwaarde_vermogen(Variable):
    value_type = bool
    entity = Huishouden
    definition_period = MONTH
    label = "Kwijtschelding: savings at most about 3,700 single / 4,500 single parent / 4,900 couple"

    def formula(huishouden, period, parameters):
        grens = parameters(period).maastricht.kwijtschelding.vermogensgrens
        limiet = select(
            [huishouden("heeft_toeslagpartner", period), alleen_kinderen(huishouden, period)],
            [grens.paar, grens.alleenstaande_ouder],
            grens.alleenstaand,
        )
        return huishouden("gezamenlijk_vermogen", period.this_year) <= limiet


class maastricht_kwijtschelding(Variable):
    value_type = bool
    entity = Huishouden
    definition_period = MONTH
    label = "Indication: may get remission of municipal taxes (afvalstoffenheffing, rioolheffing) via BsGW"
    reference = "https://bsgw.nl/nl/veel-gestelde-vragen/kwijtschelding/wat-zijn-de-voorwaarden-voor-kwijtschelding"

    def formula(huishouden, period):
        return (
            huishouden("maastricht_kwijtschelding_voorwaarde_woonplaats", period)
            * huishouden("maastricht_kwijtschelding_voorwaarde_inkomen", period)
            * huishouden("maastricht_kwijtschelding_voorwaarde_vermogen", period)
        )


# --- Kindregelingen (school costs, Jeugdfonds, Leergeld) ---------------------


class maastricht_kindregelingen_voorwaarde_woonplaats(Variable):
    value_type = bool
    entity = Huishouden
    definition_period = MONTH
    label = "Kindregelingen: registered in Maastricht"

    def formula(huishouden, period):
        return huishouden("maastricht_voorwaarde_woonplaats", period)


class maastricht_kindregelingen_voorwaarde_kinderen(Variable):
    value_type = bool
    entity = Huishouden
    definition_period = MONTH
    label = "Kindregelingen: at least one child under 18"

    def formula(huishouden, period):
        return huishouden("kindgebonden_budget_voorwaarde_kinderen", period)


class maastricht_kindregelingen_voorwaarde_inkomen(Variable):
    value_type = bool
    entity = Huishouden
    definition_period = MONTH
    label = "Kindregelingen: net income at most 110% of the bijstandsnorm"

    def formula(huishouden, period, parameters):
        grens = parameters(period).maastricht.minimaregelingen_inkomensgrens_percentage
        return huishouden("inkomen_percentage_bijstandsnorm", period) <= grens


class maastricht_kindregelingen_voorwaarde_geen_studie(Variable):
    value_type = bool
    entity = Huishouden
    definition_period = MONTH
    label = "Kindregelingen (school-cost allowance): parent does not study with student finance"

    def formula(huishouden, period):
        return huishouden("maastricht_voorwaarde_geen_studie", period)


class maastricht_kindregelingen(Variable):
    value_type = bool
    entity = Huishouden
    definition_period = MONTH
    label = "Indication: may qualify for Maastricht child schemes (school costs, Jeugdfonds Sport & Cultuur, Leergeld)"
    reference = "https://www.gemeentemaastricht.nl/onderwijs-en-jeugd/kindregelingen"

    def formula(huishouden, period):
        return (
            huishouden("maastricht_kindregelingen_voorwaarde_woonplaats", period)
            * huishouden("maastricht_kindregelingen_voorwaarde_kinderen", period)
            * huishouden("maastricht_kindregelingen_voorwaarde_inkomen", period)
            * huishouden("maastricht_kindregelingen_voorwaarde_geen_studie", period)
        )


class maastricht_kindregelingen_bedrag(Variable):
    value_type = float
    entity = Huishouden
    definition_period = MONTH
    label = "School-cost allowance per year (75 per primary school child, 300 per secondary school child)"
    unit = "currency-EUR"

    def formula(huishouden, period, parameters):
        p = parameters(period).maastricht.schoolkosten
        leeftijd = huishouden.members("leeftijd", period)
        kind = huishouden.members.has_role(Huishouden.KIND)
        per_kind = kind * select(
            [(leeftijd >= 4) * (leeftijd < 12), (leeftijd >= 12) * (leeftijd < 18)],
            [p.basisschool, p.voortgezet_onderwijs],
            0,
        )
        return huishouden("maastricht_kindregelingen", period) * huishouden.sum(per_kind)


# --- Volwassenenfonds Sport & Cultuur and bijzondere bijstand ----------------


class maastricht_volwassenenfonds_voorwaarde_inkomen(Variable):
    value_type = bool
    entity = Huishouden
    definition_period = MONTH
    label = "Volwassenenfonds Sport & Cultuur: net income at most 110% of the bijstandsnorm"

    def formula(huishouden, period, parameters):
        grens = parameters(period).maastricht.minimaregelingen_inkomensgrens_percentage
        return huishouden("inkomen_percentage_bijstandsnorm", period) <= grens


class maastricht_volwassenenfonds_voorwaarde_woonplaats(Variable):
    value_type = bool
    entity = Huishouden
    definition_period = MONTH
    label = "Volwassenenfonds Sport & Cultuur: registered in Maastricht"

    def formula(huishouden, period):
        return huishouden("maastricht_voorwaarde_woonplaats", period)


class maastricht_volwassenenfonds(Variable):
    value_type = bool
    entity = Huishouden
    definition_period = MONTH
    label = "Indication: may get up to 350 (sport) or 550 (culture) a year from the Volwassenenfonds Sport & Cultuur"
    reference = "https://www.gemeentemaastricht.nl/werk-en-inkomen/volwassenenfonds-sport-cultuur-limburg"

    def formula(huishouden, period):
        volwassen = aanvrager(huishouden, "leeftijd", period) >= 18
        return (
            volwassen
            * huishouden("maastricht_volwassenenfonds_voorwaarde_woonplaats", period)
            * huishouden("maastricht_volwassenenfonds_voorwaarde_inkomen", period)
        )


class maastricht_bijzondere_bijstand_voorwaarde_woonplaats(Variable):
    value_type = bool
    entity = Huishouden
    definition_period = MONTH
    label = "Bijzondere bijstand: registered in Maastricht"

    def formula(huishouden, period):
        return huishouden("maastricht_voorwaarde_woonplaats", period)


class maastricht_bijzondere_bijstand_voorwaarde_inkomen(Variable):
    value_type = bool
    entity = Huishouden
    definition_period = MONTH
    label = "Bijzondere bijstand: net income at most 110% of the bijstandsnorm (above it a partial amount is possible)"

    def formula(huishouden, period, parameters):
        grens = parameters(period).maastricht.minimaregelingen_inkomensgrens_percentage
        return huishouden("inkomen_percentage_bijstandsnorm", period) <= grens


class maastricht_bijzondere_bijstand(Variable):
    value_type = bool
    entity = Huishouden
    definition_period = MONTH
    label = "Indication: unavoidable special costs may be covered by bijzondere bijstand"
    reference = "https://www.gemeentemaastricht.nl/werk-en-inkomen/bijzondere-bijstand"

    def formula(huishouden, period):
        volwassen = aanvrager(huishouden, "leeftijd", period) >= 18
        return (
            volwassen
            * huishouden("maastricht_bijzondere_bijstand_voorwaarde_woonplaats", period)
            * huishouden("maastricht_bijzondere_bijstand_voorwaarde_inkomen", period)
        )

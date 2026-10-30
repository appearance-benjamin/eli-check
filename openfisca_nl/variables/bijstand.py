"""Algemene bijstand (Participatiewet) — an indicative top-up to the social minimum.

Not modelled: kostendelersnorm (sharing a home with other adults lowers the norm),
the 4-week search period for under-27s, and income from assets. Always a municipal decision.
"""

from openfisca_core.model_api import MONTH, Variable, max_, select, where

from openfisca_nl.entities import Huishouden
from openfisca_nl.enums import Nationaliteit


class bijstandsnorm(Variable):
    value_type = float
    entity = Huishouden
    definition_period = MONTH
    label = "Bijstandsnorm per month (net, incl. holiday allowance) for this household"
    unit = "currency-EUR"
    reference = "https://www.rijksoverheid.nl/onderwerpen/bijstand/vraag-en-antwoord/hoe-hoog-is-de-bijstandsuitkering"

    def formula(huishouden, period, parameters):
        p = parameters(period)
        normen = p.bijstand.normen
        partner = huishouden("heeft_toeslagpartner", period)
        kinderen = huishouden("aantal_kinderen", period) > 0
        jongste_jong = huishouden("jongste_partner_leeftijd", period) < 21
        oudste_jong = huishouden("oudste_partner_leeftijd", period) < 21
        aow = huishouden("oudste_partner_leeftijd", period) >= p.algemeen.aow_leeftijd
        alleenstaand = select(
            [jongste_jong, aow], [normen.alleenstaand_18_20, normen.alleenstaand_aow], normen.alleenstaand_21_plus
        )
        paar = select(
            [aow, oudste_jong, jongste_jong],
            [
                normen.paar_aow,
                where(kinderen, normen.paar_18_20_met_kinderen, normen.paar_18_20),
                where(kinderen, normen.paar_gemengd_met_kinderen, normen.paar_gemengd),
            ],
            normen.paar_21_plus,
        )
        return where(partner, paar, alleenstaand)


class netto_huishoudinkomen_per_maand(Variable):
    value_type = float
    entity = Huishouden
    definition_period = MONTH
    label = "Net monthly income of applicant and partner: yearly net / 12 plus student grants (not loans)"
    unit = "currency-EUR"

    def formula(huishouden, period):
        netto = huishouden.members("netto_jaarinkomen", period.this_year) / 12
        beurzen = (
            huishouden.members("basisbeurs", period)
            + huishouden.members("aanvullende_beurs", period)
            + huishouden.members("tegemoetkoming_scholieren", period)
        )
        return huishouden.sum(netto + beurzen, role=Huishouden.PARTNER)


class sociaal_minimum(Variable):
    value_type = float
    entity = Huishouden
    definition_period = MONTH
    label = "Social minimum: bijstandsnorm 21+ (or at AOW age) for a single person or a couple (basis of municipal income limits)"
    unit = "currency-EUR"

    def formula(huishouden, period, parameters):
        p = parameters(period)
        normen = p.bijstand.normen
        aow = huishouden("oudste_partner_leeftijd", period) >= p.algemeen.aow_leeftijd
        alleenstaand = where(aow, normen.alleenstaand_aow, normen.alleenstaand_21_plus)
        paar = where(aow, normen.paar_aow, normen.paar_21_plus)
        return where(huishouden("heeft_toeslagpartner", period), paar, alleenstaand)


class inkomen_percentage_bijstandsnorm(Variable):
    value_type = float
    entity = Huishouden
    definition_period = MONTH
    label = "Net household income as a percentage of the social minimum (used by municipal minima schemes)"
    unit = "/1"

    def formula(huishouden, period):
        return 100 * huishouden("netto_huishoudinkomen_per_maand", period) / huishouden("sociaal_minimum", period)


class bijstand_voorwaarde_leeftijd(Variable):
    value_type = bool
    entity = Huishouden
    definition_period = MONTH
    label = "Bijstand: applicant is 18+ and below AOW age"

    def formula(huishouden, period, parameters):
        p = parameters(period)
        leeftijd = huishouden.value_nth_person(0, huishouden.members("leeftijd", period))
        return (leeftijd >= 18) * (leeftijd < p.algemeen.aow_leeftijd)


class bijstand_voorwaarde_geen_studie(Variable):
    value_type = bool
    entity = Huishouden
    definition_period = MONTH
    label = "Bijstand: applicant is not under 27 in education with student finance, and has no student finance (art. 13 Participatiewet)"

    def formula(huishouden, period):
        uitgesloten = huishouden.members("onderwijs_met_studiefinanciering", period) * (
            (huishouden.members("leeftijd", period) < 27)
            + huishouden.members("recht_op_studiefinanciering", period)
            + (huishouden.members("tegemoetkoming_scholieren", period) > 0)
        )
        return huishouden.value_nth_person(0, uitgesloten) == 0


class bijstand_voorwaarde_verblijf(Variable):
    value_type = bool
    entity = Huishouden
    definition_period = MONTH
    label = "Bijstand: residence status allows social assistance"

    def formula(huishouden, period):
        nationaliteit = huishouden.members("nationaliteit", period)
        aanvrager = huishouden.value_nth_person(0, nationaliteit == Nationaliteit.niet_eer_overig)
        return aanvrager == 0


class bijstand_voorwaarde_vermogen(Variable):
    value_type = bool
    entity = Huishouden
    definition_period = MONTH
    label = "Bijstand: assets below the limit"

    def formula(huishouden, period, parameters):
        grens = parameters(period).bijstand.vermogensgrens
        gezin = huishouden("heeft_toeslagpartner", period) + (huishouden("aantal_kinderen", period) > 0)
        limiet = where(gezin, grens.gezin, grens.alleenstaand)
        return huishouden("gezamenlijk_vermogen", period.this_year) <= limiet


class bijstand_voorwaarde_inkomen(Variable):
    value_type = bool
    entity = Huishouden
    definition_period = MONTH
    label = "Bijstand: net income below the bijstandsnorm"

    def formula(huishouden, period):
        return huishouden("netto_huishoudinkomen_per_maand", period) < huishouden("bijstandsnorm", period)


class bijstand(Variable):
    value_type = float
    entity = Huishouden
    definition_period = MONTH
    label = "Indicative bijstand top-up per month"
    unit = "currency-EUR"
    reference = "https://www.gemeentemaastricht.nl/werk-en-inkomen/bijstandsuitkering"

    def formula(huishouden, period):
        recht = (
            huishouden("bijstand_voorwaarde_leeftijd", period)
            * huishouden("bijstand_voorwaarde_geen_studie", period)
            * huishouden("bijstand_voorwaarde_verblijf", period)
            * huishouden("bijstand_voorwaarde_vermogen", period)
            * huishouden("bijstand_voorwaarde_inkomen", period)
        )
        tekort = huishouden("bijstandsnorm", period) - huishouden("netto_huishoudinkomen_per_maand", period)
        return recht * max_(0, tekort)

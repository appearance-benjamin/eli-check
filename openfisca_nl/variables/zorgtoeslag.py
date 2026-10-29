"""Zorgtoeslag (healthcare allowance), Wet op de zorgtoeslag."""

from openfisca_core.model_api import MONTH, Variable, max_, not_, where

from openfisca_nl.entities import Huishouden
from openfisca_nl.helpers import toeslag_per_maand


class zorgtoeslag_voorwaarde_leeftijd(Variable):
    value_type = bool
    entity = Huishouden
    definition_period = MONTH
    label = "Zorgtoeslag: applicant is 18 or older"

    def formula(huishouden, period, parameters):
        minimum = parameters(period).zorgtoeslag.minimumleeftijd
        aanvrager_leeftijd = huishouden.value_nth_person(0, huishouden.members("leeftijd", period))
        return aanvrager_leeftijd >= minimum


class zorgtoeslag_voorwaarde_verzekering(Variable):
    value_type = bool
    entity = Huishouden
    definition_period = MONTH
    label = "Zorgtoeslag: applicant has a Dutch basic health insurance (not a foreign/EHIC or private student policy)"

    def formula(huishouden, period):
        verzekerd = huishouden.members("heeft_nederlandse_zorgverzekering", period)
        return huishouden.value_nth_person(0, verzekerd)


class zorgtoeslag_voorwaarde_inkomen(Variable):
    value_type = bool
    entity = Huishouden
    definition_period = MONTH
    label = "Zorgtoeslag: (combined) income at most 40,857 single / 51,142 with partner"

    def formula(huishouden, period, parameters):
        p = parameters(period).zorgtoeslag
        partner = huishouden("heeft_toeslagpartner", period)
        grens = where(partner, p.maximaal_toetsingsinkomen.partners, p.maximaal_toetsingsinkomen.alleenstaand)
        return huishouden("gezamenlijk_toetsingsinkomen", period.this_year) <= grens


class zorgtoeslag_voorwaarde_vermogen(Variable):
    value_type = bool
    entity = Huishouden
    definition_period = MONTH
    label = "Zorgtoeslag: assets at most 146,011 single / 184,633 with partner"

    def formula(huishouden, period, parameters):
        p = parameters(period).zorgtoeslag
        partner = huishouden("heeft_toeslagpartner", period)
        grens = where(partner, p.vermogensgrens.partners, p.vermogensgrens.alleenstaand)
        return huishouden("gezamenlijk_vermogen", period.this_year) <= grens


class zorgtoeslag_jaarbedrag(Variable):
    value_type = float
    entity = Huishouden
    definition_period = MONTH
    label = "Zorgtoeslag on a yearly basis: standaardpremie minus normpremie"
    unit = "currency-EUR"

    def formula(huishouden, period, parameters):
        p = parameters(period).zorgtoeslag
        partner = huishouden("heeft_toeslagpartner", period)
        inkomen = huishouden("gezamenlijk_toetsingsinkomen", period.this_year)
        pct_tot = where(partner, p.normpercentage.partners.tot_drempel, p.normpercentage.alleenstaand.tot_drempel)
        pct_boven = where(partner, p.normpercentage.partners.boven_drempel, p.normpercentage.alleenstaand.boven_drempel)
        normpremie = pct_tot * p.drempelinkomen + pct_boven * max_(0, inkomen - p.drempelinkomen)
        standaardpremie = where(partner, 2, 1) * p.standaardpremie
        bedrag = max_(0, standaardpremie - normpremie)
        verzekerd = huishouden.members("heeft_nederlandse_zorgverzekering", period)
        partner_onverzekerd = partner * not_(huishouden.value_nth_person(1, verzekerd, default=True))
        return where(partner_onverzekerd, p.factor_partner_niet_verzekerd, 1) * bedrag


class zorgtoeslag(Variable):
    value_type = float
    entity = Huishouden
    definition_period = MONTH
    label = "Zorgtoeslag per month"
    unit = "currency-EUR"
    reference = "https://www.belastingdienst.nl/wps/wcm/connect/nl/zorgtoeslag/content/kan-ik-zorgtoeslag-krijgen"

    def formula(huishouden, period, parameters):
        recht = (
            huishouden("zorgtoeslag_voorwaarde_leeftijd", period)
            * huishouden("zorgtoeslag_voorwaarde_verzekering", period)
            * huishouden("zorgtoeslag_voorwaarde_inkomen", period)
            * huishouden("zorgtoeslag_voorwaarde_vermogen", period)
        )
        minimum = parameters(period).algemeen.toeslagen_minimum_jaarbedrag
        return recht * toeslag_per_maand(huishouden("zorgtoeslag_jaarbedrag", period), minimum)

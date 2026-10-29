"""Kindgebonden budget (income-dependent child allowance), Wet op het kindgebonden budget."""

from openfisca_core.model_api import MONTH, Variable, max_, where

from openfisca_nl.entities import Huishouden
from openfisca_nl.helpers import toeslag_per_maand


class kindgebonden_budget_voorwaarde_kinderen(Variable):
    value_type = bool
    entity = Huishouden
    definition_period = MONTH
    label = "Kindgebonden budget: at least one child under 18 lives in the household"

    def formula(huishouden, period):
        leeftijd = huishouden.members("leeftijd", period)
        kind = huishouden.members.has_role(Huishouden.KIND)
        return huishouden.sum(kind * (leeftijd < 18)) > 0


class kindgebonden_budget_voorwaarde_vermogen(Variable):
    value_type = bool
    entity = Huishouden
    definition_period = MONTH
    label = "Kindgebonden budget: assets at most 146,011 single / 184,633 with partner"

    def formula(huishouden, period, parameters):
        grens = parameters(period).kindgebonden_budget.vermogensgrens
        partner = huishouden("heeft_toeslagpartner", period)
        limiet = where(partner, grens.partners, grens.alleenstaand)
        return huishouden("gezamenlijk_vermogen", period.this_year) <= limiet


class kindgebonden_budget_jaarbedrag(Variable):
    value_type = float
    entity = Huishouden
    definition_period = MONTH
    label = "Kindgebonden budget on a yearly basis, after the income reduction"
    unit = "currency-EUR"

    def formula(huishouden, period, parameters):
        p = parameters(period).kindgebonden_budget
        leeftijd = huishouden.members("leeftijd", period)
        kind = huishouden.members.has_role(Huishouden.KIND)
        per_kind = kind * (leeftijd < 18) * (
            p.bedrag_per_kind
            + ((leeftijd >= 12) * (leeftijd <= 15)) * p.verhoging_12_15
            + ((leeftijd >= 16) * (leeftijd <= 17)) * p.verhoging_16_17
        )
        partner = huishouden("heeft_toeslagpartner", period)
        maximum = huishouden.sum(per_kind) + where(partner, 0, p.alleenstaande_ouderkop)
        drempel = where(partner, p.drempelinkomen.partners, p.drempelinkomen.alleenstaand)
        inkomen = huishouden("gezamenlijk_toetsingsinkomen", period.this_year)
        vermindering = p.afbouwpercentage * max_(0, inkomen - drempel)
        return max_(0, maximum - vermindering)


class kindgebonden_budget(Variable):
    value_type = float
    entity = Huishouden
    definition_period = MONTH
    label = "Kindgebonden budget per month"
    unit = "currency-EUR"
    reference = "https://www.belastingdienst.nl/wps/wcm/connect/nl/kindgebonden-budget/content/kan-ik-kindgebonden-budget-krijgen"

    def formula(huishouden, period, parameters):
        recht = huishouden("kindgebonden_budget_voorwaarde_kinderen", period) * huishouden(
            "kindgebonden_budget_voorwaarde_vermogen", period
        )
        minimum = parameters(period).algemeen.toeslagen_minimum_jaarbedrag
        return recht * toeslag_per_maand(huishouden("kindgebonden_budget_jaarbedrag", period), minimum)

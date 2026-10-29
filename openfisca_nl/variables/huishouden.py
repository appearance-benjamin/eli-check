"""Derived household and income variables shared by all schemes."""

from openfisca_core.model_api import MONTH, YEAR, Variable

from openfisca_nl.entities import Huishouden, Persoon


class toetsingsinkomen(Variable):
    value_type = float
    entity = Persoon
    definition_period = YEAR
    label = "Toetsingsinkomen: taxable income used by the allowances (verzamelinkomen)"
    unit = "currency-EUR"
    reference = "https://www.belastingdienst.nl/wps/wcm/connect/nl/toeslagen/content/wat-is-toetsingsinkomen"

    def formula(persoon, period):
        # Student finance, allowances and child benefit are not taxable income.
        return persoon("inkomen_uit_arbeid", period) + persoon("overig_inkomen", period)


class is_aanvrager_of_partner(Variable):
    value_type = bool
    entity = Persoon
    definition_period = MONTH
    label = "Is the applicant or the toeslagpartner (not a child)"

    def formula(persoon, period):
        return persoon.has_role(Huishouden.PARTNER)


class heeft_toeslagpartner(Variable):
    value_type = bool
    entity = Huishouden
    definition_period = MONTH
    label = "Household has a toeslagpartner"

    def formula(huishouden, period):
        return huishouden.nb_persons(Huishouden.PARTNER) >= 2


class aantal_kinderen(Variable):
    value_type = int
    entity = Huishouden
    definition_period = MONTH
    label = "Number of children in the household"

    def formula(huishouden, period):
        return huishouden.nb_persons(Huishouden.KIND)


class gezamenlijk_toetsingsinkomen(Variable):
    value_type = float
    entity = Huishouden
    definition_period = YEAR
    label = "Combined toetsingsinkomen of applicant and toeslagpartner"
    unit = "currency-EUR"

    def formula(huishouden, period):
        return huishouden.sum(huishouden.members("toetsingsinkomen", period), role=Huishouden.PARTNER)


class gezamenlijk_vermogen(Variable):
    value_type = float
    entity = Huishouden
    definition_period = YEAR
    label = "Combined assets of applicant and toeslagpartner on 1 January"
    unit = "currency-EUR"

    def formula(huishouden, period):
        return huishouden.sum(huishouden.members("vermogen", period), role=Huishouden.PARTNER)


class oudste_partner_leeftijd(Variable):
    value_type = int
    entity = Huishouden
    definition_period = MONTH
    label = "Age of the oldest of applicant and toeslagpartner"

    def formula(huishouden, period):
        return huishouden.max(huishouden.members("leeftijd", period), role=Huishouden.PARTNER)


class jongste_partner_leeftijd(Variable):
    value_type = int
    entity = Huishouden
    definition_period = MONTH
    label = "Age of the youngest of applicant and toeslagpartner"

    def formula(huishouden, period):
        return huishouden.min(huishouden.members("leeftijd", period), role=Huishouden.PARTNER)

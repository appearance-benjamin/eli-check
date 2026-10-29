"""OpenFisca country package for the Netherlands (toeslagen, studiefinanciering,
tax credits) with Maastricht-specific local schemes."""

import os

from openfisca_core.taxbenefitsystems import TaxBenefitSystem

from openfisca_nl import entities

COUNTRY_DIR = os.path.dirname(os.path.abspath(__file__))


class CountryTaxBenefitSystem(TaxBenefitSystem):
    def __init__(self) -> None:
        super().__init__(entities.entities)
        self.add_variables_from_directory(os.path.join(COUNTRY_DIR, "variables"))
        self.load_parameters(os.path.join(COUNTRY_DIR, "parameters"))

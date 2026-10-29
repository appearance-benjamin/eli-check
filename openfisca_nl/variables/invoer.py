"""Input variables: what the questionnaire asks. Names follow Dutch legal terms."""

from openfisca_core.model_api import ETERNITY, MONTH, YEAR, Enum, Variable

from openfisca_nl.entities import Huishouden, Persoon
from openfisca_nl.enums import Nationaliteit, Onderwijs


# --- Persoon -----------------------------------------------------------------


class leeftijd(Variable):
    value_type = int
    entity = Persoon
    definition_period = MONTH
    label = "Age in years"


class onderwijs(Variable):
    value_type = Enum
    possible_values = Onderwijs
    default_value = Onderwijs.geen
    entity = Persoon
    definition_period = MONTH
    label = "Type of education followed"


class woont_bij_ouders(Variable):
    value_type = bool
    entity = Persoon
    definition_period = MONTH
    label = "Lives with parent(s) (thuiswonend)"


class nationaliteit(Variable):
    value_type = Enum
    possible_values = Nationaliteit
    default_value = Nationaliteit.nederlands
    entity = Persoon
    definition_period = ETERNITY
    label = "Nationality / residence status"


class jaren_in_nederland(Variable):
    value_type = int
    entity = Persoon
    definition_period = ETERNITY
    label = "Years of uninterrupted legal residence in the Netherlands"


class werkuren_per_maand(Variable):
    value_type = float
    entity = Persoon
    definition_period = MONTH
    label = "Hours of paid work in the Netherlands per month"


class inkomen_uit_arbeid(Variable):
    value_type = float
    entity = Persoon
    definition_period = YEAR
    label = "Gross income from work this calendar year (fiscaal loon)"
    unit = "currency-EUR"


class overig_inkomen(Variable):
    value_type = float
    entity = Persoon
    definition_period = YEAR
    label = "Other taxable income this year (benefits, alimony, freelance profit)"
    unit = "currency-EUR"


class vermogen(Variable):
    value_type = float
    entity = Persoon
    definition_period = YEAR
    label = "Savings and investments minus debts on 1 January (box 3 assets)"
    unit = "currency-EUR"


class heeft_nederlandse_zorgverzekering(Variable):
    value_type = bool
    default_value = True
    entity = Persoon
    definition_period = MONTH
    label = "Has a Dutch basic health insurance (basisverzekering)"


class inkomen_ouders(Variable):
    value_type = float
    entity = Persoon
    definition_period = YEAR
    label = "Parents' combined gross income in the reference year (peiljaar, t-2)"
    unit = "currency-EUR"


class broers_zussen_met_studiefinanciering(Variable):
    value_type = int
    entity = Persoon
    definition_period = MONTH
    label = "Number of siblings who also receive student finance"


class heeft_beperking(Variable):
    value_type = bool
    entity = Persoon
    definition_period = MONTH
    label = "Has a disability or chronic illness that limits study or work"


class maanden_gewerkt(Variable):
    value_type = int
    default_value = 12
    entity = Persoon
    definition_period = YEAR
    label = "Number of months in this year with income from work"


class ingehouden_loonheffing(Variable):
    value_type = float
    default_value = -1
    entity = Persoon
    definition_period = YEAR
    label = "Wage tax withheld by employers this year (from payslips / jaaropgaaf); -1 if unknown"
    unit = "currency-EUR"


# --- Huishouden --------------------------------------------------------------


class huur_per_maand(Variable):
    value_type = float
    entity = Huishouden
    definition_period = MONTH
    label = "Monthly bare rent (kale huur), excluding service costs and utilities"
    unit = "currency-EUR"


class zelfstandige_woonruimte(Variable):
    value_type = bool
    entity = Huishouden
    definition_period = MONTH
    label = "Self-contained home: own front door, kitchen and toilet"


class woont_in_maastricht(Variable):
    value_type = bool
    default_value = True
    entity = Huishouden
    definition_period = MONTH
    label = "Registered (BRP) in the municipality of Maastricht"

"""Income tax box 1 (below AOW age) and the tax refund estimate for side jobs."""

from openfisca_core.model_api import YEAR, Variable, max_, where

from openfisca_nl.entities import Persoon


def belasting_na_heffingskortingen(belasting, inkomen, arbeidsinkomen):
    """Box 1 tax minus algemene heffingskorting and arbeidskorting, floored at 0.

    Below AOW age, tax credits that exceed the tax due are not paid out
    (except to some non-working partners born before 1963, not modelled)."""
    box1 = belasting.box1.tarief.calc(inkomen)
    ahk = belasting.algemene_heffingskorting
    algemene_heffingskorting = max_(
        0, ahk.maximum - ahk.afbouwpercentage * max_(0, inkomen - ahk.afbouwgrens)
    )
    arbeidskorting = max_(0, belasting.arbeidskorting.calc(arbeidsinkomen))
    return max_(0, box1 - algemene_heffingskorting - arbeidskorting)


class inkomstenbelasting(Variable):
    value_type = float
    entity = Persoon
    definition_period = YEAR
    label = "Income tax and national insurance contributions due in box 1, after tax credits"
    unit = "currency-EUR"
    reference = "https://www.belastingdienst.nl/wps/wcm/connect/nl/inkomstenbelasting/content/inkomstenbelasting-tarieven"

    def formula(persoon, period, parameters):
        belasting = parameters(period).belasting
        return belasting_na_heffingskortingen(
            belasting,
            persoon("toetsingsinkomen", period),
            persoon("inkomen_uit_arbeid", period),
        )


class geschatte_ingehouden_loonheffing(Variable):
    value_type = float
    entity = Persoon
    definition_period = YEAR
    label = "Wage tax probably withheld: employers annualise each month's wage"
    unit = "currency-EUR"
    documentation = """
    Payroll tax tables treat every monthly wage as if it were earned all year.
    Someone who works 3 summer months at €2,000 is taxed as if they earn €24,000,
    while their real yearly income is €6,000 — the difference comes back via a tax return.
    """

    def formula(persoon, period, parameters):
        belasting = parameters(period).belasting
        maanden = persoon("maanden_gewerkt", period)
        loon = persoon("inkomen_uit_arbeid", period)
        maandloon = where(maanden > 0, loon / max_(maanden, 1), 0)
        jaarloon_herleid = maandloon * 12
        belasting_op_herleid_loon = belasting_na_heffingskortingen(
            belasting, jaarloon_herleid, jaarloon_herleid
        )
        return belasting_op_herleid_loon * maanden / 12


class belastingteruggave(Variable):
    value_type = float
    entity = Persoon
    definition_period = YEAR
    label = "Estimated income tax refund after filing a tax return (aangifte)"
    unit = "currency-EUR"
    reference = "https://www.belastingdienst.nl/wps/wcm/connect/nl/aangifte-inkomstenbelasting/content/geld-terugkrijgen"

    def formula(persoon, period):
        opgegeven = persoon("ingehouden_loonheffing", period)
        ingehouden = where(opgegeven >= 0, opgegeven, persoon("geschatte_ingehouden_loonheffing", period))
        return max_(0, ingehouden - persoon("inkomstenbelasting", period))


class netto_jaarinkomen(Variable):
    value_type = float
    entity = Persoon
    definition_period = YEAR
    label = "Net yearly income: taxable income minus income tax due"
    unit = "currency-EUR"

    def formula(persoon, period):
        return persoon("toetsingsinkomen", period) - persoon("inkomstenbelasting", period)

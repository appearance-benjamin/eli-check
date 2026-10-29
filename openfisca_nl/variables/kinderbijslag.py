"""Kinderbijslag (child benefit, SVB). Universal: not income- or asset-tested."""

from openfisca_core.model_api import MONTH, Variable

from openfisca_nl.entities import Huishouden


class kinderbijslag(Variable):
    value_type = float
    entity = Huishouden
    definition_period = MONTH
    label = "Kinderbijslag per month (paid per quarter by the SVB)"
    unit = "currency-EUR"
    reference = "https://www.svb.nl/nl/kinderbijslag"

    def formula(huishouden, period, parameters):
        schaal = parameters(period).kinderbijslag.bedrag_per_kwartaal
        leeftijden = huishouden.members("leeftijd", period)
        per_kind = schaal.calc(leeftijden) * huishouden.members.has_role(Huishouden.KIND)
        return huishouden.sum(per_kind) / 3

"""Entities.

A ``persoon`` is one individual. A ``huishouden`` is the toeslagen household: the
applicant (aanvrager) and an optional toeslagpartner share the role ``partner``;
children living at home have the role ``kind``.
"""

from openfisca_core.entities import build_entity

Huishouden = build_entity(
    key="huishouden",
    plural="huishoudens",
    label="Huishouden",
    doc="Aanvrager, toeslagpartner en inwonende kinderen.",
    roles=[
        {
            "key": "partner",
            "plural": "partners",
            "label": "Aanvrager of toeslagpartner",
            "max": 2,
            "doc": "The first listed partner is the applicant (aanvrager).",
        },
        {
            "key": "kind",
            "plural": "kinderen",
            "label": "Kind",
            "doc": "Children living in the household.",
        },
    ],
)

Persoon = build_entity(
    key="persoon",
    plural="personen",
    label="Persoon",
    doc="An individual.",
    is_person=True,
)

entities = [Huishouden, Persoon]

"""Enumerations shared by input and formula variables."""

from openfisca_core.model_api import Enum


class Onderwijs(Enum):
    geen = "Not in education"
    vo = "Secondary school (voortgezet onderwijs)"
    mbo_bol = "MBO, full-time (bol)"
    mbo_bbl = "MBO, work-based (bbl)"
    hbo = "HBO (university of applied sciences, e.g. Zuyd)"
    wo = "WO (research university, e.g. Maastricht University)"


class Nationaliteit(Enum):
    nederlands = "Dutch"
    eer = "EU / EEA / Swiss"
    niet_eer_gelijkgesteld = "Non-EU with a residence permit that counts as Dutch for student finance"
    niet_eer_overig = "Non-EU, other (e.g. study residence permit)"

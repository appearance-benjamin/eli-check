"""Huurtoeslag (rent allowance), Wet op de huurtoeslag — simplified system from 1 January 2026.

Not modelled: other adult co-residents (medebewoners) besides partner and children,
care-group housing and pre-1997 student rooms that are exceptions to the self-contained rule.
"""

import numpy

from openfisca_core.model_api import MONTH, Variable, max_, min_, not_, where

from openfisca_nl.entities import Huishouden


class huurtoeslag_voorwaarde_leeftijd(Variable):
    value_type = bool
    entity = Huishouden
    definition_period = MONTH
    label = "Huurtoeslag: tenant is 18 or older"

    def formula(huishouden, period, parameters):
        minimum = parameters(period).huurtoeslag.minimumleeftijd
        return huishouden.value_nth_person(0, huishouden.members("leeftijd", period)) >= minimum


class huurtoeslag_voorwaarde_woonruimte(Variable):
    value_type = bool
    entity = Huishouden
    definition_period = MONTH
    label = "Huurtoeslag: self-contained home (own front door, kitchen, toilet and shower)"

    def formula(huishouden, period):
        return huishouden("zelfstandige_woonruimte", period)


class huurtoeslag_voorwaarde_huur(Variable):
    value_type = bool
    entity = Huishouden
    definition_period = MONTH
    label = "Huurtoeslag: rent is above the basishuur the household pays itself"

    def formula(huishouden, period):
        return huishouden("huur_per_maand", period) > huishouden("huurtoeslag_basishuur", period)


class huurtoeslag_voorwaarde_vermogen(Variable):
    value_type = bool
    entity = Huishouden
    definition_period = MONTH
    label = "Huurtoeslag: assets at most 38,479 single / 76,958 with partner"

    def formula(huishouden, period, parameters):
        grens = parameters(period).huurtoeslag.vermogensgrens
        partner = huishouden("heeft_toeslagpartner", period)
        limiet = where(partner, grens.partners, grens.alleenstaand)
        return huishouden("gezamenlijk_vermogen", period.this_year) <= limiet


class huurtoeslag_huishoudgrootte(Variable):
    value_type = int
    entity = Huishouden
    definition_period = MONTH
    label = "Number of people living in the home (tenant, partner, children)"

    def formula(huishouden, period):
        return huishouden.nb_persons()


class huurtoeslag_huurgrens(Variable):
    value_type = float
    entity = Huishouden
    definition_period = MONTH
    label = "Rent cap: lower when everyone is under 21, without children or disability"
    unit = "currency-EUR"

    def formula(huishouden, period, parameters):
        p = parameters(period).huurtoeslag
        iedereen_jong = huishouden("oudste_partner_leeftijd", period) < p.jongerenleeftijd
        geen_kinderen = huishouden("aantal_kinderen", period) == 0
        geen_beperking = not_(huishouden.any(huishouden.members("heeft_beperking", period)))
        jongeren = iedereen_jong * geen_kinderen * geen_beperking
        return where(jongeren, p.huurgrens.jongeren, p.huurgrens.standaard)


class huurtoeslag_basishuur(Variable):
    value_type = float
    entity = Huishouden
    definition_period = MONTH
    label = "Basishuur: fixed part of the rent the household pays itself"
    unit = "currency-EUR"

    def formula(huishouden, period, parameters):
        p = parameters(period).huurtoeslag
        alleen = huishouden("huurtoeslag_huishoudgrootte", period) == 1
        return where(alleen, p.basishuur.eenpersoons, p.basishuur.meerpersoons)


class huurtoeslag_rekeninkomen(Variable):
    value_type = float
    entity = Huishouden
    definition_period = MONTH
    label = "Combined yearly income of tenant, partner and children (children: only above the exemption)"
    unit = "currency-EUR"

    def formula(huishouden, period, parameters):
        vrijstelling = parameters(period).huurtoeslag.vrijstelling_inkomen_kind
        inkomen = huishouden.members("toetsingsinkomen", period.this_year)
        kind = huishouden.members.has_role(Huishouden.KIND)
        jong = huishouden.members("leeftijd", period) < 23
        telt = where(kind * jong, max_(0, inkomen - vrijstelling), inkomen)
        return max_(0, huishouden.sum(telt))


class huurtoeslag_ongeafrond(Variable):
    value_type = float
    entity = Huishouden
    definition_period = MONTH
    label = "Huurtoeslag per month before rounding and eligibility (parts A + B + C - income correction)"
    unit = "currency-EUR"

    def formula(huishouden, period, parameters):
        p = parameters(period).huurtoeslag
        personen = huishouden("huurtoeslag_huishoudgrootte", period)
        alleen = personen == 1
        rekenhuur = min_(huishouden("huur_per_maand", period), huishouden("huurtoeslag_huurgrens", period))
        basishuur = huishouden("huurtoeslag_basishuur", period)
        kkg = p.kwaliteitskortingsgrens
        aftop = where(personen >= 3, p.aftoppingsgrens.drie_of_meer_personen, p.aftoppingsgrens.een_twee_personen)

        deel_a = p.percentage.tot_kwaliteitskortingsgrens * max_(0, min_(rekenhuur, kkg) - basishuur)
        deel_b = p.percentage.tot_aftoppingsgrens * max_(0, min_(rekenhuur, aftop) - kkg)
        deel_c = p.percentage.tot_huurgrens * max_(0, rekenhuur - aftop)

        ijkpunt = where(alleen, p.inkomensijkpunt.eenpersoons, p.inkomensijkpunt.meerpersoons)
        afbouw = where(alleen, p.afbouwpercentage.eenpersoons, p.afbouwpercentage.meerpersoons)
        correctie = max_(0, huishouden("huurtoeslag_rekeninkomen", period) - ijkpunt) * afbouw / 12

        return max_(0, deel_a + deel_b + deel_c - correctie)


class huurtoeslag(Variable):
    value_type = float
    entity = Huishouden
    definition_period = MONTH
    label = "Huurtoeslag per month"
    unit = "currency-EUR"
    reference = "https://www.belastingdienst.nl/wps/wcm/connect/nl/huurtoeslag/content/kan-ik-huurtoeslag-krijgen"

    def formula(huishouden, period, parameters):
        recht = (
            huishouden("huurtoeslag_voorwaarde_leeftijd", period)
            * huishouden("huurtoeslag_voorwaarde_woonruimte", period)
            * huishouden("huurtoeslag_voorwaarde_huur", period)
            * huishouden("huurtoeslag_voorwaarde_vermogen", period)
        )
        maand = numpy.floor(huishouden("huurtoeslag_ongeafrond", period) + 1e-9)
        minimum = parameters(period).algemeen.toeslagen_minimum_jaarbedrag
        return recht * where(maand * 12 >= minimum, maand, 0)

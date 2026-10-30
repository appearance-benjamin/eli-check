"""Helpers shared by formulas."""

import numpy

from openfisca_core.model_api import where


def hele_euros_omlaag(bedrag):
    """Round an amount down to whole euros.

    OpenFisca keeps amounts as float32, so a result of exactly 55.00 can arrive as 54.99998.
    A hundredth of a cent absorbs that noise (about 0.00003 here) without lifting genuine amounts."""
    return numpy.floor(bedrag + 0.0001)


def toeslag_per_maand(jaarbedrag, minimum_jaarbedrag):
    """Monthly advance of an allowance (Awir art. 14).

    The yearly amount is rounded to whole euros; below the minimum nothing is paid.
    The monthly advance is rounded down to whole euros."""
    return where(numpy.round(jaarbedrag) >= minimum_jaarbedrag, hele_euros_omlaag(jaarbedrag / 12), 0)

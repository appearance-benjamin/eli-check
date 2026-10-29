"""Helpers shared by formulas."""

import numpy

from openfisca_core.model_api import where


def toeslag_per_maand(jaarbedrag, minimum_jaarbedrag):
    """Monthly advance of an allowance (Awir art. 14).

    The yearly amount is rounded to whole euros; below the minimum nothing is paid.
    The monthly advance is rounded down to whole euros."""
    return where(numpy.round(jaarbedrag) >= minimum_jaarbedrag, numpy.floor(jaarbedrag / 12 + 1e-9), 0)

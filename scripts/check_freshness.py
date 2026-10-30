"""Freshness check: are the rules still current and do the official links still work?

    python scripts/check_freshness.py [--today 2027-01-15] [--report report.md] [--no-links]

1. Overdue amounts. Dutch amounts are re-set on fixed dates (1 January, bijstand and
   kinderbijslag also 1 July, lesgeld 1 August, collegegeld 1 September). A parameter is
   expected to get a value for this year:
   - on 1 January, if it is an amount in euros;
   - on any other day of the year (MM-DD) where it got a value in two or more years.
   Re-confirm an unchanged amount by adding it again with the new date.
2. Broken links: every reference in the parameters and every URL in web/js.

Exit code 1 when something is overdue or a link is broken, 2 when amounts are due within
45 days, 0 when all is current. The scheduled workflow keeps one GitHub issue up to date.
"""

import argparse
import datetime as dt
import re
import sys
import urllib.error
import urllib.request
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent
PARAMETERS = ROOT / "openfisca_nl" / "parameters"
WEB_JS = ROOT / "web" / "js"
UPCOMING_DAYS = 45

# Sites that answer automated requests with these codes are up, they just block bots.
BLOCKED = {401, 403, 405, 429, 503}


def as_date(key):
    return key if isinstance(key, dt.date) else dt.date.fromisoformat(str(key))


def series(node):
    """Dates of a {date: {value: ...}} mapping; none for a value that is always 0 (a fixed floor)."""
    if not isinstance(node, dict):
        return []
    values = [v.get("value") if isinstance(v, dict) else v for v in node.values()]
    if all(v == 0 for v in values):
        return []
    return [as_date(k) for k in node]


def walk(node, path, unit=None):
    """Yield (path, unit, dates) for every parameter and scale bracket, and collect references."""
    if not isinstance(node, dict):
        return
    meta = node.get("metadata") or {}
    unit = meta.get("unit") or meta.get("amount_unit") or unit
    for ref in meta.get("reference") or []:
        if isinstance(ref, dict) and ref.get("href"):
            REFERENCES.add(ref["href"])
    if "values" in node:
        yield path, unit, series(node["values"])
        return
    if "brackets" in node:
        for i, bracket in enumerate(node["brackets"]):
            for part in ("amount", "rate", "threshold"):
                # The first bracket starts at 0 by definition.
                if part in bracket and not (part == "threshold" and i == 0):
                    part_unit = unit if part == "amount" else meta.get(f"{part}_unit")
                    yield f"{path}[{i}].{part}", part_unit, series(bracket[part])
        return
    for key, child in node.items():
        if key not in ("description", "metadata", "documentation"):
            yield from walk(child, f"{path}.{key}" if path else key, unit)


REFERENCES = set()


def parameters():
    for file in sorted(PARAMETERS.rglob("*.yaml")):
        rel = file.relative_to(PARAMETERS).with_suffix("")
        prefix = "" if rel.name == "index" else ".".join(rel.parts)
        yield from walk(yaml.safe_load(file.read_text(encoding="utf-8")), prefix)


def expected_dates(unit, dates, year):
    """Days of `year` on which this parameter should get a new value.

    Amounts in euros are re-set every 1 January and on every other day of the year they
    changed on in their latest year (1 July for bijstand). Anything else only on days it
    changed on in two or more years."""
    by_day = defaultdict(set)
    for d in dates:
        by_day[(d.month, d.day)].add(d.year)
    days = {md for md, years in by_day.items() if len(years) >= 2}
    if unit == "currency-EUR":
        latest = max(d.year for d in dates)
        days |= {(d.month, d.day) for d in dates if d.year == latest} | {(1, 1)}
    return sorted(dt.date(year, m, d) for m, d in days)


def check_rules(today):
    overdue, upcoming = [], []
    for path, unit, dates in parameters():
        if not dates:
            continue
        for year in (today.year, today.year + 1):
            for due in expected_dates(unit, dates, year):
                has_value = any(due <= d < dt.date(year + 1, 1, 1) for d in dates)
                if has_value:
                    continue
                if due <= today:
                    overdue.append((path, due, max(dates)))
                elif (due - today).days <= UPCOMING_DAYS:
                    upcoming.append((path, due, max(dates)))
    return overdue, upcoming


def web_urls():
    urls = set()
    for file in WEB_JS.glob("*.js"):
        text = file.read_text(encoding="utf-8")
        consts = dict(re.findall(r'const (\w+) = "(https://[^"]+)"', text))
        for url in re.findall(r"https://[^\s\"'`<>)]+", text):
            urls.add(url)
        for name, base in consts.items():
            urls.discard(base)  # only a prefix for the links below
            for rest in re.findall(r"\$\{" + name + r"\}([^`\s]*)`", text):
                urls.add(base + rest)
    return {u.rstrip(".,;") for u in urls if "${" not in u}


def fetch(url):
    request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Eli Check freshness check)"})
    for attempt in range(2):
        try:
            with urllib.request.urlopen(request, timeout=25) as response:
                return url, response.status
        except urllib.error.HTTPError as e:
            status = e.code
        except Exception as e:  # DNS, TLS, timeout
            status = f"{type(e).__name__}"
        if attempt == 0 and not (isinstance(status, int) and status in (404, 410)):
            continue
    return url, status


def check_links():
    urls = sorted(web_urls() | REFERENCES)
    with ThreadPoolExecutor(max_workers=8) as pool:
        results = list(pool.map(fetch, urls))
    broken = [(u, s) for u, s in results if not (isinstance(s, int) and (s < 400 or s in BLOCKED))]
    blocked = [(u, s) for u, s in results if isinstance(s, int) and s in BLOCKED]
    return len(urls), broken, blocked


def report(today, overdue, upcoming, links):
    lines = [f"Checked on {today.isoformat()}.", ""]
    if overdue:
        lines += [f"### Overdue amounts ({len(overdue)})", "", "| parameter | expected from | latest value |", "|---|---|---|"]
        lines += [f"| `{p}` | {due} | {last} |" for p, due, last in overdue]
        lines += ["", "Add the new official value (or the unchanged one) with this date, and update the tests.", ""]
    else:
        lines += ["No overdue amounts.", ""]
    if upcoming:
        lines += [f"### Due within {UPCOMING_DAYS} days ({len(upcoming)})", ""]
        lines += [f"- `{p}` from {due}" for p, due, _ in upcoming]
        lines += [""]
    if links is not None:
        total, broken, blocked = links
        if broken:
            lines += [f"### Broken links ({len(broken)} of {total})", ""]
            lines += [f"- {u} — {s}" for u, s in broken]
            lines += [""]
        else:
            lines += [f"All {total} links work."]
        if blocked:
            lines += ["", f"<details><summary>{len(blocked)} sites block automated checks (check by hand now and then)</summary>", ""]
            lines += [f"- {u} — {s}" for u, s in blocked]
            lines += ["", "</details>"]
    return "\n".join(lines) + "\n"


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--today", type=dt.date.fromisoformat, default=dt.date.today())
    parser.add_argument("--report", type=Path)
    parser.add_argument("--no-links", action="store_true")
    args = parser.parse_args()

    overdue, upcoming = check_rules(args.today)
    links = None if args.no_links else check_links()
    text = report(args.today, overdue, upcoming, links)
    sys.stdout.write(text)
    if args.report:
        args.report.write_text(text, encoding="utf-8")
    if overdue or (links and links[1]):
        return 1
    return 2 if upcoming else 0


if __name__ == "__main__":
    sys.exit(main())
